/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * TODO: Doc
 * @module video-uploader
 */
import { Plugin } from 'ckeditor5/src/core';
import VideoUploaderEditing from "./videouploaderediting";
import VideoUploaderUi from "./ui/videouploaderui";

export default class VideoUploader extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [VideoUploaderEditing, VideoUploaderUi];
    }
}