/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module ui/progressbar/videouploaderprogress
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class VideoUploaderProgress extends Plugin {

    /**
     * @inheritDoc
     */
    static get pluginName(): 'VideoUploaderProgress';

    /**
     * @inheritDoc
     */
    init(): void;

    /**
     * @inheritDoc
     */
    uploadStatusChange(evt, data, conversionApi): void;
}