/*!
 * gridded.js
 * A lightweight jQuery plugin to create a tile based grid.
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
        numOfRows: null,
        items: '',
        fadeIn: false,
        fadeInSpeed: "slow",
        fadeInDelay: 1000,
        randomSize: false,
        breakPoints: {
            mobile: 480,
            tablet: 780
        },
        fit: true,
        widthAttr: "w",
        heightAttr: "h",
        onresize: null
    };

    var Gridded = function (element, options) {
        var _self = this;
        this.element = element;

        // Combine provided options with defaults.
        this.options = $.extend({}, defaults, options);

        // Options can be stored in data-gridded attribute as object. Requires work;
        if ($.isPlainObject(this.element.data("gridded")))
            this.options = $.extend({}, this.options, this.element.data("gridded"));

        // Gather the size of the grid in items, eg 2x4 and get the width of the items.
        this.getSizes();
        // If we are randomly positioning items do that now.
        if (this.options.randomSize) this.setRandomSizes();
        // Place the grid items.
        this.placeItems();

        // Bind the resize event to allow for a responsive grid.
        $(window).on("resize.gridded", $.proxy(this.resized, _self));
    };

    /**
     * Define the prototype functions.
     * @type {Object}
     */
    Gridded.prototype = {
        constructor: Gridded,

        /**
         * Return jQuery object containing all grid items
         * @return {Object}
         */
        items: function () {
            return this.element.children(this.options.items);
        },

        /**
         * Calculate the size or the grid, e.g. 2x4 and the width of the grid
         * and the widths of a single item in the grid.
         * @return {Object} Returns this.
         */
        getSizes: function () {
            var breakPoint;

            // Reset the row and column count.
            this.options.row = this.options.col = null;
            // If the numOfCols is an object loop through array and check against breakpoints.
            if (this.options.numOfCols && typeof this.options.numOfCols == "object") {
                for (breakPoint in this.options.breakPoints ) {
                    if ($(window).width() <= this.options.breakPoints[breakPoint]) {
                        this.options.col = this.options.numOfCols[breakPoint];
                        break;
                    }
                }

                // If no breakpoint matched use default desktop size.
                if (!this.options.col) this.options.col = this.options.numOfCols.desktop;
            } else
                this.options.col = this.options.numOfCols;

            // If the numOfRows is an Object loop through array and check against breakpoints.
            if (this.options.numOfRows && typeof this.options.numOfRows == "object") {
                for (breakPoint in this.options.breakPoints ) {
                    if ($(window).width() <= this.options.breakPoints[breakPoint]) {
                        this.options.row = this.options.numOfRows[breakPoint];
                        break;
                    }
                }

                // If no row length found use default desktop.
                if (!this.options.row) this.options.row = this.options.numOfRows.desktop;
            } else
                this.options.row = this.options.numOfRows;


            // Calculate width and column width for this grid.
            this.width = this.element.width() + this.options.gutter;
            this.colWidth = this.width / this.options.col;

            return this;
        },

        /**
         * Set random sizes for items that doesnt have any.
         */
        setRandomSizes: function () {
            var _self = this;

            this.items().each(function() {
                var item = $(this),
                    w = Math.floor(Math.random() * (Math.round(_self.options.col/2)) + 1),
                    h = Math.floor(Math.random() * (( _self.options.row || _self.options.col ) - 1 + 1) + 1);

                if (!item.data(_self.options.widthAttr) && !item.data(_self.options.heightAttr))
                    item.attr("data-" + _self.options.widthAttr, w).attr('data-' + _self.options.heightAttr, h);
            });

            return this;
        },

        /**
         * Calculate where to place grid items that will fit and place
         * them accordingly.
         * @return {Object} Returns this.
         */
        placeItems: function () {
            var _self = this,
                itemCount = 1,
                largestPushDown = 0,
                grid = {};

            // Create grid object.
            for (var gridColumns = this.options.col - 1; gridColumns >= 0; gridColumns--)
                grid[gridColumns] = {};

            this.element.css("position", "relative");
            this.items().hide().each(function() {
                var item = $(this),
                    placed = false,
                    row = 0, pushCol, pushRow,
                    iw = item.data(_self.options.widthAttr),
                    ih = item.data(_self.options.heightAttr);


                // Ensure the element has a disired width and that its not over the grid
                // width.
                if (!iw)
                    iw = 1;
                if (iw > _self.options.col && _self.options.fit !== false)
                    iw = _self.options.col;

                if (!ih)
                    ih = iw;
                 if (_self.options.row  && ih > _self.options.row && _self.options.fit !== false)
                    ih = _self.options.row;

                item
                    .attr("data-" + _self.options.widthAttr, iw)
                    .attr("data-" + _self.options.heightAttr, ih);

                // Loop and till we place the element or reach the row limit.
                while (placed === false && (!_self.options.row || row <= _self.options.row)) {
                    // Loop through each column in the grid and check to the right and down the area of the
                    // item to see if there is space for it to fit. If not move to next column, repeat until
                    // all columns on this row are checked then move down a row as long as it does not surpass
                    // options.row size.
                    for (var c = 0; c <= _self.options.col - 1 ; c++) {
                        var empty = true;
                        for (var w = 0; w <= iw - 1 ; w++) {
                            pushCol = c + w;
                            if (pushCol < _self.options.col) {

                                for (var h = 0; h <= ih - 1 ; h++) {
                                    pushRow = row + h;
                                    if (grid[pushCol][pushRow] || (_self.options.row && pushRow > _self.options.row - 1)) {
                                        empty = false;
                                        break;
                                    }
                                }
                            } else {
                                empty = false;
                                break;
                            }
                        }

                        // If the element has been placed we mark it in the grid object.
                        // and place the element on the page.
                        if(empty == true) {
                            var itemWidth = (iw * _self.colWidth - _self.options.gutter),
                                itemHeight = (ih * _self.colWidth - _self.options.gutter),
                                itemLeft = c * _self.colWidth + parseInt(_self.element.css("padding-left")),
                                itemTop = row * _self.colWidth + parseInt(_self.element.css("padding-top"));

                            // Mark in the grid object where this item has been placed.
                            for (var w = 0; w <= iw - 1 ; w++)
                                for (var h = 0; h <= ih - 1 ; h++)
                                    grid[c + w][row + h] = 1;

                            item
                                .attr('data-pr', c)
                                .attr('data-pd', row)
                                .attr('data-itemCount', itemCount)
                                .css({
                                    "position": "absolute",
                                    "width": itemWidth,
                                    "height": itemHeight,
                                    "left": itemLeft,
                                    "top": itemTop
                                    });

                            if (!_self.options.fadeIn)
                                item.show();

                            if (largestPushDown < (row + ih))
                                largestPushDown = row + ih;

                            placed = true;
                            break;
                        }
                    }
                    row += 1;
                }
                itemCount++;
            });

            // Fade in all items at the same time.
            if (this.options.fadeIn)
                this.items().delay(this.options.fadeInDelay).fadeIn(this.options.fadeInSpeed);

            this.element.css("height", largestPushDown * this.colWidth - this.options.gutter + parseInt(this.element.css('padding-top'))  + parseInt(this.element.css('padding-bottom')) );
            this.grid = grid;

            return this;
        },

        /**
         * Add lines to the grid to clearly mark out the grid sections.
         * @return {Object} Returns this.
         */
        showGrid: function () {
            // Remove any previous grid.
            this.removeGrid();
            // Create line template and the line container.
            var $line = $("<div style='border: 1px solid #333;'></div>").css({"position": "absolute"}),
                $lineConatiner = $("<div class='line-container'></div>").appendTo(this.element).css({
                    "position": "absolute",
                    "top": 0, "bottom": 0, "left": 0, "right": 0,
                    "z-index": 100
                });

            // Loop through column count and place a line in the space between columns.
            for (var c = 0; c <= this.options.col; c++) {
                $line.clone().appendTo($lineConatiner).css({
                    "height": "110%",
                    "top": "-5%",
                    "left": (c * this.colWidth) + this.options.gutter - 1
                });
            }

            // Loop through row count and place a line in the space between rows.
            for (var r = 0; r <= this.options.row; r++) {
                $line.clone().appendTo($lineConatiner).css({
                    "width": "100%",
                    "top": (r * this.colWidth) - this.options.gutter / 2 - 1
                });
            }

            return this;
        },

        /**
         * Remove lines from grid.
         * @return {Object} Return this.
         */
        removeGrid: function () {
            this.element.find(".line-container").remove();
            return this;
        },

        /**
         * Resize event, fired every time the window is resized.
         */
        resized: function  () {
            var _self = this;
            if (this.timeout)
                clearTimeout(this.timeout);

            this.timeout = setTimeout(function() {
                _self.getSizes().placeItems();

                if (_self.element.find(".line-container").length > 0)
                    _self.showGrid();
                if ($.isFunction(_self.options.onresize))
                    _self.options.onresize(_self);
            }, 200);
        }

    };

    // jQuery fn
    $.fn.gridded = function(options) {
        var el = $(this);
            if (el.data('gridded'))
                el.removeData('gridded');
            el.data('gridded', new Gridded(el, options));
        return this;
    };

}(window.jQuery);