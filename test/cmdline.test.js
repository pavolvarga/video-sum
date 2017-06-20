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

    test('when `-h` or `--help` was used', () => {

        const expected = createExp(true, [], DEFAULT_SUFFIXES, [], false, false, DEFAULT_PROCESS_COUNT, false);

        expect(parseCmd(createCmd(['-h']))).toEqualImmutable(expected);
        expect(parseCmd(createCmd(['--help']))).toEqualImmutable(expected);
    });

    test('when `-d` or `--dir` was used', () => {

        const
            dirs = ['/media/dir1', '/media/dir2', '/media/dir1'],
            cmdShort = createCmd(['-d', ...dirs]),
            cmdLong = createCmd(['--dir', ...dirs]),
            expected = createExp(false, ['/media/dir1', '/media/dir2'], DEFAULT_SUFFIXES, [], false, false, DEFAULT_PROCESS_COUNT, false);

        expect(parseCmd(cmdShort)).toEqualImmutable(expected);
        expect(parseCmd(cmdLong)).toEqualImmutable(expected);
    });

    test('when `-l` or `--list` was used', () => {

        const
            fileName = `${__dirname}/fixtures/list.txt`,
            cmdShort = createCmd(['-l', fileName]),
            cmdLong = createCmd(['--list', fileName]),
            expected = createExp(false, ['/media/user/videos1', '/media/user/videos2', '/media/user/videos3'], DEFAULT_SUFFIXES, [], false, false, DEFAULT_PROCESS_COUNT, false);

        expect(parseCmd(cmdShort)).toEqualImmutable(expected);
        expect(parseCmd(cmdLong)).toEqualImmutable(expected);
    });

    test('when both `-d` and `-l` options were used', () => {

        const
            fileName = `${__dirname}/fixtures/list.txt`,
            cmd = createCmd(['-l', fileName, '-d', '/media/user/videos1', '/media/user/videos4']),
            expected = createExp(false, ['/media/user/videos1', '/media/user/videos2', '/media/user/videos3', '/media/user/videos4'],
                DEFAULT_SUFFIXES, [], false, false, DEFAULT_PROCESS_COUNT, false);

        expect(parseCmd(cmd)).toEqualImmutable(expected);
    });

    test('when `-a` or `--add-video` was used', () => {

        const
            suffixes = ['mp5', 'mp6'],
            cmdShort = createCmd(['-a', ...suffixes]),
            cmdLong = createCmd(['--add-video', ...suffixes]),
            expected = createExp(false, [], DEFAULT_SUFFIXES.add('mp5').add('mp6'), [], false, false, DEFAULT_PROCESS_COUNT, false);

        expect(parseCmd(cmdShort)).toEqualImmutable(expected);
        expect(parseCmd(cmdLong)).toEqualImmutable(expected);
    });

    test('when `-r` or `--remove-video` was used', () => {

        const
            suffixes = ['avi', 'mkv'],
            cmdShort = createCmd(['-r', ...suffixes]),
            cmdLong = createCmd(['--remove-video', ...suffixes]),
            expected = createExp(false, [], DEFAULT_SUFFIXES.delete('avi').delete('mkv'), [], false, false, DEFAULT_PROCESS_COUNT, false);

        expect(parseCmd(cmdShort)).toEqualImmutable(expected);
        expect(parseCmd(cmdLong)).toEqualImmutable(expected);
    });

    test('when `-x` or `--exclude-dirs` was used', () => {

        const
            excluded = ['Ignore', 'Exclude'],
            cmdShort = createCmd(['-x', ...excluded]),
            cmdLong = createCmd(['--exclude-dirs', ...excluded]),
            expected = createExp(false, [], DEFAULT_SUFFIXES, [...excluded], false, false, DEFAULT_PROCESS_COUNT, false);

        expect(parseCmd(cmdShort)).toEqualImmutable(expected);
        expect(parseCmd(cmdLong)).toEqualImmutable(expected);

    });

    test('when `-u` or `--print-unprocessed-files` was used', () => {

        const expected = createExp(false, [], DEFAULT_SUFFIXES, [], true, false, DEFAULT_PROCESS_COUNT, false);

        expect(parseCmd(createCmd(['-u']))).toEqualImmutable(expected);
        expect(parseCmd(createCmd(['--print-unprocessed-files']))).toEqualImmutable(expected);

    });

    test('when `-t` or `--terse-output` was used', () => {

        const expected = createExp(false, [], DEFAULT_SUFFIXES, [], false, true, DEFAULT_PROCESS_COUNT, false);

        expect(parseCmd(createCmd(['-t']))).toEqualImmutable(expected);
        expect(parseCmd(createCmd(['--terse-output']))).toEqualImmutable(expected);
    });

    test('when `-p` or `--process-count` was used', () => {

        const expected = createExp(false, [], DEFAULT_SUFFIXES, [], false, false, 10, false);

        expect(parseCmd(createCmd(['-p', '10']))).toEqualImmutable(expected);
        expect(parseCmd(createCmd(['--process-count', '10']))).toEqualImmutable(expected);
    });

    test('when `-e` or `--log-errors` was used', () => {

        const expected = createExp(false, [], DEFAULT_SUFFIXES, [], false, false, DEFAULT_PROCESS_COUNT, true);

        expect(parseCmd(createCmd(['-e']))).toEqualImmutable(expected);
        expect(parseCmd(createCmd(['--log-errors']))).toEqualImmutable(expected);
    });
});
