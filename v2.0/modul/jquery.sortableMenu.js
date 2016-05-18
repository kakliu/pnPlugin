/*
 * HTML5 Sortable jQuery Plugin
 * http://farhadi.ir/projects/html5sortable
 * 
 * Copyright 2012, Ali Farhadi
 * Released under the MIT license.
 * download by www.sucaijiayuan.com
 */
(function($) {
var dragging, placeholders = $();
var timeoutId;
var top;
var index;
var parent;
$.fn.sortableMenu = function(options) {
	var method = String(options);
	options = $.extend({
		connectWith: false
	}, options);
	return this.each(function() {
		if (/^enable|disable|destroy$/.test(method)) {
			var items = $(this).children($(this).data('items')).attr('draggable', method == 'enable');
			$('.menu .menu_body ul.sucaijiayuan-list').attr('draggable', method == 'enable');
			$('.menu .menu_head').attr('draggable', method == 'enable');
			if (method == 'destroy') {
				items.add(this).removeData('connectWith items')
					.off('dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s');
			}
			return;
		}
		var isHandle, items = $(this).children(options.items);
		var placeholder = $('<' + (/^ul|ol$/i.test(this.tagName) ? 'li' : 'div') + ' class="sortable-placeholder">');
		items.find(options.handle).mousedown(function() {
			isHandle = true;
		}).mouseup(function() {
			isHandle = false;
		});
		$(this).data('items', options.items)
		placeholders = placeholders.add(placeholder);
		if (options.connectWith) {
			$(options.connectWith).add(this).data('connectWith', options.connectWith);
		}
		items.attr('draggable', 'true').on('dragstart.h5s', function(e) {
			if (options.handle && !isHandle) {
				return false;
			}
			isHandle = false;
			var dt = e.originalEvent.dataTransfer;
			dt.effectAllowed = 'move';
			dt.setData('Text', 'dummy');
			index = (dragging = $(this)).addClass('sortable-dragging').index();
			parent = $(this).parent();
		}).on('dragend.h5s', function() {
			if (!dragging) {
				return;
			}
			dragging.removeClass('sortable-dragging').show();
			placeholders.detach();
			
			if (index != dragging.index()) {
				var data = {item: dragging}
				parent.trigger('sortupdate', {item: dragging});
			}
			
			if(!parent.is($(this).parent())){
				$(this).parent().trigger('sortupdate', {item: dragging});
			}
			dragging = null;
		}).not('a[href], img').on('selectstart.h5s', function() {
			this.dragDrop && this.dragDrop();
			return false;
		}).end().add([this, placeholder]).on('dragover.h5s dragenter.h5s drop.h5s', function(e) {
			if (!items.is(dragging) && options.connectWith !== $(dragging).parent().data('connectWith')) {
				return true;
			}
			if (e.type == 'drop') {
				e.stopPropagation();
				placeholders.filter(':visible').after(dragging);
				dragging.trigger('dragend.h5s');
				return false;
			}
			e.preventDefault();
			e.originalEvent.dataTransfer.dropEffect = 'move';
			if (items.is(this)) {
				if (options.forcePlaceholderSize) {
					placeholder.height(dragging.outerHeight());
				}
				dragging.hide();
				$(this)[placeholder.index() < $(this).index() ? 'after' : 'before'](placeholder);
				placeholders.not(placeholder).detach();
			} else if (!placeholders.is(this) && !$(this).children(options.items).length) {
				placeholders.detach();
				$(this).append(placeholder);
			}
			return false;
		});

		function initMenu(){
			$('.menu .menu_body ul.sucaijiayuan-list').on("dragenter.h5s", function(){
				var menuBody = $(this).parents(".menu_body");
				var data = menuBody.data("data");
				var indexN = $(this).find("li").index($(this).find(".sortable-placeholder"));
				var indexO = $(this).find("li").index($(this).find(".sortable-dragging"));

				var indexN = indexN < indexO?indexN+1:indexN-1;
				console.log(indexN, indexO);
				
				var top = data.top + indexN * 53;
				var bottom = (indexN - 4) * 53 + data.top;
				
				console.log(top, bottom);
				
				if(-53 < top && top < 60){
					menuBody.mCustomScrollbar("scrollTo", -(indexN - 2) * 53 < 0 ? -(indexN - 2) * 53 : 0);
				} else if(-53 <= bottom && bottom <= 60){
					menuBody.mCustomScrollbar("scrollTo", -(indexN - 3) * 53);
				}
			})
			
			$('.menu .menu_head').on("dragenter.h5s", function(){
				var self = $(this);
				var menuBody = $(this).parents(".menu").find(".menu_body");
				
				if(menuBody.find("li").length == 0){
					menuBody.find("ul").append(placeholder);
				}
				if(timeoutId && $(this).is(timeoutId.element)){
					return;
				} else if(timeoutId){
					clearTimeout(timeoutId.id);
					timeoutId = null;
				}
				
				var id = setTimeout(function(){
					self.click();
					timeoutId = null;
				}, 500);
				
				timeoutId = {
					id: id,
					element: this
				}
			})
		}

		if($(this).parents(".menu")[0]){
			initMenu();
		}
		
	});
};
})(jQuery);