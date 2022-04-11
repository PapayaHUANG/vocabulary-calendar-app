module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1649338161749, function(require, module, exports) {
if (process.env.TARO_ENV === 'weapp') {
      module.exports = require('./weapp/index')
      module.exports.default = module.exports
    } else if (process.env.TARO_ENV === 'h5') {
      module.exports = require('./h5/index')
      module.exports.default = module.exports
    } else {
        module.exports = require('./weapp/index')
        module.exports.default = module.exports
      }
}, function(modId) {var map = {"./h5/index":1649338161750}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338161750, function(require, module, exports) {
var __TEMP__ = require('@tarojs/taro-h5');var Taro = __REQUIRE_DEFAULT__(__TEMP__);

Taro.initPxTransform({ designWidth: 750, deviceRatio: {} });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/action-sheet');Object.defineProperty(exports, 'AtActionSheet', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/action-sheet/body/item');Object.defineProperty(exports, 'AtActionSheetItem', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/activity-indicator');Object.defineProperty(exports, 'AtActivityIndicator', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/avatar');Object.defineProperty(exports, 'AtAvatar', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/badge');Object.defineProperty(exports, 'AtBadge', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/button');Object.defineProperty(exports, 'AtButton', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/card');Object.defineProperty(exports, 'AtCard', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/checkbox');Object.defineProperty(exports, 'AtCheckbox', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/drawer');Object.defineProperty(exports, 'AtDrawer', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/float-layout');Object.defineProperty(exports, 'AtFloatLayout', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/form');Object.defineProperty(exports, 'AtForm', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/grid');Object.defineProperty(exports, 'AtGrid', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/icon');Object.defineProperty(exports, 'AtIcon', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/input');Object.defineProperty(exports, 'AtInput', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/input-number');Object.defineProperty(exports, 'AtInputNumber', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/list');Object.defineProperty(exports, 'AtList', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/list/item');Object.defineProperty(exports, 'AtListItem', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/modal');Object.defineProperty(exports, 'AtModal', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/modal/header');Object.defineProperty(exports, 'AtModalHeader', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/modal/content');Object.defineProperty(exports, 'AtModalContent', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/modal/action');Object.defineProperty(exports, 'AtModalAction', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/nav-bar');Object.defineProperty(exports, 'AtNavBar', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/noticebar');Object.defineProperty(exports, 'AtNoticebar', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/pagination');Object.defineProperty(exports, 'AtPagination', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/progress');Object.defineProperty(exports, 'AtProgress', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/radio');Object.defineProperty(exports, 'AtRadio', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/rate');Object.defineProperty(exports, 'AtRate', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/segmented-control');Object.defineProperty(exports, 'AtSegmentedControl', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/switch');Object.defineProperty(exports, 'AtSwitch', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/tab-bar');Object.defineProperty(exports, 'AtTabBar', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/tabs');Object.defineProperty(exports, 'AtTabs', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/tabs-pane');Object.defineProperty(exports, 'AtTabsPane', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/tag');Object.defineProperty(exports, 'AtTag', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/textarea');Object.defineProperty(exports, 'AtTextarea', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/timeline');Object.defineProperty(exports, 'AtTimeline', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/toast');Object.defineProperty(exports, 'AtToast', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/accordion');Object.defineProperty(exports, 'AtAccordion', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/slider');Object.defineProperty(exports, 'AtSlider', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/swipe-action');Object.defineProperty(exports, 'AtSwipeAction', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/search-bar');Object.defineProperty(exports, 'AtSearchBar', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/load-more');Object.defineProperty(exports, 'AtLoadMore', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/divider');Object.defineProperty(exports, 'AtDivider', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/countdown');Object.defineProperty(exports, 'AtCountdown', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/steps');Object.defineProperty(exports, 'AtSteps', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/curtain');Object.defineProperty(exports, 'AtCurtain', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/message');Object.defineProperty(exports, 'AtMessage', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/image-picker');Object.defineProperty(exports, 'AtImagePicker', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/range');Object.defineProperty(exports, 'AtRange', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/indexes');Object.defineProperty(exports, 'AtIndexes', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/calendar');Object.defineProperty(exports, 'AtCalendar', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/fab');Object.defineProperty(exports, 'AtFab', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
/* 私有的组件  */
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./components/loading');Object.defineProperty(exports, 'AtLoading', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./common/component');Object.defineProperty(exports, 'AtComponent', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
}, function(modId) { var map = {"./common/component":1649338161803}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338161803, function(require, module, exports) {
var __TEMP__ = require('@tarojs/taro-h5');var Taro = __REQUIRE_DEFAULT__(__TEMP__);
const objectToString = style => {
  if (style && typeof style === 'object') {
    let styleStr = '';
    Object.keys(style).forEach(key => {
      const lowerCaseKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      styleStr += `${lowerCaseKey}:${style[key]};`;
    });
    return styleStr;
  } else if (style && typeof style === 'string') {
    return style;
  }
  return '';
};
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });class AtComponent extends Taro.Component {
  /**
   * 合并 style
   * @param {Object|String} style1
   * @param {Object|String} style2
   * @returns {String}
   */
  mergeStyle(style1, style2) {
    if (style1 && typeof style1 === 'object' && style2 && typeof style2 === 'object') {
      return Object.assign({}, style1, style2);
    }
    return objectToString(style1) + objectToString(style2);
  }
};exports.default = AtComponent
AtComponent.options = {
  addGlobalClass: true
};
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1649338161749);
})()
//miniprogram-npm-outsideDeps=["./weapp/index","@tarojs/taro-h5","./components/action-sheet","./components/action-sheet/body/item","./components/activity-indicator","./components/avatar","./components/badge","./components/button","./components/card","./components/checkbox","./components/drawer","./components/float-layout","./components/form","./components/grid","./components/icon","./components/input","./components/input-number","./components/list","./components/list/item","./components/modal","./components/modal/header","./components/modal/content","./components/modal/action","./components/nav-bar","./components/noticebar","./components/pagination","./components/progress","./components/radio","./components/rate","./components/segmented-control","./components/switch","./components/tab-bar","./components/tabs","./components/tabs-pane","./components/tag","./components/textarea","./components/timeline","./components/toast","./components/accordion","./components/slider","./components/swipe-action","./components/search-bar","./components/load-more","./components/divider","./components/countdown","./components/steps","./components/curtain","./components/message","./components/image-picker","./components/range","./components/indexes","./components/calendar","./components/fab","./components/loading"]
//# sourceMappingURL=index.js.map