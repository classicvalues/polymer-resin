'use strict';var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.checkStringArgs = function(thisArg, arg, func) {
  if (null == thisArg) {
    throw new TypeError("The 'this' value for String.prototype." + func + " must not be null or undefined");
  }
  if (arg instanceof RegExp) {
    throw new TypeError("First argument to String.prototype." + func + " must not be a regular expression");
  }
  return thisArg + "";
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(target, property, descriptor) {
  target != Array.prototype && target != Object.prototype && (target[property] = descriptor.value);
};
$jscomp.getGlobal = function(maybeGlobal) {
  return "undefined" != typeof window && window === maybeGlobal ? maybeGlobal : "undefined" != typeof global && null != global ? global : maybeGlobal;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(target, polyfill) {
  if (polyfill) {
    for (var obj = $jscomp.global, split = target.split("."), i = 0; i < split.length - 1; i++) {
      var key = split[i];
      key in obj || (obj[key] = {});
      obj = obj[key];
    }
    var property = split[split.length - 1], orig = obj[property], impl = polyfill(orig);
    impl != orig && null != impl && $jscomp.defineProperty(obj, property, {configurable:!0, writable:!0, value:impl});
  }
};
var goog = goog || {};
goog.global = this;
goog.isDef = function(val) {
  return void 0 !== val;
};
goog.isString = function(val) {
  return "string" == typeof val;
};
goog.isBoolean = function(val) {
  return "boolean" == typeof val;
};
goog.isNumber = function(val) {
  return "number" == typeof val;
};
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split("."), cur = opt_objectToExportTo || goog.global;
  parts[0] in cur || "undefined" == typeof cur.execScript || cur.execScript("var " + parts[0]);
  for (var part; parts.length && (part = parts.shift());) {
    !parts.length && goog.isDef(opt_object) ? cur[part] = opt_object : cur = cur[part] && cur[part] !== Object.prototype[part] ? cur[part] : cur[part] = {};
  }
};
goog.define = function(name, defaultValue) {
  goog.exportPath_(name, defaultValue);
};
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.STRICT_MODE_COMPATIBLE = !1;
goog.DISALLOW_TEST_ONLY_CODE = !goog.DEBUG;
goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING = !1;
goog.provide = function(name) {
  if (goog.isInGoogModuleLoader_()) {
    throw Error("goog.provide cannot be used within a module.");
  }
  goog.isInEs6ModuleLoader_() && goog.logToConsole_("goog.provide should not be used within a module.");
  goog.constructNamespace_(name);
};
goog.constructNamespace_ = function(name, opt_obj) {
  goog.exportPath_(name, opt_obj);
};
goog.getScriptNonce = function() {
  null === goog.cspNonce_ && (goog.cspNonce_ = goog.getScriptNonce_(goog.global.document) || "");
  return goog.cspNonce_;
};
goog.NONCE_PATTERN_ = /^[\w+/_-]+[=]{0,2}$/;
goog.cspNonce_ = null;
goog.getScriptNonce_ = function(doc) {
  var script = doc.querySelector && doc.querySelector("script[nonce]");
  if (script) {
    var nonce = script.nonce || script.getAttribute("nonce");
    if (nonce && goog.NONCE_PATTERN_.test(nonce)) {
      return nonce;
    }
  }
  return null;
};
goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
goog.module = function(name) {
  if (!goog.isString(name) || !name || -1 == name.search(goog.VALID_MODULE_RE_)) {
    throw Error("Invalid module identifier");
  }
  if (!goog.isInGoogModuleLoader_()) {
    throw Error("Module " + name + " has been loaded incorrectly. Note, modules cannot be loaded as normal scripts. They require some kind of pre-processing step. You're likely trying to load a module via a script tag or as a part of a concatenated bundle without rewriting the module. For more info see: https://github.com/google/closure-library/wiki/goog.module:-an-ES6-module-like-alternative-to-goog.provide.");
  }
  if (goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module may only be called once per module.");
  }
  goog.moduleLoaderState_.moduleName = name;
};
goog.module.get = function() {
  return null;
};
goog.module.getInternal_ = function() {
  return null;
};
goog.ModuleType = {ES6:"es6", GOOG:"goog"};
goog.moduleLoaderState_ = null;
goog.isInModuleLoader_ = function() {
  return goog.isInGoogModuleLoader_() || goog.isInEs6ModuleLoader_();
};
goog.isInGoogModuleLoader_ = function() {
  return !!goog.moduleLoaderState_ && goog.moduleLoaderState_.type == goog.ModuleType.GOOG;
};
goog.isInEs6ModuleLoader_ = function() {
  if (goog.moduleLoaderState_ && goog.moduleLoaderState_.type == goog.ModuleType.ES6) {
    return !0;
  }
  var jscomp = goog.global.$jscomp;
  return jscomp ? "function" != typeof jscomp.getCurrentModulePath ? !1 : !!jscomp.getCurrentModulePath() : !1;
};
goog.module.declareLegacyNamespace = function() {
  goog.moduleLoaderState_.declareLegacyNamespace = !0;
};
goog.module.declareNamespace = function(namespace) {
  if (goog.moduleLoaderState_) {
    goog.moduleLoaderState_.moduleName = namespace;
  } else {
    var jscomp = goog.global.$jscomp;
    if (!jscomp || "function" != typeof jscomp.getCurrentModulePath) {
      throw Error('Module with namespace "' + namespace + '" has been loaded incorrectly.');
    }
    var exports = jscomp.require(jscomp.getCurrentModulePath());
    goog.loadedModules_[namespace] = {exports:exports, type:goog.ModuleType.ES6, moduleId:namespace};
  }
};
goog.setTestOnly = function(opt_message) {
  if (goog.DISALLOW_TEST_ONLY_CODE) {
    throw opt_message = opt_message || "", Error("Importing test-only code into non-debug environment" + (opt_message ? ": " + opt_message : "."));
  }
};
goog.forwardDeclare = function() {
};
goog.getObjectByName = function(name, opt_obj) {
  for (var parts = name.split("."), cur = opt_obj || goog.global, i = 0; i < parts.length; i++) {
    if (cur = cur[parts[i]], !goog.isDefAndNotNull(cur)) {
      return null;
    }
  }
  return cur;
};
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global, x;
  for (x in obj) {
    global[x] = obj[x];
  }
};
goog.addDependency = function() {
};
goog.useStrictRequires = !1;
goog.ENABLE_DEBUG_LOADER = !0;
goog.logToConsole_ = function(msg) {
  goog.global.console && goog.global.console.error(msg);
};
goog.require = function() {
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
  ctor.instance_ = void 0;
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor);
    return ctor.instance_ = new ctor;
  };
};
goog.instantiatedSingletons_ = [];
goog.LOAD_MODULE_USING_EVAL = !0;
goog.SEAL_MODULE_EXPORTS = goog.DEBUG;
goog.loadedModules_ = {};
goog.DEPENDENCIES_ENABLED = !1;
goog.TRANSPILE = "detect";
goog.TRANSPILE_TO_LANGUAGE = "";
goog.TRANSPILER = "transpile.js";
goog.hasBadLetScoping = null;
goog.useSafari10Workaround = function() {
  if (null == goog.hasBadLetScoping) {
    try {
      var hasBadLetScoping = !eval('"use strict";let x = 1; function f() { return typeof x; };f() == "number";');
    } catch (e) {
      hasBadLetScoping = !1;
    }
    goog.hasBadLetScoping = hasBadLetScoping;
  }
  return goog.hasBadLetScoping;
};
goog.workaroundSafari10EvalBug = function(moduleDef) {
  return "(function(){" + moduleDef + "\n;})();\n";
};
goog.loadModule = function(moduleDef) {
  var previousState = goog.moduleLoaderState_;
  try {
    goog.moduleLoaderState_ = {moduleName:"", declareLegacyNamespace:!1, type:goog.ModuleType.GOOG};
    if (goog.isFunction(moduleDef)) {
      var exports = moduleDef.call(void 0, {});
    } else {
      if (goog.isString(moduleDef)) {
        goog.useSafari10Workaround() && (moduleDef = goog.workaroundSafari10EvalBug(moduleDef)), exports = goog.loadModuleFromSource_.call(void 0, moduleDef);
      } else {
        throw Error("Invalid module definition");
      }
    }
    var moduleName = goog.moduleLoaderState_.moduleName;
    if (goog.isString(moduleName) && moduleName) {
      goog.moduleLoaderState_.declareLegacyNamespace ? goog.constructNamespace_(moduleName, exports) : goog.SEAL_MODULE_EXPORTS && Object.seal && "object" == typeof exports && null != exports && Object.seal(exports), goog.loadedModules_[moduleName] = {exports:exports, type:goog.ModuleType.GOOG, moduleId:goog.moduleLoaderState_.moduleName};
    } else {
      throw Error('Invalid module name "' + moduleName + '"');
    }
  } finally {
    goog.moduleLoaderState_ = previousState;
  }
};
goog.loadModuleFromSource_ = function(JSCompiler_OptimizeArgumentsArray_p0) {
  eval(JSCompiler_OptimizeArgumentsArray_p0);
  return {};
};
goog.normalizePath_ = function(path) {
  for (var components = path.split("/"), i = 0; i < components.length;) {
    "." == components[i] ? components.splice(i, 1) : i && ".." == components[i] && components[i - 1] && ".." != components[i - 1] ? components.splice(--i, 2) : i++;
  }
  return components.join("/");
};
goog.loadFileSync_ = function(src) {
  if (goog.global.CLOSURE_LOAD_FILE_SYNC) {
    return goog.global.CLOSURE_LOAD_FILE_SYNC(src);
  }
  try {
    var xhr = new goog.global.XMLHttpRequest;
    xhr.open("get", src, !1);
    xhr.send();
    return 0 == xhr.status || 200 == xhr.status ? xhr.responseText : null;
  } catch (err) {
    return null;
  }
};
goog.transpile_ = function(code$jscomp$0, path$jscomp$0, target) {
  var jscomp = goog.global.$jscomp;
  jscomp || (goog.global.$jscomp = jscomp = {});
  var transpile = jscomp.transpile;
  if (!transpile) {
    var transpilerPath = goog.basePath + goog.TRANSPILER, transpilerCode = goog.loadFileSync_(transpilerPath);
    if (transpilerCode) {
      (function() {
        eval(transpilerCode + "\n//# sourceURL=" + transpilerPath);
      }).call(goog.global);
      if (goog.global.$gwtExport && goog.global.$gwtExport.$jscomp && !goog.global.$gwtExport.$jscomp.transpile) {
        throw Error('The transpiler did not properly export the "transpile" method. $gwtExport: ' + JSON.stringify(goog.global.$gwtExport));
      }
      goog.global.$jscomp.transpile = goog.global.$gwtExport.$jscomp.transpile;
      jscomp = goog.global.$jscomp;
      transpile = jscomp.transpile;
    }
  }
  if (!transpile) {
    var suffix = " requires transpilation but no transpiler was found.";
    suffix += ' Please add "//javascript/closure:transpiler" as a data dependency to ensure it is included.';
    transpile = jscomp.transpile = function(code, path) {
      goog.logToConsole_(path + suffix);
      return code;
    };
  }
  return transpile(code$jscomp$0, path$jscomp$0, target);
};
goog.typeOf = function(value) {
  var s = typeof value;
  if ("object" == s) {
    if (value) {
      if (value instanceof Array) {
        return "array";
      }
      if (value instanceof Object) {
        return s;
      }
      var className = Object.prototype.toString.call(value);
      if ("[object Window]" == className) {
        return "object";
      }
      if ("[object Array]" == className || "number" == typeof value.length && "undefined" != typeof value.splice && "undefined" != typeof value.propertyIsEnumerable && !value.propertyIsEnumerable("splice")) {
        return "array";
      }
      if ("[object Function]" == className || "undefined" != typeof value.call && "undefined" != typeof value.propertyIsEnumerable && !value.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if ("function" == s && "undefined" == typeof value.call) {
      return "object";
    }
  }
  return s;
};
goog.isNull = function(val) {
  return null === val;
};
goog.isDefAndNotNull = function(val) {
  return null != val;
};
goog.isArray = function(val) {
  return "array" == goog.typeOf(val);
};
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return "array" == type || "object" == type && "number" == typeof val.length;
};
goog.isDateLike = function(val) {
  return goog.isObject(val) && "function" == typeof val.getFullYear;
};
goog.isFunction = function(val) {
  return "function" == goog.typeOf(val);
};
goog.isObject = function(val) {
  var type = typeof val;
  return "object" == type && null != val || "function" == type;
};
goog.getUid = function(obj) {
  return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.hasUid = function(obj) {
  return !!obj[goog.UID_PROPERTY_];
};
goog.removeUid = function(obj) {
  null !== obj && "removeAttribute" in obj && obj.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (1e9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if ("object" == type || "array" == type) {
    if ("function" === typeof obj.clone) {
      return obj.clone();
    }
    var clone = "array" == type ? [] : {}, key;
    for (key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.bindNative_ = function(fn, selfObj, var_args) {
  return fn.call.apply(fn.bind, arguments);
};
goog.bindJs_ = function(fn, selfObj, var_args) {
  if (!fn) {
    throw Error();
  }
  if (2 < arguments.length) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };
  }
  return function() {
    return fn.apply(selfObj, arguments);
  };
};
goog.bind = function(fn, selfObj, var_args) {
  goog.bind = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bindNative_ : goog.bindJs_;
  return goog.bind.apply(null, arguments);
};
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = args.slice();
    newArgs.push.apply(newArgs, arguments);
    return fn.apply(this, newArgs);
  };
};
goog.mixin = function(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return +new Date;
};
goog.globalEval = function(script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, "JavaScript");
  } else {
    if (goog.global.eval) {
      if (null == goog.evalWorksForGlobals_) {
        try {
          goog.global.eval("var _evalTest_ = 1;");
        } catch (ignore) {
        }
        if ("undefined" != typeof goog.global._evalTest_) {
          try {
            delete goog.global._evalTest_;
          } catch (ignore$0) {
          }
          goog.evalWorksForGlobals_ = !0;
        } else {
          goog.evalWorksForGlobals_ = !1;
        }
      }
      if (goog.evalWorksForGlobals_) {
        goog.global.eval(script);
      } else {
        var doc = goog.global.document, scriptElt = doc.createElement("SCRIPT");
        scriptElt.type = "text/javascript";
        scriptElt.defer = !1;
        scriptElt.appendChild(doc.createTextNode(script));
        doc.head.appendChild(scriptElt);
        doc.head.removeChild(scriptElt);
      }
    } else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(className, opt_modifier) {
  if ("." == String(className).charAt(0)) {
    throw Error('className passed in goog.getCssName must not start with ".". You passed: ' + className);
  }
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  }, renameByParts = function(cssName) {
    for (var parts = cssName.split("-"), mapped = [], i = 0; i < parts.length; i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join("-");
  };
  var rename = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? getMapping : renameByParts : function(a) {
    return a;
  };
  var result = opt_modifier ? className + "-" + rename(opt_modifier) : rename(className);
  return goog.global.CLOSURE_CSS_NAME_MAP_FN ? goog.global.CLOSURE_CSS_NAME_MAP_FN(result) : result;
};
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
};
goog.getMsg = function(str, opt_values) {
  opt_values && (str = str.replace(/\{\$([^}]+)}/g, function(match, key) {
    return null != opt_values && key in opt_values ? opt_values[key] : match;
  }));
  return str;
};
goog.getMsgWithFallback = function(a) {
  return a;
};
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo);
};
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
};
goog.inherits = function(childCtor, parentCtor) {
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor;
  childCtor.prototype.constructor = childCtor;
  childCtor.base = function(me, methodName, var_args) {
    for (var args = Array(arguments.length - 2), i = 2; i < arguments.length; i++) {
      args[i - 2] = arguments[i];
    }
    return parentCtor.prototype[methodName].apply(me, args);
  };
};
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !caller) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if ("undefined" !== typeof caller.superClass_) {
    for (var ctorArgs = Array(arguments.length - 1), i = 1; i < arguments.length; i++) {
      ctorArgs[i - 1] = arguments[i];
    }
    return caller.superClass_.constructor.apply(me, ctorArgs);
  }
  if ("string" != typeof opt_methodName && "symbol" != typeof opt_methodName) {
    throw Error("method names provided to goog.base must be a string or a symbol");
  }
  var args = Array(arguments.length - 2);
  for (i = 2; i < arguments.length; i++) {
    args[i - 2] = arguments[i];
  }
  for (var foundCaller = !1, ctor = me.constructor; ctor; ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = !0;
    } else {
      if (foundCaller) {
        return ctor.prototype[opt_methodName].apply(me, args);
      }
    }
  }
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(fn) {
  if (goog.isInModuleLoader_()) {
    throw Error("goog.scope is not supported within a module.");
  }
  fn.call(goog.global);
};
goog.defineClass = function(superClass, def) {
  var constructor = def.constructor, statics = def.statics;
  constructor && constructor != Object.prototype.constructor || (constructor = function() {
    throw Error("cannot instantiate an interface (no constructor defined).");
  });
  var cls = goog.defineClass.createSealingConstructor_(constructor, superClass);
  superClass && goog.inherits(cls, superClass);
  delete def.constructor;
  delete def.statics;
  goog.defineClass.applyProperties_(cls.prototype, def);
  null != statics && (statics instanceof Function ? statics(cls) : goog.defineClass.applyProperties_(cls, statics));
  return cls;
};
goog.defineClass.SEAL_CLASS_INSTANCES = goog.DEBUG;
goog.defineClass.createSealingConstructor_ = function(ctr, superClass) {
  if (!goog.defineClass.SEAL_CLASS_INSTANCES) {
    return ctr;
  }
  var superclassSealable = !goog.defineClass.isUnsealable_(superClass), wrappedCtr = function() {
    var instance = ctr.apply(this, arguments) || this;
    instance[goog.UID_PROPERTY_] = instance[goog.UID_PROPERTY_];
    this.constructor === wrappedCtr && superclassSealable && Object.seal instanceof Function && Object.seal(instance);
    return instance;
  };
  return wrappedCtr;
};
goog.defineClass.isUnsealable_ = function(ctr) {
  return ctr && ctr.prototype && ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_];
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.defineClass.applyProperties_ = function(target, source) {
  for (var key in source) {
    Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
  }
  for (var i = 0; i < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length; i++) {
    key = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[i], Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
  }
};
goog.tagUnsealableClass = function() {
};
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
goog.object = {};
goog.object.is = function(v, v2) {
  return v === v2 ? 0 !== v || 1 / v === 1 / v2 : v !== v && v2 !== v2;
};
goog.object.forEach = function(obj, f, opt_obj) {
  for (var key in obj) {
    f.call(opt_obj, obj[key], key, obj);
  }
};
goog.object.filter = function(obj, f, opt_obj) {
  var res = {}, key;
  for (key in obj) {
    f.call(opt_obj, obj[key], key, obj) && (res[key] = obj[key]);
  }
  return res;
};
goog.object.map = function(obj, f, opt_obj) {
  var res = {}, key;
  for (key in obj) {
    res[key] = f.call(opt_obj, obj[key], key, obj);
  }
  return res;
};
goog.object.some = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (f.call(opt_obj, obj[key], key, obj)) {
      return !0;
    }
  }
  return !1;
};
goog.object.every = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (!f.call(opt_obj, obj[key], key, obj)) {
      return !1;
    }
  }
  return !0;
};
goog.object.getCount = function(obj) {
  var rv = 0, key;
  for (key in obj) {
    rv++;
  }
  return rv;
};
goog.object.getAnyKey = function(obj) {
  for (var key in obj) {
    return key;
  }
};
goog.object.getAnyValue = function(obj) {
  for (var key in obj) {
    return obj[key];
  }
};
goog.object.contains = function(obj, val) {
  return goog.object.containsValue(obj, val);
};
goog.object.getValues = function(obj) {
  var res = [], i = 0, key;
  for (key in obj) {
    res[i++] = obj[key];
  }
  return res;
};
goog.object.getKeys = function(obj) {
  var res = [], i = 0, key;
  for (key in obj) {
    res[i++] = key;
  }
  return res;
};
goog.object.getValueByKeys = function(obj, var_args) {
  for (var isArrayLike = goog.isArrayLike(var_args), keys = isArrayLike ? var_args : arguments, i = isArrayLike ? 0 : 1; i < keys.length; i++) {
    if (null == obj) {
      return;
    }
    obj = obj[keys[i]];
  }
  return obj;
};
goog.object.containsKey = function(obj, key) {
  return null !== obj && key in obj;
};
goog.object.containsValue = function(obj, val) {
  for (var key in obj) {
    if (obj[key] == val) {
      return !0;
    }
  }
  return !1;
};
goog.object.findKey = function(obj, f, opt_this) {
  for (var key in obj) {
    if (f.call(opt_this, obj[key], key, obj)) {
      return key;
    }
  }
};
goog.object.findValue = function(obj, f, opt_this) {
  var key = goog.object.findKey(obj, f, opt_this);
  return key && obj[key];
};
goog.object.isEmpty = function(obj) {
  for (var key in obj) {
    return !1;
  }
  return !0;
};
goog.object.clear = function(obj) {
  for (var i in obj) {
    delete obj[i];
  }
};
goog.object.remove = function(obj, key) {
  var rv;
  (rv = key in obj) && delete obj[key];
  return rv;
};
goog.object.add = function(obj, key, val) {
  if (null !== obj && key in obj) {
    throw Error('The object already contains the key "' + key + '"');
  }
  goog.object.set(obj, key, val);
};
goog.object.get = function(obj, key, opt_val) {
  return null !== obj && key in obj ? obj[key] : opt_val;
};
goog.object.set = function(obj, key, value) {
  obj[key] = value;
};
goog.object.setIfUndefined = function(obj, key, value) {
  return key in obj ? obj[key] : obj[key] = value;
};
goog.object.setWithReturnValueIfNotSet = function(obj, key, f) {
  if (key in obj) {
    return obj[key];
  }
  var val = f();
  return obj[key] = val;
};
goog.object.equals = function(a, b) {
  for (var k in a) {
    if (!(k in b) || a[k] !== b[k]) {
      return !1;
    }
  }
  for (k in b) {
    if (!(k in a)) {
      return !1;
    }
  }
  return !0;
};
goog.object.clone = function(obj) {
  var res = {}, key;
  for (key in obj) {
    res[key] = obj[key];
  }
  return res;
};
goog.object.unsafeClone = function(obj) {
  var type = goog.typeOf(obj);
  if ("object" == type || "array" == type) {
    if (goog.isFunction(obj.clone)) {
      return obj.clone();
    }
    var clone = "array" == type ? [] : {}, key;
    for (key in obj) {
      clone[key] = goog.object.unsafeClone(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.object.transpose = function(obj) {
  var transposed = {}, key;
  for (key in obj) {
    transposed[obj[key]] = key;
  }
  return transposed;
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function(target, var_args) {
  for (var key, source, i = 1; i < arguments.length; i++) {
    source = arguments[i];
    for (key in source) {
      target[key] = source[key];
    }
    for (var j = 0; j < goog.object.PROTOTYPE_FIELDS_.length; j++) {
      key = goog.object.PROTOTYPE_FIELDS_[j], Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
    }
  }
};
goog.object.create = function(var_args) {
  var argLength = arguments.length;
  if (1 == argLength && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0]);
  }
  if (argLength % 2) {
    throw Error("Uneven number of arguments");
  }
  for (var rv = {}, i = 0; i < argLength; i += 2) {
    rv[arguments[i]] = arguments[i + 1];
  }
  return rv;
};
goog.object.createSet = function(var_args) {
  var argLength = arguments.length;
  if (1 == argLength && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0]);
  }
  for (var rv = {}, i = 0; i < argLength; i++) {
    rv[arguments[i]] = !0;
  }
  return rv;
};
goog.object.createImmutableView = function(obj) {
  var result = obj;
  Object.isFrozen && !Object.isFrozen(obj) && (result = Object.create(obj), Object.freeze(result));
  return result;
};
goog.object.isImmutableView = function(obj) {
  return !!Object.isFrozen && Object.isFrozen(obj);
};
goog.object.getAllPropertyNames = function(obj, opt_includeObjectPrototype, opt_includeFunctionPrototype) {
  if (!obj) {
    return [];
  }
  if (!Object.getOwnPropertyNames || !Object.getPrototypeOf) {
    return goog.object.getKeys(obj);
  }
  for (var visitedSet = {}, proto = obj; proto && (proto !== Object.prototype || opt_includeObjectPrototype) && (proto !== Function.prototype || opt_includeFunctionPrototype);) {
    for (var names = Object.getOwnPropertyNames(proto), i = 0; i < names.length; i++) {
      visitedSet[names[i]] = !0;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return goog.object.getKeys(visitedSet);
};
goog.string = {};
goog.string.DETECT_DOUBLE_ESCAPING = !1;
goog.string.FORCE_NON_DOM_HTML_UNESCAPING = !1;
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(str, prefix) {
  return 0 == str.lastIndexOf(prefix, 0);
};
goog.string.endsWith = function(str, suffix) {
  var l = str.length - suffix.length;
  return 0 <= l && str.indexOf(suffix, l) == l;
};
goog.string.caseInsensitiveStartsWith = function(str, prefix) {
  return 0 == goog.string.caseInsensitiveCompare(prefix, str.substr(0, prefix.length));
};
goog.string.caseInsensitiveEndsWith = function(str, suffix) {
  return 0 == goog.string.caseInsensitiveCompare(suffix, str.substr(str.length - suffix.length, suffix.length));
};
goog.string.caseInsensitiveEquals = function(str1, str2) {
  return str1.toLowerCase() == str2.toLowerCase();
};
goog.string.subs = function(str, var_args) {
  for (var splitParts = str.split("%s"), returnString = "", subsArguments = Array.prototype.slice.call(arguments, 1); subsArguments.length && 1 < splitParts.length;) {
    returnString += splitParts.shift() + subsArguments.shift();
  }
  return returnString + splitParts.join("%s");
};
goog.string.collapseWhitespace = function(str) {
  return str.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
goog.string.isEmptyOrWhitespace = function(str) {
  return /^[\s\xa0]*$/.test(str);
};
goog.string.isEmptyString = function(str) {
  return 0 == str.length;
};
goog.string.isEmpty = goog.string.isEmptyOrWhitespace;
goog.string.isEmptyOrWhitespaceSafe = function(str) {
  return goog.string.isEmptyOrWhitespace(goog.string.makeSafe(str));
};
goog.string.isEmptySafe = goog.string.isEmptyOrWhitespaceSafe;
goog.string.isBreakingWhitespace = function(str) {
  return !/[^\t\n\r ]/.test(str);
};
goog.string.isAlpha = function(str) {
  return !/[^a-zA-Z]/.test(str);
};
goog.string.isNumeric = function(str) {
  return !/[^0-9]/.test(str);
};
goog.string.isAlphaNumeric = function(str) {
  return !/[^a-zA-Z0-9]/.test(str);
};
goog.string.isSpace = function(ch) {
  return " " == ch;
};
goog.string.isUnicodeChar = function(ch) {
  return 1 == ch.length && " " <= ch && "~" >= ch || "\u0080" <= ch && "\ufffd" >= ch;
};
goog.string.stripNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)+/g, " ");
};
goog.string.canonicalizeNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)/g, "\n");
};
goog.string.normalizeWhitespace = function(str) {
  return str.replace(/\xa0|\s/g, " ");
};
goog.string.normalizeSpaces = function(str) {
  return str.replace(/\xa0|[ \t]+/g, " ");
};
goog.string.collapseBreakingSpaces = function(str) {
  return str.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
goog.string.trim = goog.TRUSTED_SITE && String.prototype.trim ? function(str) {
  return str.trim();
} : function(str) {
  return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(str)[1];
};
goog.string.trimLeft = function(str) {
  return str.replace(/^[\s\xa0]+/, "");
};
goog.string.trimRight = function(str) {
  return str.replace(/[\s\xa0]+$/, "");
};
goog.string.caseInsensitiveCompare = function(str1, str2) {
  var test1 = String(str1).toLowerCase(), test2 = String(str2).toLowerCase();
  return test1 < test2 ? -1 : test1 == test2 ? 0 : 1;
};
goog.string.numberAwareCompare_ = function(str1, str2, tokenizerRegExp) {
  if (str1 == str2) {
    return 0;
  }
  if (!str1) {
    return -1;
  }
  if (!str2) {
    return 1;
  }
  for (var tokens1 = str1.toLowerCase().match(tokenizerRegExp), tokens2 = str2.toLowerCase().match(tokenizerRegExp), count = Math.min(tokens1.length, tokens2.length), i = 0; i < count; i++) {
    var a = tokens1[i], b = tokens2[i];
    if (a != b) {
      var num1 = parseInt(a, 10);
      if (!isNaN(num1)) {
        var num2 = parseInt(b, 10);
        if (!isNaN(num2) && num1 - num2) {
          return num1 - num2;
        }
      }
      return a < b ? -1 : 1;
    }
  }
  return tokens1.length != tokens2.length ? tokens1.length - tokens2.length : str1 < str2 ? -1 : 1;
};
goog.string.intAwareCompare = function(str1, str2) {
  return goog.string.numberAwareCompare_(str1, str2, /\d+|\D+/g);
};
goog.string.floatAwareCompare = function(str1, str2) {
  return goog.string.numberAwareCompare_(str1, str2, /\d+|\.\d+|\D+/g);
};
goog.string.numerateCompare = goog.string.floatAwareCompare;
goog.string.urlEncode = function(str) {
  return encodeURIComponent(String(str));
};
goog.string.urlDecode = function(str) {
  return decodeURIComponent(str.replace(/\+/g, " "));
};
goog.string.newLineToBr = function(str, opt_xml) {
  return str.replace(/(\r\n|\r|\n)/g, opt_xml ? "<br />" : "<br>");
};
goog.string.htmlEscape = function(str, opt_isLikelyToContainHtmlChars) {
  if (opt_isLikelyToContainHtmlChars) {
    str = str.replace(goog.string.AMP_RE_, "&amp;").replace(goog.string.LT_RE_, "&lt;").replace(goog.string.GT_RE_, "&gt;").replace(goog.string.QUOT_RE_, "&quot;").replace(goog.string.SINGLE_QUOTE_RE_, "&#39;").replace(goog.string.NULL_RE_, "&#0;"), goog.string.DETECT_DOUBLE_ESCAPING && (str = str.replace(goog.string.E_RE_, "&#101;"));
  } else {
    if (!goog.string.ALL_RE_.test(str)) {
      return str;
    }
    -1 != str.indexOf("&") && (str = str.replace(goog.string.AMP_RE_, "&amp;"));
    -1 != str.indexOf("<") && (str = str.replace(goog.string.LT_RE_, "&lt;"));
    -1 != str.indexOf(">") && (str = str.replace(goog.string.GT_RE_, "&gt;"));
    -1 != str.indexOf('"') && (str = str.replace(goog.string.QUOT_RE_, "&quot;"));
    -1 != str.indexOf("'") && (str = str.replace(goog.string.SINGLE_QUOTE_RE_, "&#39;"));
    -1 != str.indexOf("\x00") && (str = str.replace(goog.string.NULL_RE_, "&#0;"));
    goog.string.DETECT_DOUBLE_ESCAPING && -1 != str.indexOf("e") && (str = str.replace(goog.string.E_RE_, "&#101;"));
  }
  return str;
};
goog.string.AMP_RE_ = /&/g;
goog.string.LT_RE_ = /</g;
goog.string.GT_RE_ = />/g;
goog.string.QUOT_RE_ = /"/g;
goog.string.SINGLE_QUOTE_RE_ = /'/g;
goog.string.NULL_RE_ = /\x00/g;
goog.string.E_RE_ = /e/g;
goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
goog.string.unescapeEntities = function(str) {
  return goog.string.contains(str, "&") ? !goog.string.FORCE_NON_DOM_HTML_UNESCAPING && "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(str) : goog.string.unescapePureXmlEntities_(str) : str;
};
goog.string.unescapeEntitiesWithDocument = function(str, document) {
  return goog.string.contains(str, "&") ? goog.string.unescapeEntitiesUsingDom_(str, document) : str;
};
goog.string.unescapeEntitiesUsingDom_ = function(str, opt_document) {
  var seen = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'};
  var div = opt_document ? opt_document.createElement("div") : goog.global.document.createElement("div");
  return str.replace(goog.string.HTML_ENTITY_PATTERN_, function(s, entity) {
    var value = seen[s];
    if (value) {
      return value;
    }
    if ("#" == entity.charAt(0)) {
      var n = Number("0" + entity.substr(1));
      isNaN(n) || (value = String.fromCharCode(n));
    }
    value || (div.innerHTML = s + " ", value = div.firstChild.nodeValue.slice(0, -1));
    return seen[s] = value;
  });
};
goog.string.unescapePureXmlEntities_ = function(str) {
  return str.replace(/&([^;]+);/g, function(s, entity) {
    switch(entity) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      case "quot":
        return '"';
      default:
        if ("#" == entity.charAt(0)) {
          var n = Number("0" + entity.substr(1));
          if (!isNaN(n)) {
            return String.fromCharCode(n);
          }
        }
        return s;
    }
  });
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(str, opt_xml) {
  return goog.string.newLineToBr(str.replace(/  /g, " &#160;"), opt_xml);
};
goog.string.preserveSpaces = function(str) {
  return str.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP);
};
goog.string.stripQuotes = function(str, quoteChars) {
  for (var length = quoteChars.length, i = 0; i < length; i++) {
    var quoteChar = 1 == length ? quoteChars : quoteChars.charAt(i);
    if (str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) {
      return str.substring(1, str.length - 1);
    }
  }
  return str;
};
goog.string.truncate = function(str, chars, opt_protectEscapedCharacters) {
  opt_protectEscapedCharacters && (str = goog.string.unescapeEntities(str));
  str.length > chars && (str = str.substring(0, chars - 3) + "...");
  opt_protectEscapedCharacters && (str = goog.string.htmlEscape(str));
  return str;
};
goog.string.truncateMiddle = function(str, chars, opt_protectEscapedCharacters, opt_trailingChars) {
  opt_protectEscapedCharacters && (str = goog.string.unescapeEntities(str));
  if (opt_trailingChars && str.length > chars) {
    opt_trailingChars > chars && (opt_trailingChars = chars), str = str.substring(0, chars - opt_trailingChars) + "..." + str.substring(str.length - opt_trailingChars);
  } else {
    if (str.length > chars) {
      var half = Math.floor(chars / 2);
      str = str.substring(0, half + chars % 2) + "..." + str.substring(str.length - half);
    }
  }
  opt_protectEscapedCharacters && (str = goog.string.htmlEscape(str));
  return str;
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\", "<":"<"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(s) {
  s = String(s);
  for (var sb = ['"'], i = 0; i < s.length; i++) {
    var ch = s.charAt(i), cc = ch.charCodeAt(0);
    sb[i + 1] = goog.string.specialEscapeChars_[ch] || (31 < cc && 127 > cc ? ch : goog.string.escapeChar(ch));
  }
  sb.push('"');
  return sb.join("");
};
goog.string.escapeString = function(str) {
  for (var sb = [], i = 0; i < str.length; i++) {
    sb[i] = goog.string.escapeChar(str.charAt(i));
  }
  return sb.join("");
};
goog.string.escapeChar = function(c) {
  if (c in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[c];
  }
  if (c in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[c] = goog.string.specialEscapeChars_[c];
  }
  var cc = c.charCodeAt(0);
  if (31 < cc && 127 > cc) {
    var rv = c;
  } else {
    if (256 > cc) {
      if (rv = "\\x", 16 > cc || 256 < cc) {
        rv += "0";
      }
    } else {
      rv = "\\u", 4096 > cc && (rv += "0");
    }
    rv += cc.toString(16).toUpperCase();
  }
  return goog.string.jsEscapeCache_[c] = rv;
};
goog.string.contains = function(str, subString) {
  return -1 != str.indexOf(subString);
};
goog.string.caseInsensitiveContains = function(str, subString) {
  return goog.string.contains(str.toLowerCase(), subString.toLowerCase());
};
goog.string.countOf = function(s, ss) {
  return s && ss ? s.split(ss).length - 1 : 0;
};
goog.string.removeAt = function(s, index, stringLength) {
  var resultStr = s;
  0 <= index && index < s.length && 0 < stringLength && (resultStr = s.substr(0, index) + s.substr(index + stringLength, s.length - index - stringLength));
  return resultStr;
};
goog.string.remove = function(str, substr) {
  return str.replace(substr, "");
};
goog.string.removeAll = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "g");
  return s.replace(re, "");
};
goog.string.replaceAll = function(s, ss, replacement) {
  var re = new RegExp(goog.string.regExpEscape(ss), "g");
  return s.replace(re, replacement.replace(/\$/g, "$$$$"));
};
goog.string.regExpEscape = function(s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
goog.string.repeat = String.prototype.repeat ? function(string, length) {
  return string.repeat(length);
} : function(string, length) {
  return Array(length + 1).join(string);
};
goog.string.padNumber = function(num, length, opt_precision) {
  var s = goog.isDef(opt_precision) ? num.toFixed(opt_precision) : String(num), index = s.indexOf(".");
  -1 == index && (index = s.length);
  return goog.string.repeat("0", Math.max(0, length - index)) + s;
};
goog.string.makeSafe = function(obj) {
  return null == obj ? "" : String(obj);
};
goog.string.buildString = function(var_args) {
  return Array.prototype.join.call(arguments, "");
};
goog.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36);
};
goog.string.compareVersions = function(version1, version2) {
  for (var order = 0, v1Subs = goog.string.trim(String(version1)).split("."), v2Subs = goog.string.trim(String(version2)).split("."), subCount = Math.max(v1Subs.length, v2Subs.length), subIdx = 0; 0 == order && subIdx < subCount; subIdx++) {
    var v1Sub = v1Subs[subIdx] || "", v2Sub = v2Subs[subIdx] || "";
    do {
      var v1Comp = /(\d*)(\D*)(.*)/.exec(v1Sub) || ["", "", "", ""], v2Comp = /(\d*)(\D*)(.*)/.exec(v2Sub) || ["", "", "", ""];
      if (0 == v1Comp[0].length && 0 == v2Comp[0].length) {
        break;
      }
      order = goog.string.compareElements_(0 == v1Comp[1].length ? 0 : parseInt(v1Comp[1], 10), 0 == v2Comp[1].length ? 0 : parseInt(v2Comp[1], 10)) || goog.string.compareElements_(0 == v1Comp[2].length, 0 == v2Comp[2].length) || goog.string.compareElements_(v1Comp[2], v2Comp[2]);
      v1Sub = v1Comp[3];
      v2Sub = v2Comp[3];
    } while (0 == order);
  }
  return order;
};
goog.string.compareElements_ = function(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
};
goog.string.hashCode = function(str) {
  for (var result = 0, i = 0; i < str.length; ++i) {
    result = 31 * result + str.charCodeAt(i) >>> 0;
  }
  return result;
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
  return "goog_" + goog.string.uniqueStringCounter_++;
};
goog.string.toNumber = function(str) {
  var num = Number(str);
  return 0 == num && goog.string.isEmptyOrWhitespace(str) ? NaN : num;
};
goog.string.isLowerCamelCase = function(str) {
  return /^[a-z]+([A-Z][a-z]*)*$/.test(str);
};
goog.string.isUpperCamelCase = function(str) {
  return /^([A-Z][a-z]*)+$/.test(str);
};
goog.string.toCamelCase = function(str) {
  return String(str).replace(/\-([a-z])/g, function(all, match) {
    return match.toUpperCase();
  });
};
goog.string.toSelectorCase = function(str) {
  return String(str).replace(/([A-Z])/g, "-$1").toLowerCase();
};
goog.string.toTitleCase = function(str, opt_delimiters) {
  var delimiters = goog.isString(opt_delimiters) ? goog.string.regExpEscape(opt_delimiters) : "\\s";
  return str.replace(new RegExp("(^" + (delimiters ? "|[" + delimiters + "]+" : "") + ")([a-z])", "g"), function(all, p1, p2) {
    return p1 + p2.toUpperCase();
  });
};
goog.string.capitalize = function(str) {
  return String(str.charAt(0)).toUpperCase() + String(str.substr(1)).toLowerCase();
};
goog.string.parseInt = function(value) {
  isFinite(value) && (value = String(value));
  return goog.isString(value) ? /^\s*-?0x/i.test(value) ? parseInt(value, 16) : parseInt(value, 10) : NaN;
};
goog.string.splitLimit = function(str, separator, limit) {
  for (var parts = str.split(separator), returnVal = []; 0 < limit && parts.length;) {
    returnVal.push(parts.shift()), limit--;
  }
  parts.length && returnVal.push(parts.join(separator));
  return returnVal;
};
goog.string.lastComponent = function(str, separators) {
  if (separators) {
    "string" == typeof separators && (separators = [separators]);
  } else {
    return str;
  }
  for (var lastSeparatorIndex = -1, i = 0; i < separators.length; i++) {
    if ("" != separators[i]) {
      var currentSeparatorIndex = str.lastIndexOf(separators[i]);
      currentSeparatorIndex > lastSeparatorIndex && (lastSeparatorIndex = currentSeparatorIndex);
    }
  }
  return -1 == lastSeparatorIndex ? str : str.slice(lastSeparatorIndex + 1);
};
goog.string.editDistance = function(a, b) {
  var v0 = [], v1 = [];
  if (a == b) {
    return 0;
  }
  if (!a.length || !b.length) {
    return Math.max(a.length, b.length);
  }
  for (var i = 0; i < b.length + 1; i++) {
    v0[i] = i;
  }
  for (i = 0; i < a.length; i++) {
    v1[0] = i + 1;
    for (var j = 0; j < b.length; j++) {
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + Number(a[i] != b[j]));
    }
    for (j = 0; j < v0.length; j++) {
      v0[j] = v1[j];
    }
  }
  return v1[b.length];
};
/*

 Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at
 http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at
 http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at
 http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at
 http://polymer.github.io/PATENTS.txt
*/
var security = {html:{}};
security.html.contracts = {};
security.html.contracts.AttrType = {NONE:1, SAFE_HTML:2, SAFE_URL:3, TRUSTED_RESOURCE_URL:4, SAFE_STYLE:5, SAFE_SCRIPT:7, ENUM:8, COMPILE_TIME_CONSTANT:9, IDENTIFIER:10};
security.html.contracts.ElementContentType = {CONTRACT_UNSPECIFIED:0, SAFE_HTML:1, SAFE_STYLESHEET:2, SAFE_SCRIPT:3, BLACKLIST:4, VOID:5, STRING_RCDATA:6};
security.html.contracts.typeOfAttribute = function(elName, attrName, getValue) {
  if (Object.hasOwnProperty.call(security.html.contracts.ELEMENT_CONTRACTS_, elName)) {
    var elementInfo = security.html.contracts.ELEMENT_CONTRACTS_[elName];
    if (Object.hasOwnProperty.call(elementInfo, attrName)) {
      var attrInfoArray = elementInfo[attrName];
      if (attrInfoArray instanceof Array) {
        for (var valueCache = null, requiredValueNotFound = !1, i = 0, n = attrInfoArray.length; i < n; ++i) {
          var attrInfo = attrInfoArray[i], contingentAttr = attrInfo.contingentAttribute;
          if (!contingentAttr) {
            return attrInfo.contract;
          }
          null === valueCache && (valueCache = {});
          var actualValue = Object.hasOwnProperty.call(valueCache, contingentAttr) ? valueCache[contingentAttr] : valueCache[contingentAttr] = getValue(contingentAttr);
          if (actualValue === attrInfo.requiredValue) {
            return attrInfo.contract;
          }
          null == actualValue && (requiredValueNotFound = !0);
        }
        if (requiredValueNotFound) {
          return null;
        }
      }
    }
  }
  var globalAttrType = security.html.contracts.GLOBAL_ATTRS_[attrName];
  return "number" === typeof globalAttrType ? globalAttrType : null;
};
security.html.contracts.contentTypeForElement = function(elemName) {
  return Object.hasOwnProperty.call(security.html.contracts.ELEMENT_CONTENT_TYPES_, elemName) ? security.html.contracts.ELEMENT_CONTENT_TYPES_[elemName] : null;
};
security.html.contracts.isEnumValueAllowed = function(elemName, attrName, value) {
  var valueSetIndex = null, attrToValueSetIndex = security.html.contracts.ENUM_VALUE_SET_BY_ATTR_[elemName];
  attrToValueSetIndex && (valueSetIndex = attrToValueSetIndex[attrName]);
  return goog.isNumber(valueSetIndex) || ((attrToValueSetIndex = security.html.contracts.ENUM_VALUE_SET_BY_ATTR_["*"]) && (valueSetIndex = attrToValueSetIndex[attrName]), goog.isNumber(valueSetIndex)) ? !0 === security.html.contracts.ENUM_VALUE_SETS_[valueSetIndex][String(value).toLowerCase()] : !1;
};
security.html.contracts.GLOBAL_ATTRS_ = {align:security.html.contracts.AttrType.NONE, alt:security.html.contracts.AttrType.NONE, "aria-activedescendant":security.html.contracts.AttrType.IDENTIFIER, "aria-atomic":security.html.contracts.AttrType.NONE, "aria-autocomplete":security.html.contracts.AttrType.NONE, "aria-busy":security.html.contracts.AttrType.NONE, "aria-checked":security.html.contracts.AttrType.NONE, "aria-disabled":security.html.contracts.AttrType.NONE, "aria-dropeffect":security.html.contracts.AttrType.NONE, 
"aria-expanded":security.html.contracts.AttrType.NONE, "aria-haspopup":security.html.contracts.AttrType.NONE, "aria-hidden":security.html.contracts.AttrType.NONE, "aria-invalid":security.html.contracts.AttrType.NONE, "aria-label":security.html.contracts.AttrType.NONE, "aria-level":security.html.contracts.AttrType.NONE, "aria-live":security.html.contracts.AttrType.NONE, "aria-multiline":security.html.contracts.AttrType.NONE, "aria-multiselectable":security.html.contracts.AttrType.NONE, "aria-orientation":security.html.contracts.AttrType.NONE, 
"aria-posinset":security.html.contracts.AttrType.NONE, "aria-pressed":security.html.contracts.AttrType.NONE, "aria-readonly":security.html.contracts.AttrType.NONE, "aria-relevant":security.html.contracts.AttrType.NONE, "aria-required":security.html.contracts.AttrType.NONE, "aria-selected":security.html.contracts.AttrType.NONE, "aria-setsize":security.html.contracts.AttrType.NONE, "aria-sort":security.html.contracts.AttrType.NONE, "aria-valuemax":security.html.contracts.AttrType.NONE, "aria-valuemin":security.html.contracts.AttrType.NONE, 
"aria-valuenow":security.html.contracts.AttrType.NONE, "aria-valuetext":security.html.contracts.AttrType.NONE, autocapitalize:security.html.contracts.AttrType.NONE, autocomplete:security.html.contracts.AttrType.NONE, autocorrect:security.html.contracts.AttrType.NONE, autofocus:security.html.contracts.AttrType.NONE, bgcolor:security.html.contracts.AttrType.NONE, border:security.html.contracts.AttrType.NONE, checked:security.html.contracts.AttrType.NONE, "class":security.html.contracts.AttrType.NONE, 
color:security.html.contracts.AttrType.NONE, cols:security.html.contracts.AttrType.NONE, colspan:security.html.contracts.AttrType.NONE, dir:security.html.contracts.AttrType.ENUM, disabled:security.html.contracts.AttrType.NONE, draggable:security.html.contracts.AttrType.NONE, face:security.html.contracts.AttrType.NONE, "for":security.html.contracts.AttrType.IDENTIFIER, frameborder:security.html.contracts.AttrType.NONE, height:security.html.contracts.AttrType.NONE, hidden:security.html.contracts.AttrType.NONE, 
href:security.html.contracts.AttrType.TRUSTED_RESOURCE_URL, hreflang:security.html.contracts.AttrType.NONE, id:security.html.contracts.AttrType.IDENTIFIER, ismap:security.html.contracts.AttrType.NONE, label:security.html.contracts.AttrType.NONE, lang:security.html.contracts.AttrType.NONE, list:security.html.contracts.AttrType.IDENTIFIER, loop:security.html.contracts.AttrType.NONE, max:security.html.contracts.AttrType.NONE, maxlength:security.html.contracts.AttrType.NONE, min:security.html.contracts.AttrType.NONE, 
multiple:security.html.contracts.AttrType.NONE, muted:security.html.contracts.AttrType.NONE, name:security.html.contracts.AttrType.IDENTIFIER, placeholder:security.html.contracts.AttrType.NONE, preload:security.html.contracts.AttrType.NONE, rel:security.html.contracts.AttrType.NONE, required:security.html.contracts.AttrType.NONE, reversed:security.html.contracts.AttrType.NONE, role:security.html.contracts.AttrType.NONE, rows:security.html.contracts.AttrType.NONE, rowspan:security.html.contracts.AttrType.NONE, 
selected:security.html.contracts.AttrType.NONE, shape:security.html.contracts.AttrType.NONE, size:security.html.contracts.AttrType.NONE, sizes:security.html.contracts.AttrType.NONE, span:security.html.contracts.AttrType.NONE, spellcheck:security.html.contracts.AttrType.NONE, src:security.html.contracts.AttrType.TRUSTED_RESOURCE_URL, start:security.html.contracts.AttrType.NONE, step:security.html.contracts.AttrType.NONE, style:security.html.contracts.AttrType.SAFE_STYLE, summary:security.html.contracts.AttrType.NONE, 
tabindex:security.html.contracts.AttrType.NONE, target:security.html.contracts.AttrType.ENUM, title:security.html.contracts.AttrType.NONE, translate:security.html.contracts.AttrType.NONE, valign:security.html.contracts.AttrType.NONE, value:security.html.contracts.AttrType.NONE, width:security.html.contracts.AttrType.NONE, wrap:security.html.contracts.AttrType.NONE};
security.html.contracts.ELEMENT_CONTRACTS_ = {a:{href:[{contract:security.html.contracts.AttrType.SAFE_URL}]}, area:{href:[{contract:security.html.contracts.AttrType.SAFE_URL}]}, audio:{src:[{contract:security.html.contracts.AttrType.SAFE_URL}]}, blockquote:{cite:[{contract:security.html.contracts.AttrType.SAFE_URL}]}, button:{formaction:[{contract:security.html.contracts.AttrType.SAFE_URL}], formmethod:[{contract:security.html.contracts.AttrType.NONE}], type:[{contract:security.html.contracts.AttrType.NONE}]}, 
command:{type:[{contract:security.html.contracts.AttrType.NONE}]}, del:{cite:[{contract:security.html.contracts.AttrType.SAFE_URL}]}, form:{action:[{contract:security.html.contracts.AttrType.SAFE_URL}], method:[{contract:security.html.contracts.AttrType.NONE}]}, iframe:{srcdoc:[{contract:security.html.contracts.AttrType.SAFE_HTML}]}, img:{src:[{contract:security.html.contracts.AttrType.SAFE_URL}]}, input:{formaction:[{contract:security.html.contracts.AttrType.SAFE_URL}], formmethod:[{contract:security.html.contracts.AttrType.NONE}], 
pattern:[{contract:security.html.contracts.AttrType.NONE}], readonly:[{contract:security.html.contracts.AttrType.NONE}], src:[{contract:security.html.contracts.AttrType.SAFE_URL}], type:[{contract:security.html.contracts.AttrType.NONE}]}, ins:{cite:[{contract:security.html.contracts.AttrType.SAFE_URL}]}, li:{type:[{contract:security.html.contracts.AttrType.NONE}]}, link:{href:[{contract:security.html.contracts.AttrType.SAFE_URL, contingentAttribute:"rel", requiredValue:"alternate"}, {contract:security.html.contracts.AttrType.SAFE_URL, 
contingentAttribute:"rel", requiredValue:"author"}, {contract:security.html.contracts.AttrType.SAFE_URL, contingentAttribute:"rel", requiredValue:"bookmark"}, {contract:security.html.contracts.AttrType.SAFE_URL, contingentAttribute:"rel", requiredValue:"canonical"}, {contract:security.html.contracts.AttrType.SAFE_URL, contingentAttribute:"rel", requiredValue:"cite"}, {contract:security.html.contracts.AttrType.SAFE_URL, contingentAttribute:"rel", requiredValue:"help"}, {contract:security.html.contracts.AttrType.SAFE_URL, 
contingentAttribute:"rel", requiredValue:"icon"}, {contract:security.html.contracts.AttrType.SAFE_URL, contingentAttribute:"rel", requiredValue:"license"}, {contract:security.html.contracts.AttrType.SAFE_URL, contingentAttribute:"rel", requiredValue:"next"}, {contract:security.html.contracts.AttrType.SAFE_URL, contingentAttribute:"rel", requiredValue:"prefetch"}, {contract:security.html.contracts.AttrType.SAFE_URL, contingentAttribute:"rel", requiredValue:"prerender"}, {contract:security.html.contracts.AttrType.SAFE_URL, 
contingentAttribute:"rel", requiredValue:"preconnect"}, {contract:security.html.contracts.AttrType.SAFE_URL, contingentAttribute:"rel", requiredValue:"preload"}, {contract:security.html.contracts.AttrType.SAFE_URL, contingentAttribute:"rel", requiredValue:"prev"}, {contract:security.html.contracts.AttrType.SAFE_URL, contingentAttribute:"rel", requiredValue:"search"}, {contract:security.html.contracts.AttrType.SAFE_URL, contingentAttribute:"rel", requiredValue:"subresource"}], media:[{contract:security.html.contracts.AttrType.NONE}], 
nonce:[{contract:security.html.contracts.AttrType.NONE}], type:[{contract:security.html.contracts.AttrType.NONE}]}, menuitem:{icon:[{contract:security.html.contracts.AttrType.SAFE_URL}]}, ol:{type:[{contract:security.html.contracts.AttrType.NONE}]}, q:{cite:[{contract:security.html.contracts.AttrType.SAFE_URL}]}, script:{nonce:[{contract:security.html.contracts.AttrType.NONE}]}, source:{media:[{contract:security.html.contracts.AttrType.NONE}], src:[{contract:security.html.contracts.AttrType.SAFE_URL}]}, 
style:{media:[{contract:security.html.contracts.AttrType.NONE}], nonce:[{contract:security.html.contracts.AttrType.NONE}]}, time:{datetime:[{contract:security.html.contracts.AttrType.NONE}]}, video:{autoplay:[{contract:security.html.contracts.AttrType.NONE}], controls:[{contract:security.html.contracts.AttrType.NONE}], poster:[{contract:security.html.contracts.AttrType.SAFE_URL}], src:[{contract:security.html.contracts.AttrType.SAFE_URL}]}};
security.html.contracts.ELEMENT_CONTENT_TYPES_ = {a:security.html.contracts.ElementContentType.SAFE_HTML, abbr:security.html.contracts.ElementContentType.SAFE_HTML, address:security.html.contracts.ElementContentType.SAFE_HTML, applet:security.html.contracts.ElementContentType.BLACKLIST, area:security.html.contracts.ElementContentType.VOID, article:security.html.contracts.ElementContentType.SAFE_HTML, aside:security.html.contracts.ElementContentType.SAFE_HTML, audio:security.html.contracts.ElementContentType.SAFE_HTML, 
b:security.html.contracts.ElementContentType.SAFE_HTML, base:security.html.contracts.ElementContentType.BLACKLIST, bdi:security.html.contracts.ElementContentType.SAFE_HTML, bdo:security.html.contracts.ElementContentType.SAFE_HTML, blockquote:security.html.contracts.ElementContentType.SAFE_HTML, body:security.html.contracts.ElementContentType.SAFE_HTML, br:security.html.contracts.ElementContentType.VOID, button:security.html.contracts.ElementContentType.SAFE_HTML, canvas:security.html.contracts.ElementContentType.SAFE_HTML, 
caption:security.html.contracts.ElementContentType.SAFE_HTML, cite:security.html.contracts.ElementContentType.SAFE_HTML, code:security.html.contracts.ElementContentType.SAFE_HTML, col:security.html.contracts.ElementContentType.VOID, colgroup:security.html.contracts.ElementContentType.SAFE_HTML, command:security.html.contracts.ElementContentType.SAFE_HTML, data:security.html.contracts.ElementContentType.SAFE_HTML, datalist:security.html.contracts.ElementContentType.SAFE_HTML, dd:security.html.contracts.ElementContentType.SAFE_HTML, 
del:security.html.contracts.ElementContentType.SAFE_HTML, details:security.html.contracts.ElementContentType.SAFE_HTML, dfn:security.html.contracts.ElementContentType.SAFE_HTML, dialog:security.html.contracts.ElementContentType.SAFE_HTML, div:security.html.contracts.ElementContentType.SAFE_HTML, dl:security.html.contracts.ElementContentType.SAFE_HTML, dt:security.html.contracts.ElementContentType.SAFE_HTML, em:security.html.contracts.ElementContentType.SAFE_HTML, embed:security.html.contracts.ElementContentType.BLACKLIST, 
fieldset:security.html.contracts.ElementContentType.SAFE_HTML, figcaption:security.html.contracts.ElementContentType.SAFE_HTML, figure:security.html.contracts.ElementContentType.SAFE_HTML, font:security.html.contracts.ElementContentType.SAFE_HTML, footer:security.html.contracts.ElementContentType.SAFE_HTML, form:security.html.contracts.ElementContentType.SAFE_HTML, frame:security.html.contracts.ElementContentType.SAFE_HTML, frameset:security.html.contracts.ElementContentType.SAFE_HTML, h1:security.html.contracts.ElementContentType.SAFE_HTML, 
h2:security.html.contracts.ElementContentType.SAFE_HTML, h3:security.html.contracts.ElementContentType.SAFE_HTML, h4:security.html.contracts.ElementContentType.SAFE_HTML, h5:security.html.contracts.ElementContentType.SAFE_HTML, h6:security.html.contracts.ElementContentType.SAFE_HTML, head:security.html.contracts.ElementContentType.SAFE_HTML, header:security.html.contracts.ElementContentType.SAFE_HTML, hr:security.html.contracts.ElementContentType.VOID, html:security.html.contracts.ElementContentType.SAFE_HTML, 
i:security.html.contracts.ElementContentType.SAFE_HTML, iframe:security.html.contracts.ElementContentType.SAFE_HTML, img:security.html.contracts.ElementContentType.VOID, input:security.html.contracts.ElementContentType.VOID, ins:security.html.contracts.ElementContentType.SAFE_HTML, kbd:security.html.contracts.ElementContentType.SAFE_HTML, keygen:security.html.contracts.ElementContentType.VOID, label:security.html.contracts.ElementContentType.SAFE_HTML, legend:security.html.contracts.ElementContentType.SAFE_HTML, 
li:security.html.contracts.ElementContentType.SAFE_HTML, link:security.html.contracts.ElementContentType.VOID, main:security.html.contracts.ElementContentType.SAFE_HTML, map:security.html.contracts.ElementContentType.SAFE_HTML, mark:security.html.contracts.ElementContentType.SAFE_HTML, math:security.html.contracts.ElementContentType.BLACKLIST, menu:security.html.contracts.ElementContentType.SAFE_HTML, menuitem:security.html.contracts.ElementContentType.SAFE_HTML, meta:security.html.contracts.ElementContentType.BLACKLIST, 
meter:security.html.contracts.ElementContentType.SAFE_HTML, nav:security.html.contracts.ElementContentType.SAFE_HTML, noscript:security.html.contracts.ElementContentType.SAFE_HTML, object:security.html.contracts.ElementContentType.BLACKLIST, ol:security.html.contracts.ElementContentType.SAFE_HTML, optgroup:security.html.contracts.ElementContentType.SAFE_HTML, option:security.html.contracts.ElementContentType.SAFE_HTML, output:security.html.contracts.ElementContentType.SAFE_HTML, p:security.html.contracts.ElementContentType.SAFE_HTML, 
param:security.html.contracts.ElementContentType.VOID, picture:security.html.contracts.ElementContentType.SAFE_HTML, pre:security.html.contracts.ElementContentType.SAFE_HTML, progress:security.html.contracts.ElementContentType.SAFE_HTML, q:security.html.contracts.ElementContentType.SAFE_HTML, rb:security.html.contracts.ElementContentType.SAFE_HTML, rp:security.html.contracts.ElementContentType.SAFE_HTML, rt:security.html.contracts.ElementContentType.SAFE_HTML, rtc:security.html.contracts.ElementContentType.SAFE_HTML, 
ruby:security.html.contracts.ElementContentType.SAFE_HTML, s:security.html.contracts.ElementContentType.SAFE_HTML, samp:security.html.contracts.ElementContentType.SAFE_HTML, script:security.html.contracts.ElementContentType.SAFE_SCRIPT, section:security.html.contracts.ElementContentType.SAFE_HTML, select:security.html.contracts.ElementContentType.SAFE_HTML, slot:security.html.contracts.ElementContentType.SAFE_HTML, small:security.html.contracts.ElementContentType.SAFE_HTML, source:security.html.contracts.ElementContentType.VOID, 
span:security.html.contracts.ElementContentType.SAFE_HTML, strong:security.html.contracts.ElementContentType.SAFE_HTML, style:security.html.contracts.ElementContentType.SAFE_STYLESHEET, sub:security.html.contracts.ElementContentType.SAFE_HTML, summary:security.html.contracts.ElementContentType.SAFE_HTML, sup:security.html.contracts.ElementContentType.SAFE_HTML, svg:security.html.contracts.ElementContentType.BLACKLIST, table:security.html.contracts.ElementContentType.SAFE_HTML, tbody:security.html.contracts.ElementContentType.SAFE_HTML, 
td:security.html.contracts.ElementContentType.SAFE_HTML, template:security.html.contracts.ElementContentType.BLACKLIST, textarea:security.html.contracts.ElementContentType.STRING_RCDATA, tfoot:security.html.contracts.ElementContentType.SAFE_HTML, th:security.html.contracts.ElementContentType.SAFE_HTML, thead:security.html.contracts.ElementContentType.SAFE_HTML, time:security.html.contracts.ElementContentType.SAFE_HTML, title:security.html.contracts.ElementContentType.STRING_RCDATA, tr:security.html.contracts.ElementContentType.SAFE_HTML, 
track:security.html.contracts.ElementContentType.VOID, u:security.html.contracts.ElementContentType.SAFE_HTML, ul:security.html.contracts.ElementContentType.SAFE_HTML, "var":security.html.contracts.ElementContentType.SAFE_HTML, video:security.html.contracts.ElementContentType.SAFE_HTML, wbr:security.html.contracts.ElementContentType.VOID};
security.html.contracts.ENUM_VALUE_SETS_ = [{auto:!0, ltr:!0, rtl:!0}, {_self:!0, _blank:!0}];
security.html.contracts.ENUM_VALUE_SET_BY_ATTR_ = {"*":{dir:0, target:1}};
security.html.namealiases = {};
security.html.namealiases.propertyToAttr = function(propName) {
  var propToAttr = security.html.namealiases.propToAttr_;
  if (!propToAttr) {
    var attrToProp = security.html.namealiases.getAttrToProp_();
    propToAttr = security.html.namealiases.propToAttr_ = goog.object.transpose(attrToProp);
  }
  var attr = propToAttr[propName];
  return goog.isString(attr) ? attr : goog.string.toSelectorCase(propName);
};
security.html.namealiases.attrToProperty = function(attrName) {
  var canonAttrName = String(attrName).toLowerCase(), prop = security.html.namealiases.getAttrToProp_()[canonAttrName];
  return goog.isString(prop) ? prop : goog.string.toCamelCase(canonAttrName);
};
security.html.namealiases.specialPropertyNameWorstCase = function(name) {
  var lcname = name.toLowerCase(), prop = security.html.namealiases.getAttrToProp_()[lcname];
  return goog.isString(prop) ? prop : null;
};
security.html.namealiases.getAttrToProp_ = function() {
  if (!security.html.namealiases.attrToProp_) {
    security.html.namealiases.attrToProp_ = goog.object.clone(security.html.namealiases.ODD_ATTR_TO_PROP_);
    for (var noncanon = security.html.namealiases.NONCANON_PROPS_, i = 0, n = noncanon.length; i < n; ++i) {
      var name = noncanon[i];
      security.html.namealiases.attrToProp_[name.toLowerCase()] = name;
    }
  }
  return security.html.namealiases.attrToProp_;
};
security.html.namealiases.NONCANON_PROPS_ = "aLink accessKey allowFullscreen bgColor cellPadding cellSpacing codeBase codeType contentEditable crossOrigin dateTime dirName formAction formEnctype formMethod formNoValidate formTarget frameBorder innerHTML innerText inputMode isMap longDesc marginHeight marginWidth maxLength mediaGroup minLength noHref noResize noShade noValidate noWrap nodeValue outerHTML outerText readOnly tabIndex textContent trueSpeed useMap vAlign vLink valueAsDate valueAsNumber valueType".split(" ");
security.html.namealiases.ODD_ATTR_TO_PROP_ = {accept_charset:"acceptCharset", "char":"ch", charoff:"chOff", checked:"defaultChecked", "class":"className", "for":"htmlFor", http_equiv:"httpEquiv", muted:"defaultMuted", selected:"defaultSelected", value:"defaultValue"};
security.html.namealiases.attrToProp_ = null;
security.html.namealiases.propToAttr_ = null;
security.polymer_resin = {};
security.polymer_resin.CustomElementClassification = {BUILTIN:0, LEGACY:1, CUSTOM:2, CUSTOMIZABLE:3};
security.polymer_resin.docRegisteredElements_ = {};
security.polymer_resin.usePolymerTelemetry_ = !1;
security.polymer_resin.countPolymerTelemetryUnrolled_ = 0;
security.polymer_resin.hintUsesDeprecatedRegisterElement = function() {
  security.polymer_resin.usePolymerTelemetry_ = !0;
};
security.polymer_resin.ELEMENT_NAME_CHAR_RANGES_ = "a-z.0-9_\u00b7\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u037d\u200c\u200d\u203f-\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\udfff\uf900-\ufdcf\ufdf0-\ufffd";
security.polymer_resin.VALID_CUSTOM_ELEMENT_NAME_REGEX_ = new RegExp("^(?!(?:annotation-xml|color-profile|font-face|font-face(?:-(?:src|uri|format|name))?|missing-glyph)$)[a-z][" + security.polymer_resin.ELEMENT_NAME_CHAR_RANGES_ + "]*-[\\-" + security.polymer_resin.ELEMENT_NAME_CHAR_RANGES_ + "]*$");
security.polymer_resin.classifyElement = function(name, ctor) {
  var customElementsRegistry = window.customElements;
  if (security.polymer_resin.usePolymerTelemetry_) {
    for (var regs = Polymer.telemetry.registrations, n = regs.length, i = security.polymer_resin.countPolymerTelemetryUnrolled_; i < n; ++i) {
      security.polymer_resin.docRegisteredElements_[regs[i].is] = security.polymer_resin.docRegisteredElements_;
    }
    security.polymer_resin.countPolymerTelemetryUnrolled_ = n;
  }
  return customElementsRegistry && customElementsRegistry.get(name) || security.polymer_resin.docRegisteredElements_[name] === security.polymer_resin.docRegisteredElements_ ? security.polymer_resin.CustomElementClassification.CUSTOM : "HTMLUnknownElement" === ctor.name ? security.polymer_resin.CustomElementClassification.LEGACY : "HTMLElement" === ctor.name && security.polymer_resin.VALID_CUSTOM_ELEMENT_NAME_REGEX_.test(name) ? security.polymer_resin.CustomElementClassification.CUSTOMIZABLE : security.polymer_resin.CustomElementClassification.BUILTIN;
};
security.polymer_resin.STANDALONE = !1;
security.polymer_resin.SafeType = {CONSTANT:"CONSTANT", HTML:"HTML", JAVASCRIPT:"JAVASCRIPT", RESOURCE_URL:"RESOURCE_URL", STRING:"STRING", STYLE:"STYLE", URL:"URL"};
security.polymer_resin.CONSOLE_LOGGING_REPORT_HANDLER = function(isViolation, formatString, var_args) {
  for (var consoleArgs = [formatString], i = 2, n = arguments.length; i < n; ++i) {
    consoleArgs[i - 1] = arguments[i];
  }
  isViolation ? console.warn.apply(console, consoleArgs) : console.log.apply(console, consoleArgs);
};
security.polymer_resin.UNSAFE_passThruDisallowedValues_ = function(enable) {
  goog.DEBUG && (security.polymer_resin.allowUnsafeValues_ = !0 === enable);
};
security.polymer_resin.allowIdentifierWithPrefix_ = function(prefix) {
  security.polymer_resin.allowedIdentifierPattern_ = new RegExp(security.polymer_resin.allowedIdentifierPattern_.source + "|^" + goog.string.regExpEscape(prefix));
};
security.polymer_resin.setReportHandler_ = function(reportHandler) {
  security.polymer_resin.reportHandler_ = reportHandler || null;
};
security.polymer_resin.setSafeTypesBridge_ = function(safeTypesBridge) {
  security.polymer_resin.safeTypesBridge_ = safeTypesBridge || security.polymer_resin.DEFAULT_SAFE_TYPES_BRIDGE_;
};
security.polymer_resin.allowedIdentifierPattern_ = /^$/;
security.polymer_resin.allowUnsafeValues_ = !1;
security.polymer_resin.reportHandler_ = void 0;
security.polymer_resin.DEFAULT_SAFE_TYPES_BRIDGE_ = function(value, type, fallback) {
  return fallback;
};
security.polymer_resin.safeTypesBridge_ = security.polymer_resin.DEFAULT_SAFE_TYPES_BRIDGE_;
security.polymer_resin.install = function(opt_config) {
  function getAttributeValue(name) {
    var value = this.getAttribute(name);
    return !value || /[\[\{]/.test(name) ? null : value;
  }
  function sanitize(node, name, type, value) {
    if (!value) {
      return value;
    }
    var safeTypesBridge = security.polymer_resin.safeTypesBridge_, nodeType = node.nodeType;
    if (nodeType !== Node.ELEMENT_NODE) {
      if (nodeType === Node.TEXT_NODE) {
        var parentElement = node.parentElement, allowText = !parentElement;
        if (parentElement && parentElement.nodeType === Node.ELEMENT_NODE) {
          var parentElementName = parentElement.localName;
          switch(security.polymer_resin.classifyElement(parentElementName, parentElement.constructor)) {
            case security.polymer_resin.CustomElementClassification.BUILTIN:
            case security.polymer_resin.CustomElementClassification.LEGACY:
              var contentType = security.html.contracts.contentTypeForElement(parentElementName);
              allowText = contentType === security.html.contracts.ElementContentType.SAFE_HTML || contentType === security.html.contracts.ElementContentType.STRING_RCDATA;
              break;
            case security.polymer_resin.CustomElementClassification.CUSTOMIZABLE:
            case security.polymer_resin.CustomElementClassification.CUSTOM:
              allowText = !0;
          }
        }
        if (allowText) {
          return "" + safeTypesBridge(value, security.polymer_resin.SafeType.STRING, value);
        }
      }
      security.polymer_resin.reportHandler_ && security.polymer_resin.reportHandler_(!0, "Failed to sanitize %s %s%s node to value %O", node.parentElement && node.parentElement.nodeName, "#text", "", value);
      return security.polymer_resin.INNOCUOUS_STRING_;
    }
    var elementName = node.localName;
    var elementName$jscomp$0 = node.localName;
    if (node.getAttribute("is") || security.polymer_resin.classifyElement(elementName$jscomp$0, node.constructor) !== security.polymer_resin.CustomElementClassification.CUSTOM) {
      var uncustomizedProxy = uncustomizedProxies[elementName$jscomp$0];
      uncustomizedProxy || (uncustomizedProxy = uncustomizedProxies[elementName$jscomp$0] = document.createElement(elementName$jscomp$0));
      var elementProxy = uncustomizedProxy;
    } else {
      elementProxy = VANILLA_HTML_ELEMENT_;
    }
    switch(type) {
      case "attribute":
        if (security.html.namealiases.attrToProperty(name) in elementProxy) {
          break;
        }
        return value;
      case "property":
        if (name in elementProxy) {
          break;
        }
        var worstCase = security.html.namealiases.specialPropertyNameWorstCase(name);
        if (worstCase && worstCase in elementProxy) {
          break;
        }
        return value;
      default:
        throw Error(type + ": " + typeof type);
    }
    var attrName = "attribute" == type ? name.toLowerCase() : security.html.namealiases.propertyToAttr(name), attrType = security.html.contracts.typeOfAttribute(elementName, attrName, goog.bind(getAttributeValue, node)), safeValue = DID_NOT_UNWRAP, safeReplacement = null;
    if (null != attrType) {
      var valueHandler = security.polymer_resin.VALUE_HANDLERS_[attrType], safeType = valueHandler.safeType;
      safeReplacement = valueHandler.safeReplacement;
      safeType && (safeValue = safeTypesBridge(value, safeType, DID_NOT_UNWRAP));
      if (safeValue === DID_NOT_UNWRAP && valueHandler.filter) {
        var stringValue = "" + safeTypesBridge(value, security.polymer_resin.SafeType.STRING, value);
        safeValue = valueHandler.filter(elementName, attrName, stringValue);
      }
    }
    safeValue === DID_NOT_UNWRAP && (safeValue = safeReplacement || security.polymer_resin.INNOCUOUS_STRING_, security.polymer_resin.reportHandler_ && security.polymer_resin.reportHandler_(!0, 'Failed to sanitize attribute of <%s>: <%s %s="%O">', elementName, elementName, attrName, value));
    return safeValue;
  }
  if (opt_config) {
    var configUnsafePassThruDisallowedValues = opt_config.UNSAFE_passThruDisallowedValues, configAllowedIdentifierPrefixes = opt_config.allowedIdentifierPrefixes, configReportHandler = opt_config.reportHandler, safeTypesBridge$jscomp$0 = opt_config.safeTypesBridge;
    null != configUnsafePassThruDisallowedValues && security.polymer_resin.UNSAFE_passThruDisallowedValues_(configUnsafePassThruDisallowedValues);
    if (configAllowedIdentifierPrefixes) {
      for (var i = 0, n = configAllowedIdentifierPrefixes.length; i < n; ++i) {
        security.polymer_resin.allowIdentifierWithPrefix_(configAllowedIdentifierPrefixes[i]);
      }
    }
    void 0 !== configReportHandler && security.polymer_resin.setReportHandler_(configReportHandler);
    void 0 !== safeTypesBridge$jscomp$0 && security.polymer_resin.setSafeTypesBridge_(safeTypesBridge$jscomp$0);
  }
  goog.DEBUG && void 0 === security.polymer_resin.reportHandler_ && "undefined" !== typeof console && security.polymer_resin.setReportHandler_(security.polymer_resin.CONSOLE_LOGGING_REPORT_HANDLER);
  security.polymer_resin.reportHandler_ && security.polymer_resin.reportHandler_(!1, "initResin");
  var uncustomizedProxies = {}, VANILLA_HTML_ELEMENT_ = document.createElement("polyresinuncustomized"), DID_NOT_UNWRAP = {};
  if (/^1\./.test(Polymer.version)) {
    security.polymer_resin.hintUsesDeprecatedRegisterElement();
    var origCompute = Polymer.Base._computeFinalAnnotationValue, computeFinalAnnotationSafeValue = function(node, property, value, info) {
      var finalValue = origCompute.call(this, node, property, value, info), type = "property";
      if (info && info.propertyName) {
        var name = info.propertyName;
      } else {
        name = property, type = info && info.kind || "property";
      }
      var safeValue = sanitize(node, name, type, finalValue);
      return security.polymer_resin.allowUnsafeValues_ ? finalValue : safeValue;
    };
    Polymer.Base._computeFinalAnnotationValue = computeFinalAnnotationSafeValue;
    if (Polymer.Base._computeFinalAnnotationValue !== computeFinalAnnotationSafeValue) {
      throw Error("Cannot replace _computeFinalAnnotationValue.  Is Polymer frozen?");
    }
  } else {
    var origSanitize = Polymer.sanitizeDOMValue || Polymer.Settings && Polymer.Settings.sanitizeDOMValue, sanitizeDOMValue = function(value, name, type, node) {
      var origSanitizedValue = origSanitize ? origSanitize.call(Polymer, value, name, type, node) : value, safeValue = node ? sanitize(node, name, type, origSanitizedValue) : security.polymer_resin.INNOCUOUS_STRING_;
      return security.polymer_resin.allowUnsafeValues_ ? origSanitizedValue : safeValue;
    };
    if (Polymer.Settings && Polymer.Settings.setSanitizeDOMValue) {
      Polymer.Settings.setSanitizeDOMValue(sanitizeDOMValue);
    } else {
      if (Polymer.sanitizeDOMValue = sanitizeDOMValue, Polymer.sanitizeDOMValue !== sanitizeDOMValue) {
        throw Error("Cannot install sanitizeDOMValue.  Is Polymer frozen?");
      }
    }
  }
};
security.polymer_resin.INNOCUOUS_STRING_ = "zClosurez";
security.polymer_resin.INNOCUOUS_SCRIPT_ = " /*zClosurez*/ ";
security.polymer_resin.INNOCUOUS_URL_ = "about:invalid#zClosurez";
security.polymer_resin.VALUE_HANDLERS_ = [];
security.polymer_resin.VALUE_HANDLERS_[security.html.contracts.AttrType.NONE] = {filter:function(e, a, v) {
  return v;
}, safeReplacement:null, safeType:null};
security.polymer_resin.VALUE_HANDLERS_[security.html.contracts.AttrType.SAFE_HTML] = {filter:null, safeReplacement:null, safeType:security.polymer_resin.SafeType.HTML};
security.polymer_resin.VALUE_HANDLERS_[security.html.contracts.AttrType.SAFE_URL] = {filter:null, safeReplacement:security.polymer_resin.INNOCUOUS_URL_, safeType:security.polymer_resin.SafeType.URL};
security.polymer_resin.VALUE_HANDLERS_[security.html.contracts.AttrType.TRUSTED_RESOURCE_URL] = {filter:null, safeReplacement:security.polymer_resin.INNOCUOUS_URL_, safeType:security.polymer_resin.SafeType.RESOURCE_URL};
security.polymer_resin.VALUE_HANDLERS_[security.html.contracts.AttrType.SAFE_STYLE] = {filter:null, safeReplacement:security.polymer_resin.INNOCUOUS_STRING_, safeType:security.polymer_resin.SafeType.STYLE};
security.polymer_resin.VALUE_HANDLERS_[security.html.contracts.AttrType.SAFE_SCRIPT] = {filter:null, safeReplacement:security.polymer_resin.INNOCUOUS_SCRIPT_, safeType:security.polymer_resin.SafeType.JAVASCRIPT};
security.polymer_resin.VALUE_HANDLERS_[security.html.contracts.AttrType.ENUM] = {filter:function(e, a, v) {
  var lv = String(v).toLowerCase();
  return security.html.contracts.isEnumValueAllowed(e, a, lv) ? lv : security.polymer_resin.INNOCUOUS_STRING_;
}, safeReplacement:security.polymer_resin.INNOCUOUS_STRING_, safeType:null};
security.polymer_resin.VALUE_HANDLERS_[security.html.contracts.AttrType.COMPILE_TIME_CONSTANT] = {filter:null, safeReplacement:security.polymer_resin.INNOCUOUS_STRING_, safeType:security.polymer_resin.SafeType.CONSTANT};
security.polymer_resin.VALUE_HANDLERS_[security.html.contracts.AttrType.IDENTIFIER] = {filter:function(e, a, v) {
  return security.polymer_resin.allowedIdentifierPattern_.test(v) ? v : security.polymer_resin.INNOCUOUS_STRING_;
}, safeReplacement:security.polymer_resin.INNOCUOUS_STRING_, safeType:security.polymer_resin.SafeType.CONSTANT};
security.polymer_resin.STANDALONE && (goog.exportSymbol("security.polymer_resin.install", security.polymer_resin.install), goog.exportSymbol("security.polymer_resin.CONSOLE_LOGGING_REPORT_HANDLER", security.polymer_resin.CONSOLE_LOGGING_REPORT_HANDLER));

