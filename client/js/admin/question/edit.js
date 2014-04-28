/*global, jquery $*/
(function ($) {

    $('._image').change(onImageFileSelect);
    
    function onImageFileSelect(e) {
        if (!window.File || !window.FileReader || !window.FileList) {
            return;
        }
        
        var target = $(e.currentTarget),
            elImageHodler = target.parent(),
            elImagePreview = elImageHodler.find('._imagePreview'),
            elImageOutput  = elImageHodler.find('._imageOutput'),
            files = target[0].files,
            output = [];
        
        elImagePreview.empty();
        for (var i = 0, f; f = files[i]; i++) {
            if (!f.type.match('image.*')) {
                output.push('<li><span style="color:#FF0000; font-face:Tahoma; font-size:8pt;">이미지 파일 포멧이 아닙니다.</span></li>');
                continue;
            }

            output.push('<li><sapn style="font-face:Tahoma; font-size:8pt;">',
                    '<strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                    f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                    '</span></li>');
            
            var reader = new FileReader();
            
            reader.onload = (function(f) {
                return function(e) {
                    elImagePreview.append('<img src="' + e.target.result + '" style="height: 75px;  border: 1px solid #000; margin: 10px 5px 0 0;"/>');
                };
            })(f);
            
            reader.readAsDataURL(f);
        }
        
        elImageOutput.empty();
        elImageOutput.append('<ul>' + output.join('') + '</ul>');
    }
}(jQuery));