let express         = 	require('express');
let router 			= 	express.Router();
let multer 			= 	require('multer');
let mime 			= 	require('mime');
let slugify 		= 	require('../../static/src/js/helper.slugify.js');

let diskStorage  	= 	multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/uploads')
	},
	filename: (req, file, cb) => {
		let originalFileTrim = slugify(file.originalname.replace(/(?!.*[.](?:jpg|jpeg|gif|png)$).*/,''));
		cb(null, `${originalFileTrim}-${Date.now()}.${mime.extension(file.mimetype)}`)
	}
});

let upload 			= 	multer({ storage: diskStorage }).single('image');



router.post('/', (req, res, next) => {
	upload(req, res, (err) => {
		if (err){
			console.log(err);
			res.json(err);
		} else {
			res.json(req.file);
		}		
	});
});

module.exports = router;