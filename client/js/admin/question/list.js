/*global jqPagination, jquery $*/
(function ($) {
	var elPagination = $('._pagination');
	
	elPagination.jqPagination({
		paged: function(page) {
			console.log(page);
			window.location.href = '/admin/question/?page=' + page;
		}
	 });

}(jQuery));