const {
	$,
	FormData,
	confirm,
} = window;

exports.uploadFile = function uploadFile(e) {
	const uploadPrompt = confirm(`Are you sure you want to upload: \n ${e.target.value}?`);
	const data = new FormData();
	const file = this.files[0];
	data.append('image', file);

	const fileUploader = $(this).siblings('.Form__FileUpload__Clickable');
	const progressBar = fileUploader.children('.Form__FileUpload__Progress');
	const progressText = fileUploader.children('.Form__FileUpload__ButtonText');
	const buttonIcon = fileUploader.children('.fa');
	const hiddenValue = fileUploader.children('.Form__FileUpload__HiddenValue');
	const widthOfUploadButton = fileUploader.width();

	if (uploadPrompt) {
		$.ajax({
			data,
			url: '/manager/upload',
			method: 'POST',
			cache: false,
			contentType: false,
			processData: false,
			xhr() {
				const xhr = $.ajaxSettings.xhr();

				xhr.upload.onprogress = (evt) => {
					const percentage = Math.floor((evt.loaded / evt.total) * 100);
					progressBar.width(`${percentage}%`);
					progressText.html(`${percentage}%`);
					buttonIcon.hide();
				};

				xhr.upload.onload = () => {
					console.log('Upload complete.');
				};

				return xhr;
			},
			success(dataReturned) {
				hiddenValue.val(dataReturned.path.substr(6));
				fileUploader.siblings('.js-addfile').prop('disabled', true);
				fileUploader.css({
					cursor: 'default',
				});

				window.setTimeout(() => {
					progressText.animate({
						opacity: 0,
					}, 400, () => {
						progressText.css({
							width: widthOfUploadButton,
							whiteSpace: 'nowrap',
							textOverflow: 'ellipsis',
							overflow: 'hidden',
						});

						progressText.html(dataReturned.filename)
							.animate({
								opacity: 1,
							}, 400, () => {
								fileUploader.addClass('Form__FileUpload__Clickable--uploaded');
								fileUploader.attr('data-path', dataReturned.path);
							});
					});
				}, 2500);
			},
			error(err) {
				console.error(err);
			},
		});
	}
};
