const $ = window.$;

exports.delRow = function delRow(e) {
	e.preventDefault();
	$(this).parent().parent().slideUp(350, () => $(this).parent().parent().remove());
};
