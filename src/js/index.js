/**
 * @Author Farid M R
 * https://github.com/Farid1987
 */

(function () {
  "use strict";

  // function to get element in DOM
  const $ = function (selector) {
    return document.querySelectorAll(selector);
  };

  // constructor
  window.Repeater = function () {
    // default setting
    const defaults = {
      container: "",
      template: "",
      addButton: "",
      startingRepeat: 0,
      min: 0,
      max: null,
      beforeAdd: function () {},
      afterAdd: function (item) {},
      beforeDelete: function (item) {
        return true;
      },
      afterDelete: function (item, container) {},
    };

    if (arguments[0] && typeof arguments[0] === "object") {
      this.options = Object.assign(defaults, arguments[0]);
    }

    // initiating library
    init.call(this);
  };

  // Global function add Item
  Repeater.prototype.addItem = function (clickedButton) {
    if (!clickedButton) {
      console.error(
        "Error. Pass the dom element of Add Button to function AddItem!"
      );
      return;
    }

    const repeaterWrapper = findParentByclass(clickedButton, "repeater");
    const container = (repeaterWrapper) ? repeaterWrapper.querySelector(this.options.container) : null;
    const template = getSpecificTemplate.call(this, repeaterWrapper);

    if (this.options.max && checkMaximum.call(this, container)) {
      // console.log(checkMaximum.call(this, container));
      return;
    }
    
    try {
      this.options.beforeAdd.call(this);

      container.insertAdjacentHTML("beforeend", template);

      this.options.min && checkMinimum.call(this, container)
        ? disabledButtonDel.call(this, container)
        : enabledButtonDel.call(this, container);

      const lastItem = getLastItem(container);
      const buttonDel = lastItem.querySelector(".repeat-del");

      if (buttonDel) {
        buttonDel.addEventListener("click", (e) => {
          e.preventDefault();

          if (buttonDel.classList.contains("disabled")) return;

          const elementToDel = findParentByclass(buttonDel, "repeat-item");
          this.deleteItem(elementToDel);
        });
      }

      // run function after add Element
      this.options.afterAdd.call(this, lastItem);
    } catch (error) {
      console.error('Error Add Element');
    }
  };

  // Global function remove Item
  Repeater.prototype.deleteItem = function (elementToDel) {
    if (!elementToDel) {
      console.error(
        "Error. Pass the dom element to function deleteItem!"
      );
      return;
    }

    const repeaterWrapper = findParentByclass(elementToDel, "repeater");
    const container = (repeaterWrapper) ? repeaterWrapper.querySelector(this.options.container) : null;

    if (this.options.min && checkMinimum.call(this, container)) {
      disabledButtonDel.call(this, container);
      return;
    }

    if (!this.options.beforeDelete.call(this, elementToDel)) return;

    elementToDel.parentNode.removeChild(elementToDel);

    this.options.min && checkMinimum.call(this, container)
      ? disabledButtonDel.call(this, container)
      : enabledButtonDel.call(this, container);

    this.options.afterDelete.call(this, elementToDel, container);
  };

  // Global function re Init, use to re initialize library
  Repeater.prototype.reInit = function () {
    if (!this.options.addButton) return;
    const allContainer = $(this.options.container);
    const allAddButton = $(this.options.addButton);

    if (allAddButton.length > 0) {
      for (let button of allAddButton) {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
      }
    }
    if (allContainer.length > 0) {
      for (const container of allContainer) {
        const allDelButton = getAllBtnDel(container);
        if (allDelButton.length > 0) {
          for (let button of allDelButton) {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
          }
        }
      }
    }

    init.call(this);
  };

  // Global function addListener
  // if use nested repeatable, add addListener function to function afterAdd parent repeatable
  Repeater.prototype.addEventListener = function (wrapper) {
    const allAddButton = wrapper.querySelectorAll(this.options.addButton);
    const allContainer = wrapper.querySelectorAll(this.options.container);
    addEventListenerButtonAdd(allAddButton, this);
    addEventListenerButtonDel(allContainer, this);
  }

  // function checkMaximum
  // compare total item and options max
  function checkMaximum(container) {
    if (!container) return false;

    const allChild = [...container.children];
    const totalItem = allChild.reduce((total, element) => {
      return element.classList.contains("repeat-item") ? total + 1 : total;
    }, 0);
    return totalItem >= this.options.max ? true : false;
  }

  // function checkMinimum
  // compare total item and options min
  function checkMinimum(container) {
    if (!container) return false;

    const allChild = [...container.children];
    const totalItem = allChild.reduce((total, element) => {
      return element.classList.contains("repeat-item") ? total + 1 : total;
    }, 0);
    return totalItem <= this.options.min ? true : false;
  }

  // function disabledButtonDel
  // disabled button delete if total item == options min
  function disabledButtonDel(container) {
    var delButton = getAllBtnDel(container);
    if (!delButton) return;

    for (let button of delButton) {
      button.classList.add("disabled");
    }
  }

  // function disabledButtonDel
  // disabled button delete if total item > options min
  function enabledButtonDel(container) {
    var delButton = getAllBtnDel(container);
    if (!delButton) return;

    for (let button of delButton) {
      button.classList.remove("disabled");
    }
  }

  // function getAllBtnDel
  // get all button delete in container, exclude nested repeater
  function getAllBtnDel(container) {
    if (!container) return;

    let delButton = [...container.querySelectorAll(".repeat-del")];
    const nestedRepeater = container.querySelectorAll(".repeater");
    if (nestedRepeater.length > 0) {
      for (let repeater of nestedRepeater) {
        const delButtonNested = [...repeater.querySelectorAll(".repeat-del")];
        if (delButtonNested.length <= 0) continue;

        delButton = delButton.filter(function (value, index) {
          return !delButtonNested.includes(value);
        });
      }
    }
    return delButton;
  }

  // function getSpecificTemplate
  // get a specific template from template repeatable
  function getSpecificTemplate(wrapper) {
    if (!wrapper) return null;

    let template = wrapper.querySelector(this.options.template).innerHTML;
    template = template.replace(/{\++}/g, this.options.startingRepeat++);
    return template;
  }

  // function findParentByclass
  // find parent element with specific class
  function findParentByclass(el, classParentToFind) {
    if (el.parentNode.tagName == "HTML" || !el.parentNode) return;
    if (el.parentNode.classList.contains(classParentToFind)) return el.parentNode;
    return findParentByclass(el.parentNode, classParentToFind);
  }

  // function getLastItem
  // get last item or element with class repeat-item from spesific container
  function getLastItem(container) {
    if (!container) return;

    let childRepeater = new Array();
    const allChild = container.childNodes;

    for (let child of allChild) {
      if (child.nodeType === 1 && child.classList.contains("repeat-item")) {
        childRepeater.push(child);
      }
    }
    return childRepeater[childRepeater.length - 1];
  }

  function addEventListenerButtonAdd(allAddButton, repeater) {
    if (allAddButton.length <= 0) return;
    for (let button of allAddButton) {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        repeater.addItem(button);
      });
    }
  }

  function addEventListenerButtonDel(allContainer, repeater) {
    if (allContainer.length <= 0) return;
    for (let container of allContainer) {
      var buttonDel = getAllBtnDel(container);

      if (buttonDel.length <= 0) continue;

      for (let btn of buttonDel) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();

          const elementToDel = findParentByclass(btn, "repeat-item");
          if (elementToDel) repeater.deleteItem(elementToDel);
        });
      }
    }
  }

  // initial library
  function init() {
    const repeater = this;

    if (!repeater.options.addButton || !repeater.options.container) return;

    const allAddButton = $(repeater.options.addButton);
    const allContainer = $(repeater.options.container);

    addEventListenerButtonAdd(allAddButton, repeater);
    addEventListenerButtonDel(allContainer, repeater);
  }
})();
