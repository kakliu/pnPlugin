(function() {
  var tpl = '<div class="comment">\
	<div class="comment_bg">\
		<div class="comment_pic">\
			<img src="<%=pic%>">\
		</div>\
		<div class="comment_content"><%=content%></div>\
	</div>\
	<i class="comment_line"></i>\
</div>';

  // cmd
  if (typeof module !== "undefined" && module.exports) {
      module.exports = tpl;
  }
  // amd
 if (typeof define === "function" && (define.amd||define.fmd)) {
      define(function () {
          return tpl;
      });
  }
})();