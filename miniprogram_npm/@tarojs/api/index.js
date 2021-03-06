module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1649338160477, function(require, module, exports) {


Object.defineProperty(exports, '__esModule', { value: true });

var _typeof = require('@babel/runtime/helpers/typeof');
var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _classCallCheck = require('@babel/runtime/helpers/classCallCheck');
var _createClass = require('@babel/runtime/helpers/createClass');
var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var runtime = require('@tarojs/runtime');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);
var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var _classCallCheck__default = /*#__PURE__*/_interopDefaultLegacy(_classCallCheck);
var _createClass__default = /*#__PURE__*/_interopDefaultLegacy(_createClass);
var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);

function isFunction(x) {
  return typeof x === 'function';
}
function isUndefined(x) {
  return typeof x === 'undefined';
}
function isObject(x) {
  return _typeof__default['default'](x) === 'object';
}

function isBadObj(x) {
  !isObject(x) || x === null;
}

function throwTypeError(s) {
  throw new TypeError(s);
}

if (!isFunction(Object.assign)) {
  // Must be writable: true, enumerable: false, configurable: true
  Object.assign = function (target) {
    // .length of function is 2
    if (target == null) {
      // TypeError if undefined or null
      throwTypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) {
        // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }

    return to;
  };
}

if (!isFunction(Object.defineProperties)) {
  Object.defineProperties = function (obj, properties) {
    function convertToDescriptor(desc) {
      function hasProperty(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
      }

      if (isBadObj(desc)) {
        throwTypeError('bad desc');
      }

      var d = {};
      if (hasProperty(desc, 'enumerable')) d.enumerable = !!desc.enumerable;

      if (hasProperty(desc, 'configurable')) {
        d.configurable = !!desc.configurable;
      }

      if (hasProperty(desc, 'value')) d.value = desc.value;
      if (hasProperty(desc, 'writable')) d.writable = !!desc.writable;

      if (hasProperty(desc, 'get')) {
        var g = desc.get;

        if (!isFunction(g) && !isUndefined(g)) {
          throwTypeError('bad get');
        }

        d.get = g;
      }

      if (hasProperty(desc, 'set')) {
        var s = desc.set;

        if (!isFunction(s) && !isUndefined(s)) {
          throwTypeError('bad set');
        }

        d.set = s;
      }

      if (('get' in d || 'set' in d) && ('value' in d || 'writable' in d)) {
        throwTypeError('identity-confused descriptor');
      }

      return d;
    }

    if (isBadObj(obj)) throwTypeError('bad obj');
    properties = Object(properties);
    var keys = Object.keys(properties);
    var descs = [];

    for (var i = 0; i < keys.length; i++) {
      descs.push([keys[i], convertToDescriptor(properties[keys[i]])]);
    }

    for (var _i = 0; _i < descs.length; _i++) {
      Object.defineProperty(obj, descs[_i][0], descs[_i][1]);
    }

    return obj;
  };
}

var ENV_TYPE = {
  WEAPP: 'WEAPP',
  WEB: 'WEB',
  RN: 'RN',
  SWAN: 'SWAN',
  ALIPAY: 'ALIPAY',
  TT: 'TT',
  QQ: 'QQ',
  JD: 'JD'
};
function getEnv() {
  if (process.env.TARO_ENV === 'weapp') {
    return ENV_TYPE.WEAPP;
  } else if (process.env.TARO_ENV === 'alipay') {
    return ENV_TYPE.ALIPAY;
  } else if (process.env.TARO_ENV === 'swan') {
    return ENV_TYPE.SWAN;
  } else if (process.env.TARO_ENV === 'tt') {
    return ENV_TYPE.TT;
  } else if (process.env.TARO_ENV === 'jd') {
    return ENV_TYPE.JD;
  } else if (process.env.TARO_ENV === 'qq') {
    return ENV_TYPE.QQ;
  } else if (process.env.TARO_ENV === 'h5') {
    return ENV_TYPE.WEB;
  } else if (process.env.TARO_ENV === 'rn') {
    return ENV_TYPE.RN;
  } else {
    return process.env.TARO_ENV || 'Unknown';
  }
}

var Chain = /*#__PURE__*/function () {
  function Chain(requestParams, interceptors, index) {
    _classCallCheck__default['default'](this, Chain);

    this.index = index || 0;
    this.requestParams = requestParams;
    this.interceptors = interceptors || [];
  }

  _createClass__default['default'](Chain, [{
    key: "proceed",
    value: function proceed(requestParams) {
      this.requestParams = requestParams;

      if (this.index >= this.interceptors.length) {
        throw new Error('chain ????????????, ?????????????????? request.chain');
      }

      var nextInterceptor = this._getNextInterceptor();

      var nextChain = this._getNextChain();

      var p = nextInterceptor(nextChain);
      var res = p.catch(function (err) {
        return Promise.reject(err);
      });
      if (isFunction(p.abort)) res.abort = p.abort;
      return res;
    }
  }, {
    key: "_getNextInterceptor",
    value: function _getNextInterceptor() {
      return this.interceptors[this.index];
    }
  }, {
    key: "_getNextChain",
    value: function _getNextChain() {
      return new Chain(this.requestParams, this.interceptors, this.index + 1);
    }
  }]);

  return Chain;
}();

var Link = /*#__PURE__*/function () {
  function Link(interceptor) {
    _classCallCheck__default['default'](this, Link);

    this.taroInterceptor = interceptor;
    this.chain = new Chain();
  }

  _createClass__default['default'](Link, [{
    key: "request",
    value: function request(requestParams) {
      var chain = this.chain;
      var taroInterceptor = this.taroInterceptor;
      chain.interceptors = chain.interceptors.filter(function (interceptor) {
        return interceptor !== taroInterceptor;
      }).concat(taroInterceptor);
      return chain.proceed(_objectSpread__default['default']({}, requestParams));
    }
  }, {
    key: "addInterceptor",
    value: function addInterceptor(interceptor) {
      this.chain.interceptors.push(interceptor);
    }
  }, {
    key: "cleanInterceptors",
    value: function cleanInterceptors() {
      this.chain = new Chain();
    }
  }]);

  return Link;
}();

function timeoutInterceptor(chain) {
  var requestParams = chain.requestParams;
  var p;
  var res = new Promise(function (resolve, reject) {
    var timeout = setTimeout(function () {
      timeout = null;
      reject(new Error('??????????????????,??????????????????'));
    }, requestParams && requestParams.timeout || 60000);
    p = chain.proceed(requestParams);
    p.then(function (res) {
      if (!timeout) return;
      clearTimeout(timeout);
      resolve(res);
    }).catch(function (err) {
      timeout && clearTimeout(timeout);
      reject(err);
    });
  });
  if (!isUndefined(p) && isFunction(p.abort)) res.abort = p.abort;
  return res;
}
function logInterceptor(chain) {
  var requestParams = chain.requestParams;
  var method = requestParams.method,
      data = requestParams.data,
      url = requestParams.url;

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log("http ".concat(method || 'GET', " --> ").concat(url, " data: "), data);
  }

  var p = chain.proceed(requestParams);
  var res = p.then(function (res) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log("http <-- ".concat(url, " result:"), res);
    }

    return res;
  });
  if (isFunction(p.abort)) res.abort = p.abort;
  return res;
}

var interceptors = /*#__PURE__*/Object.freeze({
  __proto__: null,
  timeoutInterceptor: timeoutInterceptor,
  logInterceptor: logInterceptor
});

function Behavior(options) {
  return options;
}
function getPreload(current) {
  return function (key, val) {
    current.preloadData = isObject(key) ? key : _defineProperty__default['default']({}, key, val);
  };
}
var defaultDesignWidth = 750;
var defaultDesignRatio = {
  640: 2.34 / 2,
  750: 1,
  828: 1.81 / 2
};
function getInitPxTransform(taro) {
  return function (config) {
    var _config$designWidth = config.designWidth,
        designWidth = _config$designWidth === void 0 ? defaultDesignWidth : _config$designWidth,
        _config$deviceRatio = config.deviceRatio,
        deviceRatio = _config$deviceRatio === void 0 ? defaultDesignRatio : _config$deviceRatio;
    taro.config = taro.config || {};
    taro.config.designWidth = designWidth;
    taro.config.deviceRatio = deviceRatio;
  };
}
function getPxTransform(taro) {
  return function (size) {
    var _ref2 = taro.config || {},
        _ref2$designWidth = _ref2.designWidth,
        designWidth = _ref2$designWidth === void 0 ? defaultDesignWidth : _ref2$designWidth,
        _ref2$deviceRatio = _ref2.deviceRatio,
        deviceRatio = _ref2$deviceRatio === void 0 ? defaultDesignRatio : _ref2$deviceRatio;

    if (!(designWidth in deviceRatio)) {
      throw new Error("deviceRatio \u914D\u7F6E\u4E2D\u4E0D\u5B58\u5728 ".concat(designWidth, " \u7684\u8BBE\u7F6E\uFF01"));
    }

    return parseInt(size, 10) * deviceRatio[designWidth] + 'rpx';
  };
}

/* eslint-disable camelcase */
var Taro = {
  Behavior: Behavior,
  getEnv: getEnv,
  ENV_TYPE: ENV_TYPE,
  Link: Link,
  interceptors: interceptors,
  Current: runtime.Current,
  getCurrentInstance: runtime.getCurrentInstance,
  options: runtime.options,
  nextTick: runtime.nextTick,
  eventCenter: runtime.eventCenter,
  Events: runtime.Events,
  getInitPxTransform: getInitPxTransform
};
Taro.initPxTransform = getInitPxTransform(Taro);
Taro.preload = getPreload(runtime.Current);
Taro.pxTransform = getPxTransform(Taro);

exports['default'] = Taro;
//# sourceMappingURL=index.js.map

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1649338160477);
})()
//miniprogram-npm-outsideDeps=["@babel/runtime/helpers/typeof","@babel/runtime/helpers/objectSpread2","@babel/runtime/helpers/classCallCheck","@babel/runtime/helpers/createClass","@babel/runtime/helpers/defineProperty","@tarojs/runtime"]
//# sourceMappingURL=index.js.map