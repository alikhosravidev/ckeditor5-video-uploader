/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import { Plugin, FileRepository } from 'ckeditor5';
import ProgressUI from './progressui.js';
/**
 * The video upload progress plugin.
 * It shows a progress bar when the file is read from the disk and while the file is uploading.
 *
 * @extends video-uploader/ui/progressbar/videouploaderprogress
 */
export class VideoUploaderProgress extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'VideoUploaderProgress';
	}
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		// Upload status change - update file's view according to that status.
		editor.editing.downcastDispatcher.on(
			'attribute:uploadStatus:$text',
			(...args) => this.uploadStatusChange(...args)
		);
	}

	/**
	 * This method is called each time the file `uploadStatus` attribute is changed.
	 *
	 * @param {module:utils/eventinfo~EventInfo} evt An object containing information about the fired event.
	 * @param {Object} data Additional information about the change.
	 * @param {module:engine/conversion/downcastdispatcher~DowncastConversionApi} conversionApi
	 */
	uploadStatusChange(evt, data, conversionApi) {
		const editor = this.editor;
		const modelItem = data.item;

		const fileRepository = editor.plugins.get(FileRepository);
		const videoId = modelItem.getAttribute('videoId');
		const status = videoId ? data.attributeNewValue : null;

		if (!conversionApi.consumable.consume(data.item, evt.name)) {
			return;
		}

		// Show progress bar on the top of the file when the file is uploading.
		if (status === 'reading') {
			const loader = fileRepository.loaders.get(videoId);
			this.progressBar = _showProgressBar(editor, loader);

			return;
		}

		return;
	}
}

function _createProgressBar(locale) {
	return new ProgressUI(locale);
}

function _showProgressBar(editor, loader) {
	const progressBar = _createProgressBar(editor.locale);
	const toolbar = editor.ui.view.stickyPanel;
	progressBar.render();

	toolbar.element.append(progressBar.element);

	progressBar.on('cancel', () => {
		try {
			loader.abort();
		} catch {
			console.warn('Loader already aborted.');
		}

		_removeProgressBar(toolbar, progressBar);
	});

	loader.on('change:uploadedPercent', (evt, name, value) => {
		progressBar.set('customWidth', value);
	});

	loader.on('change:uploadResponse', (evt, name, value) => {
		if (value) {
			_removeProgressBar(toolbar, progressBar);
		}
	});

	return progressBar;
}

function _removeProgressBar(toolbar, progressBar) {
	toolbar.element.removeChild(progressBar.element);
	progressBar.destroy();
}
