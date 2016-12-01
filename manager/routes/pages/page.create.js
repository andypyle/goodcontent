let express         = 	require('express');
let router 			= 	express.Router();

router.get('/', (req, res, next) => {
	res.render('pages/page.create.pug');
});

module.exports = router;