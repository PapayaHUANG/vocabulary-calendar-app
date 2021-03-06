module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1649338160486, function(require, module, exports) {


Object.defineProperty(exports, '__esModule', { value: true });

var Taro = require('@tarojs/api');
var router = require('@tarojs/router');
var runtime = require('@tarojs/runtime');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Taro__default = /*#__PURE__*/_interopDefaultLegacy(Taro);

/* eslint-disable prefer-promise-reject-errors */
function shouldBeObject(target) {
    if (target && typeof target === 'object')
        return { flag: true };
    return {
        flag: false,
        msg: getParameterError({
            correct: 'Object',
            wrong: target
        })
    };
}
function findDOM(inst) {
    const runtimeHooks = runtime.container.get(runtime.SERVICE_IDENTIFIER.Hooks);
    if (inst) {
        const find = runtimeHooks.getDOMNode;
        if (typeof find === 'function') {
            return find(inst);
        }
    }
    const page = runtime.Current.page;
    const path = page === null || page === void 0 ? void 0 : page.path;
    const msg = '??????????????????????????????????????????????????????????????????????????? API???';
    if (path == null) {
        throw new Error(msg);
    }
    const el = document.getElementById(path);
    if (el == null) {
        throw new Error('?????????????????????????????????????????????????????????');
    }
    return el;
}
function getParameterError({ name = '', para, correct, wrong }) {
    const parameter = para ? `parameter.${para}` : 'parameter';
    const errorType = upperCaseFirstLetter(wrong === null ? 'Null' : typeof wrong);
    if (name) {
        return `${name}:fail parameter error: ${parameter} should be ${correct} instead of ${errorType}`;
    }
    else {
        return `parameter error: ${parameter} should be ${correct} instead of ${errorType}`;
    }
}
function upperCaseFirstLetter(string) {
    if (typeof string !== 'string')
        return string;
    string = string.replace(/^./, match => match.toUpperCase());
    return string;
}
function inlineStyle(style) {
    let res = '';
    for (const attr in style)
        res += `${attr}: ${style[attr]};`;
    if (res.indexOf('display: flex;') >= 0)
        res += 'display: -webkit-box;display: -webkit-flex;';
    res = res.replace(/transform:(.+?);/g, (s, $1) => `${s}-webkit-transform:${$1};`);
    res = res.replace(/flex-direction:(.+?);/g, (s, $1) => `${s}-webkit-flex-direction:${$1};`);
    return res;
}
function setTransform(el, val) {
    el.style.webkitTransform = val;
    el.style.transform = val;
}
function serializeParams$1(params) {
    if (!params) {
        return '';
    }
    return Object.keys(params)
        .map(key => (`${encodeURIComponent(key)}=${typeof (params[key]) === 'object'
        ? encodeURIComponent(JSON.stringify(params[key]))
        : encodeURIComponent(params[key])}`))
        .join('&');
}
function temporarilyNotSupport(apiName) {
    return () => {
        const errMsg = `??????????????? API ${apiName}`;
        if (process.env.NODE_ENV !== 'production') {
            console.error(errMsg);
            return Promise.reject({
                errMsg
            });
        }
        else {
            console.warn(errMsg);
            return Promise.resolve({
                errMsg
            });
        }
    };
}
function weixinCorpSupport(apiName) {
    return () => {
        const errMsg = `h5????????????????????????????????? API ${apiName}`;
        if (process.env.NODE_ENV !== 'production') {
            console.error(errMsg);
            return Promise.reject({
                errMsg
            });
        }
        else {
            console.warn(errMsg);
            return Promise.resolve({
                errMsg
            });
        }
    };
}
function permanentlyNotSupport(apiName) {
    return () => {
        const errMsg = `????????? API ${apiName}`;
        if (process.env.NODE_ENV !== 'production') {
            console.error(errMsg);
            return Promise.reject({
                errMsg
            });
        }
        else {
            console.warn(errMsg);
            return Promise.resolve({
                errMsg
            });
        }
    };
}
function isFunction$1(obj) {
    return typeof obj === 'function';
}
const VALID_COLOR_REG = /^#[0-9a-fA-F]{6}$/;
const isValidColor = (color) => {
    return VALID_COLOR_REG.test(color);
};
function processOpenApi(apiName, defaultOptions, formatResult = res => res, formatParams = options => options) {
    // @ts-ignore
    if (!window.wx) {
        return weixinCorpSupport(apiName);
    }
    return options => {
        options = options || {};
        const obj = Object.assign({}, defaultOptions, options);
        const p = new Promise((resolve, reject) => {
            ['fail', 'success', 'complete'].forEach(k => {
                obj[k] = oriRes => {
                    const res = formatResult(oriRes);
                    options[k] && options[k](res);
                    if (k === 'success') {
                        resolve(res);
                    }
                    else if (k === 'fail') {
                        reject(res);
                    }
                };
            });
            // @ts-ignore
            wx[apiName](formatParams(obj));
        });
        return p;
    };
}
/**
 * ease-in-out?????????
 * @param t 0-1?????????
 */
const easeInOut = (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
const getTimingFunc = (easeFunc, frameCnt) => {
    return x => {
        if (frameCnt <= 1) {
            return easeFunc(1);
        }
        const t = x / (frameCnt - 1);
        return easeFunc(t);
    };
};

// ??????
const createRewardedVideoAd = temporarilyNotSupport('createRewardedVideoAd');
const createInterstitialAd = temporarilyNotSupport('createInterstitialAd');

// ????????????
const stopFaceDetect = temporarilyNotSupport('stopFaceDetect');
const initFaceDetect = temporarilyNotSupport('initFaceDetect');
const faceDetect = temporarilyNotSupport('faceDetect');

// ??????????????????
const isVKSupport = temporarilyNotSupport('isVKSupport');
// ????????????
const createVKSession = temporarilyNotSupport('createVKSession');

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function getDefaultExportFromNamespaceIfPresent (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') ? n['default'] : n;
}

function getDefaultExportFromNamespaceIfNotNamed (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
}

function getAugmentedNamespace(n) {
	if (n.__esModule) return n;
	var a = Object.defineProperty({}, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

function commonjsRequire (path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

var base64Js = {};



var byteLength_1 = base64Js.byteLength = byteLength;
var toByteArray_1 = base64Js.toByteArray = toByteArray;
var fromByteArray_1 = base64Js.fromByteArray = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
} // Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications


revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;

function getLens(b64) {
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4');
  } // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42


  var validLen = b64.indexOf('=');
  if (validLen === -1) validLen = len;
  var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
  return [validLen, placeHoldersLen];
} // base64 is 4/3 + up to two characters of the original data


function byteLength(b64) {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}

function _byteLength(b64, validLen, placeHoldersLen) {
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}

function toByteArray(b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
  var curByte = 0; // if there are placeholders, only get up to the last complete 4 chars

  var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
  var i;

  for (i = 0; i < len; i += 4) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = tmp >> 16 & 0xFF;
    arr[curByte++] = tmp >> 8 & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[curByte++] = tmp >> 8 & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  return arr;
}

function tripletToBase64(num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}

function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];

  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
    output.push(tripletToBase64(tmp));
  }

  return output.join('');
}

function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes

  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3
  // go through the array every three bytes, we'll deal with trailing stuff later

  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  } // pad the end with zeros, but make sure to not forget the extra bytes


  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==');
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=');
  }

  return parts.join('');
}

var mobileDetect = {exports: {}};

(function (module) {
// THIS FILE IS GENERATED - DO NOT EDIT!

/*!mobile-detect v1.4.5 2021-03-13*/

/*global module:false, define:false*/

/*jshint latedef:false*/

/*!@license Copyright 2013, Heinrich Goebl, License: MIT, see https://github.com/hgoebl/mobile-detect.js*/
(function (define, undefined$1) {
  define(function () {
    

    var impl = {};
    impl.mobileDetectRules = {
      "phones": {
        "iPhone": "\\biPhone\\b|\\biPod\\b",
        "BlackBerry": "BlackBerry|\\bBB10\\b|rim[0-9]+|\\b(BBA100|BBB100|BBD100|BBE100|BBF100|STH100)\\b-[0-9]+",
        "Pixel": "; \\bPixel\\b",
        "HTC": "HTC|HTC.*(Sensation|Evo|Vision|Explorer|6800|8100|8900|A7272|S510e|C110e|Legend|Desire|T8282)|APX515CKT|Qtek9090|APA9292KT|HD_mini|Sensation.*Z710e|PG86100|Z715e|Desire.*(A8181|HD)|ADR6200|ADR6400L|ADR6425|001HT|Inspire 4G|Android.*\\bEVO\\b|T-Mobile G1|Z520m|Android [0-9.]+; Pixel",
        "Nexus": "Nexus One|Nexus S|Galaxy.*Nexus|Android.*Nexus.*Mobile|Nexus 4|Nexus 5|Nexus 5X|Nexus 6",
        "Dell": "Dell[;]? (Streak|Aero|Venue|Venue Pro|Flash|Smoke|Mini 3iX)|XCD28|XCD35|\\b001DL\\b|\\b101DL\\b|\\bGS01\\b",
        "Motorola": "Motorola|DROIDX|DROID BIONIC|\\bDroid\\b.*Build|Android.*Xoom|HRI39|MOT-|A1260|A1680|A555|A853|A855|A953|A955|A956|Motorola.*ELECTRIFY|Motorola.*i1|i867|i940|MB200|MB300|MB501|MB502|MB508|MB511|MB520|MB525|MB526|MB611|MB612|MB632|MB810|MB855|MB860|MB861|MB865|MB870|ME501|ME502|ME511|ME525|ME600|ME632|ME722|ME811|ME860|ME863|ME865|MT620|MT710|MT716|MT720|MT810|MT870|MT917|Motorola.*TITANIUM|WX435|WX445|XT300|XT301|XT311|XT316|XT317|XT319|XT320|XT390|XT502|XT530|XT531|XT532|XT535|XT603|XT610|XT611|XT615|XT681|XT701|XT702|XT711|XT720|XT800|XT806|XT860|XT862|XT875|XT882|XT883|XT894|XT901|XT907|XT909|XT910|XT912|XT928|XT926|XT915|XT919|XT925|XT1021|\\bMoto E\\b|XT1068|XT1092|XT1052",
        "Samsung": "\\bSamsung\\b|SM-G950F|SM-G955F|SM-G9250|GT-19300|SGH-I337|BGT-S5230|GT-B2100|GT-B2700|GT-B2710|GT-B3210|GT-B3310|GT-B3410|GT-B3730|GT-B3740|GT-B5510|GT-B5512|GT-B5722|GT-B6520|GT-B7300|GT-B7320|GT-B7330|GT-B7350|GT-B7510|GT-B7722|GT-B7800|GT-C3010|GT-C3011|GT-C3060|GT-C3200|GT-C3212|GT-C3212I|GT-C3262|GT-C3222|GT-C3300|GT-C3300K|GT-C3303|GT-C3303K|GT-C3310|GT-C3322|GT-C3330|GT-C3350|GT-C3500|GT-C3510|GT-C3530|GT-C3630|GT-C3780|GT-C5010|GT-C5212|GT-C6620|GT-C6625|GT-C6712|GT-E1050|GT-E1070|GT-E1075|GT-E1080|GT-E1081|GT-E1085|GT-E1087|GT-E1100|GT-E1107|GT-E1110|GT-E1120|GT-E1125|GT-E1130|GT-E1160|GT-E1170|GT-E1175|GT-E1180|GT-E1182|GT-E1200|GT-E1210|GT-E1225|GT-E1230|GT-E1390|GT-E2100|GT-E2120|GT-E2121|GT-E2152|GT-E2220|GT-E2222|GT-E2230|GT-E2232|GT-E2250|GT-E2370|GT-E2550|GT-E2652|GT-E3210|GT-E3213|GT-I5500|GT-I5503|GT-I5700|GT-I5800|GT-I5801|GT-I6410|GT-I6420|GT-I7110|GT-I7410|GT-I7500|GT-I8000|GT-I8150|GT-I8160|GT-I8190|GT-I8320|GT-I8330|GT-I8350|GT-I8530|GT-I8700|GT-I8703|GT-I8910|GT-I9000|GT-I9001|GT-I9003|GT-I9010|GT-I9020|GT-I9023|GT-I9070|GT-I9082|GT-I9100|GT-I9103|GT-I9220|GT-I9250|GT-I9300|GT-I9305|GT-I9500|GT-I9505|GT-M3510|GT-M5650|GT-M7500|GT-M7600|GT-M7603|GT-M8800|GT-M8910|GT-N7000|GT-S3110|GT-S3310|GT-S3350|GT-S3353|GT-S3370|GT-S3650|GT-S3653|GT-S3770|GT-S3850|GT-S5210|GT-S5220|GT-S5229|GT-S5230|GT-S5233|GT-S5250|GT-S5253|GT-S5260|GT-S5263|GT-S5270|GT-S5300|GT-S5330|GT-S5350|GT-S5360|GT-S5363|GT-S5369|GT-S5380|GT-S5380D|GT-S5560|GT-S5570|GT-S5600|GT-S5603|GT-S5610|GT-S5620|GT-S5660|GT-S5670|GT-S5690|GT-S5750|GT-S5780|GT-S5830|GT-S5839|GT-S6102|GT-S6500|GT-S7070|GT-S7200|GT-S7220|GT-S7230|GT-S7233|GT-S7250|GT-S7500|GT-S7530|GT-S7550|GT-S7562|GT-S7710|GT-S8000|GT-S8003|GT-S8500|GT-S8530|GT-S8600|SCH-A310|SCH-A530|SCH-A570|SCH-A610|SCH-A630|SCH-A650|SCH-A790|SCH-A795|SCH-A850|SCH-A870|SCH-A890|SCH-A930|SCH-A950|SCH-A970|SCH-A990|SCH-I100|SCH-I110|SCH-I400|SCH-I405|SCH-I500|SCH-I510|SCH-I515|SCH-I600|SCH-I730|SCH-I760|SCH-I770|SCH-I830|SCH-I910|SCH-I920|SCH-I959|SCH-LC11|SCH-N150|SCH-N300|SCH-R100|SCH-R300|SCH-R351|SCH-R400|SCH-R410|SCH-T300|SCH-U310|SCH-U320|SCH-U350|SCH-U360|SCH-U365|SCH-U370|SCH-U380|SCH-U410|SCH-U430|SCH-U450|SCH-U460|SCH-U470|SCH-U490|SCH-U540|SCH-U550|SCH-U620|SCH-U640|SCH-U650|SCH-U660|SCH-U700|SCH-U740|SCH-U750|SCH-U810|SCH-U820|SCH-U900|SCH-U940|SCH-U960|SCS-26UC|SGH-A107|SGH-A117|SGH-A127|SGH-A137|SGH-A157|SGH-A167|SGH-A177|SGH-A187|SGH-A197|SGH-A227|SGH-A237|SGH-A257|SGH-A437|SGH-A517|SGH-A597|SGH-A637|SGH-A657|SGH-A667|SGH-A687|SGH-A697|SGH-A707|SGH-A717|SGH-A727|SGH-A737|SGH-A747|SGH-A767|SGH-A777|SGH-A797|SGH-A817|SGH-A827|SGH-A837|SGH-A847|SGH-A867|SGH-A877|SGH-A887|SGH-A897|SGH-A927|SGH-B100|SGH-B130|SGH-B200|SGH-B220|SGH-C100|SGH-C110|SGH-C120|SGH-C130|SGH-C140|SGH-C160|SGH-C170|SGH-C180|SGH-C200|SGH-C207|SGH-C210|SGH-C225|SGH-C230|SGH-C417|SGH-C450|SGH-D307|SGH-D347|SGH-D357|SGH-D407|SGH-D415|SGH-D780|SGH-D807|SGH-D980|SGH-E105|SGH-E200|SGH-E315|SGH-E316|SGH-E317|SGH-E335|SGH-E590|SGH-E635|SGH-E715|SGH-E890|SGH-F300|SGH-F480|SGH-I200|SGH-I300|SGH-I320|SGH-I550|SGH-I577|SGH-I600|SGH-I607|SGH-I617|SGH-I627|SGH-I637|SGH-I677|SGH-I700|SGH-I717|SGH-I727|SGH-i747M|SGH-I777|SGH-I780|SGH-I827|SGH-I847|SGH-I857|SGH-I896|SGH-I897|SGH-I900|SGH-I907|SGH-I917|SGH-I927|SGH-I937|SGH-I997|SGH-J150|SGH-J200|SGH-L170|SGH-L700|SGH-M110|SGH-M150|SGH-M200|SGH-N105|SGH-N500|SGH-N600|SGH-N620|SGH-N625|SGH-N700|SGH-N710|SGH-P107|SGH-P207|SGH-P300|SGH-P310|SGH-P520|SGH-P735|SGH-P777|SGH-Q105|SGH-R210|SGH-R220|SGH-R225|SGH-S105|SGH-S307|SGH-T109|SGH-T119|SGH-T139|SGH-T209|SGH-T219|SGH-T229|SGH-T239|SGH-T249|SGH-T259|SGH-T309|SGH-T319|SGH-T329|SGH-T339|SGH-T349|SGH-T359|SGH-T369|SGH-T379|SGH-T409|SGH-T429|SGH-T439|SGH-T459|SGH-T469|SGH-T479|SGH-T499|SGH-T509|SGH-T519|SGH-T539|SGH-T559|SGH-T589|SGH-T609|SGH-T619|SGH-T629|SGH-T639|SGH-T659|SGH-T669|SGH-T679|SGH-T709|SGH-T719|SGH-T729|SGH-T739|SGH-T746|SGH-T749|SGH-T759|SGH-T769|SGH-T809|SGH-T819|SGH-T839|SGH-T919|SGH-T929|SGH-T939|SGH-T959|SGH-T989|SGH-U100|SGH-U200|SGH-U800|SGH-V205|SGH-V206|SGH-X100|SGH-X105|SGH-X120|SGH-X140|SGH-X426|SGH-X427|SGH-X475|SGH-X495|SGH-X497|SGH-X507|SGH-X600|SGH-X610|SGH-X620|SGH-X630|SGH-X700|SGH-X820|SGH-X890|SGH-Z130|SGH-Z150|SGH-Z170|SGH-ZX10|SGH-ZX20|SHW-M110|SPH-A120|SPH-A400|SPH-A420|SPH-A460|SPH-A500|SPH-A560|SPH-A600|SPH-A620|SPH-A660|SPH-A700|SPH-A740|SPH-A760|SPH-A790|SPH-A800|SPH-A820|SPH-A840|SPH-A880|SPH-A900|SPH-A940|SPH-A960|SPH-D600|SPH-D700|SPH-D710|SPH-D720|SPH-I300|SPH-I325|SPH-I330|SPH-I350|SPH-I500|SPH-I600|SPH-I700|SPH-L700|SPH-M100|SPH-M220|SPH-M240|SPH-M300|SPH-M305|SPH-M320|SPH-M330|SPH-M350|SPH-M360|SPH-M370|SPH-M380|SPH-M510|SPH-M540|SPH-M550|SPH-M560|SPH-M570|SPH-M580|SPH-M610|SPH-M620|SPH-M630|SPH-M800|SPH-M810|SPH-M850|SPH-M900|SPH-M910|SPH-M920|SPH-M930|SPH-N100|SPH-N200|SPH-N240|SPH-N300|SPH-N400|SPH-Z400|SWC-E100|SCH-i909|GT-N7100|GT-N7105|SCH-I535|SM-N900A|SGH-I317|SGH-T999L|GT-S5360B|GT-I8262|GT-S6802|GT-S6312|GT-S6310|GT-S5312|GT-S5310|GT-I9105|GT-I8510|GT-S6790N|SM-G7105|SM-N9005|GT-S5301|GT-I9295|GT-I9195|SM-C101|GT-S7392|GT-S7560|GT-B7610|GT-I5510|GT-S7582|GT-S7530E|GT-I8750|SM-G9006V|SM-G9008V|SM-G9009D|SM-G900A|SM-G900D|SM-G900F|SM-G900H|SM-G900I|SM-G900J|SM-G900K|SM-G900L|SM-G900M|SM-G900P|SM-G900R4|SM-G900S|SM-G900T|SM-G900V|SM-G900W8|SHV-E160K|SCH-P709|SCH-P729|SM-T2558|GT-I9205|SM-G9350|SM-J120F|SM-G920F|SM-G920V|SM-G930F|SM-N910C|SM-A310F|GT-I9190|SM-J500FN|SM-G903F|SM-J330F|SM-G610F|SM-G981B|SM-G892A|SM-A530F",
        "LG": "\\bLG\\b;|LG[- ]?(C800|C900|E400|E610|E900|E-900|F160|F180K|F180L|F180S|730|855|L160|LS740|LS840|LS970|LU6200|MS690|MS695|MS770|MS840|MS870|MS910|P500|P700|P705|VM696|AS680|AS695|AX840|C729|E970|GS505|272|C395|E739BK|E960|L55C|L75C|LS696|LS860|P769BK|P350|P500|P509|P870|UN272|US730|VS840|VS950|LN272|LN510|LS670|LS855|LW690|MN270|MN510|P509|P769|P930|UN200|UN270|UN510|UN610|US670|US740|US760|UX265|UX840|VN271|VN530|VS660|VS700|VS740|VS750|VS910|VS920|VS930|VX9200|VX11000|AX840A|LW770|P506|P925|P999|E612|D955|D802|MS323|M257)|LM-G710",
        "Sony": "SonyST|SonyLT|SonyEricsson|SonyEricssonLT15iv|LT18i|E10i|LT28h|LT26w|SonyEricssonMT27i|C5303|C6902|C6903|C6906|C6943|D2533|SOV34|601SO|F8332",
        "Asus": "Asus.*Galaxy|PadFone.*Mobile",
        "Xiaomi": "^(?!.*\\bx11\\b).*xiaomi.*$|POCOPHONE F1|MI 8|Redmi Note 9S|Redmi Note 5A Prime|N2G47H|M2001J2G|M2001J2I|M1805E10A|M2004J11G|M1902F1G|M2002J9G|M2004J19G|M2003J6A1G",
        "NokiaLumia": "Lumia [0-9]{3,4}",
        "Micromax": "Micromax.*\\b(A210|A92|A88|A72|A111|A110Q|A115|A116|A110|A90S|A26|A51|A35|A54|A25|A27|A89|A68|A65|A57|A90)\\b",
        "Palm": "PalmSource|Palm",
        "Vertu": "Vertu|Vertu.*Ltd|Vertu.*Ascent|Vertu.*Ayxta|Vertu.*Constellation(F|Quest)?|Vertu.*Monika|Vertu.*Signature",
        "Pantech": "PANTECH|IM-A850S|IM-A840S|IM-A830L|IM-A830K|IM-A830S|IM-A820L|IM-A810K|IM-A810S|IM-A800S|IM-T100K|IM-A725L|IM-A780L|IM-A775C|IM-A770K|IM-A760S|IM-A750K|IM-A740S|IM-A730S|IM-A720L|IM-A710K|IM-A690L|IM-A690S|IM-A650S|IM-A630K|IM-A600S|VEGA PTL21|PT003|P8010|ADR910L|P6030|P6020|P9070|P4100|P9060|P5000|CDM8992|TXT8045|ADR8995|IS11PT|P2030|P6010|P8000|PT002|IS06|CDM8999|P9050|PT001|TXT8040|P2020|P9020|P2000|P7040|P7000|C790",
        "Fly": "IQ230|IQ444|IQ450|IQ440|IQ442|IQ441|IQ245|IQ256|IQ236|IQ255|IQ235|IQ245|IQ275|IQ240|IQ285|IQ280|IQ270|IQ260|IQ250",
        "Wiko": "KITE 4G|HIGHWAY|GETAWAY|STAIRWAY|DARKSIDE|DARKFULL|DARKNIGHT|DARKMOON|SLIDE|WAX 4G|RAINBOW|BLOOM|SUNSET|GOA(?!nna)|LENNY|BARRY|IGGY|OZZY|CINK FIVE|CINK PEAX|CINK PEAX 2|CINK SLIM|CINK SLIM 2|CINK +|CINK KING|CINK PEAX|CINK SLIM|SUBLIM",
        "iMobile": "i-mobile (IQ|i-STYLE|idea|ZAA|Hitz)",
        "SimValley": "\\b(SP-80|XT-930|SX-340|XT-930|SX-310|SP-360|SP60|SPT-800|SP-120|SPT-800|SP-140|SPX-5|SPX-8|SP-100|SPX-8|SPX-12)\\b",
        "Wolfgang": "AT-B24D|AT-AS50HD|AT-AS40W|AT-AS55HD|AT-AS45q2|AT-B26D|AT-AS50Q",
        "Alcatel": "Alcatel",
        "Nintendo": "Nintendo (3DS|Switch)",
        "Amoi": "Amoi",
        "INQ": "INQ",
        "OnePlus": "ONEPLUS",
        "GenericPhone": "Tapatalk|PDA;|SAGEM|\\bmmp\\b|pocket|\\bpsp\\b|symbian|Smartphone|smartfon|treo|up.browser|up.link|vodafone|\\bwap\\b|nokia|Series40|Series60|S60|SonyEricsson|N900|MAUI.*WAP.*Browser"
      },
      "tablets": {
        "iPad": "iPad|iPad.*Mobile",
        "NexusTablet": "Android.*Nexus[\\s]+(7|9|10)",
        "GoogleTablet": "Android.*Pixel C",
        "SamsungTablet": "SAMSUNG.*Tablet|Galaxy.*Tab|SC-01C|GT-P1000|GT-P1003|GT-P1010|GT-P3105|GT-P6210|GT-P6800|GT-P6810|GT-P7100|GT-P7300|GT-P7310|GT-P7500|GT-P7510|SCH-I800|SCH-I815|SCH-I905|SGH-I957|SGH-I987|SGH-T849|SGH-T859|SGH-T869|SPH-P100|GT-P3100|GT-P3108|GT-P3110|GT-P5100|GT-P5110|GT-P6200|GT-P7320|GT-P7511|GT-N8000|GT-P8510|SGH-I497|SPH-P500|SGH-T779|SCH-I705|SCH-I915|GT-N8013|GT-P3113|GT-P5113|GT-P8110|GT-N8010|GT-N8005|GT-N8020|GT-P1013|GT-P6201|GT-P7501|GT-N5100|GT-N5105|GT-N5110|SHV-E140K|SHV-E140L|SHV-E140S|SHV-E150S|SHV-E230K|SHV-E230L|SHV-E230S|SHW-M180K|SHW-M180L|SHW-M180S|SHW-M180W|SHW-M300W|SHW-M305W|SHW-M380K|SHW-M380S|SHW-M380W|SHW-M430W|SHW-M480K|SHW-M480S|SHW-M480W|SHW-M485W|SHW-M486W|SHW-M500W|GT-I9228|SCH-P739|SCH-I925|GT-I9200|GT-P5200|GT-P5210|GT-P5210X|SM-T311|SM-T310|SM-T310X|SM-T210|SM-T210R|SM-T211|SM-P600|SM-P601|SM-P605|SM-P900|SM-P901|SM-T217|SM-T217A|SM-T217S|SM-P6000|SM-T3100|SGH-I467|XE500|SM-T110|GT-P5220|GT-I9200X|GT-N5110X|GT-N5120|SM-P905|SM-T111|SM-T2105|SM-T315|SM-T320|SM-T320X|SM-T321|SM-T520|SM-T525|SM-T530NU|SM-T230NU|SM-T330NU|SM-T900|XE500T1C|SM-P605V|SM-P905V|SM-T337V|SM-T537V|SM-T707V|SM-T807V|SM-P600X|SM-P900X|SM-T210X|SM-T230|SM-T230X|SM-T325|GT-P7503|SM-T531|SM-T330|SM-T530|SM-T705|SM-T705C|SM-T535|SM-T331|SM-T800|SM-T700|SM-T537|SM-T807|SM-P907A|SM-T337A|SM-T537A|SM-T707A|SM-T807A|SM-T237|SM-T807P|SM-P607T|SM-T217T|SM-T337T|SM-T807T|SM-T116NQ|SM-T116BU|SM-P550|SM-T350|SM-T550|SM-T9000|SM-P9000|SM-T705Y|SM-T805|GT-P3113|SM-T710|SM-T810|SM-T815|SM-T360|SM-T533|SM-T113|SM-T335|SM-T715|SM-T560|SM-T670|SM-T677|SM-T377|SM-T567|SM-T357T|SM-T555|SM-T561|SM-T713|SM-T719|SM-T813|SM-T819|SM-T580|SM-T355Y?|SM-T280|SM-T817A|SM-T820|SM-W700|SM-P580|SM-T587|SM-P350|SM-P555M|SM-P355M|SM-T113NU|SM-T815Y|SM-T585|SM-T285|SM-T825|SM-W708|SM-T835|SM-T830|SM-T837V|SM-T720|SM-T510|SM-T387V|SM-P610|SM-T290|SM-T515|SM-T590|SM-T595|SM-T725|SM-T817P|SM-P585N0|SM-T395|SM-T295|SM-T865|SM-P610N|SM-P615|SM-T970|SM-T380|SM-T5950|SM-T905|SM-T231|SM-T500|SM-T860",
        "Kindle": "Kindle|Silk.*Accelerated|Android.*\\b(KFOT|KFTT|KFJWI|KFJWA|KFOTE|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|WFJWAE|KFSAWA|KFSAWI|KFASWI|KFARWI|KFFOWI|KFGIWI|KFMEWI)\\b|Android.*Silk\/[0-9.]+ like Chrome\/[0-9.]+ (?!Mobile)",
        "SurfaceTablet": "Windows NT [0-9.]+; ARM;.*(Tablet|ARMBJS)",
        "HPTablet": "HP Slate (7|8|10)|HP ElitePad 900|hp-tablet|EliteBook.*Touch|HP 8|Slate 21|HP SlateBook 10",
        "AsusTablet": "^.*PadFone((?!Mobile).)*$|Transformer|TF101|TF101G|TF300T|TF300TG|TF300TL|TF700T|TF700KL|TF701T|TF810C|ME171|ME301T|ME302C|ME371MG|ME370T|ME372MG|ME172V|ME173X|ME400C|Slider SL101|\\bK00F\\b|\\bK00C\\b|\\bK00E\\b|\\bK00L\\b|TX201LA|ME176C|ME102A|\\bM80TA\\b|ME372CL|ME560CG|ME372CG|ME302KL| K010 | K011 | K017 | K01E |ME572C|ME103K|ME170C|ME171C|\\bME70C\\b|ME581C|ME581CL|ME8510C|ME181C|P01Y|PO1MA|P01Z|\\bP027\\b|\\bP024\\b|\\bP00C\\b",
        "BlackBerryTablet": "PlayBook|RIM Tablet",
        "HTCtablet": "HTC_Flyer_P512|HTC Flyer|HTC Jetstream|HTC-P715a|HTC EVO View 4G|PG41200|PG09410",
        "MotorolaTablet": "xoom|sholest|MZ615|MZ605|MZ505|MZ601|MZ602|MZ603|MZ604|MZ606|MZ607|MZ608|MZ609|MZ615|MZ616|MZ617",
        "NookTablet": "Android.*Nook|NookColor|nook browser|BNRV200|BNRV200A|BNTV250|BNTV250A|BNTV400|BNTV600|LogicPD Zoom2",
        "AcerTablet": "Android.*; \\b(A100|A101|A110|A200|A210|A211|A500|A501|A510|A511|A700|A701|W500|W500P|W501|W501P|W510|W511|W700|G100|G100W|B1-A71|B1-710|B1-711|A1-810|A1-811|A1-830)\\b|W3-810|\\bA3-A10\\b|\\bA3-A11\\b|\\bA3-A20\\b|\\bA3-A30|A3-A40",
        "ToshibaTablet": "Android.*(AT100|AT105|AT200|AT205|AT270|AT275|AT300|AT305|AT1S5|AT500|AT570|AT700|AT830)|TOSHIBA.*FOLIO",
        "LGTablet": "\\bL-06C|LG-V909|LG-V900|LG-V700|LG-V510|LG-V500|LG-V410|LG-V400|LG-VK810\\b",
        "FujitsuTablet": "Android.*\\b(F-01D|F-02F|F-05E|F-10D|M532|Q572)\\b",
        "PrestigioTablet": "PMP3170B|PMP3270B|PMP3470B|PMP7170B|PMP3370B|PMP3570C|PMP5870C|PMP3670B|PMP5570C|PMP5770D|PMP3970B|PMP3870C|PMP5580C|PMP5880D|PMP5780D|PMP5588C|PMP7280C|PMP7280C3G|PMP7280|PMP7880D|PMP5597D|PMP5597|PMP7100D|PER3464|PER3274|PER3574|PER3884|PER5274|PER5474|PMP5097CPRO|PMP5097|PMP7380D|PMP5297C|PMP5297C_QUAD|PMP812E|PMP812E3G|PMP812F|PMP810E|PMP880TD|PMT3017|PMT3037|PMT3047|PMT3057|PMT7008|PMT5887|PMT5001|PMT5002",
        "LenovoTablet": "Lenovo TAB|Idea(Tab|Pad)( A1|A10| K1|)|ThinkPad([ ]+)?Tablet|YT3-850M|YT3-X90L|YT3-X90F|YT3-X90X|Lenovo.*(S2109|S2110|S5000|S6000|K3011|A3000|A3500|A1000|A2107|A2109|A1107|A5500|A7600|B6000|B8000|B8080)(-|)(FL|F|HV|H|)|TB-X103F|TB-X304X|TB-X304F|TB-X304L|TB-X505F|TB-X505L|TB-X505X|TB-X605F|TB-X605L|TB-8703F|TB-8703X|TB-8703N|TB-8704N|TB-8704F|TB-8704X|TB-8704V|TB-7304F|TB-7304I|TB-7304X|Tab2A7-10F|Tab2A7-20F|TB2-X30L|YT3-X50L|YT3-X50F|YT3-X50M|YT-X705F|YT-X703F|YT-X703L|YT-X705L|YT-X705X|TB2-X30F|TB2-X30L|TB2-X30M|A2107A-F|A2107A-H|TB3-730F|TB3-730M|TB3-730X|TB-7504F|TB-7504X|TB-X704F|TB-X104F|TB3-X70F|TB-X705F|TB-8504F|TB3-X70L|TB3-710F|TB-X704L",
        "DellTablet": "Venue 11|Venue 8|Venue 7|Dell Streak 10|Dell Streak 7",
        "YarvikTablet": "Android.*\\b(TAB210|TAB211|TAB224|TAB250|TAB260|TAB264|TAB310|TAB360|TAB364|TAB410|TAB411|TAB420|TAB424|TAB450|TAB460|TAB461|TAB464|TAB465|TAB467|TAB468|TAB07-100|TAB07-101|TAB07-150|TAB07-151|TAB07-152|TAB07-200|TAB07-201-3G|TAB07-210|TAB07-211|TAB07-212|TAB07-214|TAB07-220|TAB07-400|TAB07-485|TAB08-150|TAB08-200|TAB08-201-3G|TAB08-201-30|TAB09-100|TAB09-211|TAB09-410|TAB10-150|TAB10-201|TAB10-211|TAB10-400|TAB10-410|TAB13-201|TAB274EUK|TAB275EUK|TAB374EUK|TAB462EUK|TAB474EUK|TAB9-200)\\b",
        "MedionTablet": "Android.*\\bOYO\\b|LIFE.*(P9212|P9514|P9516|S9512)|LIFETAB",
        "ArnovaTablet": "97G4|AN10G2|AN7bG3|AN7fG3|AN8G3|AN8cG3|AN7G3|AN9G3|AN7dG3|AN7dG3ST|AN7dG3ChildPad|AN10bG3|AN10bG3DT|AN9G2",
        "IntensoTablet": "INM8002KP|INM1010FP|INM805ND|Intenso Tab|TAB1004",
        "IRUTablet": "M702pro",
        "MegafonTablet": "MegaFon V9|\\bZTE V9\\b|Android.*\\bMT7A\\b",
        "EbodaTablet": "E-Boda (Supreme|Impresspeed|Izzycomm|Essential)",
        "AllViewTablet": "Allview.*(Viva|Alldro|City|Speed|All TV|Frenzy|Quasar|Shine|TX1|AX1|AX2)",
        "ArchosTablet": "\\b(101G9|80G9|A101IT)\\b|Qilive 97R|Archos5|\\bARCHOS (70|79|80|90|97|101|FAMILYPAD|)(b|c|)(G10| Cobalt| TITANIUM(HD|)| Xenon| Neon|XSK| 2| XS 2| PLATINUM| CARBON|GAMEPAD)\\b",
        "AinolTablet": "NOVO7|NOVO8|NOVO10|Novo7Aurora|Novo7Basic|NOVO7PALADIN|novo9-Spark",
        "NokiaLumiaTablet": "Lumia 2520",
        "SonyTablet": "Sony.*Tablet|Xperia Tablet|Sony Tablet S|SO-03E|SGPT12|SGPT13|SGPT114|SGPT121|SGPT122|SGPT123|SGPT111|SGPT112|SGPT113|SGPT131|SGPT132|SGPT133|SGPT211|SGPT212|SGPT213|SGP311|SGP312|SGP321|EBRD1101|EBRD1102|EBRD1201|SGP351|SGP341|SGP511|SGP512|SGP521|SGP541|SGP551|SGP621|SGP641|SGP612|SOT31|SGP771|SGP611|SGP612|SGP712",
        "PhilipsTablet": "\\b(PI2010|PI3000|PI3100|PI3105|PI3110|PI3205|PI3210|PI3900|PI4010|PI7000|PI7100)\\b",
        "CubeTablet": "Android.*(K8GT|U9GT|U10GT|U16GT|U17GT|U18GT|U19GT|U20GT|U23GT|U30GT)|CUBE U8GT",
        "CobyTablet": "MID1042|MID1045|MID1125|MID1126|MID7012|MID7014|MID7015|MID7034|MID7035|MID7036|MID7042|MID7048|MID7127|MID8042|MID8048|MID8127|MID9042|MID9740|MID9742|MID7022|MID7010",
        "MIDTablet": "M9701|M9000|M9100|M806|M1052|M806|T703|MID701|MID713|MID710|MID727|MID760|MID830|MID728|MID933|MID125|MID810|MID732|MID120|MID930|MID800|MID731|MID900|MID100|MID820|MID735|MID980|MID130|MID833|MID737|MID960|MID135|MID860|MID736|MID140|MID930|MID835|MID733|MID4X10",
        "MSITablet": "MSI \\b(Primo 73K|Primo 73L|Primo 81L|Primo 77|Primo 93|Primo 75|Primo 76|Primo 73|Primo 81|Primo 91|Primo 90|Enjoy 71|Enjoy 7|Enjoy 10)\\b",
        "SMiTTablet": "Android.*(\\bMID\\b|MID-560|MTV-T1200|MTV-PND531|MTV-P1101|MTV-PND530)",
        "RockChipTablet": "Android.*(RK2818|RK2808A|RK2918|RK3066)|RK2738|RK2808A",
        "FlyTablet": "IQ310|Fly Vision",
        "bqTablet": "Android.*(bq)?.*\\b(Elcano|Curie|Edison|Maxwell|Kepler|Pascal|Tesla|Hypatia|Platon|Newton|Livingstone|Cervantes|Avant|Aquaris ([E|M]10|M8))\\b|Maxwell.*Lite|Maxwell.*Plus",
        "HuaweiTablet": "MediaPad|MediaPad 7 Youth|IDEOS S7|S7-201c|S7-202u|S7-101|S7-103|S7-104|S7-105|S7-106|S7-201|S7-Slim|M2-A01L|BAH-L09|BAH-W09|AGS-L09|CMR-AL19",
        "NecTablet": "\\bN-06D|\\bN-08D",
        "PantechTablet": "Pantech.*P4100",
        "BronchoTablet": "Broncho.*(N701|N708|N802|a710)",
        "VersusTablet": "TOUCHPAD.*[78910]|\\bTOUCHTAB\\b",
        "ZyncTablet": "z1000|Z99 2G|z930|z990|z909|Z919|z900",
        "PositivoTablet": "TB07STA|TB10STA|TB07FTA|TB10FTA",
        "NabiTablet": "Android.*\\bNabi",
        "KoboTablet": "Kobo Touch|\\bK080\\b|\\bVox\\b Build|\\bArc\\b Build",
        "DanewTablet": "DSlide.*\\b(700|701R|702|703R|704|802|970|971|972|973|974|1010|1012)\\b",
        "TexetTablet": "NaviPad|TB-772A|TM-7045|TM-7055|TM-9750|TM-7016|TM-7024|TM-7026|TM-7041|TM-7043|TM-7047|TM-8041|TM-9741|TM-9747|TM-9748|TM-9751|TM-7022|TM-7021|TM-7020|TM-7011|TM-7010|TM-7023|TM-7025|TM-7037W|TM-7038W|TM-7027W|TM-9720|TM-9725|TM-9737W|TM-1020|TM-9738W|TM-9740|TM-9743W|TB-807A|TB-771A|TB-727A|TB-725A|TB-719A|TB-823A|TB-805A|TB-723A|TB-715A|TB-707A|TB-705A|TB-709A|TB-711A|TB-890HD|TB-880HD|TB-790HD|TB-780HD|TB-770HD|TB-721HD|TB-710HD|TB-434HD|TB-860HD|TB-840HD|TB-760HD|TB-750HD|TB-740HD|TB-730HD|TB-722HD|TB-720HD|TB-700HD|TB-500HD|TB-470HD|TB-431HD|TB-430HD|TB-506|TB-504|TB-446|TB-436|TB-416|TB-146SE|TB-126SE",
        "PlaystationTablet": "Playstation.*(Portable|Vita)",
        "TrekstorTablet": "ST10416-1|VT10416-1|ST70408-1|ST702xx-1|ST702xx-2|ST80208|ST97216|ST70104-2|VT10416-2|ST10216-2A|SurfTab",
        "PyleAudioTablet": "\\b(PTBL10CEU|PTBL10C|PTBL72BC|PTBL72BCEU|PTBL7CEU|PTBL7C|PTBL92BC|PTBL92BCEU|PTBL9CEU|PTBL9CUK|PTBL9C)\\b",
        "AdvanTablet": "Android.* \\b(E3A|T3X|T5C|T5B|T3E|T3C|T3B|T1J|T1F|T2A|T1H|T1i|E1C|T1-E|T5-A|T4|E1-B|T2Ci|T1-B|T1-D|O1-A|E1-A|T1-A|T3A|T4i)\\b ",
        "DanyTechTablet": "Genius Tab G3|Genius Tab S2|Genius Tab Q3|Genius Tab G4|Genius Tab Q4|Genius Tab G-II|Genius TAB GII|Genius TAB GIII|Genius Tab S1",
        "GalapadTablet": "Android [0-9.]+; [a-z-]+; \\bG1\\b",
        "MicromaxTablet": "Funbook|Micromax.*\\b(P250|P560|P360|P362|P600|P300|P350|P500|P275)\\b",
        "KarbonnTablet": "Android.*\\b(A39|A37|A34|ST8|ST10|ST7|Smart Tab3|Smart Tab2)\\b",
        "AllFineTablet": "Fine7 Genius|Fine7 Shine|Fine7 Air|Fine8 Style|Fine9 More|Fine10 Joy|Fine11 Wide",
        "PROSCANTablet": "\\b(PEM63|PLT1023G|PLT1041|PLT1044|PLT1044G|PLT1091|PLT4311|PLT4311PL|PLT4315|PLT7030|PLT7033|PLT7033D|PLT7035|PLT7035D|PLT7044K|PLT7045K|PLT7045KB|PLT7071KG|PLT7072|PLT7223G|PLT7225G|PLT7777G|PLT7810K|PLT7849G|PLT7851G|PLT7852G|PLT8015|PLT8031|PLT8034|PLT8036|PLT8080K|PLT8082|PLT8088|PLT8223G|PLT8234G|PLT8235G|PLT8816K|PLT9011|PLT9045K|PLT9233G|PLT9735|PLT9760G|PLT9770G)\\b",
        "YONESTablet": "BQ1078|BC1003|BC1077|RK9702|BC9730|BC9001|IT9001|BC7008|BC7010|BC708|BC728|BC7012|BC7030|BC7027|BC7026",
        "ChangJiaTablet": "TPC7102|TPC7103|TPC7105|TPC7106|TPC7107|TPC7201|TPC7203|TPC7205|TPC7210|TPC7708|TPC7709|TPC7712|TPC7110|TPC8101|TPC8103|TPC8105|TPC8106|TPC8203|TPC8205|TPC8503|TPC9106|TPC9701|TPC97101|TPC97103|TPC97105|TPC97106|TPC97111|TPC97113|TPC97203|TPC97603|TPC97809|TPC97205|TPC10101|TPC10103|TPC10106|TPC10111|TPC10203|TPC10205|TPC10503",
        "GUTablet": "TX-A1301|TX-M9002|Q702|kf026",
        "PointOfViewTablet": "TAB-P506|TAB-navi-7-3G-M|TAB-P517|TAB-P-527|TAB-P701|TAB-P703|TAB-P721|TAB-P731N|TAB-P741|TAB-P825|TAB-P905|TAB-P925|TAB-PR945|TAB-PL1015|TAB-P1025|TAB-PI1045|TAB-P1325|TAB-PROTAB[0-9]+|TAB-PROTAB25|TAB-PROTAB26|TAB-PROTAB27|TAB-PROTAB26XL|TAB-PROTAB2-IPS9|TAB-PROTAB30-IPS9|TAB-PROTAB25XXL|TAB-PROTAB26-IPS10|TAB-PROTAB30-IPS10",
        "OvermaxTablet": "OV-(SteelCore|NewBase|Basecore|Baseone|Exellen|Quattor|EduTab|Solution|ACTION|BasicTab|TeddyTab|MagicTab|Stream|TB-08|TB-09)|Qualcore 1027",
        "HCLTablet": "HCL.*Tablet|Connect-3G-2.0|Connect-2G-2.0|ME Tablet U1|ME Tablet U2|ME Tablet G1|ME Tablet X1|ME Tablet Y2|ME Tablet Sync",
        "DPSTablet": "DPS Dream 9|DPS Dual 7",
        "VistureTablet": "V97 HD|i75 3G|Visture V4( HD)?|Visture V5( HD)?|Visture V10",
        "CrestaTablet": "CTP(-)?810|CTP(-)?818|CTP(-)?828|CTP(-)?838|CTP(-)?888|CTP(-)?978|CTP(-)?980|CTP(-)?987|CTP(-)?988|CTP(-)?989",
        "MediatekTablet": "\\bMT8125|MT8389|MT8135|MT8377\\b",
        "ConcordeTablet": "Concorde([ ]+)?Tab|ConCorde ReadMan",
        "GoCleverTablet": "GOCLEVER TAB|A7GOCLEVER|M1042|M7841|M742|R1042BK|R1041|TAB A975|TAB A7842|TAB A741|TAB A741L|TAB M723G|TAB M721|TAB A1021|TAB I921|TAB R721|TAB I720|TAB T76|TAB R70|TAB R76.2|TAB R106|TAB R83.2|TAB M813G|TAB I721|GCTA722|TAB I70|TAB I71|TAB S73|TAB R73|TAB R74|TAB R93|TAB R75|TAB R76.1|TAB A73|TAB A93|TAB A93.2|TAB T72|TAB R83|TAB R974|TAB R973|TAB A101|TAB A103|TAB A104|TAB A104.2|R105BK|M713G|A972BK|TAB A971|TAB R974.2|TAB R104|TAB R83.3|TAB A1042",
        "ModecomTablet": "FreeTAB 9000|FreeTAB 7.4|FreeTAB 7004|FreeTAB 7800|FreeTAB 2096|FreeTAB 7.5|FreeTAB 1014|FreeTAB 1001 |FreeTAB 8001|FreeTAB 9706|FreeTAB 9702|FreeTAB 7003|FreeTAB 7002|FreeTAB 1002|FreeTAB 7801|FreeTAB 1331|FreeTAB 1004|FreeTAB 8002|FreeTAB 8014|FreeTAB 9704|FreeTAB 1003",
        "VoninoTablet": "\\b(Argus[ _]?S|Diamond[ _]?79HD|Emerald[ _]?78E|Luna[ _]?70C|Onyx[ _]?S|Onyx[ _]?Z|Orin[ _]?HD|Orin[ _]?S|Otis[ _]?S|SpeedStar[ _]?S|Magnet[ _]?M9|Primus[ _]?94[ _]?3G|Primus[ _]?94HD|Primus[ _]?QS|Android.*\\bQ8\\b|Sirius[ _]?EVO[ _]?QS|Sirius[ _]?QS|Spirit[ _]?S)\\b",
        "ECSTablet": "V07OT2|TM105A|S10OT1|TR10CS1",
        "StorexTablet": "eZee[_']?(Tab|Go)[0-9]+|TabLC7|Looney Tunes Tab",
        "VodafoneTablet": "SmartTab([ ]+)?[0-9]+|SmartTabII10|SmartTabII7|VF-1497|VFD 1400",
        "EssentielBTablet": "Smart[ ']?TAB[ ]+?[0-9]+|Family[ ']?TAB2",
        "RossMoorTablet": "RM-790|RM-997|RMD-878G|RMD-974R|RMT-705A|RMT-701|RME-601|RMT-501|RMT-711",
        "iMobileTablet": "i-mobile i-note",
        "TolinoTablet": "tolino tab [0-9.]+|tolino shine",
        "AudioSonicTablet": "\\bC-22Q|T7-QC|T-17B|T-17P\\b",
        "AMPETablet": "Android.* A78 ",
        "SkkTablet": "Android.* (SKYPAD|PHOENIX|CYCLOPS)",
        "TecnoTablet": "TECNO P9|TECNO DP8D",
        "JXDTablet": "Android.* \\b(F3000|A3300|JXD5000|JXD3000|JXD2000|JXD300B|JXD300|S5800|S7800|S602b|S5110b|S7300|S5300|S602|S603|S5100|S5110|S601|S7100a|P3000F|P3000s|P101|P200s|P1000m|P200m|P9100|P1000s|S6600b|S908|P1000|P300|S18|S6600|S9100)\\b",
        "iJoyTablet": "Tablet (Spirit 7|Essentia|Galatea|Fusion|Onix 7|Landa|Titan|Scooby|Deox|Stella|Themis|Argon|Unique 7|Sygnus|Hexen|Finity 7|Cream|Cream X2|Jade|Neon 7|Neron 7|Kandy|Scape|Saphyr 7|Rebel|Biox|Rebel|Rebel 8GB|Myst|Draco 7|Myst|Tab7-004|Myst|Tadeo Jones|Tablet Boing|Arrow|Draco Dual Cam|Aurix|Mint|Amity|Revolution|Finity 9|Neon 9|T9w|Amity 4GB Dual Cam|Stone 4GB|Stone 8GB|Andromeda|Silken|X2|Andromeda II|Halley|Flame|Saphyr 9,7|Touch 8|Planet|Triton|Unique 10|Hexen 10|Memphis 4GB|Memphis 8GB|Onix 10)",
        "FX2Tablet": "FX2 PAD7|FX2 PAD10",
        "XoroTablet": "KidsPAD 701|PAD[ ]?712|PAD[ ]?714|PAD[ ]?716|PAD[ ]?717|PAD[ ]?718|PAD[ ]?720|PAD[ ]?721|PAD[ ]?722|PAD[ ]?790|PAD[ ]?792|PAD[ ]?900|PAD[ ]?9715D|PAD[ ]?9716DR|PAD[ ]?9718DR|PAD[ ]?9719QR|PAD[ ]?9720QR|TelePAD1030|Telepad1032|TelePAD730|TelePAD731|TelePAD732|TelePAD735Q|TelePAD830|TelePAD9730|TelePAD795|MegaPAD 1331|MegaPAD 1851|MegaPAD 2151",
        "ViewsonicTablet": "ViewPad 10pi|ViewPad 10e|ViewPad 10s|ViewPad E72|ViewPad7|ViewPad E100|ViewPad 7e|ViewSonic VB733|VB100a",
        "VerizonTablet": "QTAQZ3|QTAIR7|QTAQTZ3|QTASUN1|QTASUN2|QTAXIA1",
        "OdysTablet": "LOOX|XENO10|ODYS[ -](Space|EVO|Xpress|NOON)|\\bXELIO\\b|Xelio10Pro|XELIO7PHONETAB|XELIO10EXTREME|XELIOPT2|NEO_QUAD10",
        "CaptivaTablet": "CAPTIVA PAD",
        "IconbitTablet": "NetTAB|NT-3702|NT-3702S|NT-3702S|NT-3603P|NT-3603P|NT-0704S|NT-0704S|NT-3805C|NT-3805C|NT-0806C|NT-0806C|NT-0909T|NT-0909T|NT-0907S|NT-0907S|NT-0902S|NT-0902S",
        "TeclastTablet": "T98 4G|\\bP80\\b|\\bX90HD\\b|X98 Air|X98 Air 3G|\\bX89\\b|P80 3G|\\bX80h\\b|P98 Air|\\bX89HD\\b|P98 3G|\\bP90HD\\b|P89 3G|X98 3G|\\bP70h\\b|P79HD 3G|G18d 3G|\\bP79HD\\b|\\bP89s\\b|\\bA88\\b|\\bP10HD\\b|\\bP19HD\\b|G18 3G|\\bP78HD\\b|\\bA78\\b|\\bP75\\b|G17s 3G|G17h 3G|\\bP85t\\b|\\bP90\\b|\\bP11\\b|\\bP98t\\b|\\bP98HD\\b|\\bG18d\\b|\\bP85s\\b|\\bP11HD\\b|\\bP88s\\b|\\bA80HD\\b|\\bA80se\\b|\\bA10h\\b|\\bP89\\b|\\bP78s\\b|\\bG18\\b|\\bP85\\b|\\bA70h\\b|\\bA70\\b|\\bG17\\b|\\bP18\\b|\\bA80s\\b|\\bA11s\\b|\\bP88HD\\b|\\bA80h\\b|\\bP76s\\b|\\bP76h\\b|\\bP98\\b|\\bA10HD\\b|\\bP78\\b|\\bP88\\b|\\bA11\\b|\\bA10t\\b|\\bP76a\\b|\\bP76t\\b|\\bP76e\\b|\\bP85HD\\b|\\bP85a\\b|\\bP86\\b|\\bP75HD\\b|\\bP76v\\b|\\bA12\\b|\\bP75a\\b|\\bA15\\b|\\bP76Ti\\b|\\bP81HD\\b|\\bA10\\b|\\bT760VE\\b|\\bT720HD\\b|\\bP76\\b|\\bP73\\b|\\bP71\\b|\\bP72\\b|\\bT720SE\\b|\\bC520Ti\\b|\\bT760\\b|\\bT720VE\\b|T720-3GE|T720-WiFi",
        "OndaTablet": "\\b(V975i|Vi30|VX530|V701|Vi60|V701s|Vi50|V801s|V719|Vx610w|VX610W|V819i|Vi10|VX580W|Vi10|V711s|V813|V811|V820w|V820|Vi20|V711|VI30W|V712|V891w|V972|V819w|V820w|Vi60|V820w|V711|V813s|V801|V819|V975s|V801|V819|V819|V818|V811|V712|V975m|V101w|V961w|V812|V818|V971|V971s|V919|V989|V116w|V102w|V973|Vi40)\\b[\\s]+|V10 \\b4G\\b",
        "JaytechTablet": "TPC-PA762",
        "BlaupunktTablet": "Endeavour 800NG|Endeavour 1010",
        "DigmaTablet": "\\b(iDx10|iDx9|iDx8|iDx7|iDxD7|iDxD8|iDsQ8|iDsQ7|iDsQ8|iDsD10|iDnD7|3TS804H|iDsQ11|iDj7|iDs10)\\b",
        "EvolioTablet": "ARIA_Mini_wifi|Aria[ _]Mini|Evolio X10|Evolio X7|Evolio X8|\\bEvotab\\b|\\bNeura\\b",
        "LavaTablet": "QPAD E704|\\bIvoryS\\b|E-TAB IVORY|\\bE-TAB\\b",
        "AocTablet": "MW0811|MW0812|MW0922|MTK8382|MW1031|MW0831|MW0821|MW0931|MW0712",
        "MpmanTablet": "MP11 OCTA|MP10 OCTA|MPQC1114|MPQC1004|MPQC994|MPQC974|MPQC973|MPQC804|MPQC784|MPQC780|\\bMPG7\\b|MPDCG75|MPDCG71|MPDC1006|MP101DC|MPDC9000|MPDC905|MPDC706HD|MPDC706|MPDC705|MPDC110|MPDC100|MPDC99|MPDC97|MPDC88|MPDC8|MPDC77|MP709|MID701|MID711|MID170|MPDC703|MPQC1010",
        "CelkonTablet": "CT695|CT888|CT[\\s]?910|CT7 Tab|CT9 Tab|CT3 Tab|CT2 Tab|CT1 Tab|C820|C720|\\bCT-1\\b",
        "WolderTablet": "miTab \\b(DIAMOND|SPACE|BROOKLYN|NEO|FLY|MANHATTAN|FUNK|EVOLUTION|SKY|GOCAR|IRON|GENIUS|POP|MINT|EPSILON|BROADWAY|JUMP|HOP|LEGEND|NEW AGE|LINE|ADVANCE|FEEL|FOLLOW|LIKE|LINK|LIVE|THINK|FREEDOM|CHICAGO|CLEVELAND|BALTIMORE-GH|IOWA|BOSTON|SEATTLE|PHOENIX|DALLAS|IN 101|MasterChef)\\b",
        "MediacomTablet": "M-MPI10C3G|M-SP10EG|M-SP10EGP|M-SP10HXAH|M-SP7HXAH|M-SP10HXBH|M-SP8HXAH|M-SP8MXA",
        "MiTablet": "\\bMI PAD\\b|\\bHM NOTE 1W\\b",
        "NibiruTablet": "Nibiru M1|Nibiru Jupiter One",
        "NexoTablet": "NEXO NOVA|NEXO 10|NEXO AVIO|NEXO FREE|NEXO GO|NEXO EVO|NEXO 3G|NEXO SMART|NEXO KIDDO|NEXO MOBI",
        "LeaderTablet": "TBLT10Q|TBLT10I|TBL-10WDKB|TBL-10WDKBO2013|TBL-W230V2|TBL-W450|TBL-W500|SV572|TBLT7I|TBA-AC7-8G|TBLT79|TBL-8W16|TBL-10W32|TBL-10WKB|TBL-W100",
        "UbislateTablet": "UbiSlate[\\s]?7C",
        "PocketBookTablet": "Pocketbook",
        "KocasoTablet": "\\b(TB-1207)\\b",
        "HisenseTablet": "\\b(F5281|E2371)\\b",
        "Hudl": "Hudl HT7S3|Hudl 2",
        "TelstraTablet": "T-Hub2",
        "GenericTablet": "Android.*\\b97D\\b|Tablet(?!.*PC)|BNTV250A|MID-WCDMA|LogicPD Zoom2|\\bA7EB\\b|CatNova8|A1_07|CT704|CT1002|\\bM721\\b|rk30sdk|\\bEVOTAB\\b|M758A|ET904|ALUMIUM10|Smartfren Tab|Endeavour 1010|Tablet-PC-4|Tagi Tab|\\bM6pro\\b|CT1020W|arc 10HD|\\bTP750\\b|\\bQTAQZ3\\b|WVT101|TM1088|KT107"
      },
      "oss": {
        "AndroidOS": "Android",
        "BlackBerryOS": "blackberry|\\bBB10\\b|rim tablet os",
        "PalmOS": "PalmOS|avantgo|blazer|elaine|hiptop|palm|plucker|xiino",
        "SymbianOS": "Symbian|SymbOS|Series60|Series40|SYB-[0-9]+|\\bS60\\b",
        "WindowsMobileOS": "Windows CE.*(PPC|Smartphone|Mobile|[0-9]{3}x[0-9]{3})|Windows Mobile|Windows Phone [0-9.]+|WCE;",
        "WindowsPhoneOS": "Windows Phone 10.0|Windows Phone 8.1|Windows Phone 8.0|Windows Phone OS|XBLWP7|ZuneWP7|Windows NT 6.[23]; ARM;",
        "iOS": "\\biPhone.*Mobile|\\biPod|\\biPad|AppleCoreMedia",
        "iPadOS": "CPU OS 13",
        "SailfishOS": "Sailfish",
        "MeeGoOS": "MeeGo",
        "MaemoOS": "Maemo",
        "JavaOS": "J2ME\/|\\bMIDP\\b|\\bCLDC\\b",
        "webOS": "webOS|hpwOS",
        "badaOS": "\\bBada\\b",
        "BREWOS": "BREW"
      },
      "uas": {
        "Chrome": "\\bCrMo\\b|CriOS|Android.*Chrome\/[.0-9]* (Mobile)?",
        "Dolfin": "\\bDolfin\\b",
        "Opera": "Opera.*Mini|Opera.*Mobi|Android.*Opera|Mobile.*OPR\/[0-9.]+$|Coast\/[0-9.]+",
        "Skyfire": "Skyfire",
        "Edge": "\\bEdgiOS\\b|Mobile Safari\/[.0-9]* Edge",
        "IE": "IEMobile|MSIEMobile",
        "Firefox": "fennec|firefox.*maemo|(Mobile|Tablet).*Firefox|Firefox.*Mobile|FxiOS",
        "Bolt": "bolt",
        "TeaShark": "teashark",
        "Blazer": "Blazer",
        "Safari": "Version((?!\\bEdgiOS\\b).)*Mobile.*Safari|Safari.*Mobile|MobileSafari",
        "WeChat": "\\bMicroMessenger\\b",
        "UCBrowser": "UC.*Browser|UCWEB",
        "baiduboxapp": "baiduboxapp",
        "baidubrowser": "baidubrowser",
        "DiigoBrowser": "DiigoBrowser",
        "Mercury": "\\bMercury\\b",
        "ObigoBrowser": "Obigo",
        "NetFront": "NF-Browser",
        "GenericBrowser": "NokiaBrowser|OviBrowser|OneBrowser|TwonkyBeamBrowser|SEMC.*Browser|FlyFlow|Minimo|NetFront|Novarra-Vision|MQQBrowser|MicroMessenger",
        "PaleMoon": "Android.*PaleMoon|Mobile.*PaleMoon"
      },
      "props": {
        "Mobile": "Mobile\/[VER]",
        "Build": "Build\/[VER]",
        "Version": "Version\/[VER]",
        "VendorID": "VendorID\/[VER]",
        "iPad": "iPad.*CPU[a-z ]+[VER]",
        "iPhone": "iPhone.*CPU[a-z ]+[VER]",
        "iPod": "iPod.*CPU[a-z ]+[VER]",
        "Kindle": "Kindle\/[VER]",
        "Chrome": ["Chrome\/[VER]", "CriOS\/[VER]", "CrMo\/[VER]"],
        "Coast": ["Coast\/[VER]"],
        "Dolfin": "Dolfin\/[VER]",
        "Firefox": ["Firefox\/[VER]", "FxiOS\/[VER]"],
        "Fennec": "Fennec\/[VER]",
        "Edge": "Edge\/[VER]",
        "IE": ["IEMobile\/[VER];", "IEMobile [VER]", "MSIE [VER];", "Trident\/[0-9.]+;.*rv:[VER]"],
        "NetFront": "NetFront\/[VER]",
        "NokiaBrowser": "NokiaBrowser\/[VER]",
        "Opera": [" OPR\/[VER]", "Opera Mini\/[VER]", "Version\/[VER]"],
        "Opera Mini": "Opera Mini\/[VER]",
        "Opera Mobi": "Version\/[VER]",
        "UCBrowser": ["UCWEB[VER]", "UC.*Browser\/[VER]"],
        "MQQBrowser": "MQQBrowser\/[VER]",
        "MicroMessenger": "MicroMessenger\/[VER]",
        "baiduboxapp": "baiduboxapp\/[VER]",
        "baidubrowser": "baidubrowser\/[VER]",
        "SamsungBrowser": "SamsungBrowser\/[VER]",
        "Iron": "Iron\/[VER]",
        "Safari": ["Version\/[VER]", "Safari\/[VER]"],
        "Skyfire": "Skyfire\/[VER]",
        "Tizen": "Tizen\/[VER]",
        "Webkit": "webkit[ \/][VER]",
        "PaleMoon": "PaleMoon\/[VER]",
        "SailfishBrowser": "SailfishBrowser\/[VER]",
        "Gecko": "Gecko\/[VER]",
        "Trident": "Trident\/[VER]",
        "Presto": "Presto\/[VER]",
        "Goanna": "Goanna\/[VER]",
        "iOS": " \\bi?OS\\b [VER][ ;]{1}",
        "Android": "Android [VER]",
        "Sailfish": "Sailfish [VER]",
        "BlackBerry": ["BlackBerry[\\w]+\/[VER]", "BlackBerry.*Version\/[VER]", "Version\/[VER]"],
        "BREW": "BREW [VER]",
        "Java": "Java\/[VER]",
        "Windows Phone OS": ["Windows Phone OS [VER]", "Windows Phone [VER]"],
        "Windows Phone": "Windows Phone [VER]",
        "Windows CE": "Windows CE\/[VER]",
        "Windows NT": "Windows NT [VER]",
        "Symbian": ["SymbianOS\/[VER]", "Symbian\/[VER]"],
        "webOS": ["webOS\/[VER]", "hpwOS\/[VER];"]
      },
      "utils": {
        "Bot": "Googlebot|facebookexternalhit|Google-AMPHTML|s~amp-validator|AdsBot-Google|Google Keyword Suggestion|Facebot|YandexBot|YandexMobileBot|bingbot|ia_archiver|AhrefsBot|Ezooms|GSLFbot|WBSearchBot|Twitterbot|TweetmemeBot|Twikle|PaperLiBot|Wotbox|UnwindFetchor|Exabot|MJ12bot|YandexImages|TurnitinBot|Pingdom|contentkingapp|AspiegelBot",
        "MobileBot": "Googlebot-Mobile|AdsBot-Google-Mobile|YahooSeeker\/M1A1-R2D2",
        "DesktopMode": "WPDesktop",
        "TV": "SonyDTV|HbbTV",
        "WebKit": "(webkit)[ \/]([\\w.]+)",
        "Console": "\\b(Nintendo|Nintendo WiiU|Nintendo 3DS|Nintendo Switch|PLAYSTATION|Xbox)\\b",
        "Watch": "SM-V700"
      }
    }; // following patterns come from http://detectmobilebrowsers.com/

    impl.detectMobileBrowsers = {
      fullPattern: /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,
      shortPattern: /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,
      tabletPattern: /android|ipad|playbook|silk/i
    };
    var hasOwnProp = Object.prototype.hasOwnProperty,
        isArray;
    impl.FALLBACK_PHONE = 'UnknownPhone';
    impl.FALLBACK_TABLET = 'UnknownTablet';
    impl.FALLBACK_MOBILE = 'UnknownMobile';
    isArray = 'isArray' in Array ? Array.isArray : function (value) {
      return Object.prototype.toString.call(value) === '[object Array]';
    };

    function equalIC(a, b) {
      return a != null && b != null && a.toLowerCase() === b.toLowerCase();
    }

    function containsIC(array, value) {
      var valueLC,
          i,
          len = array.length;

      if (!len || !value) {
        return false;
      }

      valueLC = value.toLowerCase();

      for (i = 0; i < len; ++i) {
        if (valueLC === array[i].toLowerCase()) {
          return true;
        }
      }

      return false;
    }

    function convertPropsToRegExp(object) {
      for (var key in object) {
        if (hasOwnProp.call(object, key)) {
          object[key] = new RegExp(object[key], 'i');
        }
      }
    }

    function prepareUserAgent(userAgent) {
      return (userAgent || '').substr(0, 500); // mitigate vulnerable to ReDoS
    }

    (function init() {
      var key,
          values,
          value,
          i,
          len,
          verPos,
          mobileDetectRules = impl.mobileDetectRules;

      for (key in mobileDetectRules.props) {
        if (hasOwnProp.call(mobileDetectRules.props, key)) {
          values = mobileDetectRules.props[key];

          if (!isArray(values)) {
            values = [values];
          }

          len = values.length;

          for (i = 0; i < len; ++i) {
            value = values[i];
            verPos = value.indexOf('[VER]');

            if (verPos >= 0) {
              value = value.substring(0, verPos) + '([\\w._\\+]+)' + value.substring(verPos + 5);
            }

            values[i] = new RegExp(value, 'i');
          }

          mobileDetectRules.props[key] = values;
        }
      }

      convertPropsToRegExp(mobileDetectRules.oss);
      convertPropsToRegExp(mobileDetectRules.phones);
      convertPropsToRegExp(mobileDetectRules.tablets);
      convertPropsToRegExp(mobileDetectRules.uas);
      convertPropsToRegExp(mobileDetectRules.utils); // copy some patterns to oss0 which are tested first (see issue#15)

      mobileDetectRules.oss0 = {
        WindowsPhoneOS: mobileDetectRules.oss.WindowsPhoneOS,
        WindowsMobileOS: mobileDetectRules.oss.WindowsMobileOS
      };
    })();
    /**
     * Test userAgent string against a set of rules and find the first matched key.
     * @param {Object} rules (key is String, value is RegExp)
     * @param {String} userAgent the navigator.userAgent (or HTTP-Header 'User-Agent').
     * @returns {String|null} the matched key if found, otherwise <tt>null</tt>
     * @private
     */


    impl.findMatch = function (rules, userAgent) {
      for (var key in rules) {
        if (hasOwnProp.call(rules, key)) {
          if (rules[key].test(userAgent)) {
            return key;
          }
        }
      }

      return null;
    };
    /**
     * Test userAgent string against a set of rules and return an array of matched keys.
     * @param {Object} rules (key is String, value is RegExp)
     * @param {String} userAgent the navigator.userAgent (or HTTP-Header 'User-Agent').
     * @returns {Array} an array of matched keys, may be empty when there is no match, but not <tt>null</tt>
     * @private
     */


    impl.findMatches = function (rules, userAgent) {
      var result = [];

      for (var key in rules) {
        if (hasOwnProp.call(rules, key)) {
          if (rules[key].test(userAgent)) {
            result.push(key);
          }
        }
      }

      return result;
    };
    /**
     * Check the version of the given property in the User-Agent.
     *
     * @param {String} propertyName
     * @param {String} userAgent
     * @return {String} version or <tt>null</tt> if version not found
     * @private
     */


    impl.getVersionStr = function (propertyName, userAgent) {
      var props = impl.mobileDetectRules.props,
          patterns,
          i,
          len,
          match;

      if (hasOwnProp.call(props, propertyName)) {
        patterns = props[propertyName];
        len = patterns.length;

        for (i = 0; i < len; ++i) {
          match = patterns[i].exec(userAgent);

          if (match !== null) {
            return match[1];
          }
        }
      }

      return null;
    };
    /**
     * Check the version of the given property in the User-Agent.
     * Will return a float number. (eg. 2_0 will return 2.0, 4.3.1 will return 4.31)
     *
     * @param {String} propertyName
     * @param {String} userAgent
     * @return {Number} version or <tt>NaN</tt> if version not found
     * @private
     */


    impl.getVersion = function (propertyName, userAgent) {
      var version = impl.getVersionStr(propertyName, userAgent);
      return version ? impl.prepareVersionNo(version) : NaN;
    };
    /**
     * Prepare the version number.
     *
     * @param {String} version
     * @return {Number} the version number as a floating number
     * @private
     */


    impl.prepareVersionNo = function (version) {
      var numbers;
      numbers = version.split(/[a-z._ \/\-]/i);

      if (numbers.length === 1) {
        version = numbers[0];
      }

      if (numbers.length > 1) {
        version = numbers[0] + '.';
        numbers.shift();
        version += numbers.join('');
      }

      return Number(version);
    };

    impl.isMobileFallback = function (userAgent) {
      return impl.detectMobileBrowsers.fullPattern.test(userAgent) || impl.detectMobileBrowsers.shortPattern.test(userAgent.substr(0, 4));
    };

    impl.isTabletFallback = function (userAgent) {
      return impl.detectMobileBrowsers.tabletPattern.test(userAgent);
    };

    impl.prepareDetectionCache = function (cache, userAgent, maxPhoneWidth) {
      if (cache.mobile !== undefined$1) {
        return;
      }

      var phone, tablet, phoneSized; // first check for stronger tablet rules, then phone (see issue#5)

      tablet = impl.findMatch(impl.mobileDetectRules.tablets, userAgent);

      if (tablet) {
        cache.mobile = cache.tablet = tablet;
        cache.phone = null;
        return; // unambiguously identified as tablet
      }

      phone = impl.findMatch(impl.mobileDetectRules.phones, userAgent);

      if (phone) {
        cache.mobile = cache.phone = phone;
        cache.tablet = null;
        return; // unambiguously identified as phone
      } // our rules haven't found a match -> try more general fallback rules


      if (impl.isMobileFallback(userAgent)) {
        phoneSized = MobileDetect.isPhoneSized(maxPhoneWidth);

        if (phoneSized === undefined$1) {
          cache.mobile = impl.FALLBACK_MOBILE;
          cache.tablet = cache.phone = null;
        } else if (phoneSized) {
          cache.mobile = cache.phone = impl.FALLBACK_PHONE;
          cache.tablet = null;
        } else {
          cache.mobile = cache.tablet = impl.FALLBACK_TABLET;
          cache.phone = null;
        }
      } else if (impl.isTabletFallback(userAgent)) {
        cache.mobile = cache.tablet = impl.FALLBACK_TABLET;
        cache.phone = null;
      } else {
        // not mobile at all!
        cache.mobile = cache.tablet = cache.phone = null;
      }
    }; // t is a reference to a MobileDetect instance


    impl.mobileGrade = function (t) {
      // impl note:
      // To keep in sync w/ Mobile_Detect.php easily, the following code is tightly aligned to the PHP version.
      // When changes are made in Mobile_Detect.php, copy this method and replace:
      //     $this-> / t.
      //     self::MOBILE_GRADE_(.) / '$1'
      //     , self::VERSION_TYPE_FLOAT / (nothing)
      //     isIOS() / os('iOS')
      //     [reg] / (nothing)   <-- jsdelivr complaining about unescaped unicode character U+00AE
      var $isMobile = t.mobile() !== null;

      if ( // Apple iOS 3.2-5.1 - Tested on the original iPad (4.3 / 5.0), iPad 2 (4.3), iPad 3 (5.1), original iPhone (3.1), iPhone 3 (3.2), 3GS (4.3), 4 (4.3 / 5.0), and 4S (5.1)
      t.os('iOS') && t.version('iPad') >= 4.3 || t.os('iOS') && t.version('iPhone') >= 3.1 || t.os('iOS') && t.version('iPod') >= 3.1 || t.version('Android') > 2.1 && t.is('Webkit') || // Windows Phone 7-7.5 - Tested on the HTC Surround (7.0) HTC Trophy (7.5), LG-E900 (7.5), Nokia Lumia 800
      t.version('Windows Phone OS') >= 7.0 || // Blackberry 7 - Tested on BlackBerry Torch 9810
      // Blackberry 6.0 - Tested on the Torch 9800 and Style 9670
      t.is('BlackBerry') && t.version('BlackBerry') >= 6.0 || // Blackberry Playbook (1.0-2.0) - Tested on PlayBook
      t.match('Playbook.*Tablet') || t.version('webOS') >= 1.4 && t.match('Palm|Pre|Pixi') || // Palm WebOS 3.0  - Tested on HP TouchPad
      t.match('hp.*TouchPad') || t.is('Firefox') && t.version('Firefox') >= 12 || t.is('Chrome') && t.is('AndroidOS') && t.version('Android') >= 4.0 || t.is('Skyfire') && t.version('Skyfire') >= 4.1 && t.is('AndroidOS') && t.version('Android') >= 2.3 || t.is('Opera') && t.version('Opera Mobi') > 11 && t.is('AndroidOS') || // Meego 1.2 - Tested on Nokia 950 and N9
      t.is('MeeGoOS') || // Tizen (pre-release) - Tested on early hardware
      t.is('Tizen') || // Samsung Bada 2.0 - Tested on a Samsung Wave 3, Dolphin browser
      // @todo: more tests here!
      t.is('Dolfin') && t.version('Bada') >= 2.0 || (t.is('UC Browser') || t.is('Dolfin')) && t.version('Android') >= 2.3 || t.match('Kindle Fire') || t.is('Kindle') && t.version('Kindle') >= 3.0 || // Nook Color 1.4.1 - Tested on original Nook Color, not Nook Tablet
      t.is('AndroidOS') && t.is('NookTablet') || // Chrome Desktop 11-21 - Tested on OS X 10.7 and Windows 7
      t.version('Chrome') >= 11 && !$isMobile || // Safari Desktop 4-5 - Tested on OS X 10.7 and Windows 7
      t.version('Safari') >= 5.0 && !$isMobile || // Firefox Desktop 4-13 - Tested on OS X 10.7 and Windows 7
      t.version('Firefox') >= 4.0 && !$isMobile || // Internet Explorer 7-9 - Tested on Windows XP, Vista and 7
      t.version('MSIE') >= 7.0 && !$isMobile || // Opera Desktop 10-12 - Tested on OS X 10.7 and Windows 7
      // @reference: http://my.opera.com/community/openweb/idopera/
      t.version('Opera') >= 10 && !$isMobile) {
        return 'A';
      }

      if (t.os('iOS') && t.version('iPad') < 4.3 || t.os('iOS') && t.version('iPhone') < 3.1 || t.os('iOS') && t.version('iPod') < 3.1 || // Blackberry 5.0: Tested on the Storm 2 9550, Bold 9770
      t.is('Blackberry') && t.version('BlackBerry') >= 5 && t.version('BlackBerry') < 6 || t.version('Opera Mini') >= 5.0 && t.version('Opera Mini') <= 6.5 && (t.version('Android') >= 2.3 || t.is('iOS')) || // Nokia Symbian^3 - Tested on Nokia N8 (Symbian^3), C7 (Symbian^3), also works on N97 (Symbian^1)
      t.match('NokiaN8|NokiaC7|N97.*Series60|Symbian/3') || // @todo: report this (tested on Nokia N71)
      t.version('Opera Mobi') >= 11 && t.is('SymbianOS')) {
        return 'B';
      }

      if ( // Blackberry 4.x - Tested on the Curve 8330
      t.version('BlackBerry') < 5.0 || // Windows Mobile - Tested on the HTC Leo (WinMo 5.2)
      t.match('MSIEMobile|Windows CE.*Mobile') || t.version('Windows Mobile') <= 5.2) {
        return 'C';
      } //All older smartphone platforms and featurephones - Any device that doesn't support media queries
      //will receive the basic, C grade experience.


      return 'C';
    };

    impl.detectOS = function (ua) {
      return impl.findMatch(impl.mobileDetectRules.oss0, ua) || impl.findMatch(impl.mobileDetectRules.oss, ua);
    };

    impl.getDeviceSmallerSide = function () {
      return window.screen.width < window.screen.height ? window.screen.width : window.screen.height;
    };
    /**
     * Constructor for MobileDetect object.
     * <br>
     * Such an object will keep a reference to the given user-agent string and cache most of the detect queries.<br>
     * <div style="background-color: #d9edf7; border: 1px solid #bce8f1; color: #3a87ad; padding: 14px; border-radius: 2px; margin-top: 20px">
     *     <strong>Find information how to download and install:</strong>
     *     <a href="https://github.com/hgoebl/mobile-detect.js/">github.com/hgoebl/mobile-detect.js/</a>
     * </div>
     *
     * @example <pre>
     *     var md = new MobileDetect(window.navigator.userAgent);
     *     if (md.mobile()) {
     *         location.href = (md.mobileGrade() === 'A') ? '/mobile/' : '/lynx/';
     *     }
     * </pre>
     *
     * @param {string} userAgent typically taken from window.navigator.userAgent or http_header['User-Agent']
     * @param {number} [maxPhoneWidth=600] <strong>only for browsers</strong> specify a value for the maximum
     *        width of smallest device side (in logical "CSS" pixels) until a device detected as mobile will be handled
     *        as phone.
     *        This is only used in cases where the device cannot be classified as phone or tablet.<br>
     *        See <a href="http://developer.android.com/guide/practices/screens_support.html">Declaring Tablet Layouts
     *        for Android</a>.<br>
     *        If you provide a value < 0, then this "fuzzy" check is disabled.
     * @constructor
     * @global
     */


    function MobileDetect(userAgent, maxPhoneWidth) {
      this.ua = prepareUserAgent(userAgent);
      this._cache = {}; //600dp is typical 7" tablet minimum width

      this.maxPhoneWidth = maxPhoneWidth || 600;
    }

    MobileDetect.prototype = {
      constructor: MobileDetect,

      /**
       * Returns the detected phone or tablet type or <tt>null</tt> if it is not a mobile device.
       * <br>
       * For a list of possible return values see {@link MobileDetect#phone} and {@link MobileDetect#tablet}.<br>
       * <br>
       * If the device is not detected by the regular expressions from Mobile-Detect, a test is made against
       * the patterns of <a href="http://detectmobilebrowsers.com/">detectmobilebrowsers.com</a>. If this test
       * is positive, a value of <code>UnknownPhone</code>, <code>UnknownTablet</code> or
       * <code>UnknownMobile</code> is returned.<br>
       * When used in browser, the decision whether phone or tablet is made based on <code>screen.width/height</code>.<br>
       * <br>
       * When used server-side (node.js), there is no way to tell the difference between <code>UnknownTablet</code>
       * and <code>UnknownMobile</code>, so you will get <code>UnknownMobile</code> here.<br>
       * Be aware that since v1.0.0 in this special case you will get <code>UnknownMobile</code> only for:
       * {@link MobileDetect#mobile}, not for {@link MobileDetect#phone} and {@link MobileDetect#tablet}.
       * In versions before v1.0.0 all 3 methods returned <code>UnknownMobile</code> which was tedious to use.
       * <br>
       * In most cases you will use the return value just as a boolean.
       *
       * @returns {String} the key for the phone family or tablet family, e.g. "Nexus".
       * @function MobileDetect#mobile
       */
      mobile: function mobile() {
        impl.prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth);
        return this._cache.mobile;
      },

      /**
       * Returns the detected phone type/family string or <tt>null</tt>.
       * <br>
       * The returned tablet (family or producer) is one of following keys:<br>
       * <br><tt>iPhone, BlackBerry, Pixel, HTC, Nexus, Dell, Motorola, Samsung, LG, Sony, Asus,
       * Xiaomi, NokiaLumia, Micromax, Palm, Vertu, Pantech, Fly, Wiko, iMobile,
       * SimValley, Wolfgang, Alcatel, Nintendo, Amoi, INQ, OnePlus, GenericPhone</tt><br>
       * <br>
       * If the device is not detected by the regular expressions from Mobile-Detect, a test is made against
       * the patterns of <a href="http://detectmobilebrowsers.com/">detectmobilebrowsers.com</a>. If this test
       * is positive, a value of <code>UnknownPhone</code> or <code>UnknownMobile</code> is returned.<br>
       * When used in browser, the decision whether phone or tablet is made based on <code>screen.width/height</code>.<br>
       * <br>
       * When used server-side (node.js), there is no way to tell the difference between <code>UnknownTablet</code>
       * and <code>UnknownMobile</code>, so you will get <code>null</code> here, while {@link MobileDetect#mobile}
       * will return <code>UnknownMobile</code>.<br>
       * Be aware that since v1.0.0 in this special case you will get <code>UnknownMobile</code> only for:
       * {@link MobileDetect#mobile}, not for {@link MobileDetect#phone} and {@link MobileDetect#tablet}.
       * In versions before v1.0.0 all 3 methods returned <code>UnknownMobile</code> which was tedious to use.
       * <br>
       * In most cases you will use the return value just as a boolean.
       *
       * @returns {String} the key of the phone family or producer, e.g. "iPhone"
       * @function MobileDetect#phone
       */
      phone: function phone() {
        impl.prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth);
        return this._cache.phone;
      },

      /**
       * Returns the detected tablet type/family string or <tt>null</tt>.
       * <br>
       * The returned tablet (family or producer) is one of following keys:<br>
       * <br><tt>iPad, NexusTablet, GoogleTablet, SamsungTablet, Kindle, SurfaceTablet,
       * HPTablet, AsusTablet, BlackBerryTablet, HTCtablet, MotorolaTablet, NookTablet,
       * AcerTablet, ToshibaTablet, LGTablet, FujitsuTablet, PrestigioTablet,
       * LenovoTablet, DellTablet, YarvikTablet, MedionTablet, ArnovaTablet,
       * IntensoTablet, IRUTablet, MegafonTablet, EbodaTablet, AllViewTablet,
       * ArchosTablet, AinolTablet, NokiaLumiaTablet, SonyTablet, PhilipsTablet,
       * CubeTablet, CobyTablet, MIDTablet, MSITablet, SMiTTablet, RockChipTablet,
       * FlyTablet, bqTablet, HuaweiTablet, NecTablet, PantechTablet, BronchoTablet,
       * VersusTablet, ZyncTablet, PositivoTablet, NabiTablet, KoboTablet, DanewTablet,
       * TexetTablet, PlaystationTablet, TrekstorTablet, PyleAudioTablet, AdvanTablet,
       * DanyTechTablet, GalapadTablet, MicromaxTablet, KarbonnTablet, AllFineTablet,
       * PROSCANTablet, YONESTablet, ChangJiaTablet, GUTablet, PointOfViewTablet,
       * OvermaxTablet, HCLTablet, DPSTablet, VistureTablet, CrestaTablet,
       * MediatekTablet, ConcordeTablet, GoCleverTablet, ModecomTablet, VoninoTablet,
       * ECSTablet, StorexTablet, VodafoneTablet, EssentielBTablet, RossMoorTablet,
       * iMobileTablet, TolinoTablet, AudioSonicTablet, AMPETablet, SkkTablet,
       * TecnoTablet, JXDTablet, iJoyTablet, FX2Tablet, XoroTablet, ViewsonicTablet,
       * VerizonTablet, OdysTablet, CaptivaTablet, IconbitTablet, TeclastTablet,
       * OndaTablet, JaytechTablet, BlaupunktTablet, DigmaTablet, EvolioTablet,
       * LavaTablet, AocTablet, MpmanTablet, CelkonTablet, WolderTablet, MediacomTablet,
       * MiTablet, NibiruTablet, NexoTablet, LeaderTablet, UbislateTablet,
       * PocketBookTablet, KocasoTablet, HisenseTablet, Hudl, TelstraTablet,
       * GenericTablet</tt><br>
       * <br>
       * If the device is not detected by the regular expressions from Mobile-Detect, a test is made against
       * the patterns of <a href="http://detectmobilebrowsers.com/">detectmobilebrowsers.com</a>. If this test
       * is positive, a value of <code>UnknownTablet</code> or <code>UnknownMobile</code> is returned.<br>
       * When used in browser, the decision whether phone or tablet is made based on <code>screen.width/height</code>.<br>
       * <br>
       * When used server-side (node.js), there is no way to tell the difference between <code>UnknownTablet</code>
       * and <code>UnknownMobile</code>, so you will get <code>null</code> here, while {@link MobileDetect#mobile}
       * will return <code>UnknownMobile</code>.<br>
       * Be aware that since v1.0.0 in this special case you will get <code>UnknownMobile</code> only for:
       * {@link MobileDetect#mobile}, not for {@link MobileDetect#phone} and {@link MobileDetect#tablet}.
       * In versions before v1.0.0 all 3 methods returned <code>UnknownMobile</code> which was tedious to use.
       * <br>
       * In most cases you will use the return value just as a boolean.
       *
       * @returns {String} the key of the tablet family or producer, e.g. "SamsungTablet"
       * @function MobileDetect#tablet
       */
      tablet: function tablet() {
        impl.prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth);
        return this._cache.tablet;
      },

      /**
       * Returns the (first) detected user-agent string or <tt>null</tt>.
       * <br>
       * The returned user-agent is one of following keys:<br>
       * <br><tt>Chrome, Dolfin, Opera, Skyfire, Edge, IE, Firefox, Bolt, TeaShark, Blazer,
       * Safari, WeChat, UCBrowser, baiduboxapp, baidubrowser, DiigoBrowser, Mercury,
       * ObigoBrowser, NetFront, GenericBrowser, PaleMoon</tt><br>
       * <br>
       * In most cases calling {@link MobileDetect#userAgent} will be sufficient. But there are rare
       * cases where a mobile device pretends to be more than one particular browser. You can get the
       * list of all matches with {@link MobileDetect#userAgents} or check for a particular value by
       * providing one of the defined keys as first argument to {@link MobileDetect#is}.
       *
       * @returns {String} the key for the detected user-agent or <tt>null</tt>
       * @function MobileDetect#userAgent
       */
      userAgent: function userAgent() {
        if (this._cache.userAgent === undefined$1) {
          this._cache.userAgent = impl.findMatch(impl.mobileDetectRules.uas, this.ua);
        }

        return this._cache.userAgent;
      },

      /**
       * Returns all detected user-agent strings.
       * <br>
       * The array is empty or contains one or more of following keys:<br>
       * <br><tt>Chrome, Dolfin, Opera, Skyfire, Edge, IE, Firefox, Bolt, TeaShark, Blazer,
       * Safari, WeChat, UCBrowser, baiduboxapp, baidubrowser, DiigoBrowser, Mercury,
       * ObigoBrowser, NetFront, GenericBrowser, PaleMoon</tt><br>
       * <br>
       * In most cases calling {@link MobileDetect#userAgent} will be sufficient. But there are rare
       * cases where a mobile device pretends to be more than one particular browser. You can get the
       * list of all matches with {@link MobileDetect#userAgents} or check for a particular value by
       * providing one of the defined keys as first argument to {@link MobileDetect#is}.
       *
       * @returns {Array} the array of detected user-agent keys or <tt>[]</tt>
       * @function MobileDetect#userAgents
       */
      userAgents: function userAgents() {
        if (this._cache.userAgents === undefined$1) {
          this._cache.userAgents = impl.findMatches(impl.mobileDetectRules.uas, this.ua);
        }

        return this._cache.userAgents;
      },

      /**
       * Returns the detected operating system string or <tt>null</tt>.
       * <br>
       * The operating system is one of following keys:<br>
       * <br><tt>AndroidOS, BlackBerryOS, PalmOS, SymbianOS, WindowsMobileOS, WindowsPhoneOS,
       * iOS, iPadOS, SailfishOS, MeeGoOS, MaemoOS, JavaOS, webOS, badaOS, BREWOS</tt><br>
       *
       * @returns {String} the key for the detected operating system.
       * @function MobileDetect#os
       */
      os: function os() {
        if (this._cache.os === undefined$1) {
          this._cache.os = impl.detectOS(this.ua);
        }

        return this._cache.os;
      },

      /**
       * Get the version (as Number) of the given property in the User-Agent.
       * <br>
       * Will return a float number. (eg. 2_0 will return 2.0, 4.3.1 will return 4.31)
       *
       * @param {String} key a key defining a thing which has a version.<br>
       *        You can use one of following keys:<br>
       * <br><tt>Mobile, Build, Version, VendorID, iPad, iPhone, iPod, Kindle, Chrome, Coast,
       * Dolfin, Firefox, Fennec, Edge, IE, NetFront, NokiaBrowser, Opera, Opera Mini,
       * Opera Mobi, UCBrowser, MQQBrowser, MicroMessenger, baiduboxapp, baidubrowser,
       * SamsungBrowser, Iron, Safari, Skyfire, Tizen, Webkit, PaleMoon,
       * SailfishBrowser, Gecko, Trident, Presto, Goanna, iOS, Android, Sailfish,
       * BlackBerry, BREW, Java, Windows Phone OS, Windows Phone, Windows CE, Windows
       * NT, Symbian, webOS</tt><br>
       *
       * @returns {Number} the version as float or <tt>NaN</tt> if User-Agent doesn't contain this version.
       *          Be careful when comparing this value with '==' operator!
       * @function MobileDetect#version
       */
      version: function version(key) {
        return impl.getVersion(key, this.ua);
      },

      /**
       * Get the version (as String) of the given property in the User-Agent.
       * <br>
       *
       * @param {String} key a key defining a thing which has a version.<br>
       *        You can use one of following keys:<br>
       * <br><tt>Mobile, Build, Version, VendorID, iPad, iPhone, iPod, Kindle, Chrome, Coast,
       * Dolfin, Firefox, Fennec, Edge, IE, NetFront, NokiaBrowser, Opera, Opera Mini,
       * Opera Mobi, UCBrowser, MQQBrowser, MicroMessenger, baiduboxapp, baidubrowser,
       * SamsungBrowser, Iron, Safari, Skyfire, Tizen, Webkit, PaleMoon,
       * SailfishBrowser, Gecko, Trident, Presto, Goanna, iOS, Android, Sailfish,
       * BlackBerry, BREW, Java, Windows Phone OS, Windows Phone, Windows CE, Windows
       * NT, Symbian, webOS</tt><br>
       *
       * @returns {String} the "raw" version as String or <tt>null</tt> if User-Agent doesn't contain this version.
       *
       * @function MobileDetect#versionStr
       */
      versionStr: function versionStr(key) {
        return impl.getVersionStr(key, this.ua);
      },

      /**
       * Global test key against userAgent, os, phone, tablet and some other properties of userAgent string.
       *
       * @param {String} key the key (case-insensitive) of a userAgent, an operating system, phone or
       *        tablet family.<br>
       *        For a complete list of possible values, see {@link MobileDetect#userAgent},
       *        {@link MobileDetect#os}, {@link MobileDetect#phone}, {@link MobileDetect#tablet}.<br>
       *        Additionally you have following keys:<br>
       * <br><tt>Bot, MobileBot, DesktopMode, TV, WebKit, Console, Watch</tt><br>
       *
       * @returns {boolean} <tt>true</tt> when the given key is one of the defined keys of userAgent, os, phone,
       *                    tablet or one of the listed additional keys, otherwise <tt>false</tt>
       * @function MobileDetect#is
       */
      is: function is(key) {
        return containsIC(this.userAgents(), key) || equalIC(key, this.os()) || equalIC(key, this.phone()) || equalIC(key, this.tablet()) || containsIC(impl.findMatches(impl.mobileDetectRules.utils, this.ua), key);
      },

      /**
       * Do a quick test against navigator::userAgent.
       *
       * @param {String|RegExp} pattern the pattern, either as String or RegExp
       *                        (a string will be converted to a case-insensitive RegExp).
       * @returns {boolean} <tt>true</tt> when the pattern matches, otherwise <tt>false</tt>
       * @function MobileDetect#match
       */
      match: function match(pattern) {
        if (!(pattern instanceof RegExp)) {
          pattern = new RegExp(pattern, 'i');
        }

        return pattern.test(this.ua);
      },

      /**
       * Checks whether the mobile device can be considered as phone regarding <code>screen.width</code>.
       * <br>
       * Obviously this method makes sense in browser environments only (not for Node.js)!
       * @param {number} [maxPhoneWidth] the maximum logical pixels (aka. CSS-pixels) to be considered as phone.<br>
       *        The argument is optional and if not present or falsy, the value of the constructor is taken.
       * @returns {boolean|undefined} <code>undefined</code> if screen size wasn't detectable, else <code>true</code>
       *          when screen.width is less or equal to maxPhoneWidth, otherwise <code>false</code>.<br>
       *          Will always return <code>undefined</code> server-side.
       */
      isPhoneSized: function isPhoneSized(maxPhoneWidth) {
        return MobileDetect.isPhoneSized(maxPhoneWidth || this.maxPhoneWidth);
      },

      /**
       * Returns the mobile grade ('A', 'B', 'C').
       *
       * @returns {String} one of the mobile grades ('A', 'B', 'C').
       * @function MobileDetect#mobileGrade
       */
      mobileGrade: function mobileGrade() {
        if (this._cache.grade === undefined$1) {
          this._cache.grade = impl.mobileGrade(this);
        }

        return this._cache.grade;
      }
    }; // environment-dependent

    if (typeof window !== 'undefined' && window.screen) {
      MobileDetect.isPhoneSized = function (maxPhoneWidth) {
        return maxPhoneWidth < 0 ? undefined$1 : impl.getDeviceSmallerSide() <= maxPhoneWidth;
      };
    } else {
      MobileDetect.isPhoneSized = function () {};
    } // should not be replaced by a completely new object - just overwrite existing methods


    MobileDetect._impl = impl;
    MobileDetect.version = '1.4.5 2021-03-13';
    return MobileDetect;
  }); // end of call of define()
})(function (undefined$1) {
  if ('object' !== 'undefined' && module.exports) {
    return function (factory) {
      module.exports = factory();
    };
  } else if (typeof undefined$1 === 'function' && undefined$1.amd) {
    return undefined$1;
  } else if (typeof window !== 'undefined') {
    return function (factory) {
      window.MobileDetect = factory();
    };
  } else {
    // please file a bug if you get this error!
    throw new Error('unknown environment');
  }
}());
}(mobileDetect));

var MobileDetect = mobileDetect.exports;

class MethodHandler {
    constructor({ name, success, fail, complete }) {
        this.methodName = name;
        this.__success = success;
        this.__fail = fail;
        this.__complete = complete;
    }
    success(res = {}, resolve = Promise.resolve.bind(Promise)) {
        if (!res.errMsg) {
            res.errMsg = `${this.methodName}:ok`;
        }
        typeof this.__success === 'function' && this.__success(res);
        typeof this.__complete === 'function' && this.__complete(res);
        return resolve(res);
    }
    fail(res = {}, reject = Promise.reject.bind(Promise)) {
        if (!res.errMsg) {
            res.errMsg = `${this.methodName}:fail`;
        }
        else {
            res.errMsg = `${this.methodName}:fail ${res.errMsg}`;
        }
        console.error(res.errMsg);
        typeof this.__fail === 'function' && this.__fail(res);
        typeof this.__complete === 'function' && this.__complete(res);
        return reject(res);
    }
}
class CallbackManager {
    constructor() {
        this.callbacks = [];
        /**
         * ????????????
         * @param {{ callback: function, ctx: any } | function} opt
         */
        this.add = (opt) => {
            if (opt)
                this.callbacks.push(opt);
        };
        /**
         * ????????????
         * @param {{ callback: function, ctx: any } | function} opt
         */
        this.remove = (opt) => {
            if (opt) {
                let pos = -1;
                this.callbacks.forEach((callback, k) => {
                    if (callback === opt) {
                        pos = k;
                    }
                });
                if (pos > -1) {
                    this.callbacks.splice(pos, 1);
                }
            }
        };
        /**
         * ????????????????????????
         * @return {number}
         */
        this.count = () => {
            return this.callbacks.length;
        };
        /**
         * ????????????
         * @param  {...any} args ?????????????????????
         */
        this.trigger = (...args) => {
            this.callbacks.forEach(opt => {
                if (typeof opt === 'function') {
                    opt(...args);
                }
                else {
                    const { callback, ctx } = opt;
                    typeof callback === 'function' && callback.call(ctx, ...args);
                }
            });
        };
    }
}

/** ??????????????????????????? */
const openSystemBluetoothSetting = temporarilyNotSupport('openSystemBluetoothSetting');
/** ????????????????????????????????? */
const openAppAuthorizeSetting = temporarilyNotSupport('openAppAuthorizeSetting');
/** ?????????????????? */
const getWindowInfo = () => {
    const info = {
        /** ??????????????? */
        pixelRatio: window.devicePixelRatio,
        /** ?????????????????????px */
        screenWidth: window.screen.width,
        /** ?????????????????????px */
        screenHeight: window.screen.height,
        /** ??????????????????????????????px */
        windowWidth: document.documentElement.clientWidth,
        /** ??????????????????????????????px */
        windowHeight: document.documentElement.clientHeight,
        /** ???????????????????????????px */
        statusBarHeight: NaN,
        /** ???????????????????????????????????? */
        safeArea: {
            bottom: 0,
            height: 0,
            left: 0,
            right: 0,
            top: 0,
            width: 0
        }
    };
    return info;
};
/** ?????????????????? */
const getSystemSetting = () => {
    const isLandscape = window.screen.width >= window.screen.height;
    const info = {
        /** ????????????????????? */
        bluetoothEnabled: false,
        /** ??????????????????????????? */
        locationEnabled: false,
        /** Wi-Fi ??????????????? */
        wifiEnabled: false,
        /** ???????????? */
        deviceOrientation: isLandscape ? 'landscape' : 'portrait'
    };
    return info;
};
/** ?????????????????? */
const getDeviceInfo = () => {
    const md = new MobileDetect(navigator.userAgent);
    const info = {
        /** ????????????????????????????????? Android ????????? */
        abi: '',
        /** ????????????????????????Android???????????????????????????-2 ??? 0???????????????????????????????????????-1?????????????????????>=1???????????????????????????????????????????????????????????????????????????50??? */
        benchmarkLevel: -1,
        /** ???????????? */
        brand: md.mobile() || '',
        /** ???????????? */
        model: md.mobile() || '',
        /** ????????????????????? */
        system: md.os(),
        /** ??????????????? */
        platform: navigator.platform
    };
    return info;
};
/** ????????????APP???????????? */
const getAppBaseInfo = () => {
    var _a;
    let isDarkMode = false;
    if ((_a = window.matchMedia) === null || _a === void 0 ? void 0 : _a.call(window, '(prefers-color-scheme: dark)').matches) {
        isDarkMode = true;
    }
    const info = {
        /** ???????????????????????? */
        SDKVersion: '',
        /** ??????????????????????????????????????????????????? [Taro.setEnableDebug](/docs/apis/base/debug/setEnableDebug) ??????????????? */
        enableDebug: process.env.NODE_ENV === 'development',
        /** ???????????????????????????????????? */
        // host: { appId: '' },
        /** ????????????????????? */
        language: navigator.language,
        /** ??????????????? */
        version: '',
        /** ??????????????????????????????light???dark???????????????"darkmode":true??????????????????????????? undefined ???????????????????????? */
        theme: isDarkMode ? 'dark' : 'light'
    };
    return info;
};
/** ????????????APP???????????? */
const getAppAuthorizeSetting = () => {
    const info = {
        /** ??????????????????????????????????????? iOS ????????? */
        albumAuthorized: 'not determined',
        /** ??????????????????????????????????????? iOS ????????? */
        bluetoothAuthorized: 'not determined',
        /** ???????????????????????????????????? */
        cameraAuthorized: 'not determined',
        /** ????????????????????????????????? */
        locationAuthorized: 'not determined',
        /** ??????????????????true ?????????????????????false ???????????????????????? iOS ????????? */
        locationReducedAccuracy: false,
        /** ???????????????????????????????????? */
        microphoneAuthorized: 'not determined',
        /** ??????????????????????????? */
        notificationAuthorized: 'not determined',
        /** ????????????????????????????????????????????? iOS ????????? */
        notificationAlertAuthorized: 'not determined',
        /** ????????????????????????????????????????????? iOS ????????? */
        notificationBadgeAuthorized: 'not determined',
        /** ????????????????????????????????????????????? iOS ????????? */
        notificationSoundAuthorized: 'not determined',
        /** ????????????????????????????????? */
        phoneCalendarAuthorized: 'not determined'
    };
    return info;
};
/** ?????????????????? */
const getSystemInfoSync = () => {
    const windowInfo = getWindowInfo();
    const systemSetting = getSystemSetting();
    const deviceInfo = getDeviceInfo();
    const appBaseInfo = getAppBaseInfo();
    const appAuthorizeSetting = getAppAuthorizeSetting();
    delete deviceInfo.abi;
    const info = {
        ...windowInfo,
        ...systemSetting,
        ...deviceInfo,
        ...appBaseInfo,
        /** ???????????????????????????px??????????????????????????????-??????-??????-????????????????????????????????? */
        fontSizeSetting: NaN,
        /** ??????????????????????????????????????? iOS ????????? */
        albumAuthorized: appAuthorizeSetting.albumAuthorized === 'authorized',
        /** ???????????????????????????????????? */
        cameraAuthorized: appAuthorizeSetting.cameraAuthorized === 'authorized',
        /** ????????????????????????????????? */
        locationAuthorized: appAuthorizeSetting.locationAuthorized === 'authorized',
        /** ???????????????????????????????????? */
        microphoneAuthorized: appAuthorizeSetting.microphoneAuthorized === 'authorized',
        /** ??????????????????????????? */
        notificationAuthorized: appAuthorizeSetting.notificationAuthorized === 'authorized',
        /** ????????????????????????????????????????????? iOS ????????? */
        notificationAlertAuthorized: appAuthorizeSetting.notificationAlertAuthorized === 'authorized',
        /** ????????????????????????????????????????????? iOS ????????? */
        notificationBadgeAuthorized: appAuthorizeSetting.notificationBadgeAuthorized === 'authorized',
        /** ????????????????????????????????????????????? iOS ????????? */
        notificationSoundAuthorized: appAuthorizeSetting.notificationSoundAuthorized === 'authorized',
        /** ????????????????????????????????? */
        phoneCalendarAuthorized: appAuthorizeSetting.phoneCalendarAuthorized === 'authorized',
        /** `true` ?????????????????????`false` ???????????????????????? iOS ?????? */
        locationReducedAccuracy: appAuthorizeSetting.locationReducedAccuracy,
        /** ??????????????????????????? */
        environment: ''
    };
    return info;
};
/** ?????????????????? */
const getSystemInfoAsync = async (options = {}) => {
    const { success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'getSystemInfoAsync', success, fail, complete });
    try {
        const info = await getSystemInfoSync();
        return handle.success(info);
    }
    catch (error) {
        return handle.fail({
            errMsg: error
        });
    }
};
/** ?????????????????? */
const getSystemInfo = async (options = {}) => {
    const { success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'getSystemInfo', success, fail, complete });
    try {
        const info = await getSystemInfoSync();
        return handle.success(info);
    }
    catch (error) {
        return handle.fail({
            errMsg: error
        });
    }
};

// ??????
const updateWeChatApp = temporarilyNotSupport('updateWeChatApp');
const getUpdateManager = temporarilyNotSupport('getUpdateManager');

// ????????????
const getLaunchOptionsSync = temporarilyNotSupport('getLaunchOptionsSync');
const getEnterOptionsSync = temporarilyNotSupport('getEnterOptionsSync');

// ???????????????
const onUnhandledRejection = temporarilyNotSupport('onUnhandledRejection');
const onThemeChange = temporarilyNotSupport('onThemeChange');
const onPageNotFound = temporarilyNotSupport('onPageNotFound');
const onError = temporarilyNotSupport('onError');
const onAudioInterruptionEnd = temporarilyNotSupport('onAudioInterruptionEnd');
const onAudioInterruptionBegin = temporarilyNotSupport('onAudioInterruptionBegin');
const onAppShow = temporarilyNotSupport('onAppShow');
const onAppHide = temporarilyNotSupport('onAppHide');
const offUnhandledRejection = temporarilyNotSupport('offUnhandledRejection');
const offThemeChange = temporarilyNotSupport('offThemeChange');
const offPageNotFound = temporarilyNotSupport('offPageNotFound');
const offError = temporarilyNotSupport('offError');
const offAudioInterruptionEnd = temporarilyNotSupport('offAudioInterruptionEnd');
const offAudioInterruptionBegin = temporarilyNotSupport('offAudioInterruptionBegin');
const offAppShow = temporarilyNotSupport('offAppShow');
const offAppHide = temporarilyNotSupport('offAppHide');

const setEnableDebug = temporarilyNotSupport('setEnableDebug');
const getRealtimeLogManager = temporarilyNotSupport('getRealtimeLogManager');
const getLogManager = temporarilyNotSupport('getLogManager');

// ??????
const reportPerformance = temporarilyNotSupport('reportPerformance');
const getPerformance = temporarilyNotSupport('getPerformance');

// ??????
const getUserCryptoManager = temporarilyNotSupport('getUserCryptoManager');

// TODO env ????????????
const canIUse = temporarilyNotSupport('canIUse');
function arrayBufferToBase64(arrayBuffer) {
    return fromByteArray_1(arrayBuffer);
}
function base64ToArrayBuffer(base64) {
    return toByteArray_1(base64);
}

const TextBaseLineMap = {
    top: 'top',
    bottom: 'bottom',
    middle: 'middle',
    normal: 'alphabetic'
};
class CanvasContext {
    constructor(canvas, ctx) {
        this.actions = [];
        this.canvas = canvas;
        this.ctx = ctx;
    }
    set ctx(e) {
        this.__raw__ = e;
    }
    get ctx() {
        return this.__raw__ || {};
    }
    emptyActions() {
        this.actions.length = 0;
    }
    enqueueActions(func, ...args) {
        this.actions.push({
            func,
            args
        });
    }
    set fillStyle(e) { this.enqueueActions(() => { this.ctx.fillStyle = e; }); }
    get fillStyle() { return this.ctx.fillStyle; }
    set font(e) { this.ctx.font = e; }
    get font() { return this.ctx.font; }
    set globalAlpha(e) { this.enqueueActions(() => { this.ctx.globalAlpha = e; }); }
    get globalAlpha() { return this.ctx.globalAlpha; }
    set globalCompositeOperation(e) { this.enqueueActions(() => { this.ctx.globalCompositeOperation = e; }); }
    get globalCompositeOperation() { return this.ctx.globalCompositeOperation; }
    set lineCap(e) { this.enqueueActions(() => { this.ctx.lineCap = e; }); }
    get lineCap() { return this.ctx.lineCap; }
    set lineDashOffset(e) { this.enqueueActions(() => { this.ctx.lineDashOffset = e; }); }
    get lineDashOffset() { return this.ctx.lineDashOffset; }
    set lineJoin(e) { this.enqueueActions(() => { this.ctx.lineJoin = e; }); }
    get lineJoin() { return this.ctx.lineJoin; }
    set lineWidth(e) { this.enqueueActions(() => { this.ctx.lineWidth = e; }); }
    get lineWidth() { return this.ctx.lineWidth; }
    set miterLimit(e) { this.enqueueActions(() => { this.ctx.miterLimit = e; }); }
    get miterLimit() { return this.ctx.miterLimit; }
    set shadowBlur(e) { this.enqueueActions(() => { this.ctx.shadowBlur = e; }); }
    get shadowBlur() { return this.ctx.shadowBlur; }
    set shadowColor(e) { this.enqueueActions(() => { this.ctx.shadowColor = e; }); }
    get shadowColor() { return this.ctx.shadowColor; }
    set shadowOffsetX(e) { this.enqueueActions(() => { this.ctx.shadowOffsetX = e; }); }
    get shadowOffsetX() { return this.ctx.shadowOffsetX; }
    set shadowOffsetY(e) { this.enqueueActions(() => { this.ctx.shadowOffsetY = e; }); }
    get shadowOffsetY() { return this.ctx.shadowOffsetY; }
    set strokeStyle(e) { this.enqueueActions(() => { this.ctx.strokeStyle = e; }); }
    get strokeStyle() { return this.ctx.strokeStyle; }
    /** ??????????????????????????? ????????? */
    set textAlign(e) { this.ctx.textAlign = e; }
    get textAlign() { return this.ctx.textAlign; }
    set textBaseline(e) { this.ctx.textBaseline = e; }
    get textBaseline() { return this.ctx.textBaseline; }
    set direction(e) { this.ctx.direction = e; }
    get direction() { return this.ctx.direction; }
    set imageSmoothingEnabled(e) { this.enqueueActions(() => { this.ctx.imageSmoothingEnabled = e; }); }
    get imageSmoothingEnabled() { return this.ctx.imageSmoothingEnabled; }
    set imageSmoothingQuality(e) { this.enqueueActions(() => { this.ctx.imageSmoothingQuality = e; }); }
    get imageSmoothingQuality() { return this.ctx.imageSmoothingQuality; }
    set filter(e) { this.enqueueActions(() => { this.ctx.filter = e; }); }
    get filter() { return this.ctx.filter; }
    /** ??????????????????????????? ????????? */
    arc(...args) { return this.enqueueActions(this.ctx.arc, ...args); }
    arcTo(...args) { return this.enqueueActions(this.ctx.arcTo, ...args); }
    beginPath(...args) { return this.enqueueActions(this.ctx.beginPath, ...args); }
    bezierCurveTo(...args) { return this.enqueueActions(this.ctx.bezierCurveTo, ...args); }
    clearRect(...args) { return this.enqueueActions(this.ctx.clearRect, ...args); }
    clip(...args) { return this.enqueueActions(this.ctx.clip, ...args); }
    closePath(...args) { return this.enqueueActions(this.ctx.closePath, ...args); }
    createPattern(image, repetition) {
        return this.createPattern(image, repetition);
    }
    /**
     * ??????????????????????????????????????????????????????????????????????????? canvas ??????
     * @todo ?????? draw ???????????? width ??? height
     */
    async draw(reserve, callback) {
        try {
            if (!reserve) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            // ?????? action ????????????
            for (const { func, args } of this.actions) {
                await func.apply(this.ctx, args);
            }
            this.emptyActions();
            callback && callback();
        }
        catch (e) {
            /* eslint-disable no-throw-literal */
            throw {
                errMsg: e.message
            };
        }
    }
    drawImage(imageResource, ...extra) {
        this.enqueueActions(() => {
            // ??????????????? Image
            if (typeof imageResource === 'string') {
                const img = new Image();
                img.src = imageResource;
                return new Promise((resolve, reject) => {
                    img.onload = () => {
                        this.ctx.drawImage(img, ...extra);
                        resolve();
                    };
                    img.onerror = reject;
                });
            }
            this.ctx.drawImage(imageResource, ...extra);
        });
    }
    fill(...args) { return this.enqueueActions(this.ctx.fill, ...args); }
    fillRect(...args) { return this.enqueueActions(this.ctx.fillRect, ...args); }
    fillText(...args) { return this.enqueueActions(this.ctx.fillText, ...args); }
    lineTo(...args) { return this.enqueueActions(this.ctx.lineTo, ...args); }
    moveTo(...args) { return this.enqueueActions(this.ctx.moveTo, ...args); }
    quadraticCurveTo(...args) { return this.enqueueActions(this.ctx.quadraticCurveTo, ...args); }
    rect(...args) { return this.enqueueActions(this.ctx.rect, ...args); }
    restore(...args) { return this.enqueueActions(this.ctx.restore, ...args); }
    rotate(...args) { return this.enqueueActions(this.ctx.rotate, ...args); }
    save(...args) { return this.enqueueActions(this.ctx.save, ...args); }
    scale(...args) { return this.enqueueActions(this.ctx.scale, ...args); }
    setFillStyle(color) {
        this.enqueueActions(() => { this.ctx.fillStyle = color; });
    }
    setFontSize(fontSize) {
        this.font = `${fontSize}px`;
    }
    setGlobalAlpha(alpha) {
        this.globalAlpha = alpha;
    }
    setLineCap(lineCap) {
        this.lineCap = lineCap;
    }
    setLineDash(pattern, offset) {
        this.enqueueActions(() => {
            this.ctx.setLineDash(pattern);
            this.ctx.lineDashOffset = offset;
        });
    }
    setLineJoin(lineJoin) {
        this.lineJoin = lineJoin;
    }
    setLineWidth(lineWidth) {
        this.lineWidth = lineWidth;
    }
    setMiterLimit(miterLimit) {
        this.miterLimit = miterLimit;
    }
    setShadow(offsetX, offsetY, blur, color) {
        this.enqueueActions(() => {
            this.ctx.shadowOffsetX = offsetX;
            this.ctx.shadowOffsetY = offsetY;
            this.ctx.shadowColor = color;
            this.ctx.shadowBlur = blur;
        });
    }
    setStrokeStyle(color) {
        this.enqueueActions(() => { this.ctx.strokeStyle = color; });
    }
    setTextAlign(align) {
        this.textAlign = align;
    }
    setTextBaseline(textBaseline) {
        this.textBaseline = TextBaseLineMap[textBaseline] || 'alphabetic';
    }
    setTransform(...args) { return this.enqueueActions(this.ctx.setTransform, ...args); }
    stroke(...args) { return this.enqueueActions(this.ctx.stroke, ...args); }
    strokeRect(...args) { return this.enqueueActions(this.ctx.strokeRect, ...args); }
    strokeText(...args) { return this.enqueueActions(this.ctx.strokeText, ...args); }
    transform(...args) { return this.enqueueActions(this.ctx.transform, ...args); }
    translate(...args) { return this.enqueueActions(this.ctx.translate, ...args); }
    measureText(text) {
        return this.ctx.measureText(text);
    }
    createCircularGradient(x, y, r) {
        const radialGradient = this.ctx.createRadialGradient(x, y, 0, x, y, r);
        return radialGradient;
    }
    createLinearGradient(x0, y0, x1, y1) {
        return this.createLinearGradient(x0, y0, x1, y1);
    }
}

/**
 * ?????? canvas ?????????????????? CanvasContext ??????
 */
const createCanvasContext = (canvasId, inst) => {
    const el = findDOM(inst);
    const canvas = el === null || el === void 0 ? void 0 : el.querySelector(`canvas[canvas-id="${canvasId}"]`);
    const ctx = canvas === null || canvas === void 0 ? void 0 : canvas.getContext('2d');
    const context = new CanvasContext(canvas, ctx);
    if (!ctx)
        return context;
    context.canvas = canvas;
    context.ctx = ctx;
    return context;
};

/**
 * ??????????????????????????????????????????????????????????????????????????? draw() ?????????????????????????????????????????????????????????
 * @todo ??????????????????????????????
 */
const canvasToTempFilePath = ({ canvasId, fileType, quality, success, fail, complete }, inst) => {
    const handle = new MethodHandler({ name: 'canvasToTempFilePath', success, fail, complete });
    const el = findDOM(inst);
    const canvas = el === null || el === void 0 ? void 0 : el.querySelector(`canvas[canvas-id="${canvasId}"]`);
    try {
        const dataURL = canvas === null || canvas === void 0 ? void 0 : canvas.toDataURL(`image/${fileType || 'png'}`, quality);
        return handle.success({
            tempFilePath: dataURL
        });
    }
    catch (e) {
        return handle.fail({
            errMsg: e.message
        });
    }
};

/**
 * ??????????????????????????????????????????????????????????????????????????????????????????????????? this????????????????????? <canvas> ??????
 * @todo ??????????????????????????????
 */
const canvasPutImageData = ({ canvasId, data, x, y, success, fail, complete }, inst) => {
    const handle = new MethodHandler({ name: 'canvasPutImageData', success, fail, complete });
    const el = findDOM(inst);
    const canvas = el === null || el === void 0 ? void 0 : el.querySelector(`canvas[canvas-id="${canvasId}"]`);
    try {
        const ctx = canvas.getContext('2d');
        // TODO Uint8ClampedArray => ImageData
        ctx === null || ctx === void 0 ? void 0 : ctx.putImageData(data, x, y);
        return handle.success();
    }
    catch (e) {
        return handle.fail({
            errMsg: e.message
        });
    }
};

/**
 * ?????? canvas ??????????????????????????????
 */
const canvasGetImageData = ({ canvasId, success, fail, complete, x, y, width, height }, inst) => {
    const handle = new MethodHandler({ name: 'canvasGetImageData', success, fail, complete });
    const el = findDOM(inst);
    const canvas = el === null || el === void 0 ? void 0 : el.querySelector(`canvas[canvas-id="${canvasId}"]`);
    try {
        const ctx = canvas === null || canvas === void 0 ? void 0 : canvas.getContext('2d');
        // TODO ImageData => Uint8ClampedArray
        const data = ctx === null || ctx === void 0 ? void 0 : ctx.getImageData(x, y, width, height);
        return handle.success({
            width,
            height,
            data
        });
    }
    catch (e) {
        return handle.fail({
            errMsg: e.message
        });
    }
};

// ??????
/** ???????????? canvas ?????? */
const createOffscreenCanvas = temporarilyNotSupport('createOffscreenCanvas');

class cloud {
    constructor() {
        this.init = temporarilyNotSupport('cloud.init');
        this.CloudID = temporarilyNotSupport('cloud.CloudID');
        // @ts-ignore
        this.callFunction = temporarilyNotSupport('cloud.callFunction');
        // @ts-ignore
        this.uploadFile = temporarilyNotSupport('cloud.uploadFile');
        // @ts-ignore
        this.downloadFile = temporarilyNotSupport('cloud.downloadFile');
        // @ts-ignore
        this.getTempFileURL = temporarilyNotSupport('cloud.getTempFileURL');
        // @ts-ignore
        this.deleteFile = temporarilyNotSupport('cloud.deleteFile');
        // @ts-ignore
        this.database = temporarilyNotSupport('cloud.database');
        // @ts-ignore
        this.callContainer = temporarilyNotSupport('cloud.callContainer');
    }
}

const reportMonitor = temporarilyNotSupport('reportMonitor');
const reportAnalytics = temporarilyNotSupport('reportAnalytics');
const reportEvent = temporarilyNotSupport('reportEvent');
const getExptInfoSync = temporarilyNotSupport('getExptInfoSync');

const callbackManager$3 = new CallbackManager();
let devicemotionListener;
/**
 * ??????????????????????????????
 */
const stopAccelerometer = ({ success, fail, complete } = {}) => {
    const res = {};
    const handle = new MethodHandler({ name: 'stopAccelerometer', success, fail, complete });
    try {
        window.removeEventListener('devicemotion', devicemotionListener, true);
        return handle.success(res);
    }
    catch (e) {
        res.errMsg = e.message;
        return handle.fail(res);
    }
};
const INTERVAL_MAP$1 = {
    game: {
        interval: 20,
        frequency: 50
    },
    ui: {
        interval: 60,
        frequency: 16.67
    },
    normal: {
        interval: 200,
        frequency: 5
    }
};
const getDevicemotionListener = interval => {
    let lock;
    let timer;
    return evt => {
        if (lock)
            return;
        lock = true;
        timer && clearTimeout(timer);
        callbackManager$3.trigger({
            x: evt.acceleration.x || 0,
            y: evt.acceleration.y || 0,
            z: evt.acceleration.z || 0
        });
        timer = setTimeout(() => { lock = false; }, interval);
    };
};
/**
 * ??????????????????????????????
 */
const startAccelerometer = ({ interval = 'normal', success, fail, complete } = {}) => {
    const handle = new MethodHandler({ name: 'startAccelerometer', success, fail, complete });
    try {
        if (window.DeviceMotionEvent) {
            const intervalObj = INTERVAL_MAP$1[interval];
            if (devicemotionListener) {
                stopAccelerometer();
            }
            devicemotionListener = getDevicemotionListener(intervalObj.interval);
            window.addEventListener('devicemotion', devicemotionListener, true);
        }
        else {
            throw new Error('accelerometer is not supported');
        }
        return handle.success();
    }
    catch (e) {
        return handle.fail({ errMsg: e.message });
    }
};
/**
 * ?????????????????????????????????????????? Taro.startAccelerometer() ??? interval ?????????????????? Taro.stopAccelerometer() ???????????????
 */
const onAccelerometerChange = callback => {
    callbackManager$3.add(callback);
};
/**
 * ?????????????????????????????????????????????????????????????????????????????????
 */
const offAccelerometerChange = callback => {
    callbackManager$3.remove(callback);
};

// ?????????
const checkIsOpenAccessibility = temporarilyNotSupport('checkIsOpenAccessibility');

// ??????
const getBatteryInfoSync = temporarilyNotSupport('getBatteryInfoSync');
const getBatteryInfo = async ({ success, fail, complete } = {}) => {
    var _a;
    const handle = new MethodHandler({ name: 'getBatteryInfo', success, fail, complete });
    try {
        // @ts-ignore
        const battery = await ((_a = navigator.getBattery) === null || _a === void 0 ? void 0 : _a.call(navigator));
        return handle.success({
            isCharging: battery.charging,
            level: Number(battery.level || 0) * 100
        });
    }
    catch (error) {
        return handle.fail({
            errMsg: (error === null || error === void 0 ? void 0 : error.message) || error
        });
    }
};

// ??????-??????
const stopBluetoothDevicesDiscovery = temporarilyNotSupport('stopBluetoothDevicesDiscovery');
const startBluetoothDevicesDiscovery = temporarilyNotSupport('startBluetoothDevicesDiscovery');
const openBluetoothAdapter = temporarilyNotSupport('openBluetoothAdapter');
const onBluetoothDeviceFound = temporarilyNotSupport('onBluetoothDeviceFound');
const onBluetoothAdapterStateChange = temporarilyNotSupport('onBluetoothAdapterStateChange');
const offBluetoothDeviceFound = temporarilyNotSupport('offBluetoothDeviceFound');
const offBluetoothAdapterStateChange = temporarilyNotSupport('offBluetoothAdapterStateChange');
const makeBluetoothPair = temporarilyNotSupport('makeBluetoothPair');
const isBluetoothDevicePaired = temporarilyNotSupport('isBluetoothDevicePaired');
const getConnectedBluetoothDevices = temporarilyNotSupport('getConnectedBluetoothDevices');
const getBluetoothDevices = temporarilyNotSupport('getBluetoothDevices');
const getBluetoothAdapterState = temporarilyNotSupport('getBluetoothAdapterState');
const closeBluetoothAdapter = temporarilyNotSupport('closeBluetoothAdapter');

// ??????-?????????????????????
const writeBLECharacteristicValue = temporarilyNotSupport('writeBLECharacteristicValue');
const setBLEMTU = temporarilyNotSupport('setBLEMTU');
const readBLECharacteristicValue = temporarilyNotSupport('readBLECharacteristicValue');
const onBLEMTUChange = temporarilyNotSupport('onBLEMTUChange');
const onBLEConnectionStateChange = temporarilyNotSupport('onBLEConnectionStateChange');
const onBLECharacteristicValueChange = temporarilyNotSupport('onBLECharacteristicValueChange');
const offBLEMTUChange = temporarilyNotSupport('offBLEMTUChange');
const offBLEConnectionStateChange = temporarilyNotSupport('offBLEConnectionStateChange');
const offBLECharacteristicValueChange = temporarilyNotSupport('offBLECharacteristicValueChange');
const notifyBLECharacteristicValueChange = temporarilyNotSupport('notifyBLECharacteristicValueChange');
const getBLEMTU = temporarilyNotSupport('getBLEMTU');
const getBLEDeviceServices = temporarilyNotSupport('getBLEDeviceServices');
const getBLEDeviceRSSI = temporarilyNotSupport('getBLEDeviceRSSI');
const getBLEDeviceCharacteristics = temporarilyNotSupport('getBLEDeviceCharacteristics');
const createBLEConnection = temporarilyNotSupport('createBLEConnection');
const closeBLEConnection = temporarilyNotSupport('closeBLEConnection');

// ??????-?????????????????????
const onBLEPeripheralConnectionStateChanged = temporarilyNotSupport('onBLEPeripheralConnectionStateChanged');
const offBLEPeripheralConnectionStateChanged = temporarilyNotSupport('offBLEPeripheralConnectionStateChanged');
const createBLEPeripheralServer = temporarilyNotSupport('createBLEPeripheralServer');

// ??????
const addPhoneRepeatCalendar = temporarilyNotSupport('addPhoneRepeatCalendar');
const addPhoneCalendar = temporarilyNotSupport('addPhoneCalendar');

// ???????????????
const setBackgroundFetchToken = temporarilyNotSupport('setBackgroundFetchToken');
const onBackgroundFetchData = temporarilyNotSupport('onBackgroundFetchData');
const getBackgroundFetchToken = temporarilyNotSupport('getBackgroundFetchToken');
const getBackgroundFetchData = temporarilyNotSupport('getBackgroundFetchData');

function getItem(key) {
    let item;
    try {
        item = JSON.parse(localStorage.getItem(key) || '');
    }
    catch (e) { }
    // ??????????????? Taro.setStorage API ???????????????
    if (item && typeof item === 'object' && item.hasOwnProperty('data')) {
        return { result: true, data: item.data };
    }
    else {
        return { result: false };
    }
}
// ????????????
const setStorageSync = (key, data = '') => {
    if (typeof key !== 'string') {
        console.error(getParameterError({
            name: 'setStorage',
            correct: 'String',
            wrong: key
        }));
        return;
    }
    const type = typeof data;
    let obj = {};
    if (type === 'symbol') {
        obj = { data: '' };
    }
    else {
        obj = { data };
    }
    localStorage.setItem(key, JSON.stringify(obj));
};
const setStorage = (options) => {
    // options must be an Object
    const isObject = shouldBeObject(options);
    if (!isObject.flag) {
        const res = { errMsg: `setStorage:fail ${isObject.msg}` };
        console.error(res.errMsg);
        return Promise.reject(res);
    }
    const { key, data, success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'setStorage', success, fail, complete });
    if (typeof key !== 'string') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'key',
                correct: 'String',
                wrong: key
            })
        });
    }
    setStorageSync(key, data);
    return handle.success();
};
const revokeBufferURL = temporarilyNotSupport('revokeBufferURL');
const removeStorageSync = (key) => {
    if (typeof key !== 'string') {
        console.error(getParameterError({
            name: 'removeStorage',
            correct: 'String',
            wrong: key
        }));
        return;
    }
    localStorage.removeItem(key);
};
const removeStorage = (options) => {
    // options must be an Object
    const isObject = shouldBeObject(options);
    if (!isObject.flag) {
        const res = { errMsg: `removeStorage:fail ${isObject.msg}` };
        console.error(res.errMsg);
        return Promise.reject(res);
    }
    const { key, success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'removeStorage', success, fail, complete });
    if (typeof key !== 'string') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'key',
                correct: 'String',
                wrong: key
            })
        });
    }
    removeStorageSync(key);
    return handle.success();
};
const getStorageSync = (key) => {
    if (typeof key !== 'string') {
        console.error(getParameterError({
            name: 'getStorageSync',
            correct: 'String',
            wrong: key
        }));
        return;
    }
    const res = getItem(key);
    if (res.result)
        return res.data;
    return '';
};
const getStorageInfoSync = () => {
    const res = {
        keys: Object.keys(localStorage),
        limitSize: NaN,
        currentSize: NaN
    };
    return res;
};
const getStorageInfo = ({ success, fail, complete } = {}) => {
    const handle = new MethodHandler({ name: 'getStorageInfo', success, fail, complete });
    return handle.success(getStorageInfoSync());
};
const getStorage = (options) => {
    // options must be an Object
    const isObject = shouldBeObject(options);
    if (!isObject.flag) {
        const res = { errMsg: `getStorage:fail ${isObject.msg}` };
        console.error(res.errMsg);
        return Promise.reject(res);
    }
    const { key, success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'getStorage', success, fail, complete });
    if (typeof key !== 'string') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'key',
                correct: 'String',
                wrong: key
            })
        });
    }
    const { result, data } = getItem(key);
    if (result) {
        return handle.success({ data });
    }
    else {
        return handle.fail({
            errMsg: 'data not found'
        });
    }
};
const createBufferURL = temporarilyNotSupport('createBufferURL');
const clearStorageSync = () => {
    localStorage.clear();
};
const clearStorage = ({ success, fail, complete } = {}) => {
    const handle = new MethodHandler({ name: 'clearStorage', success, fail, complete });
    clearStorageSync();
    return handle.success();
};

/**
 * ??????????????????api?????????Chameleon??????????????????
 *
 * setClipboardData: https://github.com/chameleon-team/chameleon-api/tree/master/src/interfaces/setClipBoardData
 * getClipboardData: https://github.com/chameleon-team/chameleon-api/tree/master/src/interfaces/getClipBoardData
 */
const CLIPBOARD_STORAGE_NAME = 'taro_clipboard';
document.addEventListener('copy', () => {
    var _a;
    setStorage({
        key: CLIPBOARD_STORAGE_NAME,
        data: (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.toString()
    }).catch(e => {
        console.error(e);
    });
});
/**
 * ??????????????????????????????
 */
const setClipboardData = async ({ data, success, fail, complete }) => {
    const handle = new MethodHandler({ name: 'setClipboardData', success, fail, complete });
    try {
        setStorageSync(CLIPBOARD_STORAGE_NAME, data);
        /**
         * ?????? iPhone 6s Plus iOS 13.1.3 ?????? Safari ????????????
         * iOS < 10 ??????????????????????????????????????????????????????????????????
         * https://stackoverflow.com/questions/34045777/copy-to-clipboard-using-javascript-in-ios/34046084
         */
        if (typeof document.execCommand === 'function') {
            const textarea = document.createElement('textarea');
            textarea.readOnly = true;
            textarea.value = data;
            textarea.style.position = 'absolute';
            textarea.style.width = '100px';
            textarea.style.left = '-10000px';
            document.body.appendChild(textarea);
            textarea.select();
            textarea.setSelectionRange(0, textarea.value.length);
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        else {
            throw new Error('Unsupported Function: \'document.execCommand\'.');
        }
        return handle.success();
    }
    catch (e) {
        return handle.fail({ errMsg: e.message });
    }
};
/**
 * ??????????????????????????????
 */
const getClipboardData = async ({ success, fail, complete } = {}) => {
    const handle = new MethodHandler({ name: 'getClipboardData', success, fail, complete });
    try {
        const data = getStorageSync(CLIPBOARD_STORAGE_NAME);
        return handle.success({ data });
    }
    catch (e) {
        return handle.fail({ errMsg: e.message });
    }
};

const callbackManager$2 = new CallbackManager();
let compassListener;
/**
 * ????????????????????????
 */
const stopCompass = ({ success, fail, complete } = {}) => {
    const handle = new MethodHandler({ name: 'stopCompass', success, fail, complete });
    try {
        window.removeEventListener('deviceorientation', compassListener, true);
        return handle.success();
    }
    catch (e) {
        return handle.fail({ errMsg: e.message });
    }
};
const getDeviceOrientationListener$1 = interval => {
    let lock;
    let timer;
    return evt => {
        if (lock)
            return;
        lock = true;
        timer && clearTimeout(timer);
        callbackManager$2.trigger({
            direction: 360 - evt.alpha
        });
        timer = setTimeout(() => { lock = false; }, interval);
    };
};
/**
 * ????????????????????????
 */
const startCompass = ({ success, fail, complete } = {}) => {
    const handle = new MethodHandler({ name: 'startCompass', success, fail, complete });
    try {
        if (window.DeviceOrientationEvent) {
            if (compassListener) {
                stopCompass();
            }
            compassListener = getDeviceOrientationListener$1(200);
            window.addEventListener('deviceorientation', compassListener, true);
        }
        else {
            throw new Error('compass is not supported');
        }
        return handle.success();
    }
    catch (e) {
        return handle.fail({ errMsg: e.message });
    }
};
/**
 * ??????????????????????????????????????????5 ???/?????????????????????????????????????????????????????? wx.stopCompass ???????????????
 */
const onCompassChange = callback => {
    callbackManager$2.add(callback);
};
/**
 * ???????????????????????????????????????????????????????????????????????????????????????
 */
const offCompassChange = callback => {
    callbackManager$2.remove(callback);
};

// ?????????
const chooseContact = temporarilyNotSupport('chooseContact');
const addPhoneContact = temporarilyNotSupport('addPhoneContact');

// ??????
const getRandomValues = temporarilyNotSupport('getRandomValues');

// ?????????
const stopGyroscope = temporarilyNotSupport('stopGyroscope');
const startGyroscope = temporarilyNotSupport('startGyroscope');
const onGyroscopeChange = temporarilyNotSupport('onGyroscopeChange');
const offGyroscopeChange = temporarilyNotSupport('offGyroscopeChange');

// ??????-??????(Beacon)
const stopBeaconDiscovery = temporarilyNotSupport('stopBeaconDiscovery');
const startBeaconDiscovery = temporarilyNotSupport('startBeaconDiscovery');
const onBeaconUpdate = temporarilyNotSupport('onBeaconUpdate');
const onBeaconServiceChange = temporarilyNotSupport('onBeaconServiceChange');
const offBeaconUpdate = temporarilyNotSupport('offBeaconUpdate');
const offBeaconServiceChange = temporarilyNotSupport('offBeaconServiceChange');
const getBeacons = temporarilyNotSupport('getBeacons');

// ??????
const onKeyboardHeightChange = temporarilyNotSupport('onKeyboardHeightChange');
const offKeyboardHeightChange = temporarilyNotSupport('offKeyboardHeightChange');
const hideKeyboard = temporarilyNotSupport('hideKeyboard');
const getSelectedTextRange = temporarilyNotSupport('getSelectedTextRange');

// ??????
const onMemoryWarning = temporarilyNotSupport('onMemoryWarning');
const offMemoryWarning = temporarilyNotSupport('offMemoryWarning');

const callbackManager$1 = new CallbackManager();
let deviceMotionListener;
const INTERVAL_MAP = {
    game: {
        interval: 20,
        frequency: 50
    },
    ui: {
        interval: 60,
        frequency: 16.67
    },
    normal: {
        interval: 200,
        frequency: 5
    }
};
/**
 * ????????????????????????????????????
 */
const stopDeviceMotionListening = ({ success, fail, complete } = {}) => {
    const handle = new MethodHandler({ name: 'stopDeviceMotionListening', success, fail, complete });
    try {
        window.removeEventListener('deviceorientation', deviceMotionListener, true);
        return handle.success();
    }
    catch (e) {
        return handle.fail({ errMsg: e.message });
    }
};
const getDeviceOrientationListener = interval => {
    let lock;
    let timer;
    return evt => {
        if (lock)
            return;
        lock = true;
        timer && clearTimeout(timer);
        callbackManager$1.trigger({
            alpha: evt.alpha,
            beta: evt.beta,
            gamma: evt.gamma
        });
        timer = setTimeout(() => { lock = false; }, interval);
    };
};
/**
 * ????????????????????????????????????
 */
const startDeviceMotionListening = ({ interval = 'normal', success, fail, complete } = {}) => {
    const handle = new MethodHandler({ name: 'startDeviceMotionListening', success, fail, complete });
    try {
        const intervalObj = INTERVAL_MAP[interval];
        if (window.DeviceOrientationEvent) {
            if (deviceMotionListener) {
                stopDeviceMotionListening();
            }
            deviceMotionListener = getDeviceOrientationListener(intervalObj.interval);
            window.addEventListener('deviceorientation', deviceMotionListener, true);
        }
        else {
            throw new Error('deviceMotion is not supported');
        }
        return handle.success();
    }
    catch (e) {
        return handle.fail({ errMsg: e.message });
    }
};
/**
 * ?????????????????????????????????
 */
const onDeviceMotionChange = callback => {
    callbackManager$1.add(callback);
};
/**
 * ???????????????????????????????????????????????????????????????????????????????????????
 */
const offDeviceMotionChange = callback => {
    callbackManager$1.remove(callback);
};

function getConnection() {
    // @ts-ignore
    return navigator.connection || navigator.mozConnection || navigator.webkitConnection || navigator.msConnection;
}
const getNetworkType = (options = {}) => {
    const connection = getConnection();
    const { success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'getNetworkType', success, fail, complete });
    let networkType = 'unknown';
    // ????????????????????????????????????
    if (!connection) {
        return handle.success({ networkType });
    }
    // Supports only the navigator.connection.type value which doesn't match the latest spec.
    // https://www.davidbcalhoun.com/2010/using-navigator-connection-android/
    if (!isNaN(Number(connection.type))) {
        switch (connection.type) {
            // @ts-ignore
            case connection.WIFI:
                networkType = 'wifi';
                break;
            // @ts-ignore
            case connection.CELL_3G:
                networkType = '3g';
                break;
            // @ts-ignore
            case connection.CELL_2G:
                networkType = '2g';
                break;
            default:
                // ETHERNET, UNKNOWN
                networkType = 'unknown';
        }
    }
    else if (connection.type) {
        // @ts-ignore
        networkType = connection.type; // Only supports the type value.
        // @ts-ignore
    }
    else if (connection.effectiveType) {
        // @ts-ignore
        networkType = connection.effectiveType;
    }
    return handle.success({ networkType });
};
const networkStatusManager = new CallbackManager();
const networkStatusListener = async () => {
    const { networkType } = await getNetworkType();
    const isConnected = networkType !== 'none';
    const obj = { isConnected, networkType };
    networkStatusManager.trigger(obj);
};
/**
 * ?????????????????????????????????, ????????????????????????????????????????????????
 * - ??????????????????????????????
 * - ???????????? rtt ?????? 400
 * - ???????????????????????????
 * > ???????????????????????????: ?????????????????????????????????, ??????????????? 30s ????????????????????????
 */
const onNetworkWeakChange = temporarilyNotSupport('onNetworkWeakChange');
const onNetworkStatusChange = callback => {
    networkStatusManager.add(callback);
    const connection = getConnection();
    if (connection && networkStatusManager.count() === 1) {
        connection.addEventListener('change', networkStatusListener);
    }
};
const offNetworkWeakChange = temporarilyNotSupport('offNetworkStatusChange');
const offNetworkStatusChange = callback => {
    networkStatusManager.remove(callback);
    const connection = getConnection();
    if (connection && networkStatusManager.count() === 0) {
        connection.removeEventListener('change', networkStatusListener);
    }
};
const getLocalIPAddress = temporarilyNotSupport('getLocalIPAddress');

// NFC
const stopHCE = temporarilyNotSupport('stopHCE');
const startHCE = temporarilyNotSupport('startHCE');
const sendHCEMessage = temporarilyNotSupport('sendHCEMessage');
const onHCEMessage = temporarilyNotSupport('onHCEMessage');
const offHCEMessage = temporarilyNotSupport('offHCEMessage');
const getNFCAdapter = temporarilyNotSupport('getNFCAdapter');
const getHCEState = temporarilyNotSupport('getHCEState');

const makePhoneCall = (options) => {
    // options must be an Object
    const isObject = shouldBeObject(options);
    if (!isObject.flag) {
        const res = { errMsg: `makePhoneCall:fail ${isObject.msg}` };
        console.error(res.errMsg);
        return Promise.reject(res);
    }
    const { phoneNumber, success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'makePhoneCall', success, fail, complete });
    if (typeof phoneNumber !== 'string') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'phoneNumber',
                correct: 'String',
                wrong: phoneNumber
            })
        });
    }
    window.location.href = `tel:${phoneNumber}`;
    return handle.success();
};

// ??????
const scanCode = processOpenApi('scanQRCode', { needResult: 1 }, res => ({
    errMsg: res.errMsg === 'scanQRCode:ok' ? 'scanCode:ok' : res.errMsg,
    result: res.resultStr
}));

// ??????
const setVisualEffectOnCapture = temporarilyNotSupport('setVisualEffectOnCapture');
const setScreenBrightness = temporarilyNotSupport('setScreenBrightness');
const setKeepScreenOn = temporarilyNotSupport('setKeepScreenOn');
const onUserCaptureScreen = temporarilyNotSupport('onUserCaptureScreen');
const offUserCaptureScreen = temporarilyNotSupport('offUserCaptureScreen');
const getScreenBrightness = temporarilyNotSupport('getScreenBrightness');

const vibrator = function vibrator(mm) {
    try {
        return window.navigator.vibrate(mm);
    }
    catch (e) {
        console.warn('????????????????????????vibrate');
    }
};
/**
 * ???????????????????????????????????????15 ms???????????? iPhone 7 / 7 Plus ????????? Android ????????????
 */
const vibrateShort = ({ success, fail, complete } = {}) => {
    const handle = new MethodHandler({ name: 'vibrateShort', success, fail, complete });
    if (vibrator) {
        vibrator(15);
        return handle.success();
    }
    else {
        return handle.fail();
    }
};
/**
 * ???????????????????????????????????????400 ms)
 */
const vibrateLong = ({ success, fail, complete } = {}) => {
    const handle = new MethodHandler({ name: 'vibrateLong', success, fail, complete });
    if (vibrator) {
        vibrator(400);
        return handle.success();
    }
    else {
        return handle.fail();
    }
};

// Wi-Fi
const stopWifi = temporarilyNotSupport('stopWifi');
const startWifi = temporarilyNotSupport('startWifi');
const setWifiList = temporarilyNotSupport('setWifiList');
const onWifiConnectedWithPartialInfo = temporarilyNotSupport('onWifiConnectedWithPartialInfo');
const onWifiConnected = temporarilyNotSupport('onWifiConnected');
const onGetWifiList = temporarilyNotSupport('onGetWifiList');
const offWifiConnected = temporarilyNotSupport('offWifiConnected');
const offGetWifiList = temporarilyNotSupport('offGetWifiList');
const getWifiList = temporarilyNotSupport('getWifiList');
const getConnectedWifi = temporarilyNotSupport('getConnectedWifi');
const connectWifi = temporarilyNotSupport('connectWifi');

// ???????????????
const getExtConfigSync = temporarilyNotSupport('getExtConfigSync');
const getExtConfig = temporarilyNotSupport('getExtConfig');

// ??????
const saveFileToDisk = temporarilyNotSupport('saveFileToDisk');
const saveFile = temporarilyNotSupport('saveFile');
const removeSavedFile = temporarilyNotSupport('removeSavedFile');
const openDocument = temporarilyNotSupport('openDocument');
const getSavedFileList = temporarilyNotSupport('getSavedFileList');
const getSavedFileInfo = temporarilyNotSupport('getSavedFileInfo');
const getFileSystemManager = temporarilyNotSupport('getFileSystemManager');
const getFileInfo = temporarilyNotSupport('getFileInfo');

const getApp = function () {
    return Taro__default['default'].getCurrentInstance().app;
};
// ???????????????
const getCurrentInstance = Taro__default['default'].getCurrentInstance;

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".taro_choose_location {\r\n  position: fixed;\r\n  display: flex;\r\n  flex-direction: column;\r\n  width: 100%;\r\n  height: 100%;\r\n  top: 100%;\r\n  background-color: #fff;\r\n  transition: ease top .3s;\r\n  z-index: 1;\r\n}\r\n\r\n.taro_choose_location_bar {\r\n  display: flex;\r\n  flex: 0 95px;\r\n  height: 95px;\r\n  background-color: #ededed;\r\n  color: #090909;\r\n}\r\n\r\n.taro_choose_location_back {\r\n  flex: 0 45px;\r\n  position: relative;\r\n  width: 33px;\r\n  height: 30px;\r\n  margin-top: 30px;\r\n}\r\n\r\n.taro_choose_location_back::before {\r\n  content: '';\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  display: block;\r\n  width: 0;\r\n  height: 0;\r\n  border: solid 15px;\r\n  border-top-color: transparent;\r\n  border-right-color: #090909;\r\n  border-bottom-color: transparent;\r\n  border-left-color: transparent;\r\n}\r\n\r\n.taro_choose_location_back::after {\r\n  content: '';\r\n  position: absolute;\r\n  display: block;\r\n  width: 0;\r\n  height: 0;\r\n  top: 0;\r\n  left: 3px;\r\n  border: solid 15px;\r\n  border-top-color: transparent;\r\n  border-right-color: #ededed;\r\n  border-bottom-color: transparent;\r\n  border-left-color: transparent;\r\n}\r\n\r\n.taro_choose_location_title {\r\n  flex: 1;\r\n  line-height: 95px;\r\n  padding-left: 30px;\r\n}\r\n\r\n.taro_choose_location_submit {\r\n  width: 110px;\r\n  height: 60px;\r\n  color: #fff;\r\n  background-color: #08bf62;\r\n  border: none;\r\n  font-size: 28px;\r\n  line-height: 60px;\r\n  padding: 0;\r\n  margin: 18px 30px 0 0;\r\n}\r\n\r\n.taro_choose_location_frame {\r\n  flex: 1;\r\n}";
var stylesheet=".taro_choose_location {\r\n  position: fixed;\r\n  display: flex;\r\n  flex-direction: column;\r\n  width: 100%;\r\n  height: 100%;\r\n  top: 100%;\r\n  background-color: #fff;\r\n  transition: ease top .3s;\r\n  z-index: 1;\r\n}\r\n\r\n.taro_choose_location_bar {\r\n  display: flex;\r\n  flex: 0 95px;\r\n  height: 95px;\r\n  background-color: #ededed;\r\n  color: #090909;\r\n}\r\n\r\n.taro_choose_location_back {\r\n  flex: 0 45px;\r\n  position: relative;\r\n  width: 33px;\r\n  height: 30px;\r\n  margin-top: 30px;\r\n}\r\n\r\n.taro_choose_location_back::before {\r\n  content: '';\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  display: block;\r\n  width: 0;\r\n  height: 0;\r\n  border: solid 15px;\r\n  border-top-color: transparent;\r\n  border-right-color: #090909;\r\n  border-bottom-color: transparent;\r\n  border-left-color: transparent;\r\n}\r\n\r\n.taro_choose_location_back::after {\r\n  content: '';\r\n  position: absolute;\r\n  display: block;\r\n  width: 0;\r\n  height: 0;\r\n  top: 0;\r\n  left: 3px;\r\n  border: solid 15px;\r\n  border-top-color: transparent;\r\n  border-right-color: #ededed;\r\n  border-bottom-color: transparent;\r\n  border-left-color: transparent;\r\n}\r\n\r\n.taro_choose_location_title {\r\n  flex: 1;\r\n  line-height: 95px;\r\n  padding-left: 30px;\r\n}\r\n\r\n.taro_choose_location_submit {\r\n  width: 110px;\r\n  height: 60px;\r\n  color: #fff;\r\n  background-color: #08bf62;\r\n  border: none;\r\n  font-size: 28px;\r\n  line-height: 60px;\r\n  padding: 0;\r\n  margin: 18px 30px 0 0;\r\n}\r\n\r\n.taro_choose_location_frame {\r\n  flex: 1;\r\n}";
styleInject(css_248z,{"insertAt":"top"});

function createLocationChooser(handler, key = LOCATION_APIKEY) {
    var _a, _b;
    const html = `
<div class='taro_choose_location'>
  <div class='taro_choose_location_bar'>
    <div class='taro_choose_location_back'></div>
    <p class='taro_choose_location_title'>??????</p>
    <button class='taro_choose_location_submit'>??????</button>
  </div>
  <iframe class='taro_choose_location_frame' frameborder='0' src='https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=${key}&referer=myapp'></iframe>
</div>
`;
    const container = document.createElement('div');
    container.innerHTML = html;
    const main = container.querySelector('.taro_choose_location');
    function show() {
        setTimeout(() => {
            main.style.top = '0';
        });
    }
    function hide() {
        main.style.top = '100%';
    }
    function back() {
        hide();
        handler({ errMsg: 'cancel' });
    }
    function submit() {
        hide();
        handler();
    }
    function remove() {
        container.remove();
        window.removeEventListener('popstate', back);
    }
    (_a = container.querySelector('.taro_choose_location_back')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', back);
    (_b = container.querySelector('.taro_choose_location_submit')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', submit);
    window.addEventListener('popstate', back);
    return {
        show,
        remove,
        container
    };
}
/**
 * ???????????????????????????
 */
const chooseLocation = ({ success, fail, complete } = {}) => {
    const key = LOCATION_APIKEY;
    const handle = new MethodHandler({ name: 'chooseLocation', success, fail, complete });
    return new Promise((resolve, reject) => {
        const chooseLocation = {};
        if (!key) {
            console.warn('chooseLocation api ????????????????????????api???????????? defineConstants ????????? LOCATION_APIKEY');
            return handle.fail({
                errMsg: 'LOCATION_APIKEY needed'
            }, reject);
        }
        const onMessage = event => {
            // ???????????????????????????????????????????????????????????????????????????????????????????????????????????????
            const loc = event.data;
            // ???????????????????????????????????? post ?????????????????? module ?????????'locationPicker'
            if (!loc || loc.module !== 'locationPicker')
                return;
            chooseLocation.name = loc.poiname;
            chooseLocation.address = loc.poiaddress;
            chooseLocation.latitude = loc.latlng.lat;
            chooseLocation.longitude = loc.latlng.lng;
        };
        const chooser = createLocationChooser(res => {
            window.removeEventListener('message', onMessage, false);
            setTimeout(() => {
                chooser.remove();
            }, 300);
            if (res) {
                return handle.fail(res, reject);
            }
            else {
                if (chooseLocation.latitude && chooseLocation.longitude) {
                    return handle.success(chooseLocation, resolve);
                }
                else {
                    return handle.fail({}, reject);
                }
            }
        }, key);
        document.body.appendChild(chooser.container);
        window.addEventListener('message', onMessage, false);
        chooser.show();
    });
};

// ??????
const stopLocationUpdate = temporarilyNotSupport('stopLocationUpdate');
const startLocationUpdateBackground = temporarilyNotSupport('startLocationUpdateBackground');
const startLocationUpdate = temporarilyNotSupport('startLocationUpdate');
const openLocation = processOpenApi('openLocation', { scale: 18 });
const onLocationChangeError = temporarilyNotSupport('onLocationChangeError');
const onLocationChange = temporarilyNotSupport('onLocationChange');
const offLocationChangeError = temporarilyNotSupport('offLocationChangeError');
const offLocationChange = temporarilyNotSupport('offLocationChange');
const getLocation = processOpenApi('getLocation');
const choosePoi = temporarilyNotSupport('choosePoi');

class InnerAudioContext {
    constructor() {
        this.__startTime = 0;
        this.play = () => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.play(); };
        this.pause = () => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.pause(); };
        this.stop = () => {
            this.pause();
            this.seek(0);
            this.stopStack.trigger();
        };
        this.seek = (position) => {
            if (this.Instance) {
                this.Instance.currentTime = position;
            }
        };
        /**
         * @TODO destroy???????????????
         */
        this.destroy = () => {
            this.stop();
            if (this.Instance) {
                document.body.removeChild(this.Instance);
                this.Instance = undefined;
            }
        };
        this.onCanplay = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.addEventListener('canplay', callback); };
        this.onPlay = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.addEventListener('play', callback); };
        this.onPause = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.addEventListener('pause', callback); };
        this.onStop = (callback = () => { }) => this.stopStack.add(callback);
        this.onEnded = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.addEventListener('ended', callback); };
        this.onTimeUpdate = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.addEventListener('timeupdate', callback); };
        this.onError = (callback) => this.errorStack.add(callback);
        this.onWaiting = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.addEventListener('waiting', callback); };
        this.onSeeking = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.addEventListener('seeking', callback); };
        this.onSeeked = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.addEventListener('seeked', callback); };
        this.offCanplay = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.removeEventListener('canplay', callback); };
        this.offPlay = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.removeEventListener('play', callback); };
        this.offPause = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.removeEventListener('pause', callback); };
        this.offStop = (callback = () => { }) => this.stopStack.remove(callback);
        this.offEnded = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.removeEventListener('ended', callback); };
        this.offTimeUpdate = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.removeEventListener('timeupdate', callback); };
        this.offError = (callback = () => { }) => this.errorStack.remove(callback);
        this.offWaiting = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.removeEventListener('waiting', callback); };
        this.offSeeking = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.removeEventListener('seeking', callback); };
        this.offSeeked = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.removeEventListener('seeked', callback); };
        this.Instance = new Audio();
        this.errorStack = new CallbackManager();
        this.stopStack = new CallbackManager();
        Taro__default['default'].eventCenter.on('__taroRouterChange', () => { this.stop(); });
        this.onPlay(() => {
            if (this.currentTime !== this.startTime) {
                this.seek(this.startTime);
            }
        });
    }
    set autoplay(e) { this.setProperty('autoplay', e); }
    get autoplay() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.autoplay) || false; }
    get buffered() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.buffered.length) || 0; }
    get currentTime() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.currentTime) || 0; }
    get duration() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.duration) || 0; }
    set loop(e) { this.setProperty('loop', e); }
    get loop() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.loop) || false; }
    get paused() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.paused) || true; }
    set src(e) { this.setProperty('src', e); }
    get src() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.src) || ''; }
    set volume(e) { this.setProperty('volume', e); }
    get volume() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.volume) || 0; }
    set playbackRate(e) { this.setProperty('playbackRate', e); }
    get playbackRate() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.playbackRate) || 0; }
    set obeyMuteSwitch(_e) { permanentlyNotSupport('InnerAudioContext.obeyMuteSwitch')(); }
    get obeyMuteSwitch() { return true; }
    set startTime(e) { this.__startTime = e; }
    get startTime() { return this.__startTime || 0; }
    set referrerPolicy(e) { var _a; (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.setAttribute('referrerpolicy', e); }
    get referrerPolicy() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.getAttribute('referrerpolicy')) || 'origin'; }
    setProperty(key, value) {
        if (this.Instance) {
            this.Instance[key] = value;
        }
    }
}

// ??????
const stopVoice = temporarilyNotSupport('stopVoice');
const setInnerAudioOption = temporarilyNotSupport('setInnerAudioOption');
const playVoice = temporarilyNotSupport('playVoice');
const pauseVoice = temporarilyNotSupport('pauseVoice');
const getAvailableAudioSources = temporarilyNotSupport('getAvailableAudioSources');
const createWebAudioContext = temporarilyNotSupport('createWebAudioContext');
const createMediaAudioPlayer = temporarilyNotSupport('createMediaAudioPlayer');
/**
 * ???????????? audio ????????? InnerAudioContext ?????????
 */
const createInnerAudioContext = () => new InnerAudioContext();
const createAudioContext = temporarilyNotSupport('createAudioContext');

class BackgroundAudioManager {
    constructor() {
        this.__startTime = 0;
        this.play = () => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.play(); };
        this.pause = () => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.pause(); };
        this.seek = (position) => {
            if (this.Instance) {
                this.Instance.currentTime = position;
            }
        };
        this.stop = () => {
            this.pause();
            this.seek(0);
            this.stopStack.trigger();
        };
        this.onCanplay = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.addEventListener('canplay', callback); };
        this.onWaiting = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.addEventListener('waiting', callback); };
        this.onError = (callback) => this.errorStack.add(callback);
        this.onPlay = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.addEventListener('play', callback); };
        this.onPause = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.addEventListener('pause', callback); };
        this.onSeeking = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.addEventListener('seeking', callback); };
        this.onSeeked = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.addEventListener('seeked', callback); };
        this.onEnded = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.addEventListener('ended', callback); };
        this.onStop = (callback = () => { }) => this.stopStack.add(callback);
        this.onTimeUpdate = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.addEventListener('timeupdate', callback); };
        this.onPrev = permanentlyNotSupport('BackgroundAudioManager.onPrev');
        this.onNext = permanentlyNotSupport('BackgroundAudioManager.onNext');
        this.offCanplay = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.removeEventListener('canplay', callback); };
        this.offWaiting = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.removeEventListener('waiting', callback); };
        this.offError = (callback = () => { }) => this.errorStack.remove(callback);
        this.offPlay = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.removeEventListener('play', callback); };
        this.offPause = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.removeEventListener('pause', callback); };
        this.offSeeking = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.removeEventListener('seeking', callback); };
        this.offSeeked = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.removeEventListener('seeked', callback); };
        this.offEnded = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.removeEventListener('ended', callback); };
        this.offStop = (callback = () => { }) => this.stopStack.remove(callback);
        this.offTimeUpdate = (callback = () => { }) => { var _a; return (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.removeEventListener('timeupdate', callback); };
        this.offPrev = permanentlyNotSupport('BackgroundAudioManager.offPrev');
        this.offNext = permanentlyNotSupport('BackgroundAudioManager.offNext');
        this.Instance = new Audio();
        this.errorStack = new CallbackManager();
        this.stopStack = new CallbackManager();
        this.Instance.autoplay = true;
        this.onPlay(() => {
            if (this.currentTime !== this.startTime) {
                this.seek(this.startTime);
            }
        });
    }
    set src(e) { this.setProperty('src', e); }
    get src() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.src) || ''; }
    set startTime(e) { this.__startTime = e; }
    get startTime() { return this.__startTime || 0; }
    set title(e) { this.dataset('title', e); }
    get title() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.dataset.title) || ''; }
    set epname(e) { this.dataset('epname', e); }
    get epname() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.dataset.epname) || ''; }
    set singer(e) { this.dataset('singer', e); }
    get singer() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.dataset.singer) || ''; }
    set coverImgUrl(e) { this.dataset('coverImgUrl', e); }
    get coverImgUrl() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.dataset.coverImgUrl) || ''; }
    set webUrl(e) { this.dataset('webUrl', e); }
    get webUrl() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.dataset.webUrl) || ''; }
    set protocol(e) { this.dataset('protocol', e); }
    get protocol() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.dataset.protocol) || ''; }
    set playbackRate(e) { this.setProperty('playbackRate', e); }
    get playbackRate() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.playbackRate) || 0; }
    get duration() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.duration) || 0; }
    get currentTime() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.currentTime) || 0; }
    get paused() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.paused) || false; }
    get buffered() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.buffered.length) || 0; }
    set referrerPolicy(e) { var _a; (_a = this.Instance) === null || _a === void 0 ? void 0 : _a.setAttribute('referrerpolicy', e); }
    get referrerPolicy() { var _a; return ((_a = this.Instance) === null || _a === void 0 ? void 0 : _a.getAttribute('referrerpolicy')) || 'origin'; }
    setProperty(key, value) {
        if (this.Instance) {
            this.Instance[key] = value;
        }
    }
    dataset(key, value) {
        if (this.Instance) {
            this.Instance.dataset[key] = value;
        }
    }
}

// ????????????
const stopBackgroundAudio = temporarilyNotSupport('stopBackgroundAudio');
const seekBackgroundAudio = temporarilyNotSupport('seekBackgroundAudio');
const playBackgroundAudio = temporarilyNotSupport('playBackgroundAudio');
const pauseBackgroundAudio = temporarilyNotSupport('pauseBackgroundAudio');
const onBackgroundAudioStop = temporarilyNotSupport('onBackgroundAudioStop');
const onBackgroundAudioPlay = temporarilyNotSupport('onBackgroundAudioPlay');
const onBackgroundAudioPause = temporarilyNotSupport('onBackgroundAudioPause');
const getBackgroundAudioPlayerState = temporarilyNotSupport('getBackgroundAudioPlayerState');
/**
 * ??????????????????????????????????????????
 */
const getBackgroundAudioManager = () => new BackgroundAudioManager();

// ??????
const createCameraContext = temporarilyNotSupport('createCameraContext');

/**
 * previewImage api???????????????React??????[react-wx-images-viewer](https://github.com/react-ld/react-wx-images-viewer)??????????????????
 */
/**
 * ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
 */
const previewImage = async (options) => {
    function loadImage(url, loadFail) {
        return new Promise((resolve) => {
            const item = document.createElement('taro-swiper-item-core');
            item.style.cssText = 'display:flex;align-items:start;justify-content:center;overflow-y:scroll;';
            const image = new Image();
            image.style.maxWidth = '100%';
            image.src = url;
            const div = document.createElement('div');
            div.style.cssText = 'display:flex;align-items:center;justify-content:center;max-width:100%;min-height:100%;';
            div.appendChild(image);
            item.appendChild(div);
            // Note: ?????????????????????????????????????????????????????????
            resolve(item);
            if (typeof loadFail === 'function') {
                image.addEventListener('error', (err) => {
                    loadFail({ errMsg: err.message });
                });
            }
        });
    }
    // options must be an Object
    const isObject = shouldBeObject(options);
    if (!isObject.flag) {
        const res = { errMsg: `previewImage:fail ${isObject.msg}` };
        console.error(res.errMsg);
        return Promise.reject(res);
    }
    const { urls = [], current = '', success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'previewImage', success, fail, complete });
    const container = document.createElement('div');
    container.classList.add('preview-image');
    container.style.cssText = 'position:fixed;top:0;left:0;z-index:1050;width:100%;height:100%;overflow:hidden;outline:0;background-color:#111;';
    container.addEventListener('click', () => {
        container.remove();
    });
    const swiper = document.createElement('taro-swiper-core');
    // @ts-ignore
    swiper.full = true;
    let children = [];
    try {
        children = await Promise.all(urls.map(e => loadImage(e, fail)));
    }
    catch (error) {
        return handle.fail({
            errMsg: error
        });
    }
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        swiper.appendChild(child);
    }
    const currentIndex = urls.indexOf(current);
    // @ts-ignore
    swiper.current = currentIndex;
    container.appendChild(swiper);
    document.body.appendChild(container);
    return handle.success();
};

/**
 * ?????????????????????????????????????????????download?????????????????????
 */
const getImageInfo = (options) => {
    // options must be an Object
    const isObject = shouldBeObject(options);
    if (!isObject.flag) {
        const res = { errMsg: `getImageInfo:fail ${isObject.msg}` };
        console.error(res.errMsg);
        return Promise.reject(res);
    }
    const { src, success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'getImageInfo', success, fail, complete });
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            handle.success({
                width: image.naturalWidth,
                height: image.naturalHeight
            }, resolve);
        };
        image.onerror = (e) => {
            handle.fail({
                errMsg: e.message
            }, reject);
        };
        image.src = src;
    });
};

/**
 * ???????????????????????????????????????????????????
 */
const chooseImage = function (options) {
    // options must be an Object
    const isObject = shouldBeObject(options);
    if (!isObject.flag) {
        const res = { errMsg: `chooseImage:fail ${isObject.msg}` };
        console.error(res.errMsg);
        return Promise.reject(res);
    }
    const { count = 1, success, fail, complete, imageId = 'taroChooseImage' } = options;
    const handle = new MethodHandler({ name: 'chooseImage', success, fail, complete });
    const res = {
        tempFilePaths: [],
        tempFiles: []
    };
    if (count && typeof count !== 'number') {
        res.errMsg = getParameterError({
            para: 'count',
            correct: 'Number',
            wrong: count
        });
        return handle.fail(res);
    }
    let el = document.getElementById(imageId);
    if (!el) {
        const obj = document.createElement('input');
        obj.setAttribute('type', 'file');
        obj.setAttribute('id', imageId);
        if (count > 1) {
            obj.setAttribute('multiple', 'multiple');
        }
        obj.setAttribute('accept', 'image/*');
        obj.setAttribute('style', 'position: fixed; top: -4000px; left: -3000px; z-index: -300;');
        document.body.appendChild(obj);
        el = document.getElementById(imageId);
    }
    else {
        if (count > 1) {
            el.setAttribute('multiple', 'multiple');
        }
        else {
            el.removeAttribute('multiple');
        }
    }
    return new Promise(resolve => {
        const TaroMouseEvents = document.createEvent('MouseEvents');
        TaroMouseEvents.initEvent('click', true, true);
        if (el) {
            el.dispatchEvent(TaroMouseEvents);
            el.onchange = function (e) {
                const target = e.target;
                if (target) {
                    const files = target.files || [];
                    const arr = [...files];
                    arr && arr.forEach(item => {
                        var _a, _b;
                        const blob = new Blob([item], {
                            type: item.type
                        });
                        const url = URL.createObjectURL(blob);
                        (_a = res.tempFilePaths) === null || _a === void 0 ? void 0 : _a.push(url);
                        (_b = res.tempFiles) === null || _b === void 0 ? void 0 : _b.push({ path: url, size: item.size, type: item.type, originalFileObj: item });
                    });
                    handle.success(res, resolve);
                    target.value = '';
                }
            };
        }
    });
};

// ??????
const saveImageToPhotosAlbum = temporarilyNotSupport('saveImageToPhotosAlbum');
const previewMedia = temporarilyNotSupport('previewMedia');
const compressImage = temporarilyNotSupport('compressImage');
const chooseMessageFile = temporarilyNotSupport('chooseMessageFile');

// ???????????????
const createLivePusherContext = temporarilyNotSupport('createLivePusherContext');
const createLivePlayerContext = temporarilyNotSupport('createLivePlayerContext');

// ??????
const createMapContext = temporarilyNotSupport('createMapContext');

// ???????????????
const createMediaRecorder = temporarilyNotSupport('createMediaRecorder');

// ??????
const stopRecord = temporarilyNotSupport('stopRecord');
const startRecord = temporarilyNotSupport('startRecord');
const getRecorderManager = temporarilyNotSupport('getRecorderManager');

// ??????
const saveVideoToPhotosAlbum = temporarilyNotSupport('saveVideoToPhotosAlbum');
const openVideoEditor = temporarilyNotSupport('openVideoEditor');
const getVideoInfo = temporarilyNotSupport('getVideoInfo');
/**
 * ?????? video ????????? VideoContext ?????????
 */
const createVideoContext = (id, inst) => {
    const el = findDOM(inst);
    // TODO HTMLVideoElement to VideoContext
    return el === null || el === void 0 ? void 0 : el.querySelector(`taro-video-core[id=${id}]`);
};
const compressVideo = temporarilyNotSupport('compressVideo');
/**
 * ?????????????????????????????????????????????
 */
const chooseVideo = (options) => {
    // options must be an Object
    const isObject = shouldBeObject(options);
    if (!isObject.flag) {
        const res = { errMsg: `chooseVideo:fail ${isObject.msg}` };
        console.error(res.errMsg);
        return Promise.reject(res);
    }
    const { success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'chooseVideo', success, fail, complete });
    const res = {
        tempFilePath: '',
        duration: 0,
        size: 0,
        height: 0,
        width: 0
    };
    const inputEl = document.createElement('input');
    inputEl.setAttribute('type', 'file');
    inputEl.setAttribute('multiple', 'multiple');
    inputEl.setAttribute('accept', 'video/*');
    inputEl.setAttribute('style', 'position: fixed; top: -4000px; left: -3000px; z-index: -300;');
    document.body.appendChild(inputEl);
    return new Promise(resolve => {
        const TaroMouseEvents = document.createEvent('MouseEvents');
        TaroMouseEvents.initEvent('click', true, true);
        inputEl.dispatchEvent(TaroMouseEvents);
        inputEl.onchange = function (e) {
            var _a;
            const target = e.target;
            const file = (_a = target.files) === null || _a === void 0 ? void 0 : _a[0];
            const reader = new FileReader();
            reader.onload = function (event) {
                var _a;
                const videoEl = document.createElement('video');
                const url = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
                videoEl.preload = 'metadata';
                videoEl.src = url;
                videoEl.onloadedmetadata = () => {
                    res.tempFilePath = url;
                    res.duration = videoEl.duration;
                    res.size = event.total;
                    res.height = videoEl.videoHeight;
                    res.width = videoEl.videoHeight;
                    return handle.success(res, resolve);
                };
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        };
    }).finally(() => {
        document.body.removeChild(inputEl);
    });
};
const chooseMedia = temporarilyNotSupport('chooseMedia');

// ???????????????
const createVideoDecoder = temporarilyNotSupport('createVideoDecoder');

// ???????????????
const createMediaContainer = temporarilyNotSupport('createMediaContainer');

// ????????????
const updateVoIPChatMuteConfig = temporarilyNotSupport('updateVoIPChatMuteConfig');
const subscribeVoIPVideoMembers = temporarilyNotSupport('subscribeVoIPVideoMembers');
const setEnable1v1Chat = temporarilyNotSupport('setEnable1v1Chat');
const onVoIPVideoMembersChanged = temporarilyNotSupport('onVoIPVideoMembersChanged');
const onVoIPChatStateChanged = temporarilyNotSupport('onVoIPChatStateChanged');
const onVoIPChatSpeakersChanged = temporarilyNotSupport('onVoIPChatSpeakersChanged');
const onVoIPChatMembersChanged = temporarilyNotSupport('onVoIPChatMembersChanged');
const onVoIPChatInterrupted = temporarilyNotSupport('onVoIPChatInterrupted');
const offVoIPVideoMembersChanged = temporarilyNotSupport('offVoIPVideoMembersChanged');
const offVoIPChatStateChanged = temporarilyNotSupport('offVoIPChatStateChanged');
const offVoIPChatMembersChanged = temporarilyNotSupport('offVoIPChatMembersChanged');
const offVoIPChatInterrupted = temporarilyNotSupport('offVoIPChatInterrupted');
const joinVoIPChat = temporarilyNotSupport('joinVoIPChat');
const exitVoIPChat = temporarilyNotSupport('exitVoIPChat');

// ??????
const openEmbeddedMiniProgram = temporarilyNotSupport('openEmbeddedMiniProgram');
const navigateToMiniProgram = temporarilyNotSupport('navigateToMiniProgram');
const navigateBackMiniProgram = temporarilyNotSupport('navigateBackMiniProgram');
const exitMiniProgram = temporarilyNotSupport('exitMiniProgram');

/**
 * HTTP Response Header ???????????????????????????
 * @typedef {Object} HeadersReceivedParam
 * @property {Object} header ??????????????????????????? HTTP Response Header
 */
/**
 * HTTP Response Header ?????????????????????
 * @callback HeadersReceivedCallback
 * @param {HeadersReceivedParam} res ??????
 */
/**
 * ?????????????????????????????????
 * @typedef {Object} ProgressUpdateParam
 * @property {number} progress ???????????????
 * @property {number} [totalBytesWritten] ???????????????????????????????????? Bytes
 * @property {number} [totalBytesSent] ???????????????????????????????????? Bytes
 * @property {number} [totalBytesExpectedToWrite] ????????????????????????????????????????????? Bytes
 * @property {number} [totalBytesExpectedToSend] ????????????????????????????????????????????? Bytes
 */
/**
 * ?????????????????????????????????
 * @callback ProgressUpdateCallback
 * @param {ProgressUpdateParam} res ??????
 */
const NETWORK_TIMEOUT = 60000;
const XHR_STATS = {
    UNSENT: 0,
    OPENED: 1,
    HEADERS_RECEIVED: 2,
    LOADING: 3,
    DONE: 4 // The operation is complete.
};
/**
 * ??????xhr???header
 * @param {XMLHttpRequest} xhr
 * @param {Object} header
 */
const setHeader = (xhr, header) => {
    let headerKey;
    for (headerKey in header) {
        xhr.setRequestHeader(headerKey, header[headerKey]);
    }
};
/**
 * ??? blob url ???????????????
 * @param {string} url ???????????? blob url
 * @returns {Promise<File>}
 */
const convertObjectUrlToBlob = url => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function () {
            if (this.status === 200) {
                resolve(this.response);
            }
            else {
                /* eslint-disable prefer-promise-reject-errors */
                reject({ status: this.status });
            }
        };
        xhr.send();
    });
};

const createDownloadTask = ({ url, header, success, error }) => {
    let timeout;
    const apiName = 'downloadFile';
    const xhr = new XMLHttpRequest();
    const callbackManager = {
        headersReceived: new CallbackManager(),
        progressUpdate: new CallbackManager()
    };
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    setHeader(xhr, header);
    xhr.onprogress = e => {
        const { loaded, total } = e;
        callbackManager.progressUpdate.trigger({
            progress: Math.round(loaded / total * 100),
            totalBytesWritten: loaded,
            totalBytesExpectedToWrite: total
        });
    };
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XHR_STATS.HEADERS_RECEIVED)
            return;
        callbackManager.headersReceived.trigger({
            header: xhr.getAllResponseHeaders()
        });
    };
    xhr.onload = () => {
        const response = xhr.response;
        const status = xhr.status;
        success({
            errMsg: `${apiName}:ok`,
            statusCode: status,
            tempFilePath: window.URL.createObjectURL(response)
        });
    };
    xhr.onabort = () => {
        clearTimeout(timeout);
        error({
            errMsg: `${apiName}:fail abort`
        });
    };
    xhr.onerror = (e) => {
        error({
            errMsg: `${apiName}:fail ${e.message}`
        });
    };
    /**
     * ????????????
     */
    const abort = () => {
        xhr.abort();
    };
    const send = () => {
        xhr.send();
        timeout = setTimeout(() => {
            xhr.onabort = null;
            xhr.onload = null;
            xhr.onprogress = null;
            xhr.onreadystatechange = null;
            xhr.onerror = null;
            abort();
            error({
                errMsg: `${apiName}:fail timeout`
            });
        }, NETWORK_TIMEOUT);
    };
    send();
    /**
     * ?????? HTTP Response Header ???????????????????????????????????????
     * @param {HeadersReceivedCallback} callback HTTP Response Header ?????????????????????
     */
    const onHeadersReceived = callbackManager.headersReceived.add;
    /**
     * ???????????? HTTP Response Header ??????
     * @param {HeadersReceivedCallback} callback HTTP Response Header ?????????????????????
     */
    const offHeadersReceived = callbackManager.headersReceived.remove;
    /**
     * ????????????????????????
     * @param {ProgressUpdateCallback} callback HTTP Response Header ?????????????????????
     */
    const onProgressUpdate = callbackManager.progressUpdate.add;
    /**
     * ??????????????????????????????
     * @param {ProgressUpdateCallback} callback HTTP Response Header ?????????????????????
     */
    const offProgressUpdate = callbackManager.progressUpdate.remove;
    return {
        abort,
        onHeadersReceived,
        offHeadersReceived,
        onProgressUpdate,
        offProgressUpdate
    };
};
/**
 * ????????????????????????????????????????????????????????? HTTPS GET ????????????????????????????????????????????????????????????????????????????????????
 * ????????????????????????????????? header ?????????????????? Content-Type ??????????????????????????????????????????????????????
 */
const downloadFile = ({ url, header, success, fail, complete }) => {
    let task;
    const result = new Promise((resolve, reject) => {
        task = createDownloadTask({
            url,
            header,
            success: res => {
                success && success(res);
                complete && complete(res);
                resolve(res);
            },
            error: res => {
                fail && fail(res);
                complete && complete(res);
                reject(res);
            }
        });
    });
    result.headersReceive = task.onHeadersReceived;
    result.progress = task.onProgressUpdate;
    result.abort = task.abort;
    return result;
};

// mDNS
const stopLocalServiceDiscovery = temporarilyNotSupport('stopLocalServiceDiscovery');
const startLocalServiceDiscovery = temporarilyNotSupport('startLocalServiceDiscovery');
const onLocalServiceResolveFail = temporarilyNotSupport('onLocalServiceResolveFail');
const onLocalServiceLost = temporarilyNotSupport('onLocalServiceLost');
const onLocalServiceFound = temporarilyNotSupport('onLocalServiceFound');
const onLocalServiceDiscoveryStop = temporarilyNotSupport('onLocalServiceDiscoveryStop');
const offLocalServiceResolveFail = temporarilyNotSupport('offLocalServiceResolveFail');
const offLocalServiceLost = temporarilyNotSupport('offLocalServiceLost');
const offLocalServiceFound = temporarilyNotSupport('offLocalServiceFound');
const offLocalServiceDiscoveryStop = temporarilyNotSupport('offLocalServiceDiscoveryStop');

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) {
  if (!REACT_ELEMENT_TYPE) {
    REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7;
  }

  var defaultProps = type && type.defaultProps;
  var childrenLength = arguments.length - 3;

  if (!props && childrenLength !== 0) {
    props = {
      children: void 0
    };
  }

  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = new Array(childrenLength);

    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 3];
    }

    props.children = childArray;
  }

  if (props && defaultProps) {
    for (var propName in defaultProps) {
      if (props[propName] === void 0) {
        props[propName] = defaultProps[propName];
      }
    }
  } else if (!props) {
    props = defaultProps || {};
  }

  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type: type,
    key: key === undefined ? null : "" + key,
    ref: null,
    props: props,
    _owner: null
  };
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _typeof$1(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$1 = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof$1 = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof$1(obj);
}

function _wrapRegExp() {
  _wrapRegExp = function (re, groups) {
    return new BabelRegExp(re, undefined, groups);
  };

  var _super = RegExp.prototype;

  var _groups = new WeakMap();

  function BabelRegExp(re, flags, groups) {
    var _this = new RegExp(re, flags);

    _groups.set(_this, groups || _groups.get(re));

    return _setPrototypeOf(_this, BabelRegExp.prototype);
  }

  _inherits(BabelRegExp, RegExp);

  BabelRegExp.prototype.exec = function (str) {
    var result = _super.exec.call(this, str);

    if (result) result.groups = buildGroups(result, this);
    return result;
  };

  BabelRegExp.prototype[Symbol.replace] = function (str, substitution) {
    if (typeof substitution === "string") {
      var groups = _groups.get(this);

      return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) {
        return "$" + groups[name];
      }));
    } else if (typeof substitution === "function") {
      var _this = this;

      return _super[Symbol.replace].call(this, str, function () {
        var args = arguments;

        if (typeof args[args.length - 1] !== "object") {
          args = [].slice.call(args);
          args.push(buildGroups(args, _this));
        }

        return substitution.apply(this, args);
      });
    } else {
      return _super[Symbol.replace].call(this, str, substitution);
    }
  };

  function buildGroups(result, re) {
    var g = _groups.get(re);

    return Object.keys(g).reduce(function (groups, name) {
      groups[name] = result[g[name]];
      return groups;
    }, Object.create(null));
  }

  return _wrapRegExp.apply(this, arguments);
}

function _asyncIterator(iterable) {
  var method;

  if (typeof Symbol !== "undefined") {
    if (Symbol.asyncIterator) method = iterable[Symbol.asyncIterator];
    if (method == null && Symbol.iterator) method = iterable[Symbol.iterator];
  }

  if (method == null) method = iterable["@@asyncIterator"];
  if (method == null) method = iterable["@@iterator"];
  if (method == null) throw new TypeError("Object is not async iterable");
  return method.call(iterable);
}

function _AwaitValue(value) {
  this.wrapped = value;
}

function _AsyncGenerator(gen) {
  var front, back;

  function send(key, arg) {
    return new Promise(function (resolve, reject) {
      var request = {
        key: key,
        arg: arg,
        resolve: resolve,
        reject: reject,
        next: null
      };

      if (back) {
        back = back.next = request;
      } else {
        front = back = request;
        resume(key, arg);
      }
    });
  }

  function resume(key, arg) {
    try {
      var result = gen[key](arg);
      var value = result.value;
      var wrappedAwait = value instanceof _AwaitValue;
      Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) {
        if (wrappedAwait) {
          resume(key === "return" ? "return" : "next", arg);
          return;
        }

        settle(result.done ? "return" : "normal", arg);
      }, function (err) {
        resume("throw", err);
      });
    } catch (err) {
      settle("throw", err);
    }
  }

  function settle(type, value) {
    switch (type) {
      case "return":
        front.resolve({
          value: value,
          done: true
        });
        break;

      case "throw":
        front.reject(value);
        break;

      default:
        front.resolve({
          value: value,
          done: false
        });
        break;
    }

    front = front.next;

    if (front) {
      resume(front.key, front.arg);
    } else {
      back = null;
    }
  }

  this._invoke = send;

  if (typeof gen.return !== "function") {
    this.return = undefined;
  }
}

_AsyncGenerator.prototype[typeof Symbol === "function" && Symbol.asyncIterator || "@@asyncIterator"] = function () {
  return this;
};

_AsyncGenerator.prototype.next = function (arg) {
  return this._invoke("next", arg);
};

_AsyncGenerator.prototype.throw = function (arg) {
  return this._invoke("throw", arg);
};

_AsyncGenerator.prototype.return = function (arg) {
  return this._invoke("return", arg);
};

function _wrapAsyncGenerator(fn) {
  return function () {
    return new _AsyncGenerator(fn.apply(this, arguments));
  };
}

function _awaitAsyncGenerator(value) {
  return new _AwaitValue(value);
}

function _asyncGeneratorDelegate(inner, awaitWrap) {
  var iter = {},
      waiting = false;

  function pump(key, value) {
    waiting = true;
    value = new Promise(function (resolve) {
      resolve(inner[key](value));
    });
    return {
      done: false,
      value: awaitWrap(value)
    };
  }

  ;

  iter[typeof Symbol !== "undefined" && Symbol.iterator || "@@iterator"] = function () {
    return this;
  };

  iter.next = function (value) {
    if (waiting) {
      waiting = false;
      return value;
    }

    return pump("next", value);
  };

  if (typeof inner.throw === "function") {
    iter.throw = function (value) {
      if (waiting) {
        waiting = false;
        throw value;
      }

      return pump("throw", value);
    };
  }

  if (typeof inner.return === "function") {
    iter.return = function (value) {
      if (waiting) {
        waiting = false;
        return value;
      }

      return pump("return", value);
    };
  }

  return iter;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineEnumerableProperties(obj, descs) {
  for (var key in descs) {
    var desc = descs[key];
    desc.configurable = desc.enumerable = true;
    if ("value" in desc) desc.writable = true;
    Object.defineProperty(obj, key, desc);
  }

  if (Object.getOwnPropertySymbols) {
    var objectSymbols = Object.getOwnPropertySymbols(descs);

    for (var i = 0; i < objectSymbols.length; i++) {
      var sym = objectSymbols[i];
      var desc = descs[sym];
      desc.configurable = desc.enumerable = true;
      if ("value" in desc) desc.writable = true;
      Object.defineProperty(obj, sym, desc);
    }
  }

  return obj;
}

function _defaults(obj, defaults) {
  var keys = Object.getOwnPropertyNames(defaults);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = Object.getOwnPropertyDescriptor(defaults, key);

    if (value && value.configurable && obj[key] === undefined) {
      Object.defineProperty(obj, key, value);
    }
  }

  return obj;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

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

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? Object(arguments[i]) : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _instanceof(left, right) {
  if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
    return !!right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

function _newArrowCheck(innerThis, boundThis) {
  if (innerThis !== boundThis) {
    throw new TypeError("Cannot instantiate an arrow function");
  }
}

function _objectDestructuringEmpty(obj) {
  if (obj == null) throw new TypeError("Cannot destructure undefined");
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function set(target, property, value, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.set) {
    set = Reflect.set;
  } else {
    set = function set(target, property, value, receiver) {
      var base = _superPropBase(target, property);

      var desc;

      if (base) {
        desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.set) {
          desc.set.call(receiver, value);
          return true;
        } else if (!desc.writable) {
          return false;
        }
      }

      desc = Object.getOwnPropertyDescriptor(receiver, property);

      if (desc) {
        if (!desc.writable) {
          return false;
        }

        desc.value = value;
        Object.defineProperty(receiver, property, desc);
      } else {
        _defineProperty(receiver, property, value);
      }

      return true;
    };
  }

  return set(target, property, value, receiver);
}

function _set(target, property, value, receiver, isStrict) {
  var s = set(target, property, value, receiver || target);

  if (!s && isStrict) {
    throw new Error('failed to set property');
  }

  return value;
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

function _taggedTemplateLiteralLoose(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  strings.raw = raw;
  return strings;
}

function _readOnlyError(name) {
  throw new TypeError("\"" + name + "\" is read-only");
}

function _writeOnlyError(name) {
  throw new TypeError("\"" + name + "\" is write-only");
}

function _classNameTDZError(name) {
  throw new Error("Class \"" + name + "\" cannot be referenced in computed property keys.");
}

function _temporalUndefined() {}

function _tdz(name) {
  throw new ReferenceError(name + " is not defined - temporal dead zone");
}

function _temporalRef(val, name) {
  return val === _temporalUndefined ? _tdz(name) : val;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _slicedToArrayLoose(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimitLoose(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _maybeArrayLike(next, arr, i) {
  if (arr && !Array.isArray(arr) && typeof arr.length === "number") {
    var len = arr.length;
    return _arrayLikeToArray(arr, i !== void 0 && i < len ? i : len);
  }

  return next(arr, i);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _iterableToArrayLimitLoose(arr, i) {
  var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);

  if (_i == null) return;
  var _arr = [];

  for (_i = _i.call(arr), _step; !(_step = _i.next()).done;) {
    _arr.push(_step.value);

    if (i && _arr.length === i) break;
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _skipFirstGeneratorNext(fn) {
  return function () {
    var it = fn.apply(this, arguments);
    it.next();
    return it;
  };
}

function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];

  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }

  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");

  return typeof key === "symbol" ? key : String(key);
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.');
}

function _initializerDefineProperty(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }

  return desc;
}

var id = 0;

function _classPrivateFieldLooseKey(name) {
  return "__private_" + id++ + "_" + name;
}

function _classPrivateFieldLooseBase(receiver, privateKey) {
  if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) {
    throw new TypeError("attempted to use private field on non-instance");
  }

  return receiver;
}

function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");

  return _classApplyDescriptorGet(receiver, descriptor);
}

function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");

  _classApplyDescriptorSet(receiver, descriptor, value);

  return value;
}

function _classPrivateFieldDestructureSet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");

  return _classApplyDescriptorDestructureSet(receiver, descriptor);
}

function _classExtractFieldDescriptor(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }

  return privateMap.get(receiver);
}

function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
  _classCheckPrivateStaticAccess(receiver, classConstructor);

  _classCheckPrivateStaticFieldDescriptor(descriptor, "get");

  return _classApplyDescriptorGet(receiver, descriptor);
}

function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
  _classCheckPrivateStaticAccess(receiver, classConstructor);

  _classCheckPrivateStaticFieldDescriptor(descriptor, "set");

  _classApplyDescriptorSet(receiver, descriptor, value);

  return value;
}

function _classStaticPrivateMethodGet(receiver, classConstructor, method) {
  _classCheckPrivateStaticAccess(receiver, classConstructor);

  return method;
}

function _classStaticPrivateMethodSet() {
  throw new TypeError("attempted to set read only static private field");
}

function _classApplyDescriptorGet(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }

  return descriptor.value;
}

function _classApplyDescriptorSet(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }

    descriptor.value = value;
  }
}

function _classApplyDescriptorDestructureSet(receiver, descriptor) {
  if (descriptor.set) {
    if (!("__destrObj" in descriptor)) {
      descriptor.__destrObj = {
        set value(v) {
          descriptor.set.call(receiver, v);
        }

      };
    }

    return descriptor.__destrObj;
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }

    return descriptor;
  }
}

function _classStaticPrivateFieldDestructureSet(receiver, classConstructor, descriptor) {
  _classCheckPrivateStaticAccess(receiver, classConstructor);

  _classCheckPrivateStaticFieldDescriptor(descriptor, "set");

  return _classApplyDescriptorDestructureSet(receiver, descriptor);
}

function _classCheckPrivateStaticAccess(receiver, classConstructor) {
  if (receiver !== classConstructor) {
    throw new TypeError("Private static access of wrong provenance");
  }
}

function _classCheckPrivateStaticFieldDescriptor(descriptor, action) {
  if (descriptor === undefined) {
    throw new TypeError("attempted to " + action + " private static field before its declaration");
  }
}

function _decorate(decorators, factory, superClass, mixins) {
  var api = _getDecoratorsApi();

  if (mixins) {
    for (var i = 0; i < mixins.length; i++) {
      api = mixins[i](api);
    }
  }

  var r = factory(function initialize(O) {
    api.initializeInstanceElements(O, decorated.elements);
  }, superClass);
  var decorated = api.decorateClass(_coalesceClassElements(r.d.map(_createElementDescriptor)), decorators);
  api.initializeClassElements(r.F, decorated.elements);
  return api.runClassFinishers(r.F, decorated.finishers);
}

function _getDecoratorsApi() {
  _getDecoratorsApi = function () {
    return api;
  };

  var api = {
    elementsDefinitionOrder: [["method"], ["field"]],
    initializeInstanceElements: function (O, elements) {
      ["method", "field"].forEach(function (kind) {
        elements.forEach(function (element) {
          if (element.kind === kind && element.placement === "own") {
            this.defineClassElement(O, element);
          }
        }, this);
      }, this);
    },
    initializeClassElements: function (F, elements) {
      var proto = F.prototype;
      ["method", "field"].forEach(function (kind) {
        elements.forEach(function (element) {
          var placement = element.placement;

          if (element.kind === kind && (placement === "static" || placement === "prototype")) {
            var receiver = placement === "static" ? F : proto;
            this.defineClassElement(receiver, element);
          }
        }, this);
      }, this);
    },
    defineClassElement: function (receiver, element) {
      var descriptor = element.descriptor;

      if (element.kind === "field") {
        var initializer = element.initializer;
        descriptor = {
          enumerable: descriptor.enumerable,
          writable: descriptor.writable,
          configurable: descriptor.configurable,
          value: initializer === void 0 ? void 0 : initializer.call(receiver)
        };
      }

      Object.defineProperty(receiver, element.key, descriptor);
    },
    decorateClass: function (elements, decorators) {
      var newElements = [];
      var finishers = [];
      var placements = {
        static: [],
        prototype: [],
        own: []
      };
      elements.forEach(function (element) {
        this.addElementPlacement(element, placements);
      }, this);
      elements.forEach(function (element) {
        if (!_hasDecorators(element)) return newElements.push(element);
        var elementFinishersExtras = this.decorateElement(element, placements);
        newElements.push(elementFinishersExtras.element);
        newElements.push.apply(newElements, elementFinishersExtras.extras);
        finishers.push.apply(finishers, elementFinishersExtras.finishers);
      }, this);

      if (!decorators) {
        return {
          elements: newElements,
          finishers: finishers
        };
      }

      var result = this.decorateConstructor(newElements, decorators);
      finishers.push.apply(finishers, result.finishers);
      result.finishers = finishers;
      return result;
    },
    addElementPlacement: function (element, placements, silent) {
      var keys = placements[element.placement];

      if (!silent && keys.indexOf(element.key) !== -1) {
        throw new TypeError("Duplicated element (" + element.key + ")");
      }

      keys.push(element.key);
    },
    decorateElement: function (element, placements) {
      var extras = [];
      var finishers = [];

      for (var decorators = element.decorators, i = decorators.length - 1; i >= 0; i--) {
        var keys = placements[element.placement];
        keys.splice(keys.indexOf(element.key), 1);
        var elementObject = this.fromElementDescriptor(element);
        var elementFinisherExtras = this.toElementFinisherExtras((0, decorators[i])(elementObject) || elementObject);
        element = elementFinisherExtras.element;
        this.addElementPlacement(element, placements);

        if (elementFinisherExtras.finisher) {
          finishers.push(elementFinisherExtras.finisher);
        }

        var newExtras = elementFinisherExtras.extras;

        if (newExtras) {
          for (var j = 0; j < newExtras.length; j++) {
            this.addElementPlacement(newExtras[j], placements);
          }

          extras.push.apply(extras, newExtras);
        }
      }

      return {
        element: element,
        finishers: finishers,
        extras: extras
      };
    },
    decorateConstructor: function (elements, decorators) {
      var finishers = [];

      for (var i = decorators.length - 1; i >= 0; i--) {
        var obj = this.fromClassDescriptor(elements);
        var elementsAndFinisher = this.toClassDescriptor((0, decorators[i])(obj) || obj);

        if (elementsAndFinisher.finisher !== undefined) {
          finishers.push(elementsAndFinisher.finisher);
        }

        if (elementsAndFinisher.elements !== undefined) {
          elements = elementsAndFinisher.elements;

          for (var j = 0; j < elements.length - 1; j++) {
            for (var k = j + 1; k < elements.length; k++) {
              if (elements[j].key === elements[k].key && elements[j].placement === elements[k].placement) {
                throw new TypeError("Duplicated element (" + elements[j].key + ")");
              }
            }
          }
        }
      }

      return {
        elements: elements,
        finishers: finishers
      };
    },
    fromElementDescriptor: function (element) {
      var obj = {
        kind: element.kind,
        key: element.key,
        placement: element.placement,
        descriptor: element.descriptor
      };
      var desc = {
        value: "Descriptor",
        configurable: true
      };
      Object.defineProperty(obj, Symbol.toStringTag, desc);
      if (element.kind === "field") obj.initializer = element.initializer;
      return obj;
    },
    toElementDescriptors: function (elementObjects) {
      if (elementObjects === undefined) return;
      return _toArray(elementObjects).map(function (elementObject) {
        var element = this.toElementDescriptor(elementObject);
        this.disallowProperty(elementObject, "finisher", "An element descriptor");
        this.disallowProperty(elementObject, "extras", "An element descriptor");
        return element;
      }, this);
    },
    toElementDescriptor: function (elementObject) {
      var kind = String(elementObject.kind);

      if (kind !== "method" && kind !== "field") {
        throw new TypeError('An element descriptor\'s .kind property must be either "method" or' + ' "field", but a decorator created an element descriptor with' + ' .kind "' + kind + '"');
      }

      var key = _toPropertyKey(elementObject.key);

      var placement = String(elementObject.placement);

      if (placement !== "static" && placement !== "prototype" && placement !== "own") {
        throw new TypeError('An element descriptor\'s .placement property must be one of "static",' + ' "prototype" or "own", but a decorator created an element descriptor' + ' with .placement "' + placement + '"');
      }

      var descriptor = elementObject.descriptor;
      this.disallowProperty(elementObject, "elements", "An element descriptor");
      var element = {
        kind: kind,
        key: key,
        placement: placement,
        descriptor: Object.assign({}, descriptor)
      };

      if (kind !== "field") {
        this.disallowProperty(elementObject, "initializer", "A method descriptor");
      } else {
        this.disallowProperty(descriptor, "get", "The property descriptor of a field descriptor");
        this.disallowProperty(descriptor, "set", "The property descriptor of a field descriptor");
        this.disallowProperty(descriptor, "value", "The property descriptor of a field descriptor");
        element.initializer = elementObject.initializer;
      }

      return element;
    },
    toElementFinisherExtras: function (elementObject) {
      var element = this.toElementDescriptor(elementObject);

      var finisher = _optionalCallableProperty(elementObject, "finisher");

      var extras = this.toElementDescriptors(elementObject.extras);
      return {
        element: element,
        finisher: finisher,
        extras: extras
      };
    },
    fromClassDescriptor: function (elements) {
      var obj = {
        kind: "class",
        elements: elements.map(this.fromElementDescriptor, this)
      };
      var desc = {
        value: "Descriptor",
        configurable: true
      };
      Object.defineProperty(obj, Symbol.toStringTag, desc);
      return obj;
    },
    toClassDescriptor: function (obj) {
      var kind = String(obj.kind);

      if (kind !== "class") {
        throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator' + ' created a class descriptor with .kind "' + kind + '"');
      }

      this.disallowProperty(obj, "key", "A class descriptor");
      this.disallowProperty(obj, "placement", "A class descriptor");
      this.disallowProperty(obj, "descriptor", "A class descriptor");
      this.disallowProperty(obj, "initializer", "A class descriptor");
      this.disallowProperty(obj, "extras", "A class descriptor");

      var finisher = _optionalCallableProperty(obj, "finisher");

      var elements = this.toElementDescriptors(obj.elements);
      return {
        elements: elements,
        finisher: finisher
      };
    },
    runClassFinishers: function (constructor, finishers) {
      for (var i = 0; i < finishers.length; i++) {
        var newConstructor = (0, finishers[i])(constructor);

        if (newConstructor !== undefined) {
          if (typeof newConstructor !== "function") {
            throw new TypeError("Finishers must return a constructor.");
          }

          constructor = newConstructor;
        }
      }

      return constructor;
    },
    disallowProperty: function (obj, name, objectType) {
      if (obj[name] !== undefined) {
        throw new TypeError(objectType + " can't have a ." + name + " property.");
      }
    }
  };
  return api;
}

function _createElementDescriptor(def) {
  var key = _toPropertyKey(def.key);

  var descriptor;

  if (def.kind === "method") {
    descriptor = {
      value: def.value,
      writable: true,
      configurable: true,
      enumerable: false
    };
  } else if (def.kind === "get") {
    descriptor = {
      get: def.value,
      configurable: true,
      enumerable: false
    };
  } else if (def.kind === "set") {
    descriptor = {
      set: def.value,
      configurable: true,
      enumerable: false
    };
  } else if (def.kind === "field") {
    descriptor = {
      configurable: true,
      writable: true,
      enumerable: true
    };
  }

  var element = {
    kind: def.kind === "field" ? "field" : "method",
    key: key,
    placement: def.static ? "static" : def.kind === "field" ? "own" : "prototype",
    descriptor: descriptor
  };
  if (def.decorators) element.decorators = def.decorators;
  if (def.kind === "field") element.initializer = def.value;
  return element;
}

function _coalesceGetterSetter(element, other) {
  if (element.descriptor.get !== undefined) {
    other.descriptor.get = element.descriptor.get;
  } else {
    other.descriptor.set = element.descriptor.set;
  }
}

function _coalesceClassElements(elements) {
  var newElements = [];

  var isSameElement = function (other) {
    return other.kind === "method" && other.key === element.key && other.placement === element.placement;
  };

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var other;

    if (element.kind === "method" && (other = newElements.find(isSameElement))) {
      if (_isDataDescriptor(element.descriptor) || _isDataDescriptor(other.descriptor)) {
        if (_hasDecorators(element) || _hasDecorators(other)) {
          throw new ReferenceError("Duplicated methods (" + element.key + ") can't be decorated.");
        }

        other.descriptor = element.descriptor;
      } else {
        if (_hasDecorators(element)) {
          if (_hasDecorators(other)) {
            throw new ReferenceError("Decorators can't be placed on different accessors with for " + "the same property (" + element.key + ").");
          }

          other.decorators = element.decorators;
        }

        _coalesceGetterSetter(element, other);
      }
    } else {
      newElements.push(element);
    }
  }

  return newElements;
}

function _hasDecorators(element) {
  return element.decorators && element.decorators.length;
}

function _isDataDescriptor(desc) {
  return desc !== undefined && !(desc.value === undefined && desc.writable === undefined);
}

function _optionalCallableProperty(obj, name) {
  var value = obj[name];

  if (value !== undefined && typeof value !== "function") {
    throw new TypeError("Expected '" + name + "' to be a function");
  }

  return value;
}

function _classPrivateMethodGet(receiver, privateSet, fn) {
  if (!privateSet.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }

  return fn;
}

function _classPrivateMethodSet() {
  throw new TypeError("attempted to reassign private method");
}

var global$1 = typeof globalThis !== 'undefined' && globalThis || typeof self !== 'undefined' && self || typeof global$1 !== 'undefined' && global$1;
var support = {
  searchParams: 'URLSearchParams' in global$1,
  iterable: 'Symbol' in global$1 && 'iterator' in Symbol,
  blob: 'FileReader' in global$1 && 'Blob' in global$1 && function () {
    try {
      new Blob();
      return true;
    } catch (e) {
      return false;
    }
  }(),
  formData: 'FormData' in global$1,
  arrayBuffer: 'ArrayBuffer' in global$1
};

function isDataView(obj) {
  return obj && DataView.prototype.isPrototypeOf(obj);
}

if (support.arrayBuffer) {
  var viewClasses = ['[object Int8Array]', '[object Uint8Array]', '[object Uint8ClampedArray]', '[object Int16Array]', '[object Uint16Array]', '[object Int32Array]', '[object Uint32Array]', '[object Float32Array]', '[object Float64Array]'];

  var isArrayBufferView = ArrayBuffer.isView || function (obj) {
    return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
  };
}

function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name);
  }

  if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
    throw new TypeError('Invalid character in header field name: "' + name + '"');
  }

  return name.toLowerCase();
}

function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value);
  }

  return value;
} // Build a destructive iterator for the value list


function iteratorFor(items) {
  var iterator = {
    next: function next() {
      var value = items.shift();
      return {
        done: value === undefined,
        value: value
      };
    }
  };

  if (support.iterable) {
    iterator[Symbol.iterator] = function () {
      return iterator;
    };
  }

  return iterator;
}

function Headers(headers) {
  this.map = {};

  if (headers instanceof Headers) {
    headers.forEach(function (value, name) {
      this.append(name, value);
    }, this);
  } else if (Array.isArray(headers)) {
    headers.forEach(function (header) {
      this.append(header[0], header[1]);
    }, this);
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function (name) {
      this.append(name, headers[name]);
    }, this);
  }
}

Headers.prototype.append = function (name, value) {
  name = normalizeName(name);
  value = normalizeValue(value);
  var oldValue = this.map[name];
  this.map[name] = oldValue ? oldValue + ', ' + value : value;
};

Headers.prototype['delete'] = function (name) {
  delete this.map[normalizeName(name)];
};

Headers.prototype.get = function (name) {
  name = normalizeName(name);
  return this.has(name) ? this.map[name] : null;
};

Headers.prototype.has = function (name) {
  return this.map.hasOwnProperty(normalizeName(name));
};

Headers.prototype.set = function (name, value) {
  this.map[normalizeName(name)] = normalizeValue(value);
};

Headers.prototype.forEach = function (callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this);
    }
  }
};

Headers.prototype.keys = function () {
  var items = [];
  this.forEach(function (value, name) {
    items.push(name);
  });
  return iteratorFor(items);
};

Headers.prototype.values = function () {
  var items = [];
  this.forEach(function (value) {
    items.push(value);
  });
  return iteratorFor(items);
};

Headers.prototype.entries = function () {
  var items = [];
  this.forEach(function (value, name) {
    items.push([name, value]);
  });
  return iteratorFor(items);
};

if (support.iterable) {
  Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
}

function consumed(body) {
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'));
  }

  body.bodyUsed = true;
}

function fileReaderReady(reader) {
  return new Promise(function (resolve, reject) {
    reader.onload = function () {
      resolve(reader.result);
    };

    reader.onerror = function () {
      reject(reader.error);
    };
  });
}

function readBlobAsArrayBuffer(blob) {
  var reader = new FileReader();
  var promise = fileReaderReady(reader);
  reader.readAsArrayBuffer(blob);
  return promise;
}

function readBlobAsText(blob) {
  var reader = new FileReader();
  var promise = fileReaderReady(reader);
  reader.readAsText(blob);
  return promise;
}

function readArrayBufferAsText(buf) {
  var view = new Uint8Array(buf);
  var chars = new Array(view.length);

  for (var i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i]);
  }

  return chars.join('');
}

function bufferClone(buf) {
  if (buf.slice) {
    return buf.slice(0);
  } else {
    var view = new Uint8Array(buf.byteLength);
    view.set(new Uint8Array(buf));
    return view.buffer;
  }
}

function Body() {
  this.bodyUsed = false;

  this._initBody = function (body) {
    /*
      fetch-mock wraps the Response object in an ES6 Proxy to
      provide useful test harness features such as flush. However, on
      ES5 browsers without fetch or Proxy support pollyfills must be used;
      the proxy-pollyfill is unable to proxy an attribute unless it exists
      on the object before the Proxy is created. This change ensures
      Response.bodyUsed exists on the instance, while maintaining the
      semantic of setting Request.bodyUsed in the constructor before
      _initBody is called.
    */
    this.bodyUsed = this.bodyUsed;
    this._bodyInit = body;

    if (!body) {
      this._bodyText = '';
    } else if (typeof body === 'string') {
      this._bodyText = body;
    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body;
    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body;
    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
      this._bodyText = body.toString();
    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
      this._bodyArrayBuffer = bufferClone(body.buffer); // IE 10-11 can't handle a DataView body.

      this._bodyInit = new Blob([this._bodyArrayBuffer]);
    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
      this._bodyArrayBuffer = bufferClone(body);
    } else {
      this._bodyText = body = Object.prototype.toString.call(body);
    }

    if (!this.headers.get('content-type')) {
      if (typeof body === 'string') {
        this.headers.set('content-type', 'text/plain;charset=UTF-8');
      } else if (this._bodyBlob && this._bodyBlob.type) {
        this.headers.set('content-type', this._bodyBlob.type);
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
      }
    }
  };

  if (support.blob) {
    this.blob = function () {
      var rejected = consumed(this);

      if (rejected) {
        return rejected;
      }

      if (this._bodyBlob) {
        return Promise.resolve(this._bodyBlob);
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(new Blob([this._bodyArrayBuffer]));
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as blob');
      } else {
        return Promise.resolve(new Blob([this._bodyText]));
      }
    };

    this.arrayBuffer = function () {
      if (this._bodyArrayBuffer) {
        var isConsumed = consumed(this);

        if (isConsumed) {
          return isConsumed;
        }

        if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
          return Promise.resolve(this._bodyArrayBuffer.buffer.slice(this._bodyArrayBuffer.byteOffset, this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength));
        } else {
          return Promise.resolve(this._bodyArrayBuffer);
        }
      } else {
        return this.blob().then(readBlobAsArrayBuffer);
      }
    };
  }

  this.text = function () {
    var rejected = consumed(this);

    if (rejected) {
      return rejected;
    }

    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob);
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as text');
    } else {
      return Promise.resolve(this._bodyText);
    }
  };

  if (support.formData) {
    this.formData = function () {
      return this.text().then(decode);
    };
  }

  this.json = function () {
    return this.text().then(JSON.parse);
  };

  return this;
} // HTTP methods whose capitalization should be normalized


var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

function normalizeMethod(method) {
  var upcased = method.toUpperCase();
  return methods.indexOf(upcased) > -1 ? upcased : method;
}

function Request(input, options) {
  if (!(this instanceof Request)) {
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  }

  options = options || {};
  var body = options.body;

  if (input instanceof Request) {
    if (input.bodyUsed) {
      throw new TypeError('Already read');
    }

    this.url = input.url;
    this.credentials = input.credentials;

    if (!options.headers) {
      this.headers = new Headers(input.headers);
    }

    this.method = input.method;
    this.mode = input.mode;
    this.signal = input.signal;

    if (!body && input._bodyInit != null) {
      body = input._bodyInit;
      input.bodyUsed = true;
    }
  } else {
    this.url = String(input);
  }

  this.credentials = options.credentials || this.credentials || 'same-origin';

  if (options.headers || !this.headers) {
    this.headers = new Headers(options.headers);
  }

  this.method = normalizeMethod(options.method || this.method || 'GET');
  this.mode = options.mode || this.mode || null;
  this.signal = options.signal || this.signal;
  this.referrer = null;

  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
    throw new TypeError('Body not allowed for GET or HEAD requests');
  }

  this._initBody(body);

  if (this.method === 'GET' || this.method === 'HEAD') {
    if (options.cache === 'no-store' || options.cache === 'no-cache') {
      // Search for a '_' parameter in the query string
      var reParamSearch = /([?&])_=[^&]*/;

      if (reParamSearch.test(this.url)) {
        // If it already exists then set the value with the current time
        this.url = this.url.replace(reParamSearch, '$1_=' + new Date().getTime());
      } else {
        // Otherwise add a new '_' parameter to the end with the current time
        var reQueryString = /\?/;
        this.url += (reQueryString.test(this.url) ? '&' : '?') + '_=' + new Date().getTime();
      }
    }
  }
}

Request.prototype.clone = function () {
  return new Request(this, {
    body: this._bodyInit
  });
};

function decode(body) {
  var form = new FormData();
  body.trim().split('&').forEach(function (bytes) {
    if (bytes) {
      var split = bytes.split('=');
      var name = split.shift().replace(/\+/g, ' ');
      var value = split.join('=').replace(/\+/g, ' ');
      form.append(decodeURIComponent(name), decodeURIComponent(value));
    }
  });
  return form;
}

function parseHeaders(rawHeaders) {
  var headers = new Headers(); // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2

  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' '); // Avoiding split via regex to work around a common IE11 bug with the core-js 3.6.0 regex polyfill
  // https://github.com/github/fetch/issues/748
  // https://github.com/zloirock/core-js/issues/751

  preProcessedHeaders.split('\r').map(function (header) {
    return header.indexOf('\n') === 0 ? header.substr(1, header.length) : header;
  }).forEach(function (line) {
    var parts = line.split(':');
    var key = parts.shift().trim();

    if (key) {
      var value = parts.join(':').trim();
      headers.append(key, value);
    }
  });
  return headers;
}

Body.call(Request.prototype);
function Response(bodyInit, options) {
  if (!(this instanceof Response)) {
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  }

  if (!options) {
    options = {};
  }

  this.type = 'default';
  this.status = options.status === undefined ? 200 : options.status;
  this.ok = this.status >= 200 && this.status < 300;
  this.statusText = options.statusText === undefined ? '' : '' + options.statusText;
  this.headers = new Headers(options.headers);
  this.url = options.url || '';

  this._initBody(bodyInit);
}
Body.call(Response.prototype);

Response.prototype.clone = function () {
  return new Response(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Headers(this.headers),
    url: this.url
  });
};

Response.error = function () {
  var response = new Response(null, {
    status: 0,
    statusText: ''
  });
  response.type = 'error';
  return response;
};

var redirectStatuses = [301, 302, 303, 307, 308];

Response.redirect = function (url, status) {
  if (redirectStatuses.indexOf(status) === -1) {
    throw new RangeError('Invalid status code');
  }

  return new Response(null, {
    status: status,
    headers: {
      location: url
    }
  });
};

var DOMException = global$1.DOMException;

try {
  new DOMException();
} catch (err) {
  DOMException = function DOMException(message, name) {
    this.message = message;
    this.name = name;
    var error = Error(message);
    this.stack = error.stack;
  };

  DOMException.prototype = Object.create(Error.prototype);
  DOMException.prototype.constructor = DOMException;
}

function fetch$1(input, init) {
  return new Promise(function (resolve, reject) {
    var request = new Request(input, init);

    if (request.signal && request.signal.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'));
    }

    var xhr = new XMLHttpRequest();

    function abortXhr() {
      xhr.abort();
    }

    xhr.onload = function () {
      var options = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      };
      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
      var body = 'response' in xhr ? xhr.response : xhr.responseText;
      setTimeout(function () {
        resolve(new Response(body, options));
      }, 0);
    };

    xhr.onerror = function () {
      setTimeout(function () {
        reject(new TypeError('Network request failed'));
      }, 0);
    };

    xhr.ontimeout = function () {
      setTimeout(function () {
        reject(new TypeError('Network request failed'));
      }, 0);
    };

    xhr.onabort = function () {
      setTimeout(function () {
        reject(new DOMException('Aborted', 'AbortError'));
      }, 0);
    };

    function fixUrl(url) {
      try {
        return url === '' && global$1.location.href ? global$1.location.href : url;
      } catch (e) {
        return url;
      }
    }

    xhr.open(request.method, fixUrl(request.url), true);

    if (request.credentials === 'include') {
      xhr.withCredentials = true;
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false;
    }

    if ('responseType' in xhr) {
      if (support.blob) {
        xhr.responseType = 'blob';
      } else if (support.arrayBuffer && request.headers.get('Content-Type') && request.headers.get('Content-Type').indexOf('application/octet-stream') !== -1) {
        xhr.responseType = 'arraybuffer';
      }
    }

    if (init && _typeof$1(init.headers) === 'object' && !(init.headers instanceof Headers)) {
      Object.getOwnPropertyNames(init.headers).forEach(function (name) {
        xhr.setRequestHeader(name, normalizeValue(init.headers[name]));
      });
    } else {
      request.headers.forEach(function (value, name) {
        xhr.setRequestHeader(name, value);
      });
    }

    if (request.signal) {
      request.signal.addEventListener('abort', abortXhr);

      xhr.onreadystatechange = function () {
        // DONE (success or failure)
        if (xhr.readyState === 4) {
          request.signal.removeEventListener('abort', abortXhr);
        }
      };
    }

    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
  });
}
fetch$1.polyfill = true;

if (!global$1.fetch) {
  global$1.fetch = fetch$1;
  global$1.Headers = Headers;
  global$1.Request = Request;
  global$1.Response = Response;
}

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }

  return Object(val);
}

function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    } // Detect buggy property enumeration order in older V8 versions.
    // https://bugs.chromium.org/p/v8/issues/detail?id=4118


    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers

    test1[5] = 'de';

    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test2 = {};

    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }

    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });

    if (order2.join('') !== '0123456789') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });

    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }

    return true;
  } catch (err) {
    // We don't expect any of the above to throw, but better to be safe.
    return false;
  }
}

var objectAssign$1 = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;

  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }

    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);

      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }

  return to;
};
var enc = encodeURIComponent;

function serializeParams(params) {
  if (!params) {
    return '';
  }

  return Object.keys(params).map(function (item) {
    return item + '=' + enc(params[item]);
  }).join('&');
}

function isFunction(fn) {
  return typeof fn === 'function';
}

function getUrlQueryParamByName(url, name) {
  if (!url) {
    url = window.location.href;
  }

  name = name.replace(/[[]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  var results = regex.exec(url);

  if (!results) {
    return null;
  }

  if (!results[2]) {
    return '';
  }

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function updateQueryStringParamByName(url, name, value) {
  var re = new RegExp('([?&])' + name + '=.*?(&|$)', 'i');
  var separator = url.indexOf('?') !== -1 ? '&' : '?';

  if (url.match(re)) {
    return url.replace(re, '$1' + name + '=' + value + '$2');
  }

  return url + separator + name + '=' + value;
}

var win$1 = typeof window !== 'undefined' ? window : global;
var localStorageName = 'localStorage';
var storage = win$1[localStorageName];
var store = {
  disabled: false,
  set: function set(key, val) {
    if (val === void 666) {
      return store.remove(key);
    }

    storage.setItem(key, store.serialize(val));
    return val;
  },
  get: function get(key, defaultVal) {
    var val = store.deserialize(storage.getItem(key));
    return val === undefined ? defaultVal : val;
  },
  remove: function remove(key) {
    storage.removeItem(key);
  },
  clear: function clear() {
    storage.clear();
  },
  has: function has(key) {
    return store.get(key) !== void 666;
  },
  forEach: function forEach(callback) {
    for (var i = 0; i < storage.length; i++) {
      var key = storage.key(i);
      callback(key, store.get(key));
    }
  },
  getAll: function getAll() {
    var ret = {};
    store.forEach(function (key, val) {
      ret[key] = val;
    });
    return ret;
  },
  serialize: function serialize(value) {
    return JSON.stringify(value);
  },
  deserialize: function deserialize(value) {
    if (typeof value !== 'string') {
      return;
    }

    try {
      return JSON.parse(value);
    } catch (err) {
      return value || void 666;
    }
  }
};

try {
  var testKey = '__store__';
  store.set(testKey, testKey);

  if (store.get(testKey) !== testKey) {
    store.disabled = true;
  }

  store.remove(testKey);
} catch (err) {
  store.disabled = true;
}

store.enabled = !store.disabled;

var _typeof = typeof Symbol === "function" && _typeof$1(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof$1(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof$1(obj);
};

var win = typeof window !== 'undefined' ? window : global;

var canUsePromise = function () {
  return 'Promise' in win && _typeof(isFunction(Promise));
}();

var noop$1 = function noop() {};

var encodeC = encodeURIComponent;
var doc = win.document;
var head = doc ? doc.head || doc.getElementsByTagName('head')[0] : null;
var TIMEOUT_CONST = 2000;
var defaultConfig = {
  timeout: TIMEOUT_CONST,
  retryTimes: 2,
  backup: null,
  params: {},
  jsonp: 'callback',
  name: null,
  cache: false,
  useStore: false,
  storeCheck: null,
  storeSign: null,
  storeCheckKey: null,
  dataCheck: null,
  charset: 'UTF-8'
};
var timestamp = new Date().getTime();

function jsonp$1(url, opts, cb) {
  if (isFunction(url)) {
    cb = url;
    opts = {};
  } else if (url && (typeof url === 'undefined' ? 'undefined' : _typeof(url)) === 'object') {
    cb = opts;
    opts = url || {};
    url = opts.url;
  }

  if (isFunction(opts)) {
    cb = opts;
    opts = {};
  }

  if (!opts) {
    opts = {};
  }

  opts = objectAssign$1({}, defaultConfig, opts);
  url = url || opts.url;
  cb = cb || noop$1;

  if (!url || typeof url !== 'string') {
    cb(new Error('Param url is needed!'));

    if (!jsonp$1.promiseClose && canUsePromise) {
      return new Promise(function (resolve, reject) {
        return reject(new Error('Param url is needed!'));
      });
    }

    return;
  }

  var urlWithParams = generateJsonpUrlWithParams(url, opts.params); // first get data from store

  var datafromStore = getDataFromStore({
    useStore: opts.useStore,
    storeKey: urlWithParams,
    storeCheck: opts.storeCheck,
    storeCheckKey: opts.storeCheckKey,
    storeSign: opts.storeSign,
    dataCheck: opts.dataCheck
  });

  if (datafromStore) {
    cb(null, datafromStore);

    if (!jsonp$1.promiseClose && canUsePromise) {
      return new Promise(function (resolve) {
        return resolve(datafromStore);
      });
    }

    return;
  }

  opts.originalUrl = urlWithParams;

  if (!jsonp$1.promiseClose && canUsePromise) {
    return new Promise(function (resolve, reject) {
      fetchData(urlWithParams, opts, function (err, data) {
        if (err) {
          cb(err);
          return reject(err);
        }

        cb(null, data);
        resolve(data);
      });
    });
  }

  fetchData(urlWithParams, opts, cb);
}

function generateJsonpUrlWithParams(url, params) {
  params = typeof params === 'string' ? params : serializeParams(params);
  url += (~url.indexOf('?') ? '&' : '?') + ('' + params);
  url = url.replace('?&', '?');
  return url;
}

function fetchData(url, opts, cb) {
  var originalUrl = opts.originalUrl;
  var charset = opts.charset;
  var jsonpUrlQueryParam = getUrlQueryParamByName(url, opts.jsonp);
  var funcId = (jsonpUrlQueryParam === '?' ? false : jsonpUrlQueryParam) || opts.name || '__jsonp' + timestamp++;
  var gotoBackupInfo = arguments[3] || null;

  if (jsonpUrlQueryParam) {
    if (jsonpUrlQueryParam === '?') {
      url = updateQueryStringParamByName(url, opts.jsonp, encodeC(funcId));
    }
  } else {
    url += (url.split('').pop() === '&' ? '' : '&') + (opts.jsonp + '=' + encodeC(funcId));
  }

  if (!opts.cache) {
    url += (url.split('').pop() === '&' ? '' : '&') + ('_=' + new Date().getTime());
  } // move prev callback into next when fetch parallel with same funcId


  clearTimeout(win['timer_' + funcId]);
  var prevFunc = win[funcId];

  win[funcId] = function (data) {
    prevFunc && prevFunc(data);
    cleanup(funcId);

    if (gotoBackupInfo) {
      data.__$$backupCall = gotoBackupInfo;
    }

    if (opts.dataCheck) {
      if (opts.dataCheck(data) !== false) {
        // write data to store
        setDataToStore({
          useStore: opts.useStore,
          storeKey: originalUrl,
          data: data
        });
        return cb(null, data);
      }

      if (fallback(originalUrl, opts, cb) === false) {
        cb(new Error('Data check error, and no fallback'));
      }
    } else {
      // write data to store
      setDataToStore({
        useStore: opts.useStore,
        storeKey: originalUrl,
        data: data
      });
      cb(null, data);
    }
  };

  var script = appendScriptTagToHead({
    url: url,
    charset: charset
  });
  var timeout = opts.timeout != null ? opts.timeout : TIMEOUT_CONST; // when timeout, will try to retry

  win['timer_' + funcId] = setTimeout(function () {
    cleanup(funcId); // no retryTimes left, go to backup

    if (typeof opts.retryTimes === 'number' && opts.retryTimes > 0) {
      opts.retryTimes--;
      return fetchData(originalUrl, opts, cb);
    }

    if (fallback(originalUrl, opts, cb) === false) {
      return cb(new Error('Timeout and no data return'));
    }
  }, timeout);

  function cleanup(funcId) {
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }

    win[funcId] = noop$1;
    clearTimeout(win['timer_' + funcId]);
  }
}

function storeCheckFn(storeData, storeCheckKey, storeSign) {
  if (storeData && storeCheckKey && storeSign) {
    return storeData[storeCheckKey] && storeData[storeCheckKey] === storeSign;
  }

  return false;
}

function getDataFromStore(_ref) {
  var useStore = _ref.useStore,
      storeKey = _ref.storeKey,
      storeCheck = _ref.storeCheck,
      storeCheckKey = _ref.storeCheckKey,
      storeSign = _ref.storeSign,
      dataCheck = _ref.dataCheck;
  useStore = useStore ? store.enabled : false;

  if (useStore) {
    var storeData = store.get(storeKey);
    storeCheck = storeCheck || storeCheckFn;

    if (storeCheck(storeData, storeCheckKey, storeSign)) {
      if (!dataCheck || storeData && dataCheck && dataCheck(storeData) !== false) {
        return storeData;
      }
    }
  }

  return null;
}

function getDataFromStoreWithoutCheck(_ref2) {
  var useStore = _ref2.useStore,
      storeKey = _ref2.storeKey,
      dataCheck = _ref2.dataCheck;
  useStore = useStore ? store.enabled : false;

  if (useStore) {
    var storeData = store.get(storeKey);

    if (!dataCheck || storeData && dataCheck && dataCheck(storeData) !== false) {
      return storeData;
    }
  }

  return null;
}

function setDataToStore(_ref3) {
  var useStore = _ref3.useStore,
      storeKey = _ref3.storeKey,
      data = _ref3.data;
  useStore = useStore ? store.enabled : false;

  if (useStore) {
    store.set(storeKey, data);
  }
}

function fallback(url, opts, cb) {
  var backup = opts.backup;
  var backupWithParams = void 0;

  if (backup) {
    if (typeof backup === 'string') {
      delete opts.backup;
      backupWithParams = generateJsonpUrlWithParams(backup, opts.params);
      return fetchData(backupWithParams, opts, cb, {
        backup: backup
      });
    } else if (Array.isArray(backup)) {
      if (backup.length) {
        var backupUrl = backup.shift();
        backupWithParams = generateJsonpUrlWithParams(backupUrl, opts.params);
        return fetchData(backupWithParams, opts, cb, {
          backup: backupUrl
        });
      }
    }
  } // no backup to use, try to get data from store


  var dataFromStoreWithoutCheck = getDataFromStoreWithoutCheck({
    useStore: opts.useStore,
    storeKey: url,
    dataCheck: opts.dataCheck
  });

  if (dataFromStoreWithoutCheck) {
    cb(null, dataFromStoreWithoutCheck);
    return true;
  }

  return false;
}

function appendScriptTagToHead(_ref4) {
  var url = _ref4.url,
      charset = _ref4.charset;

  if (!doc) {
    return;
  }

  var script = doc.createElement('script');
  script.type = 'text/javascript';

  if (charset) {
    script.charset = charset;
  }

  script.src = url;
  head.appendChild(script);
  return script;
}

// @ts-ignore
const { Link: Link$1 } = Taro__default['default'];
function generateRequestUrlWithParams(url, params) {
    params = typeof params === 'string' ? params : serializeParams$1(params);
    if (params) {
        url += (~url.indexOf('?') ? '&' : '?') + params;
    }
    url = url.replace('?&', '?');
    return url;
}
// FIXME ?????? any ??????
function _request(options) {
    options = options || {};
    if (typeof options === 'string') {
        options = {
            url: options
        };
    }
    const { success, complete, fail } = options;
    let url = options.url;
    const params = {};
    const res = {};
    if (options.jsonp) {
        Object.assign(params, options);
        params.params = options.data;
        params.cache = options.jsonpCache;
        if (typeof options.jsonp === 'string') {
            params.name = options.jsonp;
        }
        delete params.jsonp;
        return jsonp$1(url, params)
            .then(data => {
            res.statusCode = 200;
            res.data = data;
            typeof success === 'function' && success(res);
            typeof complete === 'function' && complete(res);
            return res;
        })
            .catch(err => {
            typeof fail === 'function' && fail(err);
            typeof complete === 'function' && complete(res);
            return Promise.reject(err);
        });
    }
    params.method = options.method || 'GET';
    const methodUpper = params.method.toUpperCase();
    params.cache = options.cache || 'default';
    if (methodUpper === 'GET' || methodUpper === 'HEAD') {
        url = generateRequestUrlWithParams(url, options.data);
    }
    else if (typeof options.data === 'object') {
        options.header = options.header || {};
        const keyOfContentType = Object.keys(options.header).find(item => item.toLowerCase() === 'content-type');
        if (!keyOfContentType) {
            options.header['Content-Type'] = 'application/json';
        }
        const contentType = options.header[keyOfContentType || 'Content-Type'];
        if (contentType.indexOf('application/json') >= 0) {
            params.body = JSON.stringify(options.data);
        }
        else if (contentType.indexOf('application/x-www-form-urlencoded') >= 0) {
            params.body = serializeParams$1(options.data);
        }
        else {
            params.body = options.data;
        }
    }
    else {
        params.body = options.data;
    }
    if (options.header) {
        params.headers = options.header;
    }
    if (options.mode) {
        params.mode = options.mode;
    }
    if (options.signal) {
        params.signal = options.signal;
    }
    params.credentials = options.credentials;
    return fetch(url, params)
        .then(response => {
        res.statusCode = response.status;
        res.header = {};
        for (const key of response.headers.keys()) {
            res.header[key] = response.headers.get(key);
        }
        if (!response.ok) {
            throw response;
        }
        if (options.responseType === 'arraybuffer') {
            return response.arrayBuffer();
        }
        if (res.statusCode !== 204) {
            if (options.dataType === 'json' || typeof options.dataType === 'undefined') {
                return response.json();
            }
        }
        if (options.responseType === 'text' || options.dataType === 'text') {
            return response.text();
        }
        return Promise.resolve(null);
    })
        .then(data => {
        res.data = data;
        typeof success === 'function' && success(res);
        typeof complete === 'function' && complete(res);
        return res;
    })
        .catch(err => {
        typeof fail === 'function' && fail(err);
        typeof complete === 'function' && complete(res);
        return Promise.reject(err);
    });
}
function taroInterceptor(chain) {
    return _request(chain.requestParams);
}
const link = new Link$1(taroInterceptor);
const request = link.request.bind(link);
const addInterceptor = link.addInterceptor.bind(link);

// TCP ??????
const createTCPSocket = temporarilyNotSupport('createTCPSocket');

// UDP ??????
const createUDPSocket = temporarilyNotSupport('createUDPSocket');

const createUploadTask = ({ url, filePath, formData = {}, name, header, timeout, fileName, success, error }) => {
    let timeoutInter;
    let formKey;
    const apiName = 'uploadFile';
    const xhr = new XMLHttpRequest();
    const form = new FormData();
    const callbackManager = {
        headersReceived: new CallbackManager(),
        progressUpdate: new CallbackManager()
    };
    xhr.open('POST', url);
    setHeader(xhr, header);
    for (formKey in formData) {
        form.append(formKey, formData[formKey]);
    }
    xhr.upload.onprogress = e => {
        const { loaded, total } = e;
        callbackManager.progressUpdate.trigger({
            progress: Math.round(loaded / total * 100),
            totalBytesSent: loaded,
            totalBytesExpectedToSent: total
        });
    };
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XHR_STATS.HEADERS_RECEIVED)
            return;
        callbackManager.headersReceived.trigger({
            header: xhr.getAllResponseHeaders()
        });
    };
    xhr.onload = () => {
        const status = xhr.status;
        clearTimeout(timeoutInter);
        success({
            errMsg: `${apiName}:ok`,
            statusCode: status,
            data: xhr.responseText || xhr.response
        });
    };
    xhr.onabort = () => {
        clearTimeout(timeoutInter);
        error({
            errMsg: `${apiName}:fail abort`
        });
    };
    xhr.onerror = (e) => {
        clearTimeout(timeoutInter);
        error({
            errMsg: `${apiName}:fail ${e.message}`
        });
    };
    /**
     * ????????????
     */
    const abort = () => {
        clearTimeout(timeoutInter);
        xhr.abort();
    };
    const send = () => {
        xhr.send(form);
        timeoutInter = setTimeout(() => {
            xhr.onabort = null;
            xhr.onload = null;
            xhr.upload.onprogress = null;
            xhr.onreadystatechange = null;
            xhr.onerror = null;
            abort();
            error({
                errMsg: `${apiName}:fail timeout`
            });
        }, timeout || NETWORK_TIMEOUT);
    };
    convertObjectUrlToBlob(filePath)
        .then((fileObj) => {
        if (!fileName) {
            fileName = typeof fileObj !== 'string' && fileObj.name;
        }
        form.append(name, fileObj, fileName || `file-${Date.now()}`);
        send();
    })
        .catch(e => {
        error({
            errMsg: `${apiName}:fail ${e.message}`
        });
    });
    /**
     * ?????? HTTP Response Header ???????????????????????????????????????
     * @param {HeadersReceivedCallback} callback HTTP Response Header ?????????????????????
     */
    const onHeadersReceived = callbackManager.headersReceived.add;
    /**
     * ???????????? HTTP Response Header ??????
     * @param {HeadersReceivedCallback} callback HTTP Response Header ?????????????????????
     */
    const offHeadersReceived = callbackManager.headersReceived.remove;
    /**
     * ????????????????????????
     * @param {ProgressUpdateCallback} callback HTTP Response Header ?????????????????????
     */
    const onProgressUpdate = callbackManager.progressUpdate.add;
    /**
     * ??????????????????????????????
     * @param {ProgressUpdateCallback} callback HTTP Response Header ?????????????????????
     */
    const offProgressUpdate = callbackManager.progressUpdate.remove;
    return {
        abort,
        onHeadersReceived,
        offHeadersReceived,
        onProgressUpdate,
        offProgressUpdate
    };
};
/**
 * ????????????????????????????????????????????????????????? HTTPS POST ??????????????? content-type ??? multipart/form-data??????????????????????????????????????????
 */
const uploadFile = ({ url, filePath, name, header, formData, timeout, fileName, success, fail, complete }) => {
    let task;
    const result = new Promise((resolve, reject) => {
        task = createUploadTask({
            url,
            header,
            name,
            filePath,
            formData,
            timeout,
            fileName,
            success: res => {
                success && success(res);
                complete && complete(res);
                resolve(res);
            },
            error: res => {
                fail && fail(res);
                complete && complete(res);
                reject(res);
            }
        });
    });
    result.headersReceive = task.onHeadersReceived;
    result.progress = task.onProgressUpdate;
    result.abort = task.abort;
    return result;
};

class SocketTask {
    constructor(url, protocols) {
        if (protocols && protocols.length) {
            this.ws = new WebSocket(url, protocols);
        }
        else {
            this.ws = new WebSocket(url);
        }
        this.CONNECTING = 0;
        this.OPEN = 1;
        this.CLOSING = 2;
        this.CLOSED = 3;
    }
    get readyState() {
        return this.ws.readyState;
    }
    send(opts = {}) {
        if (typeof opts !== 'object' || !opts)
            opts = {};
        const { data = '', success, fail, complete } = opts;
        if (this.readyState !== 1) {
            const res = { errMsg: 'SocketTask.send:fail SocketTask.readState is not OPEN' };
            console.error(res.errMsg);
            typeof fail === 'function' && fail(res);
            typeof complete === 'function' && complete(res);
            return Promise.reject(res);
        }
        this.ws.send(data);
        const res = { errMsg: 'sendSocketMessage:ok' };
        typeof success === 'function' && success(res);
        typeof complete === 'function' && complete(res);
        return Promise.resolve(res);
    }
    close(opts = {}) {
        if (typeof opts !== 'object' || !opts)
            opts = {};
        const { code = 1000, reason = 'server complete,close', success, complete } = opts;
        this.closeDetail = { code, reason };
        // ????????????????????????????????????
        this._destroyWhenClose && this._destroyWhenClose();
        this.ws.close();
        const res = { errMsg: 'closeSocket:ok' };
        typeof success === 'function' && success(res);
        typeof complete === 'function' && complete(res);
        return Promise.resolve(res);
    }
    onOpen(func) {
        this.ws.onopen = func;
    }
    onMessage(func) {
        this.ws.onmessage = func;
    }
    onClose(func) {
        this.ws.onclose = () => {
            // ?????????????????????????????????????????????
            this._destroyWhenClose && this._destroyWhenClose();
            func(this.closeDetail || { code: 1006, reason: 'abnormal closure' });
        };
    }
    onError(func) {
        this.ws.onerror = func;
    }
}

let socketTasks = [];
let socketsCounter = 1;
function sendSocketMessage() {
    console.warn('Deprecated.Please use socketTask.send instead.');
}
function onSocketOpen() {
    console.warn('Deprecated.Please use socketTask.onOpen instead.');
}
function onSocketMessage() {
    console.warn('Deprecated.Please use socketTask.onMessage instead.');
}
function onSocketError() {
    console.warn('Deprecated.Please use socketTask.onError instead.');
}
function onSocketClose() {
    console.warn('Deprecated.Please use socketTask.onClose instead.');
}
function connectSocket(options) {
    const name = 'connectSocket';
    return new Promise((resolve, reject) => {
        // options must be an Object
        const isObject = shouldBeObject(options);
        if (!isObject.flag) {
            const res = { errMsg: `${name}:fail ${isObject.msg}` };
            console.error(res.errMsg);
            return reject(res);
        }
        const { url, protocols, success, fail, complete } = options;
        const handle = new MethodHandler({ name, success, fail, complete });
        // options.url must be String
        if (typeof url !== 'string') {
            return handle.fail({
                errMsg: getParameterError({
                    para: 'url',
                    correct: 'String',
                    wrong: url
                })
            }, reject);
        }
        // options.url must be invalid
        if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
            return handle.fail({
                errMsg: `request:fail invalid url "${url}"`
            }, reject);
        }
        // protocols must be array
        const _protocols = Array.isArray(protocols) ? protocols : null;
        // 2 connection at most
        if (socketTasks.length > 1) {
            return handle.fail({
                errMsg: '?????????????????? 2 ??? socket ?????????????????????????????????'
            }, reject);
        }
        const task = new SocketTask(url, _protocols);
        task._destroyWhenClose = function () {
            socketTasks = socketTasks.filter(socketTask => socketTask !== this);
        };
        socketTasks.push(task);
        handle.success({
            socketTaskId: socketsCounter++
        });
        return resolve(task);
    });
}
function closeSocket() {
    console.warn('Deprecated.Please use socketTask.close instead.');
}

// ????????????
const getAccountInfoSync = temporarilyNotSupport('getAccountInfoSync');

// ????????????
const chooseAddress = temporarilyNotSupport('chooseAddress');

// ??????
const authorizeForMiniProgram = temporarilyNotSupport('authorizeForMiniProgram');
const authorize = temporarilyNotSupport('authorize');

// ??????
const openCard = temporarilyNotSupport('openCard');
const addCard = temporarilyNotSupport('addCard');

// ?????????
const reserveChannelsLive = temporarilyNotSupport('reserveChannelsLive');
const openChannelsLive = temporarilyNotSupport('openChannelsLive');
const openChannelsEvent = temporarilyNotSupport('openChannelsEvent');
const openChannelsActivity = temporarilyNotSupport('openChannelsActivity');
const getChannelsLiveNoticeInfo = temporarilyNotSupport('getChannelsLiveNoticeInfo');
const getChannelsLiveInfo = temporarilyNotSupport('getChannelsLiveInfo');

// ????????????
const openCustomerServiceChat = temporarilyNotSupport('openCustomerServiceChat');

// ????????????
const checkIsSupportFacialRecognition = temporarilyNotSupport('checkIsSupportFacialRecognition');
const startFacialRecognitionVerify = temporarilyNotSupport('startFacialRecognitionVerify');
const startFacialRecognitionVerifyAndUploadVideo = temporarilyNotSupport('startFacialRecognitionVerifyAndUploadVideo');
const faceVerifyForPay = temporarilyNotSupport('faceVerifyForPay');

// ??????
const addVideoToFavorites = temporarilyNotSupport('addVideoToFavorites');
const addFileToFavorites = temporarilyNotSupport('addFileToFavorites');

// ?????????
const getGroupEnterInfo = temporarilyNotSupport('getGroupEnterInfo');

// ??????
const chooseInvoiceTitle = temporarilyNotSupport('chooseInvoiceTitle');
const chooseInvoice = temporarilyNotSupport('chooseInvoice');

// ??????
const chooseLicensePlate = temporarilyNotSupport('chooseLicensePlate');

// ????????????
const pluginLogin = temporarilyNotSupport('pluginLogin');
const login = temporarilyNotSupport('login');
const checkSession = temporarilyNotSupport('checkSession');

// ????????????
const showRedPackage = temporarilyNotSupport('showRedPackage');

// ??????
const openSetting = temporarilyNotSupport('openSetting');
const getSetting = temporarilyNotSupport('getSetting');

// ????????????
const startSoterAuthentication = temporarilyNotSupport('startSoterAuthentication');
const checkIsSupportSoterAuthentication = temporarilyNotSupport('checkIsSupportSoterAuthentication');
const checkIsSoterEnrolledInDevice = temporarilyNotSupport('checkIsSoterEnrolledInDevice');

// ????????????
const requestSubscribeMessage = temporarilyNotSupport('requestSubscribeMessage');

// ????????????
const getUserProfile = temporarilyNotSupport('getUserProfile');
const getUserInfo = temporarilyNotSupport('getUserInfo');

// ????????????
const shareToWeRun = temporarilyNotSupport('shareToWeRun');
const getWeRunData = temporarilyNotSupport('getWeRunData');

// ??????
const requestPayment = temporarilyNotSupport('requestPayment');
const requestOrderPayment = temporarilyNotSupport('requestOrderPayment');

// ??????
// FIXME ??????????????????????????????????????????

// ??????
const updateShareMenu = temporarilyNotSupport('updateShareMenu');
const showShareMenu = temporarilyNotSupport('showShareMenu');
const showShareImageMenu = temporarilyNotSupport('showShareImageMenu');
const shareVideoMessage = temporarilyNotSupport('shareVideoMessage');
const shareFileMessage = temporarilyNotSupport('shareFileMessage');
const onCopyUrl = temporarilyNotSupport('onCopyUrl');
const offCopyUrl = temporarilyNotSupport('offCopyUrl');
const hideShareMenu = temporarilyNotSupport('hideShareMenu');
const getShareInfo = temporarilyNotSupport('getShareInfo');
const authPrivateMessage = temporarilyNotSupport('authPrivateMessage');

/**
 * H5 ?????? styleSheet ??????
 * @author leeenx
 */
class StyleSheet {
    constructor() {
        this.$style = null;
        this.sheet = null;
        this.appendStyleSheet = () => {
            if (this.$style) {
                const head = document.getElementsByTagName('head')[0];
                this.$style.setAttribute('type', 'text/css');
                this.$style.setAttribute('data-type', 'Taro');
                head.appendChild(this.$style);
                this.sheet = this.$style.sheet;
            }
            if (this.sheet && !('insertRule' in this.sheet)) {
                console.warn('???????????????????????? stylesheet.insertRule ??????');
            }
        };
        // ??????????????????
        this.add = (cssText, index = 0) => {
            var _a;
            if (this.sheet === null) {
                // $style ???????????? DOM
                this.appendStyleSheet();
            }
            (_a = this.sheet) === null || _a === void 0 ? void 0 : _a.insertRule(cssText, index);
        };
        this.$style = document.createElement('style');
    }
}
const styleSheet = new StyleSheet();
// ????????????
let TRANSITION_END = 'transitionend';
let TRANSFORM = 'transform';
const $detect = document.createElement('div');
$detect.style.cssText = '-webkit-animation-name:webkit;-moz-animation-name:moz;-ms-animation-name:ms;animation-name:standard;';
if ($detect.style['animation-name'] === 'standard') {
    // ??????????????????
    TRANSITION_END = 'transitionend';
    TRANSFORM = 'transform';
}
else if ($detect.style['-webkit-animation-name'] === 'webkit') {
    // webkit ??????
    TRANSITION_END = 'webkitTransitionEnd';
    TRANSFORM = '-webkit-transform';
}
else if ($detect.style['-moz-animation-name'] === 'moz') {
    // moz ??????
    TRANSITION_END = 'mozTransitionEnd';
    TRANSFORM = '-moz-transform';
}
else if ($detect.style['-ms-animation-name'] === 'ms') {
    // ms ??????
    TRANSITION_END = 'msTransitionEnd';
    TRANSFORM = '-ms-transform';
}
let animId = 0;
class Animation {
    constructor({ duration = 400, delay = 0, timingFunction = 'linear', transformOrigin = '50% 50% 0', unit = 'px' } = {}) {
        // ????????????
        this.rules = [];
        // transform ??????
        this.transform = [`${TRANSFORM}:`];
        // ????????????
        this.steps = [];
        // ?????? map ----- ????????????
        this.animationMap = {};
        // animationMap ?????????
        this.animationMapCount = 0;
        // ?????????
        this.setDefault(duration, delay, timingFunction, transformOrigin);
        this.unit = unit;
        // atom ????????????animation ???????????????????????????????????? data-animation
        let animAttr = 'animation';
        // ?????? id
        this.id = ++animId;
        // ????????????
        document.body.addEventListener(TRANSITION_END, (e) => {
            const target = e.target;
            if (target.getAttribute(animAttr) === null) {
                animAttr = 'data-animation';
            }
            const animData = target.getAttribute(animAttr);
            // ??????????????????
            if (animData === null)
                return;
            const [animName, animPath] = animData.split('__');
            if (animName === `taro-h5-poly-fill/${this.id}/create-animation`) {
                const [animIndex, __stepIndex = 0] = animPath.split('--');
                const stepIndex = Number(__stepIndex);
                // ?????????????????????
                const animStepsCount = this.animationMap[`${animName}__${animIndex}`];
                const animStepsMaxIndex = animStepsCount - 1;
                if (stepIndex < animStepsMaxIndex) {
                    // ????????????????????????????????? nerv ??? react ??????????????? animation & data-animation ???????????????
                    target.setAttribute(animAttr, `${animName}__${animIndex}--${stepIndex + 1}`);
                    if (animAttr === 'animation') {
                        // Nerv ?????????animation & data-animation ????????????
                        target.setAttribute('data-animation', `${animName}__${animIndex}--${stepIndex + 1}`);
                    }
                }
            }
        });
    }
    transformUnit(...args) {
        const ret = [];
        args.forEach(each => {
            ret.push(isNaN(each) ? each : `${each}${this.unit}`);
        });
        return ret;
    }
    // ???????????????
    setDefault(duration, delay, timingFunction, transformOrigin) {
        this.DEFAULT = { duration, delay, timingFunction, transformOrigin };
    }
    matrix(a, b, c, d, tx, ty) {
        this.transform.push(`matrix(${a}, ${b}, ${c}, ${d}, ${tx}, ${ty})`);
        return this;
    }
    matrix3d(a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3, a4, b4, c4, d4) {
        this.transform.push(`matrix3d(${a1}, ${b1}, ${c1}, ${d1}, ${a2}, ${b2}, ${c2}, ${d2}, ${a3}, ${b3}, ${c3}, ${d3}, ${a4}, ${b4}, ${c4}, ${d4})`);
        return this;
    }
    rotate(angle) {
        this.transform.push(`rotate(${angle}deg)`);
        return this;
    }
    rotate3d(x, y, z, angle) {
        if (typeof y !== 'number') {
            this.transform.push(`rotate3d(${x})`);
        }
        else {
            this.transform.push(`rotate3d(${x}, ${y || 0}, ${z || 0}, ${angle || 0}deg)`);
        }
        return this;
    }
    rotateX(angle) {
        this.transform.push(`rotateX(${angle}deg)`);
        return this;
    }
    rotateY(angle) {
        this.transform.push(`rotateY(${angle}deg)`);
        return this;
    }
    rotateZ(angle) {
        this.transform.push(`rotateZ(${angle}deg)`);
        return this;
    }
    scale(x, y) {
        this.transform.push(`scale(${x}, ${y})`);
        return this;
    }
    scale3d(x, y, z) {
        this.transform.push(`scale3d(${x}, ${y}, ${z})`);
        return this;
    }
    scaleX(scale) {
        this.transform.push(`scaleX(${scale})`);
        return this;
    }
    scaleY(scale) {
        this.transform.push(`scaleY(${scale})`);
        return this;
    }
    scaleZ(scale) {
        this.transform.push(`scaleZ(${scale})`);
        return this;
    }
    skew(x, y) {
        this.transform.push(`skew(${x}, ${y})`);
        return this;
    }
    skewX(angle) {
        this.transform.push(`skewX(${angle})`);
        return this;
    }
    skewY(angle) {
        this.transform.push(`skewY(${angle})`);
        return this;
    }
    translate(x, y) {
        [x, y] = this.transformUnit(x, y);
        this.transform.push(`translate(${x}, ${y})`);
        return this;
    }
    translate3d(x, y, z) {
        [x, y, z] = this.transformUnit(x, y, z);
        this.transform.push(`translate3d(${x}, ${y}, ${z})`);
        return this;
    }
    translateX(translate) {
        [translate] = this.transformUnit(translate);
        this.transform.push(`translateX(${translate})`);
        return this;
    }
    translateY(translate) {
        [translate] = this.transformUnit(translate);
        this.transform.push(`translateY(${translate})`);
        return this;
    }
    translateZ(translate) {
        [translate] = this.transformUnit(translate);
        this.transform.push(`translateZ(${translate})`);
        return this;
    }
    opacity(value) {
        this.rules.push(`opacity: ${value}`);
        return this;
    }
    backgroundColor(value) {
        this.rules.push(`background-color: ${value}`);
        return this;
    }
    width(value) {
        [value] = this.transformUnit(value);
        this.rules.push(`width: ${value}`);
        return this;
    }
    height(value) {
        [value] = this.transformUnit(value);
        this.rules.push(`height: ${value}`);
        return this;
    }
    top(value) {
        [value] = this.transformUnit(value);
        this.rules.push(`top: ${value}`);
        return this;
    }
    right(value) {
        [value] = this.transformUnit(value);
        this.rules.push(`right: ${value}`);
        return this;
    }
    bottom(value) {
        [value] = this.transformUnit(value);
        this.rules.push(`bottom: ${value}`);
        return this;
    }
    left(value) {
        [value] = this.transformUnit(value);
        this.rules.push(`left: ${value}`);
        return this;
    }
    // ???????????????
    step(arg = {}) {
        const { DEFAULT } = this;
        const { duration = DEFAULT.duration, delay = DEFAULT.delay, timingFunction = DEFAULT.timingFunction, transformOrigin = DEFAULT.transformOrigin } = arg;
        // ???????????? transition ??????
        this.steps.push([
            this.rules.map(rule => `${rule}!important`).join(';'),
            `${this.transform.join(' ')}!important`,
            `${TRANSFORM}-origin: ${transformOrigin}`,
            `transition: all ${duration}ms ${timingFunction} ${delay}ms`
        ]
            .filter(item => item !== '' && item !== `${TRANSFORM}:`)
            .join(';'));
        // ?????? rules ??? transform
        this.rules = [];
        this.transform = [`${TRANSFORM}:`];
        return this;
    }
    // ??????????????????
    createAnimationData() {
        const animIndex = `taro-h5-poly-fill/${this.id}/create-animation__${this.animationMapCount++}`;
        // ????????????????????? step
        this.animationMap[animIndex] = this.steps.length;
        // ?????? step
        this.steps.forEach((step, index) => {
            const selector = index === 0
                ? `[animation="${animIndex}"], [data-animation="${animIndex}"]`
                : `[animation="${animIndex}--${index}"], [data-animation="${animIndex}--${index}"]`;
            styleSheet.add(`${selector} { ${step} }`);
        });
        // ?????? steps
        this.steps = [];
        return animIndex;
    }
    // ??????????????????
    export() {
        return this.createAnimationData();
    }
}
// h5 ??? createAnimation
const createAnimation = (option) => {
    return new Animation(option);
};

// ??????
const setBackgroundTextStyle = temporarilyNotSupport('setBackgroundTextStyle');
const setBackgroundColor = temporarilyNotSupport('setBackgroundColor');

// ???????????????
const nextTick = Taro__default['default'].nextTick;

// ??????
const loadFontFace = async (options) => {
    options = Object.assign({ global: false }, options);
    const { success, fail, complete, family, source, desc = {} } = options;
    const handle = new MethodHandler({ name: 'loadFontFace', success, fail, complete });
    // @ts-ignore
    const fonts = document.fonts;
    if (fonts) {
        // @ts-ignore
        const fontFace = new FontFace(family, source, desc);
        try {
            await fontFace.load();
            fonts.add(fontFace);
            return handle.success({});
        }
        catch (error) {
            return handle.fail({
                errMsg: error.message || error
            });
        }
    }
    else {
        const style = document.createElement('style');
        let innerText = `font-family:"${family}";src:${source};font-style:${desc.style || 'normal'};font-weight:${desc.weight || 'normal'};font-variant:${desc.variant || 'normal'};`;
        if (desc.ascentOverride) {
            innerText += `ascent-override:${desc.ascentOverride};`;
        }
        if (desc.descentOverride) {
            innerText += `descent-override:${desc.descentOverride};`;
        }
        if (desc.featureSettings) {
            innerText += `font-feature-settings:${desc.featureSettings};`;
        }
        if (desc.lineGapOverride) {
            innerText += `line-gap-override:${desc.lineGapOverride};`;
        }
        if (desc.stretch) {
            innerText += `font-stretch:${desc.stretch};`;
        }
        if (desc.unicodeRange) {
            innerText += `unicode-range:${desc.unicodeRange};`;
        }
        if (desc.variationSettings) {
            innerText += `font-variation-settings:${desc.variationSettings};`;
        }
        style.innerText = `@font-face{${innerText}}`;
        document.head.appendChild(style);
        return handle.success();
    }
};

// ??????
const getMenuButtonBoundingClientRect = temporarilyNotSupport('getMenuButtonBoundingClientRect');

// ?????????
const showNavigationBarLoading = temporarilyNotSupport('showNavigationBarLoading');
function setNavigationBarTitle(options) {
    // options must be an Object
    const isObject = shouldBeObject(options);
    if (!isObject.flag) {
        const res = { errMsg: `setNavigationBarTitle:fail ${isObject.msg}` };
        console.error(res.errMsg);
        return Promise.reject(res);
    }
    const { title, success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'setNavigationBarTitle', success, fail, complete });
    if (!title || typeof title !== 'string') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'title',
                correct: 'String',
                wrong: title
            })
        });
    }
    if (document.title !== title) {
        document.title = title;
    }
    return handle.success();
}
/**
 * ???????????????????????????
 */
const setNavigationBarColor = (options) => {
    const { backgroundColor, success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'setNavigationBarColor', success, fail, complete });
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    meta.setAttribute('content', backgroundColor);
    document.head.appendChild(meta);
    return handle.success();
};
const hideNavigationBarLoading = temporarilyNotSupport('hideNavigationBarLoading');
const hideHomeButton = temporarilyNotSupport('hideHomeButton');

/**
 * ???????????????????????????????????????????????????????????????????????????????????????????????????
 */
const startPullDownRefresh = function ({ success, fail, complete } = {}) {
    const handle = new MethodHandler({ name: 'startPullDownRefresh', success, fail, complete });
    return new Promise((resolve, reject) => {
        Taro__default['default'].eventCenter.trigger('__taroStartPullDownRefresh', {
            successHandler: (res = {}) => handle.success(res, resolve),
            errorHandler: (res = {}) => handle.fail(res, reject)
        });
    });
};
/**
 * ?????????????????????????????????
 */
const stopPullDownRefresh = function ({ success, fail, complete } = {}) {
    const handle = new MethodHandler({ name: 'stopPullDownRefresh', success, fail, complete });
    return new Promise((resolve, reject) => {
        Taro__default['default'].eventCenter.trigger('__taroStopPullDownRefresh', {
            successHandler: (res = {}) => handle.success(res, resolve),
            errorHandler: (res = {}) => handle.fail(res, reject)
        });
    });
};

let timer;
const FRAME_DURATION = 17;
/**
 * ??????????????????????????????
 */
const pageScrollTo = ({ scrollTop, selector = '', duration = 300, success, fail, complete }) => {
    let scrollFunc;
    const handle = new MethodHandler({ name: 'pageScrollTo', success, fail, complete });
    return new Promise((resolve, reject) => {
        var _a, _b;
        try {
            if (scrollTop === undefined && !selector) {
                return handle.fail({
                    errMsg: 'scrollTop" ??? "selector" ???????????????'
                }, reject);
            }
            const id = (_b = (_a = runtime.Current.page) === null || _a === void 0 ? void 0 : _a.path) === null || _b === void 0 ? void 0 : _b.replace(/([^a-z0-9\u00a0-\uffff_-])/ig, '\\$1');
            const el = (id
                ? document.querySelector(`.taro_page#${id}`)
                : document.querySelector('.taro_page') ||
                    document.querySelector('.taro_router'));
            if (!scrollFunc) {
                if (!el) {
                    scrollFunc = pos => {
                        if (pos === undefined) {
                            return window.pageYOffset;
                        }
                        else {
                            window.scrollTo(0, pos);
                        }
                    };
                }
                else {
                    scrollFunc = pos => {
                        if (pos === undefined) {
                            return el.scrollTop;
                        }
                        else {
                            el.scrollTop = pos;
                        }
                    };
                }
            }
            if (scrollTop && selector) {
                console.warn('"scrollTop" ??? "selector" ?????????????????????????????????????????????selector');
            }
            const from = scrollFunc();
            let to;
            if (typeof scrollTop === 'number') {
                to = scrollTop;
            }
            else {
                const el = document.querySelector(selector);
                to = (el === null || el === void 0 ? void 0 : el.offsetTop) || 0;
            }
            const delta = to - from;
            const frameCnt = duration / FRAME_DURATION;
            const easeFunc = getTimingFunc(easeInOut, frameCnt);
            const scroll = (frame = 0) => {
                const dest = from + delta * easeFunc(frame);
                scrollFunc(dest);
                if (frame < frameCnt) {
                    timer && clearTimeout(timer);
                    timer = setTimeout(() => {
                        scroll(frame + 1);
                    }, FRAME_DURATION);
                }
                else {
                    return handle.success({}, resolve);
                }
            };
            scroll();
        }
        catch (e) {
            return handle.fail({
                errMsg: e.message
            }, reject);
        }
    });
};

// ??????
const setTopBarText = temporarilyNotSupport('setTopBarText');

let tabConf;
function initTabBarApis(config = {}) {
    tabConf = config.tabBar;
}
/**
 * ?????? tabBar ??????????????????????????????
 */
const showTabBarRedDot = (options) => {
    // options must be an Object
    const isObject = shouldBeObject(options);
    if (!isObject.flag) {
        const res = { errMsg: `showTabBarRedDot:fail ${isObject.msg}` };
        console.error(res.errMsg);
        return Promise.reject(res);
    }
    const { index, success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'showTabBarRedDot', success, fail, complete });
    if (typeof index !== 'number') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'index',
                correct: 'Number',
                wrong: index
            })
        });
    }
    return new Promise((resolve, reject) => {
        Taro__default['default'].eventCenter.trigger('__taroShowTabBarRedDotHandler', {
            index,
            successHandler: (res = {}) => handle.success(res, resolve),
            errorHandler: (res = {}) => handle.fail(res, reject)
        });
    });
};
/**
 * ?????? tabBar
 */
const showTabBar = (options = {}) => {
    // options must be an Object
    const isObject = shouldBeObject(options);
    if (!isObject.flag) {
        const res = { errMsg: `showTabBar:fail ${isObject.msg}` };
        console.error(res.errMsg);
        return Promise.reject(res);
    }
    const { animation, success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'showTabBar', success, fail, complete });
    if (options.hasOwnProperty('animation') && typeof animation !== 'boolean') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'animation',
                correct: 'Boolean',
                wrong: animation
            })
        });
    }
    return new Promise((resolve, reject) => {
        Taro__default['default'].eventCenter.trigger('__taroShowTabBar', {
            animation,
            successHandler: (res = {}) => handle.success(res, resolve),
            errorHandler: (res = {}) => handle.fail(res, reject)
        });
    });
};
/**
 * ???????????? tabBar ???????????????
 */
const setTabBarStyle = (options = {}) => {
    // options must be an Object
    const isObject = shouldBeObject(options);
    if (!isObject.flag) {
        const res = { errMsg: `setTabBarStyle:fail ${isObject.msg}` };
        console.error(res.errMsg);
        return Promise.reject(res);
    }
    const { color, selectedColor, backgroundColor, borderStyle, success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'setTabBarStyle', success, fail, complete });
    let errMsg;
    if (color && !isValidColor(color)) {
        errMsg = 'color';
    }
    else if (selectedColor && !isValidColor(selectedColor)) {
        errMsg = 'selectedColor';
    }
    else if (backgroundColor && !isValidColor(backgroundColor)) {
        errMsg = 'backgroundColor';
    }
    else if (borderStyle && !/^(black|white)$/.test(borderStyle)) {
        errMsg = 'borderStyle';
    }
    if (errMsg) {
        return handle.fail({ errMsg: `invalid ${errMsg}` });
    }
    if (!tabConf) {
        return handle.fail();
    }
    const obj = {};
    if (color)
        obj.color = color;
    if (selectedColor)
        obj.selectedColor = selectedColor;
    if (backgroundColor)
        obj.backgroundColor = backgroundColor;
    if (borderStyle)
        obj.borderStyle = borderStyle;
    return new Promise((resolve, reject) => {
        Taro__default['default'].eventCenter.trigger('__taroSetTabBarStyle', {
            color,
            selectedColor,
            backgroundColor,
            borderStyle,
            successHandler: (res = {}) => handle.success(res, resolve),
            errorHandler: (res = {}) => handle.fail(res, reject)
        });
    });
};
/**
 * ???????????? tabBar ??????????????????
 */
const setTabBarItem = (options) => {
    // options must be an Object
    const isObject = shouldBeObject(options);
    if (!isObject.flag) {
        const res = { errMsg: `setTabBarItem:fail ${isObject.msg}` };
        console.error(res.errMsg);
        return Promise.reject(res);
    }
    const { index, text, iconPath, selectedIconPath, success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'setTabBarItem', success, fail, complete });
    if (typeof index !== 'number') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'index',
                correct: 'Number',
                wrong: index
            })
        });
    }
    return new Promise((resolve, reject) => {
        Taro__default['default'].eventCenter.trigger('__taroSetTabBarItem', {
            index,
            text,
            iconPath,
            selectedIconPath,
            successHandler: (res = {}) => handle.success(res, resolve),
            errorHandler: (res = {}) => handle.fail(res, reject)
        });
    });
};
/**
 * ??? tabBar ?????????????????????????????????
 */
const setTabBarBadge = (options) => {
    // options must be an Object
    const isObject = shouldBeObject(options);
    if (!isObject.flag) {
        const res = { errMsg: `setTabBarBadge:fail ${isObject.msg}` };
        console.error(res.errMsg);
        return Promise.reject(res);
    }
    const { index, text, success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'setTabBarBadge', success, fail, complete });
    if (typeof index !== 'number') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'index',
                correct: 'Number',
                wrong: index
            })
        });
    }
    if (typeof text !== 'string') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'text',
                correct: 'String',
                wrong: text
            })
        });
    }
    return new Promise((resolve, reject) => {
        Taro__default['default'].eventCenter.trigger('__taroSetTabBarBadge', {
            index,
            text,
            successHandler: (res = {}) => handle.success(res, resolve),
            errorHandler: (res = {}) => handle.fail(res, reject)
        });
    });
};
/**
 * ?????? tabBar ???????????????????????????
 */
const removeTabBarBadge = (options) => {
    // options must be an Object
    const isObject = shouldBeObject(options);
    if (!isObject.flag) {
        const res = { errMsg: `removeTabBarBadge:fail ${isObject.msg}` };
        console.error(res.errMsg);
        return Promise.reject(res);
    }
    const { index, success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'removeTabBarBadge', success, fail, complete });
    if (typeof index !== 'number') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'index',
                correct: 'Number',
                wrong: index
            })
        });
    }
    return new Promise((resolve, reject) => {
        Taro__default['default'].eventCenter.trigger('__taroRemoveTabBarBadge', {
            index,
            successHandler: (res = {}) => handle.success(res, resolve),
            errorHandler: (res = {}) => handle.fail(res, reject)
        });
    });
};
/**
 * ?????? tabBar ??????????????????????????????
 */
const hideTabBarRedDot = (options) => {
    // options must be an Object
    const isObject = shouldBeObject(options);
    if (!isObject.flag) {
        const res = { errMsg: `hideTabBarRedDot:fail ${isObject.msg}` };
        console.error(res.errMsg);
        return Promise.reject(res);
    }
    const { index, success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'hideTabBarRedDot', success, fail, complete });
    if (typeof index !== 'number') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'index',
                correct: 'Number',
                wrong: index
            })
        });
    }
    return new Promise((resolve, reject) => {
        Taro__default['default'].eventCenter.trigger('__taroHideTabBarRedDotHandler', {
            index,
            successHandler: (res = {}) => handle.success(res, resolve),
            errorHandler: (res = {}) => handle.fail(res, reject)
        });
    });
};
/**
 * ?????? tabBar
 */
const hideTabBar = (options = {}) => {
    // options must be an Object
    const isObject = shouldBeObject(options);
    if (!isObject.flag) {
        const res = { errMsg: `hideTabBar:fail ${isObject.msg}` };
        console.error(res.errMsg);
        return Promise.reject(res);
    }
    const { animation, success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'hideTabBar', success, fail, complete });
    if (options.hasOwnProperty('animation') && typeof animation !== 'boolean') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'animation',
                correct: 'Boolean',
                wrong: animation
            })
        });
    }
    return new Promise((resolve, reject) => {
        Taro__default['default'].eventCenter.trigger('__taroHideTabBar', {
            animation,
            successHandler: (res = {}) => handle.success(res, resolve),
            errorHandler: (res = {}) => handle.fail(res, reject)
        });
    });
};

const callbackManager = new CallbackManager();
const resizeListener = () => {
    callbackManager.trigger({
        windowWidth: window.screen.width,
        windowHeight: window.screen.height
    });
};
/**
 * ?????????????????????????????????????????? PC ????????????????????????????????????
 */
const setWindowSize = temporarilyNotSupport('setWindowSize');
/**
 * ??????????????????????????????
 */
const onWindowResize = callback => {
    callbackManager.add(callback);
    if (callbackManager.count() === 1) {
        window.addEventListener('resize', resizeListener);
    }
};
/**
 * ????????????????????????????????????
 */
const offWindowResize = callback => {
    callbackManager.remove(callback);
    if (callbackManager.count() === 0) {
        window.removeEventListener('resize', resizeListener);
    }
};

class Toast {
    constructor() {
        this.options = {
            title: '',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false
        };
        this.style = {
            maskStyle: {
                position: 'fixed',
                'z-index': '1000',
                top: '0',
                right: '0',
                left: '0',
                bottom: '0'
            },
            toastStyle: {
                'z-index': '5000',
                'box-sizing': 'border-box',
                display: 'flex',
                'flex-direction': 'column',
                'justify-content': 'center',
                '-webkit-justify-content': 'center',
                position: 'fixed',
                top: '50%',
                left: '50%',
                'min-width': '120px',
                'max-width': '200px',
                'min-height': '120px',
                padding: '15px',
                transform: 'translate(-50%, -50%)',
                'border-radius': '5px',
                'text-align': 'center',
                'line-height': '1.6',
                color: '#FFFFFF',
                background: 'rgba(17, 17, 17, 0.7)'
            },
            successStyle: {
                margin: '6px auto',
                width: '38px',
                height: '38px',
                background: 'transparent url(data:image/svg+xml;base64,PHN2ZyB0PSIxNjM5NTQ4OTYzMjA0IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQzNDgiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNMjE5Ljk1MiA1MTIuNTc2bDIxMC40MzIgMjEwLjQzMi00NS4yNDggNDUuMjU2LTIxMC40MzItMjEwLjQzMnoiIHAtaWQ9IjQzNDkiIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD48cGF0aCBkPSJNNzk5LjY3MiAyNjIuMjY0bDQ1LjI1NiA0NS4yNTYtNDYwLjQ2NCA0NjAuNDY0LTQ1LjI1Ni00NS4yNTZ6IiBwLWlkPSI0MzUwIiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PC9zdmc+) no-repeat',
                'background-size': '100%'
            },
            errrorStyle: {
                margin: '6px auto',
                width: '38px',
                height: '38px',
                background: 'transparent url(data:image/svg+xml;base64,PHN2ZyB0PSIxNjM5NTUxMDU1MTgzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE0MDc2IiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTUxMiA2NEMyNjQuNTggNjQgNjQgMjY0LjU4IDY0IDUxMnMyMDAuNTggNDQ4IDQ0OCA0NDggNDQ4LTIwMC41OCA0NDgtNDQ4Uzc1OS40MiA2NCA1MTIgNjR6IG0wIDc1MmEzNiAzNiAwIDEgMSAzNi0zNiAzNiAzNiAwIDAgMS0zNiAzNnogbTUxLjgzLTU1MS45NUw1NDggNjM2YTM2IDM2IDAgMCAxLTcyIDBsLTE1LjgzLTM3MS45NWMtMC4xLTEuMzMtMC4xNy0yLjY4LTAuMTctNC4wNWE1MiA1MiAwIDAgMSAxMDQgMGMwIDEuMzctMC4wNyAyLjcyLTAuMTcgNC4wNXoiIHAtaWQ9IjE0MDc3IiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PC9zdmc+) no-repeat',
                'background-size': '100%'
            },
            loadingStyle: {
                margin: '6px auto',
                width: '38px',
                height: '38px',
                '-webkit-animation': 'taroLoading 1s steps(12, end) infinite',
                animation: 'taroLoading 1s steps(12, end) infinite',
                background: 'transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat',
                'background-size': '100%'
            },
            imageStyle: {
                margin: '6px auto',
                width: '40px',
                height: '40px',
                background: 'transparent no-repeat',
                'background-size': '100%'
            },
            textStyle: {
                margin: '0',
                'font-size': '16px'
            }
        };
    }
    create(options = {}, _type = 'toast') {
        // style
        const { maskStyle, toastStyle, successStyle, errrorStyle, loadingStyle, imageStyle, textStyle } = this.style;
        // configuration
        const config = {
            ...this.options,
            ...options,
            _type
        };
        // wrapper
        this.el = document.createElement('div');
        this.el.className = 'taro__toast';
        this.el.style.opacity = '0';
        this.el.style.transition = 'opacity 0.1s linear';
        // mask
        this.mask = document.createElement('div');
        this.mask.setAttribute('style', inlineStyle(maskStyle));
        this.mask.style.display = config.mask ? 'block' : 'none';
        // icon
        this.icon = document.createElement('p');
        if (config.image) {
            this.icon.setAttribute('style', inlineStyle({
                ...imageStyle,
                'background-image': `url(${config.image})`
            }));
        }
        else {
            const iconStyle = config.icon === 'loading' ? loadingStyle : config.icon === 'error' ? errrorStyle : successStyle;
            this.icon.setAttribute('style', inlineStyle({
                ...iconStyle,
                ...(config.icon === 'none' ? { display: 'none' } : {})
            }));
        }
        // toast
        this.toast = document.createElement('div');
        this.toast.setAttribute('style', inlineStyle({
            ...toastStyle,
            ...(config.icon === 'none' ? {
                'min-height': '0',
                padding: '10px 15px'
            } : {})
        }));
        // title
        this.title = document.createElement('p');
        this.title.setAttribute('style', inlineStyle(textStyle));
        this.title.textContent = config.title;
        // result
        this.toast.appendChild(this.icon);
        this.toast.appendChild(this.title);
        this.el.appendChild(this.mask);
        this.el.appendChild(this.toast);
        // show immediately
        document.body.appendChild(this.el);
        setTimeout(() => { this.el.style.opacity = '1'; }, 0);
        this.type = config._type;
        // disappear after duration
        config.duration >= 0 && this.hide(config.duration, this.type);
        return '';
    }
    show(options = {}, _type = 'toast') {
        const config = {
            ...this.options,
            ...options,
            _type
        };
        if (this.hideOpacityTimer)
            clearTimeout(this.hideOpacityTimer);
        if (this.hideDisplayTimer)
            clearTimeout(this.hideDisplayTimer);
        // title
        this.title.textContent = config.title || '';
        // mask
        this.mask.style.display = config.mask ? 'block' : 'none';
        // image
        const { toastStyle, successStyle, errrorStyle, loadingStyle, imageStyle } = this.style;
        if (config.image) {
            this.icon.setAttribute('style', inlineStyle({
                ...imageStyle,
                'background-image': `url(${config.image})`
            }));
        }
        else {
            if (!config.image && config.icon) {
                const iconStyle = config.icon === 'loading' ? loadingStyle : config.icon === 'error' ? errrorStyle : successStyle;
                this.icon.setAttribute('style', inlineStyle({
                    ...iconStyle,
                    ...(config.icon === 'none' ? { display: 'none' } : {})
                }));
            }
        }
        // toast
        this.toast.setAttribute('style', inlineStyle({
            ...toastStyle,
            ...(config.icon === 'none' ? {
                'min-height': '0',
                padding: '10px 15px'
            } : {})
        }));
        // show
        this.el.style.display = 'block';
        setTimeout(() => { this.el.style.opacity = '1'; }, 0);
        this.type = config._type;
        // disappear after duration
        config.duration >= 0 && this.hide(config.duration, this.type);
        return '';
    }
    hide(duration = 0, type) {
        if (this.type !== type)
            return;
        if (this.hideOpacityTimer)
            clearTimeout(this.hideOpacityTimer);
        if (this.hideDisplayTimer)
            clearTimeout(this.hideDisplayTimer);
        this.hideOpacityTimer = setTimeout(() => {
            this.el.style.opacity = '0';
            this.hideDisplayTimer = setTimeout(() => { this.el.style.display = 'none'; }, 100);
        }, duration);
    }
}

class Modal {
    constructor() {
        this.options = {
            title: '',
            content: '',
            showCancel: true,
            cancelText: '??????',
            cancelColor: '#000000',
            confirmText: '??????',
            confirmColor: '#3CC51F'
        };
        this.style = {
            maskStyle: {
                position: 'fixed',
                'z-index': '1000',
                top: '0',
                right: '0',
                left: '0',
                bottom: '0',
                background: 'rgba(0,0,0,0.6)'
            },
            modalStyle: {
                'z-index': '4999',
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                'max-width': '300px',
                'border-radius': '3px',
                'text-align': 'center',
                'line-height': '1.6',
                overflow: 'hidden',
                background: '#FFFFFF'
            },
            titleStyle: {
                padding: '20px 24px 9px',
                'font-size': '18px'
            },
            textStyle: {
                padding: '0 24px 12px',
                'min-height': '40px',
                'font-size': '15px',
                'line-height': '1.3',
                color: '#808080'
            },
            footStyle: {
                position: 'relative',
                'line-height': '48px',
                'font-size': '18px',
                display: 'flex'
            },
            btnStyle: {
                position: 'relative',
                '-webkit-box-flex': '1',
                '-webkit-flex': '1',
                flex: '1'
            }
        };
    }
    create(options = {}) {
        return new Promise((resolve) => {
            // style
            const { maskStyle, modalStyle, titleStyle, textStyle, footStyle, btnStyle } = this.style;
            // configuration
            const config = {
                ...this.options,
                ...options
            };
            // wrapper
            this.el = document.createElement('div');
            this.el.className = 'taro__modal';
            this.el.style.opacity = '0';
            this.el.style.transition = 'opacity 0.2s linear';
            // mask
            const mask = document.createElement('div');
            mask.className = 'taro-modal__mask';
            mask.setAttribute('style', inlineStyle(maskStyle));
            // modal
            const modal = document.createElement('div');
            modal.className = 'taro-modal__content';
            modal.setAttribute('style', inlineStyle(modalStyle));
            // title
            const titleCSS = config.title ? titleStyle : {
                ...titleStyle,
                display: 'none'
            };
            this.title = document.createElement('div');
            this.title.className = 'taro-modal__title';
            this.title.setAttribute('style', inlineStyle(titleCSS));
            this.title.textContent = config.title;
            // text
            const textCSS = config.title ? textStyle : {
                ...textStyle,
                padding: '40px 20px 26px',
                color: '#353535'
            };
            this.text = document.createElement('div');
            this.text.className = 'taro-modal__text';
            this.text.setAttribute('style', inlineStyle(textCSS));
            this.text.textContent = config.content;
            // foot
            const foot = document.createElement('div');
            foot.className = 'taro-modal__foot';
            foot.setAttribute('style', inlineStyle(footStyle));
            // cancel button
            const cancelCSS = {
                ...btnStyle,
                color: config.cancelColor,
                display: config.showCancel ? 'block' : 'none'
            };
            this.cancel = document.createElement('div');
            this.cancel.className = 'taro-model__btn taro-model__cancel';
            this.cancel.setAttribute('style', inlineStyle(cancelCSS));
            this.cancel.textContent = config.cancelText;
            this.cancel.onclick = () => {
                this.hide();
                resolve('cancel');
            };
            // confirm button
            this.confirm = document.createElement('div');
            this.confirm.className = 'taro-model__btn taro-model__confirm';
            this.confirm.setAttribute('style', inlineStyle(btnStyle));
            this.confirm.style.color = config.confirmColor;
            this.confirm.textContent = config.confirmText;
            this.confirm.onclick = () => {
                this.hide();
                resolve('confirm');
            };
            // result
            foot.appendChild(this.cancel);
            foot.appendChild(this.confirm);
            modal.appendChild(this.title);
            modal.appendChild(this.text);
            modal.appendChild(foot);
            this.el.appendChild(mask);
            this.el.appendChild(modal);
            // show immediately
            document.body.appendChild(this.el);
            setTimeout(() => { this.el.style.opacity = '1'; }, 0);
        });
    }
    show(options = {}) {
        return new Promise((resolve) => {
            const config = {
                ...this.options,
                ...options
            };
            if (this.hideOpacityTimer)
                clearTimeout(this.hideOpacityTimer);
            if (this.hideDisplayTimer)
                clearTimeout(this.hideDisplayTimer);
            // title & text
            const { textStyle } = this.style;
            if (config.title) {
                this.title.textContent = config.title;
                // none => block
                this.title.style.display = 'block';
                this.text.setAttribute('style', inlineStyle(textStyle));
            }
            else {
                // block => none
                this.title.style.display = 'none';
                const textCSS = {
                    ...textStyle,
                    padding: '40px 20px 26px',
                    color: '#353535'
                };
                this.text.setAttribute('style', inlineStyle(textCSS));
            }
            this.text.textContent = config.content || '';
            // showCancel
            this.cancel.style.display = config.showCancel ? 'block' : 'none';
            // cancelText
            this.cancel.textContent = config.cancelText || '';
            // cancelColor
            this.cancel.style.color = config.cancelColor || '';
            // confirmText
            this.confirm.textContent = config.confirmText || '';
            // confirmColor
            this.confirm.style.color = config.confirmColor || '';
            // cbs
            this.cancel.onclick = () => {
                this.hide();
                resolve('cancel');
            };
            this.confirm.onclick = () => {
                this.hide();
                resolve('confirm');
            };
            // show
            this.el.style.display = 'block';
            setTimeout(() => { this.el.style.opacity = '1'; }, 0);
        });
    }
    hide() {
        if (this.hideOpacityTimer)
            clearTimeout(this.hideOpacityTimer);
        if (this.hideDisplayTimer)
            clearTimeout(this.hideDisplayTimer);
        this.hideOpacityTimer = setTimeout(() => {
            this.el.style.opacity = '0';
            this.hideDisplayTimer = setTimeout(() => { this.el.style.display = 'none'; }, 200);
        }, 0);
    }
}

const noop = function () { };
class ActionSheet {
    constructor() {
        this.options = {
            itemList: [],
            itemColor: '#000000',
            success: noop,
            fail: noop,
            complete: noop
        };
        this.style = {
            maskStyle: {
                position: 'fixed',
                'z-index': '1000',
                top: '0',
                right: '0',
                left: '0',
                bottom: '0',
                background: 'rgba(0,0,0,0.6)'
            },
            actionSheetStyle: {
                'z-index': '4999',
                position: 'fixed',
                left: '0',
                bottom: '0',
                '-webkit-transform': 'translate(0, 100%)',
                transform: 'translate(0, 100%)',
                width: '100%',
                'line-height': '1.6',
                background: '#EFEFF4',
                '-webkit-transition': '-webkit-transform .3s',
                transition: 'transform .3s'
            },
            menuStyle: {
                'background-color': '#FCFCFD'
            },
            cellStyle: {
                position: 'relative',
                padding: '10px 0',
                'text-align': 'center',
                'font-size': '18px'
            },
            cancelStyle: {
                'margin-top': '6px',
                padding: '10px 0',
                'text-align': 'center',
                'font-size': '18px',
                color: '#000000',
                'background-color': '#FCFCFD'
            }
        };
        this.lastConfig = {};
    }
    create(options = {}) {
        return new Promise((resolve) => {
            // style
            const { maskStyle, actionSheetStyle, menuStyle, cellStyle, cancelStyle } = this.style;
            // configuration
            const config = {
                ...this.options,
                ...options
            };
            this.lastConfig = config;
            // wrapper
            this.el = document.createElement('div');
            this.el.className = 'taro__actionSheet';
            this.el.style.opacity = '0';
            this.el.style.transition = 'opacity 0.2s linear';
            // mask
            const mask = document.createElement('div');
            mask.setAttribute('style', inlineStyle(maskStyle));
            // actionSheet
            this.actionSheet = document.createElement('div');
            this.actionSheet.setAttribute('style', inlineStyle(actionSheetStyle));
            // menu
            this.menu = document.createElement('div');
            this.menu.setAttribute('style', inlineStyle({
                ...menuStyle,
                color: config.itemColor
            }));
            // cells
            this.cells = config.itemList.map((item, index) => {
                const cell = document.createElement('div');
                cell.className = 'taro-actionsheet__cell';
                cell.setAttribute('style', inlineStyle(cellStyle));
                cell.textContent = item;
                cell.dataset.tapIndex = `${index}`;
                cell.onclick = e => {
                    this.hide();
                    const target = e.currentTarget;
                    const index = Number(target === null || target === void 0 ? void 0 : target.dataset.tapIndex) || 0;
                    resolve(index);
                };
                return cell;
            });
            // cancel
            this.cancel = document.createElement('div');
            this.cancel.setAttribute('style', inlineStyle(cancelStyle));
            this.cancel.textContent = '??????';
            // result
            this.cells.forEach(item => this.menu.appendChild(item));
            this.actionSheet.appendChild(this.menu);
            this.actionSheet.appendChild(this.cancel);
            this.el.appendChild(mask);
            this.el.appendChild(this.actionSheet);
            // callbacks
            const cb = () => {
                this.hide();
                resolve('cancel');
            };
            mask.onclick = cb;
            this.cancel.onclick = cb;
            // show immediately
            document.body.appendChild(this.el);
            setTimeout(() => {
                this.el.style.opacity = '1';
                setTransform(this.actionSheet, 'translate(0, 0)');
            }, 0);
        });
    }
    show(options = {}) {
        return new Promise((resolve) => {
            const config = {
                ...this.options,
                ...options
            };
            this.lastConfig = config;
            if (this.hideOpacityTimer)
                clearTimeout(this.hideOpacityTimer);
            if (this.hideDisplayTimer)
                clearTimeout(this.hideDisplayTimer);
            // itemColor
            if (config.itemColor)
                this.menu.style.color = config.itemColor;
            // cells
            const { cellStyle } = this.style;
            config.itemList.forEach((item, index) => {
                let cell;
                if (this.cells[index]) {
                    // assign new content
                    cell = this.cells[index];
                }
                else {
                    // create new cell
                    cell = document.createElement('div');
                    cell.className = 'taro-actionsheet__cell';
                    cell.setAttribute('style', inlineStyle(cellStyle));
                    cell.dataset.tapIndex = `${index}`;
                    this.cells.push(cell);
                    this.menu.appendChild(cell);
                }
                cell.textContent = item;
                cell.onclick = e => {
                    this.hide();
                    const target = e.currentTarget;
                    const index = Number(target === null || target === void 0 ? void 0 : target.dataset.tapIndex) || 0;
                    resolve(index);
                };
            });
            const cellsLen = this.cells.length;
            const itemListLen = config.itemList.length;
            if (cellsLen > itemListLen) {
                for (let i = itemListLen; i < cellsLen; i++) {
                    this.menu.removeChild(this.cells[i]);
                }
                this.cells.splice(itemListLen);
            }
            // show
            this.el.style.display = 'block';
            setTimeout(() => {
                this.el.style.opacity = '1';
                setTransform(this.actionSheet, 'translate(0, 0)');
            }, 0);
        });
    }
    hide() {
        if (this.hideOpacityTimer)
            clearTimeout(this.hideOpacityTimer);
        if (this.hideDisplayTimer)
            clearTimeout(this.hideDisplayTimer);
        this.hideOpacityTimer = setTimeout(() => {
            this.el.style.opacity = '0';
            setTransform(this.actionSheet, 'translate(0, 100%)');
            this.hideDisplayTimer = setTimeout(() => { this.el.style.display = 'none'; }, 200);
        }, 0);
    }
}

// ??????
let status = 'default';
// inject necessary style
function init(doc) {
    if (status === 'ready')
        return;
    const taroStyle = doc.createElement('style');
    taroStyle.textContent = '@font-face{font-weight:normal;font-style:normal;font-family:"taro";src:url("data:application/x-font-ttf;charset=utf-8;base64, AAEAAAALAIAAAwAwR1NVQrD+s+0AAAE4AAAAQk9TLzJWs0t/AAABfAAAAFZjbWFwqVgGvgAAAeAAAAGGZ2x5Zph7qG0AAANwAAAAdGhlYWQRFoGhAAAA4AAAADZoaGVhCCsD7AAAALwAAAAkaG10eAg0AAAAAAHUAAAADGxvY2EADAA6AAADaAAAAAhtYXhwAQ4AJAAAARgAAAAgbmFtZYrphEEAAAPkAAACVXBvc3S3shtSAAAGPAAAADUAAQAAA+gAAABaA+gAAAAAA+gAAQAAAAAAAAAAAAAAAAAAAAMAAQAAAAEAAADih+FfDzz1AAsD6AAAAADXB57LAAAAANcHnssAAP/sA+gDOgAAAAgAAgAAAAAAAAABAAAAAwAYAAEAAAAAAAIAAAAKAAoAAAD/AAAAAAAAAAEAAAAKAB4ALAABREZMVAAIAAQAAAAAAAAAAQAAAAFsaWdhAAgAAAABAAAAAQAEAAQAAAABAAgAAQAGAAAAAQAAAAAAAQK8AZAABQAIAnoCvAAAAIwCegK8AAAB4AAxAQIAAAIABQMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUGZFZABAAHjqCAPoAAAAWgPoABQAAAABAAAAAAAAA+gAAABkAAAD6AAAAAAABQAAAAMAAAAsAAAABAAAAV4AAQAAAAAAWAADAAEAAAAsAAMACgAAAV4ABAAsAAAABgAEAAEAAgB46gj//wAAAHjqCP//AAAAAAABAAYABgAAAAEAAgAAAQYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAKAAAAAAAAAACAAAAeAAAAHgAAAABAADqCAAA6ggAAAACAAAAAAAAAAwAOgABAAD/7AAyABQAAgAANzMVFB4UKAAAAAABAAAAAAO7AzoAFwAAEy4BPwE+AR8BFjY3ATYWFycWFAcBBiInPQoGBwUHGgzLDCELAh0LHwsNCgr9uQoeCgGzCyEOCw0HCZMJAQoBvgkCCg0LHQv9sQsKAAAAAAAAEgDeAAEAAAAAAAAAHQAAAAEAAAAAAAEABAAdAAEAAAAAAAIABwAhAAEAAAAAAAMABAAoAAEAAAAAAAQABAAsAAEAAAAAAAUACwAwAAEAAAAAAAYABAA7AAEAAAAAAAoAKwA/AAEAAAAAAAsAEwBqAAMAAQQJAAAAOgB9AAMAAQQJAAEACAC3AAMAAQQJAAIADgC/AAMAAQQJAAMACADNAAMAAQQJAAQACADVAAMAAQQJAAUAFgDdAAMAAQQJAAYACADzAAMAAQQJAAoAVgD7AAMAAQQJAAsAJgFRCiAgQ3JlYXRlZCBieSBmb250LWNhcnJpZXIKICB3ZXVpUmVndWxhcndldWl3ZXVpVmVyc2lvbiAxLjB3ZXVpR2VuZXJhdGVkIGJ5IHN2ZzJ0dGYgZnJvbSBGb250ZWxsbyBwcm9qZWN0Lmh0dHA6Ly9mb250ZWxsby5jb20ACgAgACAAQwByAGUAYQB0AGUAZAAgAGIAeQAgAGYAbwBuAHQALQBjAGEAcgByAGkAZQByAAoAIAAgAHcAZQB1AGkAUgBlAGcAdQBsAGEAcgB3AGUAdQBpAHcAZQB1AGkAVgBlAHIAcwBpAG8AbgAgADEALgAwAHcAZQB1AGkARwBlAG4AZQByAGEAdABlAGQAIABiAHkAIABzAHYAZwAyAHQAdABmACAAZgByAG8AbQAgAEYAbwBuAHQAZQBsAGwAbwAgAHAAcgBvAGoAZQBjAHQALgBoAHQAdABwADoALwAvAGYAbwBuAHQAZQBsAGwAbwAuAGMAbwBtAAAAAAIAAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwECAQMBBAABeAd1bmlFQTA4AAAAAAA=") format("truetype");}@-webkit-keyframes taroLoading{0%{-webkit-transform:rotate3d(0, 0, 1, 0deg);}100%{-webkit-transform:rotate3d(0, 0, 1, 360deg);transform:rotate3d(0, 0, 1, 360deg);}}@keyframes taroLoading{0%{-webkit-transform:rotate3d(0, 0, 1, 0deg);}100%{-webkit-transform:rotate3d(0, 0, 1, 360deg);transform:rotate3d(0, 0, 1, 360deg);}}.taro-modal__foot:after {content: "";position: absolute;left: 0;top: 0;right: 0;height: 1px;border-top: 1px solid #D5D5D6;color: #D5D5D6;-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);} .taro-model__btn:active {background-color: #EEEEEE}.taro-model__btn:not(:first-child):after {content: "";position: absolute;left: 0;top: 0;width: 1px;bottom: 0;border-left: 1px solid #D5D5D6;color: #D5D5D6;-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleX(0.5);transform: scaleX(0.5);}.taro-actionsheet__cell:not(:first-child):after {content: "";position: absolute;left: 0;top: 0;right: 0;height: 1px;border-top: 1px solid #e5e5e5;color: #e5e5e5;-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);}';
    doc.querySelector('head').appendChild(taroStyle);
    status = 'ready';
}
const toast = new Toast();
const modal = new Modal();
const actionSheet = new ActionSheet();
const showToast = (options = { title: '' }) => {
    init(document);
    options = Object.assign({
        title: '',
        icon: 'success',
        image: '',
        duration: 1500,
        mask: false
    }, options);
    const { success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'showToast', success, fail, complete });
    if (typeof options.title !== 'string') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'title',
                correct: 'String',
                wrong: options.title
            })
        });
    }
    if (typeof options.duration !== 'number') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'duration',
                correct: 'Number',
                wrong: options.duration
            })
        });
    }
    if (options.image && typeof options.image !== 'string')
        options.image = '';
    options.mask = !!options.mask;
    let errMsg = '';
    if (!toast.el) {
        errMsg = toast.create(options, 'toast');
    }
    else {
        errMsg = toast.show(options, 'toast');
    }
    return handle.success({ errMsg });
};
const hideToast = ({ success, fail, complete } = {}) => {
    const handle = new MethodHandler({ name: 'hideToast', success, fail, complete });
    if (!toast.el)
        return handle.success();
    toast.hide(0, 'toast');
    return handle.success();
};
const showLoading = (options = { title: '' }) => {
    init(document);
    options = Object.assign({
        title: '',
        mask: false
    }, options);
    const { success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'showLoading', success, fail, complete });
    const config = {
        icon: 'loading',
        image: '',
        duration: -1
    };
    options = Object.assign({}, options, config);
    if (typeof options.title !== 'string') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'title',
                correct: 'String',
                wrong: options.title
            })
        });
    }
    options.mask = !!options.mask;
    let errMsg = '';
    if (!toast.el) {
        errMsg = toast.create(options, 'loading');
    }
    else {
        errMsg = toast.show(options, 'loading');
    }
    return handle.success({ errMsg });
};
const hideLoading = ({ success, fail, complete } = {}) => {
    const handle = new MethodHandler({ name: 'hideLoading', success, fail, complete });
    if (!toast.el)
        return handle.success();
    toast.hide(0, 'loading');
    return handle.success();
};
const showModal = async (options = {}) => {
    init(document);
    options = Object.assign({
        title: '',
        content: '',
        showCancel: true,
        cancelText: '??????',
        cancelColor: '#000000',
        confirmText: '??????',
        confirmColor: '#3CC51F'
    }, options);
    const { success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'showModal', success, fail, complete });
    if (typeof options.title !== 'string') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'title',
                correct: 'String',
                wrong: options.title
            })
        });
    }
    if (typeof options.content !== 'string') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'content',
                correct: 'String',
                wrong: options.content
            })
        });
    }
    if (typeof options.cancelText !== 'string') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'cancelText',
                correct: 'String',
                wrong: options.cancelText
            })
        });
    }
    if (options.cancelText.replace(/[\u0391-\uFFE5]/g, 'aa').length > 8) {
        return handle.fail({
            errMsg: 'cancelText length should not larger then 4 Chinese characters'
        });
    }
    if (typeof options.confirmText !== 'string') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'confirmText',
                correct: 'String',
                wrong: options.confirmText
            })
        });
    }
    if (options.confirmText.replace(/[\u0391-\uFFE5]/g, 'aa').length > 8) {
        return handle.fail({
            errMsg: 'confirmText length should not larger then 4 Chinese characters'
        });
    }
    if (typeof options.cancelColor !== 'string') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'cancelColor',
                correct: 'String',
                wrong: options.cancelColor
            })
        });
    }
    if (typeof options.confirmColor !== 'string') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'confirmColor',
                correct: 'String',
                wrong: options.confirmColor
            })
        });
    }
    options.showCancel = !!options.showCancel;
    let result = '';
    if (!modal.el) {
        result = await modal.create(options);
    }
    else {
        result = await modal.show(options);
    }
    const res = { cancel: !1, confirm: !1 };
    res[result] = !0;
    return handle.success(res);
};
function hideModal() {
    if (!modal.el)
        return;
    modal.hide();
}
const showActionSheet = async (options = { itemList: [] }) => {
    init(document);
    options = Object.assign({
        itemColor: '#000000',
        itemList: []
    }, options);
    const { success, fail, complete } = options;
    const handle = new MethodHandler({ name: 'showActionSheet', success, fail, complete });
    // list item String
    if (!Array.isArray(options.itemList)) {
        return handle.fail({
            errMsg: getParameterError({
                para: 'itemList',
                correct: 'Array',
                wrong: options.itemList
            })
        });
    }
    if (options.itemList.length < 1) {
        return handle.fail({ errMsg: 'parameter error: parameter.itemList should have at least 1 item' });
    }
    if (options.itemList.length > 6) {
        return handle.fail({ errMsg: 'parameter error: parameter.itemList should not be large than 6' });
    }
    for (let i = 0; i < options.itemList.length; i++) {
        if (typeof options.itemList[i] !== 'string') {
            return handle.fail({
                errMsg: getParameterError({
                    para: `itemList[${i}]`,
                    correct: 'String',
                    wrong: options.itemList[i]
                })
            });
        }
    }
    if (typeof options.itemColor !== 'string') {
        return handle.fail({
            errMsg: getParameterError({
                para: 'itemColor',
                correct: 'String',
                wrong: options.itemColor
            })
        });
    }
    let result = '';
    if (!actionSheet.el) {
        result = await actionSheet.create(options);
    }
    else {
        result = await actionSheet.show(options);
    }
    if (typeof result === 'string') {
        return handle.fail(({ errMsg: result }));
    }
    else {
        return handle.success(({ tapIndex: result }));
    }
};
Taro__default['default'].eventCenter.on('__taroRouterChange', () => {
    hideToast();
    hideLoading();
    hideModal();
});
const enableAlertBeforeUnload = temporarilyNotSupport('enableAlertBeforeUnload');
const disableAlertBeforeUnload = temporarilyNotSupport('disableAlertBeforeUnload');

// Worker
const createWorker = temporarilyNotSupport('createWorker');

class NodesRef {
    constructor(selector, querySelectorQuery, single) {
        this._component = querySelectorQuery._component;
        this._selector = selector;
        this._selectorQuery = querySelectorQuery;
        this._single = single;
    }
    context(cb) {
        const { _selector, _component, _single, _selectorQuery } = this;
        _selectorQuery._push(_selector, _component, _single, { context: !0 }, cb);
        return _selectorQuery;
    }
    node(cb) {
        const { _selector, _component, _single, _selectorQuery } = this;
        _selectorQuery._push(_selector, _component, _single, { nodeCanvasType: !0, node: !0 }, cb);
        return _selectorQuery;
    }
    boundingClientRect(cb) {
        const { _selector, _component, _single, _selectorQuery } = this;
        _selectorQuery._push(_selector, _component, _single, { id: !0, dataset: !0, rect: !0, size: !0 }, cb);
        return _selectorQuery;
    }
    scrollOffset(cb) {
        const { _selector, _component, _single, _selectorQuery } = this;
        _selectorQuery._push(_selector, _component, _single, { id: !0, dataset: !0, scrollOffset: !0 }, cb);
        return _selectorQuery;
    }
    fields(fields, cb) {
        const { _selector, _component, _single, _selectorQuery } = this;
        const { id, dataset, rect, size, scrollOffset, properties = [], computedStyle = [] } = fields;
        _selectorQuery._push(_selector, _component, _single, {
            id,
            dataset,
            rect,
            size,
            scrollOffset,
            properties,
            computedStyle
        }, cb);
        return _selectorQuery;
    }
}

function filter(fields, dom, selector) {
    if (!dom)
        return null;
    const isViewport = selector === '.taro_page';
    const { id, dataset, rect, size, scrollOffset, properties = [], computedStyle = [], nodeCanvasType, node, context } = fields;
    const res = {};
    if (nodeCanvasType && node) {
        const tagName = dom.tagName;
        res.node = {
            id: dom.id,
            $taroElement: dom
        };
        if (/^taro-canvas-core/i.test(tagName)) {
            const type = dom.type || '';
            res.nodeCanvasType = type;
            const canvas = dom.getElementsByTagName('canvas')[0];
            if (/^(2d|webgl)/i.test(type) && canvas) {
                res.node = canvas;
            }
            else {
                res.node = null;
            }
        }
        else {
            // TODO https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html
            // if (/^taro-scroll-view-core/i.test(tagName))
            res.nodeCanvasType = '';
            res.node = dom;
        }
        return res;
    }
    if (context) {
        const tagName = dom.tagName;
        if (/^taro-video-core/i.test(tagName)) {
            // TODO HTMLVideoElement to VideoContext
            return { context: dom };
        }
        else if (/^taro-canvas-core/i.test(tagName)) {
            const type = dom.type || '2d';
            const canvas = dom === null || dom === void 0 ? void 0 : dom.querySelector('canvas');
            const ctx = canvas === null || canvas === void 0 ? void 0 : canvas.getContext(type);
            return { context: new CanvasContext(canvas, ctx) };
        }
        else if (/^taro-live-player-core/i.test(tagName)) {
            console.error('????????????????????? NodesRef.context ?????? LivePlayerContext');
        }
        else if (/^taro-editor-core/i.test(tagName)) {
            console.error('????????????????????? NodesRef.context ?????? EditorContext');
        }
        else if (/^taro-map-core/i.test(tagName)) {
            console.error('????????????????????? NodesRef.context ?????? MapContext');
        }
        return;
    }
    if (id)
        res.id = dom.id;
    if (dataset)
        res.dataset = Object.assign({}, dom.dataset);
    if (rect || size) {
        const { left, right, top, bottom, width, height } = dom.getBoundingClientRect();
        if (rect) {
            if (!isViewport) {
                res.left = left;
                res.right = right;
                res.top = top;
                res.bottom = bottom;
            }
            else {
                res.left = 0;
                res.right = 0;
                res.top = 0;
                res.bottom = 0;
            }
        }
        if (size) {
            if (!isViewport) {
                res.width = width;
                res.height = height;
            }
            else {
                res.width = dom.clientWidth;
                res.height = dom.clientHeight;
            }
        }
    }
    if (scrollOffset) {
        res.scrollLeft = dom.scrollLeft;
        res.scrollTop = dom.scrollTop;
    }
    if (properties.length) {
        properties.forEach(prop => {
            const attr = dom.getAttribute(prop);
            if (attr)
                res[prop] = attr;
        });
    }
    if (computedStyle.length) {
        const styles = window.getComputedStyle(dom);
        computedStyle.forEach(key => {
            const value = styles.getPropertyValue(key) || styles[key];
            if (value)
                res[key] = value;
        });
    }
    return res;
}
/**
 * WXML????????????API
 * @return {Object} SelectorQuery ????????????
 */
function queryBat(queue, cb) {
    const result = [];
    queue.forEach(item => {
        var _a;
        const { selector, single, fields, component } = item;
        // selector ???????????????
        /* eslint-disable */
        const container = (component !== null ?
            (findDOM(component) || document) :
            document);
        /* eslint-enable */
        // ???????????? ---- ?????????
        let selectSelf = false;
        if (container !== document) {
            const $nodeList = (_a = container.parentNode) === null || _a === void 0 ? void 0 : _a.querySelectorAll(selector);
            if ($nodeList) {
                for (let i = 0, len = $nodeList.length; i < len; ++i) {
                    if (container === $nodeList[i]) {
                        selectSelf = true;
                        break;
                    }
                }
            }
        }
        if (single) {
            const el = selectSelf === true ? container : container.querySelector(selector);
            result.push(filter(fields, el, selector));
        }
        else {
            const $children = container.querySelectorAll(selector);
            const children = [];
            selectSelf === true && children.push(container);
            for (let i = 0, len = $children.length; i < len; ++i) {
                children.push($children[i]);
            }
            result.push(children.map(dom => filter(fields, dom)));
        }
    });
    cb(result);
}
class SelectorQuery {
    constructor() {
        this._defaultWebviewId = null;
        this._webviewId = null;
        this._queue = [];
        this._queueCb = [];
        this._component;
    }
    in(component) {
        this._component = component;
        return this;
    }
    select(selector) {
        // ???????????????????????????????????????????????? '>>>' ??? h5 ?????????????????????????????? '>'
        if (typeof selector === 'string')
            selector = selector.replace('>>>', '>');
        return new NodesRef(selector, this, true);
    }
    selectAll(selector) {
        // ???????????????????????????????????????????????? '>>>' ??? h5 ?????????????????????????????? '>'
        if (typeof selector === 'string')
            selector = selector.replace('>>>', '>');
        return new NodesRef(selector, this, false);
    }
    selectViewport() {
        return new NodesRef('.taro_page', this, true);
    }
    exec(cb) {
        queryBat(this._queue, res => {
            const _queueCb = this._queueCb;
            res.forEach((item, index) => {
                const cb = _queueCb[index];
                typeof cb === 'function' && cb.call(this, item);
            });
            typeof cb === 'function' && cb.call(this, res);
        });
        return this;
    }
    _push(selector, component, single, fields, callback = null) {
        this._queue.push({
            component,
            selector,
            single,
            fields
        });
        this._queueCb.push(callback);
    }
}

const createSelectorQuery = () => {
    return new SelectorQuery();
};
const createIntersectionObserver = temporarilyNotSupport('createIntersectionObserver');

// AliPay
const getOpenUserInfo = temporarilyNotSupport('getOpenUserInfo');

const setPageInfo = temporarilyNotSupport('setPageInfo');
// ??????????????? AI ??????
const ocrIdCard = temporarilyNotSupport('ocrIdCard');
const ocrBankCard = temporarilyNotSupport('ocrBankCard');
const ocrDrivingLicense = temporarilyNotSupport('ocrDrivingLicense');
const ocrVehicleLicense = temporarilyNotSupport('ocrVehicleLicense');
const textReview = temporarilyNotSupport('textReview');
const textToAudio = temporarilyNotSupport('textToAudio');
const imageAudit = temporarilyNotSupport('imageAudit');
const advancedGeneralIdentify = temporarilyNotSupport('advancedGeneralIdentify');
const objectDetectIdentify = temporarilyNotSupport('objectDetectIdentify');
const carClassify = temporarilyNotSupport('carClassify');
const dishClassify = temporarilyNotSupport('dishClassify');
const logoClassify = temporarilyNotSupport('logoClassify');
const animalClassify = temporarilyNotSupport('animalClassify');
const plantClassify = temporarilyNotSupport('plantClassify');
// ????????????
const getSwanId = temporarilyNotSupport('getSwanId');
// ?????????????????????
const requestPolymerPayment = temporarilyNotSupport('requestPolymerPayment');
// ???????????????
const navigateToSmartGameProgram = temporarilyNotSupport('navigateToSmartGameProgram');
const navigateToSmartProgram = temporarilyNotSupport('navigateToSmartProgram');
const navigateBackSmartProgram = temporarilyNotSupport('navigateBackSmartProgram');
const preloadSubPackage = temporarilyNotSupport('preloadSubPackage');

const { Behavior, getEnv, ENV_TYPE, Link, interceptors, getInitPxTransform, Current, options, eventCenter, Events, preload } = Taro__default['default'];
const taro = {
    // @ts-ignore
    Behavior,
    getEnv,
    ENV_TYPE,
    Link,
    interceptors,
    Current,
    getCurrentInstance,
    options,
    nextTick,
    eventCenter,
    Events,
    preload,
    history: router.history,
    createRouter: router.createRouter,
    navigateBack: router.navigateBack,
    navigateTo: router.navigateTo,
    reLaunch: router.reLaunch,
    redirectTo: router.redirectTo,
    getCurrentPages: router.getCurrentPages,
    switchTab: router.switchTab
};
const initPxTransform = getInitPxTransform(taro);
const requirePlugin = permanentlyNotSupport('requirePlugin');
const pxTransform = function (size) {
    // @ts-ignore
    const { designWidth } = taro.config;
    return Math.ceil((((parseInt(size, 10) / 40) * 640) / designWidth) * 10000) / 10000 + 'rem';
};
const canIUseWebp = function () {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};
taro.requirePlugin = requirePlugin;
taro.getApp = getApp;
taro.pxTransform = pxTransform;
taro.initPxTransform = initPxTransform;
// @ts-ignore
taro.canIUseWebp = canIUseWebp;

Object.defineProperty(exports, 'createRouter', {
  enumerable: true,
  get: function () {
    return router.createRouter;
  }
});
Object.defineProperty(exports, 'getCurrentPages', {
  enumerable: true,
  get: function () {
    return router.getCurrentPages;
  }
});
Object.defineProperty(exports, 'history', {
  enumerable: true,
  get: function () {
    return router.history;
  }
});
Object.defineProperty(exports, 'navigateBack', {
  enumerable: true,
  get: function () {
    return router.navigateBack;
  }
});
Object.defineProperty(exports, 'navigateTo', {
  enumerable: true,
  get: function () {
    return router.navigateTo;
  }
});
Object.defineProperty(exports, 'reLaunch', {
  enumerable: true,
  get: function () {
    return router.reLaunch;
  }
});
Object.defineProperty(exports, 'redirectTo', {
  enumerable: true,
  get: function () {
    return router.redirectTo;
  }
});
Object.defineProperty(exports, 'switchTab', {
  enumerable: true,
  get: function () {
    return router.switchTab;
  }
});
exports.Behavior = Behavior;
exports.Current = Current;
exports.ENV_TYPE = ENV_TYPE;
exports.Events = Events;
exports.Link = Link;
exports.addCard = addCard;
exports.addFileToFavorites = addFileToFavorites;
exports.addInterceptor = addInterceptor;
exports.addPhoneCalendar = addPhoneCalendar;
exports.addPhoneContact = addPhoneContact;
exports.addPhoneRepeatCalendar = addPhoneRepeatCalendar;
exports.addVideoToFavorites = addVideoToFavorites;
exports.advancedGeneralIdentify = advancedGeneralIdentify;
exports.animalClassify = animalClassify;
exports.arrayBufferToBase64 = arrayBufferToBase64;
exports.authPrivateMessage = authPrivateMessage;
exports.authorize = authorize;
exports.authorizeForMiniProgram = authorizeForMiniProgram;
exports.base64ToArrayBuffer = base64ToArrayBuffer;
exports.canIUse = canIUse;
exports.canIUseWebp = canIUseWebp;
exports.canvasGetImageData = canvasGetImageData;
exports.canvasPutImageData = canvasPutImageData;
exports.canvasToTempFilePath = canvasToTempFilePath;
exports.carClassify = carClassify;
exports.checkIsOpenAccessibility = checkIsOpenAccessibility;
exports.checkIsSoterEnrolledInDevice = checkIsSoterEnrolledInDevice;
exports.checkIsSupportFacialRecognition = checkIsSupportFacialRecognition;
exports.checkIsSupportSoterAuthentication = checkIsSupportSoterAuthentication;
exports.checkSession = checkSession;
exports.chooseAddress = chooseAddress;
exports.chooseContact = chooseContact;
exports.chooseImage = chooseImage;
exports.chooseInvoice = chooseInvoice;
exports.chooseInvoiceTitle = chooseInvoiceTitle;
exports.chooseLicensePlate = chooseLicensePlate;
exports.chooseLocation = chooseLocation;
exports.chooseMedia = chooseMedia;
exports.chooseMessageFile = chooseMessageFile;
exports.choosePoi = choosePoi;
exports.chooseVideo = chooseVideo;
exports.clearStorage = clearStorage;
exports.clearStorageSync = clearStorageSync;
exports.closeBLEConnection = closeBLEConnection;
exports.closeBluetoothAdapter = closeBluetoothAdapter;
exports.closeSocket = closeSocket;
exports.cloud = cloud;
exports.compressImage = compressImage;
exports.compressVideo = compressVideo;
exports.connectSocket = connectSocket;
exports.connectWifi = connectWifi;
exports.createAnimation = createAnimation;
exports.createAudioContext = createAudioContext;
exports.createBLEConnection = createBLEConnection;
exports.createBLEPeripheralServer = createBLEPeripheralServer;
exports.createBufferURL = createBufferURL;
exports.createCameraContext = createCameraContext;
exports.createCanvasContext = createCanvasContext;
exports.createInnerAudioContext = createInnerAudioContext;
exports.createIntersectionObserver = createIntersectionObserver;
exports.createInterstitialAd = createInterstitialAd;
exports.createLivePlayerContext = createLivePlayerContext;
exports.createLivePusherContext = createLivePusherContext;
exports.createMapContext = createMapContext;
exports.createMediaAudioPlayer = createMediaAudioPlayer;
exports.createMediaContainer = createMediaContainer;
exports.createMediaRecorder = createMediaRecorder;
exports.createOffscreenCanvas = createOffscreenCanvas;
exports.createRewardedVideoAd = createRewardedVideoAd;
exports.createSelectorQuery = createSelectorQuery;
exports.createTCPSocket = createTCPSocket;
exports.createUDPSocket = createUDPSocket;
exports.createVKSession = createVKSession;
exports.createVideoContext = createVideoContext;
exports.createVideoDecoder = createVideoDecoder;
exports.createWebAudioContext = createWebAudioContext;
exports.createWorker = createWorker;
exports['default'] = taro;
exports.disableAlertBeforeUnload = disableAlertBeforeUnload;
exports.dishClassify = dishClassify;
exports.downloadFile = downloadFile;
exports.enableAlertBeforeUnload = enableAlertBeforeUnload;
exports.eventCenter = eventCenter;
exports.exitMiniProgram = exitMiniProgram;
exports.exitVoIPChat = exitVoIPChat;
exports.faceDetect = faceDetect;
exports.faceVerifyForPay = faceVerifyForPay;
exports.getAccountInfoSync = getAccountInfoSync;
exports.getApp = getApp;
exports.getAppAuthorizeSetting = getAppAuthorizeSetting;
exports.getAppBaseInfo = getAppBaseInfo;
exports.getAvailableAudioSources = getAvailableAudioSources;
exports.getBLEDeviceCharacteristics = getBLEDeviceCharacteristics;
exports.getBLEDeviceRSSI = getBLEDeviceRSSI;
exports.getBLEDeviceServices = getBLEDeviceServices;
exports.getBLEMTU = getBLEMTU;
exports.getBackgroundAudioManager = getBackgroundAudioManager;
exports.getBackgroundAudioPlayerState = getBackgroundAudioPlayerState;
exports.getBackgroundFetchData = getBackgroundFetchData;
exports.getBackgroundFetchToken = getBackgroundFetchToken;
exports.getBatteryInfo = getBatteryInfo;
exports.getBatteryInfoSync = getBatteryInfoSync;
exports.getBeacons = getBeacons;
exports.getBluetoothAdapterState = getBluetoothAdapterState;
exports.getBluetoothDevices = getBluetoothDevices;
exports.getChannelsLiveInfo = getChannelsLiveInfo;
exports.getChannelsLiveNoticeInfo = getChannelsLiveNoticeInfo;
exports.getClipboardData = getClipboardData;
exports.getConnectedBluetoothDevices = getConnectedBluetoothDevices;
exports.getConnectedWifi = getConnectedWifi;
exports.getCurrentInstance = getCurrentInstance;
exports.getDeviceInfo = getDeviceInfo;
exports.getEnterOptionsSync = getEnterOptionsSync;
exports.getEnv = getEnv;
exports.getExptInfoSync = getExptInfoSync;
exports.getExtConfig = getExtConfig;
exports.getExtConfigSync = getExtConfigSync;
exports.getFileInfo = getFileInfo;
exports.getFileSystemManager = getFileSystemManager;
exports.getGroupEnterInfo = getGroupEnterInfo;
exports.getHCEState = getHCEState;
exports.getImageInfo = getImageInfo;
exports.getLaunchOptionsSync = getLaunchOptionsSync;
exports.getLocalIPAddress = getLocalIPAddress;
exports.getLocation = getLocation;
exports.getLogManager = getLogManager;
exports.getMenuButtonBoundingClientRect = getMenuButtonBoundingClientRect;
exports.getNFCAdapter = getNFCAdapter;
exports.getNetworkType = getNetworkType;
exports.getOpenUserInfo = getOpenUserInfo;
exports.getPerformance = getPerformance;
exports.getRandomValues = getRandomValues;
exports.getRealtimeLogManager = getRealtimeLogManager;
exports.getRecorderManager = getRecorderManager;
exports.getSavedFileInfo = getSavedFileInfo;
exports.getSavedFileList = getSavedFileList;
exports.getScreenBrightness = getScreenBrightness;
exports.getSelectedTextRange = getSelectedTextRange;
exports.getSetting = getSetting;
exports.getShareInfo = getShareInfo;
exports.getStorage = getStorage;
exports.getStorageInfo = getStorageInfo;
exports.getStorageInfoSync = getStorageInfoSync;
exports.getStorageSync = getStorageSync;
exports.getSwanId = getSwanId;
exports.getSystemInfo = getSystemInfo;
exports.getSystemInfoAsync = getSystemInfoAsync;
exports.getSystemInfoSync = getSystemInfoSync;
exports.getSystemSetting = getSystemSetting;
exports.getUpdateManager = getUpdateManager;
exports.getUserCryptoManager = getUserCryptoManager;
exports.getUserInfo = getUserInfo;
exports.getUserProfile = getUserProfile;
exports.getVideoInfo = getVideoInfo;
exports.getWeRunData = getWeRunData;
exports.getWifiList = getWifiList;
exports.getWindowInfo = getWindowInfo;
exports.hideHomeButton = hideHomeButton;
exports.hideKeyboard = hideKeyboard;
exports.hideLoading = hideLoading;
exports.hideNavigationBarLoading = hideNavigationBarLoading;
exports.hideShareMenu = hideShareMenu;
exports.hideTabBar = hideTabBar;
exports.hideTabBarRedDot = hideTabBarRedDot;
exports.hideToast = hideToast;
exports.imageAudit = imageAudit;
exports.initFaceDetect = initFaceDetect;
exports.initPxTransform = initPxTransform;
exports.initTabBarApis = initTabBarApis;
exports.interceptors = interceptors;
exports.isBluetoothDevicePaired = isBluetoothDevicePaired;
exports.isVKSupport = isVKSupport;
exports.joinVoIPChat = joinVoIPChat;
exports.loadFontFace = loadFontFace;
exports.login = login;
exports.logoClassify = logoClassify;
exports.makeBluetoothPair = makeBluetoothPair;
exports.makePhoneCall = makePhoneCall;
exports.navigateBackMiniProgram = navigateBackMiniProgram;
exports.navigateBackSmartProgram = navigateBackSmartProgram;
exports.navigateToMiniProgram = navigateToMiniProgram;
exports.navigateToSmartGameProgram = navigateToSmartGameProgram;
exports.navigateToSmartProgram = navigateToSmartProgram;
exports.nextTick = nextTick;
exports.notifyBLECharacteristicValueChange = notifyBLECharacteristicValueChange;
exports.objectDetectIdentify = objectDetectIdentify;
exports.ocrBankCard = ocrBankCard;
exports.ocrDrivingLicense = ocrDrivingLicense;
exports.ocrIdCard = ocrIdCard;
exports.ocrVehicleLicense = ocrVehicleLicense;
exports.offAccelerometerChange = offAccelerometerChange;
exports.offAppHide = offAppHide;
exports.offAppShow = offAppShow;
exports.offAudioInterruptionBegin = offAudioInterruptionBegin;
exports.offAudioInterruptionEnd = offAudioInterruptionEnd;
exports.offBLECharacteristicValueChange = offBLECharacteristicValueChange;
exports.offBLEConnectionStateChange = offBLEConnectionStateChange;
exports.offBLEMTUChange = offBLEMTUChange;
exports.offBLEPeripheralConnectionStateChanged = offBLEPeripheralConnectionStateChanged;
exports.offBeaconServiceChange = offBeaconServiceChange;
exports.offBeaconUpdate = offBeaconUpdate;
exports.offBluetoothAdapterStateChange = offBluetoothAdapterStateChange;
exports.offBluetoothDeviceFound = offBluetoothDeviceFound;
exports.offCompassChange = offCompassChange;
exports.offCopyUrl = offCopyUrl;
exports.offDeviceMotionChange = offDeviceMotionChange;
exports.offError = offError;
exports.offGetWifiList = offGetWifiList;
exports.offGyroscopeChange = offGyroscopeChange;
exports.offHCEMessage = offHCEMessage;
exports.offKeyboardHeightChange = offKeyboardHeightChange;
exports.offLocalServiceDiscoveryStop = offLocalServiceDiscoveryStop;
exports.offLocalServiceFound = offLocalServiceFound;
exports.offLocalServiceLost = offLocalServiceLost;
exports.offLocalServiceResolveFail = offLocalServiceResolveFail;
exports.offLocationChange = offLocationChange;
exports.offLocationChangeError = offLocationChangeError;
exports.offMemoryWarning = offMemoryWarning;
exports.offNetworkStatusChange = offNetworkStatusChange;
exports.offNetworkWeakChange = offNetworkWeakChange;
exports.offPageNotFound = offPageNotFound;
exports.offThemeChange = offThemeChange;
exports.offUnhandledRejection = offUnhandledRejection;
exports.offUserCaptureScreen = offUserCaptureScreen;
exports.offVoIPChatInterrupted = offVoIPChatInterrupted;
exports.offVoIPChatMembersChanged = offVoIPChatMembersChanged;
exports.offVoIPChatStateChanged = offVoIPChatStateChanged;
exports.offVoIPVideoMembersChanged = offVoIPVideoMembersChanged;
exports.offWifiConnected = offWifiConnected;
exports.offWindowResize = offWindowResize;
exports.onAccelerometerChange = onAccelerometerChange;
exports.onAppHide = onAppHide;
exports.onAppShow = onAppShow;
exports.onAudioInterruptionBegin = onAudioInterruptionBegin;
exports.onAudioInterruptionEnd = onAudioInterruptionEnd;
exports.onBLECharacteristicValueChange = onBLECharacteristicValueChange;
exports.onBLEConnectionStateChange = onBLEConnectionStateChange;
exports.onBLEMTUChange = onBLEMTUChange;
exports.onBLEPeripheralConnectionStateChanged = onBLEPeripheralConnectionStateChanged;
exports.onBackgroundAudioPause = onBackgroundAudioPause;
exports.onBackgroundAudioPlay = onBackgroundAudioPlay;
exports.onBackgroundAudioStop = onBackgroundAudioStop;
exports.onBackgroundFetchData = onBackgroundFetchData;
exports.onBeaconServiceChange = onBeaconServiceChange;
exports.onBeaconUpdate = onBeaconUpdate;
exports.onBluetoothAdapterStateChange = onBluetoothAdapterStateChange;
exports.onBluetoothDeviceFound = onBluetoothDeviceFound;
exports.onCompassChange = onCompassChange;
exports.onCopyUrl = onCopyUrl;
exports.onDeviceMotionChange = onDeviceMotionChange;
exports.onError = onError;
exports.onGetWifiList = onGetWifiList;
exports.onGyroscopeChange = onGyroscopeChange;
exports.onHCEMessage = onHCEMessage;
exports.onKeyboardHeightChange = onKeyboardHeightChange;
exports.onLocalServiceDiscoveryStop = onLocalServiceDiscoveryStop;
exports.onLocalServiceFound = onLocalServiceFound;
exports.onLocalServiceLost = onLocalServiceLost;
exports.onLocalServiceResolveFail = onLocalServiceResolveFail;
exports.onLocationChange = onLocationChange;
exports.onLocationChangeError = onLocationChangeError;
exports.onMemoryWarning = onMemoryWarning;
exports.onNetworkStatusChange = onNetworkStatusChange;
exports.onNetworkWeakChange = onNetworkWeakChange;
exports.onPageNotFound = onPageNotFound;
exports.onSocketClose = onSocketClose;
exports.onSocketError = onSocketError;
exports.onSocketMessage = onSocketMessage;
exports.onSocketOpen = onSocketOpen;
exports.onThemeChange = onThemeChange;
exports.onUnhandledRejection = onUnhandledRejection;
exports.onUserCaptureScreen = onUserCaptureScreen;
exports.onVoIPChatInterrupted = onVoIPChatInterrupted;
exports.onVoIPChatMembersChanged = onVoIPChatMembersChanged;
exports.onVoIPChatSpeakersChanged = onVoIPChatSpeakersChanged;
exports.onVoIPChatStateChanged = onVoIPChatStateChanged;
exports.onVoIPVideoMembersChanged = onVoIPVideoMembersChanged;
exports.onWifiConnected = onWifiConnected;
exports.onWifiConnectedWithPartialInfo = onWifiConnectedWithPartialInfo;
exports.onWindowResize = onWindowResize;
exports.openAppAuthorizeSetting = openAppAuthorizeSetting;
exports.openBluetoothAdapter = openBluetoothAdapter;
exports.openCard = openCard;
exports.openChannelsActivity = openChannelsActivity;
exports.openChannelsEvent = openChannelsEvent;
exports.openChannelsLive = openChannelsLive;
exports.openCustomerServiceChat = openCustomerServiceChat;
exports.openDocument = openDocument;
exports.openEmbeddedMiniProgram = openEmbeddedMiniProgram;
exports.openLocation = openLocation;
exports.openSetting = openSetting;
exports.openSystemBluetoothSetting = openSystemBluetoothSetting;
exports.openVideoEditor = openVideoEditor;
exports.options = options;
exports.pageScrollTo = pageScrollTo;
exports.pauseBackgroundAudio = pauseBackgroundAudio;
exports.pauseVoice = pauseVoice;
exports.plantClassify = plantClassify;
exports.playBackgroundAudio = playBackgroundAudio;
exports.playVoice = playVoice;
exports.pluginLogin = pluginLogin;
exports.preload = preload;
exports.preloadSubPackage = preloadSubPackage;
exports.previewImage = previewImage;
exports.previewMedia = previewMedia;
exports.pxTransform = pxTransform;
exports.readBLECharacteristicValue = readBLECharacteristicValue;
exports.removeSavedFile = removeSavedFile;
exports.removeStorage = removeStorage;
exports.removeStorageSync = removeStorageSync;
exports.removeTabBarBadge = removeTabBarBadge;
exports.reportAnalytics = reportAnalytics;
exports.reportEvent = reportEvent;
exports.reportMonitor = reportMonitor;
exports.reportPerformance = reportPerformance;
exports.request = request;
exports.requestOrderPayment = requestOrderPayment;
exports.requestPayment = requestPayment;
exports.requestPolymerPayment = requestPolymerPayment;
exports.requestSubscribeMessage = requestSubscribeMessage;
exports.requirePlugin = requirePlugin;
exports.reserveChannelsLive = reserveChannelsLive;
exports.revokeBufferURL = revokeBufferURL;
exports.saveFile = saveFile;
exports.saveFileToDisk = saveFileToDisk;
exports.saveImageToPhotosAlbum = saveImageToPhotosAlbum;
exports.saveVideoToPhotosAlbum = saveVideoToPhotosAlbum;
exports.scanCode = scanCode;
exports.seekBackgroundAudio = seekBackgroundAudio;
exports.sendHCEMessage = sendHCEMessage;
exports.sendSocketMessage = sendSocketMessage;
exports.setBLEMTU = setBLEMTU;
exports.setBackgroundColor = setBackgroundColor;
exports.setBackgroundFetchToken = setBackgroundFetchToken;
exports.setBackgroundTextStyle = setBackgroundTextStyle;
exports.setClipboardData = setClipboardData;
exports.setEnable1v1Chat = setEnable1v1Chat;
exports.setEnableDebug = setEnableDebug;
exports.setInnerAudioOption = setInnerAudioOption;
exports.setKeepScreenOn = setKeepScreenOn;
exports.setNavigationBarColor = setNavigationBarColor;
exports.setNavigationBarTitle = setNavigationBarTitle;
exports.setPageInfo = setPageInfo;
exports.setScreenBrightness = setScreenBrightness;
exports.setStorage = setStorage;
exports.setStorageSync = setStorageSync;
exports.setTabBarBadge = setTabBarBadge;
exports.setTabBarItem = setTabBarItem;
exports.setTabBarStyle = setTabBarStyle;
exports.setTopBarText = setTopBarText;
exports.setVisualEffectOnCapture = setVisualEffectOnCapture;
exports.setWifiList = setWifiList;
exports.setWindowSize = setWindowSize;
exports.shareFileMessage = shareFileMessage;
exports.shareToWeRun = shareToWeRun;
exports.shareVideoMessage = shareVideoMessage;
exports.showActionSheet = showActionSheet;
exports.showLoading = showLoading;
exports.showModal = showModal;
exports.showNavigationBarLoading = showNavigationBarLoading;
exports.showRedPackage = showRedPackage;
exports.showShareImageMenu = showShareImageMenu;
exports.showShareMenu = showShareMenu;
exports.showTabBar = showTabBar;
exports.showTabBarRedDot = showTabBarRedDot;
exports.showToast = showToast;
exports.startAccelerometer = startAccelerometer;
exports.startBeaconDiscovery = startBeaconDiscovery;
exports.startBluetoothDevicesDiscovery = startBluetoothDevicesDiscovery;
exports.startCompass = startCompass;
exports.startDeviceMotionListening = startDeviceMotionListening;
exports.startFacialRecognitionVerify = startFacialRecognitionVerify;
exports.startFacialRecognitionVerifyAndUploadVideo = startFacialRecognitionVerifyAndUploadVideo;
exports.startGyroscope = startGyroscope;
exports.startHCE = startHCE;
exports.startLocalServiceDiscovery = startLocalServiceDiscovery;
exports.startLocationUpdate = startLocationUpdate;
exports.startLocationUpdateBackground = startLocationUpdateBackground;
exports.startPullDownRefresh = startPullDownRefresh;
exports.startRecord = startRecord;
exports.startSoterAuthentication = startSoterAuthentication;
exports.startWifi = startWifi;
exports.stopAccelerometer = stopAccelerometer;
exports.stopBackgroundAudio = stopBackgroundAudio;
exports.stopBeaconDiscovery = stopBeaconDiscovery;
exports.stopBluetoothDevicesDiscovery = stopBluetoothDevicesDiscovery;
exports.stopCompass = stopCompass;
exports.stopDeviceMotionListening = stopDeviceMotionListening;
exports.stopFaceDetect = stopFaceDetect;
exports.stopGyroscope = stopGyroscope;
exports.stopHCE = stopHCE;
exports.stopLocalServiceDiscovery = stopLocalServiceDiscovery;
exports.stopLocationUpdate = stopLocationUpdate;
exports.stopPullDownRefresh = stopPullDownRefresh;
exports.stopRecord = stopRecord;
exports.stopVoice = stopVoice;
exports.stopWifi = stopWifi;
exports.subscribeVoIPVideoMembers = subscribeVoIPVideoMembers;
exports.textReview = textReview;
exports.textToAudio = textToAudio;
exports.updateShareMenu = updateShareMenu;
exports.updateVoIPChatMuteConfig = updateVoIPChatMuteConfig;
exports.updateWeChatApp = updateWeChatApp;
exports.uploadFile = uploadFile;
exports.vibrateLong = vibrateLong;
exports.vibrateShort = vibrateShort;
exports.writeBLECharacteristicValue = writeBLECharacteristicValue;

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1649338160486);
})()
//miniprogram-npm-outsideDeps=["@tarojs/api","@tarojs/router","@tarojs/runtime"]
//# sourceMappingURL=index.js.map