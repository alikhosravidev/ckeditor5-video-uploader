/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import '../theme/custom.css';
import VideoUploaderEditing from './videouploaderediting.js';
import VideoUploaderUi from './ui/videouploaderui.js';
import { Plugin } from 'ckeditor5';
import { VideoUploaderProgress } from './ui/progressbar/videouploaderprogress.js';
class VideoUploader extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [VideoUploaderEditing, VideoUploaderUi];
	}
}

export { VideoUploader, VideoUploaderProgress };
