(window["wpJsonpPaskit"] = window["wpJsonpPaskit"] || []).push([[26],{

/***/ 63:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return StaticCollection; });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _pixelunion_animations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);
/* harmony import */ var _components_ProductGridItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(28);
/* harmony import */ var _components_Modal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(27);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }






var StaticCollection = /*#__PURE__*/function () {
  function StaticCollection(section) {
    var _this = this;

    _classCallCheck(this, StaticCollection);

    this.section = section;
    this.$el = jquery__WEBPACK_IMPORTED_MODULE_0___default()(section.el);
    this.el = section.el;
    this.context = section.data.context;
    this.collectionUrl = this.context.collectionUrl;
    this.$focusItem = null;
    this.defaultView = this.context.grid_list;
    this.filtersContentSelector = '[data-productgrid-filters-content]';
    this.sortContent = '[data-productgrid-sort-content]';
    this.$sortTrigger = this.$el.find('[data-productgrid-trigger-sort]');
    this.$sortTriggerButton = this.$el.find('[data-productgrid-trigger-sort-button]');
    this.$sortTriggerModal = this.$el.find('[data-productgrid-modal-sort]');
    this.$filtersTrigger = this.$el.find('[data-productgrid-trigger-filters]');
    this.$filtersContent = this.$el.find(this.filtersContentSelector);
    this.$allTags = this.$filtersContent.find('.filter-item a:not([data-filter-toggle])');
    this.$advancedTags = this.$el.find('[data-tag-advanced] a');
    this.$additionalTags = this.$el.find('[data-filter-toggle]');
    this.$viewToggle = this.$el.find('[data-collection-view]');
    this.$gridContainer = this.$el.find('.productgrid--outer');
    this.filterCheckboxes = this.el.querySelectorAll('.filter-icon--checkbox');
    this._changeSorting = this._changeSorting.bind(this);
    this._changeSortingButton = this._changeSortingButton.bind(this);
    this._showSortModal = this._showSortModal.bind(this);
    this._showFiltersModal = this._showFiltersModal.bind(this);
    this._activateTag = this._activateTag.bind(this);
    this._advancedTags = this._advancedTags.bind(this);
    this._toggleTags = this._toggleTags.bind(this);
    this._toggleView = this._toggleView.bind(this);
    this._checkListView = this._checkListView.bind(this);
    this.events = [this.$sortTrigger.on('change.collection', this._changeSorting), this.$sortTriggerButton.on('click.collection', this._changeSortingButton), this.$sortTriggerModal.on('click.collection', this._showSortModal), this.$filtersTrigger.on('click.collection', this._showFiltersModal), this.$allTags.on('click.collection', function (e) {
      return _this._activateTag(e.currentTarget);
    }), this.$additionalTags.on('click.collection', this._toggleTags), this.$viewToggle.on('click.collection', this._toggleView)]; // Product items

    this.productItems = [];
    this.fillAnimations = {};
    this.checkAnimations = {};

    this._initAnimations();

    this._setSortByQueryParameters();

    this._checkListView();

    this.modal = new _components_Modal__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"]();
  }
  /**
   * Initialize animations on checkbox container
   * using filter tag as JSON key
   */


  _createClass(StaticCollection, [{
    key: "_initAnimations",
    value: function _initAnimations() {
      var _this2 = this;

      this.filterCheckboxes.forEach(function (el) {
        var tagHandle = el.dataset.handle;
        var checkmark = el.querySelector('.checkmark');
        var checkmarkCheck = el.querySelector('.checkmark__check');
        var state = 'unchecked';

        if (el.closest('.filter-item').dataset.filterActive === "true") {
          state = 'checked';
        }

        var fillAnimation = Object(_pixelunion_animations__WEBPACK_IMPORTED_MODULE_1__[/* transition */ "a"])({
          el: checkmark,
          state: state
        });
        var checkAnimation = Object(_pixelunion_animations__WEBPACK_IMPORTED_MODULE_1__[/* transition */ "a"])({
          el: checkmarkCheck,
          state: state
        });
        _this2.fillAnimations[tagHandle] = fillAnimation;
        _this2.checkAnimations[tagHandle] = checkAnimation;
      });
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      var _this3 = this;

      this.events.forEach(function ($el) {
        return $el.off('.collection');
      });
      this.modal.unload();
      Object.keys(this.fillAnimations).forEach(function (key) {
        _this3.fillAnimations[key].unload();

        _this3.checkAnimations[key].unload();
      });
      this.productItems.forEach(function (productItem) {
        productItem.unload();
      });
    }
  }, {
    key: "_initProductItems",
    value: function _initProductItems() {
      var _this4 = this;

      var view = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'grid-view';
      var $productItems = this.$el.find('[data-product-item]');
      $productItems.each(function (i, productItem) {
        _this4.productItems.push(new _components_ProductGridItem__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"]({
          el: productItem,
          id: _this4.section.id,
          lazy: true,
          grid_list: view
        }));
      });
    }
    /**
     * Open Tags/Filters modal (on mobile)
     *
     * @param event
     * @private
     */

  }, {
    key: "_showFiltersModal",
    value: function _showFiltersModal(event) {
      event.preventDefault();
      this.$focusItem = jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.currentTarget);
      this.modal.open(this.filtersContentSelector, 'productgrid-filters');
    }
    /**
     * Open Sort by modal (on mobile)
     *
     * @param event
     * @private
     */

  }, {
    key: "_showSortModal",
    value: function _showSortModal(event) {
      event.preventDefault();
      this.$focusItem = jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.currentTarget);
      this.modal.open(this.sortContent, 'productgrid-sort');
    }
  }, {
    key: "_deactivateTags",
    value: function _deactivateTags(currentFilterItem) {
      var _this5 = this;

      var currentGroup = currentFilterItem.closest('[data-filter-group]');
      var activeTags = currentGroup.querySelectorAll('[data-filter-active="true"]');
      activeTags.forEach(function (el) {
        var itemTag = el.dataset.handle;
        currentGroup.querySelector(".filter-item[data-handle='".concat(itemTag, "']")).dataset.filterActive = false;

        if (_this5.fillAnimations[itemTag] && _this5.checkAnimations[itemTag]) {
          _this5.fillAnimations[itemTag].animateTo('unchecked');

          _this5.checkAnimations[itemTag].animateTo('unchecked');
        }
      });
    }
    /**
     * Style a tag as active after click, before page transition
     *
     * @param event
     * @private
     */

  }, {
    key: "_activateTag",
    value: function _activateTag(target) {
      var _this6 = this;

      event.preventDefault();
      var href = target.getAttribute('href');
      var filterItem = target.closest('.filter-item');
      var filterItemTag = filterItem.dataset.handle;
      var animateTo = 'checked';

      if (filterItem.dataset.filterActive === 'true') {
        animateTo = 'unchecked';
      }

      this._deactivateTags(filterItem);

      if (animateTo === 'checked') {
        filterItem.dataset.filterActive = true;
      } else {
        filterItem.dataset.filterActive = false;
      }

      if (this.fillAnimations[filterItemTag] && this.checkAnimations[filterItemTag]) {
        this.fillAnimations[filterItemTag].animateTo(animateTo);
        this.checkAnimations[filterItemTag].animateTo(animateTo).then(function () {
          if (_this6.$advancedTags.length === 0) {
            location.href = href;
          } else {
            _this6._advancedTags(jquery__WEBPACK_IMPORTED_MODULE_0___default()(target));
          }
        });
      } else {
        // If the animation is not registered to the tag, it is a swatch and should
        // go straight to the advanced tags function
        this._advancedTags(jquery__WEBPACK_IMPORTED_MODULE_0___default()(target));
      }
    }
    /**
     * Used by advanced tags to concatenate tag searches
     *
     * @param event
     * @private
     */

  }, {
    key: "_advancedTags",
    value: function _advancedTags(link) {
      var $target = link.parent();
      var $filtersContent = $target.closest('nav');
      var filterGroups = $filtersContent.find('[data-filter-group]');
      var filterHandles = []; // Build the filter for the url based on what is in the dom

      filterGroups.each(function (index, filterGroup) {
        var selectedItems = filterGroup.querySelectorAll('[data-filter-active="true"]');

        if (selectedItems.length) {
          filterHandles.push(jquery__WEBPACK_IMPORTED_MODULE_0___default()(selectedItems).data('handle'));
        }
      });

      this._updateLocation(filterHandles.join('+'));
    }
  }, {
    key: "_updateLocation",
    value: function _updateLocation(filter) {
      if (this.collectionUrl.indexOf('vendors') > -1) {
        location.href = "".concat(this.collectionUrl, "&constraint=").concat(filter);
      } else {
        location.href = "".concat(this.collectionUrl, "/").concat(filter);
      }
    }
    /**
     * Expand / Collapse additional tags in the sidebar
     *
     * @param event
     * @private
     */

  }, {
    key: "_toggleTags",
    value: function _toggleTags(event) {
      event.preventDefault();
      var $trigger = jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.currentTarget);
      var $items = $trigger.parent().siblings('[data-hidden-default]');
      var siblingsVisible = $trigger.data('filter-toggle');
      $items.toggleClass('filter-item--hidden', siblingsVisible);
      $trigger.data('filter-toggle', !siblingsVisible).text(!siblingsVisible ? this.context.see_less : this.context.see_more);

      if (this.modal.isOpen()) {
        this.modal.position();
      }
    }
    /**
     * Make Shopify aware of releavent collection search info
     *  - tag
     *  - vendor
     *  - pagination
     *  - sorting criteria
     *
     * @private
     */

  }, {
    key: "_setSortByQueryParameters",
    value: function _setSortByQueryParameters() {
      Shopify.queryParams = {};

      if (location.search.length) {
        for (var i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
          var aKeyValue = aCouples[i].split('='); // Reset the page number when we apply (i.e. don't add it to params)

          if (aKeyValue.length > 1 && aKeyValue[0] !== 'page') {
            Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
          }
        }
      }
    }
    /**
     * Sort by opens a modal on mobile, this handles button events
     *
     * @param event
     * @private
     */

  }, {
    key: "_changeSortingButton",
    value: function _changeSortingButton(event) {
      var activeClass = 'utils-sortby--modal-button--active';
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.currentTarget).addClass(activeClass).parent().siblings().find(".".concat(activeClass)).removeClass(activeClass);

      this._changeSorting(event);
    }
    /**
     * Change sorting of collection
     *
     * @param event
     * @private
     */

  }, {
    key: "_changeSorting",
    value: function _changeSorting(event) {
      event.preventDefault();
      var $target = jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.currentTarget);
      Shopify.queryParams.sort_by = $target.val();
      location.search = jQuery.param(Shopify.queryParams).replace(/\+/g, '%20');
    }
    /**
     * Toggle grid or list view
     *
     */

  }, {
    key: "_toggleView",
    value: function _toggleView(event) {
      var $target = jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.currentTarget);
      Shopify.queryParams.grid_list = $target.data('collection-view');
      location.search = jQuery.param(Shopify.queryParams).replace(/\+/g, '%20');
    }
    /**
     * Check grid/list view toggle query parameters
     *
     */

  }, {
    key: "_checkListView",
    value: function _checkListView() {
      var view = Shopify.queryParams.grid_list ? Shopify.queryParams.grid_list : this.defaultView;
      this.$el.find('[href*="&grid_list"]').attr('href', function (i, url) {
        var href = url;

        if (url.indexOf('?') < 0) {
          var replaceIndex = url.indexOf('&');
          var firstHalf = url.substr(0, replaceIndex);
          var secondHalf = url.substr(replaceIndex + 1);
          href = firstHalf.concat('?', secondHalf);
        }

        href = href.replace('grid_list', "grid_list=".concat(view));
        return href;
      });
      this.$el.find('.utils-viewtoggle-button').removeClass('active');
      jquery__WEBPACK_IMPORTED_MODULE_0___default()("[data-collection-view=".concat(view, "]")).addClass('active');
      var className = view.replace('-', '');
      this.$gridContainer.addClass("productgrid-".concat(className));

      if (className === 'listview') {
        this.$gridContainer.removeClass('productgrid-gridview');
      } else {
        this.$gridContainer.removeClass('productgrid-listview');
      }

      this._initProductItems(view);
    }
  }]);

  return StaticCollection;
}();



/***/ })

}]);
//# sourceMappingURL=StaticCollection.bundle.js.map?1592422769306