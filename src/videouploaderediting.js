/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import {
	Plugin,
	Notification,
	ClipboardPipeline,
	FileRepository
} from 'ckeditor5';
import { createVideoTypeRegExp, insertVideoTag } from './utils/common.js';
import VideoUploaderCommand from './commands/videouploadercommand.js';

/**
 * @module videouploaderediting
 */
export default class VideoUploaderEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [FileRepository, Notification, ClipboardPipeline];
	}

	static get pluginName() {
		return 'VideoUploaderEditing';
	}

	/**
	 * @inheritDoc
	 */
	constructor(editor) {
		super(editor);
		editor.config.define('video', {
			upload: {
				types: ['mp4']
			}
		});
		this._uploadElements = new Map();
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const doc = editor.model.document;
		const schema = editor.model.schema;
		const fileRepository = editor.plugins.get(FileRepository);
		const fileTypes = createVideoTypeRegExp(
			editor.config.get('video.upload.types')
		);

		// Register `videoUploader` command.
		const videoUploaderCommand = new VideoUploaderCommand(editor);
		editor.commands.add('videoUploader', videoUploaderCommand);

		// Setup schema to allow videoId and uploadStatus for files.
		schema.extend('$text', {
			allowAttributes: ['videoId', 'videoUrl', 'uploadStatus']
		});

		editor.conversion.attributeToElement({
			model: 'videoUrl',
			view: {
				name: 'div',
				classes: 'block-shortcode'
			},
			upcastAlso: [
				{
					classes: 'block-shortcode'
				}
			]
		});

		// Upload placeholder video that appeared in the model.
		doc.on('change', () => {
			// Note: Reversing changes to start with insertions and only then handle removals. If it was the other way around,
			// loaders for **all** images that land in the $graveyard would abort while in fact only those that were **not** replaced
			// by other images should be aborted.
			const changes = doc.differ
				.getChanges({ includeChangesInGraveyard: true })
				.reverse();
			const insertedVideoIds = new Set();
			for (const entry of changes) {
				// when insert video file.
				if (entry.type == 'insert') {
					const item = entry.position.nodeAfter;
					if (!item) {
						return;
					}
					const isInsertedInGraveyard =
						entry.position.root.rootName == '$graveyard';
					for (const videoElement of getVideoShortcodes(
						editor,
						item
					)) {
						// Check if the video element still has upload id.
						const videoId = videoElement.getAttribute('videoId');
						if (!videoId) {
							continue;
						}

						// Check if the image is loaded on this client.
						const loader = fileRepository.loaders.get(videoId);
						if (!loader) {
							continue;
						}
						if (isInsertedInGraveyard) {
							// If the image was inserted to the graveyard for good (**not** replaced by another image),
							// only then abort the loading process.
							if (!insertedVideoIds.has(videoId)) {
								loader.abort();
							}
						} else {
							// Remember the upload id of the inserted image. If it acted as a replacement for another
							// image (which landed in the $graveyard), the related loader will not be aborted because
							// this is still the same image upload.
							insertedVideoIds.add(videoId);
							// Keep the mapping between the upload ID and the image model element so the upload
							// can later resolve in the context of the correct model element. The model element could
							// change for the same upload if one image was replaced by another (e.g. image type was changed),
							// so this may also replace an existing mapping.
							this._uploadElements.set(videoId, videoElement);
							if (loader.status == 'idle') {
								// If the image was inserted into content and has not been loaded yet, start loading it.
								this._readAndUpload(loader, videoElement);
							}
						}
					}
				}
			}
		});

		// Set the default handler for feeding the image element with `src` and `srcset` attributes.
		this.on(
			'uploadVideoComplete',
			(evt, { videoElement, data }) => {
				const url = data.default;
				this.editor.model.change(writer => {
					writer.remove(videoElement);
					insertVideoTag(writer, this.editor, { videoUrl: url });
				});
			},
			{ priority: 'low' }
		);
	}

	/**
	 * @inheritDoc
	 */
	afterInit() {}

	/**
	 * Reads and uploads a file.
	 *
	 */
	_readAndUpload(loader, videoElement) {
		const editor = this.editor;
		const model = editor.model;
		const t = editor.locale.t;
		const fileRepository = editor.plugins.get(FileRepository);
		const notification = editor.plugins.get(Notification);

		model.enqueueChange('transparent', writer => {
			writer.setAttribute('uploadStatus', 'reading', videoElement);
		});

		return loader
			.read()
			.then(() => {
				const promise = loader.upload();

				model.enqueueChange('transparent', writer => {
					writer.setAttribute(
						'uploadStatus',
						'uploading',
						videoElement
					);
				});

				return promise;
			})
			.then(data => {
				model.enqueueChange('transparent', writer => {
					writer.setAttributes(
						{ uploadStatus: 'complete', videoUrl: data.default },
						videoElement
					);
					this.fire('uploadVideoComplete', { data, videoElement });
				});

				clean();
			})
			.catch(error => {
				// If status is not 'error' nor 'aborted' - throw error because it means that something else went wrong,
				// it might be generic error and it would be real pain to find what is going on.
				if (loader.status !== 'error' && loader.status !== 'aborted') {
					throw error;
				}

				// Might be 'aborted'.
				if (loader.status == 'error' && error) {
					notification.showWarning(error, {
						title: t('Upload failed'),
						namespace: 'upload'
					});
				}

				clean();

				// Permanently remove file from insertion batch.
				model.enqueueChange('transparent', writer => {
					writer.remove(videoElement);
				});
			});

		function clean() {
			model.enqueueChange('transparent', writer => {
				writer.removeAttribute('videoId', videoElement);
				writer.removeAttribute('uploadStatus', videoElement);
			});

			fileRepository.destroyLoader(loader);
		}
	}
}

function getVideoShortcodes(editor, item) {
	return Array.from(editor.model.createRangeOn(item))
		.filter(value => value.item.hasAttribute('videoId'))
		.map(value => value.item);
}
