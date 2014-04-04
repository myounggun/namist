/**
 * GM (GraphicaMagick)
 * brew install graphicsmagick
 * npm install graphicsmagick
 */
var gm = require('gm')
	, path = require('path')
	, fs = require('fs');

var clientPath = path.join(__dirname, '../../../../client/');

function test(req, res) {
	var title = req.query.title || '소프트웨어 과장';
	
	var srcPath = clientPath + 'images/sw.jpg';
	var dstPath = clientPath + 'images/sw_dst.jpg';
	
//	res.redirect("/images/sw_dst.jpg");
	
	
	// annotate an image
	gm(srcPath)
	.stroke("#000000")
	.strokeWidth('1')
	.font(clientPath + "fonts/BM-HANNA.ttf", 40)
	.fill('#ffffff')
	.drawText(10, 40, title)
	.write(dstPath, function (err) {
		if (err) console.log(err);
		
		res.render('index', {
			locals: {
				title   : 'processing',
				dstPath : '/images/sw_dst.jpg'
			},
			cache: false
		});
	});

	// resize
//	gm(srcPath)
//	.resize(24, 24)
//	.noProfile()
//	.write(dstPath, function (err) {
//		if (err) console.log(err);
//		
//		res.render('index', {
//			locals: {
//				title   : 'processing',
//				dstPath : '/images/sw_dst.jpg'
//			},
//			cache: false
//		});
//	});
}

exports.test = test;
