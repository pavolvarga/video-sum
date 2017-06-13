'use strict';

import {sync as ceSync} from 'command-exists';
import colors from 'colors/safe';
import fs from 'fs';

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

export function checkPrerequisites(cmdOptions) {
    checkProcesses();
    if (cmdOptions.list) {
        checkInputFileExists(cmdOptions.list);
        checkInputFileReadable(cmdOptions.list);
    }
}
