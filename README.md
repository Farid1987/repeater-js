# repeater-js
Repeatable element with pure javascript (no dependency)

## Available Options
```
{
  container: "",
  template: "",
  addButton: "",
  startingRepeat: 0,
  numTemplate: '{\\+\\+}',
  min: 0,
  max: null,
  beforeAdd: function (clickedButton) {},
  afterAdd: function (item) {},
  beforeDelete: function (item) {
    return true;
  },
  afterDelete: function (item, container) {},
};
```

## Usage

### HTML
```
<div class="repeater">
  <button class="repeat-add add-btn"><i class="fa fa-plus"></i></button>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Address</th>
        <th width="100"></th>
      </tr>
    </thead>
    <tbody class="repeat-container">
      <tr class="repeat-item">
        <td>
          <input type="text" name="name[0]" />
        </td>
        <td>
          <a class="repeat-del">
            <i class="fa fa-minus"></i>
          </a>
        </td>
      </tr>
    </tbody>
  </table>
  <template class="repeat-template">
    <tr class="repeat-item">
      <td>
        <input type="text" name="name[{++}]" />
      </td>
      <td>
        <a class="repeat-del">
          <i class="fa fa-minus"></i>
        </a>
      </td>
    </tr>
  </template>
</div>
```

Class `repeat-add, repeat-container, repeat-template` is customizable in options.

Class `repeat-del` and `repeat-item` is static and required for item repeatable.

### Javascript
```
var repeat = new Repeater({
  container: '.repeat-container',
  template: '.repeat-template',
  addButton: '.repeat-add',
});
```

For nested repeatable, you can use method addEventListener to re init child repeat item after add parent item.
```
// parent repeater
var repeat = new Repeater({
  container: '.repeat-container',
  template: '.repeat-template',
  addButton: '.repeat-add',
  afterAdd: function(item) {
    repeat2.addEventListener(item);
  }
});

// child repeater
var repeat2 = new Repeater({
  container: '.repeat-container-2',
  template: '.repeat-template-2',
  addButton: '.repeat-add-2',
});
```