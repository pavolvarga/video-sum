'use strict';

import {parseCmd} from '../src/cmdline';
import {DEFAULT_SUFFIXES, DEFAULT_PROCESS_COUNT} from '../src/constants';
import * as Immutable from 'immutable';
import * as matchers from 'jest-immutable-matchers';

describe('correctly parses cmd options', () => {

    beforeEach(() => {
        jest.addMatchers(matchers);
    });

    const createExp = (help, directories, videoSuffixes, excludeDirs, printUnprocessedFiles, terseOutput, processCount, logErrors) => {
        return Immutable.Map()
            .set('help', help)
            .set('directories', Immutable.Set(directories))
            .set('videoSuffixes', Immutable.Set(videoSuffixes))
            .set('excludeDirs', Immutable.Set(excludeDirs))
            .set('printUnprocessedFiles', printUnprocessedFiles)
            .set('terseOutput', terseOutput)
            .set('processCount', processCount)
            .set('logErrors', logErrors);
    };

    const createCmd = (argv) => ({argv: ['node', 'video-sum', ...argv]});

    test('when no option was used', () => {

        const
            cmd = createCmd([]),
            result = parseCmd(cmd),
            expected = createExp(false, [], DEFAULT_SUFFIXES, [], false, false, DEFAULT_PROCESS_COUNT, false);

        expect(result).toEqualImmutable(expected);
    });

    test('when `-h` was used', () => {

        const
            cmd = createCmd(['-h']),
            result = parseCmd(cmd),
            expected = createExp(true, [], DEFAULT_SUFFIXES, [], false, false, DEFAULT_PROCESS_COUNT, false);

        expect(result).toEqualImmutable(expected);
    });

    test('when `--help` was used', () => {

        const
            cmd = createCmd(['--help']),
            result = parseCmd(cmd),
            expected = createExp(true, [], DEFAULT_SUFFIXES, [], false, false, DEFAULT_PROCESS_COUNT, false);

        expect(result).toEqualImmutable(expected);
    });

});
