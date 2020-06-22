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
    // default setting
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

    //run function before add Element
    this.options.beforeAdd.call(this);

    var repeaterWrapper = findParentByclass(clickedButton, "repeater");
    var container = repeaterWrapper.querySelector(this.options.container);
    var template = getSpecificTemplate.call(this, repeaterWrapper); //get template

    // check if has options max and if total item greater or equal max value
    if (this.options.max && checkMaximum.call(this, container)) {
      return;
    }
    container.insertAdjacentHTML("beforeend", template); //adding to dom

    // check if has options min and if total item less or equal min value
    this.options.min && checkMinimum.call(this, container) ? disabledButtonDel.call(this, container) : enabledButtonDel.call(this, container);

    // add event listener to added delete button
    var lastItem = getLastItem(container);
    var buttonDel = lastItem.querySelector(".repeat-del");
    if (buttonDel) {
      buttonDel.addEventListener("click", function (e) {
        e.preventDefault();

        if (buttonDel.classList.contains("disabled")) {
          return;
        }
        var elementToDel = findParentByclass(buttonDel, "repeat-item");
        _this.deleteItem(elementToDel);
      });
    }

    // run function after add Element
    this.options.afterAdd.call(this, lastItem);
  };

  // Global function remove Item
  Repeater.prototype.deleteItem = function (elementToDel) {
    var repeaterWrapper = findParentByclass(elementToDel, "repeater");
    var container = repeaterWrapper.querySelector(this.options.container);

    // run function before delete element (return boolean)
    if (!this.options.beforeDelete.call(this, elementToDel)) return;

    // delete element from dom
    elementToDel.parentNode.removeChild(elementToDel);

    // check if has options min and if total item less or equal min value
    this.options.min && checkMinimum.call(this, container) ? disabledButtonDel.call(this, container) : enabledButtonDel.call(this, container);

    // run function after delete element
    this.options.afterDelete.call(this, elementToDel, container);
  };

  // Global function re Init, use to re initialize library
  // if use nested repeatable, add reInit function to function afterAdd parent repeatable
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

  // function checkMaximum
  // compare total item and options max
  function checkMaximum(container) {
    var totalItem = [].concat(_toConsumableArray(container.children));
    totalItem = totalItem.reduce(function (acc, value) {
      return value.classList.contains("repeat-item") ? acc + 1 : acc;
    }, 0);
    return totalItem >= this.options.max ? true : false;
  }

  // function checkMinimum
  // compare total item and options min
  function checkMinimum(container) {
    var totalItem = [].concat(_toConsumableArray(container.children));
    totalItem = totalItem.reduce(function (acc, value) {
      return value.classList.contains("repeat-item") ? acc + 1 : acc;
    }, 0);
    return totalItem <= this.options.min ? true : false;
  }

  // function disabledButtonDel
  // disabled button delete if total item == options min
  function disabledButtonDel(container) {
    var delButton = getAllBtnDel(container);

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = delButton[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var button = _step2.value;

        button.classList.add("disabled");
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

  // function disabledButtonDel
  // disabled button delete if total item > options min
  function enabledButtonDel(container) {
    var delButton = getAllBtnDel(container);
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = delButton[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var button = _step3.value;

        button.classList.remove("disabled");
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

  // function getAllBtnDel
  // get all button delete in container, exclude nested repeater
  function getAllBtnDel(container) {
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
    return delButton;
  }

  // function getSpecificTemplate
  // get a specific template from template repeatable
  function getSpecificTemplate(wrapper) {
    var template = wrapper.querySelector(this.options.template).innerHTML;
    template = template.replace(/{\++}/g, this.options.startingRepeat++);
    return template;
  }

  // function findParentByclass
  // find parent element with specific class
  function findParentByclass(el, classParentToFind) {
    if (el.parentNode.classList.contains(classParentToFind)) {
      return el.parentNode;
    } else {
      return findParentByclass(el.parentNode, classParentToFind);
    }
  }

  // function getLastItem
  // get last item or element with class repeat-item from spesific container
  function getLastItem(container) {
    var child = new Array();
    var allChild = container.childNodes;

    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = allChild[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var chd = _step5.value;

        if (chd.nodeType === 1 && chd.classList.contains("repeat-item")) {
          child.push(chd);
        }
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

    return child[child.length - 1];
  }

  // initial library
  function init() {
    var parent = this;

    if (parent.options.addButton && parent.options.container) {
      var button = $(parent.options.addButton);
      var container = $(parent.options.container);

      if (button.length > 0) {
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = button[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var btn = _step6.value;

            btn.addEventListener("click", function (e) {
              e.preventDefault();
              parent.addItem(this);
            });
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
      if (container.length > 0) {
        var _loop = function _loop(cont) {
          buttonDel = getAllBtnDel(cont);


          if (buttonDel.length > 0) {
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
              for (var _iterator8 = buttonDel[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                var _btn = _step8.value;

                _btn.addEventListener("click", function (e) {
                  e.preventDefault();

                  if (parent.options.min && checkMinimum.call(parent, cont)) {
                    disabledButtonDel.call(parent, cont);
                    return;
                  }

                  var elementToDel = findParentByclass(this, "repeat-item");
                  parent.deleteItem(elementToDel);
                });
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
        };

        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = container[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var cont = _step7.value;
            var buttonDel;

            _loop(cont);
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
