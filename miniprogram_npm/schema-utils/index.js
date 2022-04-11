module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1649338161650, function(require, module, exports) {


const validate = require('./validate');

module.exports = validate.default;
}, function(modId) {var map = {"./validate":1649338161651}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338161651, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _absolutePath = _interopRequireDefault(require("./keywords/absolutePath"));

var _ValidationError = _interopRequireDefault(require("./ValidationError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Use CommonJS require for ajv libs so TypeScript consumers aren't locked into esModuleInterop (see #110).
const Ajv = require('ajv');

const ajvKeywords = require('ajv-keywords');
/** @typedef {import("json-schema").JSONSchema4} JSONSchema4 */

/** @typedef {import("json-schema").JSONSchema6} JSONSchema6 */

/** @typedef {import("json-schema").JSONSchema7} JSONSchema7 */

/** @typedef {import("ajv").ErrorObject} ErrorObject */

/**
 * @typedef {Object} Extend
 * @property {number=} formatMinimum
 * @property {number=} formatMaximum
 * @property {boolean=} formatExclusiveMinimum
 * @property {boolean=} formatExclusiveMaximum
 */

/** @typedef {(JSONSchema4 | JSONSchema6 | JSONSchema7) & Extend} Schema */

/** @typedef {ErrorObject & { children?: Array<ErrorObject>}} SchemaUtilErrorObject */

/**
 * @callback PostFormatter
 * @param {string} formattedError
 * @param {SchemaUtilErrorObject} error
 * @returns {string}
 */

/**
 * @typedef {Object} ValidationErrorConfiguration
 * @property {string=} name
 * @property {string=} baseDataPath
 * @property {PostFormatter=} postFormatter
 */


const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  $data: true
});
ajvKeywords(ajv, ['instanceof', 'formatMinimum', 'formatMaximum', 'patternRequired']); // Custom keywords

(0, _absolutePath.default)(ajv);
/**
 * @param {Schema} schema
 * @param {Array<object> | object} options
 * @param {ValidationErrorConfiguration=} configuration
 * @returns {void}
 */

function validate(schema, options, configuration) {
  let errors = [];

  if (Array.isArray(options)) {
    errors = Array.from(options, nestedOptions => validateObject(schema, nestedOptions));
    errors.forEach((list, idx) => {
      const applyPrefix =
      /**
       * @param {SchemaUtilErrorObject} error
       */
      error => {
        // eslint-disable-next-line no-param-reassign
        error.dataPath = `[${idx}]${error.dataPath}`;

        if (error.children) {
          error.children.forEach(applyPrefix);
        }
      };

      list.forEach(applyPrefix);
    });
    errors = errors.reduce((arr, items) => {
      arr.push(...items);
      return arr;
    }, []);
  } else {
    errors = validateObject(schema, options);
  }

  if (errors.length > 0) {
    throw new _ValidationError.default(errors, schema, configuration);
  }
}
/**
 * @param {Schema} schema
 * @param {Array<object> | object} options
 * @returns {Array<SchemaUtilErrorObject>}
 */


function validateObject(schema, options) {
  const compiledSchema = ajv.compile(schema);
  const valid = compiledSchema(options);
  if (valid) return [];
  return compiledSchema.errors ? filterErrors(compiledSchema.errors) : [];
}
/**
 * @param {Array<ErrorObject>} errors
 * @returns {Array<SchemaUtilErrorObject>}
 */


function filterErrors(errors) {
  /** @type {Array<SchemaUtilErrorObject>} */
  let newErrors = [];

  for (const error of
  /** @type {Array<SchemaUtilErrorObject>} */
  errors) {
    const {
      dataPath
    } = error;
    /** @type {Array<SchemaUtilErrorObject>} */

    let children = [];
    newErrors = newErrors.filter(oldError => {
      if (oldError.dataPath.includes(dataPath)) {
        if (oldError.children) {
          children = children.concat(oldError.children.slice(0));
        } // eslint-disable-next-line no-undefined, no-param-reassign


        oldError.children = undefined;
        children.push(oldError);
        return false;
      }

      return true;
    });

    if (children.length) {
      error.children = children;
    }

    newErrors.push(error);
  }

  return newErrors;
} // TODO change after resolve https://github.com/microsoft/TypeScript/issues/34994


validate.ValidationError = _ValidationError.default;
validate.ValidateError = _ValidationError.default;
var _default = validate;
exports.default = _default;
}, function(modId) { var map = {"./keywords/absolutePath":1649338161652,"./ValidationError":1649338161653}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338161652, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/** @typedef {import("ajv").Ajv} Ajv */

/** @typedef {import("ajv").ValidateFunction} ValidateFunction */

/** @typedef {import("../validate").SchemaUtilErrorObject} SchemaUtilErrorObject */

/**
 * @param {string} message
 * @param {object} schema
 * @param {string} data
 * @returns {SchemaUtilErrorObject}
 */
function errorMessage(message, schema, data) {
  return {
    // @ts-ignore
    // eslint-disable-next-line no-undefined
    dataPath: undefined,
    // @ts-ignore
    // eslint-disable-next-line no-undefined
    schemaPath: undefined,
    keyword: 'absolutePath',
    params: {
      absolutePath: data
    },
    message,
    parentSchema: schema
  };
}
/**
 * @param {boolean} shouldBeAbsolute
 * @param {object} schema
 * @param {string} data
 * @returns {SchemaUtilErrorObject}
 */


function getErrorFor(shouldBeAbsolute, schema, data) {
  const message = shouldBeAbsolute ? `The provided value ${JSON.stringify(data)} is not an absolute path!` : `A relative path is expected. However, the provided value ${JSON.stringify(data)} is an absolute path!`;
  return errorMessage(message, schema, data);
}
/**
 *
 * @param {Ajv} ajv
 * @returns {Ajv}
 */


function addAbsolutePathKeyword(ajv) {
  ajv.addKeyword('absolutePath', {
    errors: true,
    type: 'string',

    compile(schema, parentSchema) {
      /** @type {ValidateFunction} */
      const callback = data => {
        let passes = true;
        const isExclamationMarkPresent = data.includes('!');

        if (isExclamationMarkPresent) {
          callback.errors = [errorMessage(`The provided value ${JSON.stringify(data)} contains exclamation mark (!) which is not allowed because it's reserved for loader syntax.`, parentSchema, data)];
          passes = false;
        } // ?:[A-Za-z]:\\ - Windows absolute path
        // \\\\ - Windows network absolute path
        // \/ - Unix-like OS absolute path


        const isCorrectAbsolutePath = schema === /^(?:[A-Za-z]:(\\|\/)|\\\\|\/)/.test(data);

        if (!isCorrectAbsolutePath) {
          callback.errors = [getErrorFor(schema, parentSchema, data)];
          passes = false;
        }

        return passes;
      };

      callback.errors = [];
      return callback;
    }

  });
  return ajv;
}

var _default = addAbsolutePathKeyword;
exports.default = _default;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338161653, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const {
  stringHints,
  numberHints
} = require('./util/hints');
/** @typedef {import("json-schema").JSONSchema6} JSONSchema6 */

/** @typedef {import("json-schema").JSONSchema7} JSONSchema7 */

/** @typedef {import("./validate").Schema} Schema */

/** @typedef {import("./validate").ValidationErrorConfiguration} ValidationErrorConfiguration */

/** @typedef {import("./validate").PostFormatter} PostFormatter */

/** @typedef {import("./validate").SchemaUtilErrorObject} SchemaUtilErrorObject */

/** @enum {number} */


const SPECIFICITY = {
  type: 1,
  not: 1,
  oneOf: 1,
  anyOf: 1,
  if: 1,
  enum: 1,
  const: 1,
  instanceof: 1,
  required: 2,
  pattern: 2,
  patternRequired: 2,
  format: 2,
  formatMinimum: 2,
  formatMaximum: 2,
  minimum: 2,
  exclusiveMinimum: 2,
  maximum: 2,
  exclusiveMaximum: 2,
  multipleOf: 2,
  uniqueItems: 2,
  contains: 2,
  minLength: 2,
  maxLength: 2,
  minItems: 2,
  maxItems: 2,
  minProperties: 2,
  maxProperties: 2,
  dependencies: 2,
  propertyNames: 2,
  additionalItems: 2,
  additionalProperties: 2,
  absolutePath: 2
};
/**
 *
 * @param {Array<SchemaUtilErrorObject>} array
 * @param {(item: SchemaUtilErrorObject) => number} fn
 * @returns {Array<SchemaUtilErrorObject>}
 */

function filterMax(array, fn) {
  const evaluatedMax = array.reduce((max, item) => Math.max(max, fn(item)), 0);
  return array.filter(item => fn(item) === evaluatedMax);
}
/**
 *
 * @param {Array<SchemaUtilErrorObject>} children
 * @returns {Array<SchemaUtilErrorObject>}
 */


function filterChildren(children) {
  let newChildren = children;
  newChildren = filterMax(newChildren,
  /**
   *
   * @param {SchemaUtilErrorObject} error
   * @returns {number}
   */
  error => error.dataPath ? error.dataPath.length : 0);
  newChildren = filterMax(newChildren,
  /**
   * @param {SchemaUtilErrorObject} error
   * @returns {number}
   */
  error => SPECIFICITY[
  /** @type {keyof typeof SPECIFICITY} */
  error.keyword] || 2);
  return newChildren;
}
/**
 * Find all children errors
 * @param {Array<SchemaUtilErrorObject>} children
 * @param {Array<string>} schemaPaths
 * @return {number} returns index of first child
 */


function findAllChildren(children, schemaPaths) {
  let i = children.length - 1;

  const predicate =
  /**
   * @param {string} schemaPath
   * @returns {boolean}
   */
  schemaPath => children[i].schemaPath.indexOf(schemaPath) !== 0;

  while (i > -1 && !schemaPaths.every(predicate)) {
    if (children[i].keyword === 'anyOf' || children[i].keyword === 'oneOf') {
      const refs = extractRefs(children[i]);
      const childrenStart = findAllChildren(children.slice(0, i), refs.concat(children[i].schemaPath));
      i = childrenStart - 1;
    } else {
      i -= 1;
    }
  }

  return i + 1;
}
/**
 * Extracts all refs from schema
 * @param {SchemaUtilErrorObject} error
 * @return {Array<string>}
 */


function extractRefs(error) {
  const {
    schema
  } = error;

  if (!Array.isArray(schema)) {
    return [];
  }

  return schema.map(({
    $ref
  }) => $ref).filter(s => s);
}
/**
 * Groups children by their first level parent (assuming that error is root)
 * @param {Array<SchemaUtilErrorObject>} children
 * @return {Array<SchemaUtilErrorObject>}
 */


function groupChildrenByFirstChild(children) {
  const result = [];
  let i = children.length - 1;

  while (i > 0) {
    const child = children[i];

    if (child.keyword === 'anyOf' || child.keyword === 'oneOf') {
      const refs = extractRefs(child);
      const childrenStart = findAllChildren(children.slice(0, i), refs.concat(child.schemaPath));

      if (childrenStart !== i) {
        result.push(Object.assign({}, child, {
          children: children.slice(childrenStart, i)
        }));
        i = childrenStart;
      } else {
        result.push(child);
      }
    } else {
      result.push(child);
    }

    i -= 1;
  }

  if (i === 0) {
    result.push(children[i]);
  }

  return result.reverse();
}
/**
 * @param {string} str
 * @param {string} prefix
 * @returns {string}
 */


function indent(str, prefix) {
  return str.replace(/\n(?!$)/g, `\n${prefix}`);
}
/**
 * @param {Schema} schema
 * @returns {schema is (Schema & {not: Schema})}
 */


function hasNotInSchema(schema) {
  return !!schema.not;
}
/**
 * @param {Schema} schema
 * @return {Schema}
 */


function findFirstTypedSchema(schema) {
  if (hasNotInSchema(schema)) {
    return findFirstTypedSchema(schema.not);
  }

  return schema;
}
/**
 * @param {Schema} schema
 * @return {boolean}
 */


function canApplyNot(schema) {
  const typedSchema = findFirstTypedSchema(schema);
  return likeNumber(typedSchema) || likeInteger(typedSchema) || likeString(typedSchema) || likeNull(typedSchema) || likeBoolean(typedSchema);
}
/**
 * @param {any} maybeObj
 * @returns {boolean}
 */


function isObject(maybeObj) {
  return typeof maybeObj === 'object' && maybeObj !== null;
}
/**
 * @param {Schema} schema
 * @returns {boolean}
 */


function likeNumber(schema) {
  return schema.type === 'number' || typeof schema.minimum !== 'undefined' || typeof schema.exclusiveMinimum !== 'undefined' || typeof schema.maximum !== 'undefined' || typeof schema.exclusiveMaximum !== 'undefined' || typeof schema.multipleOf !== 'undefined';
}
/**
 * @param {Schema} schema
 * @returns {boolean}
 */


function likeInteger(schema) {
  return schema.type === 'integer' || typeof schema.minimum !== 'undefined' || typeof schema.exclusiveMinimum !== 'undefined' || typeof schema.maximum !== 'undefined' || typeof schema.exclusiveMaximum !== 'undefined' || typeof schema.multipleOf !== 'undefined';
}
/**
 * @param {Schema} schema
 * @returns {boolean}
 */


function likeString(schema) {
  return schema.type === 'string' || typeof schema.minLength !== 'undefined' || typeof schema.maxLength !== 'undefined' || typeof schema.pattern !== 'undefined' || typeof schema.format !== 'undefined' || typeof schema.formatMinimum !== 'undefined' || typeof schema.formatMaximum !== 'undefined';
}
/**
 * @param {Schema} schema
 * @returns {boolean}
 */


function likeBoolean(schema) {
  return schema.type === 'boolean';
}
/**
 * @param {Schema} schema
 * @returns {boolean}
 */


function likeArray(schema) {
  return schema.type === 'array' || typeof schema.minItems === 'number' || typeof schema.maxItems === 'number' || typeof schema.uniqueItems !== 'undefined' || typeof schema.items !== 'undefined' || typeof schema.additionalItems !== 'undefined' || typeof schema.contains !== 'undefined';
}
/**
 * @param {Schema & {patternRequired?: Array<string>}} schema
 * @returns {boolean}
 */


function likeObject(schema) {
  return schema.type === 'object' || typeof schema.minProperties !== 'undefined' || typeof schema.maxProperties !== 'undefined' || typeof schema.required !== 'undefined' || typeof schema.properties !== 'undefined' || typeof schema.patternProperties !== 'undefined' || typeof schema.additionalProperties !== 'undefined' || typeof schema.dependencies !== 'undefined' || typeof schema.propertyNames !== 'undefined' || typeof schema.patternRequired !== 'undefined';
}
/**
 * @param {Schema} schema
 * @returns {boolean}
 */


function likeNull(schema) {
  return schema.type === 'null';
}
/**
 * @param {string} type
 * @returns {string}
 */


function getArticle(type) {
  if (/^[aeiou]/i.test(type)) {
    return 'an';
  }

  return 'a';
}
/**
 * @param {Schema=} schema
 * @returns {string}
 */


function getSchemaNonTypes(schema) {
  if (!schema) {
    return '';
  }

  if (!schema.type) {
    if (likeNumber(schema) || likeInteger(schema)) {
      return ' | should be any non-number';
    }

    if (likeString(schema)) {
      return ' | should be any non-string';
    }

    if (likeArray(schema)) {
      return ' | should be any non-array';
    }

    if (likeObject(schema)) {
      return ' | should be any non-object';
    }
  }

  return '';
}
/**
 * @param {Array<string>} hints
 * @returns {string}
 */


function formatHints(hints) {
  return hints.length > 0 ? `(${hints.join(', ')})` : '';
}
/**
 * @param {Schema} schema
 * @param {boolean} logic
 * @returns {string[]}
 */


function getHints(schema, logic) {
  if (likeNumber(schema) || likeInteger(schema)) {
    return numberHints(schema, logic);
  } else if (likeString(schema)) {
    return stringHints(schema, logic);
  }

  return [];
}

class ValidationError extends Error {
  /**
   * @param {Array<SchemaUtilErrorObject>} errors
   * @param {Schema} schema
   * @param {ValidationErrorConfiguration} configuration
   */
  constructor(errors, schema, configuration = {}) {
    super();
    /** @type {string} */

    this.name = 'ValidationError';
    /** @type {Array<SchemaUtilErrorObject>} */

    this.errors = errors;
    /** @type {Schema} */

    this.schema = schema;
    let headerNameFromSchema;
    let baseDataPathFromSchema;

    if (schema.title && (!configuration.name || !configuration.baseDataPath)) {
      const splittedTitleFromSchema = schema.title.match(/^(.+) (.+)$/);

      if (splittedTitleFromSchema) {
        if (!configuration.name) {
          [, headerNameFromSchema] = splittedTitleFromSchema;
        }

        if (!configuration.baseDataPath) {
          [,, baseDataPathFromSchema] = splittedTitleFromSchema;
        }
      }
    }
    /** @type {string} */


    this.headerName = configuration.name || headerNameFromSchema || 'Object';
    /** @type {string} */

    this.baseDataPath = configuration.baseDataPath || baseDataPathFromSchema || 'configuration';
    /** @type {PostFormatter | null} */

    this.postFormatter = configuration.postFormatter || null;
    const header = `Invalid ${this.baseDataPath} object. ${this.headerName} has been initialized using ${getArticle(this.baseDataPath)} ${this.baseDataPath} object that does not match the API schema.\n`;
    /** @type {string} */

    this.message = `${header}${this.formatValidationErrors(errors)}`;
    Error.captureStackTrace(this, this.constructor);
  }
  /**
   * @param {string} path
   * @returns {Schema}
   */


  getSchemaPart(path) {
    const newPath = path.split('/');
    let schemaPart = this.schema;

    for (let i = 1; i < newPath.length; i++) {
      const inner = schemaPart[
      /** @type {keyof Schema} */
      newPath[i]];

      if (!inner) {
        break;
      }

      schemaPart = inner;
    }

    return schemaPart;
  }
  /**
   * @param {Schema} schema
   * @param {boolean} logic
   * @param {Array<Object>} prevSchemas
   * @returns {string}
   */


  formatSchema(schema, logic = true, prevSchemas = []) {
    let newLogic = logic;

    const formatInnerSchema =
    /**
     *
     * @param {Object} innerSchema
     * @param {boolean=} addSelf
     * @returns {string}
     */
    (innerSchema, addSelf) => {
      if (!addSelf) {
        return this.formatSchema(innerSchema, newLogic, prevSchemas);
      }

      if (prevSchemas.includes(innerSchema)) {
        return '(recursive)';
      }

      return this.formatSchema(innerSchema, newLogic, prevSchemas.concat(schema));
    };

    if (hasNotInSchema(schema) && !likeObject(schema)) {
      if (canApplyNot(schema.not)) {
        newLogic = !logic;
        return formatInnerSchema(schema.not);
      }

      const needApplyLogicHere = !schema.not.not;
      const prefix = logic ? '' : 'non ';
      newLogic = !logic;
      return needApplyLogicHere ? prefix + formatInnerSchema(schema.not) : formatInnerSchema(schema.not);
    }

    if (
    /** @type {Schema & {instanceof: string | Array<string>}} */
    schema.instanceof) {
      const {
        instanceof: value
      } =
      /** @type {Schema & {instanceof: string | Array<string>}} */
      schema;
      const values = !Array.isArray(value) ? [value] : value;
      return values.map(
      /**
       * @param {string} item
       * @returns {string}
       */
      item => item === 'Function' ? 'function' : item).join(' | ');
    }

    if (schema.enum) {
      return (
        /** @type {Array<any>} */
        schema.enum.map(item => JSON.stringify(item)).join(' | ')
      );
    }

    if (typeof schema.const !== 'undefined') {
      return JSON.stringify(schema.const);
    }

    if (schema.oneOf) {
      return (
        /** @type {Array<Schema>} */
        schema.oneOf.map(item => formatInnerSchema(item, true)).join(' | ')
      );
    }

    if (schema.anyOf) {
      return (
        /** @type {Array<Schema>} */
        schema.anyOf.map(item => formatInnerSchema(item, true)).join(' | ')
      );
    }

    if (schema.allOf) {
      return (
        /** @type {Array<Schema>} */
        schema.allOf.map(item => formatInnerSchema(item, true)).join(' & ')
      );
    }

    if (
    /** @type {JSONSchema7} */
    schema.if) {
      const {
        if: ifValue,
        then: thenValue,
        else: elseValue
      } =
      /** @type {JSONSchema7} */
      schema;
      return `${ifValue ? `if ${formatInnerSchema(ifValue)}` : ''}${thenValue ? ` then ${formatInnerSchema(thenValue)}` : ''}${elseValue ? ` else ${formatInnerSchema(elseValue)}` : ''}`;
    }

    if (schema.$ref) {
      return formatInnerSchema(this.getSchemaPart(schema.$ref), true);
    }

    if (likeNumber(schema) || likeInteger(schema)) {
      const [type, ...hints] = getHints(schema, logic);
      const str = `${type}${hints.length > 0 ? ` ${formatHints(hints)}` : ''}`;
      return logic ? str : hints.length > 0 ? `non-${type} | ${str}` : `non-${type}`;
    }

    if (likeString(schema)) {
      const [type, ...hints] = getHints(schema, logic);
      const str = `${type}${hints.length > 0 ? ` ${formatHints(hints)}` : ''}`;
      return logic ? str : str === 'string' ? 'non-string' : `non-string | ${str}`;
    }

    if (likeBoolean(schema)) {
      return `${logic ? '' : 'non-'}boolean`;
    }

    if (likeArray(schema)) {
      // not logic already applied in formatValidationError
      newLogic = true;
      const hints = [];

      if (typeof schema.minItems === 'number') {
        hints.push(`should not have fewer than ${schema.minItems} item${schema.minItems > 1 ? 's' : ''}`);
      }

      if (typeof schema.maxItems === 'number') {
        hints.push(`should not have more than ${schema.maxItems} item${schema.maxItems > 1 ? 's' : ''}`);
      }

      if (schema.uniqueItems) {
        hints.push('should not have duplicate items');
      }

      const hasAdditionalItems = typeof schema.additionalItems === 'undefined' || Boolean(schema.additionalItems);
      let items = '';

      if (schema.items) {
        if (Array.isArray(schema.items) && schema.items.length > 0) {
          items = `${
          /** @type {Array<Schema>} */
          schema.items.map(item => formatInnerSchema(item)).join(', ')}`;

          if (hasAdditionalItems) {
            if (schema.additionalItems && isObject(schema.additionalItems) && Object.keys(schema.additionalItems).length > 0) {
              hints.push(`additional items should be ${formatInnerSchema(schema.additionalItems)}`);
            }
          }
        } else if (schema.items && Object.keys(schema.items).length > 0) {
          // "additionalItems" is ignored
          items = `${formatInnerSchema(schema.items)}`;
        } else {
          // Fallback for empty `items` value
          items = 'any';
        }
      } else {
        // "additionalItems" is ignored
        items = 'any';
      }

      if (schema.contains && Object.keys(schema.contains).length > 0) {
        hints.push(`should contains at least one ${this.formatSchema(schema.contains)} item`);
      }

      return `[${items}${hasAdditionalItems ? ', ...' : ''}]${hints.length > 0 ? ` (${hints.join(', ')})` : ''}`;
    }

    if (likeObject(schema)) {
      // not logic already applied in formatValidationError
      newLogic = true;
      const hints = [];

      if (typeof schema.minProperties === 'number') {
        hints.push(`should not have fewer than ${schema.minProperties} ${schema.minProperties > 1 ? 'properties' : 'property'}`);
      }

      if (typeof schema.maxProperties === 'number') {
        hints.push(`should not have more than ${schema.maxProperties} ${schema.minProperties && schema.minProperties > 1 ? 'properties' : 'property'}`);
      }

      if (schema.patternProperties && Object.keys(schema.patternProperties).length > 0) {
        const patternProperties = Object.keys(schema.patternProperties);
        hints.push(`additional property names should match pattern${patternProperties.length > 1 ? 's' : ''} ${patternProperties.map(pattern => JSON.stringify(pattern)).join(' | ')}`);
      }

      const properties = schema.properties ? Object.keys(schema.properties) : [];
      const required = schema.required ? schema.required : [];
      const allProperties = [...new Set(
      /** @type {Array<string>} */
      [].concat(required).concat(properties))];
      const objectStructure = allProperties.map(property => {
        const isRequired = required.includes(property); // Some properties need quotes, maybe we should add check
        // Maybe we should output type of property (`foo: string`), but it is looks very unreadable

        return `${property}${isRequired ? '' : '?'}`;
      }).concat(typeof schema.additionalProperties === 'undefined' || Boolean(schema.additionalProperties) ? schema.additionalProperties && isObject(schema.additionalProperties) ? [`<key>: ${formatInnerSchema(schema.additionalProperties)}`] : ['…'] : []).join(', ');
      const {
        dependencies,
        propertyNames,
        patternRequired
      } =
      /** @type {Schema & {patternRequired?: Array<string>;}} */
      schema;

      if (dependencies) {
        Object.keys(dependencies).forEach(dependencyName => {
          const dependency = dependencies[dependencyName];

          if (Array.isArray(dependency)) {
            hints.push(`should have ${dependency.length > 1 ? 'properties' : 'property'} ${dependency.map(dep => `'${dep}'`).join(', ')} when property '${dependencyName}' is present`);
          } else {
            hints.push(`should be valid according to the schema ${formatInnerSchema(dependency)} when property '${dependencyName}' is present`);
          }
        });
      }

      if (propertyNames && Object.keys(propertyNames).length > 0) {
        hints.push(`each property name should match format ${JSON.stringify(schema.propertyNames.format)}`);
      }

      if (patternRequired && patternRequired.length > 0) {
        hints.push(`should have property matching pattern ${patternRequired.map(
        /**
         * @param {string} item
         * @returns {string}
         */
        item => JSON.stringify(item))}`);
      }

      return `object {${objectStructure ? ` ${objectStructure} ` : ''}}${hints.length > 0 ? ` (${hints.join(', ')})` : ''}`;
    }

    if (likeNull(schema)) {
      return `${logic ? '' : 'non-'}null`;
    }

    if (Array.isArray(schema.type)) {
      // not logic already applied in formatValidationError
      return `${schema.type.join(' | ')}`;
    } // Fallback for unknown keywords
    // not logic already applied in formatValidationError

    /* istanbul ignore next */


    return JSON.stringify(schema, null, 2);
  }
  /**
   * @param {Schema=} schemaPart
   * @param {(boolean | Array<string>)=} additionalPath
   * @param {boolean=} needDot
   * @param {boolean=} logic
   * @returns {string}
   */


  getSchemaPartText(schemaPart, additionalPath, needDot = false, logic = true) {
    if (!schemaPart) {
      return '';
    }

    if (Array.isArray(additionalPath)) {
      for (let i = 0; i < additionalPath.length; i++) {
        /** @type {Schema | undefined} */
        const inner = schemaPart[
        /** @type {keyof Schema} */
        additionalPath[i]];

        if (inner) {
          // eslint-disable-next-line no-param-reassign
          schemaPart = inner;
        } else {
          break;
        }
      }
    }

    while (schemaPart.$ref) {
      // eslint-disable-next-line no-param-reassign
      schemaPart = this.getSchemaPart(schemaPart.$ref);
    }

    let schemaText = `${this.formatSchema(schemaPart, logic)}${needDot ? '.' : ''}`;

    if (schemaPart.description) {
      schemaText += `\n-> ${schemaPart.description}`;
    }

    return schemaText;
  }
  /**
   * @param {Schema=} schemaPart
   * @returns {string}
   */


  getSchemaPartDescription(schemaPart) {
    if (!schemaPart) {
      return '';
    }

    while (schemaPart.$ref) {
      // eslint-disable-next-line no-param-reassign
      schemaPart = this.getSchemaPart(schemaPart.$ref);
    }

    if (schemaPart.description) {
      return `\n-> ${schemaPart.description}`;
    }

    return '';
  }
  /**
   * @param {SchemaUtilErrorObject} error
   * @returns {string}
   */


  formatValidationError(error) {
    const {
      keyword,
      dataPath: errorDataPath
    } = error;
    const dataPath = `${this.baseDataPath}${errorDataPath}`;

    switch (keyword) {
      case 'type':
        {
          const {
            parentSchema,
            params
          } = error; // eslint-disable-next-line default-case

          switch (
          /** @type {import("ajv").TypeParams} */
          params.type) {
            case 'number':
              return `${dataPath} should be a ${this.getSchemaPartText(parentSchema, false, true)}`;

            case 'integer':
              return `${dataPath} should be a ${this.getSchemaPartText(parentSchema, false, true)}`;

            case 'string':
              return `${dataPath} should be a ${this.getSchemaPartText(parentSchema, false, true)}`;

            case 'boolean':
              return `${dataPath} should be a ${this.getSchemaPartText(parentSchema, false, true)}`;

            case 'array':
              return `${dataPath} should be an array:\n${this.getSchemaPartText(parentSchema)}`;

            case 'object':
              return `${dataPath} should be an object:\n${this.getSchemaPartText(parentSchema)}`;

            case 'null':
              return `${dataPath} should be a ${this.getSchemaPartText(parentSchema, false, true)}`;

            default:
              return `${dataPath} should be:\n${this.getSchemaPartText(parentSchema)}`;
          }
        }

      case 'instanceof':
        {
          const {
            parentSchema
          } = error;
          return `${dataPath} should be an instance of ${this.getSchemaPartText(parentSchema, false, true)}`;
        }

      case 'pattern':
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            pattern
          } =
          /** @type {import("ajv").PatternParams} */
          params;
          return `${dataPath} should match pattern ${JSON.stringify(pattern)}${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case 'format':
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            format
          } =
          /** @type {import("ajv").FormatParams} */
          params;
          return `${dataPath} should match format ${JSON.stringify(format)}${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case 'formatMinimum':
      case 'formatMaximum':
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            comparison,
            limit
          } =
          /** @type {import("ajv").ComparisonParams} */
          params;
          return `${dataPath} should be ${comparison} ${JSON.stringify(limit)}${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case 'minimum':
      case 'maximum':
      case 'exclusiveMinimum':
      case 'exclusiveMaximum':
        {
          const {
            parentSchema,
            params
          } = error;
          const {
            comparison,
            limit
          } =
          /** @type {import("ajv").ComparisonParams} */
          params;
          const [, ...hints] = getHints(
          /** @type {Schema} */
          parentSchema, true);

          if (hints.length === 0) {
            hints.push(`should be ${comparison} ${limit}`);
          }

          return `${dataPath} ${hints.join(' ')}${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case 'multipleOf':
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            multipleOf
          } =
          /** @type {import("ajv").MultipleOfParams} */
          params;
          return `${dataPath} should be multiple of ${multipleOf}${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case 'patternRequired':
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            missingPattern
          } =
          /** @type {import("ajv").PatternRequiredParams} */
          params;
          return `${dataPath} should have property matching pattern ${JSON.stringify(missingPattern)}${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case 'minLength':
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            limit
          } =
          /** @type {import("ajv").LimitParams} */
          params;

          if (limit === 1) {
            return `${dataPath} should be an non-empty string${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
          }

          const length = limit - 1;
          return `${dataPath} should be longer than ${length} character${length > 1 ? 's' : ''}${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case 'minItems':
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            limit
          } =
          /** @type {import("ajv").LimitParams} */
          params;

          if (limit === 1) {
            return `${dataPath} should be an non-empty array${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
          }

          return `${dataPath} should not have fewer than ${limit} items${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case 'minProperties':
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            limit
          } =
          /** @type {import("ajv").LimitParams} */
          params;

          if (limit === 1) {
            return `${dataPath} should be an non-empty object${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
          }

          return `${dataPath} should not have fewer than ${limit} properties${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case 'maxLength':
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            limit
          } =
          /** @type {import("ajv").LimitParams} */
          params;
          const max = limit + 1;
          return `${dataPath} should be shorter than ${max} character${max > 1 ? 's' : ''}${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case 'maxItems':
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            limit
          } =
          /** @type {import("ajv").LimitParams} */
          params;
          return `${dataPath} should not have more than ${limit} items${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case 'maxProperties':
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            limit
          } =
          /** @type {import("ajv").LimitParams} */
          params;
          return `${dataPath} should not have more than ${limit} properties${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case 'uniqueItems':
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            i
          } =
          /** @type {import("ajv").UniqueItemsParams} */
          params;
          return `${dataPath} should not contain the item '${error.data[i]}' twice${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case 'additionalItems':
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            limit
          } =
          /** @type {import("ajv").LimitParams} */
          params;
          return `${dataPath} should not have more than ${limit} items${getSchemaNonTypes(parentSchema)}. These items are valid:\n${this.getSchemaPartText(parentSchema)}`;
        }

      case 'contains':
        {
          const {
            parentSchema
          } = error;
          return `${dataPath} should contains at least one ${this.getSchemaPartText(parentSchema, ['contains'])} item${getSchemaNonTypes(parentSchema)}.`;
        }

      case 'required':
        {
          const {
            parentSchema,
            params
          } = error;
          const missingProperty =
          /** @type {import("ajv").DependenciesParams} */
          params.missingProperty.replace(/^\./, '');
          const hasProperty = parentSchema && Boolean(
          /** @type {Schema} */
          parentSchema.properties &&
          /** @type {Schema} */
          parentSchema.properties[missingProperty]);
          return `${dataPath} misses the property '${missingProperty}'${getSchemaNonTypes(parentSchema)}.${hasProperty ? ` Should be:\n${this.getSchemaPartText(parentSchema, ['properties', missingProperty])}` : this.getSchemaPartDescription(parentSchema)}`;
        }

      case 'additionalProperties':
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            additionalProperty
          } =
          /** @type {import("ajv").AdditionalPropertiesParams} */
          params;
          return `${dataPath} has an unknown property '${additionalProperty}'${getSchemaNonTypes(parentSchema)}. These properties are valid:\n${this.getSchemaPartText(parentSchema)}`;
        }

      case 'dependencies':
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            property,
            deps
          } =
          /** @type {import("ajv").DependenciesParams} */
          params;
          const dependencies = deps.split(',').map(
          /**
           * @param {string} dep
           * @returns {string}
           */
          dep => `'${dep.trim()}'`).join(', ');
          return `${dataPath} should have properties ${dependencies} when property '${property}' is present${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case 'propertyNames':
        {
          const {
            params,
            parentSchema,
            schema
          } = error;
          const {
            propertyName
          } =
          /** @type {import("ajv").PropertyNamesParams} */
          params;
          return `${dataPath} property name '${propertyName}' is invalid${getSchemaNonTypes(parentSchema)}. Property names should be match format ${JSON.stringify(schema.format)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case 'enum':
        {
          const {
            parentSchema
          } = error;

          if (parentSchema &&
          /** @type {Schema} */
          parentSchema.enum &&
          /** @type {Schema} */
          parentSchema.enum.length === 1) {
            return `${dataPath} should be ${this.getSchemaPartText(parentSchema, false, true)}`;
          }

          return `${dataPath} should be one of these:\n${this.getSchemaPartText(parentSchema)}`;
        }

      case 'const':
        {
          const {
            parentSchema
          } = error;
          return `${dataPath} should be equal to constant ${this.getSchemaPartText(parentSchema, false, true)}`;
        }

      case 'not':
        {
          const postfix = likeObject(
          /** @type {Schema} */
          error.parentSchema) ? `\n${this.getSchemaPartText(error.parentSchema)}` : '';
          const schemaOutput = this.getSchemaPartText(error.schema, false, false, false);

          if (canApplyNot(error.schema)) {
            return `${dataPath} should be any ${schemaOutput}${postfix}.`;
          }

          const {
            schema,
            parentSchema
          } = error;
          return `${dataPath} should not be ${this.getSchemaPartText(schema, false, true)}${parentSchema && likeObject(parentSchema) ? `\n${this.getSchemaPartText(parentSchema)}` : ''}`;
        }

      case 'oneOf':
      case 'anyOf':
        {
          const {
            parentSchema,
            children
          } = error;

          if (children && children.length > 0) {
            if (error.schema.length === 1) {
              const lastChild = children[children.length - 1];
              const remainingChildren = children.slice(0, children.length - 1);
              return this.formatValidationError(Object.assign({}, lastChild, {
                children: remainingChildren,
                parentSchema: Object.assign({}, parentSchema, lastChild.parentSchema)
              }));
            }

            let filteredChildren = filterChildren(children);

            if (filteredChildren.length === 1) {
              return this.formatValidationError(filteredChildren[0]);
            }

            filteredChildren = groupChildrenByFirstChild(filteredChildren);
            return `${dataPath} should be one of these:\n${this.getSchemaPartText(parentSchema)}\nDetails:\n${filteredChildren.map(
            /**
             * @param {SchemaUtilErrorObject} nestedError
             * @returns {string}
             */
            nestedError => ` * ${indent(this.formatValidationError(nestedError), '   ')}`).join('\n')}`;
          }

          return `${dataPath} should be one of these:\n${this.getSchemaPartText(parentSchema)}`;
        }

      case 'if':
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            failingKeyword
          } =
          /** @type {import("ajv").IfParams} */
          params;
          return `${dataPath} should match "${failingKeyword}" schema:\n${this.getSchemaPartText(parentSchema, [failingKeyword])}`;
        }

      case 'absolutePath':
        {
          const {
            message,
            parentSchema
          } = error;
          return `${dataPath}: ${message}${this.getSchemaPartDescription(parentSchema)}`;
        }

      /* istanbul ignore next */

      default:
        {
          const {
            message,
            parentSchema
          } = error;
          const ErrorInJSON = JSON.stringify(error, null, 2); // For `custom`, `false schema`, `$ref` keywords
          // Fallback for unknown keywords

          return `${dataPath} ${message} (${ErrorInJSON}).\n${this.getSchemaPartText(parentSchema, false)}`;
        }
    }
  }
  /**
   * @param {Array<SchemaUtilErrorObject>} errors
   * @returns {string}
   */


  formatValidationErrors(errors) {
    return errors.map(error => {
      let formattedError = this.formatValidationError(error);

      if (this.postFormatter) {
        formattedError = this.postFormatter(formattedError, error);
      }

      return ` - ${indent(formattedError, '   ')}`;
    }).join('\n');
  }

}

var _default = ValidationError;
exports.default = _default;
}, function(modId) { var map = {"./util/hints":1649338161654}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338161654, function(require, module, exports) {


const Range = require('./Range');
/** @typedef {import("../validate").Schema} Schema */

/**
 * @param {Schema} schema
 * @param {boolean} logic
 * @return {string[]}
 */


module.exports.stringHints = function stringHints(schema, logic) {
  const hints = [];
  let type = 'string';
  const currentSchema = { ...schema
  };

  if (!logic) {
    const tmpLength = currentSchema.minLength;
    const tmpFormat = currentSchema.formatMinimum;
    const tmpExclusive = currentSchema.formatExclusiveMaximum;
    currentSchema.minLength = currentSchema.maxLength;
    currentSchema.maxLength = tmpLength;
    currentSchema.formatMinimum = currentSchema.formatMaximum;
    currentSchema.formatMaximum = tmpFormat;
    currentSchema.formatExclusiveMaximum = !currentSchema.formatExclusiveMinimum;
    currentSchema.formatExclusiveMinimum = !tmpExclusive;
  }

  if (typeof currentSchema.minLength === 'number') {
    if (currentSchema.minLength === 1) {
      type = 'non-empty string';
    } else {
      const length = Math.max(currentSchema.minLength - 1, 0);
      hints.push(`should be longer than ${length} character${length > 1 ? 's' : ''}`);
    }
  }

  if (typeof currentSchema.maxLength === 'number') {
    if (currentSchema.maxLength === 0) {
      type = 'empty string';
    } else {
      const length = currentSchema.maxLength + 1;
      hints.push(`should be shorter than ${length} character${length > 1 ? 's' : ''}`);
    }
  }

  if (currentSchema.pattern) {
    hints.push(`should${logic ? '' : ' not'} match pattern ${JSON.stringify(currentSchema.pattern)}`);
  }

  if (currentSchema.format) {
    hints.push(`should${logic ? '' : ' not'} match format ${JSON.stringify(currentSchema.format)}`);
  }

  if (currentSchema.formatMinimum) {
    hints.push(`should be ${currentSchema.formatExclusiveMinimum ? '>' : '>='} ${JSON.stringify(currentSchema.formatMinimum)}`);
  }

  if (currentSchema.formatMaximum) {
    hints.push(`should be ${currentSchema.formatExclusiveMaximum ? '<' : '<='} ${JSON.stringify(currentSchema.formatMaximum)}`);
  }

  return [type].concat(hints);
};
/**
 * @param {Schema} schema
 * @param {boolean} logic
 * @return {string[]}
 */


module.exports.numberHints = function numberHints(schema, logic) {
  const hints = [schema.type === 'integer' ? 'integer' : 'number'];
  const range = new Range();

  if (typeof schema.minimum === 'number') {
    range.left(schema.minimum);
  }

  if (typeof schema.exclusiveMinimum === 'number') {
    range.left(schema.exclusiveMinimum, true);
  }

  if (typeof schema.maximum === 'number') {
    range.right(schema.maximum);
  }

  if (typeof schema.exclusiveMaximum === 'number') {
    range.right(schema.exclusiveMaximum, true);
  }

  const rangeFormat = range.format(logic);

  if (rangeFormat) {
    hints.push(rangeFormat);
  }

  if (typeof schema.multipleOf === 'number') {
    hints.push(`should${logic ? '' : ' not'} be multiple of ${schema.multipleOf}`);
  }

  return hints;
};
}, function(modId) { var map = {"./Range":1649338161655}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1649338161655, function(require, module, exports) {


/**
 * @typedef {[number, boolean]} RangeValue
 */

/**
 * @callback RangeValueCallback
 * @param {RangeValue} rangeValue
 * @returns {boolean}
 */
class Range {
  /**
   * @param {"left" | "right"} side
   * @param {boolean} exclusive
   * @returns {">" | ">=" | "<" | "<="}
   */
  static getOperator(side, exclusive) {
    if (side === 'left') {
      return exclusive ? '>' : '>=';
    }

    return exclusive ? '<' : '<=';
  }
  /**
   * @param {number} value
   * @param {boolean} logic is not logic applied
   * @param {boolean} exclusive is range exclusive
   * @returns {string}
   */


  static formatRight(value, logic, exclusive) {
    if (logic === false) {
      return Range.formatLeft(value, !logic, !exclusive);
    }

    return `should be ${Range.getOperator('right', exclusive)} ${value}`;
  }
  /**
   * @param {number} value
   * @param {boolean} logic is not logic applied
   * @param {boolean} exclusive is range exclusive
   * @returns {string}
   */


  static formatLeft(value, logic, exclusive) {
    if (logic === false) {
      return Range.formatRight(value, !logic, !exclusive);
    }

    return `should be ${Range.getOperator('left', exclusive)} ${value}`;
  }
  /**
   * @param {number} start left side value
   * @param {number} end right side value
   * @param {boolean} startExclusive is range exclusive from left side
   * @param {boolean} endExclusive is range exclusive from right side
   * @param {boolean} logic is not logic applied
   * @returns {string}
   */


  static formatRange(start, end, startExclusive, endExclusive, logic) {
    let result = 'should be';
    result += ` ${Range.getOperator(logic ? 'left' : 'right', logic ? startExclusive : !startExclusive)} ${start} `;
    result += logic ? 'and' : 'or';
    result += ` ${Range.getOperator(logic ? 'right' : 'left', logic ? endExclusive : !endExclusive)} ${end}`;
    return result;
  }
  /**
   * @param {Array<RangeValue>} values
   * @param {boolean} logic is not logic applied
   * @return {RangeValue} computed value and it's exclusive flag
   */


  static getRangeValue(values, logic) {
    let minMax = logic ? Infinity : -Infinity;
    let j = -1;
    const predicate = logic ?
    /** @type {RangeValueCallback} */
    ([value]) => value <= minMax :
    /** @type {RangeValueCallback} */
    ([value]) => value >= minMax;

    for (let i = 0; i < values.length; i++) {
      if (predicate(values[i])) {
        [minMax] = values[i];
        j = i;
      }
    }

    if (j > -1) {
      return values[j];
    }

    return [Infinity, true];
  }

  constructor() {
    /** @type {Array<RangeValue>} */
    this._left = [];
    /** @type {Array<RangeValue>} */

    this._right = [];
  }
  /**
   * @param {number} value
   * @param {boolean=} exclusive
   */


  left(value, exclusive = false) {
    this._left.push([value, exclusive]);
  }
  /**
   * @param {number} value
   * @param {boolean=} exclusive
   */


  right(value, exclusive = false) {
    this._right.push([value, exclusive]);
  }
  /**
   * @param {boolean} logic is not logic applied
   * @return {string} "smart" range string representation
   */


  format(logic = true) {
    const [start, leftExclusive] = Range.getRangeValue(this._left, logic);
    const [end, rightExclusive] = Range.getRangeValue(this._right, !logic);

    if (!Number.isFinite(start) && !Number.isFinite(end)) {
      return '';
    }

    const realStart = leftExclusive ? start + 1 : start;
    const realEnd = rightExclusive ? end - 1 : end; // e.g. 5 < x < 7, 5 < x <= 6, 6 <= x <= 6

    if (realStart === realEnd) {
      return `should be ${logic ? '' : '!'}= ${realStart}`;
    } // e.g. 4 < x < ∞


    if (Number.isFinite(start) && !Number.isFinite(end)) {
      return Range.formatLeft(start, logic, leftExclusive);
    } // e.g. ∞ < x < 4


    if (!Number.isFinite(start) && Number.isFinite(end)) {
      return Range.formatRight(end, logic, rightExclusive);
    }

    return Range.formatRange(start, end, leftExclusive, rightExclusive, logic);
  }

}

module.exports = Range;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1649338161650);
})()
//miniprogram-npm-outsideDeps=["ajv","ajv-keywords"]
//# sourceMappingURL=index.js.map