/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@medv/finder/finder.js":
/*!*********************************************!*\
  !*** ./node_modules/@medv/finder/finder.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "finder": () => (/* binding */ finder)
/* harmony export */ });
var Limit;
(function (Limit) {
    Limit[Limit["All"] = 0] = "All";
    Limit[Limit["Two"] = 1] = "Two";
    Limit[Limit["One"] = 2] = "One";
})(Limit || (Limit = {}));
let config;
let rootDocument;
function finder(input, options) {
    if (input.nodeType !== Node.ELEMENT_NODE) {
        throw new Error(`Can't generate CSS selector for non-element node type.`);
    }
    if ("html" === input.tagName.toLowerCase()) {
        return "html";
    }
    const defaults = {
        root: document.body,
        idName: (name) => true,
        className: (name) => true,
        tagName: (name) => true,
        attr: (name, value) => false,
        seedMinLength: 1,
        optimizedMinLength: 2,
        threshold: 1000,
        maxNumberOfTries: 10000,
    };
    config = Object.assign(Object.assign({}, defaults), options);
    rootDocument = findRootDocument(config.root, defaults);
    let path = bottomUpSearch(input, Limit.All, () => bottomUpSearch(input, Limit.Two, () => bottomUpSearch(input, Limit.One)));
    if (path) {
        const optimized = sort(optimize(path, input));
        if (optimized.length > 0) {
            path = optimized[0];
        }
        return selector(path);
    }
    else {
        throw new Error(`Selector was not found.`);
    }
}
function findRootDocument(rootNode, defaults) {
    if (rootNode.nodeType === Node.DOCUMENT_NODE) {
        return rootNode;
    }
    if (rootNode === defaults.root) {
        return rootNode.ownerDocument;
    }
    return rootNode;
}
function bottomUpSearch(input, limit, fallback) {
    let path = null;
    let stack = [];
    let current = input;
    let i = 0;
    while (current && current !== config.root.parentElement) {
        let level = maybe(id(current)) ||
            maybe(...attr(current)) ||
            maybe(...classNames(current)) ||
            maybe(tagName(current)) || [any()];
        const nth = index(current);
        if (limit === Limit.All) {
            if (nth) {
                level = level.concat(level.filter(dispensableNth).map((node) => nthChild(node, nth)));
            }
        }
        else if (limit === Limit.Two) {
            level = level.slice(0, 1);
            if (nth) {
                level = level.concat(level.filter(dispensableNth).map((node) => nthChild(node, nth)));
            }
        }
        else if (limit === Limit.One) {
            const [node] = (level = level.slice(0, 1));
            if (nth && dispensableNth(node)) {
                level = [nthChild(node, nth)];
            }
        }
        for (let node of level) {
            node.level = i;
        }
        stack.push(level);
        if (stack.length >= config.seedMinLength) {
            path = findUniquePath(stack, fallback);
            if (path) {
                break;
            }
        }
        current = current.parentElement;
        i++;
    }
    if (!path) {
        path = findUniquePath(stack, fallback);
    }
    return path;
}
function findUniquePath(stack, fallback) {
    const paths = sort(combinations(stack));
    if (paths.length > config.threshold) {
        return fallback ? fallback() : null;
    }
    for (let candidate of paths) {
        if (unique(candidate)) {
            return candidate;
        }
    }
    return null;
}
function selector(path) {
    let node = path[0];
    let query = node.name;
    for (let i = 1; i < path.length; i++) {
        const level = path[i].level || 0;
        if (node.level === level - 1) {
            query = `${path[i].name} > ${query}`;
        }
        else {
            query = `${path[i].name} ${query}`;
        }
        node = path[i];
    }
    return query;
}
function penalty(path) {
    return path.map((node) => node.penalty).reduce((acc, i) => acc + i, 0);
}
function unique(path) {
    switch (rootDocument.querySelectorAll(selector(path)).length) {
        case 0:
            throw new Error(`Can't select any node with this selector: ${selector(path)}`);
        case 1:
            return true;
        default:
            return false;
    }
}
function id(input) {
    const elementId = input.getAttribute("id");
    if (elementId && config.idName(elementId)) {
        return {
            name: "#" + cssesc(elementId, { isIdentifier: true }),
            penalty: 0,
        };
    }
    return null;
}
function attr(input) {
    const attrs = Array.from(input.attributes).filter((attr) => config.attr(attr.name, attr.value));
    return attrs.map((attr) => ({
        name: "[" +
            cssesc(attr.name, { isIdentifier: true }) +
            '="' +
            cssesc(attr.value) +
            '"]',
        penalty: 0.5,
    }));
}
function classNames(input) {
    const names = Array.from(input.classList).filter(config.className);
    return names.map((name) => ({
        name: "." + cssesc(name, { isIdentifier: true }),
        penalty: 1,
    }));
}
function tagName(input) {
    const name = input.tagName.toLowerCase();
    if (config.tagName(name)) {
        return {
            name,
            penalty: 2,
        };
    }
    return null;
}
function any() {
    return {
        name: "*",
        penalty: 3,
    };
}
function index(input) {
    const parent = input.parentNode;
    if (!parent) {
        return null;
    }
    let child = parent.firstChild;
    if (!child) {
        return null;
    }
    let i = 0;
    while (child) {
        if (child.nodeType === Node.ELEMENT_NODE) {
            i++;
        }
        if (child === input) {
            break;
        }
        child = child.nextSibling;
    }
    return i;
}
function nthChild(node, i) {
    return {
        name: node.name + `:nth-child(${i})`,
        penalty: node.penalty + 1,
    };
}
function dispensableNth(node) {
    return node.name !== "html" && !node.name.startsWith("#");
}
function maybe(...level) {
    const list = level.filter(notEmpty);
    if (list.length > 0) {
        return list;
    }
    return null;
}
function notEmpty(value) {
    return value !== null && value !== undefined;
}
function* combinations(stack, path = []) {
    if (stack.length > 0) {
        for (let node of stack[0]) {
            yield* combinations(stack.slice(1, stack.length), path.concat(node));
        }
    }
    else {
        yield path;
    }
}
function sort(paths) {
    return Array.from(paths).sort((a, b) => penalty(a) - penalty(b));
}
function* optimize(path, input, scope = {
    counter: 0,
    visited: new Map(),
}) {
    if (path.length > 2 && path.length > config.optimizedMinLength) {
        for (let i = 1; i < path.length - 1; i++) {
            if (scope.counter > config.maxNumberOfTries) {
                return; // Okay At least I tried!
            }
            scope.counter += 1;
            const newPath = [...path];
            newPath.splice(i, 1);
            const newPathKey = selector(newPath);
            if (scope.visited.has(newPathKey)) {
                return;
            }
            if (unique(newPath) && same(newPath, input)) {
                yield newPath;
                scope.visited.set(newPathKey, true);
                yield* optimize(newPath, input, scope);
            }
        }
    }
}
function same(path, input) {
    return rootDocument.querySelector(selector(path)) === input;
}
const regexAnySingleEscape = /[ -,\.\/:-@\[-\^`\{-~]/;
const regexSingleEscape = /[ -,\.\/:-@\[\]\^`\{-~]/;
const regexExcessiveSpaces = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g;
const defaultOptions = {
    escapeEverything: false,
    isIdentifier: false,
    quotes: "single",
    wrap: false,
};
function cssesc(string, opt = {}) {
    const options = Object.assign(Object.assign({}, defaultOptions), opt);
    if (options.quotes != "single" && options.quotes != "double") {
        options.quotes = "single";
    }
    const quote = options.quotes == "double" ? '"' : "'";
    const isIdentifier = options.isIdentifier;
    const firstChar = string.charAt(0);
    let output = "";
    let counter = 0;
    const length = string.length;
    while (counter < length) {
        const character = string.charAt(counter++);
        let codePoint = character.charCodeAt(0);
        let value = void 0;
        // If it’s not a printable ASCII character…
        if (codePoint < 0x20 || codePoint > 0x7e) {
            if (codePoint >= 0xd800 && codePoint <= 0xdbff && counter < length) {
                // It’s a high surrogate, and there is a next character.
                const extra = string.charCodeAt(counter++);
                if ((extra & 0xfc00) == 0xdc00) {
                    // next character is low surrogate
                    codePoint = ((codePoint & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
                }
                else {
                    // It’s an unmatched surrogate; only append this code unit, in case
                    // the next code unit is the high surrogate of a surrogate pair.
                    counter--;
                }
            }
            value = "\\" + codePoint.toString(16).toUpperCase() + " ";
        }
        else {
            if (options.escapeEverything) {
                if (regexAnySingleEscape.test(character)) {
                    value = "\\" + character;
                }
                else {
                    value = "\\" + codePoint.toString(16).toUpperCase() + " ";
                }
            }
            else if (/[\t\n\f\r\x0B]/.test(character)) {
                value = "\\" + codePoint.toString(16).toUpperCase() + " ";
            }
            else if (character == "\\" ||
                (!isIdentifier &&
                    ((character == '"' && quote == character) ||
                        (character == "'" && quote == character))) ||
                (isIdentifier && regexSingleEscape.test(character))) {
                value = "\\" + character;
            }
            else {
                value = character;
            }
        }
        output += value;
    }
    if (isIdentifier) {
        if (/^-[-\d]/.test(output)) {
            output = "\\-" + output.slice(1);
        }
        else if (/\d/.test(firstChar)) {
            output = "\\3" + firstChar + " " + output.slice(1);
        }
    }
    // Remove spaces after `\HEX` escapes that are not followed by a hex digit,
    // since they’re redundant. Note that this is only possible if the escape
    // sequence isn’t preceded by an odd number of backslashes.
    output = output.replace(regexExcessiveSpaces, function ($0, $1, $2) {
        if ($1 && $1.length % 2) {
            // It’s not safe to remove the space, so don’t.
            return $0;
        }
        // Strip the space.
        return ($1 || "") + $2;
    });
    if (!isIdentifier && options.wrap) {
        return quote + output + quote;
    }
    return output;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./src/content.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _medv_finder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @medv/finder */ "./node_modules/@medv/finder/finder.js");


document.addEventListener("click", (event) => {
  let dialog = document.getElementById("doc-detective");
  if (dialog) {
    const selector = (0,_medv_finder__WEBPACK_IMPORTED_MODULE_0__.finder)(event.target);
    // Loop to identify if selector is part of main page
    let inDialog = false;
    let elements = [];
    elements[0] = document.querySelector(selector);
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      let parent = element.parentElement;
      let parentName = parent.nodeName.toLowerCase();
      if (parentName !== "body") {
        elements.push(parent);
        continue;
      }
      if (
        parentName === "body" &&
        element.nodeName.toLowerCase() === "div" &&
        element.id === "doc-detective"
      ) {
        inDialog = true;
      }
    }
    // Exit early if click is in the dialog
    if (inDialog) return;
    let selectorDisplay = document.getElementById("selectorDisplay");
    event.stopPropagation();
    event.preventDefault();
    selectorDisplay.innerHTML = selector;
  }
});

function copySelector() {
  // Get the text field
  var copyText = document.getElementById("selectorDisplay");

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);

  // Alert the copied text
  alert("Copied the text: " + copyText.value);
}

})();

/******/ })()
;
//# sourceMappingURL=content.js.map