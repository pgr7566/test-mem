(window["wpJsonpPaskit"] = window["wpJsonpPaskit"] || []).push([[20],{

/***/ 80:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var scriptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var scriptjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(scriptjs__WEBPACK_IMPORTED_MODULE_0__);

/*!
 * @pixelunion/pxs-map v2.0.7
 * (c) 2020 Pixel Union
 */



function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/*
 * Function to convert any given latitude and longitude format to decimal degrees
 */
function getDecimalDegrees() {
  var firstComponent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var secondComponent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var thirdComponent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var fourthComponent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var directions = {
    N: 1,
    E: 1,
    S: -1,
    W: -1
  };
  var decimalDegrees = 0.0;
  var components = [firstComponent, secondComponent, thirdComponent, fourthComponent];

  for (var i = 0; i < components.length; i++) {
    var component = components[i];

    if (component) {
      if (Number.isNaN(parseFloat(component))) {
        decimalDegrees *= directions[component];
      } else {
        decimalDegrees += parseFloat(component) / Math.pow(60, i);
      }
    }
  }

  return decimalDegrees;
}
/*
 * By providing the ability to use a place name, or latitude and longitude coordinates
 * we give merchants, and our demo stores the option to bypass the Geocoding API.
 * The Geocoding API (https://developers.google.com/maps/documentation/geocoding/usage-and-billing) allows us
 * to take a place name and convert it to latitude and longitude expressed in decimal degrees.
 */


function getLatitudeLongitude(address) {
  // Degrees, Minutes and Seconds: DDD° MM' SS.S"
  var latLongDegreesMinutesSeconds = /^([0-9]{1,3})(?:°[ ]?| )([0-9]{1,2})(?:'[ ]?| )([0-9]{1,2}(?:\.[0-9]+)?)(?:"[ ]?| )?(N|E|S|W) ?([0-9]{1,3})(?:°[ ]?| )([0-9]{1,2})(?:'[ ]?| )([0-9]{1,2}(?:\.[0-9]+)?)(?:"[ ]?| )?(N|E|S|W)$/g; // Degrees and Decimal Minutes: DDD° MM.MMM'

  var latLongDegreesMinutes = /^([0-9]{1,3})(?:°[ ]?| )([0-9]{1,2}(?:\.[0-9]+)?)(?:'[ ]?| )?(N|E|S|W) ?([0-9]{1,3})(?:°[ ]?| )([0-9]{1,2}(?:\.[0-9]+)?)(?:'[ ]?| )?(N|E|S|W)$/g; // Decimal Degrees: DDD.DDDDD°

  var latLongDegrees = /^([-|+]?[0-9]{1,3}(?:\.[0-9]+)?)(?:°[ ]?| )?(N|E|S|W)?,? ?([-|+]?[0-9]{1,3}(?:\.[0-9]+)?)(?:°[ ]?| )?(N|E|S|W)?$/g;
  var latLongFormats = [latLongDegreesMinutesSeconds, latLongDegreesMinutes, latLongDegrees];
  var latLongMatches = latLongFormats.map(function (latLongFormat) {
    return address.match(latLongFormat);
  });
  /*
   * Select the first latitude and longitude format that is matched.
   * Ordering:
   *   1. Degrees, minutes, and seconds,
   *   2. Degrees, and decimal minutes,
   *   3. Decimal degrees.
   */

  var latLongMatch = latLongMatches.reduce(function (accumulator, value, index) {
    if (!accumulator && value) {
      var latLongResult = latLongFormats[index].exec(address);
      var lat = latLongResult.slice(1, latLongResult.length / 2 + 1);
      var lng = latLongResult.slice(latLongResult.length / 2 + 1, latLongResult.length);
      return {
        lat: lat,
        lng: lng
      };
    }

    return accumulator;
  }, null);
  return new Promise(function (resolve, reject) {
    // If we've got a match on latitude and longitude, use that and avoid geocoding
    if (latLongMatch) {
      var latDecimalDegrees = getDecimalDegrees.apply(void 0, _toConsumableArray(latLongMatch.lat));
      var longDecimalDegrees = getDecimalDegrees.apply(void 0, _toConsumableArray(latLongMatch.lng));
      resolve({
        lat: latDecimalDegrees,
        lng: longDecimalDegrees
      });
    } else {
      // Otherwise, geocode the assumed address
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        address: address
      }, function (results, status) {
        if (status !== google.maps.GeocoderStatus.OK || !results[0]) {
          reject(status);
        } else {
          resolve(results[0].geometry.location);
        }
      });
    }
  });
}

function getMapStyles(colors) {
  if (!colors) {
    return [];
  }

  return [{
    elementType: 'geometry',
    stylers: [{
      color: colors.e
    }]
  }, {
    elementType: 'labels.icon',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    elementType: 'labels.text.fill',
    stylers: [{
      color: colors.a
    }]
  }, {
    elementType: 'labels.text.stroke',
    stylers: [{
      color: colors.e
    }]
  }, {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'administrative.country',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'administrative.land_parcel',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'administrative.neighborhood',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'administrative.locality',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'poi',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{
      color: colors.d
    }]
  }, {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{
      color: colors.c
    }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{
      color: colors.b
    }]
  }, {
    featureType: 'road.highway.controlled_access',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [{
      color: colors.b
    }]
  }, {
    featureType: 'road.local',
    elementType: 'labels.text.stroke',
    stylers: [{
      color: colors.e
    }]
  }, {
    featureType: 'transit',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{
      color: colors.f
    }]
  }];
}

function createMap(options) {
  var container = options.container,
      address = options.address,
      zoom = options.zoom,
      colors = options.colors;
  return getLatitudeLongitude(address).then(function (latLong) {
    var map = new google.maps.Map(container, {
      center: latLong,
      clickableIcons: false,
      disableDefaultUI: true,
      disableDoubleClickZoom: true,
      gestureHandling: 'none',
      keyboardShortcuts: false,
      maxZoom: zoom,
      minZoom: zoom,
      scrollWheel: false,
      styles: getMapStyles(colors),
      zoom: zoom,
      zoomControl: false
    });
    new google.maps.Marker({
      clickable: false,
      map: map,
      position: map.getCenter()
    });
    map.panBy(0, 0);
  })["catch"](function (status) {
    var usageLimits = 'https://developers.google.com/maps/faq#usagelimits';
    var errorMessage;

    switch (status) {
      case 'ZERO_RESULTS':
        errorMessage = "<p>Unable to find the address:</p> ".concat(address);
        break;

      case 'OVER_QUERY_LIMIT':
        errorMessage = "\n            <p>Unable to load Google Maps, you have reached your usage limit.</p>\n            <p>\n              Please visit\n              <a href=\"".concat(usageLimits, "\" target=\"_blank\">").concat(usageLimits, "</a>\n              for more details.\n            </p>\n          ");
        break;

      default:
        errorMessage = 'Unable to load Google Maps.';
        break;
    }

    throw errorMessage;
  });
}

function displayErrorInThemeEditor(container, errorMessage) {
  var isThemeEditor = window.Shopify && window.Shopify.designMode;

  if (!isThemeEditor) {
    return;
  }

  container.innerHTML = "<div class=\"map-error-message\">".concat(errorMessage, "</div>");
}

var PxsMap = function PxsMap(section) {
  var _this = this;

  _classCallCheck(this, PxsMap);

  this.map = null;
  var el = section.el.querySelector('[data-map]');
  var container = el.querySelector('[data-map-container]');
  var settings = section.data;
  var address = settings.address,
      colors = settings.colors;
  var apiKey = settings.api_key; // Scale so range is 12 ~ 17, rather than 1 to 6

  var zoom = Number.isNaN(settings.zoom) ? 13 : 11 + parseInt(settings.zoom, 10);

  if (apiKey) {
    if (window.googleMaps === undefined) {
      scriptjs__WEBPACK_IMPORTED_MODULE_0___default()("https://maps.googleapis.com/maps/api/js?key=".concat(apiKey), function () {
        window.googleMaps = true;
        createMap({
          container: container,
          address: address,
          zoom: zoom,
          colors: colors
        }).then(function (map) {
          _this.map = map;
        })["catch"](function (error) {
          return displayErrorInThemeEditor(container, error);
        });
      });
    } else {
      createMap({
        container: container,
        address: address,
        zoom: zoom,
        colors: colors
      }).then(function (map) {
        _this.map = map;
      })["catch"](function (error) {
        return displayErrorInThemeEditor(container, error);
      });
    }
  }
};

/* harmony default export */ __webpack_exports__["default"] = (PxsMap);


/***/ })

}]);
//# sourceMappingURL=PXSMap.bundle.js.map?1592422769306