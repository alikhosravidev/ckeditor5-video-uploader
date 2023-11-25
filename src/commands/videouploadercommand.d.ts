/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import { Command } from 'ckeditor5/src/core';
import { type ArrayOrItem } from 'ckeditor5/src/utils';
/**
 * @module commands/videouploadercommand
 */
/**
 * The upload video command.
 */
export default class VideoUploaderCommand extends Command {
    /**
     * @inheritDoc
     */
    refresh(): void;
    /**
     * Executes the command.
     *
     * @fires execute
     * @param options Options for the executed command.
     * @param options.file The image file or an array of image files to upload.
     */
    execute(options: {
        file: ArrayOrItem<File>;
    }): void;
}
