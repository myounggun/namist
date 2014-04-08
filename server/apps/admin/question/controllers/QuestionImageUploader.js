/**
 * 문제 출제 시 짤방 이미지 업르드 처리
 * - 원본 이미지 저장
 * - 원본 리사이즈하여 섬네일 생성 후 저장
 * - 이미지와 섬네일 경로 반환
 */
var fs = require('fs'),
	path = require('path'),
	async = require('async'),
	gm = require('gm'),
	CLIENT_PATH = path.join(__dirname, '../../../../../client'),
	IMAGE_BASE_PATH = CLIENT_PATH + "/images/",
	THUMB_BASE_PATH = CLIENT_PATH + "/thumbs/",
	IMAGE_TYPES = /\.(gif|jpe?g|png)$/i,
	THUM_SIZE = 70,
	IS_NOT_IMAGE_FILE_FORMAT = 'is_not_image_file_format';

/**
 * interface
 */
exports.uploadImage = uploadImage;
exports.deleteImage = deleteImage;

/**
 * handlers
 */
function uploadImage(files, done) {
    async.waterfall([
         readImageFile.bind(null, files),
         saveImageFile,
         createThumbFile
     ],
     function (err, filename) {
    	if (err) throw err;
    	
		var imageURL = '/images/' + filename;
		var thumbURL = '/thumbs/' + filename;
    	
    	done(filename, imageURL, thumbURL);
     });
}

function deleteImage(filename, done) {
	console.log('del');
}

/**
 * methods
 */
function readImageFile(files, callback) {
	var filename = files.image.name,
		filePath = files.image.path;
	
	if (!IMAGE_TYPES.test(filename)) {
		callback(IS_NOT_IMAGE_FILE_FORMAT);
	}
	
	fs.readFile(filePath, function (err, data) {
		if (err) callback(err);

		callback(null, filename, data);
	});
}

function saveImageFile(filename, data, callback) {
	var names = splitFileExtension(filename),
		timestamp = +(new Date()),
		filename = names[0] + '_' + timestamp + '.' + names[1],
		savePath = IMAGE_BASE_PATH + filename;
	
	fs.writeFile(savePath, data, function (err) {
		if (err) callback(err);
		
		callback(null, filename, data);
	});
}

function createThumbFile(filename, data, callback) {
	var srcPath = IMAGE_BASE_PATH + filename;
	var dstPath = THUMB_BASE_PATH + filename;
	
	gm(srcPath)
	.resize(THUM_SIZE, THUM_SIZE)
	.noProfile()
	.write(dstPath, function (err) {
		if (err) callback(err);
		
		callback(null, filename);
	});
}

function splitFileExtension(filename) {
    var idx = filename.lastIndexOf('.');

    if (idx === -1) {
        return [filename, ""];
    } else {
        return [filename.substr(0, idx), filename.substr(idx)];
    }
}