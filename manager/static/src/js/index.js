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

function uploadFile(data, endpoint){
	return new Promise((resolve, reject) => {
		$.ajax({
			url: endpoint,
			method: 'POST',
			data: data,
			cache: false,
		    contentType: false,
		    processData: false,
		    success: function(data) {
		    	return resolve(data);
		    },
		    error: function(err) {
		    	return reject(err);
		    }
		});
	})
};

if(checkRoute('/pages/create')){
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

		formRows.on('change', '.js-addfile', function(e){
			//let uploadPrompt = confirm('Are you sure you want to upload: \n' + e.target.value + '?');
			let data = new FormData();
			let file = this.files[0];
			data.append('file', file);
			
			$.ajax({
				url: '/manager/upload',
				method: 'POST',
				data: data,
				cache: false,
			    contentType: false,
			    processData: false,
			    success: function(data) {
			    	console.log(data);
			    },
			    error: function(err) {
			    	console.error(err);
			    }
			});
			

		})

		form.on('submit', function(e){
			e.preventDefault();
			
			$.ajax({
				url: '/manager/pages/create',
				method: 'POST',
				data: form.serialize()
			})
			.done(function(data){
				console.log(data);
			});
			
		})
	});	
}

