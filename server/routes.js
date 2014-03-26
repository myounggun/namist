/**
 * New node file
 */
module.exports = function (app) {
	var routeList = [
         require('./apps/main'),
         require('./apps/account'),
         require('./apps/admin/question'),
         require('./apps/verification'),
         require('./apps/tools') // 웹에서 접근가능한 편의상의 운영툴
     ];

	for (var i = 0; i < routeList.length; i++) {
		app.use(routeList[i]);
	}
};