let express         = 	require('express');
let router 			= 	express.Router();
let multer 			= 	require('multer');
let upload 			= 	multer({ dest: './uploads/' });

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
		fieldvalue
	} = req.body;

	let page = {};
	page.content = {};
	for(let i in fieldname){
		page.content[fieldname[i]] = {
			type: fieldtype[i],
			value: fieldvalue[i]
		}		
	}

	page.name = name;
	page.slug = slug;
	page.template = template;

	res.json(page);
})

module.exports = router;