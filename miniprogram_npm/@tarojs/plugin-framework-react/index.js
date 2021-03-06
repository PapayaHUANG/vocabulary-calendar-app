module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1649338160480, function(require, module, exports) {
module.exports = require('./dist/index.js').default
module.exports.default = module.exports

}, function(modId) {var map = {"./dist/index.js":1649338160481}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160481, function(require, module, exports) {


Object.defineProperty(exports, '__esModule', { value: true });

var acorn = require('acorn');
var walk = require('acorn-walk');

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

var acorn__namespace = /*#__PURE__*/_interopNamespace(acorn);
var walk__namespace = /*#__PURE__*/_interopNamespace(walk);

function addConfig(source) {
    const configsMap = {
        enableShareAppMessage: ['onShareAppMessage', 'useShareAppMessage'],
        enableShareTimeline: ['onShareTimeline', 'useShareTimeline']
    };
    const ast = acorn__namespace.parse(source, {
        ecmaVersion: 'latest',
        sourceType: 'module'
    });
    const additionConfig = {};
    function check(name) {
        Object.keys(configsMap).forEach(configName => {
            const apis = configsMap[configName];
            if (apis.includes(name)) {
                additionConfig[configName] = true;
            }
        });
    }
    walk__namespace.simple(ast, {
        FunctionExpression(node) {
            if (!node.id || !node.id.name)
                return;
            check(node.id.name);
        },
        FunctionDeclaration(node) {
            if (!node.id || !node.id.name)
                return;
            check(node.id.name);
        },
        CallExpression(node) {
            const { callee } = node;
            if (callee.type === 'Identifier') {
                check(callee.name);
            }
            else if (callee.type === 'MemberExpression') {
                if (callee.property.type === 'Identifier') {
                    check(callee.property.name);
                }
                else if (callee.property.type === 'Literal') {
                    check(callee.property.value);
                }
            }
        }
    });
    return additionConfig;
}
const frameworkMeta = {
    nerv: {
        importFrameworkStatement: `
import Nerv from 'nervjs';
`,
        mockAppStatement: `
class App extends Nerv.Component {
  render () {
    return this.props.children
  }
}
`,
        frameworkArgs: 'Nerv, Nerv, config',
        creator: 'createReactApp',
        creatorLocation: '@tarojs/plugin-framework-react/dist/runtime',
        importFrameworkName: 'Nerv',
        modifyConfig(config, source) {
            Object.assign(config, addConfig(source));
        }
    },
    react: {
        importFrameworkStatement: `
import * as React from 'react'
import ReactDOM from 'react-dom'
`,
        mockAppStatement: `
class App extends React.Component {
  render () {
    return this.props.children
  }
}
`,
        frameworkArgs: 'React, ReactDOM, config',
        creator: 'createReactApp',
        creatorLocation: '@tarojs/plugin-framework-react/dist/runtime',
        importFrameworkName: 'React',
        compatComponentImport: 'import { PullDownRefresh } from "@tarojs/components"',
        compatComponentExtra: 'config.PullDownRefresh = PullDownRefresh',
        modifyConfig(config, source) {
            Object.assign(config, addConfig(source));
        }
    }
};
function getLoaderMeta(framework) {
    if (framework === 'preact')
        framework = 'react';
    return frameworkMeta[framework];
}

function modifyMiniWebpackChain(ctx, framework, chain) {
    setAlias$2(ctx, framework, chain);
    setLoader$1(framework, chain);
}
function setAlias$2(ctx, framework, chain) {
    var _a;
    const config = ctx.initialConfig;
    const alias = chain.resolve.alias;
    if (framework === 'react') {
        alias.set('react-dom$', '@tarojs/react');
        if (process.env.NODE_ENV !== 'production' && ((_a = config.mini) === null || _a === void 0 ? void 0 : _a.debugReact) !== true) {
            // ???????????????????????????????????? debugReact??????????????????????????? react ?????????????????????
            alias.set('react-reconciler$', 'react-reconciler/cjs/react-reconciler.production.min.js');
            alias.set('react$', 'react/cjs/react.production.min.js');
            alias.set('scheduler$', 'scheduler/cjs/scheduler.production.min.js');
            alias.set('react/jsx-runtime$', 'react/cjs/react-jsx-runtime.production.min.js');
        }
    }
}
function setLoader$1(framework, chain) {
    chain.plugin('miniPlugin')
        .tap(args => {
        args[0].loaderMeta = getLoaderMeta(framework);
        return args;
    });
}

function modifyH5WebpackChain(ctx, framework, chain) {
    setAlias$1(ctx, chain);
    setLoader(framework, chain);
    setPlugin(ctx, framework, chain);
    chain.merge({
        module: {
            rule: {
                'process-import-taro': {
                    test: /taro-h5[\\/]dist[\\/]index/,
                    loader: require.resolve('./api-loader')
                }
            }
        }
    });
}
function setAlias$1(ctx, chain) {
    var _a;
    const config = ctx.initialConfig;
    const alias = chain.resolve.alias;
    if ((_a = config.h5) === null || _a === void 0 ? void 0 : _a.useHtmlComponents) {
        alias.set('@tarojs/components$', '@tarojs/components-react/index');
    }
    else {
        alias.set('@tarojs/components$', '@tarojs/components/dist-h5/react');
    }
}
function setLoader(framework, chain) {
    chain.plugin('mainPlugin')
        .tap(args => {
        args[0].loaderMeta = getLoaderMeta(framework);
        return args;
    });
}
function setPlugin(ctx, framework, chain) {
    var _a, _b;
    const config = ctx.initialConfig;
    if (process.env.NODE_ENV !== 'production' &&
        ((_b = (_a = config.h5) === null || _a === void 0 ? void 0 : _a.devServer) === null || _b === void 0 ? void 0 : _b.hot) !== false) {
        // ???????????? fast-refresh
        if (framework === 'react') {
            chain
                .plugin('fastRefreshPlugin')
                .use(require('@pmmmwh/react-refresh-webpack-plugin'));
        }
        else if (framework === 'preact') {
            chain
                .plugin('fastRefreshPlugin')
                .use(require('@prefresh/webpack'));
        }
    }
}

var index = (ctx) => {
    const { framework } = ctx.initialConfig;
    if (framework !== 'react' && framework !== 'nerv' && framework !== 'preact')
        return;
    ctx.modifyWebpackChain(({ chain }) => {
        // ??????
        setAlias(framework, chain);
        chain
            .plugin('definePlugin')
            .tap(args => {
            const config = args[0];
            config.__TARO_FRAMEWORK__ = `"${framework}"`;
            return args;
        });
        if (process.env.TARO_ENV === 'h5') {
            // H5
            modifyH5WebpackChain(ctx, framework, chain);
        }
        else {
            // ?????????
            modifyMiniWebpackChain(ctx, framework, chain);
        }
    });
};
function setAlias(framework, chain) {
    const alias = chain.resolve.alias;
    switch (framework) {
        case 'preact':
            alias.set('react', 'preact/compat');
            alias.set('react-dom/test-utils', 'preact/test-utils');
            alias.set('react-dom', 'preact/compat');
            alias.set('react/jsx-runtime', 'preact/jsx-runtime');
            break;
        case 'nerv':
            alias.set('react$', 'nervjs');
            alias.set('react-dom$', 'nervjs');
            break;
    }
}

exports['default'] = index;
//# sourceMappingURL=index.js.map

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1649338160480);
})()
//miniprogram-npm-outsideDeps=["acorn","acorn-walk","@pmmmwh/react-refresh-webpack-plugin","@prefresh/webpack"]
//# sourceMappingURL=index.js.map