/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module utils/common
 */
import { findOptimalInsertionRange } from 'ckeditor5';

/**
 * Creates a regular expression used to test for files.
 *
 * @param {Array.<String>} types
 * @returns {RegExp}
 */
export function createVideoTypeRegExp(types) {
	// Sanitize the MIME type name which may include: "+", "-" or ".".
	const regExpSafeNames = types.map(type => type.replace('+', '\\+'));
	return new RegExp(`^video\\/(${regExpSafeNames.join('|')})$`);
}

export function insertVideoTag(writer, editor, attributes = {}) {
	const selection = editor.model.document.selection;
	const insertAtSelection = findOptimalInsertionRange(
		selection,
		editor.model
	);
	let shortcode = '[video h=100% w=100%]' + attributes.videoUrl + '[/video]';

	const videoTagText = writer.createText(shortcode, attributes);
	editor.model.insertContent(videoTagText, insertAtSelection);

	if (videoTagText.parent) {
		writer.setSelection(videoTagText, 'on');
	}
}
