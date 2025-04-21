/* eslint-env node */

"use strict";

module.exports = {
	extends: "ckeditor5",
	root: true,
	ignorePatterns: [
		// Ignore the entire `dist/`.
		"dist/**",
	],
	rules: {
		//  This rule disallows importing from any path other than the package main entrypoint.
		"ckeditor5-rules/allow-imports-only-from-main-package-entry-point":
			"error",
		// This rule ensures that all imports from `@ckeditor/*` packages are done through the main package entry points.
		// This is required for the editor types to work properly and to ease migration to the installation methods
		// introduced in CKEditor 5 version 42.0.0.
		"ckeditor5-rules/no-legacy-imports": "error",
		// As required by the ECMAScript (ESM) standard, all imports must include a file extension.
		// If the import does not include it, this rule will try to automatically detect the correct file extension.
		"ckeditor5-rules/require-file-extensions-in-imports": [
			"error",
			{
				extensions: [".ts", ".js", ".json"],
			},
		],
		"space-in-parens": "off",
		"array-bracket-spacing": "off",
	},
	overrides: [
		{
			files: ["tests/**/*.js", "sample/**/*.js"],
			rules: {
				// Imports CKEditor 5 packages in test files are not checked.
				"ckeditor5-rules/ckeditor-imports": "off",
			},
		},
	],
};
