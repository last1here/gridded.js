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

			this.placeItems();
		},

		placeItems: function () {
			var that = this;
			largestPushDown = 0;

			var that = this, rn = 0, cn = 0, ic = 1;
			var grid = new Array([]);

			// create grid
			for (var cl = this.col - 1; cl >= 0; cl--) {
				grid[cl] = new Array();
			}

			this.element.css("position", "relative");
			this.element.find(this.items).each(function() {
				var i = $(this), pos = {}, placed = false, row = 0;

				if (!i.data('w')) 
					i.data('w', 1);
				else if (i.data('w') > that.col) 
					i.data('w', that.col);

				if (!i.data('h'))
					i.data('h', i.data('w'));

				while (placed == false) {
					for (var c = 0; c <= that.col - 1 ; c++) {
						var empty = true;
						for (var w = 0; w <= i.data('w') - 1 ; w++) {
							pushCol = Number(c+w);
							pushRow = Number(row+w);

							if (pushCol < that.col) {
								if(grid[pushCol][row] != null && grid[c][pushRow] != null) {
									empty = false;
								}
							} else {
								empty = false;
							}
						}

						if(empty == true) {
							for (var w = 0; w <= i.data('w') - 1 ; w++) {
								for (var h = 0; h <= i.data('h') - 1 ; h++) {
									grid[Number(c+w)][Number(row + h)] = 1;
								}
							}

							i.data('pr', c);
							i.data('pd', row);
							i.data('data-ic', ic);

							var itemWidth = i.data('w') * that.colWidth - that.gutter;
							itemWidth = itemWidth - parseInt(i.css("border-left-width")) - parseInt(i.css("border-right-width"));
							itemWidth = itemWidth - parseInt(i.css("padding-left")) - parseInt(i.css("padding-right"));

							var itemHeight = i.data('h') * that.colWidth - that.gutter;
							itemHeight = itemHeight - parseInt(i.css("border-top-width")) - parseInt(i.css("border-bottom-width"));
							itemHeight = itemHeight - parseInt(i.css("padding-top")) - parseInt(i.css("padding-bottom"));

							i.css("position", "absolute");
							i.width(itemWidth);
							i.height(itemHeight);

							i.css("left", c * that.colWidth + parseInt(that.element.css("padding-left")));
							i.css("top", row * that.colWidth + parseInt(that.element.css("padding-top")));
							if(largestPushDown < (row + i.data('h')))
								largestPushDown = row + Number(i.data('h'));

							placed = true;
							break;
						}
					}
					row += 1;
				}



				ic++;
			});

			this.element.css("height", largestPushDown * this.colWidth - this.gutter + parseInt(this.element.css('padding-top'))  + parseInt(this.element.css('padding-bottom')) );
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