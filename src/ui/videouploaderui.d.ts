/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module ui/videouploaderui
 */
import { Plugin } from 'ckeditor5/src/core';
/**
 * The sample UI feature. It introduces the Sample button.
 */
export default class VideoUploaderUi extends Plugin {
    /**
     * @inheritDoc
     */
    static get pluginName(): 'UploaderUi';

    /**
     * @inheritDoc
     */
    init(): void;
}
