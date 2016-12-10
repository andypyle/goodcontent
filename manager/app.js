const express					=		require('express');
const path						= 	require('path');
const managerRoutes		= 	require('./routes/index');

const app =	express();

// Admin gets its own static assets.
app.use('/manager', express.static('./manager/static'));

/* -----------------------------------*/
/*  Manager (admin) sub application   */
/* -----------------------------------*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.locals.pretty = '\t';

// GET /manager/
app.use('/manager', managerRoutes);

module.exports = app;
