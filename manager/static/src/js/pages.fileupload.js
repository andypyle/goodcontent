import $ from 'jquery';
import jQuery from 'jquery';
window.$ = $;
window.jQuery = jQuery;

exports.uploadFile = function(e){
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
		    	fileUploader.siblings('.js-addfile').prop('disabled', true);
		    	fileUploader.css({
		    		'cursor':'default'
		    	})

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
};