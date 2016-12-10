const express 			= require('express');
const path 					= require('path');
const logger 				= require('morgan');
const cookieParser 	= require('cookie-parser');
const bodyParser 		= require('body-parser');

// Main site routes.
const index 				= require('./routes/index');

// Manager (admin) subapp.
const manager 			= require('./manager/app.js');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.locals.pretty = '\t';

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);

app.use(manager);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use((err, req, res, next) => {
		// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

		// render the error page
	res.status(err.status || 500);
	res.render('error');
});

app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), () => {
	console.log(`Express server listening on port ${server.address().port}`);
});
// module.exports = app;
