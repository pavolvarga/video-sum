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

export function createOutput(calcResult, terseOutput, printUnprocessedFiles) {

    const
        dir = calcResult.get('dir'),
        time = calcResult.get('time'),
        files = calcResult.get('files'),
        unprocessedFiles = calcResult.get('unprocessedFiles'),
        dirNotFound = calcResult.get('dirNotFound'),
        dirNotReadable = calcResult.get('dirNotReadable');

    if (dirNotFound) {
        return `${dir}: Directory was not found`;
    }
    else if (dirNotReadable) {
        return `${dir}: Directory is not readable`;
    }
    else if (terseOutput) {
        return `${dir}: ${formatTime(time)}`;
    }
    else if (printUnprocessedFiles) {
        return `${dir}\n \t- files count: ${files.size}\n \t- error files (${unprocessedFiles.size}):\n ${listErrFiles(unprocessedFiles)} \t- total time: ${formatTime(time)}`;
    }

    return `${dir}\n \t- files count: ${files.size}\n \t- error files count: ${unprocessedFiles.size}\n \t- total time: ${formatTime(time)}`;
}

export function createTotalOutput(total, terseOutput, printUnprocessedFiles) {

    const
        time = total.get('time'),
        filesCount = total.get('filesCount'),
        unprocessedFiles = total.get('unprocessedFiles');

    if (terseOutput) {
        return `${colors.blue('Total')}: ${formatTime(time)}`;
    }
    else if (printUnprocessedFiles) {
        return `${colors.blue('Total')}\n \t- files count: ${filesCount}\n \t- error files (${unprocessedFiles.size}):\n ${listErrFiles(unprocessedFiles)} \t- total time: ${formatTime(time)}`;
    }

    return `${colors.blue('Total')}\n \t- files count: ${filesCount}\n \t- error files count: ${unprocessedFiles.size}\n \t- total time: ${formatTime(time)}`;
}

export function createExecOutput(execTime) {

    const
        //get time in milliseconds
        time = execTime[0] * 1000 + execTime[1] / 1000000,
        formatted = moment.duration(time, 'milliseconds').format(EXEC_TIME_FORMAT);

    return (colors.yellow(`Execution time: ${formatted}`));
}

export function print(results, total, printExec, exec) {

    results.forEach(val => console.log(val.get('output')));

    if(results.length > 1) {
        console.log(total.get('output'));
    }

    if(printExec) {
        console.log(exec);
    }
}
