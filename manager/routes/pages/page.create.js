const express			= 	require('express');

const router 			= 	express.Router();

router.get('/', (req, res, next) => {
	res.render('pages/page.create.pug');
});

router.post('/', (req, res, next) => {
	const {
		name,
		slug,
		template,
		fieldtype,
		fieldname,
		fieldvalue,
	} = req.body;

	const page = {};
	page.content = {};
	if (fieldname instanceof Array) {
		fieldname.forEach((e, i) => {
			page.content[e] = {
				type: fieldtype[i],
				value: fieldvalue[i],
			};
		});
	} else {
		page.content[fieldname] = {
			value: fieldvalue,
			type: fieldtype,
		};
	}

	page.name = name;
	page.slug = slug;
	page.template = template;

	res.json(page);
});

module.exports = router;
