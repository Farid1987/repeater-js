(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @Author Farid M R
 * https://github.com/Farid1987
 */

(function () {
  "use strict";

  // function to get element in DOM

  var $ = function $(selector) {
    return document.querySelectorAll(selector);
  };

  // constructor
  window.Repeater = function () {
    // default setting
    var defaults = {
      container: "",
      template: "",
      addButton: "",
      startingRepeat: 0,
      numTemplate: '{\\+\\+}',
      min: 0,
      max: null,
      beforeAdd: function beforeAdd(clickedButton) {},
      afterAdd: function afterAdd(item) {},
      beforeDelete: function beforeDelete(item) {
        return true;
      },
      afterDelete: function afterDelete(item, container) {}
    };

    if (arguments[0] && _typeof(arguments[0]) === "object") {
      this.options = Object.assign(defaults, arguments[0]);
    }

    // initiating library
    init.call(this);
  };

  // Global function add Item
  Repeater.prototype.addItem = function (clickedButton) {
    var _this = this;

    if (!clickedButton) {
      console.error("Error. Pass the dom element of Add Button to function AddItem!");
      return;
    }

    var repeaterWrapper = findParentByClass(clickedButton, "repeater");
    var container = repeaterWrapper ? repeaterWrapper.querySelector(this.options.container) : null;

    if (this.options.max && checkMaximum.call(this, container)) {
      // console.log(checkMaximum.call(this, container));
      return;
    }

    try {
      this.options.beforeAdd.call(this, clickedButton);

      var template = getSpecificTemplate.call(this, repeaterWrapper);

      container.insertAdjacentHTML("beforeend", template);
      this.options.min && checkMinimum.call(this, container) ? disabledButtonDel.call(this, container) : enabledButtonDel.call(this, container);

      var lastItem = getLastItem(container);
      var buttonDel = lastItem.querySelector(".repeat-del");

      if (buttonDel) {
        buttonDel.addEventListener("click", function (e) {
          e.preventDefault();

          if (buttonDel.classList.contains("disabled")) return;

          var elementToDel = findParentByClass(buttonDel, "repeat-item");
          _this.deleteItem(elementToDel);
        });
      }

      // run function after add Element
      this.options.afterAdd.call(this, lastItem);
    } catch (error) {
      console.error('Error Add Element', error);
    }
  };

  // Global function remove Item
  Repeater.prototype.deleteItem = function (elementToDel) {
    if (!elementToDel) {
      console.error("Error. Pass the dom element to function deleteItem!");
      return;
    }

    var repeaterWrapper = findParentByClass(elementToDel, "repeater");
    var container = repeaterWrapper ? repeaterWrapper.querySelector(this.options.container) : null;

    if (this.options.min && checkMinimum.call(this, container)) {
      disabledButtonDel.call(this, container);
      return;
    }

    if (!this.options.beforeDelete.call(this, elementToDel)) return;

    elementToDel.parentNode.removeChild(elementToDel);

    this.options.min && checkMinimum.call(this, container) ? disabledButtonDel.call(this, container) : enabledButtonDel.call(this, container);

    this.options.afterDelete.call(this, elementToDel, container);
  };

  // Global function re Init, use to re initialize library
  Repeater.prototype.reInit = function () {
    if (!this.options.addButton) return;
    var allContainer = $(this.options.container);
    var allAddButton = $(this.options.addButton);

    if (allAddButton.length > 0) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = allAddButton[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var button = _step.value;

          var newButton = button.cloneNode(true);
          button.parentNode.replaceChild(newButton, button);
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
    if (allContainer.length > 0) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = allContainer[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var container = _step2.value;

          var allDelButton = getAllBtnDel(container);
          if (allDelButton.length > 0) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = allDelButton[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var _button = _step3.value;

                var _newButton = _button.cloneNode(true);
                _button.parentNode.replaceChild(_newButton, _button);
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

    init.call(this);
  };

  // Global function addListener
  // if use nested repeatable, add addListener function to function afterAdd parent repeatable
  Repeater.prototype.addEventListener = function (wrapper) {
    var allAddButton = wrapper.querySelectorAll(this.options.addButton);
    var allContainer = wrapper.querySelectorAll(this.options.container);
    addEventListenerButtonAdd(allAddButton, this);
    addEventListenerButtonDel(allContainer, this);
  };

  // function checkMaximum
  // compare total item and options max
  function checkMaximum(container) {
    if (!container) return false;

    var allChild = [].concat(_toConsumableArray(container.children));
    var totalItem = allChild.reduce(function (total, element) {
      return element.classList.contains("repeat-item") ? total + 1 : total;
    }, 0);
    return totalItem >= this.options.max ? true : false;
  }

  // function checkMinimum
  // compare total item and options min
  function checkMinimum(container) {
    if (!container) return false;

    var allChild = [].concat(_toConsumableArray(container.children));
    var totalItem = allChild.reduce(function (total, element) {
      return element.classList.contains("repeat-item") ? total + 1 : total;
    }, 0);
    return totalItem <= this.options.min ? true : false;
  }

  // function disabledButtonDel
  // disabled button delete if total item == options min
  function disabledButtonDel(container) {
    var delButton = getAllBtnDel(container);
    if (!delButton) return;

    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = delButton[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var button = _step4.value;

        button.classList.add("disabled");
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

  // function disabledButtonDel
  // disabled button delete if total item > options min
  function enabledButtonDel(container) {
    var delButton = getAllBtnDel(container);
    if (!delButton) return;

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

  // function getAllBtnDel
  // get all button delete in container, exclude nested repeater
  function getAllBtnDel(container) {
    if (!container) return;

    var delButton = [].concat(_toConsumableArray(container.querySelectorAll(".repeat-del")));
    var nestedRepeater = container.querySelectorAll(".repeater");
    if (nestedRepeater.length > 0) {
      var _loop = function _loop(repeater) {
        var delButtonNested = [].concat(_toConsumableArray(repeater.querySelectorAll(".repeat-del")));
        if (delButtonNested.length <= 0) return "continue";

        delButton = delButton.filter(function (value, index) {
          return !delButtonNested.includes(value);
        });
      };

      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = nestedRepeater[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var repeater = _step6.value;

          var _ret = _loop(repeater);

          if (_ret === "continue") continue;
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
    }
    return delButton;
  }

  // function getSpecificTemplate
  // get a specific template from template repeatable
  function getSpecificTemplate(wrapper) {
    if (!wrapper) return null;

    var template = wrapper.querySelector(this.options.template).innerHTML;
    var regex = new RegExp(this.options.numTemplate, "g");
    template = template.replace(regex, this.options.startingRepeat++);
    return template;
  }

  // function findParentByClass
  // find parent element with specific class
  function findParentByClass(el, classParentToFind) {
    if (el.parentNode.tagName == "HTML" || !el.parentNode) return;
    if (el.parentNode.classList.contains(classParentToFind)) return el.parentNode;
    return findParentByClass(el.parentNode, classParentToFind);
  }

  // function getLastItem
  // get last item or element with class repeat-item from spesific container
  function getLastItem(container) {
    if (!container) return;

    var childRepeater = new Array();
    var allChild = container.childNodes;

    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      for (var _iterator7 = allChild[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        var child = _step7.value;

        if (child.nodeType === 1 && child.classList.contains("repeat-item")) {
          childRepeater.push(child);
        }
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

    return childRepeater[childRepeater.length - 1];
  }

  function addEventListenerButtonAdd(allAddButton, repeater) {
    if (allAddButton.length <= 0) return;

    var _loop2 = function _loop2(button) {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        repeater.addItem(button);
      });
    };

    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
      for (var _iterator8 = allAddButton[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
        var button = _step8.value;

        _loop2(button);
      }
    } catch (err) {
      _didIteratorError8 = true;
      _iteratorError8 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion8 && _iterator8.return) {
          _iterator8.return();
        }
      } finally {
        if (_didIteratorError8) {
          throw _iteratorError8;
        }
      }
    }
  }

  function addEventListenerButtonDel(allContainer, repeater) {
    if (allContainer.length <= 0) return;
    var _iteratorNormalCompletion9 = true;
    var _didIteratorError9 = false;
    var _iteratorError9 = undefined;

    try {
      for (var _iterator9 = allContainer[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
        var container = _step9.value;

        var buttonDel = getAllBtnDel(container);

        if (buttonDel.length <= 0) continue;

        var _loop3 = function _loop3(btn) {
          btn.addEventListener("click", function (e) {
            e.preventDefault();

            var elementToDel = findParentByClass(btn, "repeat-item");
            if (elementToDel) repeater.deleteItem(elementToDel);
          });
        };

        var _iteratorNormalCompletion10 = true;
        var _didIteratorError10 = false;
        var _iteratorError10 = undefined;

        try {
          for (var _iterator10 = buttonDel[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
            var btn = _step10.value;

            _loop3(btn);
          }
        } catch (err) {
          _didIteratorError10 = true;
          _iteratorError10 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion10 && _iterator10.return) {
              _iterator10.return();
            }
          } finally {
            if (_didIteratorError10) {
              throw _iteratorError10;
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError9 = true;
      _iteratorError9 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion9 && _iterator9.return) {
          _iterator9.return();
        }
      } finally {
        if (_didIteratorError9) {
          throw _iteratorError9;
        }
      }
    }
  }

  // initial library
  function init() {
    var repeater = this;

    if (!repeater.options.addButton || !repeater.options.container) return;

    var allAddButton = $(repeater.options.addButton);
    var allContainer = $(repeater.options.container);

    addEventListenerButtonAdd(allAddButton, repeater);
    addEventListenerButtonDel(allContainer, repeater);
  }
})();

},{}]},{},[1]);
