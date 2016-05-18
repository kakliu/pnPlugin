(function() {
  var tpl = '<div>\
	<ul>\
		<li>石超</li>\
	</ul>\
</div>';

  // cmd
  if (typeof module !== "undefined" && module.exports) {
      module.exports = tpl;
  }
  // amd
 if (typeof define === "function" && (define.amd||define.fmd)) {
      define("./basic1.tpl", [], function () {
          return tpl;
      });
  }
})();