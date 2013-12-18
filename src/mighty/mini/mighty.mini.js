/*global Mighty*/
/*jslint browser: true, nomen: true*/
Mighty.define(['mighty.core', 'mighty/mini/mighty.mini.css'], function (core) {

	'use strict';

	return {

		// These options will be used as defaults
		options: {
			count: 8,
			more_count: 8,
		// These selectors will automatically run inside
		// the module and grab the resulting elements.
			ui: {
				'articles': 'li',
				'photos': 'img'
			}
		},

		// Set up the widget
		_create: function () {

			var self = this;
			var options = self.options;
			var ui = self.ui;
			var element = self.element;

		}
	};
});
