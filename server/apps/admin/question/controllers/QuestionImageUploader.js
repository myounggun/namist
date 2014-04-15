/**
 * 문제 출제 시 짤방 이미지 업르드 처리
 * 1) 업로드 처리 
 * - 원본 이미지 저장
 * - 원본 이미지를 리사이즈하여 섬네일 생성 후 저장 (GraphicsMagick 사용)
 * - 이미지와 섬네일 경로 반환
 * 
 * 2) 삭제 처리 
 * - 원본/섬네일 이미지 삭제
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
	IS_NOT_IMAGE_FILE_FORMAT = 'is_not_image_file_format',
	IMAGE_NOT_FOUND = 'image_not_found';

/**
 * interface
 */
exports.uploadImage = uploadImage;
exports.removeImage = removeImage;

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
    	if (err) done(err);

		var imageURL = '/images/' + filename;
		var thumbURL = '/thumbs/' + filename;

    	done(null, imageURL, thumbURL);
     });
}

function removeImage(urls, done) {
	var index = 0;
	
    async.whilst(
        function () { return index < urls.length; },
        function (callback) {
        	var url = CLIENT_PATH + urls[index++];
        	if (!url) {
        		callback(IMAGE_NOT_FOUND);
        	}

        	fs.exists(url, function (exists) {
        		if (exists) {
        			fs.unlink(url, function (err) {
        				if (err) callback(err);

        				callback(null);
        			});
        		} else {
        			callback(IMAGE_NOT_FOUND);
        		}
        	});
        },
        function (err, urls) {
        	if (err) {
                done(err);
            } else {
                done();
            }
        	

        }
    );
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
		if (err) {
            callback(err);
        } else {
            callback(null, filename, data);
        }


	});
}

function saveImageFile(filename, data, callback) {
	var names = splitFileExtension(filename),
		timestamp = +(new Date()),
		filename = names[0] + '_' + timestamp + names[1],
		savePath = IMAGE_BASE_PATH + filename;
	
	fs.writeFile(savePath, data, function (err) {
		if (err) {
            callback(err);
        } else {
            callback(null, filename, data);
        }


	});
}

function createThumbFile(filename, data, callback) {
	var srcPath = IMAGE_BASE_PATH + filename;
	var dstPath = THUMB_BASE_PATH + filename;
	
	gm(srcPath)
	.resize(THUM_SIZE, THUM_SIZE)
	.noProfile()
	.write(dstPath, function (err) {
		if (err) {
            callback(err);
        } else {
            callback(null, filename);
        }
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