import $ from 'jquery';
// eslint-disable-next-line import/no-duplicates
import jQuery from 'jquery';

window.$ = $;
window.jQuery = jQuery;

const addRow = require('./pages.addrow.js').addRow;
const delRow = require('./pages.delrow.js').delRow;
const selectType = require('./pages.selecttype.js').selectType;
const slugify = require('./helper.slugify.js');
const uploadFile = require('./pages.fileupload.js').uploadFile;

function checkRoute(route) {
	return window.location.pathname.includes(route);
}


if (checkRoute('/pages/create')) {
	$(document).ready(() => {
		// Automatically fill slug field with slugified name.
		const pageNameField = $('.js-pagename');
		const slugField = $('.js-pageslug');
		pageNameField.on('keyup', e => slugField.val(`/${slugify(e.target.value)}`));

		// The form.
		const form = $('.Form');

		// Dynamically added rows.
		const formRows = $('.js-formrows');

		// Select type event
		formRows.on('change', '.js-selecttype', selectType);

		formRows.on('click', '.js-addrow', addRow);

		formRows.on('click', '.js-delrow', delRow);

		formRows.on('change', '.js-addfile', uploadFile);

		form.on('submit', (e) => {
			e.preventDefault();

			$.ajax({
				url: '/manager/pages/create',
				method: 'POST',
				data: $('.Form').serialize(),
			})
			.done((data) => {
				console.log(data);
			});
		});
	});
}
