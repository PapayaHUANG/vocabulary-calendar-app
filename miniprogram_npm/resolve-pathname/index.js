module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1649338161644, function(require, module, exports) {


if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/resolve-pathname.min.js');
} else {
  module.exports = require('./cjs/resolve-pathname.js');
}

}, function(modId) {var map = {"./cjs/resolve-pathname.min.js":1649338161645,"./cjs/resolve-pathname.js":1649338161646}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338161645, function(require, module, exports) {
function isAbsolute(e){return"/"===e.charAt(0)}function spliceOne(e,t){for(var s=t,n=s+1,i=e.length;n<i;s+=1,n+=1)e[s]=e[n];e.pop()}function resolvePathname(e,t){void 0===t&&(t="");var s,n=e&&e.split("/")||[],i=t&&t.split("/")||[],l=e&&isAbsolute(e),r=t&&isAbsolute(t),o=l||r;if(e&&isAbsolute(e)?i=n:n.length&&(i.pop(),i=i.concat(n)),!i.length)return"/";if(i.length){var u=i[i.length-1];s="."===u||".."===u||""===u}else s=!1;for(var a=0,c=i.length;0<=c;c--){var f=i[c];"."===f?spliceOne(i,c):".."===f?(spliceOne(i,c),a++):a&&(spliceOne(i,c),a--)}if(!o)for(;a--;a)i.unshift("..");!o||""===i[0]||i[0]&&isAbsolute(i[0])||i.unshift("");var h=i.join("/");return s&&"/"!==h.substr(-1)&&(h+="/"),h}module.exports=resolvePathname;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338161646, function(require, module, exports) {


function isAbsolute(pathname) {
  return pathname.charAt(0) === '/';
}

// About 1.5x faster than the two-arg version of Array#splice()
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
    list[i] = list[k];
  }

  list.pop();
}

// This implementation is based heavily on node's url.parse
function resolvePathname(to, from) {
  if (from === undefined) from = '';

  var toParts = (to && to.split('/')) || [];
  var fromParts = (from && from.split('/')) || [];

  var isToAbs = to && isAbsolute(to);
  var isFromAbs = from && isAbsolute(from);
  var mustEndAbs = isToAbs || isFromAbs;

  if (to && isAbsolute(to)) {
    // to is absolute
    fromParts = toParts;
  } else if (toParts.length) {
    // to is relative, drop the filename
    fromParts.pop();
    fromParts = fromParts.concat(toParts);
  }

  if (!fromParts.length) return '/';

  var hasTrailingSlash;
  if (fromParts.length) {
    var last = fromParts[fromParts.length - 1];
    hasTrailingSlash = last === '.' || last === '..' || last === '';
  } else {
    hasTrailingSlash = false;
  }

  var up = 0;
  for (var i = fromParts.length; i >= 0; i--) {
    var part = fromParts[i];

    if (part === '.') {
      spliceOne(fromParts, i);
    } else if (part === '..') {
      spliceOne(fromParts, i);
      up++;
    } else if (up) {
      spliceOne(fromParts, i);
      up--;
    }
  }

  if (!mustEndAbs) for (; up--; up) fromParts.unshift('..');

  if (
    mustEndAbs &&
    fromParts[0] !== '' &&
    (!fromParts[0] || !isAbsolute(fromParts[0]))
  )
    fromParts.unshift('');

  var result = fromParts.join('/');

  if (hasTrailingSlash && result.substr(-1) !== '/') result += '/';

  return result;
}

module.exports = resolvePathname;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1649338161644);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map