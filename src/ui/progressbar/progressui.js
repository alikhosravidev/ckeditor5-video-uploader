/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import { View, toUnit, ButtonView, IconCancel } from 'ckeditor5';
/**
 * @module ui/progressbar/progressui
 */
const toPx = toUnit('%');

export default class ProgressUi extends View {
	constructor(locale) {
		super(locale);

		const bind = this.bindTemplate;
		this.cancelButton = this._createCancelButton(locale);

		// Views define their interface (state) using observable attributes.
		this.set('width', 100);
		this.set('customWidth', 0);

		this.setTemplate({
			tag: 'div',

			// The element of the view can be defined with its children.
			children: [
				{
					tag: 'div',
					children: ['Uploading...'],
					attributes: {
						class: ['ck-uploading-progress'],
						style: {
							width: bind.to('customWidth', toPx)
						}
					}
				},
				this.cancelButton
			],
			attributes: {
				class: [
					'ck-progress-bar',

					// Observable attributes control the state of the view in DOM.
					bind.to('elementClass')
				],
				style: {
					width: bind.to('width', toPx)
				}
			}
		});
	}
	_createCancelButton(locale) {
		const view = new ButtonView(locale);
		view.set({
			icon: IconCancel,
			tooltip: true,
			label: 'Cancel',
			attributes: {
				class: [
					'ck',
					'ck-button',
					'ck-off',
					'ck-button-cancel',
					'ck-uploading-cancel'
				]
			}
		});

		view.on('execute', () => {
			this.fire('cancel');
		});

		return view;
	}
}
