/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module ui/videouploaderui
 */
import { Plugin } from 'ckeditor5/src/core';
import { FileDialogButtonView } from 'ckeditor5/src/upload';
import videoUploaderIcon from '../../theme/icons/media.svg';

/**
 * The bold UI feature. It introduces the Bold button.
 */
export default class VideoUploaderUi extends Plugin {
    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'VideoUploaderUi';
    }
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const t = editor.t;
        // Add video uploader button to feature components.
        editor.ui.componentFactory.add('videoUploader', locale => {
            const view = new FileDialogButtonView(locale);
            const command = editor.commands.get('videoUploader');
            const videoTypes = editor.config.get('video.upload.types');
            view.set({
                acceptedType: videoTypes.map(type => `video/${type}`).join(','),
                tooltip: true
            });
            view.buttonView.set({
                label: t('Insert Video'),
                icon: videoUploaderIcon,
                tooltip: true
            });
            // view.buttonView.bind('isEnabled').to(command);
            view.on('done', ( evt, file ) => {
                const fileToUpload = file;
                if (fileToUpload.length) {
                    editor.execute('videoUploader', { file: fileToUpload });
                    // editor.editing.view.focus();
                }
            });

            return view;
        });
    }
}
