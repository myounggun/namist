/**
 * 짤방 문제 API
 */
var express = require('express');
var app = module.exports = express();
var fs = require('fs');
var im = require('imagemagick');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var newPath = __dirname + "/images/";
var thumbPath = __dirname + "/thumbs/";

if(!fs.existsSync(newPath)){fs.mkdirSync(newPath);}
if(!fs.existsSync(thumbPath)){fs.mkdirSync(thumbPath);}

app.post('/api/upload/image', function(req, res){

	var tempFilePath = req.files.image.path;
	fs.readFile(req.files.image.path, function (err, data) {

		var imageName = req.files.image.name
		/// If there's an error
		if(!imageName){

			res.redirect("/api/upload/error");

		} else {

		  newPath = newPath + imageName;
		  thumbPath = thumbPath + imageName;

		  /// write file to uploads/fullsize folder
		  fs.writeFile(newPath, data, function (err) {
		  	/// let's see it

			res.redirect("/api/viewImage/list");


		  });

		}
	});

});
app.get('/api/upload/test', function(req, res){

	res.render("uploadTest");

});
app.get('/api/viewImage/list', function (req, res){

	var list = [];
	getFiles(__dirname + "/images/", list);
	res.render("list", {list:list});

});
app.get('/api/upload/error', function(req, res){

	res.render("uploadError");

});
app.get('/api/viewImage/:file', function (req, res){
	file = req.params.file;
	fs.readFile(__dirname + "/images/" + file, function(err, data){
		if(err){
			res.status(404).render('NotFoundImage');
			return;
		}
		res.writeHead(200, {'Content-Type': 'image/jpg' });
		res.end(data);
	});
});
app.get('/api/deleteImage/:file', function (req, res){
	 file = req.params.file;
	 var newPath = __dirname + "/images/" + file;
	 if (fs.existsSync(newPath)) {
	    fs.unlink(newPath, function (err) {
	      if (err) response.errors.push("Erorr : " + err);
	      res.redirect("/api/viewImage/list");
	    });
	 }else{

		 res.redirect("/api/viewImage/list");
	 }

});

function getFiles(dir, list){
    var files = fs.readdirSync(dir);
    for(var i in files){
        if (!files.hasOwnProperty(i)) continue;
        var fullPath = dir + files[i];
        if (fs.statSync(fullPath).isDirectory()){
            getFiles(fullPath, list);
        }else{
            list.push({
            	name : files[i],
            	path : fullPath
            });

        }
    }
}

