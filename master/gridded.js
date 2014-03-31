/**
 * Gridded
 * A lightweight jQuery plugin create a tile based grid
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Ashley Burgess
 * https://github.com/last1here
 */
!function ($) {
	var gridded = function (element, options) {

		this.element = element;
		this.setOptions(options);
		t = this;

		$(window).on('resize',function () {
			t.resized();
		});

	};
	
	gridded.prototype = {
		constructor: gridded,
		
		setOptions: function(options) {
			this.gutter = 10;
			this.col = 5;
			this.autoSimple = false;
			this.items = 'item';
			
			if (typeof this.element.data('gut') == "number")
				this.gutter = this.element.data('gut');

			if (typeof this.element.data('col') == "number")
				this.col = this.element.data('col');

			if (typeof this.element.data('auto') == "boolean")
				this.autoSimple = this.element.data('auto');

			if (typeof this.element.data('items') == "string")
				this.items = this.element.data('items');

			if (typeof options == 'object') {
				if (typeof options.gutter == 'number')
					this.gutter = options.gutter;

				if (typeof options.col == 'number')
					this.col = options.col;

				if (typeof options.auto == 'boolean')
					this.autoSimple = options.auto;

				if (typeof options.items == 'string')
					this.items = options.items;
			}

			this.setWidths();
		},

		// todo add delay on resize
		resized: function  () {
			this.setWidths();
		},	

		setWidths: function () {
			this.width = this.element.width() + this.gutter;
			this.colWidth = this.width / this.col;
			
			if (this.autoSimple) 
				this.simpleAutoPlot();

			this.setItemWidths();
		},

		setItemWidths: function () {
			var that = this;
			largestPushDown = 0;
			this.element.css("position", "relative");
			this.element.find('.' + this.items).each(function() {
				var i = $(this);
				i.css("position", "absolute");
				i.width(i.data('w') * that.colWidth - that.gutter);
				i.height(i.data('w') * that.colWidth - that.gutter);
				
				console.log(that.element.css("padding-left"));

				if(i.data('pr') == 0)
					i.css("left", that.element.css("padding-left"));
				else 
					i.css("left", i.data('pr') * that.colWidth + parseInt(that.element.css("padding-left")));
				
				if(i.data('pd') == 0) 
					i.css("top", that.gutter);
				else 
					i.css( "top", i.data('pd') * that.colWidth + that.gutter);
				
				if(largestPushDown < (i.data('pd') + i.data('w'))) 
					largestPushDown = Number(i.data('pd')) + Number(i.data('w'));
			});

			this.element.css("height", largestPushDown * this.colWidth + this.gutter);
		},

		simpleAutoPlot: function() {
			var that = this, pr = 0, pd = 0;
			this.element.find('.' + this.items).each(function() {
				var i = $(this);
				i.data('w', '1');
				i.data('pr', pr);
				i.data('pd', pd);
				pr++;
				if(pr > that.col - 1) {
					pr = 0;
					pd++;
				}
			});
		},

		advancedAutoPlot: function() {
			var that = this, pr = 0, pd = 0;

			var d = [[1,2],[3,4],[5,6]];
			console.log(d);
			this.element.find('.' + this.items).each(function() {
				var width = this.data('w');
			});
		}
	};
	
	// jQuery fn
	$.fn.gridded = function(options) {
		var el = $(this);
			if (el.data('gridded'))
				el.removeData('gridded');
			el.data('gridded', new gridded(el, options));
		return this;
	};

}(window.jQuery);