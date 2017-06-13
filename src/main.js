'use strict';

require('babel-polyfill');

import ffmpeg from 'fluent-ffmpeg';
import Promise from 'bluebird';
import * as Immutable from 'immutable';
import getUsage from 'command-line-usage';
import cla from 'command-line-args';

import {parseCmd} from './cmdline.js';
import {findVideoFiles} from './reader.js';
import {formatDataFac} from './output';
import {ReadVideoFileError} from './errors';
import {sections} from './usage';
import {CMD_LINE_OPTION_DEFINITIONS} from './constants';
import {checkPrerequisites} from './checks';

function readDuration(file, parsedCmd) {
    return new Promise(
        (resolve, reject) => {
            ffmpeg.ffprobe(file, (err, data) => {
                if (err) {
                    reject(new ReadVideoFileError(file));
                }
                else {
                    resolve(data.format.duration);
                }
            });
        }
    ).then((duration) => {
        return duration;
    }).catch((error) => {
        if (error instanceof ReadVideoFileError) {
            if (parsedCmd.get('logErrors')) {
                console.error(error);
            }
            return error.videoFilePath;
        }
        throw error;
    });
}

function getTotalTimePromise(files, processCount, parsedCmd) {
    return Promise.map(
        files,
        (file) => readDuration(file, parsedCmd),
        {concurrency: processCount}
    )
    .then(results => {
        return results.reduce((acc, result) => {
            if (typeof  result === 'number') {
                return acc.update('time', old => old + result);
            }
            return acc.update('unprocessedFiles', old => old.push(result));
        }, Immutable.fromJS({time: 0, unprocessedFiles: []}));
    })
    .catch((err) => {
        throw err;
    });
}

function getAllTotalTimesPromise(videoFiles, parsedCmd) {

    const promises = videoFiles.map((val) => {
        return getTotalTimePromise(val.get('files'), val.get('processCount'), parsedCmd)
            .then((result) => {
                return val
                    .set('time', result.get('time'))
                    .set('unprocessedFiles', result.get('unprocessedFiles'));
            })
            .catch((err) => {
                throw err;
            });
    });

    return Promise
        .all(promises)
        .then((values) => values)
        .catch((err) => {
            throw err;
        });
}

function calcProcessCountForDir(videoFiles, processCount) {

    //just one directory - use all processes
    if (videoFiles.size === 1) {
        return videoFiles.update(0, old => old.set('processCount', processCount));
    }

    //if input is more directories than processCount, then for each dir run single ffprobe process
    if (videoFiles.size > processCount) {
        return videoFiles.map(vf => vf.set('processCount', 1));
    }

    //otherwise distribute processCount for each dir based on dir's files count
    const
        filesCount = videoFiles.reduce((sum, curr) => sum + curr.get('files').size, 0),
        ratio = filesCount > processCount ? processCount / filesCount : filesCount / processCount;

    return videoFiles.map(vf => vf.set('processCount', Math.ceil(vf.get('files').size * ratio)));
}

function main() {

    const cmdOptions = cla(CMD_LINE_OPTION_DEFINITIONS);

    checkPrerequisites(cmdOptions);

    const parsedCmd = parseCmd(cmdOptions);

    //no cmd options or the help option
    if (process.argv.slice(2).length === 0 || parsedCmd.get('help')) {
        console.log(getUsage(sections));
        process.exit();
    }

    const
        videoFiles = findVideoFiles(parsedCmd.get('directories'), parsedCmd.get('videoSuffixes'), parsedCmd.get('excludeDirs')),
        videoFilesCalc = calcProcessCountForDir(videoFiles, parsedCmd.get('processCount')),
        totalPromise = getAllTotalTimesPromise(videoFilesCalc, parsedCmd),
        terseOutput = parsedCmd.get('terseOutput'),
        printUnprocessedFiles = parsedCmd.get('printUnprocessedFiles');

    (async () => {
        const result = await totalPromise;

        let
            sumTime = 0,
            filesCount = 0,
            unprocessedFilesTotal = [];

        result.forEach(val => {
            const
                {dir, time, files, unprocessedFiles, dirNotFound, dirNotReadable} = val.toJS(),
                formatData = formatDataFac(terseOutput, printUnprocessedFiles, dirNotFound, dirNotReadable);

            console.log(formatData(dir, time, files.length, unprocessedFiles));

            sumTime += time;
            filesCount += files.length;
            unprocessedFilesTotal = unprocessedFilesTotal.concat(unprocessedFiles);
        });

        const formatDataResult = formatDataFac(terseOutput, printUnprocessedFiles);
        console.log(formatDataResult('Total', sumTime, filesCount, unprocessedFilesTotal));
    })();
}

main();
