module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1649338160472, function(require, module, exports) {
const webpack = require('webpack');
const path = require('path');
const { createRefreshTemplate } = require('./utils/createTemplate');
const { injectEntry } = require('./utils/injectEntry');
const {
  prefreshUtils,
  NAME,
  matcherOptions,
  nextMatcherOptions,
  injectRefreshFunctions,
} = require('./utils/constants');

class ReloadPlugin {
  constructor(options) {
    this.matcher = webpack.ModuleFilenameHelpers.matchObject.bind(
      undefined,
      options && options.runsInNextJs ? nextMatcherOptions : matcherOptions
    );

    this.options = {
      overlay: options && options.overlay,
      runsInNextJs: Boolean(options && options.runsInNextJs),
    };
  }

  webpack4(compiler) {
    compiler.hooks.normalModuleFactory.tap(NAME, nmf => {
      nmf.hooks.afterResolve.tap(NAME, data => {
        if (
          this.matcher(data.resource) &&
          !data.resource.includes('@prefresh') &&
          !data.resource.includes(path.join(__dirname, './loader')) &&
          !data.resource.includes(path.join(__dirname, './utils'))
        ) {
          data.loaders.unshift({
            loader: require.resolve('./loader'),
            options: undefined,
          });
        }

        return data;
      });
    });

    compiler.hooks.compilation.tap(NAME, compilation => {
      injectRefreshFunctions(compilation);
      compilation.mainTemplate.hooks.require.tap(NAME, (source, chunk, hash) =>
        createRefreshTemplate(
          source,
          chunk,
          hash,
          compilation.mainTemplate,
          this.options
        )
      );
    });
  }

  webpack5(compiler, RuntimeGlobals) {
    const createPrefreshRuntimeModule = require('./utils/Runtime');
    const PrefreshRuntimeModule = createPrefreshRuntimeModule(
      compiler.webpack ? compiler.webpack : webpack
    );

    compiler.hooks.compilation.tap(
      NAME,
      (compilation, { normalModuleFactory }) => {
        if (compilation.compiler !== compiler) {
          return;
        }

        injectRefreshFunctions(compilation);

        compilation.hooks.additionalTreeRuntimeRequirements.tap(
          NAME,
          (chunk, runtimeRequirements) => {
            runtimeRequirements.add(RuntimeGlobals.interceptModuleExecution);
            compilation.addRuntimeModule(chunk, new PrefreshRuntimeModule());
          }
        );

        normalModuleFactory.hooks.afterResolve.tap(
          NAME,
          ({ createData: data }) => {
            if (
              this.matcher(data.resource) &&
              !data.resource.includes('@prefresh') &&
              !data.resource.includes(path.join(__dirname, './loader')) &&
              !data.resource.includes(path.join(__dirname, './utils'))
            ) {
              data.loaders.unshift({
                loader: require.resolve('./loader'),
                options: undefined,
              });
            }
          }
        );
      }
    );
  }

  apply(compiler) {
    if (
      process.env.NODE_ENV === 'production' ||
      compiler.options.mode === 'production'
    )
      return;

    const internalWebpackVersion = Number(
      compiler.webpack ? compiler.webpack.version[0] : 4
    );
    const externalWebpackVersion = Number(webpack.version[0]);

    if (!externalWebpackVersion) {
      throw new Error(
        `Missing webpack Dependency, try installing webpack@${
          compiler.webpack ? compiler.webpack.version : 4
        } locally.`
      );
    }

    if (internalWebpackVersion !== externalWebpackVersion) {
      throw new Error(`
        Next is using webpack-version ${internalWebpackVersion} and you have ${externalWebpackVersion} installed.

        Try installing ${
          compiler.webpack ? compiler.webpack.version : 4
        } locally.
        Or if you want to try webpack 5 you can turn this on with { future: { webpack5:true } } in you next.config.js.
      `);
    }

    let provide = {
      [prefreshUtils]: require.resolve('./utils/prefresh'),
    };

    if (this.options.overlay) {
      provide.__prefresh_errors__ = require.resolve(
        this.options.overlay.module
      );
    }

    const providePlugin = new webpack.ProvidePlugin(provide);
    providePlugin.apply(compiler);

    switch (Number(webpack.version[0])) {
      case 4: {
        compiler.options.entry = injectEntry(compiler.options.entry);
        this.webpack4(compiler);
        break;
      }
      case 5: {
        const dependency = webpack.EntryPlugin.createDependency(
          '@prefresh/core',
          { name: '@prefresh/core' }
        );
        compiler.hooks.make.tapAsync(NAME, (compilation, callback) => {
          compilation.addEntry(
            compiler.context,
            dependency,
            undefined,
            callback
          );
        });

        this.webpack5(
          compiler,
          compiler.webpack
            ? compiler.webpack.RuntimeGlobals
            : webpack.RuntimeGlobals
        );
        break;
      }
      default: {
        throw new Error('Unsupported webpack version.');
      }
    }
  }
}

ReloadPlugin.supportsNextJs = true;

module.exports = ReloadPlugin;

}, function(modId) {var map = {"./utils/createTemplate":1649338160473,"./utils/injectEntry":1649338160474,"./utils/constants":1649338160475,"./utils/Runtime":1649338160476}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160473, function(require, module, exports) {
const { Template } = require('webpack');

const NAMESPACE = '__PREFRESH__';

const beforeModule = `
var prevRefreshReg = self.$RefreshReg$;
var prevRefreshSig = self.$RefreshSig$;

self.$RefreshSig$ = function() {
  var status = 'begin';
  var savedType;
  return function(type, key, forceReset, getCustomHooks) {
    if (!savedType) savedType = type;
    status = self.${NAMESPACE}.sign(type || savedType, key, forceReset, getCustomHooks, status);
    return type;
  };
};

self.$RefreshReg$ = function(type, id) {
  self.${NAMESPACE}.register(type, module.id + ' ' + id);
};

try {
`;

const afterModule = `
} finally {
  self.$RefreshReg$ = prevRefreshReg;
  self.$RefreshSig$ = prevRefreshSig;
}
`;

function createRefreshTemplate(source, chunk, hash, mainTemplate, options) {
  let filename = mainTemplate.outputOptions.filename;
  if (typeof filename === 'function') {
    filename = filename({
      chunk,
      hash,
      contentHashType: 'javascript',
      hashWithLength: length =>
        mainTemplate.renderCurrentHashCode(hash, length),
      noChunkHash: mainTemplate.useChunkHash(chunk),
    });
  }

  if (!filename || !filename.includes('.js')) {
    return source;
  }

  const lines = source.split('\n');

  // Webpack generates this line whenever the mainTemplate is called
  const moduleInitializationLineNumber = lines.findIndex(line =>
    options.runsInNextJs
      ? line.includes('modules[moduleId].call(')
      : line.startsWith('modules[moduleId].call')
  );

  if (moduleInitializationLineNumber === -1) {
    return source;
  }

  return Template.asString([
    ...lines.slice(0, moduleInitializationLineNumber),
    beforeModule,
    Template.indent(lines[moduleInitializationLineNumber]),
    afterModule,
    ...lines.slice(moduleInitializationLineNumber + 1, lines.length),
  ]);
}

exports.createRefreshTemplate = createRefreshTemplate;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160474, function(require, module, exports) {
const injectEntry = originalEntry => {
  const entryInjects = [require.resolve('@prefresh/core')];

  if (typeof originalEntry === 'string') {
    return [...entryInjects, originalEntry];
  }

  if (Array.isArray(originalEntry)) {
    return [...entryInjects, ...originalEntry];
  }

  if (typeof originalEntry === 'object') {
    return Object.entries(originalEntry).reduce(
      (acc, [curKey, curEntry]) => ({
        ...acc,
        [curKey]: injectEntry(curEntry),
      }),
      {}
    );
  }

  if (typeof originalEntry === 'function') {
    return (...args) =>
      Promise.resolve(originalEntry(...args)).then(injectEntry);
  }

  throw new Error("Can't detect valid entry point.");
};

exports.injectEntry = injectEntry;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160475, function(require, module, exports) {
const { Template } = require('webpack');

exports.prefreshUtils = '__prefresh_utils__';
exports.NAME = 'PrefreshWebpackPlugin';

exports.matcherOptions = {
  include: /\.([jt]sx?)$/,
  exclude: /node_modules/,
};

exports.nextMatcherOptions = {
  include: /\.([jt]sx?)$/,
  exclude: /node_modules/,
};

exports.injectRefreshFunctions = function (compilation) {
  const hookVars = compilation.mainTemplate.hooks.localVars;

  hookVars.tap('ReactFreshWebpackPlugin', source =>
    Template.asString([
      source,
      '',
      '// noop fns to prevent runtime errors during initialization',
      'if (typeof self !== "undefined") {',
      Template.indent('self.$RefreshReg$ = function () {};'),
      Template.indent('self.$RefreshSig$ = function () {'),
      Template.indent(Template.indent('return function (type) {')),
      Template.indent(Template.indent(Template.indent('return type;'))),
      Template.indent(Template.indent('};')),
      Template.indent('};'),
      '}',
    ])
  );
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160476, function(require, module, exports) {
const NAMESPACE = '__PREFRESH__';

const beforeModule = `
self.$RefreshSig$ = function() {
  var status = 'begin';
  var savedType;

  return function(type, key, forceReset, getCustomHooks) {
    if (!savedType) savedType = type;
    status = self.${NAMESPACE}.sign(type || savedType, key, forceReset, getCustomHooks, status);
    return type;
  }
}
`;

const createPrefreshRuntimeModule = webpack =>
  class PrefreshRuntimeModule extends webpack.RuntimeModule {
    constructor() {
      super('prefresh', 5);
    }

    generate() {
      const { runtimeTemplate } = this.compilation;
      const declare = runtimeTemplate.supportsConst() ? 'const' : 'var';

      return webpack.Template.asString([
        `${
          webpack.RuntimeGlobals.interceptModuleExecution
        }.push(${runtimeTemplate.basicFunction('options', [
          `${declare} originalFactory = options.factory;`,
          `options.factory = ${runtimeTemplate.basicFunction(
            'moduleObject, moduleExports, webpackRequire',
            [
              `${declare} prevRefreshReg = self.$RefreshReg$;`,
              `${declare} prevRefreshSig = self.$RefreshSig$;`,
              beforeModule,
              `${declare} reg = ${runtimeTemplate.basicFunction(
                'currentModuleId',
                [
                  'self.$RefreshReg$ = function(type, id) {',
                  `self.${NAMESPACE}.register(type, currentModuleId + ' ' + id);`,
                  '};',
                ]
              )}`,
              'reg()',
              'try {',
              webpack.Template.indent(
                'originalFactory.call(this, moduleObject, moduleExports, webpackRequire);'
              ),
              '} finally {',
              webpack.Template.indent('self.$RefreshReg$ = prevRefreshReg;'),
              webpack.Template.indent('self.$RefreshSig$ = prevRefreshSig;'),
              '}',
            ]
          )}`,
        ])})`,
        '',
      ]);
    }
  };

module.exports = createPrefreshRuntimeModule;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1649338160472);
})()
//miniprogram-npm-outsideDeps=["webpack","path"]
//# sourceMappingURL=index.js.map