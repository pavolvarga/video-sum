'use strict';

import * as Immutable from 'immutable';
import cla from 'command-line-args';

import {readFileLines} from './reader';
import {DEFAULT_SUFFIXES, DEFAULT_PROCESS_COUNT, CMD_LINE_OPTION_DEFINITIONS} from './constants';
import {checkPrerequisites} from './checks';

function processDirs({dir, list}) {
    const
        dirs = dir ? Immutable.Set(dir) : Immutable.Set(),
        listed = list ? Immutable.Set(readFileLines(list)) : Immutable.Set();

    return dirs.union(listed);
}

function processVideo(defaultVideo, {addVid, removeVid, setVid}) {
    const
        addVideo = addVid ? Immutable.Set(addVid) : Immutable.Set(),
        removeVideo = removeVid ? Immutable.Set(removeVid) : Immutable.Set(),
        setVideo = setVid ? Immutable.Set(setVid) : Immutable.Set();

    if (!setVideo.isEmpty()) {
        return setVideo;
    }

    return defaultVideo
        .union(addVideo)
        .subtract(removeVideo);
}

export function parseCmd(argv) {

    try {

        const options = cla(CMD_LINE_OPTION_DEFINITIONS, argv);

        checkPrerequisites(options);

        const
            help = !!options.help,
            dirs = processDirs(options),
            vidOptions = {addVid: options['add-video'], removeVid: options['remove-video'], setVid: options['set-video']},
            videoSuffixes = processVideo(DEFAULT_SUFFIXES, vidOptions),
            excludeDirs = options['exclude-dirs'] ? Immutable.Set(options['exclude-dirs']) : Immutable.Set(),
            printUnprocessedFiles = !!options['print-unprocessed-files'],
            terseOutput = !!options['terse-output'],
            processCount = options['process-count'] ? options['process-count'] : DEFAULT_PROCESS_COUNT,
            logErrors = !!options['log-errors'],
            printExecutionTime = !!options['print-execution-time'];

        return Immutable.fromJS({help, directories: dirs, videoSuffixes, excludeDirs,
            printUnprocessedFiles, terseOutput, processCount, logErrors, printExecutionTime});
    }
    catch (err) {

        if (err.name === 'UNKNOWN_OPTION') {
            return Immutable.fromJS({error: err.message});
        }

        throw err;
    }
}
