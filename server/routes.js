/**
 * New node file
 */
module.exports = function (app) {
	var routeList = [
         require('./apps/main'),
         require('./apps/account'),
         require('./apps/admin/question')
         
     ];
	
	for (var i = 0; i < routeList.length; i++) {
		app.use(routeList[i]);
	}
};