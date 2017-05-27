'use strict';

const fs = require('fs');
const path = require('path');
const Immutable = require('immutable');

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

function readVideoFiles(path, suffixes, excludeDirs) {
    const files = [];
    readVideoFilesInt(path, suffixes, excludeDirs, files);
    return Immutable.List(files);
}

function findVideoFiles(directories, videoSuffixes, excludeDirs) {
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
            data = data.push(Immutable.fromJS({dir, files: [], dirNotReadable: true}))
            return;
        }

        const files = readVideoFiles(dir, suffixes, excludeDirs);
        data = data.push(Immutable.fromJS({dir, files}));

    });

    return data;
}

function readFileLines(filename) {
    return fs.readFileSync(filename, 'utf-8')
        .split('\n')
        .filter(Boolean)
        .map(l => l.trim());
}

exports.findVideoFiles = findVideoFiles;
exports.readFileLines = readFileLines;
