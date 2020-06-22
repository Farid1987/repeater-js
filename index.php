<!DOCTYPE html>
<html>

<head>
  <title>Page Title</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css" />
  <link rel="stylesheet" href="./dist/css/main.min.css">
</head>

<body>

  <div class="wrapper">
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
              <input type="text" name="name[{++}]" />
            </td>
            <td class="repeater">
              <div class="repeat-container-2">
                <div class="repeat-item nested-repeat-item">
                  <input type="text" />
                  <a class="repeat-add-2 add-btn">
                    <i class="fa fa-plus"></i>
                  </a>
                </div>
              </div>
              <template class="repeat-template-2">
                <div class="repeat-item nested-repeat-item">
                  <input type="text" />
                  <a class="repeat-del">
                    <i class="fa fa-minus"></i>
                  </a>
                </div>
              </template>
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
          <td class="repeater">
            <div class="repeat-container-2">
              <div class="repeat-item nested-repeat-item">
                <input type="text" />
                <a class="repeat-add-2 add-btn">
                  <i class="fa fa-plus"></i>
                </a>
              </div>
            </div>
            <template class="repeat-template-2">
              <div class="repeat-item nested-repeat-item">
                <input type="text" />
                <a class="repeat-del">
                  <i class="fa fa-minus"></i>
                </a>
              </div>
            </template>
          </td>
          <td>
            <a class="repeat-del">
              <i class="fa fa-minus"></i>
            </a>
          </td>
        </tr>
      </template>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/js/all.min.js"></script>
  <script src="./src/js/index.js"></script>
  <script type="text/javascript">
  (function() {
    var repeat = new Repeater({
      container: '.repeat-container',
      template: '.repeat-template',
      addButton: '.repeat-add',
      startingRepeat: 1,
      min: 1,
      max: 3,
      afterAdd: function(item) {
        repeat2.reInit();
      }
    });
    var repeat2 = new Repeater({
      container: '.repeat-container-2',
      template: '.repeat-template-2',
      addButton: '.repeat-add-2',
      max: 4
    });
  })()
  </script>
</body>

</html>