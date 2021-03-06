module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1649338160483, function(require, module, exports) {


Object.defineProperty(exports, '__esModule', { value: true });

var _extends = require('@babel/runtime/helpers/esm/extends');
var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _asyncToGenerator = require('@babel/runtime/helpers/asyncToGenerator');
var _regeneratorRuntime = require('@babel/runtime/regenerator');
var _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');
var _classCallCheck = require('@babel/runtime/helpers/classCallCheck');
var _createClass = require('@babel/runtime/helpers/createClass');
var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var runtime = require('@tarojs/runtime');
var _typeof = require('@babel/runtime/helpers/typeof');
var _slicedToArray = require('@babel/runtime/helpers/slicedToArray');
var _createForOfIteratorHelper = require('@babel/runtime/helpers/createForOfIteratorHelper');
var taro = require('@tarojs/taro');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _extends__default = /*#__PURE__*/_interopDefaultLegacy(_extends);
var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var _asyncToGenerator__default = /*#__PURE__*/_interopDefaultLegacy(_asyncToGenerator);
var _regeneratorRuntime__default = /*#__PURE__*/_interopDefaultLegacy(_regeneratorRuntime);
var _toConsumableArray__default = /*#__PURE__*/_interopDefaultLegacy(_toConsumableArray);
var _classCallCheck__default = /*#__PURE__*/_interopDefaultLegacy(_classCallCheck);
var _createClass__default = /*#__PURE__*/_interopDefaultLegacy(_createClass);
var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);
var _slicedToArray__default = /*#__PURE__*/_interopDefaultLegacy(_slicedToArray);
var _createForOfIteratorHelper__default = /*#__PURE__*/_interopDefaultLegacy(_createForOfIteratorHelper);

var r,
    B = r || (r = {});
B.Pop = "POP";
B.Push = "PUSH";
B.Replace = "REPLACE";
var C = "production" !== process.env.NODE_ENV ? function (b) {
  return Object.freeze(b);
} : function (b) {
  return b;
};

function D(b, h) {
  if (!b) {
    "undefined" !== typeof console && console.warn(h);

    try {
      throw Error(h);
    } catch (k) {}
  }
}

function E(b) {
  b.preventDefault();
  b.returnValue = "";
}

function F() {
  var b = [];
  return {
    get length() {
      return b.length;
    },

    push: function push(h) {
      b.push(h);
      return function () {
        b = b.filter(function (k) {
          return k !== h;
        });
      };
    },
    call: function call(h) {
      b.forEach(function (k) {
        return k && k(h);
      });
    }
  };
}

function H() {
  return Math.random().toString(36).substr(2, 8);
}

function I(b) {
  var h = b.pathname,
      k = b.search;
  b = b.hash;
  return (void 0 === h ? "/" : h) + (void 0 === k ? "" : k) + (void 0 === b ? "" : b);
}

function J(b) {
  var h = {};

  if (b) {
    var k = b.indexOf("#");
    0 <= k && (h.hash = b.substr(k), b = b.substr(0, k));
    k = b.indexOf("?");
    0 <= k && (h.search = b.substr(k), b = b.substr(0, k));
    b && (h.pathname = b);
  }

  return h;
}

function createBrowserHistory(b) {
  function h() {
    var c = p.location,
        a = m.state || {};
    return [a.idx, C({
      pathname: c.pathname,
      search: c.search,
      hash: c.hash,
      state: a.usr || null,
      key: a.key || "default"
    })];
  }

  function k(c) {
    return "string" === typeof c ? c : I(c);
  }

  function x(c, a) {
    void 0 === a && (a = null);
    return C(_extends__default['default']({
      pathname: q.pathname,
      hash: "",
      search: ""
    }, "string" === typeof c ? J(c) : c, {
      state: a,
      key: H()
    }));
  }

  function z(c) {
    t = c;
    c = h();
    v = c[0];
    q = c[1];
    d.call({
      action: t,
      location: q
    });
  }

  function A(c, a) {
    function e() {
      A(c, a);
    }

    var l = r.Push,
        g = x(c, a);

    if (!f.length || (f.call({
      action: l,
      location: g,
      retry: e
    }), !1)) {
      var n = [{
        usr: g.state,
        key: g.key,
        idx: v + 1
      }, k(g)];
      g = n[0];
      n = n[1];

      try {
        m.pushState(g, "", n);
      } catch (G) {
        p.location.assign(n);
      }

      z(l);
    }
  }

  function y(c, a) {
    function e() {
      y(c, a);
    }

    var l = r.Replace,
        g = x(c, a);
    f.length && (f.call({
      action: l,
      location: g,
      retry: e
    }), 1) || (g = [{
      usr: g.state,
      key: g.key,
      idx: v
    }, k(g)], m.replaceState(g[0], "", g[1]), z(l));
  }

  function w(c) {
    m.go(c);
  }

  void 0 === b && (b = {});
  b = b.window;
  var p = void 0 === b ? document.defaultView : b,
      m = p.history,
      u = null;
  p.addEventListener("popstate", function () {
    if (u) f.call(u), u = null;else {
      var c = r.Pop,
          a = h(),
          e = a[0];
      a = a[1];
      if (f.length) {
        if (null != e) {
          var l = v - e;
          l && (u = {
            action: c,
            location: a,
            retry: function retry() {
              w(-1 * l);
            }
          }, w(l));
        } else "production" !== process.env.NODE_ENV ? D(!1, "You are trying to block a POP navigation to a location that was not created by the history library. The block will fail silently in production, but in general you should do all navigation with the history library (instead of using window.history.pushState directly) to avoid this situation.") : void 0;
      } else z(c);
    }
  });
  var t = r.Pop;
  b = h();
  var v = b[0],
      q = b[1],
      d = F(),
      f = F();
  null == v && (v = 0, m.replaceState(_extends__default['default']({}, m.state, {
    idx: v
  }), ""));
  return {
    get action() {
      return t;
    },

    get location() {
      return q;
    },

    createHref: k,
    push: A,
    replace: y,
    go: w,
    back: function back() {
      w(-1);
    },
    forward: function forward() {
      w(1);
    },
    listen: function listen(c) {
      return d.push(c);
    },
    block: function block(c) {
      var a = f.push(c);
      1 === f.length && p.addEventListener("beforeunload", E);
      return function () {
        a();
        f.length || p.removeEventListener("beforeunload", E);
      };
    }
  };
}

function createHashHistory(b) {
  function h() {
    var a = J(m.location.hash.substr(1)),
        e = a.pathname,
        l = a.search;
    a = a.hash;
    var g = u.state || {};
    return [g.idx, C({
      pathname: void 0 === e ? "/" : e,
      search: void 0 === l ? "" : l,
      hash: void 0 === a ? "" : a,
      state: g.usr || null,
      key: g.key || "default"
    })];
  }

  function k() {
    if (t) c.call(t), t = null;else {
      var a = r.Pop,
          e = h(),
          l = e[0];
      e = e[1];
      if (c.length) {
        if (null != l) {
          var g = q - l;
          g && (t = {
            action: a,
            location: e,
            retry: function retry() {
              p(-1 * g);
            }
          }, p(g));
        } else "production" !== process.env.NODE_ENV ? D(!1, "You are trying to block a POP navigation to a location that was not created by the history library. The block will fail silently in production, but in general you should do all navigation with the history library (instead of using window.history.pushState directly) to avoid this situation.") : void 0;
      } else A(a);
    }
  }

  function x(a) {
    var e = document.querySelector("base"),
        l = "";
    e && e.getAttribute("href") && (e = m.location.href, l = e.indexOf("#"), l = -1 === l ? e : e.slice(0, l));
    return l + "#" + ("string" === typeof a ? a : I(a));
  }

  function z(a, e) {
    void 0 === e && (e = null);
    return C(_extends__default['default']({
      pathname: d.pathname,
      hash: "",
      search: ""
    }, "string" === typeof a ? J(a) : a, {
      state: e,
      key: H()
    }));
  }

  function A(a) {
    v = a;
    a = h();
    q = a[0];
    d = a[1];
    f.call({
      action: v,
      location: d
    });
  }

  function y(a, e) {
    function l() {
      y(a, e);
    }

    var g = r.Push,
        n = z(a, e);
    "production" !== process.env.NODE_ENV ? D("/" === n.pathname.charAt(0), "Relative pathnames are not supported in hash history.push(" + JSON.stringify(a) + ")") : void 0;

    if (!c.length || (c.call({
      action: g,
      location: n,
      retry: l
    }), !1)) {
      var G = [{
        usr: n.state,
        key: n.key,
        idx: q + 1
      }, x(n)];
      n = G[0];
      G = G[1];

      try {
        u.pushState(n, "", G);
      } catch (K) {
        m.location.assign(G);
      }

      A(g);
    }
  }

  function w(a, e) {
    function l() {
      w(a, e);
    }

    var g = r.Replace,
        n = z(a, e);
    "production" !== process.env.NODE_ENV ? D("/" === n.pathname.charAt(0), "Relative pathnames are not supported in hash history.replace(" + JSON.stringify(a) + ")") : void 0;
    c.length && (c.call({
      action: g,
      location: n,
      retry: l
    }), 1) || (n = [{
      usr: n.state,
      key: n.key,
      idx: q
    }, x(n)], u.replaceState(n[0], "", n[1]), A(g));
  }

  function p(a) {
    u.go(a);
  }

  void 0 === b && (b = {});
  b = b.window;
  var m = void 0 === b ? document.defaultView : b,
      u = m.history,
      t = null;
  m.addEventListener("popstate", k);
  m.addEventListener("hashchange", function () {
    var a = h()[1];
    I(a) !== I(d) && k();
  });
  var v = r.Pop;
  b = h();
  var q = b[0],
      d = b[1],
      f = F(),
      c = F();
  null == q && (q = 0, u.replaceState(_extends__default['default']({}, u.state, {
    idx: q
  }), ""));
  return {
    get action() {
      return v;
    },

    get location() {
      return d;
    },

    createHref: x,
    push: y,
    replace: w,
    go: p,
    back: function back() {
      p(-1);
    },
    forward: function forward() {
      p(1);
    },
    listen: function listen(a) {
      return f.push(a);
    },
    block: function block(a) {
      var e = c.push(a);
      1 === c.length && m.addEventListener("beforeunload", E);
      return function () {
        e();
        c.length || m.removeEventListener("beforeunload", E);
      };
    }
  };
}

exports.history = void 0;
var basename = '/';
function setHistoryMode(mode) {
  var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';
  var options = {
    window: window
  };
  basename = base;

  if (mode === 'browser') {
    exports.history = createBrowserHistory(options);
  } else {
    // default is hash
    exports.history = createHashHistory(options);
  }
}
function prependBasename() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return basename.replace(/\/$/, '') + '/' + url.replace(/^\//, '');
}
var hasBasename = function hasBasename() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  return new RegExp('^' + prefix + '(\\/|\\?|#|$)', 'i').test(path);
};
var stripBasename = function stripBasename() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
};

var Stacks = /*#__PURE__*/function () {
  function Stacks() {
    _classCallCheck__default['default'](this, Stacks);

    _defineProperty__default['default'](this, "stacks", []);

    _defineProperty__default['default'](this, "backDelta", 0);
  }

  _createClass__default['default'](Stacks, [{
    key: "delta",
    set: function set(delta) {
      if (delta > 0) {
        this.backDelta = delta;
      } else if (this.backDelta > 0) {
        --this.backDelta;
      } else {
        this.backDelta = 0;
      }
    }
  }, {
    key: "length",
    get: function get() {
      return this.stacks.length;
    }
  }, {
    key: "last",
    get: function get() {
      return this.stacks[this.length - 1];
    }
  }, {
    key: "get",
    value: function get() {
      return this.stacks;
    }
  }, {
    key: "getItem",
    value: function getItem(index) {
      return this.stacks[index];
    }
  }, {
    key: "getLastIndex",
    value: function getLastIndex(pathname) {
      var stateWith = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      var list = _toConsumableArray__default['default'](this.stacks).reverse();

      return list.findIndex(function (page, i) {
        var _page$path;

        return i >= stateWith && ((_page$path = page.path) === null || _page$path === void 0 ? void 0 : _page$path.replace(/\?.*/g, '')) === pathname;
      });
    }
  }, {
    key: "getDelta",
    value: function getDelta(pathname) {
      if (this.backDelta >= 1) {
        return this.backDelta;
      }

      var index = this.getLastIndex(pathname); // NOTE: ??????????????????????????????????????????????????????????????????????????????????????????????????????????????? ???????????????????????????????????? query ??????????????????????????????????????????

      return index > 0 ? index : 1;
    }
  }, {
    key: "getPrevIndex",
    value: function getPrevIndex(pathname) {
      var stateWith = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var lastIndex = this.getLastIndex(pathname, stateWith);

      if (lastIndex < 0) {
        return -1;
      }

      return this.length - 1 - lastIndex;
    }
  }, {
    key: "pop",
    value: function pop() {
      return this.stacks.pop();
    }
  }, {
    key: "push",
    value: function push(page) {
      return this.stacks.push(page);
    }
  }]);

  return Stacks;
}();

var stacks = new Stacks();

function addLeadingSlash(path) {
  if (path == null) {
    return '';
  }

  return path.charAt(0) === '/' ? path : '/' + path;
}

var RoutesAlias = /*#__PURE__*/function () {
  function RoutesAlias() {
    var _this = this;

    _classCallCheck__default['default'](this, RoutesAlias);

    _defineProperty__default['default'](this, "conf", []);

    _defineProperty__default['default'](this, "getConfig", function () {
      var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      var customRoute = _this.conf.filter(function (arr) {
        return arr.includes(url);
      });

      return customRoute[0];
    });

    _defineProperty__default['default'](this, "getOrigin", function () {
      var _this$getConfig;

      var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return ((_this$getConfig = _this.getConfig(url)) === null || _this$getConfig === void 0 ? void 0 : _this$getConfig[0]) || url;
    });

    _defineProperty__default['default'](this, "getAlias", function () {
      var _this$getConfig2;

      var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return ((_this$getConfig2 = _this.getConfig(url)) === null || _this$getConfig2 === void 0 ? void 0 : _this$getConfig2[1]) || url;
    });

    _defineProperty__default['default'](this, "getAll", function () {
      var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return _this.conf.filter(function (arr) {
        return arr.includes(url);
      }).reduceRight(function (p, a) {
        p.unshift(a[1]);
        return p;
      }, [url]);
    });
  }

  _createClass__default['default'](RoutesAlias, [{
    key: "set",
    value: function set() {
      var _this2 = this;

      var customRoutes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var _loop = function _loop(_key) {
        var path = customRoutes[_key];
        _key = addLeadingSlash(_key);

        if (typeof path === 'string') {
          _this2.conf.push([_key, addLeadingSlash(path)]);
        } else if ((path === null || path === void 0 ? void 0 : path.length) > 0) {
          var _this2$conf;

          (_this2$conf = _this2.conf).push.apply(_this2$conf, _toConsumableArray__default['default'](path.map(function (p) {
            return [_key, addLeadingSlash(p)];
          })));
        }

        key = _key;
      };

      for (var key in customRoutes) {
        _loop(key);
      }
    }
  }]);

  return RoutesAlias;
}();

var routesAlias = new RoutesAlias();

function processNavigateUrl(option) {
  var _pathPieces$pathname;

  var pathPieces = J(option.url); // ??????????????????

  if ((_pathPieces$pathname = pathPieces.pathname) !== null && _pathPieces$pathname !== void 0 && _pathPieces$pathname.includes('./')) {
    var parts = routesAlias.getOrigin(exports.history.location.pathname).split('/');
    parts.pop();
    pathPieces.pathname.split('/').forEach(function (item) {
      if (item === '.') {
        return;
      }

      item === '..' ? parts.pop() : parts.push(item);
    });
    pathPieces.pathname = parts.join('/');
  } // ?????????????????????


  pathPieces.pathname = routesAlias.getAlias(addLeadingSlash(pathPieces.pathname)); // ?????? basename

  pathPieces.pathname = prependBasename(pathPieces.pathname); // hack fix history v5 bug: https://github.com/remix-run/history/issues/814

  if (!pathPieces.search) pathPieces.search = '';
  return pathPieces;
}

function navigate(_x, _x2) {
  return _navigate.apply(this, arguments);
}

function _navigate() {
  _navigate = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee(option, method) {
    return _regeneratorRuntime__default['default'].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              var success = option.success,
                  complete = option.complete,
                  fail = option.fail;
              var unListen = exports.history.listen(function () {
                var res = {
                  errMsg: "".concat(method, ":ok")
                };
                success === null || success === void 0 ? void 0 : success(res);
                complete === null || complete === void 0 ? void 0 : complete(res);
                resolve(res);
                unListen();
              });

              try {
                if ('url' in option) {
                  var pathPieces = processNavigateUrl(option);
                  var state = {
                    timestamp: Date.now()
                  };

                  if (method === 'navigateTo') {
                    exports.history.push(pathPieces, state);
                  } else if (method === 'redirectTo' || method === 'switchTab') {
                    exports.history.replace(pathPieces, state);
                  } else if (method === 'reLaunch') {
                    stacks.delta = stacks.length;
                    exports.history.replace(pathPieces, state);
                  }
                } else if (method === 'navigateBack') {
                  stacks.delta = option.delta;
                  exports.history.go(-option.delta);
                }
              } catch (error) {
                var res = {
                  errMsg: "".concat(method, ":fail ").concat(error.message || error)
                };
                fail === null || fail === void 0 ? void 0 : fail(res);
                complete === null || complete === void 0 ? void 0 : complete(res);
                reject(res);
              }
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _navigate.apply(this, arguments);
}

function navigateTo(option) {
  return navigate(option, 'navigateTo');
}
function redirectTo(option) {
  return navigate(option, 'redirectTo');
}
function navigateBack() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    delta: 1
  };

  if (!options.delta || options.delta < 1) {
    options.delta = 1;
  }

  return navigate(options, 'navigateBack');
}
function switchTab(option) {
  return navigate(option, 'switchTab');
}
function reLaunch(option) {
  return navigate(option, 'reLaunch');
}
function getCurrentPages() {
  var pages = stacks.get();
  return pages.map(function (e) {
    return _objectSpread__default['default'](_objectSpread__default['default']({}, e), {}, {
      route: e.path || ''
    });
  });
}

var pathToRegexp$2 = {exports: {}};

pathToRegexp$2.exports = pathToRegexp;
pathToRegexp$2.exports.match = match;
pathToRegexp$2.exports.regexpToFunction = regexpToFunction;
pathToRegexp$2.exports.parse = parse;
pathToRegexp$2.exports.compile = compile;
pathToRegexp$2.exports.tokensToFunction = tokensToFunction;
pathToRegexp$2.exports.tokensToRegExp = tokensToRegExp;
/**
 * Default configs.
 */

var DEFAULT_DELIMITER = '/';
/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */

var PATH_REGEXP = new RegExp([// Match escaped characters that would otherwise appear in future matches.
// This allows the user to escape special characters that won't transform.
'(\\\\.)', // Match Express-style parameters and un-named parameters with a prefix
// and optional suffixes. Matches appear as:
//
// ":test(\\d+)?" => ["test", "\d+", undefined, "?"]
// "(\\d+)"  => [undefined, undefined, "\d+", undefined]
'(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?'].join('|'), 'g');
/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */

function parse(str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || DEFAULT_DELIMITER;
  var whitelist = options && options.whitelist || undefined;
  var pathEscaped = false;
  var res;

  while ((res = PATH_REGEXP.exec(str)) !== null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length; // Ignore already escaped sequences.

    if (escaped) {
      path += escaped[1];
      pathEscaped = true;
      continue;
    }

    var prev = '';
    var name = res[2];
    var capture = res[3];
    var group = res[4];
    var modifier = res[5];

    if (!pathEscaped && path.length) {
      var k = path.length - 1;
      var c = path[k];
      var matches = whitelist ? whitelist.indexOf(c) > -1 : true;

      if (matches) {
        prev = c;
        path = path.slice(0, k);
      }
    } // Push the current path onto the tokens.


    if (path) {
      tokens.push(path);
      path = '';
      pathEscaped = false;
    }

    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var pattern = capture || group;
    var delimiter = prev || defaultDelimiter;
    tokens.push({
      name: name || key++,
      prefix: prev,
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      pattern: pattern ? escapeGroup(pattern) : '[^' + escapeString(delimiter === defaultDelimiter ? delimiter : delimiter + defaultDelimiter) + ']+?'
    });
  } // Push any remaining characters.


  if (path || index < str.length) {
    tokens.push(path + str.substr(index));
  }

  return tokens;
}
/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */


function compile(str, options) {
  return tokensToFunction(parse(str, options), options);
}
/**
 * Create path match function from `path-to-regexp` spec.
 */


function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys);
}
/**
 * Create a path match function from `path-to-regexp` output.
 */


function regexpToFunction(re, keys) {
  return function (pathname, options) {
    var m = re.exec(pathname);
    if (!m) return false;
    var path = m[0];
    var index = m.index;
    var params = {};
    var decode = options && options.decode || decodeURIComponent;

    for (var i = 1; i < m.length; i++) {
      if (m[i] === undefined) continue;
      var key = keys[i - 1];

      if (key.repeat) {
        params[key.name] = m[i].split(key.delimiter).map(function (value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i], key);
      }
    }

    return {
      path: path,
      index: index,
      params: params
    };
  };
}
/**
 * Expose a method for transforming tokens into the path function.
 */


function tokensToFunction(tokens, options) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length); // Compile all the patterns before compilation.

  for (var i = 0; i < tokens.length; i++) {
    if (_typeof__default['default'](tokens[i]) === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$', flags(options));
    }
  }

  return function (data, options) {
    var path = '';
    var encode = options && options.encode || encodeURIComponent;
    var validate = options ? options.validate !== false : true;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;
        continue;
      }

      var value = data ? data[token.name] : undefined;
      var segment;

      if (Array.isArray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but got array');
        }

        if (value.length === 0) {
          if (token.optional) continue;
          throw new TypeError('Expected "' + token.name + '" to not be empty');
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j], token);

          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '"');
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue;
      }

      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        segment = encode(String(value), token);

        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but got "' + segment + '"');
        }

        path += token.prefix + segment;
        continue;
      }

      if (token.optional) continue;
      throw new TypeError('Expected "' + token.name + '" to be ' + (token.repeat ? 'an array' : 'a string'));
    }

    return path;
  };
}
/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */


function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
}
/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */


function escapeGroup(group) {
  return group.replace(/([=!:$/()])/g, '\\$1');
}
/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */


function flags(options) {
  return options && options.sensitive ? '' : 'i';
}
/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {Array=}  keys
 * @return {!RegExp}
 */


function regexpToRegexp(path, keys) {
  if (!keys) return path; // Use a negative lookahead to match only capturing groups.

  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        pattern: null
      });
    }
  }

  return path;
}
/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */


function arrayToRegexp(path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  return new RegExp('(?:' + parts.join('|') + ')', flags(options));
}
/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */


function stringToRegexp(path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options);
}
/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}  tokens
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */


function tokensToRegExp(tokens, keys, options) {
  options = options || {};
  var strict = options.strict;
  var start = options.start !== false;
  var end = options.end !== false;
  var delimiter = options.delimiter || DEFAULT_DELIMITER;
  var endsWith = [].concat(options.endsWith || []).map(escapeString).concat('$').join('|');
  var route = start ? '^' : ''; // Iterate over the tokens and create our regexp string.

  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var capture = token.repeat ? '(?:' + token.pattern + ')(?:' + escapeString(token.delimiter) + '(?:' + token.pattern + '))*' : token.pattern;
      if (keys) keys.push(token);

      if (token.optional) {
        if (!token.prefix) {
          route += '(' + capture + ')?';
        } else {
          route += '(?:' + escapeString(token.prefix) + '(' + capture + '))?';
        }
      } else {
        route += escapeString(token.prefix) + '(' + capture + ')';
      }
    }
  }

  if (end) {
    if (!strict) route += '(?:' + escapeString(delimiter) + ')?';
    route += endsWith === '$' ? '$' : '(?=' + endsWith + ')';
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === 'string' ? endToken[endToken.length - 1] === delimiter : endToken === undefined;
    if (!strict) route += '(?:' + escapeString(delimiter) + '(?=' + endsWith + '))?';
    if (!isEndDelimited) route += '(?=' + escapeString(delimiter) + '|' + endsWith + ')';
  }

  return new RegExp(route, flags(options));
}
/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {Array=}                keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */


function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp) {
    return regexpToRegexp(path, keys);
  }

  if (Array.isArray(path)) {
    return arrayToRegexp(path, keys, options);
  }

  return stringToRegexp(path, keys, options);
}

var pathToRegexp$1 = pathToRegexp$2.exports;

var hasOwnProperty = Object.prototype.hasOwnProperty;
var cache = new Map();

function decodeParam(val) {
  try {
    return decodeURIComponent(val);
  } catch (err) {
    return val;
  }
}

function matchPath(route, pathname, parentKeys, parentParams) {
  var end = !route.children;
  var cacheKey = (route.path || '') + "|" + end;
  var regexp = cache.get(cacheKey);

  if (!regexp) {
    var keys = [];
    regexp = {
      keys: keys,
      pattern: pathToRegexp$1(route.path || '', keys, {
        end: end
      })
    };
    cache.set(cacheKey, regexp);
  }

  var m = regexp.pattern.exec(pathname);

  if (!m) {
    return null;
  }

  var path = m[0];
  var params = Object.assign({}, parentParams);

  for (var i = 1; i < m.length; i++) {
    var key = regexp.keys[i - 1];
    var prop = key.name;
    var value = m[i];

    if (value !== undefined || !hasOwnProperty.call(params, prop)) {
      if (key.repeat) {
        params[prop] = value ? value.split(key.delimiter).map(decodeParam) : [];
      } else {
        params[prop] = value ? decodeParam(value) : value;
      }
    }
  }

  return {
    path: !end && path.charAt(path.length - 1) === '/' ? path.substr(1) : path,
    keys: parentKeys.concat(regexp.keys),
    params: params
  };
}

function matchRoute(route, baseUrl, pathname, parentKeys, parentParams) {
  var match;
  var childMatches;
  var childIndex = 0;
  return {
    next: function next(routeToSkip) {
      if (route === routeToSkip) {
        return {
          done: true
        };
      }

      if (!match) {
        match = matchPath(route, pathname, parentKeys, parentParams);

        if (match) {
          return {
            done: false,
            value: {
              route: route,
              baseUrl: baseUrl,
              path: match.path,
              keys: match.keys,
              params: match.params
            }
          };
        }
      }

      if (match && route.children) {
        while (childIndex < route.children.length) {
          if (!childMatches) {
            var childRoute = route.children[childIndex];
            childRoute.parent = route;
            childMatches = matchRoute(childRoute, baseUrl + match.path, pathname.substr(match.path.length), match.keys, match.params);
          }

          var childMatch = childMatches.next(routeToSkip);

          if (!childMatch.done) {
            return {
              done: false,
              value: childMatch.value
            };
          }

          childMatches = null;
          childIndex++;
        }
      }

      return {
        done: true
      };
    }
  };
}

function resolveRoute(context, params) {
  if (typeof context.route.action === 'function') {
    return context.route.action(context, params);
  }

  return undefined;
}

function isChildRoute(parentRoute, childRoute) {
  var route = childRoute;

  while (route) {
    route = route.parent;

    if (route === parentRoute) {
      return true;
    }
  }

  return false;
}

var UniversalRouter = function () {
  function UniversalRouter(routes, options) {
    if (options === void 0) {
      options = {};
    }

    if (!routes || _typeof__default['default'](routes) !== 'object') {
      throw new TypeError('Invalid routes');
    }

    this.baseUrl = options.baseUrl || '';
    this.errorHandler = options.errorHandler;
    this.resolveRoute = options.resolveRoute || resolveRoute;
    this.context = Object.assign({
      router: this
    }, options.context);
    this.root = Array.isArray(routes) ? {
      path: '',
      children: routes,
      parent: null
    } : routes;
    this.root.parent = null;
  }

  var _proto = UniversalRouter.prototype;

  _proto.resolve = function resolve(pathnameOrContext) {
    var _this = this;

    var context = Object.assign({}, this.context, {}, typeof pathnameOrContext === 'string' ? {
      pathname: pathnameOrContext
    } : pathnameOrContext);
    var match = matchRoute(this.root, this.baseUrl, context.pathname.substr(this.baseUrl.length), [], null);
    var resolve = this.resolveRoute;
    var matches = null;
    var nextMatches = null;
    var currentContext = context;

    function next(resume, parent, prevResult) {
      if (parent === void 0) {
        parent = matches.value.route;
      }

      var routeToSkip = prevResult === null && !matches.done && matches.value.route;
      matches = nextMatches || match.next(routeToSkip);
      nextMatches = null;

      if (!resume) {
        if (matches.done || !isChildRoute(parent, matches.value.route)) {
          nextMatches = matches;
          return Promise.resolve(null);
        }
      }

      if (matches.done) {
        var error = new Error('Route not found');
        error.status = 404;
        return Promise.reject(error);
      }

      currentContext = Object.assign({}, context, {}, matches.value);
      return Promise.resolve(resolve(currentContext, matches.value.params)).then(function (result) {
        if (result !== null && result !== undefined) {
          return result;
        }

        return next(resume, parent, result);
      });
    }

    context.next = next;
    return Promise.resolve().then(function () {
      return next(true, _this.root);
    })["catch"](function (error) {
      if (_this.errorHandler) {
        return _this.errorHandler(error, currentContext);
      }

      throw error;
    });
  };

  return UniversalRouter;
}();

UniversalRouter.pathToRegexp = pathToRegexp$1;

var queryString = {};

var strictUriEncode = function strictUriEncode(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (x) {
    return "%".concat(x.charCodeAt(0).toString(16).toUpperCase());
  });
};

var token = '%[a-f0-9]{2}';
var singleMatcher = new RegExp(token, 'gi');
var multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
  try {
    // Try to decode the entire string first
    return decodeURIComponent(components.join(''));
  } catch (err) {// Do nothing
  }

  if (components.length === 1) {
    return components;
  }

  split = split || 1; // Split the array in 2 parts

  var left = components.slice(0, split);
  var right = components.slice(split);
  return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
  try {
    return decodeURIComponent(input);
  } catch (err) {
    var tokens = input.match(singleMatcher);

    for (var i = 1; i < tokens.length; i++) {
      input = decodeComponents(tokens, i).join('');
      tokens = input.match(singleMatcher);
    }

    return input;
  }
}

function customDecodeURIComponent(input) {
  // Keep track of all the replacements and prefill the map with the `BOM`
  var replaceMap = {
    '%FE%FF': "\uFFFD\uFFFD",
    '%FF%FE': "\uFFFD\uFFFD"
  };
  var match = multiMatcher.exec(input);

  while (match) {
    try {
      // Decode as big chunks as possible
      replaceMap[match[0]] = decodeURIComponent(match[0]);
    } catch (err) {
      var result = decode(match[0]);

      if (result !== match[0]) {
        replaceMap[match[0]] = result;
      }
    }

    match = multiMatcher.exec(input);
  } // Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else


  replaceMap['%C2'] = "\uFFFD";
  var entries = Object.keys(replaceMap);

  for (var i = 0; i < entries.length; i++) {
    // Replace all decoded components
    var key = entries[i];
    input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
  }

  return input;
}

var decodeUriComponent = function decodeUriComponent(encodedURI) {
  if (typeof encodedURI !== 'string') {
    throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + _typeof__default['default'](encodedURI) + '`');
  }

  try {
    encodedURI = encodedURI.replace(/\+/g, ' '); // Try the built in decoder first

    return decodeURIComponent(encodedURI);
  } catch (err) {
    // Fallback to a more advanced decoder
    return customDecodeURIComponent(encodedURI);
  }
};

var splitOnFirst = function splitOnFirst(string, separator) {
  if (!(typeof string === 'string' && typeof separator === 'string')) {
    throw new TypeError('Expected the arguments to be of type `string`');
  }

  if (separator === '') {
    return [string];
  }

  var separatorIndex = string.indexOf(separator);

  if (separatorIndex === -1) {
    return [string];
  }

  return [string.slice(0, separatorIndex), string.slice(separatorIndex + separator.length)];
};

var filterObj = function filterObj(obj, predicate) {
  var ret = {};
  var keys = Object.keys(obj);
  var isArr = Array.isArray(predicate);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var val = obj[key];

    if (isArr ? predicate.indexOf(key) !== -1 : predicate(key, val, obj)) {
      ret[key] = val;
    }
  }

  return ret;
};

(function (exports) {

  var strictUriEncode$1 = strictUriEncode;
  var decodeComponent = decodeUriComponent;
  var splitOnFirst$1 = splitOnFirst;
  var filterObject = filterObj;

  var isNullOrUndefined = function isNullOrUndefined(value) {
    return value === null || value === undefined;
  };

  function encoderForArrayFormat(options) {
    switch (options.arrayFormat) {
      case 'index':
        return function (key) {
          return function (result, value) {
            var index = result.length;

            if (value === undefined || options.skipNull && value === null || options.skipEmptyString && value === '') {
              return result;
            }

            if (value === null) {
              return [].concat(_toConsumableArray__default['default'](result), [[encode(key, options), '[', index, ']'].join('')]);
            }

            return [].concat(_toConsumableArray__default['default'](result), [[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')]);
          };
        };

      case 'bracket':
        return function (key) {
          return function (result, value) {
            if (value === undefined || options.skipNull && value === null || options.skipEmptyString && value === '') {
              return result;
            }

            if (value === null) {
              return [].concat(_toConsumableArray__default['default'](result), [[encode(key, options), '[]'].join('')]);
            }

            return [].concat(_toConsumableArray__default['default'](result), [[encode(key, options), '[]=', encode(value, options)].join('')]);
          };
        };

      case 'comma':
      case 'separator':
        return function (key) {
          return function (result, value) {
            if (value === null || value === undefined || value.length === 0) {
              return result;
            }

            if (result.length === 0) {
              return [[encode(key, options), '=', encode(value, options)].join('')];
            }

            return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
          };
        };

      default:
        return function (key) {
          return function (result, value) {
            if (value === undefined || options.skipNull && value === null || options.skipEmptyString && value === '') {
              return result;
            }

            if (value === null) {
              return [].concat(_toConsumableArray__default['default'](result), [encode(key, options)]);
            }

            return [].concat(_toConsumableArray__default['default'](result), [[encode(key, options), '=', encode(value, options)].join('')]);
          };
        };
    }
  }

  function parserForArrayFormat(options) {
    var result;

    switch (options.arrayFormat) {
      case 'index':
        return function (key, value, accumulator) {
          result = /\[(\d*)\]$/.exec(key);
          key = key.replace(/\[\d*\]$/, '');

          if (!result) {
            accumulator[key] = value;
            return;
          }

          if (accumulator[key] === undefined) {
            accumulator[key] = {};
          }

          accumulator[key][result[1]] = value;
        };

      case 'bracket':
        return function (key, value, accumulator) {
          result = /(\[\])$/.exec(key);
          key = key.replace(/\[\]$/, '');

          if (!result) {
            accumulator[key] = value;
            return;
          }

          if (accumulator[key] === undefined) {
            accumulator[key] = [value];
            return;
          }

          accumulator[key] = [].concat(accumulator[key], value);
        };

      case 'comma':
      case 'separator':
        return function (key, value, accumulator) {
          var isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);
          var isEncodedArray = typeof value === 'string' && !isArray && decode(value, options).includes(options.arrayFormatSeparator);
          value = isEncodedArray ? decode(value, options) : value;
          var newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map(function (item) {
            return decode(item, options);
          }) : value === null ? value : decode(value, options);
          accumulator[key] = newValue;
        };

      default:
        return function (key, value, accumulator) {
          if (accumulator[key] === undefined) {
            accumulator[key] = value;
            return;
          }

          accumulator[key] = [].concat(accumulator[key], value);
        };
    }
  }

  function validateArrayFormatSeparator(value) {
    if (typeof value !== 'string' || value.length !== 1) {
      throw new TypeError('arrayFormatSeparator must be single character string');
    }
  }

  function encode(value, options) {
    if (options.encode) {
      return options.strict ? strictUriEncode$1(value) : encodeURIComponent(value);
    }

    return value;
  }

  function decode(value, options) {
    if (options.decode) {
      return decodeComponent(value);
    }

    return value;
  }

  function keysSorter(input) {
    if (Array.isArray(input)) {
      return input.sort();
    }

    if (_typeof__default['default'](input) === 'object') {
      return keysSorter(Object.keys(input)).sort(function (a, b) {
        return Number(a) - Number(b);
      }).map(function (key) {
        return input[key];
      });
    }

    return input;
  }

  function removeHash(input) {
    var hashStart = input.indexOf('#');

    if (hashStart !== -1) {
      input = input.slice(0, hashStart);
    }

    return input;
  }

  function getHash(url) {
    var hash = '';
    var hashStart = url.indexOf('#');

    if (hashStart !== -1) {
      hash = url.slice(hashStart);
    }

    return hash;
  }

  function extract(input) {
    input = removeHash(input);
    var queryStart = input.indexOf('?');

    if (queryStart === -1) {
      return '';
    }

    return input.slice(queryStart + 1);
  }

  function parseValue(value, options) {
    if (options.parseNumbers && !Number.isNaN(Number(value)) && typeof value === 'string' && value.trim() !== '') {
      value = Number(value);
    } else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
      value = value.toLowerCase() === 'true';
    }

    return value;
  }

  function parse(query, options) {
    options = Object.assign({
      decode: true,
      sort: true,
      arrayFormat: 'none',
      arrayFormatSeparator: ',',
      parseNumbers: false,
      parseBooleans: false
    }, options);
    validateArrayFormatSeparator(options.arrayFormatSeparator);
    var formatter = parserForArrayFormat(options); // Create an object with no prototype

    var ret = Object.create(null);

    if (typeof query !== 'string') {
      return ret;
    }

    query = query.trim().replace(/^[?#&]/, '');

    if (!query) {
      return ret;
    }

    var _iterator = _createForOfIteratorHelper__default['default'](query.split('&')),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var param = _step.value;

        if (param === '') {
          continue;
        }

        var _splitOnFirst = splitOnFirst$1(options.decode ? param.replace(/\+/g, ' ') : param, '='),
            _splitOnFirst2 = _slicedToArray__default['default'](_splitOnFirst, 2),
            _key = _splitOnFirst2[0],
            _value = _splitOnFirst2[1]; // Missing `=` should be `null`:
        // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters


        _value = _value === undefined ? null : ['comma', 'separator'].includes(options.arrayFormat) ? _value : decode(_value, options);
        formatter(decode(_key, options), _value, ret);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    for (var _i = 0, _Object$keys = Object.keys(ret); _i < _Object$keys.length; _i++) {
      var key = _Object$keys[_i];
      var value = ret[key];

      if (_typeof__default['default'](value) === 'object' && value !== null) {
        for (var _i2 = 0, _Object$keys2 = Object.keys(value); _i2 < _Object$keys2.length; _i2++) {
          var k = _Object$keys2[_i2];
          value[k] = parseValue(value[k], options);
        }
      } else {
        ret[key] = parseValue(value, options);
      }
    }

    if (options.sort === false) {
      return ret;
    }

    return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce(function (result, key) {
      var value = ret[key];

      if (Boolean(value) && _typeof__default['default'](value) === 'object' && !Array.isArray(value)) {
        // Sort object keys, not values
        result[key] = keysSorter(value);
      } else {
        result[key] = value;
      }

      return result;
    }, Object.create(null));
  }

  exports.extract = extract;
  exports.parse = parse;

  exports.stringify = function (object, options) {
    if (!object) {
      return '';
    }

    options = Object.assign({
      encode: true,
      strict: true,
      arrayFormat: 'none',
      arrayFormatSeparator: ','
    }, options);
    validateArrayFormatSeparator(options.arrayFormatSeparator);

    var shouldFilter = function shouldFilter(key) {
      return options.skipNull && isNullOrUndefined(object[key]) || options.skipEmptyString && object[key] === '';
    };

    var formatter = encoderForArrayFormat(options);
    var objectCopy = {};

    for (var _i3 = 0, _Object$keys3 = Object.keys(object); _i3 < _Object$keys3.length; _i3++) {
      var key = _Object$keys3[_i3];

      if (!shouldFilter(key)) {
        objectCopy[key] = object[key];
      }
    }

    var keys = Object.keys(objectCopy);

    if (options.sort !== false) {
      keys.sort(options.sort);
    }

    return keys.map(function (key) {
      var value = object[key];

      if (value === undefined) {
        return '';
      }

      if (value === null) {
        return encode(key, options);
      }

      if (Array.isArray(value)) {
        return value.reduce(formatter(key), []).join('&');
      }

      return encode(key, options) + '=' + encode(value, options);
    }).filter(function (x) {
      return x.length > 0;
    }).join('&');
  };

  exports.parseUrl = function (url, options) {
    options = Object.assign({
      decode: true
    }, options);

    var _splitOnFirst3 = splitOnFirst$1(url, '#'),
        _splitOnFirst4 = _slicedToArray__default['default'](_splitOnFirst3, 2),
        url_ = _splitOnFirst4[0],
        hash = _splitOnFirst4[1];

    return Object.assign({
      url: url_.split('?')[0] || '',
      query: parse(extract(url), options)
    }, options && options.parseFragmentIdentifier && hash ? {
      fragmentIdentifier: decode(hash, options)
    } : {});
  };

  exports.stringifyUrl = function (object, options) {
    options = Object.assign({
      encode: true,
      strict: true
    }, options);
    var url = removeHash(object.url).split('?')[0] || '';
    var queryFromUrl = exports.extract(object.url);
    var parsedQueryFromUrl = exports.parse(queryFromUrl, {
      sort: false
    });
    var query = Object.assign(parsedQueryFromUrl, object.query);
    var queryString = exports.stringify(query, options);

    if (queryString) {
      queryString = "?".concat(queryString);
    }

    var hash = getHash(object.url);

    if (object.fragmentIdentifier) {
      hash = "#".concat(encode(object.fragmentIdentifier, options));
    }

    return "".concat(url).concat(queryString).concat(hash);
  };

  exports.pick = function (input, filter, options) {
    options = Object.assign({
      parseFragmentIdentifier: true
    }, options);

    var _exports$parseUrl = exports.parseUrl(input, options),
        url = _exports$parseUrl.url,
        query = _exports$parseUrl.query,
        fragmentIdentifier = _exports$parseUrl.fragmentIdentifier;

    return exports.stringifyUrl({
      url: url,
      query: filterObject(query, filter),
      fragmentIdentifier: fragmentIdentifier
    }, options);
  };

  exports.exclude = function (input, filter, options) {
    var exclusionFilter = Array.isArray(filter) ? function (key) {
      return !filter.includes(key);
    } : function (key, value) {
      return !filter(key, value);
    };
    return exports.pick(input, exclusionFilter, options);
  };
})(queryString);

/**
 * ?????????????????????????????????
 */
function loadAnimateStyle() {
  var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 300;
  var css = "\n.taro_router .taro_page {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: #fff;\n  transform: translate(100%, 0);\n  transition: transform ".concat(ms, "ms;\n  z-index: 0;\n}\n\n.taro_router .taro_page.taro_tabbar_page,\n.taro_router .taro_page.taro_page_show.taro_page_stationed {\n  transform: none;\n}\n\n.taro_router .taro_page.taro_page_show {\n  transform: translate(0, 0);\n}");
  var style = document.createElement('style');
  style.innerHTML = css;
  document.getElementsByTagName('head')[0].appendChild(style);
}

// @ts-nocheck
function initTabbar(config) {
  if (config.tabBar == null) {
    return;
  } // TODO: custom-tab-bar


  var tabbar = document.createElement('taro-tabbar');
  var homePage = config.entryPagePath || (config.pages ? config.pages[0] : '');
  tabbar.conf = config.tabBar;
  tabbar.conf.homePage = exports.history.location.pathname === '/' ? homePage : exports.history.location.pathname;
  var routerConfig = config.router;
  tabbar.conf.mode = routerConfig && routerConfig.mode ? routerConfig.mode : 'hash';

  if (routerConfig.customRoutes) {
    tabbar.conf.custom = true;
    tabbar.conf.customRoutes = routerConfig.customRoutes;
  } else {
    tabbar.conf.custom = false;
    tabbar.conf.customRoutes = {};
  }

  if (typeof routerConfig.basename !== 'undefined') {
    tabbar.conf.basename = routerConfig.basename;
  }

  var container = document.getElementById('container');
  container === null || container === void 0 ? void 0 : container.appendChild(tabbar);
  taro.initTabBarApis(config);
}

var pageResizeFn;
function bindPageResize(page) {
  window.removeEventListener('resize', pageResizeFn);

  pageResizeFn = function pageResizeFn() {
    page.onResize && page.onResize({
      size: {
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth
      }
    });
  };

  window.addEventListener('resize', pageResizeFn, false);
}

var pageScrollFn;
var pageDOM = window;
function bindPageScroll(page, pageEl) {
  var distance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 50;
  pageEl.removeEventListener('scroll', pageScrollFn);
  pageDOM = pageEl;
  var isReachBottom = false;

  pageScrollFn = function pageScrollFn() {
    page.onPageScroll && page.onPageScroll({
      scrollTop: pageDOM instanceof Window ? window.scrollY : pageDOM.scrollTop
    });

    if (isReachBottom && getOffset() > distance) {
      isReachBottom = false;
    }

    if (page.onReachBottom && !isReachBottom && getOffset() < distance) {
      isReachBottom = true;
      page.onReachBottom();
    }
  };

  pageDOM.addEventListener('scroll', pageScrollFn, false);
}

function getOffset() {
  if (pageDOM instanceof Window) {
    return document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
  } else {
    return pageDOM.scrollHeight - pageDOM.scrollTop - pageDOM.clientHeight;
  }
}

function setDisplay(el) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (el) {
    el.style.display = type;
  }
}

var PageHandler = /*#__PURE__*/function () {
  function PageHandler(config) {
    _classCallCheck__default['default'](this, PageHandler);

    _defineProperty__default['default'](this, "config", void 0);

    _defineProperty__default['default'](this, "defaultAnimation", {
      duration: 300,
      delay: 50
    });

    _defineProperty__default['default'](this, "unloadTimer", void 0);

    _defineProperty__default['default'](this, "hideTimer", void 0);

    _defineProperty__default['default'](this, "lastHidePage", void 0);

    _defineProperty__default['default'](this, "lastUnloadPage", void 0);

    this.config = config;
    this.mount();
  }

  _createClass__default['default'](PageHandler, [{
    key: "appId",
    get: function get() {
      return 'app';
    }
  }, {
    key: "router",
    get: function get() {
      return this.config.router;
    }
  }, {
    key: "routerMode",
    get: function get() {
      return this.router.mode || 'hash';
    }
  }, {
    key: "customRoutes",
    get: function get() {
      return this.router.customRoutes || {};
    }
  }, {
    key: "routes",
    get: function get() {
      return this.config.routes;
    }
  }, {
    key: "tabBarList",
    get: function get() {
      var _this$config$tabBar;

      return ((_this$config$tabBar = this.config.tabBar) === null || _this$config$tabBar === void 0 ? void 0 : _this$config$tabBar.list) || [];
    }
  }, {
    key: "PullDownRefresh",
    get: function get() {
      return this.config.PullDownRefresh;
    }
  }, {
    key: "animation",
    get: function get() {
      var _this$config$animatio, _this$config;

      return (_this$config$animatio = (_this$config = this.config) === null || _this$config === void 0 ? void 0 : _this$config.animation) !== null && _this$config$animatio !== void 0 ? _this$config$animatio : this.defaultAnimation;
    }
  }, {
    key: "animationDelay",
    get: function get() {
      var _this$defaultAnimatio;

      return (_typeof__default['default'](this.animation) === 'object' ? this.animation.delay : this.animation ? (_this$defaultAnimatio = this.defaultAnimation) === null || _this$defaultAnimatio === void 0 ? void 0 : _this$defaultAnimatio.delay : 0) || 0;
    }
  }, {
    key: "animationDuration",
    get: function get() {
      var _this$defaultAnimatio2;

      return (_typeof__default['default'](this.animation) === 'object' ? this.animation.duration : this.animation ? (_this$defaultAnimatio2 = this.defaultAnimation) === null || _this$defaultAnimatio2 === void 0 ? void 0 : _this$defaultAnimatio2.duration : 0) || 0;
    }
  }, {
    key: "pathname",
    get: function get() {
      return this.router.pathname;
    },
    set: function set(p) {
      this.router.pathname = p;
    }
  }, {
    key: "basename",
    get: function get() {
      return this.router.basename || '';
    }
  }, {
    key: "pageConfig",
    get: function get() {
      var _this = this;

      return this.routes.find(function (r) {
        var _routesAlias$getConfi;

        var routePath = stripBasename(_this.pathname, _this.basename);
        var pagePath = addLeadingSlash(r.path);
        return pagePath === routePath || ((_routesAlias$getConfi = routesAlias.getConfig(pagePath)) === null || _routesAlias$getConfi === void 0 ? void 0 : _routesAlias$getConfi.includes(routePath));
      });
    }
  }, {
    key: "isTabBar",
    get: function get() {
      var _Object$entries$find;

      var routePath = stripBasename(this.pathname, this.basename);
      var pagePath = ((_Object$entries$find = Object.entries(this.customRoutes).find(function (_ref) {
        var _ref2 = _slicedToArray__default['default'](_ref, 2),
            target = _ref2[1];

        if (typeof target === 'string') {
          return target === routePath;
        } else if ((target === null || target === void 0 ? void 0 : target.length) > 0) {
          return target.includes(routePath);
        }

        return false;
      })) === null || _Object$entries$find === void 0 ? void 0 : _Object$entries$find[0]) || routePath;
      return !!pagePath && this.tabBarList.some(function (t) {
        return t.pagePath === pagePath;
      });
    }
  }, {
    key: "isSamePage",
    value: function isSamePage(page) {
      var routePath = stripBasename(this.pathname, this.basename);
      var pagePath = stripBasename(page === null || page === void 0 ? void 0 : page.path, this.basename);
      return pagePath.startsWith(routePath + '?');
    }
  }, {
    key: "search",
    get: function get() {
      var search = '?';

      if (this.routerMode === 'hash') {
        var idx = location.hash.indexOf('?');

        if (idx > -1) {
          search = location.hash.slice(idx);
        }
      } else {
        search = location.search;
      }

      return search.substr(1);
    }
  }, {
    key: "getQuery",
    value: function getQuery() {
      var stamp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var search = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      search = search ? "".concat(search, "&").concat(this.search) : this.search;
      var query = search ? queryString.parse(search, {
        decode: false
      }) : {};
      query.stamp = stamp.toString();
      return _objectSpread__default['default'](_objectSpread__default['default']({}, query), options);
    }
  }, {
    key: "mount",
    value: function mount() {
      var _document$getElementB;

      setHistoryMode(this.routerMode, this.router.basename);
      (_document$getElementB = document.getElementById('app')) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.remove();
      this.animation && loadAnimateStyle(this.animationDuration);
      var app = document.createElement('div');
      app.id = this.appId;
      app.classList.add('taro_router');

      if (this.tabBarList.length > 1) {
        var container = document.createElement('div');
        container.classList.add('taro-tabbar__container');
        container.id = 'container';
        var panel = document.createElement('div');
        panel.classList.add('taro-tabbar__panel');
        panel.appendChild(app);
        container.appendChild(panel);
        document.body.appendChild(container);
        initTabbar(this.config);
      } else {
        document.body.appendChild(app);
      }
    }
  }, {
    key: "onReady",
    value: function onReady(page) {
      var onLoad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var pageEl = this.getPageContainer(page);

      if (pageEl && !(pageEl !== null && pageEl !== void 0 && pageEl['__isReady'])) {
        var _el$componentOnReady, _el$componentOnReady$;

        var el = pageEl.firstElementChild;
        el === null || el === void 0 ? void 0 : (_el$componentOnReady = el['componentOnReady']) === null || _el$componentOnReady === void 0 ? void 0 : (_el$componentOnReady$ = _el$componentOnReady.call(el)) === null || _el$componentOnReady$ === void 0 ? void 0 : _el$componentOnReady$.then(function () {
          runtime.requestAnimationFrame(function () {
            var _page$onReady;

            (_page$onReady = page.onReady) === null || _page$onReady === void 0 ? void 0 : _page$onReady.call(page);
            pageEl['__isReady'] = true;
          });
        });
        onLoad && (pageEl['__page'] = page);
      }
    }
  }, {
    key: "load",
    value: function load(page) {
      var _this2 = this;

      var pageConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var stacksIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      if (!page) return; // NOTE: ????????????????????????????????? getCurrentPages ?????????????????????????????????

      stacks.push(page);
      var param = this.getQuery(stacks.length, '', page.options);
      var pageEl = this.getPageContainer(page);

      if (pageEl) {
        var _page$onShow;

        setDisplay(pageEl);
        this.isTabBar && pageEl.classList.add('taro_tabbar_page');
        this.addAnimation(pageEl, stacksIndex === 0);
        (_page$onShow = page.onShow) === null || _page$onShow === void 0 ? void 0 : _page$onShow.call(page);
        this.bindPageEvents(page, pageEl, pageConfig);
      } else {
        var _page$onLoad;

        (_page$onLoad = page.onLoad) === null || _page$onLoad === void 0 ? void 0 : _page$onLoad.call(page, param, function () {
          var _pageEl, _page$onShow2;

          pageEl = _this2.getPageContainer(page);
          _this2.isTabBar && ((_pageEl = pageEl) === null || _pageEl === void 0 ? void 0 : _pageEl.classList.add('taro_tabbar_page'));

          _this2.addAnimation(pageEl, stacksIndex === 0);

          _this2.onReady(page, true);

          (_page$onShow2 = page.onShow) === null || _page$onShow2 === void 0 ? void 0 : _page$onShow2.call(page);

          _this2.bindPageEvents(page, pageEl, pageConfig);
        });
      }
    }
  }, {
    key: "unload",
    value: function unload(page) {
      var _this3 = this;

      var delta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var top = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      if (!page) return;
      stacks.delta = --delta;
      stacks.pop();

      if (this.animation && top) {
        if (this.unloadTimer) {
          var _this$lastUnloadPage, _this$lastUnloadPage$;

          clearTimeout(this.unloadTimer);
          (_this$lastUnloadPage = this.lastUnloadPage) === null || _this$lastUnloadPage === void 0 ? void 0 : (_this$lastUnloadPage$ = _this$lastUnloadPage.onUnload) === null || _this$lastUnloadPage$ === void 0 ? void 0 : _this$lastUnloadPage$.call(_this$lastUnloadPage);
          this.unloadTimer = null;
        }

        this.lastUnloadPage = page;
        var pageEl = this.getPageContainer(page);
        pageEl === null || pageEl === void 0 ? void 0 : pageEl.classList.remove('taro_page_stationed');
        pageEl === null || pageEl === void 0 ? void 0 : pageEl.classList.remove('taro_page_show');
        this.unloadTimer = setTimeout(function () {
          var _this3$lastUnloadPage, _this3$lastUnloadPage2;

          _this3.unloadTimer = null;
          (_this3$lastUnloadPage = _this3.lastUnloadPage) === null || _this3$lastUnloadPage === void 0 ? void 0 : (_this3$lastUnloadPage2 = _this3$lastUnloadPage.onUnload) === null || _this3$lastUnloadPage2 === void 0 ? void 0 : _this3$lastUnloadPage2.call(_this3$lastUnloadPage);
        }, this.animationDuration);
      } else {
        var _page$onUnload;

        var _pageEl2 = this.getPageContainer(page);

        _pageEl2 === null || _pageEl2 === void 0 ? void 0 : _pageEl2.classList.remove('taro_page_stationed');
        _pageEl2 === null || _pageEl2 === void 0 ? void 0 : _pageEl2.classList.remove('taro_page_show');
        page === null || page === void 0 ? void 0 : (_page$onUnload = page.onUnload) === null || _page$onUnload === void 0 ? void 0 : _page$onUnload.call(page);
      }

      if (delta >= 1) this.unload(stacks.last, delta);
    }
  }, {
    key: "show",
    value: function show(page) {
      var _this4 = this;

      var pageConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var stacksIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      if (!page) return;
      var param = this.getQuery(stacks.length, '', page.options);
      var pageEl = this.getPageContainer(page);

      if (pageEl) {
        var _page$onShow3;

        setDisplay(pageEl);
        this.addAnimation(pageEl, stacksIndex === 0);
        (_page$onShow3 = page.onShow) === null || _page$onShow3 === void 0 ? void 0 : _page$onShow3.call(page);
        this.bindPageEvents(page, pageEl, pageConfig);
      } else {
        var _page$onLoad2;

        (_page$onLoad2 = page.onLoad) === null || _page$onLoad2 === void 0 ? void 0 : _page$onLoad2.call(page, param, function () {
          var _page$onShow4;

          pageEl = _this4.getPageContainer(page);

          _this4.addAnimation(pageEl, stacksIndex === 0);

          _this4.onReady(page, false);

          (_page$onShow4 = page.onShow) === null || _page$onShow4 === void 0 ? void 0 : _page$onShow4.call(page);

          _this4.bindPageEvents(page, pageEl, pageConfig);
        });
      }
    }
  }, {
    key: "hide",
    value: function hide(page) {
      var _this5 = this;

      if (!page) return; // NOTE: ????????????????????????????????????????????????????????????????????????????????????????????????????????????

      var pageEl = this.getPageContainer(page);

      if (pageEl) {
        var _page$onHide;

        if (this.hideTimer) {
          clearTimeout(this.hideTimer);
          this.hideTimer = null;
          setDisplay(this.lastHidePage, 'none');
        }

        this.lastHidePage = pageEl;
        this.hideTimer = setTimeout(function () {
          _this5.hideTimer = null;
          setDisplay(_this5.lastHidePage, 'none');
        }, this.animationDuration + this.animationDelay);
        (_page$onHide = page.onHide) === null || _page$onHide === void 0 ? void 0 : _page$onHide.call(page);
      } else {
        setTimeout(function () {
          return _this5.hide(page);
        }, 0);
      }
    }
  }, {
    key: "addAnimation",
    value: function addAnimation(pageEl) {
      var _this6 = this;

      var first = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (!pageEl) return;

      if (this.animation && !first) {
        setTimeout(function () {
          pageEl.classList.add('taro_page_show');
          setTimeout(function () {
            pageEl.classList.add('taro_page_stationed');
          }, _this6.animationDuration);
        }, this.animationDelay);
      } else {
        pageEl.classList.add('taro_page_show');
        pageEl.classList.add('taro_page_stationed');
      }
    }
  }, {
    key: "getPageContainer",
    value: function getPageContainer(page) {
      var _Current$page;

      var path = page ? page === null || page === void 0 ? void 0 : page.path : (_Current$page = runtime.Current.page) === null || _Current$page === void 0 ? void 0 : _Current$page.path;
      var id = path === null || path === void 0 ? void 0 : path.replace(/([^a-z0-9\u00a0-\uffff_-])/ig, '\\$1');

      if (page) {
        return document.querySelector(".taro_page#".concat(id));
      }

      var el = id ? document.querySelector(".taro_page#".concat(id)) : document.querySelector('.taro_page') || document.querySelector('.taro_router');
      return el || window;
    }
  }, {
    key: "bindPageEvents",
    value: function bindPageEvents(page, pageEl) {
      var _this$config$window;

      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (!pageEl) {
        pageEl = this.getPageContainer();
      }

      var distance = config.onReachBottomDistance || ((_this$config$window = this.config.window) === null || _this$config$window === void 0 ? void 0 : _this$config$window.onReachBottomDistance) || 50;
      bindPageScroll(page, pageEl, distance);
      bindPageResize(page);
    }
  }]);

  return PageHandler;
}();

function createRouter(app, config, framework) {
  var _routes$0$path, _app$onLaunch, _app$onShow;

  var handler = new PageHandler(config);
  var runtimeHooks = runtime.container.get(runtime.SERVICE_IDENTIFIER.Hooks);
  routesAlias.set(handler.router.customRoutes);
  var basename = handler.router.basename;
  var routes = handler.routes.map(function (route) {
    return {
      path: routesAlias.getAll(addLeadingSlash(route.path)),
      action: route.load
    };
  });
  var entryPagePath = config.entryPagePath || ((_routes$0$path = routes[0].path) === null || _routes$0$path === void 0 ? void 0 : _routes$0$path[0]);
  var router = new UniversalRouter(routes, {
    baseUrl: basename || ''
  });
  var launchParam = handler.getQuery(stacks.length);
  (_app$onLaunch = app.onLaunch) === null || _app$onLaunch === void 0 ? void 0 : _app$onLaunch.call(app, launchParam);

  var render = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee(_ref) {
      var _config$window;

      var location, action, element, _app$onPageNotFound, pageConfig, enablePullDownRefresh, _pageConfig$navigatio, currentPage, pathname, shouldLoad, prevIndex, delta, _prevIndex, _delta, _element$default, _runtimeHooks$createP, el, loadConfig, stacksIndex, page;

      return _regeneratorRuntime__default['default'].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              location = _ref.location, action = _ref.action;
              handler.pathname = location.pathname;
              _context.prev = 2;
              _context.next = 5;
              return router.resolve(handler.router.forcePath || handler.pathname);

            case 5:
              element = _context.sent;
              _context.next = 15;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](2);

              if (!(_context.t0.status === 404)) {
                _context.next = 14;
                break;
              }

              (_app$onPageNotFound = app.onPageNotFound) === null || _app$onPageNotFound === void 0 ? void 0 : _app$onPageNotFound.call(app, {
                path: handler.pathname
              });
              _context.next = 15;
              break;

            case 14:
              throw new Error(_context.t0);

            case 15:
              if (element) {
                _context.next = 17;
                break;
              }

              return _context.abrupt("return");

            case 17:
              pageConfig = handler.pageConfig;
              enablePullDownRefresh = (config === null || config === void 0 ? void 0 : (_config$window = config.window) === null || _config$window === void 0 ? void 0 : _config$window.enablePullDownRefresh) || false;
              runtime.eventCenter.trigger('__taroRouterChange', {
                toLocation: {
                  path: handler.pathname
                }
              });

              if (pageConfig) {
                document.title = (_pageConfig$navigatio = pageConfig.navigationBarTitleText) !== null && _pageConfig$navigatio !== void 0 ? _pageConfig$navigatio : document.title;

                if (typeof pageConfig.enablePullDownRefresh === 'boolean') {
                  enablePullDownRefresh = pageConfig.enablePullDownRefresh;
                }
              }

              currentPage = runtime.Current.page;
              pathname = handler.pathname;
              shouldLoad = false;

              if (!(action === 'POP')) {
                _context.next = 31;
                break;
              }

              // NOTE: ???????????????????????????????????????????????????????????????
              prevIndex = stacks.getPrevIndex(pathname);
              delta = stacks.getDelta(pathname);
              handler.unload(currentPage, delta, prevIndex > -1);

              if (prevIndex > -1) {
                handler.show(stacks.getItem(prevIndex), pageConfig, prevIndex);
              } else {
                shouldLoad = true;
              }

              _context.next = 42;
              break;

            case 31:
              if (!handler.isTabBar) {
                _context.next = 40;
                break;
              }

              if (!handler.isSamePage(currentPage)) {
                _context.next = 34;
                break;
              }

              return _context.abrupt("return");

            case 34:
              _prevIndex = stacks.getPrevIndex(pathname, 0);
              handler.hide(currentPage);

              if (!(_prevIndex > -1)) {
                _context.next = 38;
                break;
              }

              return _context.abrupt("return", handler.show(stacks.getItem(_prevIndex), pageConfig, _prevIndex));

            case 38:
              _context.next = 41;
              break;

            case 40:
              if (action === 'REPLACE') {
                _delta = stacks.getDelta(pathname); // NOTE: ???????????????????????????????????????????????????????????? stack ????????????

                handler.unload(currentPage, _delta);
              } else if (action === 'PUSH') {
                handler.hide(currentPage);
              }

            case 41:
              shouldLoad = true;

            case 42:
              if (!(shouldLoad || stacks.length < 1)) {
                _context.next = 50;
                break;
              }

              el = (_element$default = element.default) !== null && _element$default !== void 0 ? _element$default : element;
              loadConfig = _objectSpread__default['default']({}, pageConfig);
              stacksIndex = stacks.length;
              delete loadConfig['path'];
              delete loadConfig['load'];
              page = runtime.createPageConfig(enablePullDownRefresh ? (_runtimeHooks$createP = runtimeHooks.createPullDownComponent) === null || _runtimeHooks$createP === void 0 ? void 0 : _runtimeHooks$createP.call(runtimeHooks, el, location.pathname, framework, handler.PullDownRefresh) : el, pathname + runtime.stringify(handler.getQuery(stacksIndex)), {}, loadConfig);
              return _context.abrupt("return", handler.load(page, pageConfig, stacksIndex));

            case 50:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 8]]);
    }));

    return function render(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  if (exports.history.location.pathname === '/') {
    exports.history.replace(prependBasename(entryPagePath + exports.history.location.search));
  }

  render({
    location: exports.history.location,
    action: r.Push
  });
  (_app$onShow = app.onShow) === null || _app$onShow === void 0 ? void 0 : _app$onShow.call(app, launchParam);
  return exports.history.listen(render);
}

exports.createRouter = createRouter;
exports.getCurrentPages = getCurrentPages;
exports.navigateBack = navigateBack;
exports.navigateTo = navigateTo;
exports.reLaunch = reLaunch;
exports.redirectTo = redirectTo;
exports.switchTab = switchTab;
//# sourceMappingURL=index.js.map

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1649338160483);
})()
//miniprogram-npm-outsideDeps=["@babel/runtime/helpers/esm/extends","@babel/runtime/helpers/objectSpread2","@babel/runtime/helpers/asyncToGenerator","@babel/runtime/regenerator","@babel/runtime/helpers/toConsumableArray","@babel/runtime/helpers/classCallCheck","@babel/runtime/helpers/createClass","@babel/runtime/helpers/defineProperty","@tarojs/runtime","@babel/runtime/helpers/typeof","@babel/runtime/helpers/slicedToArray","@babel/runtime/helpers/createForOfIteratorHelper","@tarojs/taro"]
//# sourceMappingURL=index.js.map