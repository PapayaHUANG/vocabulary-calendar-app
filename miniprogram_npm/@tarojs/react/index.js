module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1649338160482, function(require, module, exports) {


Object.defineProperty(exports, '__esModule', { value: true });

var Reconciler = require('react-reconciler');
var scheduler = require('scheduler');
var runtime = require('@tarojs/runtime');
var shared = require('@tarojs/shared');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

var Reconciler__default = /*#__PURE__*/_interopDefaultLegacy(Reconciler);
var scheduler__namespace = /*#__PURE__*/_interopNamespace(scheduler);

function isEventName(s) {
    return s[0] === 'o' && s[1] === 'n';
}
var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
function updateProps(dom, oldProps, newProps) {
    var i;
    for (i in oldProps) {
        if (!(i in newProps)) {
            setProperty(dom, i, null, oldProps[i]);
        }
    }
    var isFormElement = dom instanceof runtime.FormElement;
    for (i in newProps) {
        if (oldProps[i] !== newProps[i] || (isFormElement && i === 'value')) {
            setProperty(dom, i, newProps[i], oldProps[i]);
        }
    }
}
// function eventProxy (e: CommonEvent) {
//   const el = document.getElementById(e.currentTarget.id)
//   const handlers = el!.__handlers[e.type]
//   handlers[0](e)
// }
function setEvent(dom, name, value, oldValue) {
    var isCapture = name.endsWith('Capture');
    var eventName = name.toLowerCase().slice(2);
    if (isCapture) {
        eventName = eventName.slice(0, -7);
    }
    var compName = shared.capitalize(shared.toCamelCase(dom.tagName.toLowerCase()));
    if (eventName === 'click' && compName in shared.internalComponents) {
        eventName = 'tap';
    }
    if (shared.isFunction(value)) {
        if (!oldValue) {
            dom.addEventListener(eventName, value, isCapture);
        }
        if (eventName === 'regionchange') {
            dom.__handlers.begin[0] = value;
            dom.__handlers.end[0] = value;
        }
        else {
            dom.__handlers[eventName][0] = value;
        }
    }
    else {
        dom.removeEventListener(eventName, oldValue);
    }
}
function setStyle(style, key, value) {
    if (key[0] === '-') {
        style.setProperty(key, value.toString());
    }
    style[key] =
        shared.isNumber(value) && IS_NON_DIMENSIONAL.test(key) === false
            ? value + 'px'
            : value == null
                ? ''
                : value;
}
function setProperty(dom, name, value, oldValue) {
    var _a, _b, _c, _d;
    name = name === 'className' ? 'class' : name;
    if (name === 'key' ||
        name === 'children' ||
        name === 'ref') ;
    else if (name === 'style') {
        var style = dom.style;
        if (shared.isString(value)) {
            style.cssText = value;
        }
        else {
            if (shared.isString(oldValue)) {
                style.cssText = '';
                oldValue = null;
            }
            if (shared.isObject(oldValue)) {
                for (var i in oldValue) {
                    if (!(value && i in value)) {
                        setStyle(style, i, '');
                    }
                }
            }
            if (shared.isObject(value)) {
                for (var i$1 in value) {
                    if (!oldValue || value[i$1] !== oldValue[i$1]) {
                        setStyle(style, i$1, value[i$1]);
                    }
                }
            }
        }
    }
    else if (isEventName(name)) {
        setEvent(dom, name, value, oldValue);
    }
    else if (name === 'dangerouslySetInnerHTML') {
        var newHtml = (_b = (_a = value) === null || _a === void 0 ? void 0 : _a.__html) !== null && _b !== void 0 ? _b : '';
        var oldHtml = (_d = (_c = oldValue) === null || _c === void 0 ? void 0 : _c.__html) !== null && _d !== void 0 ? _d : '';
        if (newHtml || oldHtml) {
            if (oldHtml !== newHtml) {
                dom.innerHTML = newHtml;
            }
        }
    }
    else if (!shared.isFunction(value)) {
        if (value == null) {
            dom.removeAttribute(name);
        }
        else {
            dom.setAttribute(name, value);
        }
    }
}

/* eslint-disable @typescript-eslint/indent */
var now = scheduler__namespace.unstable_now;
function returnFalse() {
    return false;
}
var hostConfig = {
    createInstance: function createInstance(type) {
        return runtime.document.createElement(type);
    },
    createTextInstance: function createTextInstance(text) {
        return runtime.document.createTextNode(text);
    },
    getPublicInstance: function getPublicInstance(inst) {
        return inst;
    },
    getRootHostContext: function getRootHostContext() {
        return {};
    },
    getChildHostContext: function getChildHostContext() {
        return {};
    },
    appendChild: function appendChild(parent, child) {
        parent.appendChild(child);
    },
    appendInitialChild: function appendInitialChild(parent, child) {
        parent.appendChild(child);
    },
    appendChildToContainer: function appendChildToContainer(parent, child) {
        parent.appendChild(child);
    },
    removeChild: function removeChild(parent, child) {
        parent.removeChild(child);
    },
    removeChildFromContainer: function removeChildFromContainer(parent, child) {
        parent.removeChild(child);
    },
    insertBefore: function insertBefore(parent, child, refChild) {
        parent.insertBefore(child, refChild);
    },
    insertInContainerBefore: function insertInContainerBefore(parent, child, refChild) {
        parent.insertBefore(child, refChild);
    },
    commitTextUpdate: function commitTextUpdate(textInst, _, newText) {
        textInst.nodeValue = newText;
    },
    finalizeInitialChildren: function finalizeInitialChildren(dom, _, props) {
        updateProps(dom, {}, props);
        return false;
    },
    prepareUpdate: function prepareUpdate() {
        return shared.EMPTY_ARR;
    },
    commitUpdate: function commitUpdate(dom, _payload, _type, oldProps, newProps) {
        updateProps(dom, oldProps, newProps);
    },
    hideInstance: function hideInstance(instance) {
        var style = instance.style;
        style.setProperty('display', 'none');
    },
    unhideInstance: function unhideInstance(instance, props) {
        var styleProp = props.style;
        var display = (styleProp === null || styleProp === void 0 ? void 0 : styleProp.hasOwnProperty('display')) ? styleProp.display : null;
        display = display == null || shared.isBoolean(display) || display === '' ? '' : ('' + display).trim();
        // eslint-disable-next-line dot-notation
        instance.style['display'] = display;
    },
    clearContainer: function clearContainer(element) {
        if (element.childNodes.length > 0) {
            element.textContent = '';
        }
    },
    queueMicrotask: !shared.isUndefined(Promise)
        ? function (callback) { return Promise.resolve(null)
            .then(callback)
            .catch(function (error) {
            setTimeout(function () {
                throw error;
            });
        }); }
        : setTimeout,
    shouldSetTextContent: returnFalse,
    prepareForCommit: function prepareForCommit() {
    var _ = [], len = arguments.length;
    while ( len-- ) _[ len ] = arguments[ len ];
 return null; },
    resetAfterCommit: shared.noop,
    commitMount: shared.noop,
    now: now,
    cancelTimeout: clearTimeout,
    scheduleTimeout: setTimeout,
    preparePortalMount: shared.noop,
    noTimeout: -1,
    supportsMutation: true,
    supportsPersistence: false,
    isPrimaryRenderer: true,
    supportsHydration: false
};
var TaroReconciler = Reconciler__default['default'](hostConfig);
if (process.env.NODE_ENV !== 'production') {
    var foundDevTools = TaroReconciler.injectIntoDevTools({
        bundleType: 1,
        version: '17.0.2',
        rendererPackageName: 'taro-react'
    });
    if (!foundDevTools) {
        // eslint-disable-next-line no-console
        console.info('%cDownload the React DevTools ' + 'for a better development experience: ' + 'https://reactjs.org/link/react-devtools', 'font-weight:bold');
    }
}

var ContainerMap = new WeakMap();
var Root = function Root(renderer, domContainer) {
    this.renderer = renderer;
    this.internalRoot = renderer.createContainer(domContainer, 0 /** LegacyRoot: react-reconciler/src/ReactRootTags.js */, false, null);
};
Root.prototype.render = function render (children, cb) {
    var ref = this;
        var renderer = ref.renderer;
        var internalRoot = ref.internalRoot;
    renderer.updateContainer(children, internalRoot, null, cb);
    return renderer.getPublicRootInstance(internalRoot);
};
Root.prototype.unmount = function unmount (cb) {
    this.renderer.updateContainer(null, this.internalRoot, null, cb);
};
function render(element, domContainer, cb) {
    var oldRoot = ContainerMap.get(domContainer);
    if (oldRoot != null) {
        return oldRoot.render(element, cb);
    }
    var root = new Root(TaroReconciler, domContainer);
    ContainerMap.set(domContainer, root);
    return root.render(element, cb);
}

/* eslint-disable @typescript-eslint/no-unused-vars */
var unstable_batchedUpdates = TaroReconciler.batchedUpdates;
function unmountComponentAtNode(dom) {
    shared.ensure(dom && [1, 8, 9, 11].includes(dom.nodeType), 'unmountComponentAtNode(...): Target container is not a DOM element.');
    var root = ContainerMap.get(dom);
    if (!root)
        { return false; }
    unstable_batchedUpdates(function () {
        root.unmount(function () {
            ContainerMap.delete(dom);
        });
    }, null);
    return true;
}
function findDOMNode(comp) {
    if (comp == null) {
        return null;
    }
    var nodeType = comp.nodeType;
    if (nodeType === 1 || nodeType === 3) {
        return comp;
    }
    return TaroReconciler.findHostInstance(comp);
}
var portalType = shared.isFunction(Symbol) && Symbol.for
    ? Symbol.for('react.portal')
    : 0xeaca;
function createPortal(children, containerInfo, key) {
    return {
        $$typeof: portalType,
        key: key == null ? null : String(key),
        children: children,
        containerInfo: containerInfo,
        implementation: null
    };
}
var index = {
    render: render,
    unstable_batchedUpdates: unstable_batchedUpdates,
    unmountComponentAtNode: unmountComponentAtNode,
    findDOMNode: findDOMNode,
    createPortal: createPortal
};

exports.createPortal = createPortal;
exports['default'] = index;
exports.findDOMNode = findDOMNode;
exports.render = render;
exports.unmountComponentAtNode = unmountComponentAtNode;
exports.unstable_batchedUpdates = unstable_batchedUpdates;
//# sourceMappingURL=index.js.map

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1649338160482);
})()
//miniprogram-npm-outsideDeps=["react-reconciler","scheduler","@tarojs/runtime","@tarojs/shared"]
//# sourceMappingURL=index.js.map