/*!
 * gridded.js | v0.0.3
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
        items: "",
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
        onresize: null,
        resizeDelay: 100
    };

    var Gridded = function (element, options) {

        this.$element = element;

        this.grid = {};

        this.placesItemCount = 0;

        this.largestPushDown = 0;

        this.resizeCol = 0;

        // Combine provided options with defaults.
        this.options = $.extend({}, defaults, options);

        // Options can be stored in data-gridded attribute as object. Requires work;
        if ($.isPlainObject(this.$element.data("gridded")))
            this.options = $.extend({}, this.options, this.$element.data("gridded"));

        // Gather the size of the grid in items, eg 2x4 and get the width of the items.
        this.getSizes();

        // If we are randomly positioning items do that now.
        if (this.options.randomSize) this.setRandomSizes();

        // Place the grid items.
        this.placeExisting();

        // Bind the resize event to allow for a responsive grid.
        $(window).on("resize.gridded", $.proxy(this.resized, this));
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
            return this.$element.children(this.options.items);
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
            this.width = this.$element.width() + this.options.gutter;
            this.colWidth = this.width / this.options.col;

            return this;
        },

        createGrid: function () {
            // Create grid object.
            for (var gridColumns = 0; gridColumns < this.options.col; gridColumns++)
                this.grid[gridColumns] = {};

            this.largestPushDown = 0;
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
                    item.attr("data-" + _self.options.widthAttr, w).attr("data-" + _self.options.heightAttr, h);
            });

            return this;
        },

        /**
         * Place/re-place any items that are already in the grid container.
         * @return {Object}
         */
        placeExisting: function () {
            this.getSizes();

            this.createGrid();

            // No need to place them if there isnt any.
            if (this.items().length > 0) {
                for (var i = 0; i < this.items().length; i++) {
                    var $item = $(this.items()[i]);

                    this.placeItem($item);
                };

                if (this.options.fadeIn)
                    this.items().delay(this.options.fadeInDelay).fadeIn(this.options.fadeInSpeed);

                this.adjustContainerHeight();
            }

            return this;
        },

        /**
         * Place a given item within the next available spot in the grid.
         * @param {Object} $item jQuery object for the item.
         */
        placeItem: function ($item) {
            $item.hide();

            var empty = false,
                row = 0, pushCol, pushRow,
                iw = $item.data(this.options.widthAttr),
                ih = $item.data(this.options.heightAttr);

            // Ensure the element has a disired width and that its not over the grid
            // width.
            if (!iw)
                iw = 1;
            if (iw > this.options.col && this.options.fit !== false)
                iw = this.options.col;

            if (!ih)
                ih = iw;
             if (this.options.row  && ih > this.options.row && this.options.fit !== false)
                ih = this.options.row;

            $item
                .attr("data-gridded-" + this.options.widthAttr, iw)
                .attr("data-gridded-" + this.options.heightAttr, ih);

            // Loop and till we place the element or reach the row limit.
            while (empty === false && (!this.options.row || row <= this.options.row)) {
                for (var c = 0; c <= this.options.col - 1 ; c++) {
                    empty = true;
                    for (var w = 0; w < iw; w++) {
                        pushCol = c + w;
                        if (pushCol < this.options.col) {
                            for (var h = 0; h < ih; h++) {
                                pushRow = row + h;
                                if (this.grid[pushCol][pushRow] || (this.options.row && pushRow > this.options.row - 1)) {
                                    empty = false;
                                    break;
                                }
                            }
                        } else {
                            empty = false;
                            break;
                        }
                    }
                    if (empty)
                        break;
                }

                // If the element has been placed we mark it in the grid object.
                // and place the element on the page.
                if(empty) {
                    var itemWidth = (iw * this.colWidth - this.options.gutter),
                        itemHeight = (ih * this.colWidth - this.options.gutter),
                        itemLeft = c * this.colWidth + parseInt(this.$element.css("padding-left")),
                        itemTop = row * this.colWidth + parseInt(this.$element.css("padding-top"));

                    // Mark in the grid object where this item has been placed.
                    for (var w = 0; w <= iw - 1 ; w++)
                        for (var h = 0; h <= ih - 1 ; h++)
                            this.grid[c + w][row + h] = 1;

                    this.placesItemCount = this.placesItemCount + 1;

                    $item
                        .attr("data-gridded-pr", c)
                        .attr("data-gridded-pd", row)
                        .attr("data-gridded-item", this.placesItemCount)
                        .css({
                            "position": "absolute",
                            "width": itemWidth,
                            "height": itemHeight,
                            "left": itemLeft,
                            "top": itemTop
                            });

                    if (!this.options.fadeIn)
                        $item.show();

                    if (this.largestPushDown < (row + ih))
                        this.largestPushDown = row + ih;
                }
                row++;
            }
        },

        /**
         * Add a collection of items to the grid.
         * @param {Object} items jQuery object for the items.
         */
        addItems: function (items) {
            for (var i = 0; i < items.length; i++) {
                var $item = $(items[i]);

                $item.appendTo(this.$element);

                this.placeItem($item);
            };

            // Make the container height matches the height of its children.
            this.adjustContainerHeight();

            // Fade the elements in.
            if (this.options.fadeIn)
                items.delay(this.options.fadeInDelay).fadeIn(this.options.fadeInSpeed);

            return this;
        },

        /**
         * Set the height of the container to match that of the lowest element * height + gutter.
         */
        adjustContainerHeight: function () {
            this.$element.css("height", this.largestPushDown * this.colWidth - this.options.gutter + parseInt(this.$element.css("padding-top"))  + parseInt(this.$element.css("padding-bottom")) );

            return this;
        },

        removeItems: function (items) {
            items.remove();

            this.placeExisting();

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
            var $line = $("<div style=\"border: 1px solid #333;\"></div>").css({"position": "absolute"}),
                $lineConatiner = $("<div class=\"line-container\"></div>").appendTo(this.$element).css({
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
            this.$element.find(".line-container").remove();
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
                _self.resizeCol = _self.options.col;
                _self.placeExisting();

                if (_self.$element.find(".line-container").length > 0)
                    _self.showGrid();
                if ($.isFunction(_self.options.onresize))
                    _self.options.onresize(_self);
            }, this.options.resizeDelay);
        }

    };

    // jQuery fn
    $.fn.gridded = function(options) {
        return this.each(function () {
            var el = $(this);
            var data = el.data("gridded");

            if (!data) el.data("gridded", new Gridded(el, options));
        });
    };

}(window.jQuery);