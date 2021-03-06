module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1649338160484, function(require, module, exports) {
var __TEMP__ = require('@tarojs/shared');var isFunction = __TEMP__['isFunction'];var isUndefined = __TEMP__['isUndefined'];var isObject = __TEMP__['isObject'];var warn = __TEMP__['warn'];var isArray = __TEMP__['isArray'];var toCamelCase = __TEMP__['toCamelCase'];var noop = __TEMP__['noop'];var ensure = __TEMP__['ensure'];var toDashed = __TEMP__['toDashed'];var isString = __TEMP__['isString'];var EMPTY_OBJ = __TEMP__['EMPTY_OBJ'];var internalComponents = __TEMP__['internalComponents'];var controlledComponent = __TEMP__['controlledComponent'];var defaultReconciler = __TEMP__['defaultReconciler'];
var __TEMP__ = require('inversify');var injectable = __TEMP__['injectable'];var inject = __TEMP__['inject'];var ContainerModule = __TEMP__['ContainerModule'];var optional = __TEMP__['optional'];var multiInject = __TEMP__['multiInject'];var Container = __TEMP__['Container'];

/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

if (process.env.TARO_ENV === 'h5') {
  require('reflect-metadata');
} else {
  // var Reflect;
  (function (Reflect) {
      // Metadata Proposal
      // https://rbuckton.github.io/reflect-metadata/
      (function (factory) {
          // var root = typeof global === "object" ? global :
          //     typeof self === "object" ? self :
          //         typeof this === "object" ? this :
          //             Function("return this;")();
          var exporter = makeExporter(Reflect);
          // if (typeof root.Reflect === "undefined") {
          //     root.Reflect = Reflect;
          // }
          // else {
          //     exporter = makeExporter(root.Reflect, exporter);
          // }
          factory(exporter);
          function makeExporter(target, previous) {
              return function (key, value) {
                  if (!isFunction(target[key])) {
                      Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
                  }
                  if (previous)
                      previous(key, value);
              };
          }
      })(function (exporter) {
          var hasOwn = Object.prototype.hasOwnProperty;
          // feature test for Symbol support
          var supportsSymbol = isFunction(Symbol);
          var toPrimitiveSymbol = supportsSymbol && !isUndefined(Symbol.toPrimitive) ? Symbol.toPrimitive : "@@toPrimitive";
          var iteratorSymbol = supportsSymbol && !isUndefined(Symbol.iterator) ? Symbol.iterator : "@@iterator";
          var supportsCreate = isFunction(Object.create); // feature test for Object.create support
          var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
          var downLevel = !supportsCreate && !supportsProto;
          var HashMap = {
              // create an object in dictionary mode (a.k.a. "slow" mode in v8)
              create: supportsCreate
                  ? function () { return MakeDictionary(Object.create(null)); }
                  : supportsProto
                      ? function () { return MakeDictionary({ __proto__: null }); }
                      : function () { return MakeDictionary({}); },
              has: downLevel
                  ? function (map, key) { return hasOwn.call(map, key); }
                  : function (map, key) { return key in map; },
              get: downLevel
                  ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
                  : function (map, key) { return map[key]; },
          };
          // Load global or shim versions of Map, Set, and WeakMap
          var functionPrototype = Object.getPrototypeOf(Function);
          var _Map = Map;
          var _Set = Set;
          var _WeakMap = isFunction(WeakMap) ? WeakMap : CreateWeakMapPolyfill();
          // [[Metadata]] internal slot
          // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
          var Metadata = new _WeakMap();
          /**
           * Applies a set of decorators to a property of a target object.
           * @param decorators An array of decorators.
           * @param target The target object.
           * @param propertyKey (Optional) The property key to decorate.
           * @param attributes (Optional) The property descriptor for the target key.
           * @remarks Decorators are applied in reverse order.
           * @example
           *
           *     class Example {
           *         // property declarations are not part of ES6, though they are valid in TypeScript:
           *         // static staticProperty;
           *         // property;
           *
           *         constructor(p) { }
           *         static staticMethod(p) { }
           *         method(p) { }
           *     }
           *
           *     // constructor
           *     Example = Reflect.decorate(decoratorsArray, Example);
           *
           *     // property (on constructor)
           *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
           *
           *     // property (on prototype)
           *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
           *
           *     // method (on constructor)
           *     Object.defineProperty(Example, "staticMethod",
           *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
           *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
           *
           *     // method (on prototype)
           *     Object.defineProperty(Example.prototype, "method",
           *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
           *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
           *
           */
          function decorate(decorators, target, propertyKey, attributes) {
              if (!IsUndefined(propertyKey)) {
                  if (!IsArray(decorators))
                      throw new TypeError();
                  if (!IsObject(target))
                      throw new TypeError();
                  if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                      throw new TypeError();
                  if (IsNull(attributes))
                      attributes = undefined;
                  propertyKey = ToPropertyKey(propertyKey);
                  return DecorateProperty(decorators, target, propertyKey, attributes);
              }
              else {
                  if (!IsArray(decorators))
                      throw new TypeError();
                  if (!IsConstructor(target))
                      throw new TypeError();
                  return DecorateConstructor(decorators, target);
              }
          }
          exporter("decorate", decorate);
          // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
          // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
          /**
           * A default metadata decorator factory that can be used on a class, class member, or parameter.
           * @param metadataKey The key for the metadata entry.
           * @param metadataValue The value for the metadata entry.
           * @returns A decorator function.
           * @remarks
           * If `metadataKey` is already defined for the target and target key, the
           * metadataValue for that key will be overwritten.
           * @example
           *
           *     // constructor
           *     @Reflect.metadata(key, value)
           *     class Example {
           *     }
           *
           *     // property (on constructor, TypeScript only)
           *     class Example {
           *         @Reflect.metadata(key, value)
           *         static staticProperty;
           *     }
           *
           *     // property (on prototype, TypeScript only)
           *     class Example {
           *         @Reflect.metadata(key, value)
           *         property;
           *     }
           *
           *     // method (on constructor)
           *     class Example {
           *         @Reflect.metadata(key, value)
           *         static staticMethod() { }
           *     }
           *
           *     // method (on prototype)
           *     class Example {
           *         @Reflect.metadata(key, value)
           *         method() { }
           *     }
           *
           */
          function metadata(metadataKey, metadataValue) {
              function decorator(target, propertyKey) {
                  if (!IsObject(target))
                      throw new TypeError();
                  if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                      throw new TypeError();
                  OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
              }
              return decorator;
          }
          exporter("metadata", metadata);
          /**
           * Define a unique metadata entry on the target.
           * @param metadataKey A key used to store and retrieve metadata.
           * @param metadataValue A value that contains attached metadata.
           * @param target The target object on which to define metadata.
           * @param propertyKey (Optional) The property key for the target.
           * @example
           *
           *     class Example {
           *         // property declarations are not part of ES6, though they are valid in TypeScript:
           *         // static staticProperty;
           *         // property;
           *
           *         constructor(p) { }
           *         static staticMethod(p) { }
           *         method(p) { }
           *     }
           *
           *     // constructor
           *     Reflect.defineMetadata("custom:annotation", options, Example);
           *
           *     // property (on constructor)
           *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
           *
           *     // property (on prototype)
           *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
           *
           *     // method (on constructor)
           *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
           *
           *     // method (on prototype)
           *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
           *
           *     // decorator factory as metadata-producing annotation.
           *     function MyAnnotation(options): Decorator {
           *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
           *     }
           *
           */
          function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
              if (!IsObject(target))
                  throw new TypeError();
              if (!IsUndefined(propertyKey))
                  propertyKey = ToPropertyKey(propertyKey);
              return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
          }
          exporter("defineMetadata", defineMetadata);
          /**
           * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
           * @param metadataKey A key used to store and retrieve metadata.
           * @param target The target object on which the metadata is defined.
           * @param propertyKey (Optional) The property key for the target.
           * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
           * @example
           *
           *     class Example {
           *         // property declarations are not part of ES6, though they are valid in TypeScript:
           *         // static staticProperty;
           *         // property;
           *
           *         constructor(p) { }
           *         static staticMethod(p) { }
           *         method(p) { }
           *     }
           *
           *     // constructor
           *     result = Reflect.hasMetadata("custom:annotation", Example);
           *
           *     // property (on constructor)
           *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
           *
           *     // property (on prototype)
           *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
           *
           *     // method (on constructor)
           *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
           *
           *     // method (on prototype)
           *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
           *
           */
          function hasMetadata(metadataKey, target, propertyKey) {
              if (!IsObject(target))
                  throw new TypeError();
              if (!IsUndefined(propertyKey))
                  propertyKey = ToPropertyKey(propertyKey);
              return OrdinaryHasMetadata(metadataKey, target, propertyKey);
          }
          exporter("hasMetadata", hasMetadata);
          /**
           * Gets a value indicating whether the target object has the provided metadata key defined.
           * @param metadataKey A key used to store and retrieve metadata.
           * @param target The target object on which the metadata is defined.
           * @param propertyKey (Optional) The property key for the target.
           * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
           * @example
           *
           *     class Example {
           *         // property declarations are not part of ES6, though they are valid in TypeScript:
           *         // static staticProperty;
           *         // property;
           *
           *         constructor(p) { }
           *         static staticMethod(p) { }
           *         method(p) { }
           *     }
           *
           *     // constructor
           *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
           *
           *     // property (on constructor)
           *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
           *
           *     // property (on prototype)
           *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
           *
           *     // method (on constructor)
           *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
           *
           *     // method (on prototype)
           *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
           *
           */
          function hasOwnMetadata(metadataKey, target, propertyKey) {
              if (!IsObject(target))
                  throw new TypeError();
              if (!IsUndefined(propertyKey))
                  propertyKey = ToPropertyKey(propertyKey);
              return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
          }
          exporter("hasOwnMetadata", hasOwnMetadata);
          /**
           * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
           * @param metadataKey A key used to store and retrieve metadata.
           * @param target The target object on which the metadata is defined.
           * @param propertyKey (Optional) The property key for the target.
           * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
           * @example
           *
           *     class Example {
           *         // property declarations are not part of ES6, though they are valid in TypeScript:
           *         // static staticProperty;
           *         // property;
           *
           *         constructor(p) { }
           *         static staticMethod(p) { }
           *         method(p) { }
           *     }
           *
           *     // constructor
           *     result = Reflect.getMetadata("custom:annotation", Example);
           *
           *     // property (on constructor)
           *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
           *
           *     // property (on prototype)
           *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
           *
           *     // method (on constructor)
           *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
           *
           *     // method (on prototype)
           *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
           *
           */
          function getMetadata(metadataKey, target, propertyKey) {
              if (!IsObject(target))
                  throw new TypeError();
              if (!IsUndefined(propertyKey))
                  propertyKey = ToPropertyKey(propertyKey);
              return OrdinaryGetMetadata(metadataKey, target, propertyKey);
          }
          exporter("getMetadata", getMetadata);
          /**
           * Gets the metadata value for the provided metadata key on the target object.
           * @param metadataKey A key used to store and retrieve metadata.
           * @param target The target object on which the metadata is defined.
           * @param propertyKey (Optional) The property key for the target.
           * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
           * @example
           *
           *     class Example {
           *         // property declarations are not part of ES6, though they are valid in TypeScript:
           *         // static staticProperty;
           *         // property;
           *
           *         constructor(p) { }
           *         static staticMethod(p) { }
           *         method(p) { }
           *     }
           *
           *     // constructor
           *     result = Reflect.getOwnMetadata("custom:annotation", Example);
           *
           *     // property (on constructor)
           *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
           *
           *     // property (on prototype)
           *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
           *
           *     // method (on constructor)
           *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
           *
           *     // method (on prototype)
           *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
           *
           */
          function getOwnMetadata(metadataKey, target, propertyKey) {
              if (!IsObject(target))
                  throw new TypeError();
              if (!IsUndefined(propertyKey))
                  propertyKey = ToPropertyKey(propertyKey);
              return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
          }
          exporter("getOwnMetadata", getOwnMetadata);
          /**
           * Gets the metadata keys defined on the target object or its prototype chain.
           * @param target The target object on which the metadata is defined.
           * @param propertyKey (Optional) The property key for the target.
           * @returns An array of unique metadata keys.
           * @example
           *
           *     class Example {
           *         // property declarations are not part of ES6, though they are valid in TypeScript:
           *         // static staticProperty;
           *         // property;
           *
           *         constructor(p) { }
           *         static staticMethod(p) { }
           *         method(p) { }
           *     }
           *
           *     // constructor
           *     result = Reflect.getMetadataKeys(Example);
           *
           *     // property (on constructor)
           *     result = Reflect.getMetadataKeys(Example, "staticProperty");
           *
           *     // property (on prototype)
           *     result = Reflect.getMetadataKeys(Example.prototype, "property");
           *
           *     // method (on constructor)
           *     result = Reflect.getMetadataKeys(Example, "staticMethod");
           *
           *     // method (on prototype)
           *     result = Reflect.getMetadataKeys(Example.prototype, "method");
           *
           */
          function getMetadataKeys(target, propertyKey) {
              if (!IsObject(target))
                  throw new TypeError();
              if (!IsUndefined(propertyKey))
                  propertyKey = ToPropertyKey(propertyKey);
              return OrdinaryMetadataKeys(target, propertyKey);
          }
          exporter("getMetadataKeys", getMetadataKeys);
          /**
           * Gets the unique metadata keys defined on the target object.
           * @param target The target object on which the metadata is defined.
           * @param propertyKey (Optional) The property key for the target.
           * @returns An array of unique metadata keys.
           * @example
           *
           *     class Example {
           *         // property declarations are not part of ES6, though they are valid in TypeScript:
           *         // static staticProperty;
           *         // property;
           *
           *         constructor(p) { }
           *         static staticMethod(p) { }
           *         method(p) { }
           *     }
           *
           *     // constructor
           *     result = Reflect.getOwnMetadataKeys(Example);
           *
           *     // property (on constructor)
           *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
           *
           *     // property (on prototype)
           *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
           *
           *     // method (on constructor)
           *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
           *
           *     // method (on prototype)
           *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
           *
           */
          function getOwnMetadataKeys(target, propertyKey) {
              if (!IsObject(target))
                  throw new TypeError();
              if (!IsUndefined(propertyKey))
                  propertyKey = ToPropertyKey(propertyKey);
              return OrdinaryOwnMetadataKeys(target, propertyKey);
          }
          exporter("getOwnMetadataKeys", getOwnMetadataKeys);
          /**
           * Deletes the metadata entry from the target object with the provided key.
           * @param metadataKey A key used to store and retrieve metadata.
           * @param target The target object on which the metadata is defined.
           * @param propertyKey (Optional) The property key for the target.
           * @returns `true` if the metadata entry was found and deleted; otherwise, false.
           * @example
           *
           *     class Example {
           *         // property declarations are not part of ES6, though they are valid in TypeScript:
           *         // static staticProperty;
           *         // property;
           *
           *         constructor(p) { }
           *         static staticMethod(p) { }
           *         method(p) { }
           *     }
           *
           *     // constructor
           *     result = Reflect.deleteMetadata("custom:annotation", Example);
           *
           *     // property (on constructor)
           *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
           *
           *     // property (on prototype)
           *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
           *
           *     // method (on constructor)
           *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
           *
           *     // method (on prototype)
           *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
           *
           */
          function deleteMetadata(metadataKey, target, propertyKey) {
              if (!IsObject(target))
                  throw new TypeError();
              if (!IsUndefined(propertyKey))
                  propertyKey = ToPropertyKey(propertyKey);
              var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
              if (IsUndefined(metadataMap))
                  return false;
              if (!metadataMap.delete(metadataKey))
                  return false;
              if (metadataMap.size > 0)
                  return true;
              var targetMetadata = Metadata.get(target);
              targetMetadata.delete(propertyKey);
              if (targetMetadata.size > 0)
                  return true;
              Metadata.delete(target);
              return true;
          }
          exporter("deleteMetadata", deleteMetadata);
          function DecorateConstructor(decorators, target) {
              for (var i = decorators.length - 1; i >= 0; --i) {
                  var decorator = decorators[i];
                  var decorated = decorator(target);
                  if (!IsUndefined(decorated) && !IsNull(decorated)) {
                      if (!IsConstructor(decorated))
                          throw new TypeError();
                      target = decorated;
                  }
              }
              return target;
          }
          function DecorateProperty(decorators, target, propertyKey, descriptor) {
              for (var i = decorators.length - 1; i >= 0; --i) {
                  var decorator = decorators[i];
                  var decorated = decorator(target, propertyKey, descriptor);
                  if (!IsUndefined(decorated) && !IsNull(decorated)) {
                      if (!IsObject(decorated))
                          throw new TypeError();
                      descriptor = decorated;
                  }
              }
              return descriptor;
          }
          function GetOrCreateMetadataMap(O, P, Create) {
              var targetMetadata = Metadata.get(O);
              if (IsUndefined(targetMetadata)) {
                  if (!Create)
                      return undefined;
                  targetMetadata = new _Map();
                  Metadata.set(O, targetMetadata);
              }
              var metadataMap = targetMetadata.get(P);
              if (IsUndefined(metadataMap)) {
                  if (!Create)
                      return undefined;
                  metadataMap = new _Map();
                  targetMetadata.set(P, metadataMap);
              }
              return metadataMap;
          }
          // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
          // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
          function OrdinaryHasMetadata(MetadataKey, O, P) {
              var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
              if (hasOwn)
                  return true;
              var parent = OrdinaryGetPrototypeOf(O);
              if (!IsNull(parent))
                  return OrdinaryHasMetadata(MetadataKey, parent, P);
              return false;
          }
          // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
          // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
          function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
              var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
              if (IsUndefined(metadataMap))
                  return false;
              return ToBoolean(metadataMap.has(MetadataKey));
          }
          // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
          // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
          function OrdinaryGetMetadata(MetadataKey, O, P) {
              var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
              if (hasOwn)
                  return OrdinaryGetOwnMetadata(MetadataKey, O, P);
              var parent = OrdinaryGetPrototypeOf(O);
              if (!IsNull(parent))
                  return OrdinaryGetMetadata(MetadataKey, parent, P);
              return undefined;
          }
          // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
          // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
          function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
              var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
              if (IsUndefined(metadataMap))
                  return undefined;
              return metadataMap.get(MetadataKey);
          }
          // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
          // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
          function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
              var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
              metadataMap.set(MetadataKey, MetadataValue);
          }
          // 3.1.6.1 OrdinaryMetadataKeys(O, P)
          // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
          function OrdinaryMetadataKeys(O, P) {
              var ownKeys = OrdinaryOwnMetadataKeys(O, P);
              var parent = OrdinaryGetPrototypeOf(O);
              if (parent === null)
                  return ownKeys;
              var parentKeys = OrdinaryMetadataKeys(parent, P);
              if (parentKeys.length <= 0)
                  return ownKeys;
              if (ownKeys.length <= 0)
                  return parentKeys;
              var set = new _Set();
              var keys = [];
              for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
                  var key = ownKeys_1[_i];
                  var hasKey = set.has(key);
                  if (!hasKey) {
                      set.add(key);
                      keys.push(key);
                  }
              }
              for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
                  var key = parentKeys_1[_a];
                  var hasKey = set.has(key);
                  if (!hasKey) {
                      set.add(key);
                      keys.push(key);
                  }
              }
              return keys;
          }
          // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
          // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
          function OrdinaryOwnMetadataKeys(O, P) {
              var keys = [];
              var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
              if (IsUndefined(metadataMap))
                  return keys;
              var keysObj = metadataMap.keys();
              var iterator = GetIterator(keysObj);
              var k = 0;
              while (true) {
                  var next = IteratorStep(iterator);
                  if (!next) {
                      keys.length = k;
                      return keys;
                  }
                  var nextValue = IteratorValue(next);
                  try {
                      keys[k] = nextValue;
                  }
                  catch (e) {
                      try {
                          IteratorClose(iterator);
                      }
                      finally {
                          throw e;
                      }
                  }
                  k++;
              }
          }
          // 6 ECMAScript Data Typ0es and Values
          // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
          function Type(x) {
              if (x === null)
                  return 1 /* Null */;
              switch (typeof x) {
                  case "undefined": return 0 /* Undefined */;
                  case "boolean": return 2 /* Boolean */;
                  case "string": return 3 /* String */;
                  case "symbol": return 4 /* Symbol */;
                  case "number": return 5 /* Number */;
                  case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
                  default: return 6 /* Object */;
              }
          }
          // 6.1.1 The Undefined Type
          // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
          function IsUndefined(x) {
              return x === undefined;
          }
          // 6.1.2 The Null Type
          // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
          function IsNull(x) {
              return x === null;
          }
          // 6.1.5 The Symbol Type
          // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
          function IsSymbol(x) {
              return typeof x === "symbol";
          }
          // 6.1.7 The Object Type
          // https://tc39.github.io/ecma262/#sec-object-type
          function IsObject(x) {
              return isObject(x) ? x !== null : isFunction(x);
          }
          // 7.1 Type Conversion
          // https://tc39.github.io/ecma262/#sec-type-conversion
          // 7.1.1 ToPrimitive(input [, PreferredType])
          // https://tc39.github.io/ecma262/#sec-toprimitive
          function ToPrimitive(input, PreferredType) {
              switch (Type(input)) {
                  case 0 /* Undefined */: return input;
                  case 1 /* Null */: return input;
                  case 2 /* Boolean */: return input;
                  case 3 /* String */: return input;
                  case 4 /* Symbol */: return input;
                  case 5 /* Number */: return input;
              }
              var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
              var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
              if (exoticToPrim !== undefined) {
                  var result = exoticToPrim.call(input, hint);
                  if (IsObject(result))
                      throw new TypeError();
                  return result;
              }
              return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
          }
          // 7.1.1.1 OrdinaryToPrimitive(O, hint)
          // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
          function OrdinaryToPrimitive(O, hint) {
              if (hint === "string") {
                  var toString_1 = O.toString;
                  if (IsCallable(toString_1)) {
                      var result = toString_1.call(O);
                      if (!IsObject(result))
                          return result;
                  }
                  var valueOf = O.valueOf;
                  if (IsCallable(valueOf)) {
                      var result = valueOf.call(O);
                      if (!IsObject(result))
                          return result;
                  }
              }
              else {
                  var valueOf = O.valueOf;
                  if (IsCallable(valueOf)) {
                      var result = valueOf.call(O);
                      if (!IsObject(result))
                          return result;
                  }
                  var toString_2 = O.toString;
                  if (IsCallable(toString_2)) {
                      var result = toString_2.call(O);
                      if (!IsObject(result))
                          return result;
                  }
              }
              throw new TypeError();
          }
          // 7.1.2 ToBoolean(argument)
          // https://tc39.github.io/ecma262/2016/#sec-toboolean
          function ToBoolean(argument) {
              return !!argument;
          }
          // 7.1.12 ToString(argument)
          // https://tc39.github.io/ecma262/#sec-tostring
          function ToString(argument) {
              return "" + argument;
          }
          // 7.1.14 ToPropertyKey(argument)
          // https://tc39.github.io/ecma262/#sec-topropertykey
          function ToPropertyKey(argument) {
              var key = ToPrimitive(argument, 3 /* String */);
              if (IsSymbol(key))
                  return key;
              return ToString(key);
          }
          // 7.2 Testing and Comparison Operations
          // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
          // 7.2.2 IsArray(argument)
          // https://tc39.github.io/ecma262/#sec-isarray
          function IsArray(argument) {
              return Array.isArray
                  ? Array.isArray(argument)
                  : argument instanceof Object
                      ? argument instanceof Array
                      : Object.prototype.toString.call(argument) === "[object Array]";
          }
          // 7.2.3 IsCallable(argument)
          // https://tc39.github.io/ecma262/#sec-iscallable
          function IsCallable(argument) {
              // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
              return isFunction(argument);
          }
          // 7.2.4 IsConstructor(argument)
          // https://tc39.github.io/ecma262/#sec-isconstructor
          function IsConstructor(argument) {
              // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
              return isFunction(argument);
          }
          // 7.2.7 IsPropertyKey(argument)
          // https://tc39.github.io/ecma262/#sec-ispropertykey
          function IsPropertyKey(argument) {
              switch (Type(argument)) {
                  case 3 /* String */: return true;
                  case 4 /* Symbol */: return true;
                  default: return false;
              }
          }
          // 7.3 Operations on Objects
          // https://tc39.github.io/ecma262/#sec-operations-on-objects
          // 7.3.9 GetMethod(V, P)
          // https://tc39.github.io/ecma262/#sec-getmethod
          function GetMethod(V, P) {
              var func = V[P];
              if (func === undefined || func === null)
                  return undefined;
              if (!IsCallable(func))
                  throw new TypeError();
              return func;
          }
          // 7.4 Operations on Iterator Objects
          // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
          function GetIterator(obj) {
              var method = GetMethod(obj, iteratorSymbol);
              if (!IsCallable(method))
                  throw new TypeError(); // from Call
              var iterator = method.call(obj);
              if (!IsObject(iterator))
                  throw new TypeError();
              return iterator;
          }
          // 7.4.4 IteratorValue(iterResult)
          // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
          function IteratorValue(iterResult) {
              return iterResult.value;
          }
          // 7.4.5 IteratorStep(iterator)
          // https://tc39.github.io/ecma262/#sec-iteratorstep
          function IteratorStep(iterator) {
              var result = iterator.next();
              return result.done ? false : result;
          }
          // 7.4.6 IteratorClose(iterator, completion)
          // https://tc39.github.io/ecma262/#sec-iteratorclose
          function IteratorClose(iterator) {
              var f = iterator["return"];
              if (f)
                  f.call(iterator);
          }
          // 9.1 Ordinary Object Internal Methods and Internal Slots
          // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
          // 9.1.1.1 OrdinaryGetPrototypeOf(O)
          // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
          function OrdinaryGetPrototypeOf(O) {
              var proto = Object.getPrototypeOf(O);
              if (!isFunction(O) || O === functionPrototype)
                  return proto;
              // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
              // Try to determine the superclass constructor. Compatible implementations
              // must either set __proto__ on a subclass constructor to the superclass constructor,
              // or ensure each class has a valid `constructor` property on its prototype that
              // points back to the constructor.
              // If this is not the same as Function.[[Prototype]], then this is definately inherited.
              // This is the case when in ES6 or when using __proto__ in a compatible browser.
              if (proto !== functionPrototype)
                  return proto;
              // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
              var prototype = O.prototype;
              var prototypeProto = prototype && Object.getPrototypeOf(prototype);
              if (prototypeProto == null || prototypeProto === Object.prototype)
                  return proto;
              // If the constructor was not a function, then we cannot determine the heritage.
              var constructor = prototypeProto.constructor;
              if (!isFunction(constructor))
                  return proto;
              // If we have some kind of self-reference, then we cannot determine the heritage.
              if (constructor === O)
                  return proto;
              // we have a pretty good guess at the heritage.
              return constructor;
          }
          // naive Map shim
          // function CreateMapPolyfill() {
          //     var cacheSentinel = {};
          //     var arraySentinel = [];
          //     var MapIterator = /** @class */ (function () {
          //         function MapIterator(keys, values, selector) {
          //             this._index = 0;
          //             this._keys = keys;
          //             this._values = values;
          //             this._selector = selector;
          //         }
          //         MapIterator.prototype["@@iterator"] = function () { return this; };
          //         MapIterator.prototype[iteratorSymbol] = function () { return this; };
          //         MapIterator.prototype.next = function () {
          //             var index = this._index;
          //             if (index >= 0 && index < this._keys.length) {
          //                 var result = this._selector(this._keys[index], this._values[index]);
          //                 if (index + 1 >= this._keys.length) {
          //                     this._index = -1;
          //                     this._keys = arraySentinel;
          //                     this._values = arraySentinel;
          //                 }
          //                 else {
          //                     this._index++;
          //                 }
          //                 return { value: result, done: false };
          //             }
          //             return { value: undefined, done: true };
          //         };
          //         MapIterator.prototype.throw = function (error) {
          //             if (this._index >= 0) {
          //                 this._index = -1;
          //                 this._keys = arraySentinel;
          //                 this._values = arraySentinel;
          //             }
          //             throw error;
          //         };
          //         MapIterator.prototype.return = function (value) {
          //             if (this._index >= 0) {
          //                 this._index = -1;
          //                 this._keys = arraySentinel;
          //                 this._values = arraySentinel;
          //             }
          //             return { value: value, done: true };
          //         };
          //         return MapIterator;
          //     }());
          //     return /** @class */ (function () {
          //         function Map() {
          //             this._keys = [];
          //             this._values = [];
          //             this._cacheKey = cacheSentinel;
          //             this._cacheIndex = -2;
          //         }
          //         Object.defineProperty(Map.prototype, "size", {
          //             get: function () { return this._keys.length; },
          //             enumerable: true,
          //             configurable: true
          //         });
          //         Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
          //         Map.prototype.get = function (key) {
          //             var index = this._find(key, /*insert*/ false);
          //             return index >= 0 ? this._values[index] : undefined;
          //         };
          //         Map.prototype.set = function (key, value) {
          //             var index = this._find(key, /*insert*/ true);
          //             this._values[index] = value;
          //             return this;
          //         };
          //         Map.prototype.delete = function (key) {
          //             var index = this._find(key, /*insert*/ false);
          //             if (index >= 0) {
          //                 var size = this._keys.length;
          //                 for (var i = index + 1; i < size; i++) {
          //                     this._keys[i - 1] = this._keys[i];
          //                     this._values[i - 1] = this._values[i];
          //                 }
          //                 this._keys.length--;
          //                 this._values.length--;
          //                 if (key === this._cacheKey) {
          //                     this._cacheKey = cacheSentinel;
          //                     this._cacheIndex = -2;
          //                 }
          //                 return true;
          //             }
          //             return false;
          //         };
          //         Map.prototype.clear = function () {
          //             this._keys.length = 0;
          //             this._values.length = 0;
          //             this._cacheKey = cacheSentinel;
          //             this._cacheIndex = -2;
          //         };
          //         Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
          //         Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
          //         Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
          //         Map.prototype["@@iterator"] = function () { return this.entries(); };
          //         Map.prototype[iteratorSymbol] = function () { return this.entries(); };
          //         Map.prototype._find = function (key, insert) {
          //             if (this._cacheKey !== key) {
          //                 this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
          //             }
          //             if (this._cacheIndex < 0 && insert) {
          //                 this._cacheIndex = this._keys.length;
          //                 this._keys.push(key);
          //                 this._values.push(undefined);
          //             }
          //             return this._cacheIndex;
          //         };
          //         return Map;
          //     }());
          //     function getKey(key, _) {
          //         return key;
          //     }
          //     function getValue(_, value) {
          //         return value;
          //     }
          //     function getEntry(key, value) {
          //         return [key, value];
          //     }
          // }
          // naive Set shim
          // function CreateSetPolyfill() {
          //     return /** @class */ (function () {
          //         function Set() {
          //             this._map = new _Map();
          //         }
          //         Object.defineProperty(Set.prototype, "size", {
          //             get: function () { return this._map.size; },
          //             enumerable: true,
          //             configurable: true
          //         });
          //         Set.prototype.has = function (value) { return this._map.has(value); };
          //         Set.prototype.add = function (value) { return this._map.set(value, value), this; };
          //         Set.prototype.delete = function (value) { return this._map.delete(value); };
          //         Set.prototype.clear = function () { this._map.clear(); };
          //         Set.prototype.keys = function () { return this._map.keys(); };
          //         Set.prototype.values = function () { return this._map.values(); };
          //         Set.prototype.entries = function () { return this._map.entries(); };
          //         Set.prototype["@@iterator"] = function () { return this.keys(); };
          //         Set.prototype[iteratorSymbol] = function () { return this.keys(); };
          //         return Set;
          //     }());
          // }
          // naive WeakMap shim
          function CreateWeakMapPolyfill() {
              var UUID_SIZE = 16;
              var keys = HashMap.create();
              var rootKey = CreateUniqueKey();
              return /** @class */ (function () {
                  function WeakMap() {
                      this._key = CreateUniqueKey();
                  }
                  WeakMap.prototype.has = function (target) {
                      var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                      return table !== undefined ? HashMap.has(table, this._key) : false;
                  };
                  WeakMap.prototype.get = function (target) {
                      var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                      return table !== undefined ? HashMap.get(table, this._key) : undefined;
                  };
                  WeakMap.prototype.set = function (target, value) {
                      var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                      table[this._key] = value;
                      return this;
                  };
                  WeakMap.prototype.delete = function (target) {
                      var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                      return table !== undefined ? delete table[this._key] : false;
                  };
                  WeakMap.prototype.clear = function () {
                      // NOTE: not a real clear, just makes the previous data unreachable
                      this._key = CreateUniqueKey();
                  };
                  return WeakMap;
              }());
              function CreateUniqueKey() {
                  var key;
                  do
                      key = "@@WeakMap@@" + CreateUUID();
                  while (HashMap.has(keys, key));
                  keys[key] = true;
                  return key;
              }
              function GetOrCreateWeakMapTable(target, create) {
                  if (!hasOwn.call(target, rootKey)) {
                      if (!create)
                          return undefined;
                      Object.defineProperty(target, rootKey, { value: HashMap.create() });
                  }
                  return target[rootKey];
              }
              function FillRandomBytes(buffer, size) {
                  for (var i = 0; i < size; ++i)
                      buffer[i] = Math.random() * 0xff | 0;
                  return buffer;
              }
              function GenRandomBytes(size) {
                  if (isFunction(Uint8Array)) {
                      if (!isUndefined(crypto))
                          return crypto.getRandomValues(new Uint8Array(size));
                      if (!isUndefined(msCrypto))
                          return msCrypto.getRandomValues(new Uint8Array(size));
                      return FillRandomBytes(new Uint8Array(size), size);
                  }
                  return FillRandomBytes(new Array(size), size);
              }
              function CreateUUID() {
                  var data = GenRandomBytes(UUID_SIZE);
                  // mark as random - RFC 4122 ?? 4.4
                  data[6] = data[6] & 0x4f | 0x40;
                  data[8] = data[8] & 0xbf | 0x80;
                  var result = "";
                  for (var offset = 0; offset < UUID_SIZE; ++offset) {
                      var byte = data[offset];
                      if (offset === 4 || offset === 6 || offset === 8)
                          result += "-";
                      if (byte < 16)
                          result += "0";
                      result += byte.toString(16).toLowerCase();
                  }
                  return result;
              }
          }
          // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
          function MakeDictionary(obj) {
              obj.__ = undefined;
              delete obj.__;
              return obj;
          }
      });
  })(Reflect || (Reflect = {}));
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

const PROPERTY_THRESHOLD = 2046;
const SET_DATA = '????????? setData';
const PAGE_INIT = '???????????????';
const ROOT_STR = 'root';
const HTML = 'html';
const HEAD = 'head';
const BODY = 'body';
const APP = 'app';
const CONTAINER = 'container';
const DOCUMENT_ELEMENT_NAME = '#document';
const DOCUMENT_FRAGMENT = 'document-fragment';
const ID = 'id';
const UID = 'uid';
const CLASS = 'class';
const STYLE = 'style';
const FOCUS = 'focus';
const VIEW = 'view';
const STATIC_VIEW = 'static-view';
const PURE_VIEW = 'pure-view';
const PROPS = 'props';
const DATASET = 'dataset';
const OBJECT = 'object';
const VALUE = 'value';
const INPUT = 'input';
const CHANGE = 'change';
const CUSTOM_WRAPPER = 'custom-wrapper';
const TARGET = 'target';
const CURRENT_TARGET = 'currentTarget';
const TYPE = 'type';
const CONFIRM = 'confirm';
const TIME_STAMP = 'timeStamp';
const KEY_CODE = 'keyCode';
const TOUCHMOVE = 'touchmove';
const DATE = 'Date';
const CATCHMOVE = 'catchMove';
const CATCH_VIEW = 'catch-view';
const COMMENT = 'comment';
const ON_LOAD = 'onLoad';
const ON_READY = 'onReady';
const ON_SHOW = 'onShow';
const ON_HIDE = 'onHide';
const OPTIONS = 'options';
const EXTERNAL_CLASSES = 'externalClasses';
const BEHAVIORS = 'behaviors';

const incrementId = () => {
    let id = 0;
    return () => (id++).toString();
};
function isElement(node) {
    return node.nodeType === 1 /* ELEMENT_NODE */;
}
function isText(node) {
    return node.nodeType === 3 /* TEXT_NODE */;
}
function isComment(node) {
    return node.nodeName === COMMENT;
}
function isHasExtractProp(el) {
    const res = Object.keys(el.props).find(prop => {
        return !(/^(class|style|id)$/.test(prop) || prop.startsWith('data-'));
    });
    return Boolean(res);
}
/**
 * ??????????????????????????? root?????????????????????????????????????????????????????????
 * @param node ????????????
 * @param type ????????????
 */
function isParentBinded(node, type) {
    var _a;
    let res = false;
    while ((node === null || node === void 0 ? void 0 : node.parentElement) && node.parentElement._path !== ROOT_STR) {
        if ((_a = node.parentElement.__handlers[type]) === null || _a === void 0 ? void 0 : _a.length) {
            res = true;
            break;
        }
        node = node.parentElement;
    }
    return res;
}
function shortcutAttr(key) {
    switch (key) {
        case STYLE:
            return "st" /* Style */;
        case ID:
            return UID;
        case CLASS:
            return "cl" /* Class */;
        default:
            return key;
    }
}
const customWrapperCache = new Map();

const SID_TARO_ELEMENT = '0';
const SID_TARO_ELEMENT_FACTORY = '1';
const SID_TARO_TEXT = '2';
const SID_TARO_TEXT_FACTORY = '3';
const SID_TARO_NODE_IMPL = '4';
const SID_TARO_ELEMENT_IMPL = '5';
const SID_HOOKS = '6';
const SID_ON_REMOVE_ATTRIBUTE = '7';
const SID_GET_MINI_LIFECYCLE = '8';
const SID_GET_LIFECYCLE = '9';
const SID_GET_PATH_INDEX = '10';
const SID_GET_EVENT_CENTER = '11';
const SID_IS_BUBBLE_EVENTS = '12';
const SID_GET_SPECIAL_NODES = '13';
const SID_EVENT_CENTER = '14';
const SID_MODIFY_MP_EVENT = '15';
const SID_MODIFY_TARO_EVENT = '16';
const SID_MODIFY_DISPATCH_EVENT = '17';
const SID_BATCHED_EVENT_UPDATES = '18';
const SID_MERGE_PAGE_INSTANCE = '19';
const SID_CREATE_PULLDOWN_COMPONENT = '20';
const SID_GET_DOM_NODE = '21';
const SID_INIT_NATIVE_API = '22';
const SID_MODIFY_HYDRATE_DATA = '23';
const SID_MODIFY_SET_ATTR_PAYLOAD = '24';
const SID_MODIFY_RM_ATTR_PAYLOAD = '25';
const SID_ON_ADD_EVENT = '26';
const SID_PATCH_ELEMENT = '27';
const SID_MODIFY_PAGE_OBJECT = '28';
const SERVICE_IDENTIFIER = {
    TaroElement: SID_TARO_ELEMENT,
    TaroElementFactory: SID_TARO_ELEMENT_FACTORY,
    TaroText: SID_TARO_TEXT,
    TaroTextFactory: SID_TARO_TEXT_FACTORY,
    TaroNodeImpl: SID_TARO_NODE_IMPL,
    TaroElementImpl: SID_TARO_ELEMENT_IMPL,
    Hooks: SID_HOOKS,
    onRemoveAttribute: SID_ON_REMOVE_ATTRIBUTE,
    getMiniLifecycle: SID_GET_MINI_LIFECYCLE,
    getLifecycle: SID_GET_LIFECYCLE,
    getPathIndex: SID_GET_PATH_INDEX,
    getEventCenter: SID_GET_EVENT_CENTER,
    isBubbleEvents: SID_IS_BUBBLE_EVENTS,
    getSpecialNodes: SID_GET_SPECIAL_NODES,
    eventCenter: SID_EVENT_CENTER,
    modifyMpEvent: SID_MODIFY_MP_EVENT,
    modifyTaroEvent: SID_MODIFY_TARO_EVENT,
    modifyDispatchEvent: SID_MODIFY_DISPATCH_EVENT,
    batchedEventUpdates: SID_BATCHED_EVENT_UPDATES,
    mergePageInstance: SID_MERGE_PAGE_INSTANCE,
    createPullDownComponent: SID_CREATE_PULLDOWN_COMPONENT,
    getDOMNode: SID_GET_DOM_NODE,
    initNativeApi: SID_INIT_NATIVE_API,
    modifyHydrateData: SID_MODIFY_HYDRATE_DATA,
    modifySetAttrPayload: SID_MODIFY_SET_ATTR_PAYLOAD,
    modifyRmAttrPayload: SID_MODIFY_RM_ATTR_PAYLOAD,
    onAddEvent: SID_ON_ADD_EVENT,
    patchElement: SID_PATCH_ELEMENT,
    modifyPageObject: SID_MODIFY_PAGE_OBJECT
};

var ElementNames;
(function (ElementNames) {
    ElementNames["Element"] = "Element";
    ElementNames["Document"] = "Document";
    ElementNames["RootElement"] = "RootElement";
    ElementNames["FormElement"] = "FormElement";
})(ElementNames || (ElementNames = {}));

const store = {
    container: null
};
function getHooks() {
    return store.container.get(SID_HOOKS);
}
function getElementFactory() {
    return store.container.get(SID_TARO_ELEMENT_FACTORY);
}
function getNodeImpl() {
    return store.container.get(SID_TARO_NODE_IMPL);
}
function getElementImpl() {
    return store.container.get(SID_TARO_ELEMENT_IMPL);
}
function getDocument() {
    const getElement = getElementFactory();
    return getElement(ElementNames.Document)();
}

let TaroEventTarget = class TaroEventTarget {
    constructor() {
        this.__handlers = {};
        this.hooks = getHooks();
    }
    addEventListener(type, handler, options) {
        var _a, _b;
        type = type.toLowerCase();
        (_b = (_a = this.hooks).onAddEvent) === null || _b === void 0 ? void 0 : _b.call(_a, type, handler, options, this);
        if (type === 'regionchange') {
            // map ????????? regionchange ??????????????????????????????https://github.com/NervJS/taro/issues/5766
            this.addEventListener('begin', handler, options);
            this.addEventListener('end', handler, options);
            return;
        }
        let isCapture = Boolean(options);
        let isOnce = false;
        if (isObject(options)) {
            isCapture = Boolean(options.capture);
            isOnce = Boolean(options.once);
        }
        if (isOnce) {
            const wrapper = function () {
                handler.apply(this, arguments); // this ?????? Element
                this.removeEventListener(type, wrapper);
            };
            this.addEventListener(type, wrapper, Object.assign(Object.assign({}, options), { once: false }));
            return;
        }
        process.env.NODE_ENV !== 'production' && warn(isCapture, 'Taro ???????????? event ??? capture ?????????');
        // ?????????????????? PReact ?????????????????????handler ????????????????????????
        // ???????????????????????????????????????view -> view(handler.stop = false) -> view(handler.stop = true)
        // ???????????????view -> view(handlerA.stop = false) -> view(handlerB.stop = false)
        // ???????????????????????????????????????????????????????????????????????????????????????????????????????????? PReact ????????????
        const oldHandler = handler;
        handler = function () {
            oldHandler.apply(this, arguments); // this ?????? Element
        };
        handler.oldHandler = oldHandler;
        const handlers = this.__handlers[type];
        if (isArray(handlers)) {
            handlers.push(handler);
        }
        else {
            this.__handlers[type] = [handler];
        }
    }
    removeEventListener(type, handler) {
        type = type.toLowerCase();
        if (!handler) {
            return;
        }
        const handlers = this.__handlers[type];
        if (!isArray(handlers)) {
            return;
        }
        const index = handlers.findIndex(item => {
            if (item === handler || item.oldHandler === handler)
                return true;
        });
        process.env.NODE_ENV !== 'production' && warn(index === -1, `??????: '${type}' ??????????????? DOM ??????????????????????????????`);
        handlers.splice(index, 1);
    }
    isAnyEventBinded() {
        const handlers = this.__handlers;
        const isAnyEventBinded = Object.keys(handlers).find(key => handlers[key].length);
        return Boolean(isAnyEventBinded);
    }
};
TaroEventTarget = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], TaroEventTarget);

/**
 * React also has a fancy function's name for this: `hydrate()`.
 * You may have been heard `hydrate` as a SSR-related function,
 * actually, `hydrate` basicly do the `render()` thing, but ignore some properties,
 * it's a vnode traverser and modifier: that's exactly what Taro's doing in here.
 */
function hydrate(node) {
    var _a, _b;
    const nodeName = node.nodeName;
    if (isText(node)) {
        return {
            ["v" /* Text */]: node.nodeValue,
            ["nn" /* NodeName */]: nodeName
        };
    }
    const data = {
        ["nn" /* NodeName */]: nodeName,
        sid: node.sid
    };
    const { props } = node;
    const SPECIAL_NODES = node.hooks.getSpecialNodes();
    if (node.uid !== node.sid) {
        data.uid = node.uid;
    }
    if (!node.isAnyEventBinded() && SPECIAL_NODES.indexOf(nodeName) > -1) {
        data["nn" /* NodeName */] = `static-${nodeName}`;
        if (nodeName === VIEW && !isHasExtractProp(node)) {
            data["nn" /* NodeName */] = PURE_VIEW;
        }
    }
    for (const prop in props) {
        const propInCamelCase = toCamelCase(prop);
        if (!prop.startsWith('data-') && // ??? node.dataset ?????????
            prop !== CLASS &&
            prop !== STYLE &&
            prop !== ID &&
            propInCamelCase !== CATCHMOVE) {
            data[propInCamelCase] = props[prop];
        }
        if (nodeName === VIEW && propInCamelCase === CATCHMOVE && props[prop] !== false) {
            data["nn" /* NodeName */] = CATCH_VIEW;
        }
    }
    let { childNodes } = node;
    // ?????? comment ??????
    childNodes = childNodes.filter(node => !isComment(node));
    if (childNodes.length > 0) {
        data["cn" /* Childnodes */] = childNodes.map(hydrate);
    }
    else {
        data["cn" /* Childnodes */] = [];
    }
    if (node.className !== '') {
        data["cl" /* Class */] = node.className;
    }
    if (node.cssText !== '' && nodeName !== 'swiper-item') {
        data["st" /* Style */] = node.cssText;
    }
    (_b = (_a = node.hooks).modifyHydrateData) === null || _b === void 0 ? void 0 : _b.call(_a, data);
    return data;
}

class EventSource extends Map {
    removeNode(child) {
        const { sid, uid } = child;
        this.delete(sid);
        if (uid !== sid && uid)
            this.delete(uid);
    }
    removeNodeTree(child) {
        this.removeNode(child);
        const { childNodes } = child;
        childNodes.forEach(node => this.removeNodeTree(node));
    }
}
const eventSource = new EventSource();

const observers = [];
/**
 * The MutationObserver provides the ability
 * to watch for changes being made to the DOM tree.
 * It will invoke a specified callback function
 * when DOM changes occur.
 * @see https://dom.spec.whatwg.org/#mutationobserver
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 */
class MutationObserverImpl {
    constructor(callback) {
        this.records = [];
        this.callback = callback;
    }
    /**
     * Configures the MutationObserver
     * to begin receiving notifications
     * through its callback function
     * when DOM changes matching the given options occur.
     *
     * Options matching is to be implemented.
     */
    observe(target, options) {
        this.disconnect();
        this.target = target;
        this.options = options || {};
        observers.push(this);
    }
    /**
     * Stop the MutationObserver instance
     * from receiving further notifications
     * until and unless observe() is called again.
     */
    disconnect() {
        this.target = null;
        const index = observers.indexOf(this);
        if (index >= 0) {
            observers.splice(index, 1);
        }
    }
    /**
     * Removes all pending notifications
     * from the MutationObserver's notification queue
     * and returns them in a new Array of MutationRecord objects.
     */
    takeRecords() {
        return this.records.splice(0, this.records.length);
    }
}
/** Match two TaroNodes by sid. */
const sidMatches = (observerTarget, target) => {
    return !!observerTarget && observerTarget.sid === (target === null || target === void 0 ? void 0 : target.sid);
};
const isConcerned = (record, options) => {
    const { characterData, characterDataOldValue, attributes, attributeOldValue, childList } = options;
    switch (record.type) {
        case "characterData" /* CHARACTER_DATA */:
            if (characterData) {
                if (!characterDataOldValue)
                    record.oldValue = null;
                return true;
            }
            return false;
        case "attributes" /* ATTRIBUTES */:
            if (attributes) {
                if (!attributeOldValue)
                    record.oldValue = null;
                return true;
            }
            return false;
        case "childList" /* CHILD_LIST */:
            if (childList) {
                return true;
            }
            return false;
    }
};
let pendingMuatations = false;
function logMutation(observer, record) {
    observer.records.push(record);
    if (!pendingMuatations) {
        pendingMuatations = true;
        Promise
            .resolve()
            .then(() => {
            pendingMuatations = false;
            observers.forEach(observer => {
                return observer.callback(observer.takeRecords());
            });
        });
    }
}
function recordMutation(record) {
    observers.forEach(observer => {
        const { options } = observer;
        for (let t = record.target; t; t = t.parentNode) {
            if (sidMatches(observer.target, t) && isConcerned(record, options)) {
                logMutation(observer, record);
                break;
            }
            if (!options.subtree)
                break;
        }
    });
}

class MutationObserver {
    constructor(callback) {
        if (ENABLE_MUTATION_OBSERVER) {
            this.core = new MutationObserverImpl(callback);
        }
        else {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('[Taro Warning] ???????????? MutationObserver????????? Taro ????????????????????? \'mini.enableMutationObserver: true\'');
            }
            this.core = {
                observe: noop,
                disconnect: noop,
                takeRecords: noop
            };
        }
    }
    observe(...args) {
        this.core.observe(...args);
    }
    disconnect() {
        this.core.disconnect();
    }
    takeRecords() {
        return this.core.takeRecords();
    }
    static record(record) {
        recordMutation(record);
    }
}

const CHILDNODES = "cn" /* Childnodes */;
const nodeId = incrementId();
let TaroNode = class TaroNode extends TaroEventTarget {
    constructor() {
        super();
        this.parentNode = null;
        this.childNodes = [];
        this._getElement = getElementFactory();
        this.hydrate = (node) => () => hydrate(node);
        const impl = getNodeImpl();
        impl.bind(this);
        this.uid = `_n_${nodeId()}`; // dom ?????? id?????????????????????
        this.sid = this.uid; // dom ?????????????????? id??????????????????
        eventSource.set(this.sid, this);
    }
    /**
     * like jQuery's $.empty()
     */
    _empty() {
        while (this.firstChild) {
            // Data Structure
            const child = this.firstChild;
            child.parentNode = null;
            this.childNodes.shift();
            // eventSource
            eventSource.removeNodeTree(child);
        }
    }
    updateChildNodes(isClean) {
        const cleanChildNodes = () => [];
        const rerenderChildNodes = () => {
            const childNodes = this.childNodes.filter(node => !isComment(node));
            return childNodes.map(hydrate);
        };
        this.enqueueUpdate({
            path: `${this._path}.${CHILDNODES}`,
            value: isClean ? cleanChildNodes : rerenderChildNodes
        });
    }
    get _root() {
        var _a;
        return ((_a = this.parentNode) === null || _a === void 0 ? void 0 : _a._root) || null;
    }
    findIndex(refChild) {
        const index = this.childNodes.indexOf(refChild);
        ensure(index !== -1, 'The node to be replaced is not a child of this node.');
        return index;
    }
    get _path() {
        const parentNode = this.parentNode;
        if (parentNode) {
            // ?????????????????????????????? comment ??????
            const list = parentNode.childNodes.filter(node => !isComment(node));
            const indexOfNode = list.indexOf(this);
            const index = this.hooks.getPathIndex(indexOfNode);
            return `${parentNode._path}.${CHILDNODES}.${index}`;
        }
        return '';
    }
    get nextSibling() {
        const parentNode = this.parentNode;
        return (parentNode === null || parentNode === void 0 ? void 0 : parentNode.childNodes[parentNode.findIndex(this) + 1]) || null;
    }
    get previousSibling() {
        const parentNode = this.parentNode;
        return (parentNode === null || parentNode === void 0 ? void 0 : parentNode.childNodes[parentNode.findIndex(this) - 1]) || null;
    }
    get parentElement() {
        const parentNode = this.parentNode;
        if ((parentNode === null || parentNode === void 0 ? void 0 : parentNode.nodeType) === 1 /* ELEMENT_NODE */) {
            return parentNode;
        }
        return null;
    }
    get firstChild() {
        return this.childNodes[0] || null;
    }
    get lastChild() {
        const childNodes = this.childNodes;
        return childNodes[childNodes.length - 1] || null;
    }
    /**
     * @textContent ???????????????????????????
     * @TODO ???????????? innerHTML ??????
     */
    set textContent(text) {
        const document = this._getElement(ElementNames.Document)();
        const newText = document.createTextNode(text);
        // @Todo: appendChild ??????????????????
        MutationObserver.record({
            type: "childList" /* CHILD_LIST */,
            target: this,
            removedNodes: this.childNodes.slice(),
            addedNodes: text === '' ? [] : [newText]
        });
        this._empty();
        if (text === '') {
            this.updateChildNodes(true);
        }
        else {
            this.appendChild(newText);
            this.updateChildNodes();
        }
    }
    /**
     * @doc https://developer.mozilla.org/zh-CN/docs/Web/API/Node/insertBefore
     * @scenario
     * [A,B,C]
     *   1. insert D before C, D has no parent
     *   2. insert D before C, D has the same parent of C
     *   3. insert D before C, D has the different parent of C
     */
    insertBefore(newChild, refChild, isReplace) {
        if (newChild.nodeName === DOCUMENT_FRAGMENT) {
            newChild.childNodes.reduceRight((previousValue, currentValue) => {
                this.insertBefore(currentValue, previousValue);
                return currentValue;
            }, refChild);
            return newChild;
        }
        // Parent release newChild
        //   - cleanRef: false (No need to clean eventSource, because newChild is about to be inserted)
        //   - update: true (Need to update parent.childNodes, because parent.childNodes is reordered)
        newChild.remove({ cleanRef: false });
        // Data structure
        newChild.parentNode = this;
        if (refChild) {
            // insertBefore & replaceChild
            const index = this.findIndex(refChild);
            this.childNodes.splice(index, 0, newChild);
        }
        else {
            // appendChild
            this.childNodes.push(newChild);
        }
        // Serialization
        if (!refChild || isReplace) {
            // appendChild & replaceChild
            this.enqueueUpdate({
                path: newChild._path,
                value: this.hydrate(newChild)
            });
        }
        else {
            // insertBefore
            this.updateChildNodes();
        }
        MutationObserver.record({
            type: "childList" /* CHILD_LIST */,
            target: this,
            addedNodes: [newChild],
            removedNodes: isReplace
                ? [refChild] /** replaceChild */
                : [],
            nextSibling: isReplace
                ? refChild.nextSibling /** replaceChild */
                : (refChild || null),
            previousSibling: newChild.previousSibling
        });
        return newChild;
    }
    /**
     * @doc https://developer.mozilla.org/zh-CN/docs/Web/API/Node/appendChild
     * @scenario
     * [A,B,C]
     *   1. append C, C has no parent
     *   2. append C, C has the same parent of B
     *   3. append C, C has the different parent of B
     */
    appendChild(newChild) {
        return this.insertBefore(newChild);
    }
    /**
     * @doc https://developer.mozilla.org/zh-CN/docs/Web/API/Node/replaceChild
     * @scenario
     * [A,B,C]
     *   1. replace B with C, C has no parent
     *   2. replace B with C, C has no parent, C has the same parent of B
     *   3. replace B with C, C has no parent, C has the different parent of B
     */
    replaceChild(newChild, oldChild) {
        if (oldChild.parentNode !== this)
            return;
        // Insert the newChild
        this.insertBefore(newChild, oldChild, true);
        // Destroy the oldChild
        //   - cleanRef: true (Need to clean eventSource, because the oldChild was detached from the DOM tree)
        //   - update: false (No need to update parent.childNodes, because replace will not cause the parent.childNodes being reordered)
        oldChild.remove({ doUpdate: false });
        return oldChild;
    }
    /**
     * @doc https://developer.mozilla.org/zh-CN/docs/Web/API/Node/removeChild
     * @scenario
     * [A,B,C]
     *   1. remove A or B
     *   2. remove C
     */
    removeChild(child, options = {}) {
        const { cleanRef, doUpdate } = options;
        if (cleanRef !== false && doUpdate !== false) {
            // appendChild/replaceChild/insertBefore ???????????????
            // @Todo: ??????????????? newChild ???????????????????????????????????????????????????????????????
            MutationObserver.record({
                type: "childList" /* CHILD_LIST */,
                target: this,
                removedNodes: [child],
                nextSibling: child.nextSibling,
                previousSibling: child.previousSibling
            });
        }
        // Data Structure
        const index = this.findIndex(child);
        this.childNodes.splice(index, 1);
        child.parentNode = null;
        // Set eventSource
        if (cleanRef !== false) {
            eventSource.removeNodeTree(child);
        }
        // Serialization
        if (doUpdate !== false) {
            this.updateChildNodes();
        }
        return child;
    }
    remove(options) {
        var _a;
        (_a = this.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this, options);
    }
    hasChildNodes() {
        return this.childNodes.length > 0;
    }
    enqueueUpdate(payload) {
        var _a;
        (_a = this._root) === null || _a === void 0 ? void 0 : _a.enqueueUpdate(payload);
    }
    get ownerDocument() {
        const document = this._getElement(ElementNames.Document)();
        return document;
    }
};
TaroNode = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], TaroNode);

let TaroText = class TaroText extends TaroNode {
    constructor() {
        super(...arguments);
        this.nodeType = 3 /* TEXT_NODE */;
        this.nodeName = '#text';
    }
    set textContent(text) {
        MutationObserver.record({
            target: this,
            type: "characterData" /* CHARACTER_DATA */,
            oldValue: this._value
        });
        this._value = text;
        this.enqueueUpdate({
            path: `${this._path}.${"v" /* Text */}`,
            value: text
        });
    }
    get textContent() {
        return this._value;
    }
    set nodeValue(text) {
        this.textContent = text;
    }
    get nodeValue() {
        return this._value;
    }
    set data(text) {
        this.textContent = text;
    }
    get data() {
        return this._value;
    }
};
TaroText = __decorate([
    injectable()
], TaroText);

/*
 *
 * https://www.w3.org/Style/CSS/all-properties.en.html
 */
const styleProperties = [
    'all',
    'appearance',
    'blockOverflow',
    'blockSize',
    'bottom',
    'clear',
    'contain',
    'content',
    'continue',
    'cursor',
    'direction',
    'display',
    'filter',
    'float',
    'gap',
    'height',
    'inset',
    'isolation',
    'left',
    'letterSpacing',
    'lightingColor',
    'markerSide',
    'mixBlendMode',
    'opacity',
    'order',
    'position',
    'quotes',
    'resize',
    'right',
    'rowGap',
    'tabSize',
    'tableLayout',
    'top',
    'userSelect',
    'verticalAlign',
    'visibility',
    'voiceFamily',
    'volume',
    'whiteSpace',
    'widows',
    'width',
    'zIndex',
    'pointerEvents'
    /** ????????? style */
    // 'azimuth',
    // 'backfaceVisibility',
    // 'baselineShift',
    // 'captionSide',
    // 'chains',
    // 'dominantBaseline',
    // 'elevation',
    // 'emptyCells',
    // 'forcedColorAdjust',
    // 'glyphOrientationVertical',
    // 'hangingPunctuation',
    // 'hyphenateCharacter',
    // 'hyphens',
    // 'imageOrientation',
    // 'imageResolution',
    // 'orphans',
    // 'playDuring',
    // 'pointerEvents',
    // 'regionFragment',
    // 'richness',
    // 'running',
    // 'scrollBehavior',
    // 'speechRate',
    // 'stress',
    // 'stringSet',
    // 'unicodeBidi',
    // 'willChange',
    // 'writingMode',
];
// ??????????????????
function combine(prefix, list, excludeSelf) {
    !excludeSelf && styleProperties.push(prefix);
    list.forEach(item => {
        styleProperties.push(prefix + item);
    });
}
const color = 'Color';
const style = 'Style';
const width = 'Width';
const image = 'Image';
const size = 'Size';
const color_style_width = [color, style, width];
const fitlength_fitwidth_image = ['FitLength', 'FitWidth', image];
const fitlength_fitwidth_image_radius = [...fitlength_fitwidth_image, 'Radius'];
const color_style_width_fitlength_fitwidth_image = [...color_style_width, ...fitlength_fitwidth_image];
const endRadius_startRadius = ['EndRadius', 'StartRadius'];
const bottom_left_right_top = ['Bottom', 'Left', 'Right', 'Top'];
const end_start = ['End', 'Start'];
const content_items_self = ['Content', 'Items', 'Self'];
const blockSize_height_inlineSize_width = ['BlockSize', 'Height', 'InlineSize', width];
const after_before = ['After', 'Before'];
combine('borderBlock', color_style_width);
combine('borderBlockEnd', color_style_width);
combine('borderBlockStart', color_style_width);
combine('outline', [...color_style_width, 'Offset']);
combine('border', [...color_style_width, 'Boundary', 'Break', 'Collapse', 'Radius', 'Spacing']);
combine('borderFit', ['Length', width]);
combine('borderInline', color_style_width);
combine('borderInlineEnd', color_style_width);
combine('borderInlineStart', color_style_width);
combine('borderLeft', color_style_width_fitlength_fitwidth_image);
combine('borderRight', color_style_width_fitlength_fitwidth_image);
combine('borderTop', color_style_width_fitlength_fitwidth_image);
combine('borderBottom', color_style_width_fitlength_fitwidth_image);
combine('textDecoration', [color, style, 'Line']);
combine('textEmphasis', [color, style, 'Position']);
combine('scrollMargin', bottom_left_right_top);
combine('scrollPadding', bottom_left_right_top);
combine('padding', bottom_left_right_top);
combine('margin', [...bottom_left_right_top, 'Trim']);
combine('scrollMarginBlock', end_start);
combine('scrollMarginInline', end_start);
combine('scrollPaddingBlock', end_start);
combine('scrollPaddingInline', end_start);
combine('gridColumn', end_start);
combine('gridRow', end_start);
combine('insetBlock', end_start);
combine('insetInline', end_start);
combine('marginBlock', end_start);
combine('marginInline', end_start);
combine('paddingBlock', end_start);
combine('paddingInline', end_start);
combine('pause', after_before);
combine('cue', after_before);
combine('mask', ['Clip', 'Composite', image, 'Mode', 'Origin', 'Position', 'Repeat', size, 'Type']);
combine('borderImage', ['Outset', 'Repeat', 'Slice', 'Source', 'Transform', width]);
combine('maskBorder', ['Mode', 'Outset', 'Repeat', 'Slice', 'Source', width]);
combine('font', ['Family', 'FeatureSettings', 'Kerning', 'LanguageOverride', 'MaxSize', 'MinSize', 'OpticalSizing', 'Palette', size, 'SizeAdjust', 'Stretch', style, 'Weight', 'VariationSettings']);
combine('fontSynthesis', ['SmallCaps', style, 'Weight']);
combine('transform', ['Box', 'Origin', style]);
combine('background', [color, image, 'Attachment', 'BlendMode', 'Clip', 'Origin', 'Position', 'Repeat', size]);
combine('listStyle', [image, 'Position', 'Type']);
combine('scrollSnap', ['Align', 'Stop', 'Type']);
combine('grid', ['Area', 'AutoColumns', 'AutoFlow', 'AutoRows']);
combine('gridTemplate', ['Areas', 'Columns', 'Rows']);
combine('overflow', ['Block', 'Inline', 'Wrap', 'X', 'Y']);
combine('transition', ['Delay', 'Duration', 'Property', 'TimingFunction']);
combine('lineStacking', ['Ruby', 'Shift', 'Strategy']);
combine('color', ['Adjust', 'InterpolationFilters', 'Scheme']);
combine('textAlign', ['All', 'Last']);
combine('page', ['BreakAfter', 'BreakBefore', 'BreakInside']);
combine('speak', ['Header', 'Numeral', 'Punctuation']);
combine('animation', ['Delay', 'Direction', 'Duration', 'FillMode', 'IterationCount', 'Name', 'PlayState', 'TimingFunction']);
combine('flex', ['Basis', 'Direction', 'Flow', 'Grow', 'Shrink', 'Wrap']);
combine('offset', [...after_before, ...end_start, 'Anchor', 'Distance', 'Path', 'Position', 'Rotate']);
combine('fontVariant', ['Alternates', 'Caps', 'EastAsian', 'Emoji', 'Ligatures', 'Numeric', 'Position']);
combine('perspective', ['Origin']);
combine('pitch', ['Range']);
combine('clip', ['Path', 'Rule']);
combine('flow', ['From', 'Into']);
combine('align', ['Content', 'Items', 'Self'], true);
combine('alignment', ['Adjust', 'Baseline'], true);
combine('bookmark', ['Label', 'Level', 'State'], true);
combine('borderStart', endRadius_startRadius, true);
combine('borderEnd', endRadius_startRadius, true);
combine('borderCorner', ['Fit', image, 'ImageTransform'], true);
combine('borderTopLeft', fitlength_fitwidth_image_radius, true);
combine('borderTopRight', fitlength_fitwidth_image_radius, true);
combine('borderBottomLeft', fitlength_fitwidth_image_radius, true);
combine('borderBottomRight', fitlength_fitwidth_image_radius, true);
combine('column', ['s', 'Count', 'Fill', 'Gap', 'Rule', 'RuleColor', 'RuleStyle', 'RuleWidth', 'Span', width], true);
combine('break', [...after_before, 'Inside'], true);
combine('wrap', [...after_before, 'Flow', 'Inside', 'Through'], true);
combine('justify', content_items_self, true);
combine('place', content_items_self, true);
combine('max', [...blockSize_height_inlineSize_width, 'Lines'], true);
combine('min', blockSize_height_inlineSize_width, true);
combine('line', ['Break', 'Clamp', 'Grid', 'Height', 'Padding', 'Snap'], true);
combine('inline', ['BoxAlign', size, 'Sizing'], true);
combine('text', ['CombineUpright', 'GroupAlign', 'Height', 'Indent', 'Justify', 'Orientation', 'Overflow', 'Shadow', 'SpaceCollapse', 'SpaceTrim', 'Spacing', 'Transform', 'UnderlinePosition', 'Wrap'], true);
combine('shape', ['ImageThreshold', 'Inside', 'Margin', 'Outside'], true);
combine('word', ['Break', 'Spacing', 'Wrap'], true);
combine('nav', ['Down', 'Left', 'Right', 'Up'], true);
combine('object', ['Fit', 'Position'], true);
combine('box', ['DecorationBreak', 'Shadow', 'Sizing', 'Snap'], true);

function setStyle(newVal, styleKey) {
    const old = this[styleKey];
    const oldCssTxt = this.cssText;
    if (newVal) {
        this._usedStyleProp.add(styleKey);
    }
    process.env.NODE_ENV !== 'production' && warn(isString(newVal) && newVal.length > PROPERTY_THRESHOLD, `Style ?????? ${styleKey} ?????????????????????????????????????????????????????????????????? CSS ???????????????????????????`);
    if (old !== newVal) {
        this._value[styleKey] = newVal;
        this._element.enqueueUpdate({
            path: `${this._element._path}.${"st" /* Style */}`,
            value: this.cssText
        });
        // @Todo:
        //   el.style.cssText = 'x: y;m: n'???Bug: ???????????????
        //   el.style.cssText = 'x: y'????????????
        //   el.style.x = y????????????
        MutationObserver.record({
            type: "attributes" /* ATTRIBUTES */,
            target: this._element,
            attributeName: 'style',
            oldValue: oldCssTxt
        });
    }
}
function initStyle(ctor) {
    const properties = {};
    for (let i = 0; i < styleProperties.length; i++) {
        const styleKey = styleProperties[i];
        properties[styleKey] = {
            get() {
                return this._value[styleKey] || '';
            },
            set(newVal) {
                setStyle.call(this, newVal, styleKey);
            }
        };
    }
    Object.defineProperties(ctor.prototype, properties);
}
function isCssVariable(propertyName) {
    return /^--/.test(propertyName);
}
class Style {
    constructor(element) {
        this._element = element;
        this._usedStyleProp = new Set();
        this._value = {};
    }
    setCssVariables(styleKey) {
        this.hasOwnProperty(styleKey) || Object.defineProperty(this, styleKey, {
            enumerable: true,
            configurable: true,
            get: () => {
                return this._value[styleKey] || '';
            },
            set: (newVal) => {
                setStyle.call(this, newVal, styleKey);
            }
        });
    }
    get cssText() {
        const texts = [];
        this._usedStyleProp.forEach(key => {
            const val = this[key];
            if (!val)
                return;
            const styleName = isCssVariable(key) ? key : toDashed(key);
            texts.push(`${styleName}: ${val};`);
        });
        return texts.join(' ');
    }
    set cssText(str) {
        if (str == null) {
            str = '';
        }
        this._usedStyleProp.forEach(prop => {
            this.removeProperty(prop);
        });
        if (str === '') {
            return;
        }
        const rules = str.split(';');
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i].trim();
            if (rule === '') {
                continue;
            }
            // ???????????? 'background: url(http:x/y/z)' ?????????
            const [propName, ...valList] = rule.split(':');
            const val = valList.join(':');
            if (isUndefined(val)) {
                continue;
            }
            this.setProperty(propName.trim(), val.trim());
        }
    }
    setProperty(propertyName, value) {
        if (propertyName[0] === '-') {
            // ?????? webkit ????????? css ??????
            this.setCssVariables(propertyName);
        }
        else {
            propertyName = toCamelCase(propertyName);
        }
        if (isUndefined(value)) {
            return;
        }
        if (value === null || value === '') {
            this.removeProperty(propertyName);
        }
        else {
            this[propertyName] = value;
        }
    }
    removeProperty(propertyName) {
        propertyName = toCamelCase(propertyName);
        if (!this._usedStyleProp.has(propertyName)) {
            return '';
        }
        const value = this[propertyName];
        this[propertyName] = '';
        this._usedStyleProp.delete(propertyName);
        return value;
    }
    getPropertyValue(propertyName) {
        propertyName = toCamelCase(propertyName);
        const value = this[propertyName];
        if (!value) {
            return '';
        }
        return value;
    }
}
initStyle(Style);

function returnTrue() {
    return true;
}
function treeToArray(root, predict) {
    const array = [];
    const filter = predict !== null && predict !== void 0 ? predict : returnTrue;
    let object = root;
    while (object) {
        if (object.nodeType === 1 /* ELEMENT_NODE */ && filter(object)) {
            array.push(object);
        }
        object = following(object, root);
    }
    return array;
}
function following(el, root) {
    const firstChild = el.firstChild;
    if (firstChild) {
        return firstChild;
    }
    let current = el;
    do {
        if (current === root) {
            return null;
        }
        const nextSibling = current.nextSibling;
        if (nextSibling) {
            return nextSibling;
        }
        current = current.parentElement;
    } while (current);
    return null;
}

class ClassList extends Set {
    constructor(className, el) {
        super();
        className.trim().split(/\s+/).forEach(super.add.bind(this));
        this.el = el;
    }
    get value() {
        return [...this].filter(v => v !== '').join(' ');
    }
    add(s) {
        super.add(s);
        this._update();
        return this;
    }
    get length() {
        return this.size;
    }
    remove(s) {
        super.delete(s);
        this._update();
    }
    toggle(s) {
        if (super.has(s)) {
            super.delete(s);
        }
        else {
            super.add(s);
        }
        this._update();
    }
    replace(s1, s2) {
        super.delete(s1);
        super.add(s2);
        this._update();
    }
    contains(s) {
        return super.has(s);
    }
    toString() {
        return this.value;
    }
    _update() {
        this.el.className = this.value;
    }
}

let TaroElement = class TaroElement extends TaroNode {
    constructor() {
        var _a, _b;
        super();
        this.props = {};
        this.dataset = EMPTY_OBJ;
        const impl = getElementImpl();
        impl.bind(this);
        this.nodeType = 1 /* ELEMENT_NODE */;
        this.style = new Style(this);
        (_b = (_a = this.hooks).patchElement) === null || _b === void 0 ? void 0 : _b.call(_a, this);
    }
    _stopPropagation(event) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let target = this;
        // eslint-disable-next-line no-cond-assign
        while ((target = target.parentNode)) {
            const listeners = target.__handlers[event.type];
            if (!isArray(listeners)) {
                continue;
            }
            for (let i = listeners.length; i--;) {
                const l = listeners[i];
                l._stop = true;
            }
        }
    }
    get id() {
        return this.getAttribute(ID);
    }
    set id(val) {
        this.setAttribute(ID, val);
    }
    get className() {
        return this.getAttribute(CLASS) || '';
    }
    set className(val) {
        this.setAttribute(CLASS, val);
    }
    get cssText() {
        return this.getAttribute(STYLE) || '';
    }
    get classList() {
        return new ClassList(this.className, this);
    }
    get children() {
        return this.childNodes.filter(isElement);
    }
    get attributes() {
        const props = this.props;
        const propKeys = Object.keys(props);
        const style = this.style.cssText;
        const attrs = propKeys.map(key => ({ name: key, value: props[key] }));
        return attrs.concat(style ? { name: STYLE, value: style } : []);
    }
    get textContent() {
        let text = '';
        const childNodes = this.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            text += childNodes[i].textContent;
        }
        return text;
    }
    set textContent(text) {
        super.textContent = text;
    }
    hasAttribute(qualifiedName) {
        return !isUndefined(this.props[qualifiedName]);
    }
    hasAttributes() {
        return this.attributes.length > 0;
    }
    get focus() {
        return function () {
            this.setAttribute(FOCUS, true);
        };
    }
    // ?????? Vue3??????????????????https://github.com/NervJS/taro/issues/10579
    set focus(value) {
        this.setAttribute(FOCUS, value);
    }
    blur() {
        this.setAttribute(FOCUS, false);
    }
    setAttribute(qualifiedName, value) {
        var _a, _b;
        process.env.NODE_ENV !== 'production' && warn(isString(value) && value.length > PROPERTY_THRESHOLD, `?????? ${this.nodeName} ??? ?????? ${qualifiedName} ?????????????????????????????????????????????????????????????????????????????? base64 ??????????????? CSS ????????? base64???`);
        const isPureView = this.nodeName === VIEW && !isHasExtractProp(this) && !this.isAnyEventBinded();
        if (qualifiedName !== STYLE) {
            MutationObserver.record({
                target: this,
                type: "attributes" /* ATTRIBUTES */,
                attributeName: qualifiedName,
                oldValue: this.getAttribute(qualifiedName)
            });
        }
        switch (qualifiedName) {
            case STYLE:
                this.style.cssText = value;
                break;
            case ID:
                if (this.uid !== this.sid) {
                    // eventSource[sid] ?????????????????????????????????
                    // eventSource[uid] ??????
                    eventSource.delete(this.uid);
                }
                value = String(value);
                this.props[qualifiedName] = this.uid = value;
                eventSource.set(value, this);
                break;
            default:
                this.props[qualifiedName] = value;
                if (qualifiedName.startsWith('data-')) {
                    if (this.dataset === EMPTY_OBJ) {
                        this.dataset = Object.create(null);
                    }
                    this.dataset[toCamelCase(qualifiedName.replace(/^data-/, ''))] = value;
                }
                break;
        }
        qualifiedName = shortcutAttr(qualifiedName);
        const payload = {
            path: `${this._path}.${toCamelCase(qualifiedName)}`,
            value: isFunction(value) ? () => value : value
        };
        (_b = (_a = this.hooks).modifySetAttrPayload) === null || _b === void 0 ? void 0 : _b.call(_a, this, qualifiedName, payload);
        this.enqueueUpdate(payload);
        if (this.nodeName === VIEW) {
            if (toCamelCase(qualifiedName) === CATCHMOVE) {
                // catchMove = true: catch-view
                // catchMove = false: view or static-view
                this.enqueueUpdate({
                    path: `${this._path}.${"nn" /* NodeName */}`,
                    value: value ? CATCH_VIEW : (this.isAnyEventBinded() ? VIEW : STATIC_VIEW)
                });
            }
            else if (isPureView && isHasExtractProp(this)) {
                // pure-view => static-view
                this.enqueueUpdate({
                    path: `${this._path}.${"nn" /* NodeName */}`,
                    value: STATIC_VIEW
                });
            }
        }
    }
    removeAttribute(qualifiedName) {
        var _a, _b, _c, _d;
        const isStaticView = this.nodeName === VIEW && isHasExtractProp(this) && !this.isAnyEventBinded();
        MutationObserver.record({
            target: this,
            type: "attributes" /* ATTRIBUTES */,
            attributeName: qualifiedName,
            oldValue: this.getAttribute(qualifiedName)
        });
        if (qualifiedName === STYLE) {
            this.style.cssText = '';
        }
        else {
            const isInterrupt = (_b = (_a = this.hooks).onRemoveAttribute) === null || _b === void 0 ? void 0 : _b.call(_a, this, qualifiedName);
            if (isInterrupt) {
                return;
            }
            if (!this.props.hasOwnProperty(qualifiedName)) {
                return;
            }
            delete this.props[qualifiedName];
        }
        qualifiedName = shortcutAttr(qualifiedName);
        const payload = {
            path: `${this._path}.${toCamelCase(qualifiedName)}`,
            value: ''
        };
        (_d = (_c = this.hooks).modifyRmAttrPayload) === null || _d === void 0 ? void 0 : _d.call(_c, this, qualifiedName, payload);
        this.enqueueUpdate(payload);
        if (this.nodeName === VIEW) {
            if (toCamelCase(qualifiedName) === CATCHMOVE) {
                // catch-view => view or static-view or pure-view
                this.enqueueUpdate({
                    path: `${this._path}.${"nn" /* NodeName */}`,
                    value: this.isAnyEventBinded() ? VIEW : (isHasExtractProp(this) ? STATIC_VIEW : PURE_VIEW)
                });
            }
            else if (isStaticView && !isHasExtractProp(this)) {
                // static-view => pure-view
                this.enqueueUpdate({
                    path: `${this._path}.${"nn" /* NodeName */}`,
                    value: PURE_VIEW
                });
            }
        }
    }
    getAttribute(qualifiedName) {
        const attr = qualifiedName === STYLE ? this.style.cssText : this.props[qualifiedName];
        return attr !== null && attr !== void 0 ? attr : '';
    }
    getElementsByTagName(tagName) {
        return treeToArray(this, (el) => {
            return el.nodeName === tagName || (tagName === '*' && this !== el);
        });
    }
    getElementsByClassName(className) {
        return treeToArray(this, (el) => {
            const classList = el.classList;
            const classNames = className.trim().split(/\s+/);
            return classNames.every(c => classList.has(c));
        });
    }
    dispatchEvent(event) {
        const cancelable = event.cancelable;
        const listeners = this.__handlers[event.type];
        if (!isArray(listeners)) {
            return false;
        }
        for (let i = listeners.length; i--;) {
            const listener = listeners[i];
            let result;
            if (listener._stop) {
                listener._stop = false;
            }
            else {
                this.hooks.modifyDispatchEvent(event, this);
                result = listener.call(this, event);
            }
            if ((result === false || event._end) && cancelable) {
                event.defaultPrevented = true;
            }
            if (event._end && event._stop) {
                break;
            }
        }
        if (event._stop) {
            this._stopPropagation(event);
        }
        else {
            event._stop = true;
        }
        return listeners != null;
    }
    addEventListener(type, handler, options) {
        const name = this.nodeName;
        const SPECIAL_NODES = this.hooks.getSpecialNodes();
        if (!this.isAnyEventBinded() && SPECIAL_NODES.indexOf(name) > -1) {
            this.enqueueUpdate({
                path: `${this._path}.${"nn" /* NodeName */}`,
                value: name
            });
        }
        super.addEventListener(type, handler, options);
    }
    removeEventListener(type, handler) {
        super.removeEventListener(type, handler);
        const name = this.nodeName;
        const SPECIAL_NODES = this.hooks.getSpecialNodes();
        if (!this.isAnyEventBinded() && SPECIAL_NODES.indexOf(name) > -1) {
            this.enqueueUpdate({
                path: `${this._path}.${"nn" /* NodeName */}`,
                value: isHasExtractProp(this) ? `static-${name}` : `pure-${name}`
            });
        }
    }
};
TaroElement = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], TaroElement);

const options = {
    prerender: true,
    debug: false
};

class Performance {
    constructor() {
        this.recorder = new Map();
    }
    start(id) {
        if (!options.debug) {
            return;
        }
        this.recorder.set(id, Date.now());
    }
    stop(id) {
        if (!options.debug) {
            return;
        }
        const now = Date.now();
        const prev = this.recorder.get(id);
        const time = now - prev;
        // eslint-disable-next-line no-console
        console.log(`${id} ????????? ${time}ms`);
    }
}
const perf = new Performance();

function findCustomWrapper(root, dataPathArr) {
    // ['root', 'cn', '[0]'] remove 'root' => ['cn', '[0]']
    const list = dataPathArr.slice(1);
    let currentData = root;
    let customWrapper;
    let splitedPath = '';
    list.some((item, i) => {
        const key = item
            // '[0]' => '0'
            .replace(/^\[(.+)\]$/, '$1')
            // 'cn' => 'childNodes'
            .replace(/\bcn\b/g, 'childNodes');
        currentData = currentData[key];
        if (isUndefined(currentData))
            return true;
        if (currentData.nodeName === CUSTOM_WRAPPER) {
            const res = customWrapperCache.get(currentData.sid);
            if (res) {
                customWrapper = res;
                splitedPath = dataPathArr.slice(i + 2).join('.');
            }
        }
    });
    if (customWrapper) {
        return {
            customWrapper,
            splitedPath
        };
    }
}
let TaroRootElement = class TaroRootElement extends TaroElement {
    constructor() {
        super();
        this.updatePayloads = [];
        this.updateCallbacks = [];
        this.pendingUpdate = false;
        this.ctx = null;
        this.nodeName = ROOT_STR;
    }
    get _path() {
        return ROOT_STR;
    }
    get _root() {
        return this;
    }
    enqueueUpdate(payload) {
        this.updatePayloads.push(payload);
        if (!this.pendingUpdate && this.ctx) {
            this.performUpdate();
        }
    }
    performUpdate(initRender = false, prerender) {
        this.pendingUpdate = true;
        const ctx = this.ctx;
        setTimeout(() => {
            perf.start(SET_DATA);
            const data = Object.create(null);
            const resetPaths = new Set(initRender
                ? ['root.cn.[0]', 'root.cn[0]']
                : []);
            while (this.updatePayloads.length > 0) {
                const { path, value } = this.updatePayloads.shift();
                if (path.endsWith("cn" /* Childnodes */)) {
                    resetPaths.add(path);
                }
                data[path] = value;
            }
            for (const path in data) {
                resetPaths.forEach(p => {
                    // ??????????????????????????????????????????????????????
                    if (path.includes(p) && path !== p) {
                        delete data[path];
                    }
                });
                const value = data[path];
                if (isFunction(value)) {
                    data[path] = value();
                }
            }
            // ?????????
            if (isFunction(prerender))
                return prerender(data);
            // ????????????
            this.pendingUpdate = false;
            let normalUpdate = {};
            const customWrapperMap = new Map();
            if (initRender) {
                // ???????????????????????????????????? setData
                normalUpdate = data;
            }
            else {
                // ????????????????????? CustomWrapper ?????????????????? setData
                for (const p in data) {
                    const dataPathArr = p.split('.');
                    const found = findCustomWrapper(this, dataPathArr);
                    if (found) {
                        // ?????????????????? CustomWrapper ?????????
                        const { customWrapper, splitedPath } = found;
                        // ??????????????? customWrapper ???????????????????????? setData ???
                        customWrapperMap.set(customWrapper, Object.assign(Object.assign({}, (customWrapperMap.get(customWrapper) || {})), { [`i.${splitedPath}`]: data[p] }));
                    }
                    else {
                        // ?????????????????????????????????
                        normalUpdate[p] = data[p];
                    }
                }
            }
            const customWrpperCount = customWrapperMap.size;
            const isNeedNormalUpdate = Object.keys(normalUpdate).length > 0;
            const updateArrLen = customWrpperCount + (isNeedNormalUpdate ? 1 : 0);
            let executeTime = 0;
            const cb = () => {
                if (++executeTime === updateArrLen) {
                    perf.stop(SET_DATA);
                    this.flushUpdateCallback();
                    initRender && perf.stop(PAGE_INIT);
                }
            };
            // custom-wrapper setData
            if (customWrpperCount) {
                customWrapperMap.forEach((data, ctx) => {
                    if (process.env.NODE_ENV !== 'production' && options.debug) {
                        // eslint-disable-next-line no-console
                        console.log('custom wrapper setData: ', data);
                    }
                    ctx.setData(data, cb);
                });
            }
            // page setData
            if (isNeedNormalUpdate) {
                if (process.env.NODE_ENV !== 'production' && options.debug) {
                    // eslint-disable-next-line no-console
                    console.log('page setData:', normalUpdate);
                }
                ctx.setData(normalUpdate, cb);
            }
        }, 0);
    }
    enqueueUpdateCallback(cb, ctx) {
        this.updateCallbacks.push(() => {
            ctx ? cb.call(ctx) : cb();
        });
    }
    flushUpdateCallback() {
        const updateCallbacks = this.updateCallbacks;
        if (!updateCallbacks.length)
            return;
        const copies = updateCallbacks.slice(0);
        this.updateCallbacks.length = 0;
        for (let i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
};
TaroRootElement = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], TaroRootElement);

class FormElement extends TaroElement {
    get value() {
        // eslint-disable-next-line dot-notation
        const val = this.props[VALUE];
        return val == null ? '' : val;
    }
    set value(val) {
        this.setAttribute(VALUE, val);
    }
    dispatchEvent(event) {
        if (event.mpEvent) {
            const val = event.mpEvent.detail.value;
            if (event.type === CHANGE) {
                this.props.value = val;
            }
            else if (event.type === INPUT) {
                // Web ???????????????????????? value ????????????????????????
                // ????????? this.props.value ?????????????????? setData????????????????????? this.value???
                // ???????????? React???Vue???Vue3 input ????????? onInput ?????????onChange ?????????????????????????????????????????????????????????
                this.value = val;
            }
        }
        return super.dispatchEvent(event);
    }
}

// for Vue3
class SVGElement extends TaroElement {
}

// Taro ?????????????????? Web ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
class TaroEvent {
    constructor(type, opts, event) {
        this._stop = false;
        this._end = false;
        this.defaultPrevented = false;
        // timestamp can either be hi-res ( relative to page load) or low-res (relative to UNIX epoch)
        // here use hi-res timestamp
        this.timeStamp = Date.now();
        this.type = type.toLowerCase();
        this.mpEvent = event;
        this.bubbles = Boolean(opts && opts.bubbles);
        this.cancelable = Boolean(opts && opts.cancelable);
    }
    stopPropagation() {
        this._stop = true;
    }
    stopImmediatePropagation() {
        this._end = this._stop = true;
    }
    preventDefault() {
        this.defaultPrevented = true;
    }
    get target() {
        var _a, _b;
        const target = Object.create(((_a = this.mpEvent) === null || _a === void 0 ? void 0 : _a.target) || null);
        const element = getDocument().getElementById(target.id);
        target.dataset = element !== null ? element.dataset : EMPTY_OBJ;
        for (const key in (_b = this.mpEvent) === null || _b === void 0 ? void 0 : _b.detail) {
            target[key] = this.mpEvent.detail[key];
        }
        return target;
    }
    get currentTarget() {
        var _a, _b;
        const currentTarget = Object.create(((_a = this.mpEvent) === null || _a === void 0 ? void 0 : _a.currentTarget) || null);
        const element = getDocument().getElementById(currentTarget.id);
        if (element === null) {
            return this.target;
        }
        currentTarget.dataset = element.dataset;
        for (const key in (_b = this.mpEvent) === null || _b === void 0 ? void 0 : _b.detail) {
            currentTarget[key] = this.mpEvent.detail[key];
        }
        return currentTarget;
    }
}
function createEvent(event, node) {
    if (typeof event === 'string') {
        // For Vue3 using document.createEvent
        return new TaroEvent(event, { bubbles: true, cancelable: true });
    }
    const domEv = new TaroEvent(event.type, { bubbles: true, cancelable: true }, event);
    for (const key in event) {
        if (key === CURRENT_TARGET || key === TARGET || key === TYPE || key === TIME_STAMP) {
            continue;
        }
        else {
            domEv[key] = event[key];
        }
    }
    if (domEv.type === CONFIRM && (node === null || node === void 0 ? void 0 : node.nodeName) === INPUT) {
        // eslint-disable-next-line dot-notation
        domEv[KEY_CODE] = 13;
    }
    return domEv;
}
const eventsBatch = {};
// ????????????????????????????????????
function eventHandler(event) {
    var _a, _b;
    const hooks = getHooks();
    (_a = hooks.modifyMpEvent) === null || _a === void 0 ? void 0 : _a.call(hooks, event);
    event.currentTarget || (event.currentTarget = event.target);
    const currentTarget = event.currentTarget;
    const id = ((_b = currentTarget.dataset) === null || _b === void 0 ? void 0 : _b.sid /** sid */) || currentTarget.id /** uid */ || '';
    const node = getDocument().getElementById(id);
    if (node) {
        const dispatch = () => {
            var _a;
            const e = createEvent(event, node);
            (_a = hooks.modifyTaroEvent) === null || _a === void 0 ? void 0 : _a.call(hooks, e, node);
            node.dispatchEvent(e);
        };
        if (isFunction(hooks.batchedEventUpdates)) {
            const type = event.type;
            if (!hooks.isBubbleEvents(type) ||
                !isParentBinded(node, type) ||
                (type === TOUCHMOVE && !!node.props.catchMove)) {
                // ????????????????????? batchUpdate
                hooks.batchedEventUpdates(() => {
                    if (eventsBatch[type]) {
                        eventsBatch[type].forEach(fn => fn());
                        delete eventsBatch[type];
                    }
                    dispatch();
                });
            }
            else {
                // ??????????????????????????????????????????????????????????????????????????????????????????
                (eventsBatch[type] || (eventsBatch[type] = [])).push(dispatch);
            }
        }
        else {
            dispatch();
        }
    }
}

const doc = process.env.TARO_ENV === 'h5' ? document : EMPTY_OBJ;
const win = process.env.TARO_ENV === 'h5' ? window : EMPTY_OBJ;

function initPosition() {
    return {
        index: 0,
        column: 0,
        line: 0
    };
}
function feedPosition(position, str, len) {
    const start = position.index;
    const end = position.index = start + len;
    for (let i = start; i < end; i++) {
        const char = str.charAt(i);
        if (char === '\n') {
            position.line++;
            position.column = 0;
        }
        else {
            position.column++;
        }
    }
}
function jumpPosition(position, str, end) {
    const len = end - position.index;
    return feedPosition(position, str, len);
}
function copyPosition(position) {
    return {
        index: position.index,
        line: position.line,
        column: position.column
    };
}
const whitespace = /\s/;
function isWhitespaceChar(char) {
    return whitespace.test(char);
}
const equalSign = /=/;
function isEqualSignChar(char) {
    return equalSign.test(char);
}
function shouldBeIgnore(tagName) {
    const name = tagName.toLowerCase();
    if (options.html.skipElements.has(name)) {
        return true;
    }
    return false;
}
const alphanumeric = /[A-Za-z0-9]/;
function findTextEnd(str, index) {
    while (true) {
        const textEnd = str.indexOf('<', index);
        if (textEnd === -1) {
            return textEnd;
        }
        const char = str.charAt(textEnd + 1);
        if (char === '/' || char === '!' || alphanumeric.test(char)) {
            return textEnd;
        }
        index = textEnd + 1;
    }
}
function isWordEnd(cursor, wordBegin, html) {
    if (!isWhitespaceChar(html.charAt(cursor)))
        return false;
    const len = html.length;
    // backwrad
    for (let i = cursor - 1; i > wordBegin; i--) {
        const char = html.charAt(i);
        if (!isWhitespaceChar(char)) {
            if (isEqualSignChar(char))
                return false;
            break;
        }
    }
    // forward
    for (let i = cursor + 1; i < len; i++) {
        const char = html.charAt(i);
        if (!isWhitespaceChar(char)) {
            if (isEqualSignChar(char))
                return false;
            return true;
        }
    }
}
class Scaner {
    constructor(html) {
        this.tokens = [];
        this.position = initPosition();
        this.html = html;
    }
    scan() {
        const { html, position } = this;
        const len = html.length;
        while (position.index < len) {
            const start = position.index;
            this.scanText();
            if (position.index === start) {
                const isComment = html.startsWith('!--', start + 1);
                if (isComment) {
                    this.scanComment();
                }
                else {
                    const tagName = this.scanTag();
                    if (shouldBeIgnore(tagName)) {
                        this.scanSkipTag(tagName);
                    }
                }
            }
        }
        return this.tokens;
    }
    scanText() {
        const type = 'text';
        const { html, position } = this;
        let textEnd = findTextEnd(html, position.index);
        if (textEnd === position.index) {
            return;
        }
        if (textEnd === -1) {
            textEnd = html.length;
        }
        const start = copyPosition(position);
        const content = html.slice(position.index, textEnd);
        jumpPosition(position, html, textEnd);
        const end = copyPosition(position);
        this.tokens.push({ type, content, position: { start, end } });
    }
    scanComment() {
        const type = 'comment';
        const { html, position } = this;
        const start = copyPosition(position);
        feedPosition(position, html, 4); // "<!--".length
        let contentEnd = html.indexOf('-->', position.index);
        let commentEnd = contentEnd + 3; // "-->".length
        if (contentEnd === -1) {
            contentEnd = commentEnd = html.length;
        }
        const content = html.slice(position.index, contentEnd);
        jumpPosition(position, html, commentEnd);
        this.tokens.push({
            type,
            content,
            position: {
                start,
                end: copyPosition(position)
            }
        });
    }
    scanTag() {
        this.scanTagStart();
        const tagName = this.scanTagName();
        this.scanAttrs();
        this.scanTagEnd();
        return tagName;
    }
    scanTagStart() {
        const type = 'tag-start';
        const { html, position } = this;
        const secondChar = html.charAt(position.index + 1);
        const close = secondChar === '/';
        const start = copyPosition(position);
        feedPosition(position, html, close ? 2 : 1);
        this.tokens.push({ type, close, position: { start } });
    }
    scanTagEnd() {
        const type = 'tag-end';
        const { html, position } = this;
        const firstChar = html.charAt(position.index);
        const close = firstChar === '/';
        feedPosition(position, html, close ? 2 : 1);
        const end = copyPosition(position);
        this.tokens.push({ type, close, position: { end } });
    }
    scanTagName() {
        const type = 'tag';
        const { html, position } = this;
        const len = html.length;
        let start = position.index;
        while (start < len) {
            const char = html.charAt(start);
            const isTagChar = !(isWhitespaceChar(char) || char === '/' || char === '>');
            if (isTagChar)
                break;
            start++;
        }
        let end = start + 1;
        while (end < len) {
            const char = html.charAt(end);
            const isTagChar = !(isWhitespaceChar(char) || char === '/' || char === '>');
            if (!isTagChar)
                break;
            end++;
        }
        jumpPosition(position, html, end);
        const tagName = html.slice(start, end);
        this.tokens.push({
            type,
            content: tagName
        });
        return tagName;
    }
    scanAttrs() {
        const { html, position, tokens } = this;
        let cursor = position.index;
        let quote = null; // null, single-, or double-quote
        let wordBegin = cursor; // index of word start
        const words = []; // "key", "key=value", "key='value'", etc
        const len = html.length;
        while (cursor < len) {
            const char = html.charAt(cursor);
            if (quote) {
                const isQuoteEnd = char === quote;
                if (isQuoteEnd) {
                    quote = null;
                }
                cursor++;
                continue;
            }
            const isTagEnd = char === '/' || char === '>';
            if (isTagEnd) {
                if (cursor !== wordBegin) {
                    words.push(html.slice(wordBegin, cursor));
                }
                break;
            }
            if (isWordEnd(cursor, wordBegin, html)) {
                if (cursor !== wordBegin) {
                    words.push(html.slice(wordBegin, cursor));
                }
                wordBegin = cursor + 1;
                cursor++;
                continue;
            }
            const isQuoteStart = char === '\'' || char === '"';
            if (isQuoteStart) {
                quote = char;
                cursor++;
                continue;
            }
            cursor++;
        }
        jumpPosition(position, html, cursor);
        const wLen = words.length;
        const type = 'attribute';
        for (let i = 0; i < wLen; i++) {
            const word = words[i];
            const isNotPair = word.includes('=');
            if (isNotPair) {
                const secondWord = words[i + 1];
                if (secondWord && secondWord.startsWith('=')) {
                    if (secondWord.length > 1) {
                        const newWord = word + secondWord;
                        tokens.push({ type, content: newWord });
                        i += 1;
                        continue;
                    }
                    const thirdWord = words[i + 2];
                    i += 1;
                    if (thirdWord) {
                        const newWord = word + '=' + thirdWord;
                        tokens.push({ type, content: newWord });
                        i += 1;
                        continue;
                    }
                }
            }
            if (word.endsWith('=')) {
                const secondWord = words[i + 1];
                if (secondWord && !secondWord.includes('=')) {
                    const newWord = word + secondWord;
                    tokens.push({ type, content: newWord });
                    i += 1;
                    continue;
                }
                const newWord = word.slice(0, -1);
                tokens.push({ type, content: newWord });
                continue;
            }
            tokens.push({ type, content: word });
        }
    }
    scanSkipTag(tagName) {
        const { html, position } = this;
        const safeTagName = tagName.toLowerCase();
        const len = html.length;
        while (position.index < len) {
            const nextTag = html.indexOf('</', position.index);
            if (nextTag === -1) {
                this.scanText();
                break;
            }
            jumpPosition(position, html, nextTag);
            const name = this.scanTag();
            if (safeTagName === name.toLowerCase()) {
                break;
            }
        }
    }
}

function makeMap(str, expectsLowerCase) {
    const map = Object.create(null);
    const list = str.split(',');
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
    }
    return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val];
}
const specialMiniElements = {
    img: 'image',
    iframe: 'web-view'
};
const internalCompsList = Object.keys(internalComponents)
    .map(i => i.toLowerCase())
    .join(',');
// https://developers.weixin.qq.com/miniprogram/dev/component
const isMiniElements = makeMap(internalCompsList, true);
// https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements
const isInlineElements = makeMap('a,i,abbr,iframe,select,acronym,slot,small,span,bdi,kbd,strong,big,map,sub,sup,br,mark,mark,meter,template,canvas,textarea,cite,object,time,code,output,u,data,picture,tt,datalist,var,dfn,del,q,em,s,embed,samp,b', true);
// https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements
const isBlockElements = makeMap('address,fieldset,li,article,figcaption,main,aside,figure,nav,blockquote,footer,ol,details,form,p,dialog,h1,h2,h3,h4,h5,h6,pre,dd,header,section,div,hgroup,table,dl,hr,ul,dt', true);

function unquote(str) {
    const car = str.charAt(0);
    const end = str.length - 1;
    const isQuoteStart = car === '"' || car === "'";
    if (isQuoteStart && car === str.charAt(end)) {
        return str.slice(1, end);
    }
    return str;
}

const LEFT_BRACKET = '{';
const RIGHT_BRACKET = '}';
const CLASS_SELECTOR = '.';
const ID_SELECTOR = '#';
const CHILD_COMBINATOR = '>';
const GENERAL_SIBLING_COMBINATOR = '~';
const ADJACENT_SIBLING_COMBINATOR = '+';
class StyleTagParser {
    constructor() {
        this.styles = [];
    }
    extractStyle(src) {
        const REG_STYLE = /<style\s?[^>]*>((.|\n|\s)+?)<\/style>/g;
        let html = src;
        // let html = src.replace(/\n/g, '')
        html = html.replace(REG_STYLE, (_, $1) => {
            const style = $1.trim();
            this.stringToSelector(style);
            return '';
        });
        return html.trim();
    }
    stringToSelector(style) {
        let lb = style.indexOf(LEFT_BRACKET);
        while (lb > -1) {
            const rb = style.indexOf(RIGHT_BRACKET);
            const selectors = style.slice(0, lb).trim();
            let content = style.slice(lb + 1, rb);
            content = content.replace(/:(.*);/g, function (_, $1) {
                const t = $1.trim().replace(/ +/g, '+++');
                return `:${t};`;
            });
            content = content.replace(/ /g, '');
            content = content.replace(/\+\+\+/g, ' ');
            if (!(/;$/.test(content))) {
                content += ';';
            }
            selectors.split(',').forEach(src => {
                const selectorList = this.parseSelector(src);
                this.styles.push({
                    content,
                    selectorList
                });
            });
            style = style.slice(rb + 1);
            lb = style.indexOf(LEFT_BRACKET);
        }
        // console.log('res this.styles: ', this.styles)
    }
    parseSelector(src) {
        const list = src
            .trim()
            .replace(/ *([>~+]) */g, ' $1')
            .replace(/ +/g, ' ')
            .replace(/\[\s*([^[\]=\s]+)\s*=\s*([^[\]=\s]+)\s*\]/g, '[$1=$2]')
            .split(' ');
        const selectors = list.map(item => {
            const firstChar = item.charAt(0);
            const selector = {
                isChild: firstChar === CHILD_COMBINATOR,
                isGeneralSibling: firstChar === GENERAL_SIBLING_COMBINATOR,
                isAdjacentSibling: firstChar === ADJACENT_SIBLING_COMBINATOR,
                tag: null,
                id: null,
                class: [],
                attrs: []
            };
            item = item.replace(/^[>~+]/, '');
            // ???????????????
            item = item.replace(/\[(.+?)\]/g, function (_, $1) {
                const [key, value] = $1.split('=');
                const all = $1.indexOf('=') === -1;
                const attr = {
                    all,
                    key,
                    value: all ? null : value
                };
                selector.attrs.push(attr);
                return '';
            });
            item = item.replace(/([.#][A-Za-z0-9-_]+)/g, function (_, $1) {
                if ($1[0] === ID_SELECTOR) {
                    // id ?????????
                    selector.id = $1.substr(1);
                }
                else if ($1[0] === CLASS_SELECTOR) {
                    // class ?????????
                    selector.class.push($1.substr(1));
                }
                return '';
            });
            // ???????????????
            if (item !== '') {
                selector.tag = item;
            }
            return selector;
        });
        return selectors;
    }
    matchStyle(tagName, el, list) {
        const res = sortStyles(this.styles).reduce((str, { content, selectorList }, i) => {
            let idx = list[i];
            let selector = selectorList[idx];
            const nextSelector = selectorList[idx + 1];
            if ((nextSelector === null || nextSelector === void 0 ? void 0 : nextSelector.isGeneralSibling) || (nextSelector === null || nextSelector === void 0 ? void 0 : nextSelector.isAdjacentSibling)) {
                selector = nextSelector;
                idx += 1;
                list[i] += 1;
            }
            let isMatch = this.matchCurrent(tagName, el, selector);
            if (isMatch && selector.isGeneralSibling) {
                let prev = getPreviousElement(el);
                while (prev) {
                    if (prev.h5tagName && this.matchCurrent(prev.h5tagName, prev, selectorList[idx - 1])) {
                        isMatch = true;
                        break;
                    }
                    prev = getPreviousElement(prev);
                    isMatch = false;
                }
            }
            if (isMatch && selector.isAdjacentSibling) {
                const prev = getPreviousElement(el);
                if (!prev || !prev.h5tagName) {
                    isMatch = false;
                }
                else {
                    const isSiblingMatch = this.matchCurrent(prev.h5tagName, prev, selectorList[idx - 1]);
                    if (!isSiblingMatch) {
                        isMatch = false;
                    }
                }
            }
            if (isMatch) {
                if (idx === selectorList.length - 1) {
                    return str + content;
                }
                else if (idx < selectorList.length - 1) {
                    list[i] += 1;
                }
            }
            else {
                // ?????????????????????: >
                if (selector.isChild && idx > 0) {
                    list[i] -= 1;
                    if (this.matchCurrent(tagName, el, selectorList[list[i]])) {
                        list[i] += 1;
                    }
                }
            }
            return str;
        }, '');
        return res;
    }
    matchCurrent(tagName, el, selector) {
        // ???????????????
        if (selector.tag && selector.tag !== tagName)
            return false;
        // id ?????????
        if (selector.id && selector.id !== el.id)
            return false;
        // class ?????????
        if (selector.class.length) {
            const classList = el.className.split(' ');
            for (let i = 0; i < selector.class.length; i++) {
                const cls = selector.class[i];
                if (classList.indexOf(cls) === -1) {
                    return false;
                }
            }
        }
        // ???????????????
        if (selector.attrs.length) {
            for (let i = 0; i < selector.attrs.length; i++) {
                const { all, key, value } = selector.attrs[i];
                if (all && !el.hasAttribute(key)) {
                    return false;
                }
                else {
                    const attr = el.getAttribute(key);
                    if (attr !== unquote(value || '')) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
function getPreviousElement(el) {
    const parent = el.parentElement;
    if (!parent)
        return null;
    const prev = el.previousSibling;
    if (!prev)
        return null;
    if (prev.nodeType === 1 /* ELEMENT_NODE */) {
        return prev;
    }
    else {
        return getPreviousElement(prev);
    }
}
// ?????? css selector ????????????: ??????????????????
// @WARN ???????????????
// https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance#specificity_2
function sortStyles(styles) {
    return styles.sort((s1, s2) => {
        const hundreds1 = getHundredsWeight(s1.selectorList);
        const hundreds2 = getHundredsWeight(s2.selectorList);
        if (hundreds1 !== hundreds2)
            return hundreds1 - hundreds2;
        const tens1 = getTensWeight(s1.selectorList);
        const tens2 = getTensWeight(s2.selectorList);
        if (tens1 !== tens2)
            return tens1 - tens2;
        const ones1 = getOnesWeight(s1.selectorList);
        const ones2 = getOnesWeight(s2.selectorList);
        return ones1 - ones2;
    });
}
function getHundredsWeight(selectors) {
    return selectors.reduce((pre, cur) => pre + (cur.id ? 1 : 0), 0);
}
function getTensWeight(selectors) {
    return selectors.reduce((pre, cur) => pre + cur.class.length + cur.attrs.length, 0);
}
function getOnesWeight(selectors) {
    return selectors.reduce((pre, cur) => pre + (cur.tag ? 1 : 0), 0);
}

const closingTagAncestorBreakers = {
    li: ['ul', 'ol', 'menu'],
    dt: ['dl'],
    dd: ['dl'],
    tbody: ['table'],
    thead: ['table'],
    tfoot: ['table'],
    tr: ['table'],
    td: ['table']
};
function hasTerminalParent(tagName, stack) {
    const tagParents = closingTagAncestorBreakers[tagName];
    if (tagParents) {
        let currentIndex = stack.length - 1;
        while (currentIndex >= 0) {
            const parentTagName = stack[currentIndex].tagName;
            if (parentTagName === tagName) {
                break;
            }
            if (tagParents && tagParents.includes(parentTagName)) {
                return true;
            }
            currentIndex--;
        }
    }
    return false;
}
function getTagName(tag) {
    if (options.html.renderHTMLTag) {
        return tag;
    }
    if (specialMiniElements[tag]) {
        return specialMiniElements[tag];
    }
    else if (isMiniElements(tag)) {
        return tag;
    }
    else if (isBlockElements(tag)) {
        return 'view';
    }
    else if (isInlineElements(tag)) {
        return 'text';
    }
    return 'view';
}
function splitEqual(str) {
    const sep = '=';
    const idx = str.indexOf(sep);
    if (idx === -1)
        return [str];
    const key = str.slice(0, idx).trim();
    const value = str.slice(idx + sep.length).trim();
    return [key, value];
}
function format(children, document, styleOptions, parent) {
    return children
        .filter(child => {
        // ??????????????????????????????
        if (child.type === 'comment') {
            return false;
        }
        else if (child.type === 'text') {
            return child.content !== '';
        }
        return true;
    })
        .map((child) => {
        // ????????????
        if (child.type === 'text') {
            let text = document.createTextNode(child.content);
            if (isFunction(options.html.transformText)) {
                text = options.html.transformText(text, child);
            }
            parent === null || parent === void 0 ? void 0 : parent.appendChild(text);
            return text;
        }
        const el = document.createElement(getTagName(child.tagName));
        el.h5tagName = child.tagName;
        parent === null || parent === void 0 ? void 0 : parent.appendChild(el);
        if (!options.html.renderHTMLTag) {
            el.className = `h5-${child.tagName}`;
        }
        for (let i = 0; i < child.attributes.length; i++) {
            const attr = child.attributes[i];
            const [key, value] = splitEqual(attr);
            if (key === 'class') {
                el.className += ' ' + unquote(value);
            }
            else if (key[0] === 'o' && key[1] === 'n') {
                continue;
            }
            else {
                el.setAttribute(key, value == null ? true : unquote(value));
            }
        }
        const { styleTagParser, descendantList } = styleOptions;
        const list = descendantList.slice();
        const style = styleTagParser.matchStyle(child.tagName, el, list);
        el.setAttribute('style', style + el.style.cssText);
        // console.log('style, ', style)
        format(child.children, document, {
            styleTagParser,
            descendantList: list
        }, el);
        if (isFunction(options.html.transformElement)) {
            return options.html.transformElement(el, child);
        }
        return el;
    });
}
function parser(html, document) {
    const styleTagParser = new StyleTagParser();
    html = styleTagParser.extractStyle(html);
    const tokens = new Scaner(html).scan();
    const root = { tagName: '', children: [], type: 'element', attributes: [] };
    const state = { tokens, options, cursor: 0, stack: [root] };
    parse(state);
    return format(root.children, document, {
        styleTagParser,
        descendantList: Array(styleTagParser.styles.length).fill(0)
    });
}
function parse(state) {
    const { tokens, stack } = state;
    let { cursor } = state;
    const len = tokens.length;
    let nodes = stack[stack.length - 1].children;
    while (cursor < len) {
        const token = tokens[cursor];
        if (token.type !== 'tag-start') {
            // comment or text
            nodes.push(token);
            cursor++;
            continue;
        }
        const tagToken = tokens[++cursor];
        cursor++;
        const tagName = tagToken.content.toLowerCase();
        if (token.close) {
            let index = stack.length;
            let shouldRewind = false;
            while (--index > -1) {
                if (stack[index].tagName === tagName) {
                    shouldRewind = true;
                    break;
                }
            }
            while (cursor < len) {
                const endToken = tokens[cursor];
                if (endToken.type !== 'tag-end')
                    break;
                cursor++;
            }
            if (shouldRewind) {
                stack.splice(index);
                break;
            }
            else {
                continue;
            }
        }
        const isClosingTag = options.html.closingElements.has(tagName);
        let shouldRewindToAutoClose = isClosingTag;
        if (shouldRewindToAutoClose) {
            shouldRewindToAutoClose = !hasTerminalParent(tagName, stack);
        }
        if (shouldRewindToAutoClose) {
            let currentIndex = stack.length - 1;
            while (currentIndex > 0) {
                if (tagName === stack[currentIndex].tagName) {
                    stack.splice(currentIndex);
                    const previousIndex = currentIndex - 1;
                    nodes = stack[previousIndex].children;
                    break;
                }
                currentIndex = currentIndex - 1;
            }
        }
        const attributes = [];
        let attrToken;
        while (cursor < len) {
            attrToken = tokens[cursor];
            if (attrToken.type === 'tag-end')
                break;
            attributes.push(attrToken.content);
            cursor++;
        }
        cursor++;
        const children = [];
        const element = {
            type: 'element',
            tagName: tagToken.content,
            attributes,
            children
        };
        nodes.push(element);
        const hasChildren = !(attrToken.close || options.html.voidElements.has(tagName));
        if (hasChildren) {
            stack.push({ tagName, children });
            const innerState = { tokens, cursor, stack };
            parse(innerState);
            cursor = innerState.cursor;
        }
    }
    state.cursor = cursor;
}

options.html = {
    skipElements: new Set(['style', 'script']),
    voidElements: new Set([
        '!doctype', 'area', 'base', 'br', 'col', 'command',
        'embed', 'hr', 'img', 'input', 'keygen', 'link',
        'meta', 'param', 'source', 'track', 'wbr'
    ]),
    closingElements: new Set([
        'html', 'head', 'body', 'p', 'dt', 'dd', 'li', 'option',
        'thead', 'th', 'tbody', 'tr', 'td', 'tfoot', 'colgroup'
    ]),
    renderHTMLTag: false
};
function setInnerHTML(element, html, getDoc) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    const children = parser(html, getDoc());
    for (let i = 0; i < children.length; i++) {
        element.appendChild(children[i]);
    }
}

/**
 * An implementation of `Element.insertAdjacentHTML()`
 * to support Vue 3 with a version of or greater than `vue@3.1.2`
 */
function insertAdjacentHTMLImpl(getDoc, position, html) {
    var _a, _b;
    const parsedNodes = parser(html, getDoc());
    for (let i = 0; i < parsedNodes.length; i++) {
        const n = parsedNodes[i];
        switch (position) {
            case 'beforebegin':
                (_a = this.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(n, this);
                break;
            case 'afterbegin':
                if (this.hasChildNodes()) {
                    this.insertBefore(n, this.childNodes[0]);
                }
                else {
                    this.appendChild(n);
                }
                break;
            case 'beforeend':
                this.appendChild(n);
                break;
            case 'afterend':
                (_b = this.parentNode) === null || _b === void 0 ? void 0 : _b.appendChild(n);
                break;
        }
    }
}
function cloneNode(getDoc, isDeep = false) {
    const document = getDoc();
    let newNode;
    if (this.nodeType === 1 /* ELEMENT_NODE */) {
        newNode = document.createElement(this.nodeName);
    }
    else if (this.nodeType === 3 /* TEXT_NODE */) {
        newNode = document.createTextNode('');
    }
    for (const key in this) {
        const value = this[key];
        if ([PROPS, DATASET].includes(key) && typeof value === OBJECT) {
            newNode[key] = Object.assign({}, value);
        }
        else if (key === '_value') {
            newNode[key] = value;
        }
        else if (key === STYLE) {
            newNode.style._value = Object.assign({}, value._value);
            newNode.style._usedStyleProp = new Set(Array.from(value._usedStyleProp));
        }
    }
    if (isDeep) {
        newNode.childNodes = this.childNodes.map(node => node.cloneNode(true));
    }
    return newNode;
}
function contains(node) {
    let isContains = false;
    this.childNodes.some(childNode => {
        const { uid } = childNode;
        if (uid === node.uid || uid === node.id || childNode.contains(node)) {
            isContains = true;
            return true;
        }
    });
    return isContains;
}

let TaroNodeImpl = class TaroNodeImpl {
    constructor(// eslint-disable-next-line @typescript-eslint/indent
    getElement) {
        this.getDoc = () => getElement(ElementNames.Document)();
    }
    bind(ctx) {
        const getDoc = this.getDoc;
        if (ENABLE_INNER_HTML) {
            bindInnerHTML(ctx, getDoc);
            if (ENABLE_ADJACENT_HTML) {
                ctx.insertAdjacentHTML = insertAdjacentHTMLImpl.bind(ctx, getDoc);
            }
        }
        if (ENABLE_CLONE_NODE) {
            ctx.cloneNode = cloneNode.bind(ctx, getDoc);
        }
        if (ENABLE_CONTAINS) {
            ctx.contains = contains.bind(ctx);
        }
    }
};
TaroNodeImpl = __decorate([
    injectable(),
    __param(0, inject(SERVICE_IDENTIFIER.TaroElementFactory)),
    __metadata("design:paramtypes", [Function])
], TaroNodeImpl);
function bindInnerHTML(ctx, getDoc) {
    Object.defineProperty(ctx, 'innerHTML', {
        configurable: true,
        enumerable: true,
        set(html) {
            setInnerHTML.call(this, this, html, getDoc);
        },
        get() {
            return '';
        }
    });
}

function getBoundingClientRectImpl() {
    if (!options.miniGlobal)
        return Promise.resolve(null);
    return new Promise(resolve => {
        const query = options.miniGlobal.createSelectorQuery();
        query.select(`#${this.uid}`).boundingClientRect(res => {
            resolve(res);
        }).exec();
    });
}
function getTemplateContent(ctx) {
    if (ctx.nodeName === 'template') {
        const content = ctx._getElement(ElementNames.Element)(DOCUMENT_FRAGMENT);
        content.childNodes = ctx.childNodes;
        ctx.childNodes = [content];
        content.parentNode = ctx;
        content.childNodes.forEach(nodes => {
            nodes.parentNode = content;
        });
        return content;
    }
}

let TaroElementImpl = class TaroElementImpl {
    bind(ctx) {
        if (ENABLE_SIZE_APIS) {
            ctx.getBoundingClientRect = getBoundingClientRectImpl.bind(ctx);
        }
        if (ENABLE_TEMPLATE_CONTENT) {
            bindContent(ctx);
        }
    }
};
TaroElementImpl = __decorate([
    injectable()
], TaroElementImpl);
function bindContent(ctx) {
    Object.defineProperty(ctx, 'content', {
        configurable: true,
        enumerable: true,
        get() {
            return getTemplateContent(ctx);
        }
    });
}

let TaroDocument = class TaroDocument extends TaroElement {
    constructor(// eslint-disable-next-line @typescript-eslint/indent
    getText) {
        super();
        this._getText = getText;
        this.nodeType = 9 /* DOCUMENT_NODE */;
        this.nodeName = DOCUMENT_ELEMENT_NAME;
    }
    createElement(type) {
        const getElement = this._getElement;
        if (type === ROOT_STR) {
            return getElement(ElementNames.RootElement)();
        }
        if (controlledComponent.has(type)) {
            return getElement(ElementNames.FormElement)(type);
        }
        return getElement(ElementNames.Element)(type);
    }
    // an ugly fake createElementNS to deal with @vue/runtime-dom's
    // support mounting app to svg container since vue@3.0.8
    createElementNS(_svgNS, type) {
        return this.createElement(type);
    }
    createTextNode(text) {
        return this._getText(text);
    }
    getElementById(id) {
        const el = eventSource.get(id);
        return isUndefined(el) ? null : el;
    }
    querySelector(query) {
        // ?????? Vue3 ??????????????????
        if (/^#/.test(query)) {
            return this.getElementById(query.slice(1));
        }
        return null;
    }
    querySelectorAll() {
        // fake hack
        return [];
    }
    // @TODO: @PERF: ??? hydrate ??????????????? node
    createComment() {
        const textnode = this._getText('');
        textnode.nodeName = COMMENT;
        return textnode;
    }
};
TaroDocument = __decorate([
    injectable(),
    __param(0, inject(SID_TARO_TEXT_FACTORY)),
    __metadata("design:paramtypes", [Function])
], TaroDocument);

/**
 * ?????????????????????, ??? ????????????????????????????????????????????????????????????????????????
 * ?????? ??? https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html
 */
const BUBBLE_EVENTS = new Set([
    'touchstart',
    'touchmove',
    'touchcancel',
    'touchend',
    'touchforcechange',
    'tap',
    'longpress',
    'longtap',
    'transitionend',
    'animationstart',
    'animationiteration',
    'animationend'
]);

const defaultMiniLifecycle = {
    app: [
        'onLaunch',
        'onShow',
        'onHide'
    ],
    page: [
        'onLoad',
        'onUnload',
        'onReady',
        'onShow',
        'onHide',
        [
            'onPullDownRefresh',
            'onReachBottom',
            'onPageScroll',
            'onResize',
            'onTabItemTap',
            'onTitleClick',
            'onOptionMenuClick',
            'onPopMenuClick',
            'onPullIntercept',
            'onAddToFavorites'
        ]
    ]
};
const getMiniLifecycle = function (defaultConfig) {
    return defaultConfig;
};
const getLifecycle = function (instance, lifecycle) {
    return instance[lifecycle];
};
const getPathIndex = function (indexOfNode) {
    return `[${indexOfNode}]`;
};
const getEventCenter = function (Events) {
    return new Events();
};
const isBubbleEvents = function (eventName) {
    return BUBBLE_EVENTS.has(eventName);
};
const getSpecialNodes = function () {
    return ['view', 'text', 'image'];
};
const DefaultHooksContainer = new ContainerModule(bind => {
    function bindFunction(sid, target) {
        return bind(sid).toFunction(target);
    }
    bindFunction(SID_GET_MINI_LIFECYCLE, getMiniLifecycle);
    bindFunction(SID_GET_LIFECYCLE, getLifecycle);
    bindFunction(SID_GET_PATH_INDEX, getPathIndex);
    bindFunction(SID_GET_EVENT_CENTER, getEventCenter);
    bindFunction(SID_IS_BUBBLE_EVENTS, isBubbleEvents);
    bindFunction(SID_GET_SPECIAL_NODES, getSpecialNodes);
});

let Hooks = class Hooks {
    getMiniLifecycleImpl() {
        return this.getMiniLifecycle(defaultMiniLifecycle);
    }
    modifyMpEvent(e) {
        var _a;
        (_a = this.modifyMpEventImpls) === null || _a === void 0 ? void 0 : _a.forEach(fn => {
            try {
                // ???????????????????????????????????????????????????
                fn(e);
            }
            catch (error) {
                console.warn('[Taro modifyMpEvent hook Error]: ', error);
            }
        });
    }
    modifyTaroEvent(e, element) {
        var _a;
        (_a = this.modifyTaroEventImpls) === null || _a === void 0 ? void 0 : _a.forEach(fn => fn(e, element));
    }
    modifyDispatchEvent(e, element) {
        var _a;
        (_a = this.modifyDispatchEventImpls) === null || _a === void 0 ? void 0 : _a.forEach(fn => fn(e, element));
    }
    initNativeApi(taro) {
        var _a;
        (_a = this.initNativeApiImpls) === null || _a === void 0 ? void 0 : _a.forEach(fn => fn(taro));
    }
    patchElement(element) {
        var _a;
        (_a = this.patchElementImpls) === null || _a === void 0 ? void 0 : _a.forEach(fn => fn(element));
    }
};
__decorate([
    inject(SID_GET_MINI_LIFECYCLE),
    __metadata("design:type", Function)
], Hooks.prototype, "getMiniLifecycle", void 0);
__decorate([
    inject(SID_GET_LIFECYCLE),
    __metadata("design:type", Function)
], Hooks.prototype, "getLifecycle", void 0);
__decorate([
    inject(SID_GET_PATH_INDEX),
    __metadata("design:type", Function)
], Hooks.prototype, "getPathIndex", void 0);
__decorate([
    inject(SID_GET_EVENT_CENTER),
    __metadata("design:type", Function)
], Hooks.prototype, "getEventCenter", void 0);
__decorate([
    inject(SID_IS_BUBBLE_EVENTS),
    __metadata("design:type", Function)
], Hooks.prototype, "isBubbleEvents", void 0);
__decorate([
    inject(SID_GET_SPECIAL_NODES),
    __metadata("design:type", Function)
], Hooks.prototype, "getSpecialNodes", void 0);
__decorate([
    inject(SID_ON_REMOVE_ATTRIBUTE),
    optional(),
    __metadata("design:type", Function)
], Hooks.prototype, "onRemoveAttribute", void 0);
__decorate([
    inject(SID_BATCHED_EVENT_UPDATES),
    optional(),
    __metadata("design:type", Function)
], Hooks.prototype, "batchedEventUpdates", void 0);
__decorate([
    inject(SID_MERGE_PAGE_INSTANCE),
    optional(),
    __metadata("design:type", Function)
], Hooks.prototype, "mergePageInstance", void 0);
__decorate([
    inject(SID_MODIFY_PAGE_OBJECT),
    optional(),
    __metadata("design:type", Function)
], Hooks.prototype, "modifyPageObject", void 0);
__decorate([
    inject(SID_CREATE_PULLDOWN_COMPONENT),
    optional(),
    __metadata("design:type", Function)
], Hooks.prototype, "createPullDownComponent", void 0);
__decorate([
    inject(SID_GET_DOM_NODE),
    optional(),
    __metadata("design:type", Function)
], Hooks.prototype, "getDOMNode", void 0);
__decorate([
    inject(SID_MODIFY_HYDRATE_DATA),
    optional(),
    __metadata("design:type", Function)
], Hooks.prototype, "modifyHydrateData", void 0);
__decorate([
    inject(SID_MODIFY_SET_ATTR_PAYLOAD),
    optional(),
    __metadata("design:type", Function)
], Hooks.prototype, "modifySetAttrPayload", void 0);
__decorate([
    inject(SID_MODIFY_RM_ATTR_PAYLOAD),
    optional(),
    __metadata("design:type", Function)
], Hooks.prototype, "modifyRmAttrPayload", void 0);
__decorate([
    inject(SID_ON_ADD_EVENT),
    optional(),
    __metadata("design:type", Function)
], Hooks.prototype, "onAddEvent", void 0);
__decorate([
    multiInject(SID_MODIFY_MP_EVENT),
    optional(),
    __metadata("design:type", Array)
], Hooks.prototype, "modifyMpEventImpls", void 0);
__decorate([
    multiInject(SID_MODIFY_TARO_EVENT),
    optional(),
    __metadata("design:type", Array)
], Hooks.prototype, "modifyTaroEventImpls", void 0);
__decorate([
    multiInject(SID_MODIFY_DISPATCH_EVENT),
    optional(),
    __metadata("design:type", Array)
], Hooks.prototype, "modifyDispatchEventImpls", void 0);
__decorate([
    multiInject(SID_INIT_NATIVE_API),
    optional(),
    __metadata("design:type", Array)
], Hooks.prototype, "initNativeApiImpls", void 0);
__decorate([
    multiInject(SID_PATCH_ELEMENT),
    optional(),
    __metadata("design:type", Array)
], Hooks.prototype, "patchElementImpls", void 0);
Hooks = __decorate([
    injectable()
], Hooks);

function processPluginHooks(container) {
    const keys = Object.keys(defaultReconciler);
    keys.forEach(key => {
        if (key in SERVICE_IDENTIFIER) {
            // is hooks
            const identifier = SERVICE_IDENTIFIER[key];
            const fn = defaultReconciler[key];
            if (isArray(fn)) {
                // is multi
                fn.forEach(item => container.bind(identifier).toFunction(item));
            }
            else {
                if (container.isBound(identifier)) {
                    // ??????????????????????????????????????????????????????
                    container.rebind(identifier).toFunction(fn);
                }
                else {
                    container.bind(identifier).toFunction(fn);
                }
            }
        }
    });
}

const container = new Container();
function bind(sid, target, options = {}) {
    let res = container.bind(sid).to(target);
    if (options.single) {
        res = res.inSingletonScope();
    }
    if (options.name) {
        res = res.whenTargetNamed(options.name);
    }
    return res;
}
if (process.env.TARO_ENV !== 'h5') {
    bind(SID_TARO_TEXT, TaroText);
    bind(SID_TARO_ELEMENT, TaroElement, { name: ElementNames.Element });
    bind(SID_TARO_ELEMENT, TaroRootElement, { name: ElementNames.RootElement });
    bind(SID_TARO_ELEMENT, FormElement, { name: ElementNames.FormElement });
    bind(SID_TARO_ELEMENT, TaroDocument, { name: ElementNames.Document, single: true });
    bind(SID_TARO_NODE_IMPL, TaroNodeImpl, { single: true });
    bind(SID_TARO_ELEMENT_IMPL, TaroElementImpl, { single: true });
    container.bind(SID_TARO_ELEMENT_FACTORY).toFactory((context) => {
        return (named) => (nodeName) => {
            const el = context.container.getNamed(SID_TARO_ELEMENT, named);
            if (nodeName) {
                el.nodeName = nodeName;
            }
            el.tagName = el.nodeName.toUpperCase();
            return el;
        };
    });
    container.bind(SID_TARO_TEXT_FACTORY).toFactory((context) => {
        return (text) => {
            const textNode = context.container.get(SID_TARO_TEXT);
            textNode._value = text;
            return textNode;
        };
    });
}
bind(SID_HOOKS, Hooks, { single: true });
container.load(DefaultHooksContainer);
processPluginHooks(container);
store.container = container;

function createDocument() {
    /**
     * <document>
     *   <html>
     *     <head></head>
     *     <body>
     *       <container>
     *         <app id="app" />
     *       </container>
     *     </body>
     *   </html>
     * </document>
     */
    const getElement = container.get(SERVICE_IDENTIFIER.TaroElementFactory);
    const doc = getElement(ElementNames.Document)();
    const documentCreateElement = doc.createElement.bind(doc);
    const html = documentCreateElement(HTML);
    const head = documentCreateElement(HEAD);
    const body = documentCreateElement(BODY);
    const app = documentCreateElement(APP);
    app.id = APP;
    const container$1 = documentCreateElement(CONTAINER); // ?????????????????????????????? vue
    doc.appendChild(html);
    html.appendChild(head);
    html.appendChild(body);
    body.appendChild(container$1);
    container$1.appendChild(app);
    doc.documentElement = html;
    doc.head = head;
    doc.body = body;
    doc.createEvent = createEvent;
    return doc;
}
const document$1 = process.env.TARO_ENV === 'h5'
    ? doc
    : createDocument();

const machine = 'Macintosh';
const arch = 'Intel Mac OS X 10_14_5';
const engine = 'AppleWebKit/534.36 (KHTML, like Gecko) NodeJS/v4.1.0 Chrome/76.0.3809.132 Safari/534.36';
const msg = '(' + machine + '; ' + arch + ') ' + engine;
const navigator = process.env.TARO_ENV === 'h5' ? win.navigator : {
    appCodeName: 'Mozilla',
    appName: 'Netscape',
    appVersion: '5.0 ' + msg,
    cookieEnabled: true,
    mimeTypes: [],
    onLine: true,
    platform: 'MacIntel',
    plugins: [],
    product: 'Taro',
    productSub: '20030107',
    userAgent: 'Mozilla/5.0 ' + msg,
    vendor: 'Joyent',
    vendorSub: ''
};

// https://github.com/myrne/performance-now
let now;
(function () {
    let loadTime;
    if ((typeof performance !== 'undefined' && performance !== null) && performance.now) {
        now = function () {
            return performance.now();
        };
    }
    else if (Date.now) {
        now = function () {
            return Date.now() - loadTime;
        };
        loadTime = Date.now();
    }
    else {
        now = function () {
            return new Date().getTime() - loadTime;
        };
        loadTime = new Date().getTime();
    }
})();
let lastTime = 0;
// https://gist.github.com/paulirish/1579671
// https://gist.github.com/jalbam/5fe05443270fa6d8136238ec72accbc0
const raf = typeof requestAnimationFrame !== 'undefined' && requestAnimationFrame !== null ? requestAnimationFrame : function (callback) {
    const _now = now();
    const nextTime = Math.max(lastTime + 16, _now); // First time will execute it immediately but barely noticeable and performance is gained.
    return setTimeout(function () { callback(lastTime = nextTime); }, nextTime - _now);
};
const caf = typeof cancelAnimationFrame !== 'undefined' && cancelAnimationFrame !== null
    ? cancelAnimationFrame
    : function (seed) {
        // fix https://github.com/NervJS/taro/issues/7749
        clearTimeout(seed);
    };

function getComputedStyle(element) {
    return element.style;
}

const window$1 = process.env.TARO_ENV === 'h5' ? win : {
    navigator,
    document: document$1
};
if (process.env.TARO_ENV && process.env.TARO_ENV !== 'h5') {
    const globalProperties = [
        ...Object.getOwnPropertyNames(global || win),
        ...Object.getOwnPropertySymbols(global || win)
    ];
    globalProperties.forEach(property => {
        if (property === 'atob')
            return;
        if (!Object.prototype.hasOwnProperty.call(window$1, property)) {
            window$1[property] = global[property];
        }
    });
    window$1.requestAnimationFrame = raf;
    window$1.cancelAnimationFrame = caf;
    window$1.getComputedStyle = getComputedStyle;
    window$1.addEventListener = noop;
    window$1.removeEventListener = noop;
    if (!(DATE in window$1)) {
        window$1.Date = Date;
    }
    window$1.setTimeout = function (...args) {
        return setTimeout(...args);
    };
    window$1.clearTimeout = function (...args) {
        return clearTimeout(...args);
    };
    document$1.defaultView = window$1;
}

const Current = {
    app: null,
    router: null,
    page: null
};
const getCurrentInstance = () => Current;

class Events {
    constructor(opts) {
        var _a;
        this.callbacks = (_a = opts === null || opts === void 0 ? void 0 : opts.callbacks) !== null && _a !== void 0 ? _a : {};
    }
    on(eventName, callback, context) {
        let event, node, tail, list;
        if (!callback) {
            return this;
        }
        eventName = eventName.split(Events.eventSplitter);
        this.callbacks || (this.callbacks = {});
        const calls = this.callbacks;
        while ((event = eventName.shift())) {
            list = calls[event];
            node = list ? list.tail : {};
            node.next = tail = {};
            node.context = context;
            node.callback = callback;
            calls[event] = {
                tail,
                next: list ? list.next : node
            };
        }
        return this;
    }
    once(events, callback, context) {
        const wrapper = (...args) => {
            callback.apply(this, args);
            this.off(events, wrapper, context);
        };
        this.on(events, wrapper, context);
        return this;
    }
    off(events, callback, context) {
        let event, calls, node, tail, cb, ctx;
        if (!(calls = this.callbacks)) {
            return this;
        }
        if (!(events || callback || context)) {
            delete this.callbacks;
            return this;
        }
        events = events ? events.split(Events.eventSplitter) : Object.keys(calls);
        while ((event = events.shift())) {
            node = calls[event];
            delete calls[event];
            if (!node || !(callback || context)) {
                continue;
            }
            tail = node.tail;
            while ((node = node.next) !== tail) {
                cb = node.callback;
                ctx = node.context;
                if ((callback && cb !== callback) || (context && ctx !== context)) {
                    this.on(event, cb, ctx);
                }
            }
        }
        return this;
    }
    trigger(events) {
        let event, node, calls, tail;
        if (!(calls = this.callbacks)) {
            return this;
        }
        events = events.split(Events.eventSplitter);
        const rest = [].slice.call(arguments, 1);
        while ((event = events.shift())) {
            if ((node = calls[event])) {
                tail = node.tail;
                while ((node = node.next) !== tail) {
                    node.callback.apply(node.context || this, rest);
                }
            }
        }
        return this;
    }
}
Events.eventSplitter = /\s+/;
const eventCenter = getHooks().getEventCenter(Events);
container.bind(SID_EVENT_CENTER).toConstantValue(eventCenter);

/* eslint-disable dot-notation */
const instances = new Map();
const pageId = incrementId();
function injectPageInstance(inst, id) {
    var _a, _b;
    (_b = (_a = getHooks()).mergePageInstance) === null || _b === void 0 ? void 0 : _b.call(_a, instances.get(id), inst);
    instances.set(id, inst);
}
function getPageInstance(id) {
    return instances.get(id);
}
function addLeadingSlash(path) {
    if (path == null) {
        return '';
    }
    return path.charAt(0) === '/' ? path : '/' + path;
}
function safeExecute(path, lifecycle, ...args) {
    const instance = instances.get(path);
    if (instance == null) {
        return;
    }
    const func = getHooks().getLifecycle(instance, lifecycle);
    if (isArray(func)) {
        const res = func.map(fn => fn.apply(instance, args));
        return res[0];
    }
    if (!isFunction(func)) {
        return;
    }
    return func.apply(instance, args);
}
function stringify(obj) {
    if (obj == null) {
        return '';
    }
    const path = Object.keys(obj).map((key) => {
        return key + '=' + obj[key];
    }).join('&');
    return path === '' ? path : '?' + path;
}
function getPath(id, options) {
    const idx = id.indexOf('?');
    return `${idx > -1 ? id.substring(0, idx) : id}${stringify(process.env.TARO_ENV === 'h5' ? { stamp: (options === null || options === void 0 ? void 0 : options.stamp) || '' } : options)}`;
}
function getOnReadyEventKey(path) {
    return path + '.' + ON_READY;
}
function getOnShowEventKey(path) {
    return path + '.' + ON_SHOW;
}
function getOnHideEventKey(path) {
    return path + '.' + ON_HIDE;
}
function createPageConfig(component, pageName, data, pageConfig) {
    var _a, _b, _c;
    // ????????? Page ??????????????????????????????????????????????????????????????????????????????
    const id = pageName !== null && pageName !== void 0 ? pageName : `taro_page_${pageId()}`;
    const hooks = getHooks();
    const [ONLOAD, ONUNLOAD, ONREADY, ONSHOW, ONHIDE, LIFECYCLES] = hooks.getMiniLifecycleImpl().page;
    let pageElement = null;
    let unmounting = false;
    let prepareMountList = [];
    function setCurrentRouter(page) {
        const router = process.env.TARO_ENV === 'h5' ? page.$taroPath : page.route || page.__route__ || page.$taroPath;
        Current.router = {
            params: page.$taroParams,
            path: addLeadingSlash(router),
            onReady: getOnReadyEventKey(id),
            onShow: getOnShowEventKey(id),
            onHide: getOnHideEventKey(id)
        };
    }
    let loadResolver;
    let hasLoaded;
    const config = {
        [ONLOAD](options = {}, cb) {
            hasLoaded = new Promise(resolve => { loadResolver = resolve; });
            perf.start(PAGE_INIT);
            Current.page = this;
            this.config = pageConfig || {};
            options.$taroTimestamp = Date.now();
            // this.$taroPath ?????????????????????????????????????????????????????? options ????????????
            this.$taroPath = getPath(id, options);
            const $taroPath = this.$taroPath;
            if (process.env.TARO_ENV === 'h5') {
                config.path = this.$taroPath;
            }
            // this.$taroParams ?????????????????????????????????????????????????????????????????????
            if (this.$taroParams == null) {
                this.$taroParams = Object.assign({}, options);
            }
            setCurrentRouter(this);
            const mount = () => {
                Current.app.mount(component, $taroPath, () => {
                    pageElement = document$1.getElementById($taroPath);
                    ensure(pageElement !== null, '???????????????????????????');
                    safeExecute($taroPath, ON_LOAD, this.$taroParams);
                    loadResolver();
                    if (process.env.TARO_ENV !== 'h5') {
                        pageElement.ctx = this;
                        pageElement.performUpdate(true, cb);
                    }
                    else {
                        isFunction(cb) && cb();
                    }
                });
            };
            if (unmounting) {
                prepareMountList.push(mount);
            }
            else {
                mount();
            }
        },
        [ONUNLOAD]() {
            const $taroPath = this.$taroPath;
            unmounting = true;
            Current.app.unmount($taroPath, () => {
                unmounting = false;
                instances.delete($taroPath);
                if (pageElement) {
                    pageElement.ctx = null;
                    pageElement = null;
                }
                if (prepareMountList.length) {
                    prepareMountList.forEach(fn => fn());
                    prepareMountList = [];
                }
            });
        },
        [ONREADY]() {
            // ??????????????????
            safeExecute(this.$taroPath, ON_READY);
            // ??????????????????????????????????????????
            raf(() => eventCenter.trigger(getOnReadyEventKey(id)));
            this.onReady.called = true;
        },
        [ONSHOW](options = {}) {
            hasLoaded.then(() => {
                // ?????? Current ??? page ??? router
                Current.page = this;
                setCurrentRouter(this);
                // ??????????????????
                safeExecute(this.$taroPath, ON_SHOW, options);
                // ??????????????????????????????????????????
                raf(() => eventCenter.trigger(getOnShowEventKey(id)));
            });
        },
        [ONHIDE]() {
            // ?????? Current ??? page ??? router
            if (Current.page === this) {
                Current.page = null;
                Current.router = null;
            }
            // ??????????????????
            safeExecute(this.$taroPath, ON_HIDE);
            // ??????????????????????????????????????????
            eventCenter.trigger(getOnHideEventKey(id));
        }
    };
    LIFECYCLES.forEach((lifecycle) => {
        config[lifecycle] = function () {
            return safeExecute(this.$taroPath, lifecycle, ...arguments);
        };
    });
    // onShareAppMessage ??? onShareTimeline ?????????????????????????????????????????????????????????????????????????????????
    if (component.onShareAppMessage ||
        ((_a = component.prototype) === null || _a === void 0 ? void 0 : _a.onShareAppMessage) ||
        component.enableShareAppMessage) {
        config.onShareAppMessage = function (options) {
            const target = options === null || options === void 0 ? void 0 : options.target;
            if (target) {
                const id = target.id;
                const element = document$1.getElementById(id);
                if (element) {
                    target.dataset = element.dataset;
                }
            }
            return safeExecute(this.$taroPath, 'onShareAppMessage', options);
        };
    }
    if (component.onShareTimeline ||
        ((_b = component.prototype) === null || _b === void 0 ? void 0 : _b.onShareTimeline) ||
        component.enableShareTimeline) {
        config.onShareTimeline = function () {
            return safeExecute(this.$taroPath, 'onShareTimeline');
        };
    }
    config.eh = eventHandler;
    if (!isUndefined(data)) {
        config.data = data;
    }
    (_c = hooks.modifyPageObject) === null || _c === void 0 ? void 0 : _c.call(hooks, config);
    return config;
}
function createComponentConfig(component, componentName, data) {
    const id = componentName !== null && componentName !== void 0 ? componentName : `taro_component_${pageId()}`;
    let componentElement = null;
    const config = {
        attached() {
            var _a;
            perf.start(PAGE_INIT);
            const path = getPath(id, { id: ((_a = this.getPageId) === null || _a === void 0 ? void 0 : _a.call(this)) || pageId() });
            Current.app.mount(component, path, () => {
                componentElement = document$1.getElementById(path);
                ensure(componentElement !== null, '???????????????????????????');
                this.$taroInstances = instances.get(path);
                safeExecute(path, ON_LOAD);
                if (process.env.TARO_ENV !== 'h5') {
                    componentElement.ctx = this;
                    componentElement.performUpdate(true);
                }
            });
        },
        detached() {
            const path = getPath(id, { id: this.getPageId() });
            Current.app.unmount(path, () => {
                instances.delete(path);
                if (componentElement) {
                    componentElement.ctx = null;
                }
            });
        },
        methods: {
            eh: eventHandler
        }
    };
    if (!isUndefined(data)) {
        config.data = data;
    }
    [OPTIONS, EXTERNAL_CLASSES, BEHAVIORS].forEach(key => {
        var _a;
        config[key] = (_a = component[key]) !== null && _a !== void 0 ? _a : EMPTY_OBJ;
    });
    return config;
}
function createRecursiveComponentConfig(componentName) {
    const isCustomWrapper = componentName === CUSTOM_WRAPPER;
    const lifeCycles = isCustomWrapper
        ? {
            attached() {
                var _a;
                const componentId = (_a = this.data.i) === null || _a === void 0 ? void 0 : _a.sid;
                if (isString(componentId)) {
                    customWrapperCache.set(componentId, this);
                }
            },
            detached() {
                var _a;
                const componentId = (_a = this.data.i) === null || _a === void 0 ? void 0 : _a.sid;
                if (isString(componentId)) {
                    customWrapperCache.delete(componentId);
                }
            }
        }
        : EMPTY_OBJ;
    return Object.assign({ properties: {
            i: {
                type: Object,
                value: {
                    ["nn" /* NodeName */]: VIEW
                }
            },
            l: {
                type: String,
                value: ''
            }
        }, options: {
            addGlobalClass: true,
            virtualHost: !isCustomWrapper
        }, methods: {
            eh: eventHandler
        } }, lifeCycles);
}

function removeLeadingSlash(path) {
    if (path == null) {
        return '';
    }
    return path.charAt(0) === '/' ? path.slice(1) : path;
}
const nextTick = (cb, ctx) => {
    var _a, _b, _c;
    const router = Current.router;
    const timerFunc = () => {
        setTimeout(function () {
            ctx ? cb.call(ctx) : cb();
        }, 1);
    };
    if (router !== null) {
        let pageElement = null;
        const path = getPath(removeLeadingSlash(router.path), router.params);
        pageElement = document$1.getElementById(path);
        if (pageElement === null || pageElement === void 0 ? void 0 : pageElement.pendingUpdate) {
            if (process.env.TARO_ENV === 'h5') {
                // eslint-disable-next-line dot-notation
                (_c = (_b = (_a = pageElement.firstChild) === null || _a === void 0 ? void 0 : _a['componentOnReady']) === null || _b === void 0 ? void 0 : _b.call(_a).then(() => {
                    timerFunc();
                })) !== null && _c !== void 0 ? _c : timerFunc();
            }
            else {
                pageElement.enqueueUpdateCallback(cb, ctx);
            }
        }
        else {
            timerFunc();
        }
    }
    else {
        timerFunc();
    }
};

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });Object.defineProperty(exports, 'Current', { enumerable: true, configurable: true, get: function() { return Current; } });Object.defineProperty(exports, 'ElementNames', { enumerable: true, configurable: true, get: function() { return ElementNames; } });Object.defineProperty(exports, 'Events', { enumerable: true, configurable: true, get: function() { return Events; } });Object.defineProperty(exports, 'FormElement', { enumerable: true, configurable: true, get: function() { return FormElement; } });Object.defineProperty(exports, 'MutationObserver', { enumerable: true, configurable: true, get: function() { return MutationObserver; } });Object.defineProperty(exports, 'SERVICE_IDENTIFIER', { enumerable: true, configurable: true, get: function() { return SERVICE_IDENTIFIER; } });Object.defineProperty(exports, 'SVGElement', { enumerable: true, configurable: true, get: function() { return SVGElement; } });Object.defineProperty(exports, 'Style', { enumerable: true, configurable: true, get: function() { return Style; } });Object.defineProperty(exports, 'TaroElement', { enumerable: true, configurable: true, get: function() { return TaroElement; } });Object.defineProperty(exports, 'TaroEvent', { enumerable: true, configurable: true, get: function() { return TaroEvent; } });Object.defineProperty(exports, 'TaroNode', { enumerable: true, configurable: true, get: function() { return TaroNode; } });Object.defineProperty(exports, 'TaroRootElement', { enumerable: true, configurable: true, get: function() { return TaroRootElement; } });Object.defineProperty(exports, 'TaroText', { enumerable: true, configurable: true, get: function() { return TaroText; } });Object.defineProperty(exports, 'addLeadingSlash', { enumerable: true, configurable: true, get: function() { return addLeadingSlash; } });Object.defineProperty(exports, 'cancelAnimationFrame', { enumerable: true, configurable: true, get: function() { return caf; } });Object.defineProperty(exports, 'container', { enumerable: true, configurable: true, get: function() { return container; } });Object.defineProperty(exports, 'createComponentConfig', { enumerable: true, configurable: true, get: function() { return createComponentConfig; } });Object.defineProperty(exports, 'createDocument', { enumerable: true, configurable: true, get: function() { return createDocument; } });Object.defineProperty(exports, 'createEvent', { enumerable: true, configurable: true, get: function() { return createEvent; } });Object.defineProperty(exports, 'createPageConfig', { enumerable: true, configurable: true, get: function() { return createPageConfig; } });Object.defineProperty(exports, 'createRecursiveComponentConfig', { enumerable: true, configurable: true, get: function() { return createRecursiveComponentConfig; } });Object.defineProperty(exports, 'document', { enumerable: true, configurable: true, get: function() { return document$1; } });Object.defineProperty(exports, 'eventCenter', { enumerable: true, configurable: true, get: function() { return eventCenter; } });Object.defineProperty(exports, 'eventHandler', { enumerable: true, configurable: true, get: function() { return eventHandler; } });Object.defineProperty(exports, 'eventSource', { enumerable: true, configurable: true, get: function() { return eventSource; } });Object.defineProperty(exports, 'getComputedStyle', { enumerable: true, configurable: true, get: function() { return getComputedStyle; } });Object.defineProperty(exports, 'getCurrentInstance', { enumerable: true, configurable: true, get: function() { return getCurrentInstance; } });Object.defineProperty(exports, 'getPageInstance', { enumerable: true, configurable: true, get: function() { return getPageInstance; } });Object.defineProperty(exports, 'hydrate', { enumerable: true, configurable: true, get: function() { return hydrate; } });Object.defineProperty(exports, 'incrementId', { enumerable: true, configurable: true, get: function() { return incrementId; } });Object.defineProperty(exports, 'injectPageInstance', { enumerable: true, configurable: true, get: function() { return injectPageInstance; } });Object.defineProperty(exports, 'navigator', { enumerable: true, configurable: true, get: function() { return navigator; } });Object.defineProperty(exports, 'nextTick', { enumerable: true, configurable: true, get: function() { return nextTick; } });Object.defineProperty(exports, 'now', { enumerable: true, configurable: true, get: function() { return now; } });Object.defineProperty(exports, 'options', { enumerable: true, configurable: true, get: function() { return options; } });Object.defineProperty(exports, 'processPluginHooks', { enumerable: true, configurable: true, get: function() { return processPluginHooks; } });Object.defineProperty(exports, 'requestAnimationFrame', { enumerable: true, configurable: true, get: function() { return raf; } });Object.defineProperty(exports, 'safeExecute', { enumerable: true, configurable: true, get: function() { return safeExecute; } });Object.defineProperty(exports, 'stringify', { enumerable: true, configurable: true, get: function() { return stringify; } });Object.defineProperty(exports, 'window', { enumerable: true, configurable: true, get: function() { return window$1; } });
//# sourceMappingURL=runtime.esm.js.map

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1649338160484);
})()
//miniprogram-npm-outsideDeps=["@tarojs/shared","inversify","reflect-metadata"]
//# sourceMappingURL=index.js.map