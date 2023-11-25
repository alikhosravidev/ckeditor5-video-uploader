/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import {FileRepository} from 'ckeditor5/src/upload';
import {Command} from 'ckeditor5/src/core';
import {insertVideoTag} from '../utils/common';
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
    refresh() {
        this.isEnabled = true;
    }

    /**
     * Executes the command.
     *
     * @fires execute
     * @param options Options for the executed command.
     * @param options.file The image file or an array of image files to upload.
     */
    execute(options) {
        const editor = this.editor;
        const model = editor.model;

        const fileRepository = editor.plugins.get(FileRepository);

        model.change(writer => {
            const filesToUpload = options.file;
            for (const file of filesToUpload) {
                uploadFile(writer, editor, fileRepository, file);
            }
        });
    }
}

function uploadFile(writer, editor, fileRepository, file) {
    const loader = fileRepository.createLoader(file);

    // Do not throw when upload adapter is not set. FileRepository will log an error anyway.
    if (!loader) {
        return;
    }

    insertVideoTag(writer, editor, {videoId: loader.id, videoUrl: "#videoUrl#"});
}
