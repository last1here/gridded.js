/*
*The MIT License (MIT)
*
*Copyright (c) 2014 - Ashley Burgess
*
*Permission is hereby granted, free of charge, to any person obtaining a copy
*of this software and associated documentation files (the "Software"), to deal
*in the Software without restriction, including without limitation the rights
*to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*copies of the Software, and to permit persons to whom the Software is
*furnished to do so, subject to the following conditions:
*
*The above copyright notice and this permission notice shall be included in all
*copies or substantial portions of the Software.
*
*THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*SOFTWARE.
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
			this.width = this.element.width() - this.gutter;
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
				
				if(i.data('pr') == 0)
					i.css("left", that.gutter);
				else 
					i.css("left", i.data('pr') * that.colWidth + that.gutter);
				
				if(i.data('pd') == 0) 
					i.css("top", that.gutter);
				else 
					i.css( "top", i.data('pd') * that.colWidth + that.gutter);
				
				if(largestPushDown < (i.data('pd') + i.data('w'))) 
					largestPushDown = Number(i.data('pd')) + Number(i.data('w'));
			});

			console.log(largestPushDown);

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
			var that = this, d = {}, pr = 0, pd = 0;
			this.element.find('.' + this.items).each(function() {
				var w = this.data('w');
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