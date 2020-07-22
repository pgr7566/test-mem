(window["wpJsonpPaskit"] = window["wpJsonpPaskit"] || []).push([[28],{

/***/ 21:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export forceFocus */
/* unused harmony export focusHash */
/* unused harmony export bindInPageLinks */
/* unused harmony export focusable */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return trapFocus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return removeTrapFocus; });
/* unused harmony export accessibleLinks */
/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 */

/**
 * Moves focus to an HTML element
 * eg for In-page links, after scroll, focus shifts to content area so that
 * next `tab` is where user expects. Used in bindInPageLinks()
 * eg move focus to a modal that is opened. Used in trapFocus()
 *
 * @param {Element} container - Container DOM element to trap focus inside of
 * @param {Object} options - Settings unique to your theme
 * @param {string} options.className - Class name to apply to element on focus.
 */
function forceFocus(element, options) {
  options = options || {};

  var savedTabIndex = element.tabIndex;

  element.tabIndex = -1;
  element.dataset.tabIndex = savedTabIndex;
  element.focus();
  if (typeof options.className !== 'undefined') {
    element.classList.add(options.className);
  }
  element.addEventListener('blur', callback);

  function callback(event) {
    event.target.removeEventListener(event.type, callback);

    element.tabIndex = savedTabIndex;
    delete element.dataset.tabIndex;
    if (typeof options.className !== 'undefined') {
      element.classList.remove(options.className);
    }
  }
}

/**
 * If there's a hash in the url, focus the appropriate element
 * This compensates for older browsers that do not move keyboard focus to anchor links.
 * Recommendation: To be called once the page in loaded.
 *
 * @param {Object} options - Settings unique to your theme
 * @param {string} options.className - Class name to apply to element on focus.
 * @param {string} options.ignore - Selector for elements to not include.
 */

function focusHash(options) {
  options = options || {};
  var hash = window.location.hash;
  var element = document.getElementById(hash.slice(1));

  // if we are to ignore this element, early return
  if (element && options.ignore && element.matches(options.ignore)) {
    return false;
  }

  if (hash && element) {
    forceFocus(element, options);
  }
}

/**
 * When an in-page (url w/hash) link is clicked, focus the appropriate element
 * This compensates for older browsers that do not move keyboard focus to anchor links.
 * Recommendation: To be called once the page in loaded.
 *
 * @param {Object} options - Settings unique to your theme
 * @param {string} options.className - Class name to apply to element on focus.
 * @param {string} options.ignore - CSS selector for elements to not include.
 */

function bindInPageLinks(options) {
  options = options || {};
  var links = Array.prototype.slice.call(
    document.querySelectorAll('a[href^="#"]')
  );

  return links.filter(function(link) {
    if (link.hash === '#' || link.hash === '') {
      return false;
    }

    if (options.ignore && link.matches(options.ignore)) {
      return false;
    }

    var element = document.querySelector(link.hash);

    if (!element) {
      return false;
    }

    link.addEventListener('click', function() {
      forceFocus(element, options);
    });

    return true;
  });
}

function focusable(container) {
  var elements = Array.prototype.slice.call(
    container.querySelectorAll(
      '[tabindex],' +
        '[draggable],' +
        'a[href],' +
        'area,' +
        'button:enabled,' +
        'input:not([type=hidden]):enabled,' +
        'object,' +
        'select:enabled,' +
        'textarea:enabled'
    )
  );

  // Filter out elements that are not visible.
  // Copied from jQuery https://github.com/jquery/jquery/blob/2d4f53416e5f74fa98e0c1d66b6f3c285a12f0ce/src/css/hiddenVisibleSelectors.js
  return elements.filter(function(element) {
    return !!(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
  });
}

/**
 * Traps the focus in a particular container
 *
 * @param {Element} container - Container DOM element to trap focus inside of
 * @param {Element} elementToFocus - Element to be focused on first
 * @param {Object} options - Settings unique to your theme
 * @param {string} options.className - Class name to apply to element on focus.
 */

var trapFocusHandlers = {};

function trapFocus(container, options) {
  options = options || {};
  var elements = focusable(container);
  var elementToFocus = options.elementToFocus || container;
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = function(event) {
    if (container !== event.target && !container.contains(event.target)) {
      first.focus();
    }

    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;
    document.addEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function() {
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function(event) {
    if (event.keyCode !== 9) return; // If not TAB key

    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener('focusout', trapFocusHandlers.focusout);
  document.addEventListener('focusin', trapFocusHandlers.focusin);

  forceFocus(elementToFocus, options);
}

/**
 * Removes the trap of focus from the page
 */
function removeTrapFocus() {
  document.removeEventListener('focusin', trapFocusHandlers.focusin);
  document.removeEventListener('focusout', trapFocusHandlers.focusout);
  document.removeEventListener('keydown', trapFocusHandlers.keydown);
}

/**
 * Add a preventive message to external links and links that open to a new window.
 * @param {string} elements - Specific elements to be targeted
 * @param {object} options.messages - Custom messages to overwrite with keys: newWindow, external, newWindowExternal
 * @param {string} options.messages.newWindow - When the link opens in a new window (e.g. target="_blank")
 * @param {string} options.messages.external - When the link is to a different host domain.
 * @param {string} options.messages.newWindowExternal - When the link is to a different host domain and opens in a new window.
 * @param {object} options.prefix - Prefix to namespace "id" of the messages
 */
function accessibleLinks(elements, options) {
  if (typeof elements !== 'string') {
    throw new TypeError(elements + ' is not a String.');
  }

  elements = document.querySelectorAll(elements);

  if (elements.length === 0) {
    return;
  }

  options = options || {};
  options.messages = options.messages || {};

  var messages = {
    newWindow: options.messages.newWindow || 'Opens in a new window.',
    external: options.messages.external || 'Opens external website.',
    newWindowExternal:
      options.messages.newWindowExternal ||
      'Opens external website in a new window.'
  };

  var prefix = options.prefix || 'a11y';

  var messageSelectors = {
    newWindow: prefix + '-new-window-message',
    external: prefix + '-external-message',
    newWindowExternal: prefix + '-new-window-external-message'
  };

  function generateHTML(messages) {
    var container = document.createElement('ul');
    var htmlMessages = Object.keys(messages).reduce(function(html, key) {
      return (html +=
        '<li id=' + messageSelectors[key] + '>' + messages[key] + '</li>');
    }, '');

    container.setAttribute('hidden', true);
    container.innerHTML = htmlMessages;

    document.body.appendChild(container);
  }

  function externalSite(link) {
    return link.hostname !== window.location.hostname;
  }

  elements.forEach(function(link) {
    var target = link.getAttribute('target');
    var rel = link.getAttribute('rel');
    var isExternal = externalSite(link);
    var isTargetBlank = target === '_blank';
    var isRelNoopenerEmpty = rel === null || rel.indexOf('noopener') === -1;

    if (isTargetBlank && isRelNoopenerEmpty) {
      link.setAttribute('rel', 'noopener');
    }

    if (isExternal && isTargetBlank) {
      link.setAttribute('aria-describedby', messageSelectors.newWindowExternal);
    } else if (isExternal) {
      link.setAttribute('aria-describedby', messageSelectors.external);
    } else if (isTargetBlank) {
      link.setAttribute('aria-describedby', messageSelectors.newWindow);
    }
  });

  generateHTML(messages);
}

/***/ }),

/***/ 23:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Reads the content property on the documentElement ::before pseudo element
 * for a string of ordered, comma-separated, breakpoint names.
 *
 * @returns An ordered array of strings representing the breakpoint names
 *
 */
function readCSSBreakpoints() {
    return window
        .getComputedStyle(document.documentElement, ':before')
        .getPropertyValue('content')
        .replace(/"/g, '')
        .split(',');
}
/**
 * Reads the content property on the documentElement ::after pseudo element
 * for a string of the current breakpoint name. This value is updated using
 * dynamically using media queries and should match a value found in
 * the ::before pseudo element.
 *
 * @returns A string representing the current breakpoint name
 *
 */
function readCSSCurrentBreakpoint() {
    return window
        .getComputedStyle(document.documentElement, ':after')
        .getPropertyValue('content')
        .replace(/"/g, '');
}
var callbacks = [];
var cssBreakpoints = readCSSBreakpoints();
var CSSBreakpoint = /** @class */ (function () {
    function CSSBreakpoint(cssBreakpoint) {
        this.cssBreakpoint = cssBreakpoint;
    }
    Object.defineProperty(CSSBreakpoint.prototype, "value", {
        get: function () {
            return this.cssBreakpoint;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Checks whether this breakpoint is at least the input breakpoint
     *
     * @param breakpointName - The input breakpoint name
     * @returns Whether this breakpoint is the same or greater than the input breakpoint
     *
     */
    CSSBreakpoint.prototype.min = function (breakpointName) {
        var comparison = cssBreakpoints.indexOf(this.value) - cssBreakpoints.indexOf(breakpointName);
        return comparison >= 0;
    };
    /**
     * Checks whether this breakpoint is at most the input breakpoint
     *
     * @param breakpointName - The input breakpoint name
     * @returns Whether this breakpoint is the same or less than the input breakpoint
     *
     */
    CSSBreakpoint.prototype.max = function (breakpointName) {
        var comparison = cssBreakpoints.indexOf(this.value) - cssBreakpoints.indexOf(breakpointName);
        return comparison <= 0;
    };
    /**
     * Checks whether this breakpoint is at within the input breakpoint start
     * and input breakpoint end, inclusive
     *
     * @param breakpointNameStart - The starting input breakpoint name
     * @param breakpointNameEnd - The ending input breakpoint name
     * @returns Whether this breakpoint is the same or greater than the starting input
     *          breakpoint and the same or less than the ending input breakpoint
     *
     */
    CSSBreakpoint.prototype.range = function (breakpointNameStart, breakpointNameEnd) {
        var indexCurrent = cssBreakpoints.indexOf(this.value);
        var indexStart = cssBreakpoints.indexOf(breakpointNameStart);
        var indexEnd = cssBreakpoints.indexOf(breakpointNameEnd);
        return indexStart <= indexCurrent && indexCurrent <= indexEnd;
    };
    /**
     * Checks whether this breakpoint is one of the input breakpoints
     *
     * @param breakpointNames - One or more input breakpoint names
     * @returns Whether this breakpoint is one of the input breakpoints
     *
     */
    CSSBreakpoint.prototype.is = function () {
        var _this = this;
        var breakpointNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            breakpointNames[_i] = arguments[_i];
        }
        return breakpointNames.some(function (breakpoint) { return breakpoint === _this.value; });
    };
    return CSSBreakpoint;
}());
var breakpoints = {
    previous: new CSSBreakpoint(readCSSCurrentBreakpoint()),
    current: new CSSBreakpoint(readCSSCurrentBreakpoint()),
};
/**
 * Gets the breakpoints
 *
 * @returns The current and previous breakpoint
 *
 */
function get() {
    return breakpoints;
}
exports.get = get;
/**
 * Adds an event listener to be called when a breakpoint changes
 *
 * @param callback - The function to be called when a breakpoint changes
 *
 */
function onChange(callback) {
    if (callbacks.indexOf(callback) === -1) {
        callbacks.push(callback);
    }
}
exports.onChange = onChange;
/**
 * Removes an event listener to be called when a breakpoint changes
 *
 * @param callback - The function to be removed from the set of event listeners
 *
 */
function offChange(callback) {
    var index = callbacks.indexOf(callback);
    if (index !== -1) {
        callbacks.splice(index, 1);
    }
}
exports.offChange = offChange;
var currentMin = function (breakpointName) { return breakpoints.current.min(breakpointName); };
exports.min = currentMin;
var currentMax = function (breakpointName) { return breakpoints.current.max(breakpointName); };
exports.max = currentMax;
var currentRange = function (breakpointNameStart, breakpointNameEnd) { return breakpoints.current.range(breakpointNameStart, breakpointNameEnd); };
exports.range = currentRange;
var currentIs = function () {
    var _a;
    var breakpointNames = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        breakpointNames[_i] = arguments[_i];
    }
    return (_a = breakpoints.current).is.apply(_a, breakpointNames);
};
exports.is = currentIs;
/*
 * document.styleSheets is considered experimental technology; however,
 * the majority of current browsers implement this functionality.
 *
 * One drawback is under certain conditions, stylesheets may become
 * available due to security rules in the browser and we must be able to
 * fallback gracefully.
 */
var styleSheetList = document.styleSheets;
var mediaLists = Object.keys(styleSheetList).reduce(function (accumulator, key) {
    var stylesheet = styleSheetList[key];
    if (!stylesheet.href || stylesheet.href.indexOf('theme') === -1) {
        return accumulator;
    }
    try {
        var cssRules = stylesheet.cssRules;
        for (var i = 0; i < cssRules.length; i++) {
            var cssRule = stylesheet.cssRules[i];
            if (!(cssRule instanceof CSSMediaRule)) {
                continue;
            }
            for (var j = 0; j < cssRules.length; j++) {
                var cssMediaCssRule = cssRule.cssRules[j];
                if (!(cssMediaCssRule instanceof CSSStyleRule)) {
                    continue;
                }
                if (cssMediaCssRule.selectorText && cssMediaCssRule.selectorText.indexOf('html::after') !== -1) {
                    accumulator.push(cssRule.media);
                }
            }
        }
    }
    catch (_a) {
        return accumulator;
    }
    return accumulator;
}, []);
/*
 * Use window.matchMedia when stylesheets are accessible in the browser.
 * matchMedia is theoretically more performant than listening to every resize
 * event because it only fires when a media query boundary is crossed.
 *
 * If stylesheets aren't available, revert back to using the resize event.
 */
if (mediaLists.length > 0) {
    mediaLists.forEach(function (mediaList) {
        var mql = window.matchMedia(mediaList.mediaText);
        mql.addListener(function () {
            var cssCurrentBreakpoint = readCSSCurrentBreakpoint();
            if (breakpoints.current.value !== cssCurrentBreakpoint) {
                breakpoints.previous = breakpoints.current;
                breakpoints.current = new CSSBreakpoint(cssCurrentBreakpoint);
                callbacks.forEach(function (callback) { return callback(breakpoints); });
            }
        });
    });
}
else {
    window.addEventListener('resize', function () {
        var cssCurrentBreakpoint = readCSSCurrentBreakpoint();
        if (breakpoints.current.value !== cssCurrentBreakpoint) {
            breakpoints.previous = breakpoints.current;
            breakpoints.current = new CSSBreakpoint(cssCurrentBreakpoint);
            callbacks.forEach(function (callback) { return callback(breakpoints); });
        }
    });
}


/***/ }),

/***/ 24:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Accordion; });
/* harmony import */ var _pixelunion_animations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var makeBlock = function makeBlock(el) {
  return {
    animation: Object(_pixelunion_animations__WEBPACK_IMPORTED_MODULE_0__[/* transition */ "a"])({
      el: el,
      state: 'open',
      stateAttribute: 'data-accordion-state',
      stateChangeAttribute: 'data-accordion-animation'
    }),
    isOpen: true
  };
};

var setOpenHeight = function setOpenHeight(el) {
  el.style.setProperty('--menu-open-height', "".concat(el.scrollHeight, "px"));
};

var Accordion = /*#__PURE__*/function () {
  function Accordion(el) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Accordion);

    this.el = el;
    this.options = _objectSpread({
      content: '[data-accordion-content]',
      animate: true,
      onStart: function onStart() {}
    }, options);
    this.blocks = new Map();
  }

  _createClass(Accordion, [{
    key: "closeAll",
    value: function closeAll() {
      var _this = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.el.querySelectorAll(this.options.content).forEach(function (block) {
        return _this.close(block, options);
      });
    }
  }, {
    key: "openAll",
    value: function openAll() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.el.querySelectorAll(this.options.content).forEach(function (block) {
        return _this2.open(block, options);
      });
    }
  }, {
    key: "open",
    value: function open(el) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this._open(el, options);
    }
  }, {
    key: "close",
    value: function close(el) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this._close(el, options);
    }
  }, {
    key: "toggle",
    value: function toggle(el) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var _this$_getBlock = this._getBlock(el),
          isOpen = _this$_getBlock.isOpen;

      if (isOpen) {
        this._close(el, options);
      } else {
        this._open(el, options);
      }
    }
  }, {
    key: "unload",
    value: function unload() {
      this.blocks.forEach(function (_ref) {
        var animation = _ref.animation;
        return animation.unload();
      });
    }
  }, {
    key: "_getBlock",
    value: function _getBlock(el) {
      var block = el.matches(this.options.content) ? el : el.querySelector(this.options.content);

      if (!this.blocks.has(block)) {
        this.blocks.set(block, makeBlock(block));
      }

      return this.blocks.get(block);
    }
  }, {
    key: "_open",
    value: function _open(el, _ref2) {
      var _ref2$onComplete = _ref2.onComplete,
          onComplete = _ref2$onComplete === void 0 ? function () {} : _ref2$onComplete,
          _ref2$force = _ref2.force,
          force = _ref2$force === void 0 ? !this.options.animate : _ref2$force;

      var block = this._getBlock(el);

      if (block.isOpen) return;
      block.isOpen = true;
      this.options.onStart({
        el: block.animation.el,
        state: 'open'
      });
      block.animation.animateTo('open', {
        force: force,
        onStart: function onStart(_ref3) {
          var el = _ref3.el;
          return setOpenHeight(el);
        }
      }).then(function (state) {
        if (state === 'open') {
          onComplete();
        }
      });
    }
  }, {
    key: "_close",
    value: function _close(el, _ref4) {
      var _ref4$onComplete = _ref4.onComplete,
          onComplete = _ref4$onComplete === void 0 ? function () {} : _ref4$onComplete,
          _ref4$force = _ref4.force,
          force = _ref4$force === void 0 ? !this.options.animate : _ref4$force;

      var block = this._getBlock(el);

      if (!block.isOpen) return;
      block.isOpen = false;
      this.options.onStart({
        el: block.animation.el,
        state: 'closed'
      });
      setOpenHeight(block.animation.el);
      block.animation.animateTo('closed', {
        force: force
      }).then(function (state) {
        if (state === 'closed') {
          onComplete();
        }
      });
    }
  }]);

  return Accordion;
}();



/***/ }),

/***/ 86:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "default", function() { return /* binding */ StaticHeader_StaticHeader; });

// EXTERNAL MODULE: ./node_modules/jquery/dist/jquery.js
var jquery = __webpack_require__(0);
var jquery_default = /*#__PURE__*/__webpack_require__.n(jquery);

// EXTERNAL MODULE: ./node_modules/scriptjs/dist/script.js
var script = __webpack_require__(1);
var script_default = /*#__PURE__*/__webpack_require__.n(script);

// EXTERNAL MODULE: ./node_modules/@pixelunion/animations/dist/animations.es.js
var animations_es = __webpack_require__(12);

// EXTERNAL MODULE: ./node_modules/@pixelunion/events/dist/EventHandler.js
var EventHandler = __webpack_require__(14);
var EventHandler_default = /*#__PURE__*/__webpack_require__.n(EventHandler);

// EXTERNAL MODULE: ./source/scripts/Forms.js + 1 modules
var Forms = __webpack_require__(11);

// EXTERNAL MODULE: ./source/scripts/Layout.js
var Layout = __webpack_require__(10);

// EXTERNAL MODULE: ./source/scripts/helpers/ScrollLock.js
var ScrollLock = __webpack_require__(20);

// CONCATENATED MODULE: ./source/scripts/components/StickyHeader.js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var StickyHeader_StickyHeader = /*#__PURE__*/function () {
  function StickyHeader(options, settings) {
    var _this = this;

    _classCallCheck(this, StickyHeader);

    this.body = document.querySelector('body');
    this.header = document.querySelector('[data-site-header]');
    this.menu = this.header.querySelector('[data-site-navigation]');
    this.menuToggle = options.menuToggle;
    this.postMessage = options.postMessage;
    this.settings = settings;
    this.transitioning = false;
    this.lastToggle = Date.now() - 1000;
    this.stickyClass = 'site-header-sticky';
    this.scrolledClass = 'site-header-sticky--scrolled';
    this.navOpenClass = 'site-header-nav--open';
    this._toggleStickyHeader = this._toggleStickyHeader.bind(this);
    this._toggleMenu = this._toggleMenu.bind(this);

    if (this.settings.sticky_header) {
      this.body.classList.add(this.stickyClass);
      window.requestAnimationFrame(function () {
        // If browser doesn't support sticky, we don't want any of the sticky functionality.
        if (window.getComputedStyle(_this.header).position.indexOf('sticky') > -1) {
          _this.observer = new IntersectionObserver(function (entries) {
            return _this._toggleStickyHeader(entries);
          });

          _this.observer.observe(document.querySelector('[data-header-intersection-target]'));

          _this.toggleClick = function (event) {
            event.preventDefault();
            if (Layout["a" /* default */].isGreaterThanBreakpoint('M')) _this._toggleMenu();
          };

          _this.menuToggle.addEventListener('click', _this.toggleClick);
        }
      });
    }
  }

  _createClass(StickyHeader, [{
    key: "closeNavigation",
    value: function closeNavigation() {
      var _this2 = this;

      if (this.transitioning) {
        return;
      }

      this.menuToggle.classList.remove('active');

      this.navTransitionOutEvent = function () {
        _this2.header.classList.remove(_this2.navOpenClass);

        _this2.transitioning = false;

        _this2.menu.removeEventListener('transitionend', _this2.navTransitionOutEvent);
      };

      this.menu.addEventListener('transitionend', this.navTransitionOutEvent);
      this.transitioning = true;
      this.menu.setAttribute('style', "margin-top: -".concat(this.menu.getBoundingClientRect().height, "px;"));
      this.postMessage('nav:close-all');
    }
  }, {
    key: "openNavigation",
    value: function openNavigation() {
      var _this3 = this;

      var onOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

      if (this.transitioning || this.header.classList.contains(this.navOpenClass)) {
        onOpen();
        return;
      }

      this.menuToggle.classList.add('active');

      this.navTransitionInEvent = function () {
        _this3.transitioning = false;

        _this3.menu.removeEventListener('transitionend', _this3.navTransitionInEvent);

        onOpen();
      };

      this.menu.addEventListener('transitionend', this.navTransitionInEvent);
      this.transitioning = true; // We need to wait for the browser to set the display to 'block' before we set the margin
      // This will help with ensuring the different animations/transitions happen in sequence
      // and not at the same time.

      window.requestAnimationFrame(function () {
        _this3.header.classList.add(_this3.navOpenClass);

        window.requestAnimationFrame(function () {
          _this3.menu.setAttribute('style', 'margin-top: 0;');
        });
      });
    }
  }, {
    key: "_toggleMenu",
    value: function _toggleMenu() {
      if (this.header.classList.contains(this.navOpenClass)) {
        this.closeNavigation();
      } else {
        this.openNavigation();
      }
    }
    /**
     * Sticky header only shows as sticky after scroll
     *
     * @private
     */

  }, {
    key: "_toggleStickyHeader",
    value: function _toggleStickyHeader(entries) {
      if (ScrollLock["a" /* default */].isLocked || !Layout["a" /* default */].isGreaterThanBreakpoint('M')) {
        return;
      }

      var shouldShrink = !entries[0].isIntersecting; // Sticky header is scrolled, is and is visible -- nothing more to do!

      if (shouldShrink && this.header.classList.contains(this.scrolledClass)) {
        return;
      } // We also check to make sure the toggle hasnt activated recently to stop jerky transitions


      if (this.lastToggle + 500 > Date.now()) {
        return;
      }

      this.lastToggle = Date.now();

      if (shouldShrink) {
        this._shrink();
      } else {
        this._expand();
      }
    }
  }, {
    key: "_shrink",
    value: function _shrink() {
      this.closeNavigation();
      this.header.classList.add(this.scrolledClass);
    }
  }, {
    key: "_expand",
    value: function _expand() {
      this.openNavigation();
      this.header.classList.remove(this.scrolledClass);
      this.menuToggle.classList.remove('active');
    }
  }, {
    key: "unload",
    value: function unload() {
      this.body.classList.remove(this.stickyClass);
      this.body.classList.remove(this.scrolledClass);

      if (this.observer) {
        this.observer.disconnect();
      }

      this.menuToggle.removeEventListener('click', this.toggleClick);
    }
  }]);

  return StickyHeader;
}();


// EXTERNAL MODULE: ./node_modules/@shopify/theme-a11y/theme-a11y.js
var theme_a11y = __webpack_require__(21);

// EXTERNAL MODULE: ./node_modules/@pixelunion/breakpoint/dist/cjs/index.js
var cjs = __webpack_require__(23);

// EXTERNAL MODULE: ./source/scripts/Accordion.js
var Accordion = __webpack_require__(24);

// CONCATENATED MODULE: ./source/scripts/components/navigation/NavMobileSubMenus.js
function NavMobileSubMenus_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function NavMobileSubMenus_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function NavMobileSubMenus_createClass(Constructor, protoProps, staticProps) { if (protoProps) NavMobileSubMenus_defineProperties(Constructor.prototype, protoProps); if (staticProps) NavMobileSubMenus_defineProperties(Constructor, staticProps); return Constructor; }




var NavMobileSubMenus_NavMobileSubMenus = /*#__PURE__*/function () {
  function NavMobileSubMenus(el) {
    NavMobileSubMenus_classCallCheck(this, NavMobileSubMenus);

    this.$el = jquery_default()(el);
    this.Accordion = new Accordion["a" /* default */](el);
    this.closeAllSubmenus(); // Sub menu selectors

    this.activeMenuClass = 'navmenu-link-parent-active';
    this.activeMenu = ".".concat(this.activeMenuClass);
    this.linkClass = 'navmenu-link-parent';
    this.linkSelector = ".".concat(this.linkClass);
    this.navTrigger = '[data-navmenu-parent]';
    this.subMenu = '[data-navmenu-submenu]';
    this.buttonClass = 'navmenu-button';
    this.buttonSelector = ".".concat(this.buttonClass);

    this._bindEvents();
  }

  NavMobileSubMenus_createClass(NavMobileSubMenus, [{
    key: "unload",
    value: function unload() {
      this.$el.off('.mobile-nav');
      this.Accordion.unload();
    }
  }, {
    key: "closeSubMenus",
    value: function closeSubMenus(current) {
      var _this = this;

      var $current = jquery_default()(current);
      $current.find(this.activeMenu).each(function (index, el) {
        _this._closeSubmenu(jquery_default()(el));
      });
    }
  }, {
    key: "closeAllSubmenus",
    value: function closeAllSubmenus() {
      this.Accordion.closeAll({
        force: true
      });
    }
  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      var _this2 = this;

      // Prevent focus state from applying on mouse click
      this.$el.on('mousedown.mobile-nav', '.navmenu-link', function (event) {
        event.preventDefault();
      });
      this.$el.on('click.mobile-nav', "".concat(this.navTrigger, " > .navmenu-link-parent"), this._linkClicked.bind(this));
      this.$el.on('click.mobile-nav', "".concat(this.navTrigger, " > .navmenu-button"), function (event) {
        event.preventDefault();

        _this2._toggleSubmenu(event);
      });
    }
  }, {
    key: "_linkClicked",
    value: function _linkClicked(event) {
      var $target = jquery_default()(event.currentTarget);

      if (!$target.hasClass(this.activeMenuClass)) {
        event.preventDefault();

        this._openSubmenu($target);
      }
    }
  }, {
    key: "_toggleSubmenu",
    value: function _toggleSubmenu(event) {
      var $target = jquery_default()(event.currentTarget);
      var $link = $target.hasClass(this.linkClass) ? $target : $target.siblings(this.linkSelector).first();

      if ($link.hasClass(this.activeMenuClass)) {
        this._closeSubmenu($target);
      } else {
        this._openSubmenu($target);
      }
    }
  }, {
    key: "_openSubmenu",
    value: function _openSubmenu($target) {
      var $menu = $target.siblings(this.subMenu).first();
      var $link = $target.hasClass(this.linkClass) ? $target : $target.siblings(this.linkSelector).first();
      var $button = $target.hasClass(this.buttonClass) ? $target : $target.siblings(this.buttonSelector).first();
      $link.addClass(this.activeMenuClass);

      var onComplete = function onComplete() {
        $link.attr('aria-expanded', true);
        $button.attr('aria-expanded', true);
      };

      this.Accordion.open($menu[0], {
        onComplete: onComplete
      });
    }
  }, {
    key: "_closeSubmenu",
    value: function _closeSubmenu($target) {
      var $menu = $target.siblings(this.subMenu).first();
      var $link = $target.hasClass(this.linkClass) ? $target : $target.siblings(this.linkSelector).first();
      var $button = $target.hasClass(this.buttonClass) ? $target : $target.siblings(this.buttonSelector).first();
      $link.removeClass(this.activeMenuClass);

      var onComplete = function onComplete() {
        $link.attr('aria-expanded', false);
        $button.attr('aria-expanded', false);
      };

      this.Accordion.close($menu[0], {
        onComplete: onComplete
      });
      this.closeSubMenus($menu);
    }
  }]);

  return NavMobileSubMenus;
}();


// CONCATENATED MODULE: ./source/scripts/components/navigation/NavMobile.js
function NavMobile_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function NavMobile_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function NavMobile_createClass(Constructor, protoProps, staticProps) { if (protoProps) NavMobile_defineProperties(Constructor.prototype, protoProps); if (staticProps) NavMobile_defineProperties(Constructor, staticProps); return Constructor; }








var NavMobile_NavMobile = /*#__PURE__*/function () {
  function NavMobile(elements) {
    var _this = this;

    NavMobile_classCallCheck(this, NavMobile);

    this.el = elements.$el[0];
    this.toggleOpen = elements.$toggleOpen[0];
    this.mobileNav = this.el.querySelector('[data-mobile-nav]');
    this.navPanel = this.el.querySelector('[data-mobile-nav-panel]');
    this.navOverlay = this.el.querySelector('[data-mobile-nav-overlay]');
    this.toggleClose = this.el.querySelector('[data-mobile-nav-close]');
    this.isOpen = false;
    this.subMenus = null;
    this.events = new EventHandler_default.a(); // Revert navigation to original state on breakpoint change

    this.breakpointHandler = this.onBreakpointChange.bind(this);
    cjs["onChange"](this.breakpointHandler);
    this.navPanelAnimation = Object(animations_es["a" /* transition */])({
      el: this.navPanel,
      state: 'closed'
    });
    this.navOverlayAnimation = Object(animations_es["a" /* transition */])({
      el: this.navOverlay,
      state: 'closed'
    });
    this.events.register(this.toggleOpen, 'click', function (e) {
      return _this._open(e);
    });
  }

  NavMobile_createClass(NavMobile, [{
    key: "unload",
    value: function unload() {
      this._close();

      this.events.unregisterAll();
      cjs["offChange"](this.breakpointHandler);
      ScrollLock["a" /* default */].unlock();
    }
  }, {
    key: "onBreakpointChange",
    value: function onBreakpointChange() {
      if (cjs["min"]('L') && this.isOpen) {
        this._close();
      }
    }
  }, {
    key: "_open",
    value: function _open(e) {
      var _this2 = this;

      e.preventDefault();

      if (cjs["min"]('L')) {
        return;
      }

      ScrollLock["a" /* default */].lock(this.navPanel);
      this.isOpen = true; // Activate Submenu handler

      this.subMenus = new NavMobileSubMenus_NavMobileSubMenus(this.navPanel);
      this.mobileNav.dataset.open = 'true';
      this.navPanelAnimation.animateTo('open');
      this.navOverlayAnimation.animateTo('open');
      this.mobileNav.focus();
      Object(theme_a11y["b" /* trapFocus */])(this.mobileNav);
      this.overlayClickEvent = this.events.register(this.navOverlay, 'click', function (e) {
        return _this2._close(e);
      });
      this.toggleCloseEvent = this.events.register(this.toggleClose, 'click', function (e) {
        return _this2._close(e);
      });
      this.overlayTouchEvent = this.events.register(this.navOverlay, 'touchmove', function (e) {
        return e.preventDefault();
      });
      this.closeEsc = this.events.register(window, 'keydown', function (e) {
        if (e.key === 'Escape') {
          _this2._close(e);
        }
      });
    }
  }, {
    key: "_close",
    value: function _close(e) {
      var _this3 = this;

      if (e) e.preventDefault();
      this.navPanelAnimation.animateTo('closed');
      this.navOverlayAnimation.animateTo('closed').then(function () {
        _this3.mobileNav.dataset.open = 'false';
        Object(theme_a11y["a" /* removeTrapFocus */])(_this3.mobileNav);

        _this3.toggleOpen.focus();
      });
      ScrollLock["a" /* default */].unlock();
      this.isOpen = false; // Close any open drop down menus

      if (this.subMenus) {
        this.subMenus.closeSubMenus(this.navPanel);
        this.subMenus.closeAllSubmenus(); // Unbind Mobile sub menus

        this.subMenus.unload();
      }

      this.events.unregister(this.overlayClickEvent);
      this.events.unregister(this.overlayTouchEvent);
      this.events.unregister(this.toggleCloseEvent);
      this.events.unregister(this.closeEsc);
    }
  }]);

  return NavMobile;
}();


// EXTERNAL MODULE: ./source/scripts/helpers/site-main-dimmer.js
var site_main_dimmer = __webpack_require__(29);

// CONCATENATED MODULE: ./source/scripts/components/navigation/NavDesktopParent.js
function NavDesktopParent_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function NavDesktopParent_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function NavDesktopParent_createClass(Constructor, protoProps, staticProps) { if (protoProps) NavDesktopParent_defineProperties(Constructor.prototype, protoProps); if (staticProps) NavDesktopParent_defineProperties(Constructor, staticProps); return Constructor; }



 // eslint-disable-line import/no-cycle

var NavDesktopParent_NavDesktopParent = /*#__PURE__*/function () {
  function NavDesktopParent(el, options) {
    var _this = this;

    NavDesktopParent_classCallCheck(this, NavDesktopParent);

    this.listitem = el;
    this.link = null;
    this.submenu = null;
    this._isOpen = false;
    this.menu = null;
    this.parentMenu = options.parentMenu;
    this.closeSiblings = this.parentMenu.closeSiblings;
    var children = this.listitem.children;

    for (var i = 0; i < children.length; i++) {
      if (children[i].classList.contains('navmenu-link')) {
        this.link = children[i];
      } else if (children[i].classList.contains('navmenu-submenu')) {
        this.submenu = children[i];
      }
    }

    this.animation = Object(animations_es["a" /* transition */])({
      el: this.submenu,
      state: 'closed'
    });

    this.open = function () {
      _this._open();
    };

    this.close = function () {
      _this._close();
    };

    this.closeEsc = function (e) {
      if (e.key === 'Escape') {
        _this.link.focus();

        _this.close();
      }
    };

    this.closeTimer = null;
    this.openTimer = null;

    this.mouseover = function () {
      clearTimeout(_this.closeTimer);

      if (!_this.submenu.classList.contains('navmenu-depth-3')) {
        _this.openTimer = setTimeout(_this.open, 200);
      } else {
        _this.open();
      }
    };

    this.mouseout = function () {
      clearTimeout(_this.openTimer);
      _this.closeTimer = setTimeout(_this.close, 400);
    };

    this.click = function (e) {
      e.stopPropagation(); // if already open, continue to link destination

      if (!e.target.classList.contains('navmenu-link-parent') || _this._isOpen) {
        return;
      }

      e.preventDefault();

      _this.open();
    };

    this.focusin = function (e) {
      e.stopPropagation();

      if (e.target.classList.contains('navmenu-link-parent')) {
        _this.closeSiblings(_this);
      }
    };

    this.listitem.addEventListener('mouseover', this.mouseover);
    this.listitem.addEventListener('mouseout', this.mouseout);
    this.listitem.addEventListener('touchend', this.click);
    this.listitem.addEventListener('click', this.click);
    this.listitem.addEventListener('focusin', this.focusin);
    document.body.addEventListener('click', this.close);
    document.body.addEventListener('focusin', this.close);
  }

  NavDesktopParent_createClass(NavDesktopParent, [{
    key: "forceOpen",
    value: function forceOpen() {
      return this._open(true);
    }
  }, {
    key: "forceClose",
    value: function forceClose() {
      return this._close(true);
    }
  }, {
    key: "_open",
    value: function _open() {
      var _this2 = this;

      if (this._isOpen) return;
      this._isOpen = true;
      site_main_dimmer["b" /* dim */](this);
      this.closeSiblings(this);
      window.addEventListener('keydown', this.closeEsc);

      if (!this.menu) {
        this.menu = new NavDesktopMenu_NavDesktopMenu(this.submenu);
      }

      this.animation.animateTo('open', {
        hold: true,
        onStart: function onStart(_ref) {
          var el = _ref.el;
          var height = 0;

          for (var i = 0; i < el.children.length; i++) {
            height += el.children[i].offsetHeight;
          }

          var _window$getComputedSt = window.getComputedStyle(el),
              paddingTop = _window$getComputedSt.paddingTop,
              paddingBottom = _window$getComputedSt.paddingBottom;

          height += parseInt(paddingTop, 10);
          height += parseInt(paddingBottom, 10);

          _this2.listitem.style.setProperty('--menu-open-height', "".concat(height, "px")); // Check for alternate side dropdown


          var bounds = _this2.submenu.getBoundingClientRect();

          if (bounds.right > document.documentElement.clientWidth) {
            _this2.listitem.classList.add('alternate-drop');
          }
        }
      }).then(function (state) {
        if (state === 'open') {
          _this2.link.setAttribute('aria-expanded', true);
        }
      });
    }
  }, {
    key: "_close",
    value: function _close() {
      var _this3 = this;

      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (!this._isOpen) return;

      if (this.menu) {
        this.menu.unload();
        this.menu = null;
      }

      this._isOpen = false;
      window.removeEventListener('keydown', this.closeEsc);
      site_main_dimmer["a" /* clear */](this);
      this.animation.animateTo('closed', {
        force: force
      }).then(function (state) {
        if (state === 'closed') {
          _this3.listitem.classList.remove('alternate-drop');

          _this3.link.setAttribute('aria-expanded', false);

          _this3.parentMenu.openSelectedBlock();
        }
      });
    }
  }, {
    key: "unload",
    value: function unload() {
      this.forceClose();
      this.listitem.removeEventListener('mouseover', this.mouseover);
      this.listitem.removeEventListener('mouseout', this.mouseout);
      this.listitem.removeEventListener('touchend', this.click);
      this.listitem.removeEventListener('click', this.click);
      this.listitem.removeEventListener('focusin', this.focusin);
      window.removeEventListener('keydown', this.closeEsc);
      document.body.removeEventListener('click', this.bodyClose);
      document.body.removeEventListener('focusin', this.focusInClose);
      this.animation.unload();
    }
  }, {
    key: "isOpen",
    get: function get() {
      return this._isOpen;
    }
  }]);

  return NavDesktopParent;
}();


// CONCATENATED MODULE: ./source/scripts/components/navigation/NavDesktopMeganavParent.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function NavDesktopMeganavParent_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function NavDesktopMeganavParent_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function NavDesktopMeganavParent_createClass(Constructor, protoProps, staticProps) { if (protoProps) NavDesktopMeganavParent_defineProperties(Constructor.prototype, protoProps); if (staticProps) NavDesktopMeganavParent_defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }


 // eslint-disable-line import/no-cycle

var NavDesktopMeganavParent_NavDesktopMeganavParent = /*#__PURE__*/function (_NavDesktopParent) {
  _inherits(NavDesktopMeganavParent, _NavDesktopParent);

  var _super = _createSuper(NavDesktopMeganavParent);

  function NavDesktopMeganavParent() {
    NavDesktopMeganavParent_classCallCheck(this, NavDesktopMeganavParent);

    return _super.apply(this, arguments);
  }

  NavDesktopMeganavParent_createClass(NavDesktopMeganavParent, [{
    key: "mouseout",
    value: function mouseout() {
      // This prevents the menu from closing on mouseout when it's selected in the TE
      if (!this.parentMenu.shouldBlockClose(this)) return;
      this.timer = setTimeout(this.close, 400);
    }
  }, {
    key: "_open",
    value: function _open() {
      var _this = this;

      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (this._isOpen) return;
      this._isOpen = true;
      window.addEventListener('keydown', this.closeEsc); // Handles the special meganav to meganav transition behaviour, where
      // the drawer appears to stay open and transition from old to new height

      var resolveOpenMeganavs = new Promise(function (resolve) {
        var openMeganav = _this.parentMenu.openMeganav;

        if (openMeganav) {
          // Set height to start transitioning from: the open height of the previous meganav
          _this.listitem.style.setProperty('--menu-closed-height', "".concat(openMeganav.openHeight, "px")); // Inject old meganav ghost content


          var meganavGhostContent = openMeganav.content.cloneNode(true);

          var _openMeganav$content$ = openMeganav.content.getBoundingClientRect(),
              width = _openMeganav$content$.width,
              left = _openMeganav$content$.left;

          meganavGhostContent.classList.add('meganav-ghost'); // Set styles to absolutely position ghost content correctly

          meganavGhostContent.style.left = "".concat(left, "px");
          meganavGhostContent.style.width = "".concat(width, "px");

          _this.submenu.appendChild(meganavGhostContent);

          site_main_dimmer["b" /* dim */](_this); // Jump to ghost state

          _this.animation.animateTo('ghost', {
            force: true
          }) // Close other meganav
          .then(function () {
            return _this.parentMenu.openMeganav.forceClose();
          }).then(resolve);
        } else {
          // If no other meganavs are open we can start immediately.
          _this.listitem.style.setProperty('--menu-closed-height', 0);

          site_main_dimmer["b" /* dim */](_this);
          resolve();
        }
      });
      resolveOpenMeganavs.then(function () {
        return _this.closeSiblings(_this);
      }).then(function () {
        return _this.animation.animateTo('open', {
          force: force,
          hold: !force,
          onStart: function onStart(_ref) {
            var el = _ref.el;
            var wrapper = el.querySelector('.navmenu-meganav-wrapper');
            var maxHeight = parseInt(window.getComputedStyle(wrapper).maxHeight, 10);
            var height = isFinite(maxHeight) ? Math.min(wrapper.scrollHeight, maxHeight) : wrapper.scrollHeight;

            _this.listitem.style.setProperty('--menu-open-height', "".concat(height, "px"));

            _this._openHeight = height;
          }
        });
      }).then(function () {
        _this.link.setAttribute('aria-expanded', true);

        _this.parentMenu.openMeganav = _this; // Rapid mouse movement can sometimes cancel animation before ghost is removed,
        // so when things finally settle make sure we're removing all ghosts.

        _this.submenu.querySelectorAll('.meganav-ghost').forEach(function (ghost) {
          ghost.parentNode.removeChild(ghost);
        });
      });
    }
  }, {
    key: "_close",
    value: function _close() {
      var _this2 = this;

      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      // You would expect to see something like this to avoid "double closing" menus,
      // but in practice it works more reliably to always run when the function is called,
      // to avoid out-of-sync situations.
      // if (!this._isOpen) return Promise.resolve();
      if (this.parentMenu.openMeganav === this) {
        this.parentMenu.openMeganav = null;
      }

      this._isOpen = false;
      window.removeEventListener('keydown', this.closeEsc);
      this.listitem.style.setProperty('--menu-closed-height', 0);
      site_main_dimmer["a" /* clear */](this);
      return this.animation.animateTo('closed', {
        force: force
      }).then(function () {
        _this2.link.setAttribute('aria-expanded', false);

        _this2.parentMenu.openSelectedBlock();
      });
    }
  }, {
    key: "content",
    get: function get() {
      return this.submenu.querySelector('.navmenu-meganav-wrapper');
    }
  }, {
    key: "openHeight",
    get: function get() {
      return this._openHeight;
    }
  }, {
    key: "blockId",
    get: function get() {
      return this.submenu.dataset.meganavId;
    }
  }]);

  return NavDesktopMeganavParent;
}(NavDesktopParent_NavDesktopParent);


// CONCATENATED MODULE: ./source/scripts/components/navigation/NavDesktopMenu.js
function NavDesktopMenu_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function NavDesktopMenu_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function NavDesktopMenu_createClass(Constructor, protoProps, staticProps) { if (protoProps) NavDesktopMenu_defineProperties(Constructor.prototype, protoProps); if (staticProps) NavDesktopMenu_defineProperties(Constructor, staticProps); return Constructor; }

 // eslint-disable-line import/no-cycle

 // eslint-disable-line import/no-cycle

var NavDesktopMenu_NavDesktopMenu = /*#__PURE__*/function () {
  function NavDesktopMenu(_ref) {
    var _this = this;

    var children = _ref.children;

    NavDesktopMenu_classCallCheck(this, NavDesktopMenu);

    this.parents = [];
    this.children = children; // Meganav, if any, that is fully open (not animating).

    this._openMeganav = null; // Meganav, if any, that is selected for editing in the TE.

    this._selectedBlock = null;
    this._megaNavs = null;

    this.closeSiblings = function (current) {
      _this.parents.forEach(function (parent) {
        if (parent !== current) {
          parent.close();
        }
      });
    };

    for (var i = 0; i < this.children.length; i++) {
      var child = this.children[i];

      if (child.dataset.navmenuMeganavTrigger !== undefined) {
        this.parents.push(new NavDesktopMeganavParent_NavDesktopMeganavParent(child, {
          parentMenu: this
        }));
      } else if (child.dataset.navmenuParent !== undefined) {
        this.parents.push(new NavDesktopParent_NavDesktopParent(child, {
          parentMenu: this
        }));
      } else if (child.classList.contains('navmenu-item')) {
        child.addEventListener('focusin', this.closeSiblings);
      }
    }
  }

  NavDesktopMenu_createClass(NavDesktopMenu, [{
    key: "selectBlock",
    value: function selectBlock(id) {
      var _this2 = this;

      // This is TE only, so only initialize the first time a block is selected
      if (!this._megaNavs) {
        this._megaNavs = {};
        this.parents.filter(function (parent) {
          return parent instanceof NavDesktopMeganavParent_NavDesktopMeganavParent;
        }).forEach(function (megaNav) {
          _this2._megaNavs[megaNav.blockId] = megaNav;
        });
      }

      var newSelectedBlock = this._megaNavs[id];
      if (this._selectedBlock === newSelectedBlock) return;

      if (this._selectedBlock) {
        this._selectedBlock.close();
      }

      this._selectedBlock = this._megaNavs[id]; // Force open give a better experience when changing settings.
      // Otherwise the selected block visibly closes and reopens after every
      // settings change.

      this._selectedBlock.forceOpen();
    }
  }, {
    key: "openSelectedBlock",
    value: function openSelectedBlock() {
      if (this._selectedBlock && this.parents.filter(function (parent) {
        return parent.isOpen;
      }).length === 0) {
        this._selectedBlock.open();
      }
    } // If a block is open and selected in the TE and no other blocks are open
    // we don't want to close it when we normally would.

  }, {
    key: "shouldBlockClose",
    value: function shouldBlockClose(block) {
      if (block === this._selectedBlock && this.parents.filter(function (parent) {
        return parent.isOpen;
      }).length === 1) {
        return false;
      }

      return true;
    }
  }, {
    key: "closeAllMenus",
    value: function closeAllMenus() {
      this._selectedBlock = null;
      this.parents.forEach(function (parent) {
        return parent.close();
      });
    }
  }, {
    key: "unload",
    value: function unload() {
      this.parents.forEach(function (parent) {
        parent.unload();
      });

      for (var i = 0; i < this.children.length; i++) {
        this.children[i].removeEventListener('focusin', this.closeSiblings);
      }
    }
  }, {
    key: "openMeganav",
    get: function get() {
      return this._openMeganav;
    },
    set: function set(meganav) {
      this._openMeganav = meganav;
    }
  }]);

  return NavDesktopMenu;
}();


// EXTERNAL MODULE: ./source/scripts/components/search/LiveSearch.js + 2 modules
var LiveSearch = __webpack_require__(38);

// EXTERNAL MODULE: ./source/scripts/components/search/SearchForm.js
var SearchForm = __webpack_require__(25);

// CONCATENATED MODULE: ./source/scripts/sections/StaticHeader.js
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function StaticHeader_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function StaticHeader_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function StaticHeader_createClass(Constructor, protoProps, staticProps) { if (protoProps) StaticHeader_defineProperties(Constructor.prototype, protoProps); if (staticProps) StaticHeader_defineProperties(Constructor, staticProps); return Constructor; }













var StaticHeader_StaticHeader = /*#__PURE__*/function () {
  function StaticHeader(section) {
    var _this = this;

    StaticHeader_classCallCheck(this, StaticHeader);

    this.$el = jquery_default()(section.el);
    this.settings = section.data.settings;
    this.postMessage = section.postMessage;
    this.headerSearch = null;
    this.$scripts = jquery_default()('[data-scripts]');
    this.$menuToggle = this.$el.find('[data-menu-toggle]');
    this.$cartCount = this.$el.find('[data-header-cart-count]');
    this.$searchField = this.$el.find('[data-live-search]');
    this.$siteNavigation = this.$el.find('[data-site-navigation]');
    this.$desktopNavigation = this.$siteNavigation.find('ul.navmenu-depth-1');
    this.$headerTools = this.$siteNavigation.find('[data-header-actions]');
    this.$promoContent = this.$el.find('.small-promo');
    this.stickyHeader = new StickyHeader_StickyHeader({
      header: this.$el[0],
      menuToggle: this.$menuToggle[0],
      postMessage: this.postMessage
    }, this.settings);
    this.navMobile = new NavMobile_NavMobile({
      $el: this.$el,
      $toggleOpen: this.$menuToggle
    });
    this.navDesktop = new NavDesktopMenu_NavDesktopMenu(document.querySelector('.site-navigation > [data-navmenu]'));
    this.forms = new Forms["a" /* default */](this.$el);
    this.events = new EventHandler_default.a();

    if (this.settings.live_search.enable) {
      script_default()(this.$scripts.data('shopify-api-url'), function () {
        _this.headerSearch = new LiveSearch["a" /* default */]({
          $el: _this.$searchField,
          $header: _this.$el
        }, _objectSpread(_objectSpread({}, _this.settings.live_search), {}, {
          use_dimmer: true
        }));
        _this.mobileSearchButtonEl = section.el.querySelector('[data-mobile-search-button]');

        if (_this.mobileSearchButtonEl) {
          var disableAnimations = ('reduceAnimations' in document.body.dataset);
          _this.mobileSearchButtonAnimation = Object(animations_es["a" /* transition */])({
            el: _this.mobileSearchButtonEl,
            state: 'visible'
          });

          _this.events.register(_this.mobileSearchButtonEl, 'click', function (e) {
            e.stopPropagation();

            _this.headerSearch.open();

            _this.mobileSearchButtonAnimation.animateTo('hidden', {
              force: disableAnimations
            });
          });

          _this.mobileSearchTakeoverCancel = section.el.querySelector('[data-live-search-takeover-cancel]');

          _this.events.register(_this.mobileSearchTakeoverCancel, 'click', function () {
            _this.mobileSearchButtonAnimation.animateTo('visible', {
              force: disableAnimations
            });
          });
        }
      });
    } else {
      this.headerSearch = new SearchForm["a" /* default */](this.$searchField);
    }

    jquery_default()(window).on('cartcount:update', function (event, data) {
      _this.$cartCount.attr('data-header-cart-count', data.response.item_count).toggleClass('visible', data.response.item_count > 0);
    }); // This sets a CSS variable to determine the height of the promo in the header, which is used for
    // some styles between the xs and large breakpoints.

    var setPromoHeightVariable = function setPromoHeightVariable() {
      if (_this.$promoContent.length > 0) {
        var height = _this.$promoContent.outerHeight();

        _this.$el[0].style.setProperty('--promo-height', "".concat(height, "px"));
      }
    };

    jquery_default()(window).on('resize', function () {
      return setPromoHeightVariable();
    });
    setPromoHeightVariable();
  }

  StaticHeader_createClass(StaticHeader, [{
    key: "onSectionSelect",
    value: function onSectionSelect() {
      this.stickyHeader.openNavigation();
    }
  }, {
    key: "onSectionDeselect",
    value: function onSectionDeselect() {
      this._closeAllNavigation();
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.stickyHeader.unload();
      this.navMobile.unload();
      this.navDesktop.unload();
      this.forms.unload();
      jquery_default()(window).off('cartcount:update');
      this.headerSearch.unload();
      this.events.unregisterAll();
    }
  }, {
    key: "onSectionMessage",
    value: function onSectionMessage(name) {
      if (name === 'nav:close-all' && Layout["a" /* default */].isGreaterThanBreakpoint('M')) {
        this._closeAllNavigation();
      }
    }
  }, {
    key: "onSectionBlockSelect",
    value: function onSectionBlockSelect(block) {
      var _this2 = this;

      if (!Layout["a" /* default */].isGreaterThanBreakpoint('M')) {
        return;
      }

      this.stickyHeader.openNavigation(function () {
        _this2.navDesktop.selectBlock(block.id);
      });
    }
  }, {
    key: "onSectionBlockDeselect",
    value: function onSectionBlockDeselect() {
      this._closeAllNavigation();
    }
  }, {
    key: "_closeAllNavigation",
    value: function _closeAllNavigation() {
      this.navDesktop.closeAllMenus();
    }
  }]);

  return StaticHeader;
}();



/***/ })

}]);
//# sourceMappingURL=StaticHeader.bundle.js.map?1592422769306