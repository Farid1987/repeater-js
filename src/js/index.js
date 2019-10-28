(function() {
  "use strict";

  // function to get element in DOM
  var $ = function(selector) {
    return document.querySelectorAll(selector);
  };

  // constructor
  window.Repeater = function() {
    var defaults = {
      container: "",
      template: "",
      addButton: "",
      startingRepeat: 0,
      min: 0,
      max: null,
      beforeAdd: function() {},
      afterAdd: function(item) {},
      beforeDelete: function(item) {
        return true;
      },
      afterDelete: function() {}
    };

    if (arguments[0] && typeof arguments[0] === "object") {
      this.options = Object.assign(defaults, arguments[0]);
    }

    init.call(this);
  };

  // add Item
  Repeater.prototype.addItem = function(clickedButton) {
    this.options.beforeAdd.call(this);

    var template = getSpecificTemplate.call(this); //get template
    var repeaterWrapper = findParentByclass(clickedButton, "repeater");
    var container = repeaterWrapper.querySelector(this.options.container);

    if (this.options.max && checkMaximum.call(this, container)) {
      return;
    }
    container.insertAdjacentHTML("beforeend", template); //adding to dom

    console.log(checkMinimum.call(this, container));

    checkMinimum.call(this, container)
      ? disabledButtonDel.call(this, container)
      : enabledButtonDel.call(this, container);

    var lastItem = getLastItem(container);
    var buttonDel = lastItem.querySelector(".repeat-del");
    if (buttonDel) {
      buttonDel.addEventListener("click", () => {
        if (buttonDel.classList.contains("disabled")) {
          return;
        }
        this.deleteItem(buttonDel);
      });
    }

    this.options.afterAdd.call(this, lastItem);
  };

  // remove Item
  Repeater.prototype.deleteItem = function(target) {
    var el = findParentByclass(target, "repeat-item");
    var repeaterWrapper = findParentByclass(target, "repeater");

    if (!this.options.beforeDelete.call(this, el)) return;

    el.parentNode.removeChild(el);

    var container = repeaterWrapper.querySelector(this.options.container);
    checkMinimum.call(this, container)
      ? disabledButtonDel.call(this, container)
      : enabledButtonDel.call(this, container);

    this.options.afterDelete.call(this);
  };

  Repeater.prototype.reInit = function() {
    if (this.options.addButton) {
      var button = $(this.options.addButton);

      if (button.length > 0) {
        for (let btn of button) {
          var newButton = btn.cloneNode(true);
          btn.parentNode.replaceChild(newButton, btn);
        }
      }

      init.call(this);
    }
  };

  function checkMaximum(container) {
    var totalItem = [...container.children];
    totalItem = totalItem.reduce((acc, value) => {
      return value.classList.contains("repeat-item") ? acc + 1 : acc;
    }, 0);
    return totalItem >= this.options.max ? true : false;
  }

  function checkMinimum(container) {
    var totalItem = [...container.children];
    totalItem = totalItem.reduce((acc, value) => {
      return value.classList.contains("repeat-item") ? acc + 1 : acc;
    }, 0);
    return totalItem <= this.options.min ? true : false;
  }

  function disabledButtonDel(container) {
    var delButton = [...container.querySelectorAll(".repeat-del")];
    var nestedRepeater = container.querySelectorAll(".repeater");
    if (nestedRepeater.length > 0) {
      for (let repeater of nestedRepeater) {
        var delButtonNested = [...repeater.querySelectorAll(".repeat-del")];
        if (delButtonNested.length > 0) {
          delButton = delButton.filter(function(value, index) {
            return !delButtonNested.includes(value);
          });
        }
      }
    }
    for (let button of delButton) {
      button.classList.add("disabled");
    }
  }

  function enabledButtonDel(container) {
    var delButton = [...container.querySelectorAll(".repeat-del")];
    var nestedRepeater = container.querySelectorAll(".repeater");
    if (nestedRepeater.length > 0) {
      for (let repeater of nestedRepeater) {
        var delButtonNested = [...repeater.querySelectorAll(".repeat-del")];
        if (delButtonNested.length > 0) {
          delButton = delButton.filter(function(value, index) {
            return !delButtonNested.includes(value);
          });
        }
      }
    }
    for (let button of delButton) {
      button.classList.remove("disabled");
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

    for (let chd of allChild) {
      if (chd.nodeType === 1 && chd.classList.contains("repeat-item")) {
        child.push(chd);
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
        for (let btn of button) {
          btn.addEventListener("click", function(e) {
            e.preventDefault();
            parent.addItem(this);
          });
        }
      }
    }
  }
})();
