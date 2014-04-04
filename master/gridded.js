/**
 * Gridded
 * A lightweight jQuery plugin create a tile based grid
 *
 * Licensed under the MIT license.
 * Copyright 2013 Ashley Burgess
 * https://github.com/last1here
 */
!function ($) {

	"use strict";

	var defaults = {
		gutter: 10,
		numOfCols: 5,
		items: '.item',
		fadeIn: false,
		randomSize: true,
		breakPoints: {
			mobile: 480,
			tablet: 780
		}
	};

	var gridded = function (element, options) {
		var that = this;
		this.element = element;
		this.window = $(window);

		this.options = $.extend({}, defaults, options);
		if ($.isPlainObject(this.element.data('gridded')))
			this.options = $.extend({}, this.options, this.element.data('gridded'));

		this.getWidths();

		if (this.options.randomSize)
			this.setRandomWidths();
		this.placeItems();

		this.window.on('resize',function () {
			that.getWidths();
			that.placeItems();
		});
	};

	gridded.prototype = {
		constructor: gridded,

		/* todo add delay on resize
		resized: function  () {
			this.setWidths();
		},*/

		getWidths: function () {
			if (typeof this.options.numOfCols == 'object') {
				if (this.window.width() <= this.options.breakPoints.mobile && this.options.numOfCols.mobile) {
					this.options.col = this.options.numOfCols.mobile;
				} else if (this.window.width() <= this.options.breakPoints.tablet && this.options.numOfCols.tablet) {
					this.options.col = this.options.numOfCols.tablet;
				} else {
					this.options.col = this.options.numOfCols.desktop;
				}
			} else {
				this.options.col = this.options.numOfCols;
			}

			this.width = this.element.width() + this.options.gutter;
			this.colWidth = this.width / this.options.col;
		},

		setRandomWidths: function () {
			var that = this;
			console.log('rand');
			this.element.find(this.options.items).each(function() {
				var i = $(this), n = Math.floor(Math.random() * (Math.round(that.options.col/2) - 1 + 1) + 1);

				if (!i.data('w') && !i.data('h')) {
					i.data('w', n);
					i.data('h', n);
				}
			});
		},

		placeItems: function () {
			var that = this, ic = 1, largestPushDown = 0, grid = new Array([]);

			// create grid
			for (var cl = this.options.col - 1; cl >= 0; cl--) {
				grid[cl] = new Array();
			}

			this.element.css("position", "relative");
			this.element.find(this.options.items).hide().each(function() {
				var i = $(this), placed = false, row = 0, pushCol, pushRow;

				if (!i.data('w'))
					i.data('w', 1);
				else if (i.data('w') > that.options.col)
					i.data('w', that.options.col);

				if (!i.data('h'))
					i.data('h', i.data('w'));

				while (placed == false) {
					for (var c = 0; c <= that.options.col - 1 ; c++) {
						var empty = true;
						for (var w = 0; w <= i.data('w') - 1 ; w++) {
							pushCol = Number(c+w);
							for (var h = 0; h <= i.data('h') - 1 ; h++) {
								pushRow = Number(row+h);
								if (pushCol < that.options.col) {
									if(grid[pushCol][pushRow] != null ) {
										empty = false;
									}
								} else {
									empty = false;
								}
								if(empty == false)
									break;
							}
							if(empty == false)
								break;
						}

						if(empty == true) {
							for (var w = 0; w <= i.data('w') - 1 ; w++) {
								for (var h = 0; h <= i.data('h') - 1 ; h++) {
									grid[Number(c+w)][Number(row + h)] = 1;
								}
							}

							var itemWidth = i.data('w') * that.colWidth - that.options.gutter;
							itemWidth -=  parseInt(i.css("border-left-width")) + parseInt(i.css("border-right-width")) + parseInt(i.css("padding-left")) + parseInt(i.css("padding-right"));

							var itemHeight = i.data('h') * that.colWidth - that.options.gutter;
							itemHeight -= parseInt(i.css("border-top-width")) + parseInt(i.css("border-bottom-width")) + parseInt(i.css("padding-top")) + parseInt(i.css("padding-bottom"));

							i.data('pr', c).data('pd', row).data('data-ic', ic);
							i.css("position", "absolute").width(itemWidth).height(itemHeight).css("left", c * that.colWidth + parseInt(that.element.css("padding-left"))).css("top", row * that.colWidth + parseInt(that.element.css("padding-top")));

							if (that.options.fadeIn)
								i.delay(1000).fadeIn("slow");
							else
								i.show();

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

			this.element.css("height", largestPushDown * this.colWidth - this.options.gutter + parseInt(this.element.css('padding-top'))  + parseInt(this.element.css('padding-bottom')) );
			this.grid = grid;
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