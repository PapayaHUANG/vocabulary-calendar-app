module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1649338160462, function(require, module, exports) {
// Options for Preact.
var __TEMP__ = require('./runtime/catchError');
var __TEMP__ = require('./runtime/debounceRendering');
var __TEMP__ = require('./runtime/vnode');
var __TEMP__ = require('./runtime/unmount');

var __TEMP__ = require('preact');var Component = __TEMP__['Component'];

var __TEMP__ = require('./constants');var VNODE_COMPONENT = __TEMP__['VNODE_COMPONENT'];var NAMESPACE = __TEMP__['NAMESPACE'];var HOOKS_LIST = __TEMP__['HOOKS_LIST'];var EFFECTS_LIST = __TEMP__['EFFECTS_LIST'];var COMPONENT_HOOKS = __TEMP__['COMPONENT_HOOKS'];var VNODE_DOM = __TEMP__['VNODE_DOM'];var VNODE_CHILDREN = __TEMP__['VNODE_CHILDREN'];var HOOK_ARGS = __TEMP__['HOOK_ARGS'];var HOOK_VALUE = __TEMP__['HOOK_VALUE'];var HOOK_CLEANUP = __TEMP__['HOOK_CLEANUP'];











var __TEMP__ = require('./computeKey');var computeKey = __TEMP__['computeKey'];
var __TEMP__ = require('./runtime/vnodesForComponent');var vnodesForComponent = __TEMP__['vnodesForComponent'];var mappedVNodes = __TEMP__['mappedVNodes'];
var __TEMP__ = require('./runtime/signaturesForType');var signaturesForType = __TEMP__['signaturesForType'];

let typesById = new Map();
let pendingUpdates = [];

function sign(type, key, forceReset, getCustomHooks, status) {
  if (type) {
    let signature = signaturesForType.get(type);
    if (status === 'begin') {
      signaturesForType.set(type, {
        type,
        key,
        forceReset,
        getCustomHooks: getCustomHooks || (() => []),
      });

      return 'needsHooks';
    } else if (status === 'needsHooks') {
      signature.fullKey = computeKey(signature);
    }
  }
}

function replaceComponent(OldType, NewType, resetHookState) {
  const vnodes = vnodesForComponent.get(OldType);
  if (!vnodes) return;

  // migrate the list to our new constructor reference
  vnodesForComponent.delete(OldType);
  vnodesForComponent.set(NewType, vnodes);

  mappedVNodes.set(OldType, NewType);

  pendingUpdates = pendingUpdates.filter(p => p[0] !== OldType);

  vnodes.forEach(vnode => {
    // update the type in-place to reference the new component
    vnode.type = NewType;

    if (vnode[VNODE_COMPONENT]) {
      vnode[VNODE_COMPONENT].constructor = vnode.type;

      try {
        if (vnode[VNODE_COMPONENT] instanceof OldType) {
          const oldInst = vnode[VNODE_COMPONENT];

          const newInst = new NewType(
            vnode[VNODE_COMPONENT].props,
            vnode[VNODE_COMPONENT].context
          );

          vnode[VNODE_COMPONENT] = newInst;
          // copy old properties onto the new instance.
          //   - Objects (including refs) in the new instance are updated with their old values
          //   - Missing or null properties are restored to their old values
          //   - Updated Functions are not reverted
          //   - Scalars are copied
          for (let i in oldInst) {
            const type = typeof oldInst[i];
            if (!(i in newInst)) {
              newInst[i] = oldInst[i];
            } else if (type !== 'function' && typeof newInst[i] === type) {
              if (
                type === 'object' &&
                newInst[i] != null &&
                newInst[i].constructor === oldInst[i].constructor
              ) {
                Object.assign(newInst[i], oldInst[i]);
              } else {
                newInst[i] = oldInst[i];
              }
            }
          }
        }
      } catch (e) {
        /* Functional component */
        vnode[VNODE_COMPONENT].constructor = NewType;
      }

      if (resetHookState) {
        if (
          vnode[VNODE_COMPONENT][COMPONENT_HOOKS] &&
          vnode[VNODE_COMPONENT][COMPONENT_HOOKS][HOOKS_LIST] &&
          vnode[VNODE_COMPONENT][COMPONENT_HOOKS][HOOKS_LIST].length
        ) {
          vnode[VNODE_COMPONENT][COMPONENT_HOOKS][HOOKS_LIST].forEach(
            possibleEffect => {
              if (
                possibleEffect[HOOK_CLEANUP] &&
                typeof possibleEffect[HOOK_CLEANUP] === 'function'
              ) {
                possibleEffect[HOOK_CLEANUP]();
              } else if (
                possibleEffect[HOOK_ARGS] &&
                possibleEffect[HOOK_VALUE] &&
                Object.keys(possibleEffect).length === 3
              ) {
                const cleanupKey = Object.keys(possibleEffect).find(
                  key => key !== HOOK_ARGS && key !== HOOK_VALUE
                );
                if (
                  cleanupKey &&
                  typeof possibleEffect[cleanupKey] == 'function'
                )
                  possibleEffect[cleanupKey]();
              }
            }
          );
        }

        vnode[VNODE_COMPONENT][COMPONENT_HOOKS] = {
          [HOOKS_LIST]: [],
          [EFFECTS_LIST]: [],
        };
      } else if (
        vnode[VNODE_COMPONENT][COMPONENT_HOOKS] &&
        vnode[VNODE_COMPONENT][COMPONENT_HOOKS][HOOKS_LIST] &&
        vnode[VNODE_COMPONENT][COMPONENT_HOOKS][HOOKS_LIST].length
      ) {
        vnode[VNODE_COMPONENT][COMPONENT_HOOKS][HOOKS_LIST].forEach(
          possibleEffect => {
            if (
              possibleEffect[HOOK_CLEANUP] &&
              typeof possibleEffect[HOOK_CLEANUP] === 'function'
            ) {
              possibleEffect[HOOK_CLEANUP]();
            } else if (
              possibleEffect[HOOK_ARGS] &&
              possibleEffect[HOOK_VALUE] &&
              Object.keys(possibleEffect).length === 3
            ) {
              const cleanupKey = Object.keys(possibleEffect).find(
                key => key !== HOOK_ARGS && key !== HOOK_VALUE
              );
              if (cleanupKey && typeof possibleEffect[cleanupKey] == 'function')
                possibleEffect[cleanupKey]();
            }
          }
        );

        vnode[VNODE_COMPONENT][COMPONENT_HOOKS][HOOKS_LIST].forEach(hook => {
          if (hook.__H && Array.isArray(hook.__H)) {
            hook.__H = undefined;
          }
        });
      }

      Component.prototype.forceUpdate.call(vnode[VNODE_COMPONENT]);
    }
  });
}

self[NAMESPACE] = {
  getSignature: type => signaturesForType.get(type),
  register: (type, id) => {
    if (typeof type !== 'function') return;

    if (typesById.has(id)) {
      const existing = typesById.get(id);
      if (existing !== type) {
        pendingUpdates.push([existing, type]);
        typesById.set(id, type);
      }
    } else {
      typesById.set(id, type);
    }

    if (!signaturesForType.has(type)) {
      signaturesForType.set(type, {
        getCustomHooks: () => [],
        type,
      });
    }
  },
  getPendingUpdates: () => pendingUpdates,
  flush: () => {
    pendingUpdates = [];
  },
  replaceComponent,
  sign,
  computeKey,
};

}, function(modId) {var map = {"./runtime/catchError":1649338160463,"./runtime/debounceRendering":1649338160465,"./runtime/vnode":1649338160466,"./runtime/unmount":1649338160468,"./constants":1649338160464,"./computeKey":1649338160469,"./runtime/vnodesForComponent":1649338160467,"./runtime/signaturesForType":1649338160470}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160463, function(require, module, exports) {
var __TEMP__ = require('preact');var options = __TEMP__['options'];
var __TEMP__ = require('../constants');var CATCH_ERROR_OPTION = __TEMP__['CATCH_ERROR_OPTION'];var COMPONENT_DIRTY = __TEMP__['COMPONENT_DIRTY'];var VNODE_COMPONENT = __TEMP__['VNODE_COMPONENT'];





const oldCatchError = options[CATCH_ERROR_OPTION];
options[CATCH_ERROR_OPTION] = (error, vnode, oldVNode) => {
  if (vnode[VNODE_COMPONENT] && vnode[VNODE_COMPONENT][COMPONENT_DIRTY]) {
    vnode[VNODE_COMPONENT][COMPONENT_DIRTY] = false;
  }

  if (oldCatchError) oldCatchError(error, vnode, oldVNode);
};

}, function(modId) { var map = {"../constants":1649338160464}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160464, function(require, module, exports) {
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var VNODE_COMPONENT = exports.VNODE_COMPONENT = '__c';
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var NAMESPACE = exports.NAMESPACE = '__PREFRESH__';
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var COMPONENT_HOOKS = exports.COMPONENT_HOOKS = '__H';
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var HOOKS_LIST = exports.HOOKS_LIST = '__';
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var EFFECTS_LIST = exports.EFFECTS_LIST = '__h';
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var RERENDER_COUNT = exports.RERENDER_COUNT = '__r';
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var CATCH_ERROR_OPTION = exports.CATCH_ERROR_OPTION = '__e';
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var COMPONENT_DIRTY = exports.COMPONENT_DIRTY = '__d';
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var VNODE_DOM = exports.VNODE_DOM = '__e';
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var VNODE_CHILDREN = exports.VNODE_CHILDREN = '__k';
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var HOOK_VALUE = exports.HOOK_VALUE = '__';
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var HOOK_ARGS = exports.HOOK_ARGS = '__H';
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var HOOK_CLEANUP = exports.HOOK_CLEANUP = '__c';

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160465, function(require, module, exports) {
var __TEMP__ = require('preact');var options = __TEMP__['options'];

var __TEMP__ = require('../constants');var RERENDER_COUNT = __TEMP__['RERENDER_COUNT'];

const defer =
  typeof Promise == 'function'
    ? Promise.prototype.then.bind(Promise.resolve())
    : setTimeout;

options.debounceRendering = process => {
  defer(() => {
    try {
      process();
    } catch (e) {
      process[RERENDER_COUNT] = 0;
      throw e;
    }
  });
};

}, function(modId) { var map = {"../constants":1649338160464}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160466, function(require, module, exports) {
var __TEMP__ = require('preact');var options = __TEMP__['options'];
var __TEMP__ = require('./vnodesForComponent');var vnodesForComponent = __TEMP__['vnodesForComponent'];var mappedVNodes = __TEMP__['mappedVNodes'];
var __TEMP__ = require('../constants');var VNODE_COMPONENT = __TEMP__['VNODE_COMPONENT'];

const getMappedVnode = type => {
  if (mappedVNodes.has(type)) {
    return getMappedVnode(mappedVNodes.get(type));
  }

  return type;
};

const oldVnode = options.vnode;
options.vnode = vnode => {
  if (vnode && typeof vnode.type === 'function') {
    const vnodes = vnodesForComponent.get(vnode.type);
    if (!vnodes) {
      vnodesForComponent.set(vnode.type, [vnode]);
    } else {
      vnodes.push(vnode);
    }

    const foundType = getMappedVnode(vnode.type);
    if (foundType !== vnode.type) {
      const vnodes = vnodesForComponent.get(foundType);
      if (!vnodes) {
        vnodesForComponent.set(foundType, [vnode]);
      } else {
        vnodes.push(vnode);
      }
    }

    vnode.type = foundType;
    if (
      vnode[VNODE_COMPONENT] &&
      'prototype' in vnode.type &&
      vnode.type.prototype.render
    ) {
      vnode[VNODE_COMPONENT].constructor = vnode.type;
    }
  }

  if (oldVnode) oldVnode(vnode);
};

}, function(modId) { var map = {"./vnodesForComponent":1649338160467,"../constants":1649338160464}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160467, function(require, module, exports) {
// all vnodes referencing a given constructor
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var vnodesForComponent = exports.vnodesForComponent = new WeakMap();
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var mappedVNodes = exports.mappedVNodes = new WeakMap();

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160468, function(require, module, exports) {
var __TEMP__ = require('preact');var options = __TEMP__['options'];
var __TEMP__ = require('./vnodesForComponent');var vnodesForComponent = __TEMP__['vnodesForComponent'];

const oldUnmount = options.unmount;
options.unmount = vnode => {
  const type = (vnode || {}).type;
  if (typeof type === 'function' && vnodesForComponent.has(type)) {
    const vnodes = vnodesForComponent.get(type);
    if (vnodes) {
      const index = vnodes.indexOf(vnode);
      if (index !== -1) {
        vnodes.splice(index, 1);
      }
    }
  }

  if (oldUnmount) oldUnmount(vnode);
};

}, function(modId) { var map = {"./vnodesForComponent":1649338160467}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160469, function(require, module, exports) {
var __TEMP__ = require('./runtime/signaturesForType');var signaturesForType = __TEMP__['signaturesForType'];

/**
 *
 * This part has been vendored from "react-refresh"
 * https://github.com/facebook/react/blob/master/packages/react-refresh/src/ReactFreshRuntime.js#L83
 */
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var computeKey = exports.computeKey = signature => {
  let fullKey = signature.key;
  let hooks;

  try {
    hooks = signature.getCustomHooks();
  } catch (err) {
    signature.forceReset = true;
    return fullKey;
  }

  for (let i = 0; i < hooks.length; i++) {
    const hook = hooks[i];
    if (typeof hook !== 'function') {
      signature.forceReset = true;
      return fullKey;
    }

    const nestedHookSignature = signaturesForType.get(hook);
    if (nestedHookSignature === undefined) continue;

    const nestedHookKey = computeKey(nestedHookSignature);
    if (nestedHookSignature.forceReset) signature.forceReset = true;

    fullKey += '\n---\n' + nestedHookKey;
  }

  return fullKey;
};

}, function(modId) { var map = {"./runtime/signaturesForType":1649338160470}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160470, function(require, module, exports) {
// Signatures for functional components and custom hooks.
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var signaturesForType = exports.signaturesForType = new WeakMap();

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1649338160462);
})()
//miniprogram-npm-outsideDeps=["preact"]
//# sourceMappingURL=index.js.map