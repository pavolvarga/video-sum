'use strict';

import * as Immutable from 'immutable';

export const DEFAULT_SUFFIXES = Immutable.Set(['webm', 'mkv', 'flv', 'vob', 'ogv', 'ogg', 'avi', 'mov', 'wmv', 'mp4', 'm4p', 'mpg', 'mpeg', 'm4v', 'f4v']);

export const CMD_LINE_OPTION_DEFINITIONS = [
    { name: 'help', alias: 'h', type: Boolean},
    { name: 'dir', alias: 'd', type: String, multiple: true },
    { name: 'list', alias: 'l', type: String },
    { name: 'add-video', alias: 'a', multiple: true},
    { name: 'remove-video', alias: 'r', multiple: true},
    { name: 'set-video', alias: 's', multiple: true},
    { name: 'exclude-dirs', alias: 'x', multiple: true},
    { name: 'print-unprocessed-files', alias: 'u', type: Boolean},
    { name: 'terse-output', alias: 't', type: Boolean},
    { name: 'process-count', alias: 'p', type: Number},
    { name: 'log-errors', alias: 'e', type: Boolean}
];

export const TIME_FORMAT = 'y[y] M[m] w[w] d[d] h[h] mm[m] ss[s]';

export const DEFAULT_PROCESS_COUNT = 100;
