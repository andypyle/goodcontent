const express		= 	require('express');
const multer		= 	require('multer');
const mime			= 	require('mime');
const slugify		= 	require('../../static/src/js/helper.slugify.js');

const router		= 	express.Router();

const diskStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/uploads');
	},
	filename: (req, file, cb) => {
		const originalFiconstrim = slugify(file.originalname.replace(/(?!.*[.](?:jpg|jpeg|gif|png)$).*/, ''));
		cb(null, `${originalFiconstrim}-${Date.now()}.${mime.extension(file.mimetype)}`);
	},
});

const upload = multer({ storage: diskStorage }).single('image');

router.post('/', (req, res, next) => {
	upload(req, res, (err) => {
		if (err) {
			console.log(err);
			res.json(err);
		} else {
			res.json(req.file);
		}
	});
});

module.exports = router;
