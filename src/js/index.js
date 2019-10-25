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
      min: 1,
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

    if (this.options.max && container.children.length >= this.options.max) {
      return;
    }
    container.insertAdjacentHTML("beforeend", template); //adding to dom

    var lastItem = getLastItem(container);
    var buttonDel = lastItem.querySelector(".repeat-del");
    buttonDel.addEventListener("click", () => {
      this.deleteItem(buttonDel);
    });

    this.options.afterAdd.call(this, lastItem);
  };

  // remove Item
  Repeater.prototype.deleteItem = function(target) {
    var el = findParentByclass(target, "repeat-item");

    if (!this.options.beforeDelete.call(this, el)) return;

    el.parentNode.removeChild(el);
    this.options.afterDelete.call(this);
  };

  Repeater.prototype.reInit = function() {
    if (this.options.addButton) {
      var button = $(this.options.addButton);

      if (button.length > 0) {
        for (let i = 0; i < button.length; i++) {
          var newButton = button[i].cloneNode(true);
          button[i].parentNode.replaceChild(newButton, button[i]);
        }
      }

      init.call(this);
    }
  };

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

    for (let index = 0; index < allChild.length; index++) {
      if (
        allChild[index].nodeType === 1 &&
        allChild[index].classList.contains("repeat-item")
      ) {
        child.push(allChild[index]);
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
        for (let i = 0; i < button.length; i++) {
          button[i].addEventListener("click", function(e) {
            e.preventDefault();
            parent.addItem(this);
          });
        }
      }
    }
  }
})();
