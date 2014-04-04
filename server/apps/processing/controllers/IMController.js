/**
 * IM (ImageMagick)
 */
var im = require('imagemagick');
var path = require('path');

var imagePath = path.join(__dirname, '../../../../client/images/sw.jpg');

function test(req, res) {
	res.render('index', {
		locals: {
			title : 'image processing',
			imagePath : imagePath
		},
		cache: false
	});
	
	return;

	im.identify(imagePath, function(err, features){
	  if (err) throw err;
	  console.log(features);
	  // { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
	});
	
	easyimg.info(imagePath, function(err, stdout, stderr) {
	  if (err) throw err;
	  console.log(stdout);
	});
}

exports.test = test;
