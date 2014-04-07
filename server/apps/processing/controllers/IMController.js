/**
 * IM (ImageMagick)
 */
var im = require('imagemagick');
var path = require('path');
var fs = require('fs');

var imagePath = path.join(__dirname, '../../../../client/images/');

function test(req, res) {
//	im.identify(imagePath, function(err, features){
//	  if (err) throw err;
//	  
//	  	res.json(features);
//		res.render('index', {
//			locals: {
//				title     : 'image processing',
//				imagePath : imagePath,
//				features  : features // { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
//			},
//			cache: false
//		});
//	});
	
	var src = imagePath + 'sw.jpg';
	var dst = imagePath + 'sw_dst.jpg';

	// convert
	im.convert([src, '-resize', '25x120', dst], 
	function(err, stdout){
		if (err) throw err;

		res.redirect("/images/sw_dst.jpg");
	});
	
	return;
	
	// composite
	im.composite(['-watermark','30%','-gravity','SouthEast','watermark.png','input.png'], 
	function(err, metadata){
	  if (err) throw err
	  console.log('stdout:', stdout);
	});
			
	return;
	
	// resize
  	im.resize({
  	  srcData: fs.readFileSync(src, 'binary'),
  	  width: 128
  	}, function(err, stdout, stderr){
  	  if (err) throw err;
  	  
  	  fs.writeFileSync(imagePath + 'sw_128.jpg', stdout, 'binary');
  	  res.send(imagePath + 'sw_128.jpg');
  	});
}

exports.test = test;
