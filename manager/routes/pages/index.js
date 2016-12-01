let express         = 	require('express');
let router 			= 	express.Router();

router.get('/', (req, res, next) => {
	res.render('pages/index.pug');
});

router.use('/create', require('./page.create.js'));

module.exports = router;