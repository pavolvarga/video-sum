'use strict';

/**
 * FFprobe can't read video duration from an existing video file (probably the file is corrupted).
 */
export function ReadVideoFileError(file) {
    this.name = ReadVideoFileError;
    this.message = `Unable to read duration from video file: ${file}`;
    this.videoFilePath = file;
    this.stack = (new Error()).stack;
}
ReadVideoFileError.prototype = Object.create(Error.prototype);
ReadVideoFileError.prototype.constructor = ReadVideoFileError;
