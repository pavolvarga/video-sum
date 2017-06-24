'use strict';

import moment from 'moment';
import colors from 'colors/safe';
require('moment-duration-format');

import {VIDEO_TIME_FORMAT, EXEC_TIME_FORMAT} from './constants';

function formatTime(time) {
    return colors.red(moment.duration(time, 'seconds').format(VIDEO_TIME_FORMAT, {trim: false}));
}

function listErrFiles(errFiles) {
    return errFiles.reduce((acc, file) => acc + `\t\t- ${file}\n`, '');
}

function formatDirNotFound(header) {
    return `${header}: Directory was not found`;
}

function formatDirNotReadable(header) {
    return `${header}: Directory is not readable`;
}

function formatDataTerse(header, time) {
    return `${header}: ${formatTime(time)}`;
}

function formatDataNormal(header, time, filesCount, errorFiles) {
    return `${colors.blue(header)}\n \t- files count: ${filesCount}\n \t- errorFiles count: ${errorFiles.length}\n \t- total time: ${formatTime(time)}\n`;
}

function formatDataUnprocessedFiles(header, time, filesCount, errorFiles) {
    return `${colors.blue(header)}\n \t- files count: ${filesCount}\n \t- errorFiles (${errorFiles.length}):\n ${listErrFiles(errorFiles)} \t- total time: ${formatTime(time)}\n`;
}

export function formatDataFac(terseOutput, printUnprocessedFiles, dirNotFound, dirNotReadable) {
    if (dirNotFound) {
        return formatDirNotFound;
    }
    if (dirNotReadable) {
        return formatDirNotReadable;
    }
    if (terseOutput) {
        return formatDataTerse;
    }
    if (printUnprocessedFiles) {
        return formatDataUnprocessedFiles;
    }
    return formatDataNormal;
}

/**
 * If the `print` is true, it prints execution time to stdout.
 * The `execStart` is process.hrtime when app started.
 */
export function printExecutionTime(print, execStart) {

    if (!print) {
        return;
    }

    const
        execEnd = process.hrtime(execStart),
        //get time in milliseconds
        time = execEnd[0] * 1000 + execEnd[1] / 1000000,
        formatted = moment.duration(time, 'milliseconds').format(EXEC_TIME_FORMAT);

    console.log(colors.yellow(`Execution time: ${formatted}`));
}
