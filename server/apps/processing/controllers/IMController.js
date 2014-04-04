/**
 * IM (ImageMagick)
 */
var im = require('imagemagick');
var path = require('path');

var imagePath = path.join(__dirname, '../../../../client/images/sw.jpg');

function test(req, res) {
	im.identify(imagePath, function(err, features){
	  if (err) throw err;
	  
	  	res.json(features);
//		res.render('index', {
//			locals: {
//				title     : 'image processing',
//				imagePath : imagePath,
//				features  : features // { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
//			},
//			cache: false
//		});
	});
}

exports.test = test;
