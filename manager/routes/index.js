let express         = 	require('express');
let router 			= 	express.Router();

router.get('/', (req, res, next) => {
	res.render('index', {title: 'Manager Section'});
});

router.use('/pages', require('./pages/index.js'));



module.exports = router;