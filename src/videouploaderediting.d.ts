/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module videouploaderediting
 */
import {Plugin, type Editor} from 'ckeditor5/src/core';
import {type Element, type Writer, type DataTransfer} from 'ckeditor5/src/engine';
import {Notification} from 'ckeditor5/src/ui';
import {ClipboardPipeline} from 'ckeditor5/src/clipboard';
import {FileRepository, type FileLoader} from 'ckeditor5/src/upload';

/**
 * The uploader editing feature.
 *
 */
export default class VideoUploaderEditing extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires(): readonly [typeof FileRepository, typeof Notification, typeof ClipboardPipeline];

    /**
     * @inheritDoc
     */
    static get pluginName(): 'VideoUploaderEditing';

    /**
     * An internal mapping of {@link module:upload/filerepository~FileLoader#id file loader UIDs} and
     * model elements during the upload.
     */
    private readonly _uploadElements;

    /**
     * @inheritDoc
     */
    constructor(editor: Editor);

    /**
     * @inheritDoc
     */
    init(): void;

    /**
     * @inheritDoc
     */
    afterInit(): void;

    /**
     * Reads and uploads an image.
     *
     * The image is read from the disk and as a Base64-encoded string it is set temporarily to
     * `image[src]`. When the image is successfully uploaded, the temporary data is replaced with the target
     * image's URL (the URL to the uploaded image on the server).
     */
    protected _readAndUpload(loader: FileLoader): Promise<void>;

    /**
     * Creates the `srcset` attribute based on a given file upload response and sets it as an attribute to a specific image element.
     *
     * @param data Data object from which `srcset` will be created.
     * @param image The image element on which the `srcset` attribute will be set.
     */
    protected _parseAndSetSrcsetAttributeOnFile(data: Record<string, unknown>, image: Element, writer: Writer): void;
}

/**
 * Returns `true` if non-empty `text/html` is included in the data transfer.
 */
export declare function isHtmlIncluded(dataTransfer: DataTransfer): boolean;