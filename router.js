module.exports = function(app) {
	require('./routing/forms')(app);
	require('./routing/students')(app);
	require('./routing/login')(app);
}