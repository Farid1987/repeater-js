(function() {
  "use strict";

  // function to get element in DOM
  const $ = function(selector) {
    return document.querySelectorAll(selector);
  };

  // constructor
  window.Repeater = function() {
    // default setting
    let defaults = {
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

    // initiating library
    init.call(this);
  };

  // Global function add Item
  Repeater.prototype.addItem = function(clickedButton) {
    //run function before add Element
    this.options.beforeAdd.call(this);

    const template = getSpecificTemplate.call(this); //get template
    const repeaterWrapper = findParentByclass(clickedButton, "repeater");
    const container = repeaterWrapper.querySelector(this.options.container);

    // check if has options max and if total item greater or equal max value
    if (this.options.max && checkMaximum.call(this, container)) {
      return;
    }
    container.insertAdjacentHTML("beforeend", template); //adding to dom

    // check if has options min and if total item less or equal min value
    this.options.min && checkMinimum.call(this, container)
      ? disabledButtonDel.call(this, container)
      : enabledButtonDel.call(this, container);

    // add event listener to added delete button
    const lastItem = getLastItem(container);
    const buttonDel = lastItem.querySelector(".repeat-del");
    if (buttonDel) {
      buttonDel.addEventListener("click", () => {
        if (buttonDel.classList.contains("disabled")) {
          return;
        }
        const elementToDel = findParentByclass(buttonDel, "repeat-item");
        this.deleteItem(elementToDel);
      });
    }

    // run function after add Element
    this.options.afterAdd.call(this, lastItem);
  };

  // Global function remove Item
  Repeater.prototype.deleteItem = function(elementToDel) {
    const repeaterWrapper = findParentByclass(elementToDel, "repeater");
    const container = repeaterWrapper.querySelector(this.options.container);

    // run function before delete element (return boolean)
    if (!this.options.beforeDelete.call(this, elementToDel)) return;

    // delete element from dom
    elementToDel.parentNode.removeChild(elementToDel);

    // check if has options min and if total item less or equal min value
    this.options.min && checkMinimum.call(this, container)
      ? disabledButtonDel.call(this, container)
      : enabledButtonDel.call(this, container);

    // run function after delete element
    this.options.afterDelete.call(this);
  };

  // Global function re Init, use to re initialize library
  // if use nested repeatable, add reInit function to function afterAdd parent repeatable
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

  // function checkMaximum
  // compare total item and options max
  function checkMaximum(container) {
    var totalItem = [...container.children];
    totalItem = totalItem.reduce((acc, value) => {
      return value.classList.contains("repeat-item") ? acc + 1 : acc;
    }, 0);
    return totalItem >= this.options.max ? true : false;
  }

  // function checkMinimum
  // compare total item and options min
  function checkMinimum(container) {
    var totalItem = [...container.children];
    totalItem = totalItem.reduce((acc, value) => {
      return value.classList.contains("repeat-item") ? acc + 1 : acc;
    }, 0);
    return totalItem <= this.options.min ? true : false;
  }

  // function disabledButtonDel
  // disabled button delete if total item == options min
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

  // function disabledButtonDel
  // disabled button delete if total item > options min
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

  // function getSpecificTemplate
  // get a specific template from template repeatable
  function getSpecificTemplate() {
    var template = $(this.options.template)[0].innerHTML;
    template = template.replace(/{\++}/g, this.options.startingRepeat++);
    return template;
  }

  // function findParentByclass
  // find parent element with specific class, like parents() in jquery
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
