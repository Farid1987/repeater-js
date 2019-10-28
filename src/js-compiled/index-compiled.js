(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {
  "use strict";

  // function to get element in DOM

  var $ = function $(selector) {
    return document.querySelectorAll(selector);
  };

  // constructor
  window.Repeater = function () {
    var defaults = {
      container: "",
      template: "",
      addButton: "",
      startingRepeat: 0,
      min: 0,
      max: null,
      beforeAdd: function beforeAdd() {},
      afterAdd: function afterAdd(item) {},
      beforeDelete: function beforeDelete(item) {
        return true;
      },
      afterDelete: function afterDelete() {}
    };

    if (arguments[0] && _typeof(arguments[0]) === "object") {
      this.options = Object.assign(defaults, arguments[0]);
    }

    init.call(this);
  };

  // add Item
  Repeater.prototype.addItem = function (clickedButton) {
    var _this = this;

    this.options.beforeAdd.call(this);

    var template = getSpecificTemplate.call(this); //get template
    var repeaterWrapper = findParentByclass(clickedButton, "repeater");
    var container = repeaterWrapper.querySelector(this.options.container);

    if (this.options.max && checkMaximum.call(this, container)) {
      return;
    }
    container.insertAdjacentHTML("beforeend", template); //adding to dom

    console.log(checkMinimum.call(this, container));

    checkMinimum.call(this, container) ? disabledButtonDel.call(this, container) : enabledButtonDel.call(this, container);

    var lastItem = getLastItem(container);
    var buttonDel = lastItem.querySelector(".repeat-del");
    if (buttonDel) {
      buttonDel.addEventListener("click", function () {
        if (buttonDel.classList.contains("disabled")) {
          return;
        }
        _this.deleteItem(buttonDel);
      });
    }

    this.options.afterAdd.call(this, lastItem);
  };

  // remove Item
  Repeater.prototype.deleteItem = function (target) {
    var el = findParentByclass(target, "repeat-item");
    var repeaterWrapper = findParentByclass(target, "repeater");

    if (!this.options.beforeDelete.call(this, el)) return;

    el.parentNode.removeChild(el);

    var container = repeaterWrapper.querySelector(this.options.container);
    checkMinimum.call(this, container) ? disabledButtonDel.call(this, container) : enabledButtonDel.call(this, container);

    this.options.afterDelete.call(this);
  };

  Repeater.prototype.reInit = function () {
    if (this.options.addButton) {
      var button = $(this.options.addButton);

      if (button.length > 0) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = button[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var btn = _step.value;

            var newButton = btn.cloneNode(true);
            btn.parentNode.replaceChild(newButton, btn);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      init.call(this);
    }
  };

  function checkMaximum(container) {
    var totalItem = [].concat(_toConsumableArray(container.children));
    totalItem = totalItem.reduce(function (acc, value) {
      return value.classList.contains("repeat-item") ? acc + 1 : acc;
    }, 0);
    return totalItem >= this.options.max ? true : false;
  }

  function checkMinimum(container) {
    var totalItem = [].concat(_toConsumableArray(container.children));
    totalItem = totalItem.reduce(function (acc, value) {
      return value.classList.contains("repeat-item") ? acc + 1 : acc;
    }, 0);
    return totalItem <= this.options.min ? true : false;
  }

  function disabledButtonDel(container) {
    var delButton = [].concat(_toConsumableArray(container.querySelectorAll(".repeat-del")));
    var nestedRepeater = container.querySelectorAll(".repeater");
    if (nestedRepeater.length > 0) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = nestedRepeater[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var repeater = _step2.value;

          var delButtonNested = [].concat(_toConsumableArray(repeater.querySelectorAll(".repeat-del")));
          if (delButtonNested.length > 0) {
            delButton = delButton.filter(function (value, index) {
              return !delButtonNested.includes(value);
            });
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = delButton[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var button = _step3.value;

        button.classList.add("disabled");
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  }

  function enabledButtonDel(container) {
    var delButton = [].concat(_toConsumableArray(container.querySelectorAll(".repeat-del")));
    var nestedRepeater = container.querySelectorAll(".repeater");
    if (nestedRepeater.length > 0) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = nestedRepeater[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var repeater = _step4.value;

          var delButtonNested = [].concat(_toConsumableArray(repeater.querySelectorAll(".repeat-del")));
          if (delButtonNested.length > 0) {
            delButton = delButton.filter(function (value, index) {
              return !delButtonNested.includes(value);
            });
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = delButton[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var button = _step5.value;

        button.classList.remove("disabled");
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }
  }

  function getSpecificTemplate() {
    var template = $(this.options.template)[0].innerHTML;
    template = template.replace(/{\++}/g, this.options.startingRepeat++);
    return template;
  }

  // function to find parent element with class, like parents() in jquery
  function findParentByclass(el, classParentToFind) {
    if (el.parentNode.classList.contains(classParentToFind)) {
      return el.parentNode;
    } else {
      return findParentByclass(el.parentNode, classParentToFind);
    }
  }

  function getLastItem(container) {
    var child = new Array();
    var allChild = container.childNodes;

    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = allChild[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var chd = _step6.value;

        if (chd.nodeType === 1 && chd.classList.contains("repeat-item")) {
          child.push(chd);
        }
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return) {
          _iterator6.return();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }

    return child[child.length - 1];
  }

  // initial library
  function init() {
    var parent = this;

    if (parent.options.addButton && parent.options.container) {
      var button = $(parent.options.addButton);

      if (button.length > 0) {
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = button[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var btn = _step7.value;

            btn.addEventListener("click", function (e) {
              e.preventDefault();
              parent.addItem(this);
            });
          }
        } catch (err) {
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7.return) {
              _iterator7.return();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }
      }
    }
  }
})();

},{}]},{},[1]);
