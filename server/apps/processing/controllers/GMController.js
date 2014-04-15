/**
 * GM (GraphicaMagick)
 * brew install graphicsmagick
 * npm install graphicsmagick
 */
var gm = require('gm').subClass({imageMagick: true}),
	path = require('path'),
	fs = require('fs'),
	async = require('async');

var FONT_SIZE = 40,
	CANVAS_MARGIN = 80;

var clientPath = path.join(__dirname, '../../../../client/');

function test(req, res) {
	var title   = req.query.title || '소프트웨어 과장';
	var srcPath = clientPath + 'images/sw.jpg';
	var dstPath = clientPath + 'images/sw_dst.jpg';

	async.waterfall([
   		function(callback) {
   			gm(srcPath)
   			.size(function (err, size) {
   				if (err) callback(err);
   					
   				callback(null, size);
   			});
   		},
   		function(size, callback) {
   			// annotate an image
   			// gravity : NorthWest|North|NorthEast|West|Center|East|SouthWest|South|SouthEast
   			gm(srcPath)
   			.gravity('Center') 
   			.extent(size.width + CANVAS_MARGIN / 2, size.height + CANVAS_MARGIN / 2)
   			.gravity('North') 
   			.extent(0, size.height + CANVAS_MARGIN)
   			.border(3, 3)
   			//.stroke("#333333", 2)
   			//.strokeWidth(2)
   			.font(clientPath + "fonts/BM-HANNA.ttf", FONT_SIZE)
   			.fill('#000000')
   			.drawText(0, CANVAS_MARGIN / 4, title, 'South')
   			.write(dstPath, function (err) {
   				if (err) callback(err);
   				
   				res.render('index', {
   					locals: {
   						title   : 'processing',
   						dstPath : '/images/sw_dst.jpg'
   					},
   					cache: false
   				});
   			});
   		}
   	], 
   	function (err, result) {
 		if (err) throw err;
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
