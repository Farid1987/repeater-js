<!DOCTYPE html>
<html>

<head>
  <title>Page Title</title>
  <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css" /> -->
  <style>
  .repeat-add {
    background: green;
    display: inline-block;
    border-radius: 4px;
    padding: 2px 5px;
    cursor: pointer;
  }

  a.repeat-del {
    background: red;
    display: inline-block;
    border-radius: 4px;
    padding: 2px 5px;
    cursor: pointer;
  }

  a.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    /* pointer-events: none; */
  }
  </style>
</head>

<body>
  <div class="repeater">
    <button id="repeat-add">Tambah</button>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th></th>
        </tr>
      </thead>
      <tbody id="repeat-container">

      </tbody>
    </table>
    <script type="text" id="repeat-template-2">
      <div class="repeat-item">
        <input type="text"/>
        <a class="repeat-del">
          -
        </a>
      </div>
    </script>
    <script type="text" id="repeat-template">
      <tr class="repeat-item">
          <td>
            <input type="text" name="name[{++}]"/>
          </td>
        <td class="repeater">
          <div id="repeat-container-2">
            <div class="repeat-item">
              <input type="text"/>
              <a class="repeat-add" id="repeat-add-2">
                +<!-- <i class="fa fa-plus"></i> -->
              </a>
            </div>
          </div>
        </td>
          <td>
            <a class="repeat-del">
              -
            </a>
          </td>
        </tr>
      </script>
  </div>

  <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/js/all.min.js"></script> -->
  <script src="./src/js/index.js"></script>
  <script type="text/javascript">
  (function() {
    var repeat = new Repeater({
      container: '#repeat-container',
      template: '#repeat-template',
      addButton: '#repeat-add',
      startingRepeat: 1,
      min: 1,
      max: 3,
      afterAdd: function(item) {
        repeat2.reInit();
      }
    });
    var repeat2 = new Repeater({
      container: '#repeat-container-2',
      template: '#repeat-template-2',
      addButton: '#repeat-add-2',
      min: 2,
      max: 4
    })
  })()
  </script>
</body>

</html>