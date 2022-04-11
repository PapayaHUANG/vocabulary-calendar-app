module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1649338160450, function(require, module, exports) {
const validateOptions = require('schema-utils');
const { DefinePlugin, ModuleFilenameHelpers, ProvidePlugin, Template } = require('webpack');
const ConstDependency = require('webpack/lib/dependencies/ConstDependency');
const { refreshGlobal, webpackRequire, webpackVersion } = require('./globals');
const {
  createError,
  getParserHelpers,
  getRefreshGlobal,
  getSocketIntegration,
  injectRefreshEntry,
  injectRefreshLoader,
  normalizeOptions,
} = require('./utils');
const schema = require('./options.json');

// Mapping of react-refresh globals to Webpack runtime globals
const REPLACEMENTS = {
  $RefreshRuntime$: {
    expr: `${refreshGlobal}.runtime`,
    req: [webpackRequire, `${refreshGlobal}.runtime`],
    type: 'object',
  },
  $RefreshSetup$: {
    expr: `${refreshGlobal}.setup`,
    req: [webpackRequire, `${refreshGlobal}.setup`],
    type: 'function',
  },
  $RefreshCleanup$: {
    expr: `${refreshGlobal}.cleanup`,
    req: [webpackRequire, `${refreshGlobal}.cleanup`],
    type: 'function',
  },
  $RefreshReg$: {
    expr: `${refreshGlobal}.register`,
    req: [webpackRequire, `${refreshGlobal}.register`],
    type: 'function',
  },
  $RefreshSig$: {
    expr: `${refreshGlobal}.signature`,
    req: [webpackRequire, `${refreshGlobal}.signature`],
    type: 'function',
  },
};

class ReactRefreshPlugin {
  /**
   * @param {import('./types').ReactRefreshPluginOptions} [options] Options for react-refresh-plugin.
   */
  constructor(options = {}) {
    validateOptions(schema, options, {
      name: 'React Refresh Plugin',
      baseDataPath: 'options',
    });

    /**
     * @readonly
     * @type {import('./types').NormalizedPluginOptions}
     */
    this.options = normalizeOptions(options);
  }

  /**
   * Applies the plugin.
   * @param {import('webpack').Compiler} compiler A webpack compiler object.
   * @returns {void}
   */
  apply(compiler) {
    // Throw if we encounter an unsupported Webpack version,
    // since things will most likely not work.
    if (webpackVersion !== 4 && webpackVersion !== 5) {
      throw createError(`Webpack v${webpackVersion} is not supported!`);
    }

    // Skip processing in non-development mode, but allow manual force-enabling
    if (
      // Webpack do not set process.env.NODE_ENV, so we need to check for mode.
      // Ref: https://github.com/webpack/webpack/issues/7074
      (compiler.options.mode !== 'development' ||
        // We also check for production process.env.NODE_ENV,
        // in case it was set and mode is non-development (e.g. 'none')
        (process.env.NODE_ENV && process.env.NODE_ENV === 'production')) &&
      !this.options.forceEnable
    ) {
      return;
    }

    // Inject react-refresh context to all Webpack entry points
    compiler.options.entry = injectRefreshEntry(compiler.options.entry, this.options);

    // Inject necessary modules to bundle's global scope
    /** @type {Record<string, string>} */
    let providedModules = {
      __react_refresh_utils__: require.resolve('./runtime/RefreshUtils'),
    };

    if (this.options.overlay === false) {
      // Stub errorOverlay module so calls to it can be erased
      const definePlugin = new DefinePlugin({
        __react_refresh_error_overlay__: false,
        __react_refresh_init_socket__: false,
      });
      definePlugin.apply(compiler);
    } else {
      providedModules = {
        ...providedModules,
        ...(this.options.overlay.module && {
          __react_refresh_error_overlay__: require.resolve(this.options.overlay.module),
        }),
        ...(this.options.overlay.sockIntegration && {
          __react_refresh_init_socket__: getSocketIntegration(this.options.overlay.sockIntegration),
        }),
      };
    }

    const providePlugin = new ProvidePlugin(providedModules);
    providePlugin.apply(compiler);

    const matchObject = ModuleFilenameHelpers.matchObject.bind(undefined, this.options);
    const { evaluateToString, toConstantDependency } = getParserHelpers();
    compiler.hooks.compilation.tap(
      this.constructor.name,
      (compilation, { normalModuleFactory }) => {
        // Only hook into the current compiler
        if (compilation.compiler !== compiler) {
          return;
        }

        // Set template for ConstDependency which is used by parser hooks
        compilation.dependencyTemplates.set(ConstDependency, new ConstDependency.Template());

        // Tap into version-specific compilation hooks
        switch (webpackVersion) {
          case 4: {
            const outputOptions = compilation.mainTemplate.outputOptions;
            compilation.mainTemplate.hooks.require.tap(
              this.constructor.name,
              // Constructs the module template for react-refresh
              (source, chunk, hash) => {
                // Check for the output filename
                // This is to ensure we are processing a JS-related chunk
                let filename = outputOptions.filename;
                if (typeof filename === 'function') {
                  // Only usage of the `chunk` property is documented by Webpack.
                  // However, some internal Webpack plugins uses other properties,
                  // so we also pass them through to be on the safe side.
                  filename = filename({
                    contentHashType: 'javascript',
                    chunk,
                    hash,
                  });
                }

                // Check whether the current compilation is outputting to JS,
                // since other plugins can trigger compilations for other file types too.
                // If we apply the transform to them, their compilation will break fatally.
                // One prominent example of this is the HTMLWebpackPlugin.
                // If filename is falsy, something is terribly wrong and there's nothing we can do.
                if (!filename || !filename.includes('.js')) {
                  return source;
                }

                // Split template source code into lines for easier processing
                const lines = source.split('\n');
                // Webpack generates this line when the MainTemplate is called
                const moduleInitializationLineNumber = lines.findIndex((line) =>
                  line.includes('modules[moduleId].call(')
                );
                // Unable to find call to module execution -
                // this happens if the current module does not call MainTemplate.
                // In this case, we will return the original source and won't mess with it.
                if (moduleInitializationLineNumber === -1) {
                  return source;
                }

                const moduleInterceptor = Template.asString([
                  `${refreshGlobal}.init();`,
                  'try {',
                  Template.indent(lines[moduleInitializationLineNumber]),
                  '} finally {',
                  Template.indent(`${refreshGlobal}.cleanup(moduleId);`),
                  '}',
                ]);

                return Template.asString([
                  ...lines.slice(0, moduleInitializationLineNumber),
                  '',
                  outputOptions.strictModuleExceptionHandling
                    ? Template.indent(moduleInterceptor)
                    : moduleInterceptor,
                  '',
                  ...lines.slice(moduleInitializationLineNumber + 1, lines.length),
                ]);
              }
            );

            compilation.mainTemplate.hooks.requireExtensions.tap(
              this.constructor.name,
              // Setup react-refresh globals as extensions to Webpack's require function
              (source) => {
                return Template.asString([source, '', getRefreshGlobal()]);
              }
            );

            normalModuleFactory.hooks.afterResolve.tap(
              this.constructor.name,
              // Add react-refresh loader to process files that matches specified criteria
              (data) => {
                return injectRefreshLoader(data, matchObject);
              }
            );

            compilation.hooks.normalModuleLoader.tap(
              // `Infinity` ensures this check will run only after all other taps
              { name: this.constructor.name, stage: Infinity },
              // Check for existence of the HMR runtime -
              // it is the foundation to this plugin working correctly
              (context) => {
                if (!context.hot) {
                  throw createError(
                    [
                      'Hot Module Replacement (HMR) is not enabled!',
                      'React Refresh requires HMR to function properly.',
                    ].join(' ')
                  );
                }
              }
            );

            break;
          }
          case 5: {
            const NormalModule = require('webpack/lib/NormalModule');
            const RuntimeGlobals = require('webpack/lib/RuntimeGlobals');
            const ReactRefreshRuntimeModule = require('./runtime/RefreshRuntimeModule');

            compilation.hooks.additionalTreeRuntimeRequirements.tap(
              this.constructor.name,
              // Setup react-refresh globals with a Webpack runtime module
              (chunk, runtimeRequirements) => {
                runtimeRequirements.add(RuntimeGlobals.interceptModuleExecution);
                compilation.addRuntimeModule(chunk, new ReactRefreshRuntimeModule());
              }
            );

            normalModuleFactory.hooks.afterResolve.tap(
              this.constructor.name,
              // Add react-refresh loader to process files that matches specified criteria
              (resolveData) => {
                injectRefreshLoader(resolveData.createData, matchObject);
              }
            );

            NormalModule.getCompilationHooks(compilation).loader.tap(
              // `Infinity` ensures this check will run only after all other taps
              { name: this.constructor.name, stage: Infinity },
              // Check for existence of the HMR runtime -
              // it is the foundation to this plugin working correctly
              (context) => {
                if (!context.hot) {
                  throw createError(
                    [
                      'Hot Module Replacement (HMR) is not enabled!',
                      'React Refresh requires HMR to function properly.',
                    ].join(' ')
                  );
                }
              }
            );

            break;
          }
          default: {
            throw createError(`Encountered unexpected Webpack version (v${webpackVersion})`);
          }
        }

        /**
         * Transform global calls into Webpack runtime calls.
         * @param {*} parser
         * @returns {void}
         */
        const parserHandler = (parser) => {
          Object.entries(REPLACEMENTS).forEach(([key, info]) => {
            parser.hooks.expression
              .for(key)
              .tap(this.constructor.name, toConstantDependency(parser, info.expr, info.req));

            if (info.type) {
              parser.hooks.evaluateTypeof
                .for(key)
                .tap(this.constructor.name, evaluateToString(info.type));
            }
          });
        };

        normalModuleFactory.hooks.parser
          .for('javascript/auto')
          .tap(this.constructor.name, parserHandler);
        normalModuleFactory.hooks.parser
          .for('javascript/dynamic')
          .tap(this.constructor.name, parserHandler);
        normalModuleFactory.hooks.parser
          .for('javascript/esm')
          .tap(this.constructor.name, parserHandler);
      }
    );
  }
}

module.exports.ReactRefreshPlugin = ReactRefreshPlugin;
module.exports = ReactRefreshPlugin;

}, function(modId) {var map = {"./globals":1649338160451,"./utils":1649338160452,"./options.json":1649338160460,"./runtime/RefreshRuntimeModule":1649338160461}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160451, function(require, module, exports) {
const { version } = require('webpack');

// Parse Webpack's major version: x.y.z => x
const webpackVersion = parseInt(version || '', 10);

let webpackGlobals = {};
if (webpackVersion === 5) {
  webpackGlobals = require('webpack/lib/RuntimeGlobals');
}

module.exports.webpackVersion = webpackVersion;
module.exports.webpackRequire = webpackGlobals.require || '__webpack_require__';
module.exports.refreshGlobal = `${module.exports.webpackRequire}.$Refresh$`;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160452, function(require, module, exports) {
const createError = require('./createError');
const getParserHelpers = require('./getParserHelpers');
const getRefreshGlobal = require('./getRefreshGlobal');
const getSocketIntegration = require('./getSocketIntegration');
const injectRefreshEntry = require('./injectRefreshEntry');
const injectRefreshLoader = require('./injectRefreshLoader');
const normalizeOptions = require('./normalizeOptions');

module.exports = {
  createError,
  getParserHelpers,
  getRefreshGlobal,
  getSocketIntegration,
  injectRefreshEntry,
  injectRefreshLoader,
  normalizeOptions,
};

}, function(modId) { var map = {"./createError":1649338160453,"./getParserHelpers":1649338160454,"./getRefreshGlobal":1649338160455,"./getSocketIntegration":1649338160456,"./injectRefreshEntry":1649338160457,"./injectRefreshLoader":1649338160458,"./normalizeOptions":1649338160459}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160453, function(require, module, exports) {
/**
 * Creates an error with the plugin's prefix.
 * @param {string} message The error's message.
 * @returns {Error} The created error object.
 */
function createError(message) {
  return new Error(`[React Refresh] ${message}`);
}

module.exports = createError;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160454, function(require, module, exports) {
const { webpackVersion } = require('../globals');

/**
 * @callback EvaluateToString
 * @param {string} value
 * @returns {function(*): *}
 */

/**
 * @callback ToConstantDependency
 * @param {*} parser
 * @param {string} value
 * @param {string[]} [runtimeRequirements]
 * @returns {function(*): boolean}
 */

/**
 * @typedef {Object} ParserHelpers
 * @property {EvaluateToString} evaluateToString
 * @property {ToConstantDependency} toConstantDependency
 */

/**
 * Gets parser helpers for specific webpack versions.
 * @returns {ParserHelpers} The needed parser helpers.
 */
function getParserHelpers() {
  if (webpackVersion === 4) {
    const {
      evaluateToString,
      toConstantDependencyWithWebpackRequire,
    } = require('webpack/lib/ParserHelpers');
    return {
      evaluateToString,
      toConstantDependency: toConstantDependencyWithWebpackRequire,
    };
  }

  if (webpackVersion === 5) {
    return require('webpack/lib/javascript/JavascriptParserHelpers');
  }
}

module.exports = getParserHelpers;

}, function(modId) { var map = {"../globals":1649338160451}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160455, function(require, module, exports) {
const Template = require('webpack/lib/Template');
const { refreshGlobal } = require('../globals');

/**
 * @typedef {Object} RuntimeTemplate
 * @property {function(string, string[]): string} basicFunction
 * @property {function(): boolean} supportsConst
 * @property {function(string, string=): string} returningFunction
 */

/** @type {RuntimeTemplate} */
const FALLBACK_RUNTIME_TEMPLATE = {
  basicFunction(args, body) {
    return `function(${args}) {\n${Template.indent(body)}\n}`;
  },
  supportsConst() {
    return false;
  },
  returningFunction(returnValue, args = '') {
    return `function(${args}) { return ${returnValue}; }`;
  },
};

/**
 * Generates the refresh global runtime template.
 * @param {RuntimeTemplate} [runtimeTemplate] The runtime template helpers.
 * @returns {string} The refresh global runtime template.
 */
function getRefreshGlobal(runtimeTemplate = FALLBACK_RUNTIME_TEMPLATE) {
  const declaration = runtimeTemplate.supportsConst() ? 'const' : 'var';
  return Template.asString([
    `${refreshGlobal} = {`,
    Template.indent([
      `init: ${runtimeTemplate.basicFunction('', [
        `${refreshGlobal}.cleanup = ${runtimeTemplate.returningFunction('undefined')};`,
        `${refreshGlobal}.register = ${runtimeTemplate.returningFunction('undefined')};`,
        `${refreshGlobal}.runtime = {};`,
        `${refreshGlobal}.signature = ${runtimeTemplate.returningFunction(
          runtimeTemplate.returningFunction('type', 'type')
        )};`,
      ])},`,
      `setup: ${runtimeTemplate.basicFunction('currentModuleId', [
        `${declaration} prevCleanup = ${refreshGlobal}.cleanup;`,
        `${declaration} prevReg = ${refreshGlobal}.register;`,
        `${declaration} prevSig = ${refreshGlobal}.signature;`,
        '',
        `${refreshGlobal}.register = ${runtimeTemplate.basicFunction('type, id', [
          `${declaration} typeId = currentModuleId + " " + id;`,
          `${refreshGlobal}.runtime.register(type, typeId);`,
        ])}`,
        '',
        `${refreshGlobal}.signature = ${refreshGlobal}.runtime.createSignatureFunctionForTransform;`,
        '',
        `${refreshGlobal}.cleanup = ${runtimeTemplate.basicFunction('cleanupModuleId', [
          'if (currentModuleId === cleanupModuleId) {',
          Template.indent([
            `${refreshGlobal}.register = prevReg;`,
            `${refreshGlobal}.signature = prevSig;`,
            `${refreshGlobal}.cleanup = prevCleanup;`,
          ]),
          '}',
        ])}`,
      ])},`,
    ]),
    '};',
  ]);
}

module.exports = getRefreshGlobal;

}, function(modId) { var map = {"../globals":1649338160451}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160456, function(require, module, exports) {
/**
 * Gets the socket integration to use for Webpack messages.
 * @param {'wds' | 'whm' | 'wps' | string} integrationType A valid socket integration type or a path to a module.
 * @returns {string} Path to the resolved socket integration module.
 */
function getSocketIntegration(integrationType) {
  let resolvedSocketIntegration;
  switch (integrationType) {
    case 'wds': {
      resolvedSocketIntegration = require.resolve('../../sockets/WDSSocket');
      break;
    }
    case 'whm': {
      resolvedSocketIntegration = require.resolve('../../sockets/WHMEventSource');
      break;
    }
    case 'wps': {
      resolvedSocketIntegration = require.resolve('../../sockets/WPSSocket');
      break;
    }
    default: {
      resolvedSocketIntegration = require.resolve(integrationType);
      break;
    }
  }

  return resolvedSocketIntegration;
}

module.exports = getSocketIntegration;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160457, function(require, module, exports) {
const querystring = require('querystring');
const createError = require('./createError');

/** @typedef {string | string[] | import('webpack').Entry} StaticEntry */
/** @typedef {StaticEntry | import('webpack').EntryFunc} WebpackEntry */

/**
 * Checks if a Webpack entry string is related to socket integrations.
 * @param {string} entry A Webpack entry string.
 * @returns {boolean} Whether the entry is related to socket integrations.
 */
function isSocketEntry(entry) {
  /**
   * Webpack entries related to socket integrations.
   * They have to run before any code that sets up the error overlay.
   * @type {string[]}
   */
  const socketEntries = [
    'webpack-dev-server/client',
    'webpack-hot-middleware/client',
    'webpack-plugin-serve/client',
    'react-dev-utils/webpackHotDevClient',
  ];

  return socketEntries.some((socketEntry) => entry.includes(socketEntry));
}

/**
 * Injects an entry to the bundle for react-refresh.
 * @param {WebpackEntry} [originalEntry] A Webpack entry object.
 * @param {import('../types').NormalizedPluginOptions} options Configuration options for this plugin.
 * @returns {WebpackEntry} An injected entry object.
 */
function injectRefreshEntry(originalEntry, options) {
  /** @type {Record<string, *>} */
  let resourceQuery = {};
  if (options.overlay) {
    options.overlay.sockHost && (resourceQuery.sockHost = options.overlay.sockHost);
    options.overlay.sockPath && (resourceQuery.sockPath = options.overlay.sockPath);
    options.overlay.sockPort && (resourceQuery.sockPort = options.overlay.sockPort);
  }

  // We don't need to URI encode the resourceQuery as it will be parsed by Webpack
  const queryString = querystring.stringify(resourceQuery, undefined, undefined, {
    /**
     * @param {string} string
     * @returns {string}
     */
    encodeURIComponent(string) {
      return string;
    },
  });

  const prependEntries = [
    // React-refresh runtime
    require.resolve('../../client/ReactRefreshEntry'),
  ];

  const overlayEntries = [
    // Legacy WDS SockJS integration
    options.overlay &&
      options.overlay.useLegacyWDSSockets &&
      require.resolve('../../client/LegacyWDSSocketEntry'),
    // Error overlay runtime
    options.overlay &&
      options.overlay.entry &&
      options.overlay.entry + (queryString && `?${queryString}`),
  ].filter(Boolean);

  // Single string entry point
  if (typeof originalEntry === 'string') {
    if (isSocketEntry(originalEntry)) {
      return [...prependEntries, originalEntry, ...overlayEntries];
    }

    return [...prependEntries, ...overlayEntries, originalEntry];
  }
  // Single array entry point
  if (Array.isArray(originalEntry)) {
    const socketEntryIndex = originalEntry.findIndex(isSocketEntry);

    let socketAndPrecedingEntries = [];
    if (socketEntryIndex !== -1) {
      socketAndPrecedingEntries = originalEntry.splice(0, socketEntryIndex + 1);
    }

    return [...prependEntries, ...socketAndPrecedingEntries, ...overlayEntries, ...originalEntry];
  }
  // Multiple entry points
  if (typeof originalEntry === 'object') {
    return Object.entries(originalEntry).reduce(
      (acc, [curKey, curEntry]) => ({
        ...acc,
        [curKey]:
          typeof curEntry === 'object' && curEntry.import
            ? {
                ...curEntry,
                import: injectRefreshEntry(curEntry.import, options),
              }
            : injectRefreshEntry(curEntry, options),
      }),
      {}
    );
  }
  // Dynamic entry points
  if (typeof originalEntry === 'function') {
    return (...args) =>
      Promise.resolve(originalEntry(...args)).then((resolvedEntry) =>
        injectRefreshEntry(resolvedEntry, options)
      );
  }

  throw createError('Failed to parse the Webpack `entry` object!');
}

module.exports = injectRefreshEntry;

}, function(modId) { var map = {"./createError":1649338160453}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160458, function(require, module, exports) {
const path = require('path');

/**
 * @callback MatchObject
 * @param {string} [str]
 * @returns {boolean}
 */

const resolvedLoader = require.resolve('../../loader');

/**
 * Injects refresh loader to all JavaScript-like and user-specified files.
 * @param {*} data Module factory creation data.
 * @param {MatchObject} matchObject A function to include/exclude files to be processed.
 * @returns {*} The injected module factory creation data.
 */
function injectRefreshLoader(data, matchObject) {
  if (
    // Include and exclude user-specified files
    matchObject(data.resource) &&
    // Skip plugin's runtime utils to prevent self-referencing -
    // this is useful when using the plugin as a direct dependency.
    !data.resource.includes(path.join(__dirname, '../runtime/RefreshUtils')) &&
    // Check to prevent double injection
    !data.loaders.find(({ loader }) => loader === resolvedLoader)
  ) {
    // As we inject runtime code for each module,
    // it is important to run the injected loader after everything.
    // This way we can ensure that all code-processing have been done,
    // and we won't risk breaking tools like Flow or ESLint.
    data.loaders.unshift({
      loader: resolvedLoader,
      options: undefined,
    });
  }

  return data;
}

module.exports = injectRefreshLoader;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160459, function(require, module, exports) {
/**
 * Sets a constant default value for the property when it is undefined.
 * @template T
 * @template {keyof T} Property
 * @param {T} object An object.
 * @param {Property} property A property of the provided object.
 * @param {T[Property]} defaultValue The default value to set for the property.
 * @returns {T[Property]} The defaulted property value.
 */
const d = (object, property, defaultValue) => {
  if (typeof object[property] === 'undefined' && typeof defaultValue !== 'undefined') {
    object[property] = defaultValue;
  }
  return object[property];
};

/**
 * Resolves the value for a nested object option.
 * @template T
 * @template {keyof T} Property
 * @template Result
 * @param {T} object An object.
 * @param {Property} property A property of the provided object.
 * @param {function(T | undefined): Result} fn The handler to resolve the property's value.
 * @returns {Result} The resolved option value.
 */
const nestedOption = (object, property, fn) => {
  object[property] = fn(object[property]);
  return object[property];
};

/**
 * Normalizes the options for the plugin.
 * @param {import('../types').ReactRefreshPluginOptions} options Non-normalized plugin options.
 * @returns {import('../types').NormalizedPluginOptions} Normalized plugin options.
 */
const normalizeOptions = (options) => {
  // Show deprecation notice for the `disableRefreshCheck` option and remove it
  if (typeof options.disableRefreshCheck !== 'undefined') {
    delete options.disableRefreshCheck;
    console.warn(
      [
        'The "disableRefreshCheck" option has been deprecated and will not have any effect on how the plugin parses files.',
        'Please remove it from your configuration.',
      ].join(' ')
    );
  }

  d(options, 'exclude', /node_modules/i);
  d(options, 'include', /\.([jt]sx?|flow)$/i);
  d(options, 'forceEnable');

  nestedOption(options, 'overlay', (overlay) => {
    /** @type {import('../types').NormalizedErrorOverlayOptions} */
    const defaults = {
      entry: require.resolve('../../client/ErrorOverlayEntry'),
      module: require.resolve('../../overlay'),
      sockIntegration: 'wds',
    };

    if (overlay === false) {
      return false;
    }
    if (typeof overlay === 'undefined' || overlay === true) {
      return defaults;
    }

    d(overlay, 'entry', defaults.entry);
    d(overlay, 'module', defaults.module);
    d(overlay, 'sockIntegration', defaults.sockIntegration);
    d(overlay, 'sockHost');
    d(overlay, 'sockPath');
    d(overlay, 'sockPort');
    d(options, 'useLegacyWDSSockets');

    return overlay;
  });

  return options;
};

module.exports = normalizeOptions;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160460, function(require, module, exports) {
module.exports = {
  "additionalProperties": false,
  "type": "object",
  "definitions": {
    "MatchCondition": {
      "anyOf": [{ "instanceof": "RegExp" }, { "$ref": "#/definitions/Path" }]
    },
    "MatchConditions": {
      "type": "array",
      "items": { "$ref": "#/definitions/MatchCondition" },
      "minItems": 1
    },
    "OverlayOptions": {
      "additionalProperties": false,
      "type": "object",
      "properties": {
        "entry": {
          "anyOf": [{ "const": false }, { "$ref": "#/definitions/Path" }]
        },
        "module": {
          "anyOf": [{ "const": false }, { "$ref": "#/definitions/Path" }]
        },
        "sockIntegration": {
          "anyOf": [
            { "const": false },
            { "enum": ["wds", "whm", "wps"] },
            { "$ref": "#/definitions/Path" }
          ]
        },
        "sockHost": { "type": "string" },
        "sockPath": { "type": "string" },
        "sockPort": { "type": "number", "minimum": 0 },
        "useLegacyWDSSockets": { "type": "boolean" }
      }
    },
    "Path": { "type": "string", "absolutePath": true }
  },
  "properties": {
    "exclude": {
      "anyOf": [
        { "$ref": "#/definitions/MatchCondition" },
        { "$ref": "#/definitions/MatchConditions" }
      ]
    },
    "forceEnable": { "type": "boolean" },
    "include": {
      "anyOf": [
        { "$ref": "#/definitions/MatchCondition" },
        { "$ref": "#/definitions/MatchConditions" }
      ]
    },
    "overlay": {
      "anyOf": [{ "type": "boolean" }, { "$ref": "#/definitions/OverlayOptions" }]
    }
  }
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338160461, function(require, module, exports) {
const RuntimeGlobals = require('webpack/lib/RuntimeGlobals');
const RuntimeModule = require('webpack/lib/RuntimeModule');
const Template = require('webpack/lib/Template');
const { refreshGlobal } = require('../globals');
const getRefreshGlobal = require('../utils/getRefreshGlobal');

class ReactRefreshRuntimeModule extends RuntimeModule {
  constructor() {
    // Second argument is the `stage` for this runtime module -
    // we'll use the same stage as Webpack's HMR runtime module for safety.
    super('react refresh', 5);
  }

  /**
   * @returns {string} runtime code
   */
  generate() {
    const { runtimeTemplate } = this.compilation;
    return Template.asString([
      `${RuntimeGlobals.interceptModuleExecution}.push(${runtimeTemplate.basicFunction('options', [
        `${runtimeTemplate.supportsConst() ? 'const' : 'var'} originalFactory = options.factory;`,
        `options.factory = ${runtimeTemplate.basicFunction(
          'moduleObject, moduleExports, webpackRequire',
          [
            `${refreshGlobal}.init();`,
            'try {',
            Template.indent(
              'originalFactory.call(this, moduleObject, moduleExports, webpackRequire);'
            ),
            '} finally {',
            Template.indent(`${refreshGlobal}.cleanup(options.id);`),
            '}',
          ]
        )}`,
      ])})`,
      '',
      getRefreshGlobal(runtimeTemplate),
    ]);
  }
}

module.exports = ReactRefreshRuntimeModule;

}, function(modId) { var map = {"../globals":1649338160451,"../utils/getRefreshGlobal":1649338160455}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1649338160450);
})()
//miniprogram-npm-outsideDeps=["schema-utils","webpack","webpack/lib/dependencies/ConstDependency","webpack/lib/NormalModule","webpack/lib/RuntimeGlobals","webpack/lib/ParserHelpers","webpack/lib/javascript/JavascriptParserHelpers","webpack/lib/Template","querystring","path","webpack/lib/RuntimeModule"]
//# sourceMappingURL=index.js.map