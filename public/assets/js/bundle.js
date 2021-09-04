(function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={i:d,l:!1,exports:{}};return a[d].call(e.exports,e,e.exports,b),e.l=!0,e.exports}var c={};return b.m=a,b.c=c,b.d=function(a,c,d){b.o(a,c)||Object.defineProperty(a,c,{enumerable:!0,get:d})},b.r=function(a){'undefined'!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(a,Symbol.toStringTag,{value:'Module'}),Object.defineProperty(a,'__esModule',{value:!0})},b.t=function(a,c){if(1&c&&(a=b(a)),8&c)return a;if(4&c&&'object'==typeof a&&a&&a.__esModule)return a;var d=Object.create(null);if(b.r(d),Object.defineProperty(d,'default',{enumerable:!0,value:a}),2&c&&'string'!=typeof a)for(var e in a)b.d(d,e,function(b){return a[b]}.bind(null,e));return d},b.n=function(a){var c=a&&a.__esModule?function(){return a['default']}:function(){return a};return b.d(c,'a',c),c},b.o=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)},b.p='',b(b.s='./src/resources/index.js')})({"./node_modules/debounce/index.js":/*!****************************************!*\
  !*** ./node_modules/debounce/index.js ***!
  \****************************************//*! no static exports found */function(module,exports){eval('/**\n * Returns a function, that, as long as it continues to be invoked, will not\n * be triggered. The function will be called after it stops being called for\n * N milliseconds. If `immediate` is passed, trigger the function on the\n * leading edge, instead of the trailing. The function also has a property \'clear\' \n * that is a function which will clear the timer to prevent previously scheduled executions. \n *\n * @source underscore.js\n * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/\n * @param {Function} function to wrap\n * @param {Number} timeout in ms (`100`)\n * @param {Boolean} whether to execute at the beginning (`false`)\n * @api public\n */\nfunction debounce(func, wait, immediate){\n  var timeout, args, context, timestamp, result;\n  if (null == wait) wait = 100;\n\n  function later() {\n    var last = Date.now() - timestamp;\n\n    if (last < wait && last >= 0) {\n      timeout = setTimeout(later, wait - last);\n    } else {\n      timeout = null;\n      if (!immediate) {\n        result = func.apply(context, args);\n        context = args = null;\n      }\n    }\n  };\n\n  var debounced = function(){\n    context = this;\n    args = arguments;\n    timestamp = Date.now();\n    var callNow = immediate && !timeout;\n    if (!timeout) timeout = setTimeout(later, wait);\n    if (callNow) {\n      result = func.apply(context, args);\n      context = args = null;\n    }\n\n    return result;\n  };\n\n  debounced.clear = function() {\n    if (timeout) {\n      clearTimeout(timeout);\n      timeout = null;\n    }\n  };\n  \n  debounced.flush = function() {\n    if (timeout) {\n      result = func.apply(context, args);\n      context = args = null;\n      \n      clearTimeout(timeout);\n      timeout = null;\n    }\n  };\n\n  return debounced;\n};\n\n// Adds compatibility for ES modules\ndebounce.debounce = debounce;\n\nmodule.exports = debounce;\n\n\n//# sourceURL=webpack:///./node_modules/debounce/index.js?')},"./src/resources/css/styles.css":/*!**************************************!*\
  !*** ./src/resources/css/styles.css ***!
  \**************************************//*! no static exports found */function(module,exports,__webpack_require__){eval('// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/resources/css/styles.css?')},"./src/resources/index.js":/*!********************************!*\
  !*** ./src/resources/index.js ***!
  \********************************//*! no static exports found */function(module,exports,__webpack_require__){eval('__webpack_require__(/*! ./css/styles.css */ "./src/resources/css/styles.css");\n\n__webpack_require__(/*! ./js/events */ "./src/resources/js/events.js");\n\n//# sourceURL=webpack:///./src/resources/index.js?')},"./src/resources/js/events.js":/*!************************************!*\
  !*** ./src/resources/js/events.js ***!
  \************************************//*! no static exports found */function(module,exports,__webpack_require__){eval('const { searchInput, form, searchValue } = __webpack_require__(/*! ./globals */ "./src/resources/js/globals.js");\nconst { SearchPhotos, ClearPhotos, GetNewPhotos } = __webpack_require__(/*! ./functions */ "./src/resources/js/functions.js");\nconst debounce = __webpack_require__(/*! debounce */ "./node_modules/debounce/index.js");\n\nsearchInput.addEventListener("change", (event) => {\n  searchValue.pop();\n  searchValue.push(event.target.value);\n});\nform.addEventListener("submit", (event) => {\n  event.preventDefault();\n  ClearPhotos();\n  SearchPhotos(searchValue.join(""));\n});\n\n//# sourceURL=webpack:///./src/resources/js/events.js?')},"./src/resources/js/functions.js":/*!***************************************!*\
  !*** ./src/resources/js/functions.js ***!
  \***************************************//*! no static exports found */function(module,exports,__webpack_require__){eval('const { auth, columns, article } = __webpack_require__(/*! ./globals */ "./src/resources/js/globals.js");\n\nasync function FetchApi(url) {\n  const dataFetch = await fetch(`https://api.pexels.com/v1/${url}`, {\n    method: "GET",\n    headers: {\n      Accept: "application/json",\n      Authorization: auth,\n    },\n  });\n  return dataFetch.json();\n}\nfunction RenderPhotos(data) {\n  let index = 0;\n  data.photos.forEach((photo) => {\n    const figure = document.createElement("figure");\n    figure.innerHTML = `\n    <img src="${photo.src.large}">\n    <figcaption><a target="_blank" rel="noreferrer noopener" href="${photo.photographer_url}">${photo.photographer}</a></figcaption>\n  `;\n    columns[index].appendChild(figure);\n    if (index === columns.length - 1) return (index = 0);\n    index++;\n  });\n}\nfunction CuratedPhotos(page = 1) {\n  FetchApi(`curated?per_page=80&page=${page}`)\n    .then((data) => RenderPhotos(data))\n    .catch((error) => console.error(error));\n}\n\nfunction SearchPhotos(query) {\n  FetchApi(`search?query=${query}+query&per_page=80&page=1`)\n    .then((data) => RenderPhotos(data))\n    .catch((error) => console.error(error));\n}\n\nfunction ClearPhotos() {\n  columns.forEach((column) => {\n    column.innerHTML = "";\n  });\n}\nlet currentPage = 1;\nfunction GetNewPhotos() {\n  const articleHeight = Math.floor(article.getBoundingClientRect().height);\n  const trigger = articleHeight - window.pageYOffset;\n  \n  if (window.pageYOffset > trigger) {\n    currentPage++;\n    CuratedPhotos(currentPage);\n  }\n}\n/* Startup */\nCuratedPhotos();\n\nmodule.exports = { SearchPhotos, ClearPhotos, GetNewPhotos };\n\n\n//# sourceURL=webpack:///./src/resources/js/functions.js?')},"./src/resources/js/globals.js":/*!*************************************!*\
  !*** ./src/resources/js/globals.js ***!
  \*************************************//*! no static exports found */function(module,exports){eval('const globals = {\n  auth: "563492ad6f91700001000001ad8ed003f71f45448e4ca49917867178",\n  columns: document.querySelectorAll("article section"),\n  article: document.querySelector("article"),\n  form: document.querySelector("form"),\n  searchInput: document.querySelector("input"),\n  submitButton: document.querySelector("button"),\n  searchValue: [],\n}\nmodule.exports = globals;\n\n\n//# sourceURL=webpack:///./src/resources/js/globals.js?')}});