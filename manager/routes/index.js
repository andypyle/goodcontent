const express		= 	require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
	res.render('index', { title: 'Manager Section' });
});

router.use('/pages', require('./pages/index.js'));
router.use('/upload', require('./fileupload/index.js'));

module.exports = router;
