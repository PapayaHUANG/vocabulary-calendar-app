module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1649338160916, function(require, module, exports) {


/* eslint-env node */

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./umd/history.production.min.js');
} else {
  module.exports = require('./umd/history.development.js');
}

}, function(modId) {var map = {"./umd/history.production.min.js":1649338160917,"./umd/history.development.js":1649338160918}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160917, function(require, module, exports) {
!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((t="undefined"!=typeof globalThis?globalThis:t||self).HistoryLibrary={})}(this,(function(t){function n(){return(n=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])}return t}).apply(this,arguments)}var e;t.Action=void 0,(e=t.Action||(t.Action={})).Pop="POP",e.Push="PUSH",e.Replace="REPLACE";var r="beforeunload",o="popstate";function a(t,n,e){return Math.min(Math.max(t,n),e)}function i(t){t.preventDefault(),t.returnValue=""}function c(){var t=[];return{get length(){return t.length},push:function(n){return t.push(n),function(){t=t.filter((function(t){return t!==n}))}},call:function(n){t.forEach((function(t){return t&&t(n)}))}}}function u(){return Math.random().toString(36).substr(2,8)}function l(t){var n=t.pathname,e=void 0===n?"/":n,r=t.search,o=void 0===r?"":r,a=t.hash,i=void 0===a?"":a;return o&&"?"!==o&&(e+="?"===o.charAt(0)?o:"?"+o),i&&"#"!==i&&(e+="#"===i.charAt(0)?i:"#"+i),e}function f(t){var n={};if(t){var e=t.indexOf("#");e>=0&&(n.hash=t.substr(e),t=t.substr(0,e));var r=t.indexOf("?");r>=0&&(n.search=t.substr(r),t=t.substr(0,r)),t&&(n.pathname=t)}return n}t.createBrowserHistory=function(e){void 0===e&&(e={});var a=e.window,s=void 0===a?document.defaultView:a,h=s.history;function p(){var t=s.location,n=t.pathname,e=t.search,r=t.hash,o=h.state||{};return[o.idx,{pathname:n,search:e,hash:r,state:o.usr||null,key:o.key||"default"}]}var v=null;s.addEventListener(o,(function(){if(v)A.call(v),v=null;else{var n=t.Action.Pop,e=p(),r=e[0],o=e[1];if(A.length){if(null!=r){var a=y-r;a&&(v={action:n,location:o,retry:function(){H(-1*a)}},H(a))}}else E(n)}}));var d=t.Action.Pop,g=p(),y=g[0],m=g[1],b=c(),A=c();function P(t){return"string"==typeof t?t:l(t)}function k(t,e){return void 0===e&&(e=null),n({pathname:m.pathname,hash:"",search:""},"string"==typeof t?f(t):t,{state:e,key:u()})}function x(t,n){return[{usr:t.state,key:t.key,idx:n},P(t)]}function w(t,n,e){return!A.length||(A.call({action:t,location:n,retry:e}),!1)}function E(t){d=t;var n=p();y=n[0],m=n[1],b.call({action:d,location:m})}function H(t){h.go(t)}return null==y&&(y=0,h.replaceState(n({},h.state,{idx:y}),"")),{get action(){return d},get location(){return m},createHref:P,push:function n(e,r){var o=t.Action.Push,a=k(e,r);if(w(o,a,(function(){n(e,r)}))){var i=x(a,y+1),c=i[0],u=i[1];try{h.pushState(c,"",u)}catch(t){s.location.assign(u)}E(o)}},replace:function n(e,r){var o=t.Action.Replace,a=k(e,r);if(w(o,a,(function(){n(e,r)}))){var i=x(a,y),c=i[0],u=i[1];h.replaceState(c,"",u),E(o)}},go:H,back:function(){H(-1)},forward:function(){H(1)},listen:function(t){return b.push(t)},block:function(t){var n=A.push(t);return 1===A.length&&s.addEventListener(r,i),function(){n(),A.length||s.removeEventListener(r,i)}}}},t.createHashHistory=function(e){void 0===e&&(e={});var a=e.window,s=void 0===a?document.defaultView:a,h=s.history;function p(){var t=f(s.location.hash.substr(1)),n=t.pathname,e=void 0===n?"/":n,r=t.search,o=void 0===r?"":r,a=t.hash,i=void 0===a?"":a,c=h.state||{};return[c.idx,{pathname:e,search:o,hash:i,state:c.usr||null,key:c.key||"default"}]}var v=null;function d(){if(v)P.call(v),v=null;else{var n=t.Action.Pop,e=p(),r=e[0],o=e[1];if(P.length){if(null!=r){var a=m-r;a&&(v={action:n,location:o,retry:function(){L(-1*a)}},L(a))}}else H(n)}}s.addEventListener(o,d),s.addEventListener("hashchange",(function(){l(p()[1])!==l(b)&&d()}));var g=t.Action.Pop,y=p(),m=y[0],b=y[1],A=c(),P=c();function k(t){return function(){var t=document.querySelector("base"),n="";if(t&&t.getAttribute("href")){var e=s.location.href,r=e.indexOf("#");n=-1===r?e:e.slice(0,r)}return n}()+"#"+("string"==typeof t?t:l(t))}function x(t,e){return void 0===e&&(e=null),n({pathname:b.pathname,hash:"",search:""},"string"==typeof t?f(t):t,{state:e,key:u()})}function w(t,n){return[{usr:t.state,key:t.key,idx:n},k(t)]}function E(t,n,e){return!P.length||(P.call({action:t,location:n,retry:e}),!1)}function H(t){g=t;var n=p();m=n[0],b=n[1],A.call({action:g,location:b})}function L(t){h.go(t)}return null==m&&(m=0,h.replaceState(n({},h.state,{idx:m}),"")),{get action(){return g},get location(){return b},createHref:k,push:function n(e,r){var o=t.Action.Push,a=x(e,r);if(E(o,a,(function(){n(e,r)}))){var i=w(a,m+1),c=i[0],u=i[1];try{h.pushState(c,"",u)}catch(t){s.location.assign(u)}H(o)}},replace:function n(e,r){var o=t.Action.Replace,a=x(e,r);if(E(o,a,(function(){n(e,r)}))){var i=w(a,m),c=i[0],u=i[1];h.replaceState(c,"",u),H(o)}},go:L,back:function(){L(-1)},forward:function(){L(1)},listen:function(t){return A.push(t)},block:function(t){var n=P.push(t);return 1===P.length&&s.addEventListener(r,i),function(){n(),P.length||s.removeEventListener(r,i)}}}},t.createMemoryHistory=function(e){void 0===e&&(e={});var r=e,o=r.initialEntries,i=void 0===o?["/"]:o,s=r.initialIndex,h=i.map((function(t){return n({pathname:"/",search:"",hash:"",state:null,key:u()},"string"==typeof t?f(t):t)})),p=a(null==s?h.length-1:s,0,h.length-1),v=t.Action.Pop,d=h[p],g=c(),y=c();function m(t,e){return void 0===e&&(e=null),n({pathname:d.pathname,search:"",hash:""},"string"==typeof t?f(t):t,{state:e,key:u()})}function b(t,n,e){return!y.length||(y.call({action:t,location:n,retry:e}),!1)}function A(t,n){v=t,d=n,g.call({action:v,location:d})}function P(n){var e=a(p+n,0,h.length-1),r=t.Action.Pop,o=h[e];b(r,o,(function(){P(n)}))&&(p=e,A(r,o))}return{get index(){return p},get action(){return v},get location(){return d},createHref:function(t){return"string"==typeof t?t:l(t)},push:function n(e,r){var o=t.Action.Push,a=m(e,r);b(o,a,(function(){n(e,r)}))&&(p+=1,h.splice(p,h.length,a),A(o,a))},replace:function n(e,r){var o=t.Action.Replace,a=m(e,r);b(o,a,(function(){n(e,r)}))&&(h[p]=a,A(o,a))},go:P,back:function(){P(-1)},forward:function(){P(1)},listen:function(t){return g.push(t)},block:function(t){return y.push(t)}}},t.createPath=l,t.parsePath=f,Object.defineProperty(t,"__esModule",{value:!0})}));
//# sourceMappingURL=history.production.min.js.map

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160918, function(require, module, exports) {
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.HistoryLibrary = {}));
}(this, (function (exports) { 

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  /**
   * Actions represent the type of change to a location value.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#action
   */
  exports.Action = void 0;

  (function (Action) {
    /**
     * A POP indicates a change to an arbitrary index in the history stack, such
     * as a back or forward navigation. It does not describe the direction of the
     * navigation, only that the current index changed.
     *
     * Note: This is the default action for newly created history objects.
     */
    Action["Pop"] = "POP";
    /**
     * A PUSH indicates a new entry being added to the history stack, such as when
     * a link is clicked and a new page loads. When this happens, all subsequent
     * entries in the stack are lost.
     */

    Action["Push"] = "PUSH";
    /**
     * A REPLACE indicates the entry at the current index in the history stack
     * being replaced by a new one.
     */

    Action["Replace"] = "REPLACE";
  })(exports.Action || (exports.Action = {}));

  var readOnly = function (obj) {
    return Object.freeze(obj);
  } ;

  function warning(cond, message) {
    if (!cond) {
      // eslint-disable-next-line no-console
      if (typeof console !== 'undefined') console.warn(message);

      try {
        // Welcome to debugging history!
        //
        // This error is thrown as a convenience so you can more easily
        // find the source for a warning that appears in the console by
        // enabling "pause on exceptions" in your JavaScript debugger.
        throw new Error(message); // eslint-disable-next-line no-empty
      } catch (e) {}
    }
  }

  var BeforeUnloadEventType = 'beforeunload';
  var HashChangeEventType = 'hashchange';
  var PopStateEventType = 'popstate';
  /**
   * Browser history stores the location in regular URLs. This is the standard for
   * most web apps, but it requires some configuration on the server to ensure you
   * serve the same app at multiple URLs.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createbrowserhistory
   */

  function createBrowserHistory(options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
        _options$window = _options.window,
        window = _options$window === void 0 ? document.defaultView : _options$window;
    var globalHistory = window.history;

    function getIndexAndLocation() {
      var _window$location = window.location,
          pathname = _window$location.pathname,
          search = _window$location.search,
          hash = _window$location.hash;
      var state = globalHistory.state || {};
      return [state.idx, readOnly({
        pathname: pathname,
        search: search,
        hash: hash,
        state: state.usr || null,
        key: state.key || 'default'
      })];
    }

    var blockedPopTx = null;

    function handlePop() {
      if (blockedPopTx) {
        blockers.call(blockedPopTx);
        blockedPopTx = null;
      } else {
        var nextAction = exports.Action.Pop;

        var _getIndexAndLocation = getIndexAndLocation(),
            nextIndex = _getIndexAndLocation[0],
            nextLocation = _getIndexAndLocation[1];

        if (blockers.length) {
          if (nextIndex != null) {
            var delta = index - nextIndex;

            if (delta) {
              // Revert the POP
              blockedPopTx = {
                action: nextAction,
                location: nextLocation,
                retry: function retry() {
                  go(delta * -1);
                }
              };
              go(delta);
            }
          } else {
            // Trying to POP to a location with no index. We did not create
            // this location, so we can't effectively block the navigation.
            warning(false, // TODO: Write up a doc that explains our blocking strategy in
            // detail and link to it here so people can understand better what
            // is going on and how to avoid it.
            "You are trying to block a POP navigation to a location that was not " + "created by the history library. The block will fail silently in " + "production, but in general you should do all navigation with the " + "history library (instead of using window.history.pushState directly) " + "to avoid this situation.") ;
          }
        } else {
          applyTx(nextAction);
        }
      }
    }

    window.addEventListener(PopStateEventType, handlePop);
    var action = exports.Action.Pop;

    var _getIndexAndLocation2 = getIndexAndLocation(),
        index = _getIndexAndLocation2[0],
        location = _getIndexAndLocation2[1];

    var listeners = createEvents();
    var blockers = createEvents();

    if (index == null) {
      index = 0;
      globalHistory.replaceState(_extends({}, globalHistory.state, {
        idx: index
      }), '');
    }

    function createHref(to) {
      return typeof to === 'string' ? to : createPath(to);
    } // state defaults to `null` because `window.history.state` does


    function getNextLocation(to, state) {
      if (state === void 0) {
        state = null;
      }

      return readOnly(_extends({
        pathname: location.pathname,
        hash: '',
        search: ''
      }, typeof to === 'string' ? parsePath(to) : to, {
        state: state,
        key: createKey()
      }));
    }

    function getHistoryStateAndUrl(nextLocation, index) {
      return [{
        usr: nextLocation.state,
        key: nextLocation.key,
        idx: index
      }, createHref(nextLocation)];
    }

    function allowTx(action, location, retry) {
      return !blockers.length || (blockers.call({
        action: action,
        location: location,
        retry: retry
      }), false);
    }

    function applyTx(nextAction) {
      action = nextAction;

      var _getIndexAndLocation3 = getIndexAndLocation();

      index = _getIndexAndLocation3[0];
      location = _getIndexAndLocation3[1];
      listeners.call({
        action: action,
        location: location
      });
    }

    function push(to, state) {
      var nextAction = exports.Action.Push;
      var nextLocation = getNextLocation(to, state);

      function retry() {
        push(to, state);
      }

      if (allowTx(nextAction, nextLocation, retry)) {
        var _getHistoryStateAndUr = getHistoryStateAndUrl(nextLocation, index + 1),
            historyState = _getHistoryStateAndUr[0],
            url = _getHistoryStateAndUr[1]; // TODO: Support forced reloading
        // try...catch because iOS limits us to 100 pushState calls :/


        try {
          globalHistory.pushState(historyState, '', url);
        } catch (error) {
          // They are going to lose state here, but there is no real
          // way to warn them about it since the page will refresh...
          window.location.assign(url);
        }

        applyTx(nextAction);
      }
    }

    function replace(to, state) {
      var nextAction = exports.Action.Replace;
      var nextLocation = getNextLocation(to, state);

      function retry() {
        replace(to, state);
      }

      if (allowTx(nextAction, nextLocation, retry)) {
        var _getHistoryStateAndUr2 = getHistoryStateAndUrl(nextLocation, index),
            historyState = _getHistoryStateAndUr2[0],
            url = _getHistoryStateAndUr2[1]; // TODO: Support forced reloading


        globalHistory.replaceState(historyState, '', url);
        applyTx(nextAction);
      }
    }

    function go(delta) {
      globalHistory.go(delta);
    }

    var history = {
      get action() {
        return action;
      },

      get location() {
        return location;
      },

      createHref: createHref,
      push: push,
      replace: replace,
      go: go,
      back: function back() {
        go(-1);
      },
      forward: function forward() {
        go(1);
      },
      listen: function listen(listener) {
        return listeners.push(listener);
      },
      block: function block(blocker) {
        var unblock = blockers.push(blocker);

        if (blockers.length === 1) {
          window.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
        }

        return function () {
          unblock(); // Remove the beforeunload listener so the document may
          // still be salvageable in the pagehide event.
          // See https://html.spec.whatwg.org/#unloading-documents

          if (!blockers.length) {
            window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
          }
        };
      }
    };
    return history;
  }
  /**
   * Hash history stores the location in window.location.hash. This makes it ideal
   * for situations where you don't want to send the location to the server for
   * some reason, either because you do cannot configure it or the URL space is
   * reserved for something else.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createhashhistory
   */

  function createHashHistory(options) {
    if (options === void 0) {
      options = {};
    }

    var _options2 = options,
        _options2$window = _options2.window,
        window = _options2$window === void 0 ? document.defaultView : _options2$window;
    var globalHistory = window.history;

    function getIndexAndLocation() {
      var _parsePath = parsePath(window.location.hash.substr(1)),
          _parsePath$pathname = _parsePath.pathname,
          pathname = _parsePath$pathname === void 0 ? '/' : _parsePath$pathname,
          _parsePath$search = _parsePath.search,
          search = _parsePath$search === void 0 ? '' : _parsePath$search,
          _parsePath$hash = _parsePath.hash,
          hash = _parsePath$hash === void 0 ? '' : _parsePath$hash;

      var state = globalHistory.state || {};
      return [state.idx, readOnly({
        pathname: pathname,
        search: search,
        hash: hash,
        state: state.usr || null,
        key: state.key || 'default'
      })];
    }

    var blockedPopTx = null;

    function handlePop() {
      if (blockedPopTx) {
        blockers.call(blockedPopTx);
        blockedPopTx = null;
      } else {
        var nextAction = exports.Action.Pop;

        var _getIndexAndLocation4 = getIndexAndLocation(),
            nextIndex = _getIndexAndLocation4[0],
            nextLocation = _getIndexAndLocation4[1];

        if (blockers.length) {
          if (nextIndex != null) {
            var delta = index - nextIndex;

            if (delta) {
              // Revert the POP
              blockedPopTx = {
                action: nextAction,
                location: nextLocation,
                retry: function retry() {
                  go(delta * -1);
                }
              };
              go(delta);
            }
          } else {
            // Trying to POP to a location with no index. We did not create
            // this location, so we can't effectively block the navigation.
            warning(false, // TODO: Write up a doc that explains our blocking strategy in
            // detail and link to it here so people can understand better
            // what is going on and how to avoid it.
            "You are trying to block a POP navigation to a location that was not " + "created by the history library. The block will fail silently in " + "production, but in general you should do all navigation with the " + "history library (instead of using window.history.pushState directly) " + "to avoid this situation.") ;
          }
        } else {
          applyTx(nextAction);
        }
      }
    }

    window.addEventListener(PopStateEventType, handlePop); // popstate does not fire on hashchange in IE 11 and old (trident) Edge
    // https://developer.mozilla.org/de/docs/Web/API/Window/popstate_event

    window.addEventListener(HashChangeEventType, function () {
      var _getIndexAndLocation5 = getIndexAndLocation(),
          nextLocation = _getIndexAndLocation5[1]; // Ignore extraneous hashchange events.


      if (createPath(nextLocation) !== createPath(location)) {
        handlePop();
      }
    });
    var action = exports.Action.Pop;

    var _getIndexAndLocation6 = getIndexAndLocation(),
        index = _getIndexAndLocation6[0],
        location = _getIndexAndLocation6[1];

    var listeners = createEvents();
    var blockers = createEvents();

    if (index == null) {
      index = 0;
      globalHistory.replaceState(_extends({}, globalHistory.state, {
        idx: index
      }), '');
    }

    function getBaseHref() {
      var base = document.querySelector('base');
      var href = '';

      if (base && base.getAttribute('href')) {
        var url = window.location.href;
        var hashIndex = url.indexOf('#');
        href = hashIndex === -1 ? url : url.slice(0, hashIndex);
      }

      return href;
    }

    function createHref(to) {
      return getBaseHref() + '#' + (typeof to === 'string' ? to : createPath(to));
    }

    function getNextLocation(to, state) {
      if (state === void 0) {
        state = null;
      }

      return readOnly(_extends({
        pathname: location.pathname,
        hash: '',
        search: ''
      }, typeof to === 'string' ? parsePath(to) : to, {
        state: state,
        key: createKey()
      }));
    }

    function getHistoryStateAndUrl(nextLocation, index) {
      return [{
        usr: nextLocation.state,
        key: nextLocation.key,
        idx: index
      }, createHref(nextLocation)];
    }

    function allowTx(action, location, retry) {
      return !blockers.length || (blockers.call({
        action: action,
        location: location,
        retry: retry
      }), false);
    }

    function applyTx(nextAction) {
      action = nextAction;

      var _getIndexAndLocation7 = getIndexAndLocation();

      index = _getIndexAndLocation7[0];
      location = _getIndexAndLocation7[1];
      listeners.call({
        action: action,
        location: location
      });
    }

    function push(to, state) {
      var nextAction = exports.Action.Push;
      var nextLocation = getNextLocation(to, state);

      function retry() {
        push(to, state);
      }

      warning(nextLocation.pathname.charAt(0) === '/', "Relative pathnames are not supported in hash history.push(" + JSON.stringify(to) + ")") ;

      if (allowTx(nextAction, nextLocation, retry)) {
        var _getHistoryStateAndUr3 = getHistoryStateAndUrl(nextLocation, index + 1),
            historyState = _getHistoryStateAndUr3[0],
            url = _getHistoryStateAndUr3[1]; // TODO: Support forced reloading
        // try...catch because iOS limits us to 100 pushState calls :/


        try {
          globalHistory.pushState(historyState, '', url);
        } catch (error) {
          // They are going to lose state here, but there is no real
          // way to warn them about it since the page will refresh...
          window.location.assign(url);
        }

        applyTx(nextAction);
      }
    }

    function replace(to, state) {
      var nextAction = exports.Action.Replace;
      var nextLocation = getNextLocation(to, state);

      function retry() {
        replace(to, state);
      }

      warning(nextLocation.pathname.charAt(0) === '/', "Relative pathnames are not supported in hash history.replace(" + JSON.stringify(to) + ")") ;

      if (allowTx(nextAction, nextLocation, retry)) {
        var _getHistoryStateAndUr4 = getHistoryStateAndUrl(nextLocation, index),
            historyState = _getHistoryStateAndUr4[0],
            url = _getHistoryStateAndUr4[1]; // TODO: Support forced reloading


        globalHistory.replaceState(historyState, '', url);
        applyTx(nextAction);
      }
    }

    function go(delta) {
      globalHistory.go(delta);
    }

    var history = {
      get action() {
        return action;
      },

      get location() {
        return location;
      },

      createHref: createHref,
      push: push,
      replace: replace,
      go: go,
      back: function back() {
        go(-1);
      },
      forward: function forward() {
        go(1);
      },
      listen: function listen(listener) {
        return listeners.push(listener);
      },
      block: function block(blocker) {
        var unblock = blockers.push(blocker);

        if (blockers.length === 1) {
          window.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
        }

        return function () {
          unblock(); // Remove the beforeunload listener so the document may
          // still be salvageable in the pagehide event.
          // See https://html.spec.whatwg.org/#unloading-documents

          if (!blockers.length) {
            window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
          }
        };
      }
    };
    return history;
  }
  /**
   * Memory history stores the current location in memory. It is designed for use
   * in stateful non-browser environments like tests and React Native.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#creatememoryhistory
   */

  function createMemoryHistory(options) {
    if (options === void 0) {
      options = {};
    }

    var _options3 = options,
        _options3$initialEntr = _options3.initialEntries,
        initialEntries = _options3$initialEntr === void 0 ? ['/'] : _options3$initialEntr,
        initialIndex = _options3.initialIndex;
    var entries = initialEntries.map(function (entry) {
      var location = readOnly(_extends({
        pathname: '/',
        search: '',
        hash: '',
        state: null,
        key: createKey()
      }, typeof entry === 'string' ? parsePath(entry) : entry));
      warning(location.pathname.charAt(0) === '/', "Relative pathnames are not supported in createMemoryHistory({ initialEntries }) (invalid entry: " + JSON.stringify(entry) + ")") ;
      return location;
    });
    var index = clamp(initialIndex == null ? entries.length - 1 : initialIndex, 0, entries.length - 1);
    var action = exports.Action.Pop;
    var location = entries[index];
    var listeners = createEvents();
    var blockers = createEvents();

    function createHref(to) {
      return typeof to === 'string' ? to : createPath(to);
    }

    function getNextLocation(to, state) {
      if (state === void 0) {
        state = null;
      }

      return readOnly(_extends({
        pathname: location.pathname,
        search: '',
        hash: ''
      }, typeof to === 'string' ? parsePath(to) : to, {
        state: state,
        key: createKey()
      }));
    }

    function allowTx(action, location, retry) {
      return !blockers.length || (blockers.call({
        action: action,
        location: location,
        retry: retry
      }), false);
    }

    function applyTx(nextAction, nextLocation) {
      action = nextAction;
      location = nextLocation;
      listeners.call({
        action: action,
        location: location
      });
    }

    function push(to, state) {
      var nextAction = exports.Action.Push;
      var nextLocation = getNextLocation(to, state);

      function retry() {
        push(to, state);
      }

      warning(location.pathname.charAt(0) === '/', "Relative pathnames are not supported in memory history.push(" + JSON.stringify(to) + ")") ;

      if (allowTx(nextAction, nextLocation, retry)) {
        index += 1;
        entries.splice(index, entries.length, nextLocation);
        applyTx(nextAction, nextLocation);
      }
    }

    function replace(to, state) {
      var nextAction = exports.Action.Replace;
      var nextLocation = getNextLocation(to, state);

      function retry() {
        replace(to, state);
      }

      warning(location.pathname.charAt(0) === '/', "Relative pathnames are not supported in memory history.replace(" + JSON.stringify(to) + ")") ;

      if (allowTx(nextAction, nextLocation, retry)) {
        entries[index] = nextLocation;
        applyTx(nextAction, nextLocation);
      }
    }

    function go(delta) {
      var nextIndex = clamp(index + delta, 0, entries.length - 1);
      var nextAction = exports.Action.Pop;
      var nextLocation = entries[nextIndex];

      function retry() {
        go(delta);
      }

      if (allowTx(nextAction, nextLocation, retry)) {
        index = nextIndex;
        applyTx(nextAction, nextLocation);
      }
    }

    var history = {
      get index() {
        return index;
      },

      get action() {
        return action;
      },

      get location() {
        return location;
      },

      createHref: createHref,
      push: push,
      replace: replace,
      go: go,
      back: function back() {
        go(-1);
      },
      forward: function forward() {
        go(1);
      },
      listen: function listen(listener) {
        return listeners.push(listener);
      },
      block: function block(blocker) {
        return blockers.push(blocker);
      }
    };
    return history;
  } ////////////////////////////////////////////////////////////////////////////////
  // UTILS
  ////////////////////////////////////////////////////////////////////////////////

  function clamp(n, lowerBound, upperBound) {
    return Math.min(Math.max(n, lowerBound), upperBound);
  }

  function promptBeforeUnload(event) {
    // Cancel the event.
    event.preventDefault(); // Chrome (and legacy IE) requires returnValue to be set.

    event.returnValue = '';
  }

  function createEvents() {
    var handlers = [];
    return {
      get length() {
        return handlers.length;
      },

      push: function push(fn) {
        handlers.push(fn);
        return function () {
          handlers = handlers.filter(function (handler) {
            return handler !== fn;
          });
        };
      },
      call: function call(arg) {
        handlers.forEach(function (fn) {
          return fn && fn(arg);
        });
      }
    };
  }

  function createKey() {
    return Math.random().toString(36).substr(2, 8);
  }
  /**
   * Creates a string URL path from the given pathname, search, and hash components.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createpath
   */


  function createPath(_ref) {
    var _ref$pathname = _ref.pathname,
        pathname = _ref$pathname === void 0 ? '/' : _ref$pathname,
        _ref$search = _ref.search,
        search = _ref$search === void 0 ? '' : _ref$search,
        _ref$hash = _ref.hash,
        hash = _ref$hash === void 0 ? '' : _ref$hash;
    if (search && search !== '?') pathname += search.charAt(0) === '?' ? search : '?' + search;
    if (hash && hash !== '#') pathname += hash.charAt(0) === '#' ? hash : '#' + hash;
    return pathname;
  }
  /**
   * Parses a string URL path into its separate pathname, search, and hash components.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#parsepath
   */

  function parsePath(path) {
    var parsedPath = {};

    if (path) {
      var hashIndex = path.indexOf('#');

      if (hashIndex >= 0) {
        parsedPath.hash = path.substr(hashIndex);
        path = path.substr(0, hashIndex);
      }

      var searchIndex = path.indexOf('?');

      if (searchIndex >= 0) {
        parsedPath.search = path.substr(searchIndex);
        path = path.substr(0, searchIndex);
      }

      if (path) {
        parsedPath.pathname = path;
      }
    }

    return parsedPath;
  }

  exports.createBrowserHistory = createBrowserHistory;
  exports.createHashHistory = createHashHistory;
  exports.createMemoryHistory = createMemoryHistory;
  exports.createPath = createPath;
  exports.parsePath = parsePath;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=history.development.js.map

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1649338160916);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map