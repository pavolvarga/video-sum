'use strict';

import {readFileLines} from '../src/reader';

test('reads lines from a file and skips empty ones', () => {
    const lines = readFileLines(__dirname + '/fixtures/list.txt');
    expect(lines).toEqual(['/media/user/videos1', '/media/user/videos2', '/media/user/videos3', '/media/user/videos1']);
});
