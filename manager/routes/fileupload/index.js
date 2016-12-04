let express         = 	require('express');
let router 			= 	express.Router();
let multer 			= 	require('multer');
let upload 			= 	multer({ dest: './uploads/' }).single('photo');

router.post('/', (req, res, next) => {
	upload(req, res, (err) => {
		if (err){
			res.json(err);
		} else {
			res.json(req.file);
		}		
	});
});

module.exports = router;