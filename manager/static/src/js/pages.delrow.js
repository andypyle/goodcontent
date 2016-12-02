import $ from 'jquery';
import jQuery from 'jquery';
window.$ = $;
window.jQuery = jQuery;

exports.delRow = function(e){
	e.preventDefault();
	$(this).parent().parent().slideUp(350, () => {
		return $(this).remove();
	});
};