/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module ui/progressbar/progressui
 */
import View from "@ckeditor/ckeditor5-ui/src/view";
import type ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import { type Locale } from 'ckeditor5/src/utils';

export default class ProgressUi extends View {

    /**
     * @inheritDoc
     */
    constructor(locale: Locale)

    /**
     * @inheritDoc
     */
    _createCancelButton(locale: Locale): ButtonView
}