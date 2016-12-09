const $ = window.$;

exports.selectType = function selectType(e) {
	const valueField = $(this).parent().siblings('.Field__Value');
	const currentRow = $(this).parent().parent();
	const currentRowIndex = currentRow.index();

	const html = {
		shorttext: `
			<input class="Form__InputText" name="fieldvalue" id="fieldvalue-${currentRowIndex}" placeholder="Field Value">
		`,
		paragraph: `
			<textarea class="Form__TextArea" name="fieldvalue" id="fieldvalue-${currentRowIndex}" placeholder="Field Value"></textarea>
		`,
		image: `
			<input class="Form__FileUpload js-addfile" type="file" name="image" id="${currentRowIndex}" accept=".jpg,.jpeg,.png,.gif">
			<label class="Form__FileUpload__Clickable" for="${currentRowIndex}">
				<i class="fa fa-upload"></i>
				<span class="Form__FileUpload__ButtonText">Select File</span>
				<span class="Form__FileUpload__Progress"></span>
				<input class="Form__FileUpload__HiddenValue" type="hidden" name="fieldvalue" value="">
			</label>
		`,
		video: `
			<input class="Form__InputText" name="fieldvalue" id="fieldvalue" placeholder="Embed URL">
		`,
	};

	switch (e.target.value) {
	case 'shorttext':
		return valueField.html(html.shorttext);
	case 'paragraph':
		currentRow.toggleClass('Form__Row--baseline');
		return valueField.html(html.paragraph);
	case 'image':
		return valueField.html(html.image);
	case 'video':
		return valueField.html(html.video);
	default:
		return valueField.html(html.shorttext);
	}
};
