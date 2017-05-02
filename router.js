module.exports = function(app, socket) {
	require('./routing/forms')(app);
	require('./routing/students')(app);
	require('./routing/login')(app);
	require('./routing/dashboard')(app, socket);
}