'use strict';

import fs from 'fs';
import path from 'path';
import * as Immutable from 'immutable';

function readVideoFilesInt(dir, suffixes, excludeDirs, array) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const
            filePath = path.join(dir, file),
            stat = fs.statSync(filePath);

        if (stat.isDirectory() && !excludeDirs.includes(file)) {
            readVideoFilesInt(filePath, suffixes, excludeDirs, array);
        }
        if (stat.isFile() && suffixes.includes(path.extname(file))) {
            array.push(filePath);
        }
    });
}

function readVideoFiles(dirPath, suffixes, excludeDirs) {
    const files = [];
    readVideoFilesInt(dirPath, suffixes, excludeDirs, files);
    return Immutable.List(files);
}

/**
 * Find all video files in each input directory.
 * For each directory it will create a map with list of paths to found video files, error flags and name of directory.
 *
 * @param directories - directories to search through
 * @param videoSuffixes - list of file suffixes for video files
 * @param excludeDirs - set of directory names to exclude (any dir name will be tested against it, including an input dir)
 * @returns {List<any>|List<T>|*} a list of maps
 */
export function findVideoFiles(directories, videoSuffixes, excludeDirs) {
    let data = Immutable.List();

    const suffixes = videoSuffixes.map(suf => `.${suf}`).toArray();

    directories.forEach(dir => {

        //check if directory exists
        if (!fs.existsSync(dir)) {
            data = data.push(Immutable.fromJS({dir, files: [], dirNotFound: true}));
            return;
        }

        //check if directory is readable
        try {
            fs.accessSync(dir, fs.constants.R_OK);
        }
        catch(err) {
            data = data.push(Immutable.fromJS({dir, files: [], dirNotReadable: true}));
            return;
        }

        //input dir is in the exclude dirs - ignore it
        if (excludeDirs.includes(path.basename(dir))) {
            return;
        }

        const files = readVideoFiles(dir, suffixes, excludeDirs);
        data = data.push(Immutable.fromJS({dir, files}));

    });

    return data;
}

/**
 * Reads non empty lines from a text file, trim them and return them in an array.
 */
export function readFileLines(filename) {
    return fs.readFileSync(filename, 'utf-8')
        .split('\n')
        .filter(Boolean)
        .map(l => l.trim());
}
