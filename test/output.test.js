'use strict';

import {createOutput, createTotalOutput, createExecOutput} from '../src/output';
import * as Immutable from 'immutable';
import colors from 'colors/safe';

describe('creates right output for an input directory', () => {

    const createResult = (dir, time, files, unprocessedFiles, dirNotFound, dirNotReadable) => {
        return Immutable.Map()
            .set('dir', dir)
            .set('time', time)
            .set('files', Immutable.List(files))
            .set('unprocessedFiles', Immutable.List(unprocessedFiles))
            .set('dirNotFound', dirNotFound)
            .set('dirNotReadable', dirNotReadable);
    };

    test('when the input directory was not found', () => {

        const calcResult = createResult('Test', 0, [], [], true, false);
        expect(createOutput(calcResult, false, false)).toEqual('Test: Directory was not found');
    });

    test('when the input directory is not readable', () => {

        const calcResult = createResult('Test', 0, [], [], false, true);
        expect(createOutput(calcResult, false, false)).toEqual('Test: Directory is not readable');
    });

    test('when the terse output cmd option was applied', () => {

        const calcResult = createResult('Test', 120, ['file1', 'file2'], [], false, false);
        expect(createOutput(calcResult, true, false)).toEqual(`Test: ${colors.red('0y 0m 0w 0d 0h 02m 00s')}`);
    });

    test('when no cmd option related to formatting output was applied', () => {

        const calcResult = createResult('Test', 120, ['file1', 'file2'], ['file2'], false, false);
        expect(createOutput(calcResult, false, false))
            .toEqual(`Test\n \t- files count: 2\n \t- error files count: 1\n \t- total time: ${colors.red('0y 0m 0w 0d 0h 02m 00s')}`);
    });

    test('when the print unprocessed files cmd option was applied', () => {

        const calcResult = createResult('Test', 120, ['file1', 'file2'], ['file2'], false, false);
        expect(createOutput(calcResult, false, true))
            .toEqual(`Test\n \t- files count: 2\n \t- error files (1):\n \t\t- file2\n \t- total time: ${colors.red('0y 0m 0w 0d 0h 02m 00s')}`);

    });
});

describe('creates right output for the total / sum line', () => {

    const createTotal = (time, filesCount, unprocessedFiles) => {
        return Immutable.Map()
            .set('time', time)
            .set('filesCount', filesCount)
            .set('unprocessedFiles', Immutable.List(unprocessedFiles));
    };

    test('when the terse output cmd option was applied', () => {

        const calcTotal = createTotal(70, 10, []);
        expect(createTotalOutput(calcTotal, true, false)).toEqual(`${colors.blue('Total')}: ${colors.red('0y 0m 0w 0d 0h 01m 10s')}`);
    });

    test('when the print unprocessed files cmd option was applied', () => {

        const calcTotal = createTotal(70, 2, ['file2']);
        expect(createTotalOutput(calcTotal, false, true))
            .toEqual(`${colors.blue('Total')}\n \t- files count: 2\n \t- error files (1):\n \t\t- file2\n \t- total time: ${colors.red('0y 0m 0w 0d 0h 01m 10s')}`);
    });

    test('when no cmd option related to formatting output was applied', () => {

        const calcTotal = createTotal(70, 2, []);
        expect(createTotalOutput(calcTotal, false, false))
            .toEqual(`${colors.blue('Total')}\n \t- files count: 2\n \t- error files count: 0\n \t- total time: ${colors.red('0y 0m 0w 0d 0h 01m 10s')}`);
    });
});

test('create right output for the execution time line', () => {

    const result = createExecOutput([10, 300000000]);
    expect(result).toEqual(`${colors.yellow('Execution time: 10s 300ms')}`);
});
