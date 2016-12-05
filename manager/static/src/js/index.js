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
			let uploadPrompt = confirm('Are you sure you want to upload: \n' + e.target.value + '?');
			let data = new FormData();
			let file = this.files[0];
			data.append('image', file);

			let fileUploader = $(this).siblings('.Form__FileUpload__Clickable');
			let progressBar = fileUploader.children('.Form__FileUpload__Progress');
			let progressText = fileUploader.children('.Form__FileUpload__ButtonText');
			let buttonIcon = fileUploader.children('.fa');
			let hiddenValue = fileUploader.children('.Form__FileUpload__HiddenValue');
			let widthOfUploadButton = fileUploader.width();

			if(uploadPrompt){
				$.ajax({
					url: '/manager/upload',
					method: 'POST',
					data: data,
					cache: false,
				    contentType: false,
				    processData: false,
				    xhr: function(){
				    	let xhr = $.ajaxSettings.xhr();
				    	xhr.upload.onprogress = (e) => {
				    		let percentage = Math.floor(e.loaded / e.total * 100);
				    		progressBar.width(percentage + '%');
				    		progressText.html(`${percentage}%`);
				    		buttonIcon.hide();
			    		
				    	}
				    	xhr.upload.onload = () => {
				    		console.log('Upload complete.');
				    	}

				    	return xhr;
				    },
				    success: function(dataReturned) {
				    	hiddenValue.val(dataReturned.path.substr(6));

				    	window.setTimeout(() => {
				    		progressText.animate({
				    			opacity: 0
				    		}, 400, () => {
				    			progressText.css({
				    				'width': widthOfUploadButton,
				    				'whiteSpace': 'nowrap',
				    				'textOverflow': 'ellipsis',
				    				'overflow': 'hidden'
				    			})
				    			progressText.html(dataReturned.filename)
				    				.animate({
				    					opacity: 1
				    				}, 400, () => {
				    					fileUploader.addClass('Form__FileUpload__Clickable--uploaded');
				    					fileUploader.attr('data-path', dataReturned.path);
				    				})
				    		})


				    	}, 2500);

				    		

				    },
				    error: function(err) {
				    	console.error(err);
				    }
				});
			}
		});

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

