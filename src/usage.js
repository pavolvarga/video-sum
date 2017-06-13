'use strict';

import {DEFAULT_SUFFIXES, DEFAULT_PROCESS_COUNT} from './constants';

const options = [
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Displays this usage guide.'
    },
    {
        name: 'dir',
        alias: 'd',
        multiple: true,
        typeLabel: '[underline]{directory}...',
        description: 'Path or paths to directories with video files.'
    },
    {
        name: 'list',
        alias: 'l',
        typeLabel: '[underline]{file}',
        description: `Path to a file containing path to directories with video files.
                      This is an alternative to using the [bold]{dir} option.
                      Each path must in on separate line in the file.
                      If you use this option but file does not exists or is not readable, then applications exists with and error.`
    },
    {
        name: 'add-video',
        alias: 'a',
        multiple: true,
        typeLabel: '[underline]{file suffix}...',
        description: 'List of file suffixes for video files to add into the default list.'
    },
    {
        name: 'remove-video',
        alias: 'r',
        multiple: true,
        typeLabel: '[underline]{file suffix}...',
        description: 'List of file suffixes for video files to remove from the default list.'
    },
    {
        name: 'exclude-dirs',
        alias: 'x',
        multiple: true,
        typeLabel: '[underline]{directory}...',
        description: `List of directory names to exclude. 
                      When a directory with such name is found, no file in it will be counted and all its subdirectories will be skipped.`
    },
    {
        name: 'print-unprocessed-files',
        alias: 'u',
        type: Boolean,
        description: 'If a video file can not be open, it is skipped. Use this option to print list such files.'
    },
    {
        name: 'terse-output',
        alias: 't',
        type: Boolean,
        description: 'Print result in terse output (directory and sum length on one line).'
    },
    {
        name: 'process-count',
        alias: 'p',
        type: Number,
        description: 'Change default process count to new value.'
    },
    {
        name: 'log-errors',
        alias: 'e',
        type: Boolean,
        description: 'Print all errors to stderr (for example why a video file could not be open).'
    }
];

export const sections = [
    {
        header: 'Video Sum',
        content: `Command line app for summing lengths of video files.
        
                  Application requires [bold]{ffmpeg} to be installed and added to PATH for its function.
        
                  You specify which directories to check by using [underline]{--dir} or [underline]{--list} option.
                  Application finds all video files in these input directories by checking file suffixes.
                  It then spawns multiple [bold]{ffprobe} process for opening all found video files and reading theirs video lengths. 
                  At the end it prints sum of video lengths per input directory and total sum of for all directories.
                  You can use [underline]{--dir} together with [underline]{--list}. If a directory is listed twice, it is counted only once.
                  
                  By default it uses these suffixes for deciding if a file is a video file: 
                  ${DEFAULT_SUFFIXES.toArray()}.
                  You can add additional suffix to this list by using [underline]{--add-video} option or 
                  remove suffix from this list by using [underline]{--remove-video} option.
                  
                  By default it spawns ${DEFAULT_PROCESS_COUNT} ffprobe process. You can change this value by using the [underline]{--process-count} option.
                  These processes are distributed among input directories based on number of video files they contain.
                  If you use more input directories than the process count, then process count value is ignored and for each input directory a single
                  ffprobe process will run.`
    },
    {
        header: 'Options',
        optionList: options
    }
];
