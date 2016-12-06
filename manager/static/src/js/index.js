import $ from 'jquery';
import jQuery from 'jquery';
window.$ = $;
window.jQuery = jQuery;

let addRow = require('./pages.addrow.js').addRow;
let delRow = require('./pages.delrow.js').delRow;
let selectType = require('./pages.selecttype.js').selectType;
let slugify = require('./helper.slugify.js');

function checkRoute(route){
	return window.location.pathname.includes(route);
};


if(checkRoute('/pages/create')){
	let uploadFile = require('./pages.fileupload.js').uploadFile;

	$(document).ready(function(){
		// Automatically fill slug field with slugified name.
		let pageNameField = $('.js-pagename');
		let slugField = $('.js-pageslug');
		pageNameField.on('keyup', function(e){
			slugField.val('/' + slugify(e.target.value));
		});

		// The form.
		let form = $('.Form');

		// Dynamically added rows.
		let formRows = $('.js-formrows');

		// Select type event
		let selectTypeField = $('.js-selecttype');
		formRows.on('change', '.js-selecttype', selectType);

		// Add row button
		let addRowBtn = $('.js-addrow');

		// Delete row button
		let delRowBtn = $('.js-delrow');				

		formRows.on('click', '.js-addrow', addRow);
		
		formRows.on('click', '.js-delrow', delRow);

		formRows.on('change', '.js-addfile', uploadFile);

		form.on('submit', function(e){
			e.preventDefault();
			console.log($(this).serialize());

			
			$.ajax({
				url: '/manager/pages/create',
				method: 'POST',
				data: $('.Form').serialize()
			})
			.done(function(data){
				console.log(data);
			});
			
		})
	});	
}

