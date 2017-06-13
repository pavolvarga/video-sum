'use strict';

import * as Immutable from 'immutable';

import {readFileLines} from './reader';
import {DEFAULT_SUFFIXES, DEFAULT_PROCESS_COUNT} from './constants';

function processDirs({dir, list}) {
    const
        dirs = dir ? Immutable.Set(dir) : Immutable.Set(),
        listed = list ? Immutable.Set(readFileLines(list)) : Immutable.Set();

    return dirs.union(listed);
}

function processVideo(defaultVid, {addVid, removeVid}) {
    const
        defaultVideo = defaultVid ? Immutable.Set(defaultVid) : Immutable.Set(),
        addVideo = addVid ? Immutable.Set(addVid) : Immutable.Set(),
        removeVideo = removeVid ? Immutable.Set(removeVid) : Immutable.Set();

    return defaultVideo
        .union(addVideo)
        .subtract(removeVideo);
}

export function parseCmd(options) {

    const
        help = !!options['help'],
        dirs = processDirs(options),
        vidOptions = {addVid: options['add-video'], removeVid: options['remove-video']},
        videoSuffixes = processVideo(DEFAULT_SUFFIXES, vidOptions),
        excludeDirs = options['exclude-dirs'] ? Immutable.Set(options['exclude-dirs']) : Immutable.Set(),
        printUnprocessedFiles = !!options['print-unprocessed-files'],
        terseOutput = !!options['terse-output'],
        processCount = options['process-count'] ? options['process-count'] : DEFAULT_PROCESS_COUNT,
        logErrors = !!options['log-errors'];

    return Immutable.fromJS({help, directories: dirs, videoSuffixes, excludeDirs, printUnprocessedFiles, terseOutput, processCount, logErrors});
}
