'use strict';

const moment = require('moment');
const colors = require('colors/safe');
require("moment-duration-format");

const {TIME_FORMAT} = require('./constants');

function formatTime(time) {
    return colors.red(moment.duration(time, 'seconds').format(TIME_FORMAT, {trim: false}));
}

function listErrFiles(errFiles) {
    return errFiles.reduce((acc, file) => {
        acc += `\t\t- ${file}\n`;
        return acc;
    }, "");
}

function formatDataFac(terseOutput, printUnprocessedFiles, dirNotFound, dirNotReadable) {
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
    return `${colors.blue(header)}\n \t- files count: ${filesCount}\n \t- errorFiles count: ${errorFiles.length}\n ${listErrFiles(errorFiles)} \t- total time: ${formatTime(time)}\n`;
}

exports.formatDataFac = formatDataFac;
