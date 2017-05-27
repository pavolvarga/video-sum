'use strict';

const ceSync = require('command-exists').sync;
const colors = require('colors/safe');
const fs = require('fs');

function createMsgMissingProcess(name) {
    return `${colors.red(name)} was not found, it must be installed and on the PATH for ${colors.blue('video-sum')} to work`;
}

function createMsgFileDoesNotExists(name) {
    return `Input file: '${colors.red(name)}' does not exists. Provide path to an existing file for ${colors.blue('video-sum')} to work.`;
}

function createMsgFileNotReadable(name) {
    return `Input file: '${colors.red(name)}' is not readable. Provide path to a readable file for ${colors.blue('video-sum')} to work.`;
}

function checkProcesses() {
    if (!ceSync('ffmpeg')) {
        console.error(createMsgMissingProcess('ffmpeg'));
        process.exit(1);
    }
    if (!ceSync('ffprobe')) {
        console.error(createMsgMissingProcess('ffprobe'));
        process.exit(1);
    }
}

function checkInputFileExists(file) {
    if (!fs.existsSync(file)) {
        console.error(createMsgFileDoesNotExists(file));
        process.exit(1);
    }
}

function checkInputFileReadable(file) {
    try {
        fs.accessSync(file, fs.constants.R_OK);
    }
    catch(err) {
        console.error(createMsgFileNotReadable(file));
        process.exit(1);
    }
}

function checkPrerequisites(cmdOptions) {
    checkProcesses();
    checkInputFileExists(cmdOptions.list);
    checkInputFileReadable(cmdOptions.list);
}

exports.checkPrerequisites = checkPrerequisites;
