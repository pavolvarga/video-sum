'use strict';

import {readFileLines, findVideoFiles} from '../src/reader';
import * as Immutable from 'immutable';
import * as matchers from 'jest-immutable-matchers';

describe('reads lines from a file', () => {

    test('and skips empty ones', () => {
        const lines = readFileLines(__dirname + '/fixtures/list.txt');
        expect(lines).toEqual(['/media/user/videos1', '/media/user/videos2', '/media/user/videos3', '/media/user/videos1']);
    });
});

describe('finds', () => {

    const dirName = (testNum, dirNum) => `${__dirname}/fixtures/test-${testNum}/dir-${dirNum}`;
    const fileName = (testNum, dirNum, fileNum, fileSfx) =>
        `${__dirname}/fixtures/test-${testNum}/dir-${dirNum}/file-${testNum}${dirNum}${fileNum}.${fileSfx}`;

    beforeEach(() => {
        jest.addMatchers(matchers);
    });

    test('all 4 video files in 2 input directories', () => {

        const
            dir1 = dirName(1, 1),
            dir2 = dirName(1, 2),
            directories = Immutable.fromJS([dir1, dir2]),
            videoSuffixes = Immutable.fromJS(['avi', 'mp4']),
            excludeDirs = Immutable.Set();

        const result = findVideoFiles(directories, videoSuffixes, excludeDirs);

        const expected = Immutable.fromJS([
            {dir: dir1, files: [fileName(1, 1, 1, 'avi'), fileName(1, 1, 2, 'mp4')]},
            {dir: dir2, files: [fileName(1, 2, 1, 'avi'), fileName(1, 2, 2, 'mp4')]}
        ]);

        expect(result).toEqualImmutable(expected);
    });

    test('2 video files and skips 2 which suffix was not specified', () => {

        const
            dir = dirName(2, 1),
            directories = Immutable.fromJS([dir]),
            videoSuffixes = Immutable.fromJS(['mov', 'flv']),
            excludeDirs = Immutable.Set();

        const result = findVideoFiles(directories, videoSuffixes, excludeDirs);

        const expected = Immutable.fromJS([
            {dir, files: [fileName(2, 1, 3, 'mov'), fileName(2, 1, 4, 'flv')]}
        ]);

        expect(result).toEqualImmutable(expected);
    });

    test('2 video files and skips 2 in excluded input directory', () => {

        const
            dir1 = dirName(3, 1),
            dir2 = dirName(3, 2),
            directories = Immutable.fromJS([dir1, dir2]),
            videoSuffixes = Immutable.fromJS(['avi']),
            excludeDirs = Immutable.Set(['dir-1']);

        const result = findVideoFiles(directories, videoSuffixes, excludeDirs);

        const expected = Immutable.fromJS([
            {dir: dir2, files: [fileName(3, 2, 1, 'avi'), fileName(3, 2, 2, 'avi')]}
        ]);

        expect(result).toEqualImmutable(expected);
    });

    test('2 video files and skips 2 in excluded subdirectory', () => {

        const
            dir = dirName(4, 1),
            directories = Immutable.fromJS([dir]),
            videoSuffixes = Immutable.fromJS(['avi']),
            excludeDirs = Immutable.Set(['excluded']);

        const result = findVideoFiles(directories, videoSuffixes, excludeDirs);

        const expected = Immutable.fromJS([
            {dir, files: [fileName(4, 1, 3, 'avi'), fileName(4, 1, 4, 'avi')]}
        ]);

        expect(result).toEqualImmutable(expected);
    });

    test('2 video files in existing dir and sets error for non existing dir', () => {

        const
            dir1 = dirName(5, 1),
            dir2 = 'nonexisting',
            directories = Immutable.fromJS(([dir1, dir2])),
            videoSuffixes = Immutable.fromJS((['avi'])),
            excludeDirs = Immutable.Set();

        const result = findVideoFiles(directories, videoSuffixes, excludeDirs);

        const expected = Immutable.fromJS([
            {dir: dir1, files: [fileName(5, 1, 1, 'avi'), fileName(5, 1, 2, 'avi')]},
            {dir: dir2, files: [], dirNotFound: true}
        ]);

        expect(result).toEqualImmutable(expected);
    });
});
