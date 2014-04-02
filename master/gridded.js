/**
 * Gridded
 * A lightweight jQuery plugin create a tile based grid
 *
 * Licensed under the MIT license.
 * Copyright 2013 Ashley Burgess
 * https://github.com/last1here
 */
!function ($) {
	var gridded = function (element, options) {

		this.element = element;
		this.setOptions(options);

		that = this;
		$(window).on('resize',function () {
			that.resized();
		});

	};

	gridded.prototype = {
		constructor: gridded,

		setOptions: function(options) {
			this.gutter = 10;
			this.col = 5;
			this.items = '.item';
			this.fadeIn = false;

			if (typeof this.element.data('gut') == "number")
				this.gutter = this.element.data('gut');

			if (typeof this.element.data('col') == "number")
				this.col = this.element.data('col');


			if (typeof this.element.data('items') == "string")
				this.items = this.element.data('items');

			if (typeof options == 'object') {
				if (typeof options.gutter == 'number')
					this.gutter = options.gutter;

				if (typeof options.col == 'number')
					this.col = options.col;

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
			console.log( '1' +this.width);
			this.colWidth = this.width / this.col;

			this.plotItems();
			this.placeItems();
		},

		placeItems: function () {
			var that = this;
			largestPushDown = 0;
			this.element.css("position", "relative");
			this.element.find(this.items).each(function() {
				var i = $(this);
				if (!i.data('w')) {
					i.data('w', 1);
				}

				if (!i.data('h')) {
					i.data('h', i.data('w'));
				}

				// calculate width
				var itemWidth = i.data('w') * that.colWidth - that.gutter;
				itemWidth = itemWidth - parseInt(i.css("border-left-width")) - parseInt(i.css("border-right-width"));
				itemWidth = itemWidth - parseInt(i.css("padding-left")) - parseInt(i.css("padding-right"));

				var itemHeight = i.data('w') * that.colWidth - that.gutter;
				itemHeight = itemHeight - parseInt(i.css("border-top-width")) - parseInt(i.css("border-bottom-width"));
				itemHeight = itemHeight - parseInt(i.css("padding-top")) - parseInt(i.css("padding-bottom"));

				i.css("position", "absolute");

				i.width(itemWidth);
				i.height(itemHeight);

				i.css("left", i.data('pr') * that.colWidth + parseInt(that.element.css("padding-left")));
				i.css("top", i.data('pd') * that.colWidth + parseInt(that.element.css("padding-top")));

				if(largestPushDown < (i.data('pd') + i.data('w')))
					largestPushDown = Number(i.data('pd')) + Number(i.data('h'));
			});

			this.element.css("height", largestPushDown * this.colWidth - this.gutter + parseInt(this.element.css('padding-top'))  + parseInt(this.element.css('padding-bottom')) );
		},

		plotItems: function() {
			var that = this, rn = 0, cn = 0, ic = 1;
			var grid = new Array([]);
			var row = 0;

			// create grid
			for (var cl = this.col - 1; cl >= 0; cl--) {
				grid[cl] = new Array();
			}

			this.element.find(this.items).each(function() {
				var i = $(this), width, push = {}, placed = false, r = 0;
				if (i.data('w')) {
					if (i.data('w') > that.col) {
						i.data('w', that.col);
					}
					width = i.data('w');
				} else {
					width = 1;
					i.data('w', 1);
				}

				while (placed == false) {
					for (var c = 0; c <= that.col - 1 ; c++) {
						var empty = true;
						for (var w = 0; w <= width - 1 ; w++) {
							pushCol = Number(c+w);
							pushRow = Number(r+w);

							if (pushCol < that.col) {
								if(grid[pushCol][r] != null && grid[c][pushRow] != null) {
									empty = false;
								}
							} else {
								empty = false;
							}
						}

						if(empty == true) {
							push.col = c;
							push.row = r;
							for (var w = 0; w <= width - 1 ; w++) {
								for (var w2 = 0; w2 <= width - 1 ; w2++) {
									grid[Number(c+w)][Number(r+w2)] = 1;
								}
							}
							placed = true;
							break;
						}
					}
					r += 1;
				}

				i.data('pr', push.col);
				i.data('pd', push.row);
				i.attr('data-ic', ic);

				ic++;
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