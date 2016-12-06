import $ from 'jquery';
import jQuery from 'jquery';
window.$ = $;
window.jQuery = jQuery;

exports.addRow = function(e){
	e.preventDefault();
	$(this).parent().html(`<button class="Button Button--red js-delrow"><i class="fa fa-trash-o"></i></button>`);
	
	let rowsContainer = $('.js-formrows');
	let newRow = $(`
		<div class="Form__Row">
			<div class="Form__InputGroup Field__Type">
				<select class="Form__Select js-selecttype" name="fieldtype" id="fieldtype">
					<option value="shorttext">Short Text</option>
					<option value="paragraph">Paragraph</option>
					<option value="image">Image</option>
					<option value="video">Video Embed</option>
				</select>
			</div>
			<div class="Form__InputGroup Field__Name">
				<input class="Form__InputText" name="fieldname" id="fieldname" placeholder="Field Name">
			</div>
			<div class="Form__InputGroup Field__Value">
				<input class="Form__InputText" name="fieldvalue" id="fieldvalue" placeholder="Field Value">
			</div>
			<div class="Form__InputGroup--smaller">
				<button class="Button Button--blue js-addrow"><i class="fa fa-plus"></i></button>
			</div>
		</div>
		`);

	newRow.hide();

	rowsContainer.append(newRow);
	newRow.slideDown();
	newRow.children('.Field__Type').children('.Form__Select').focus();
};