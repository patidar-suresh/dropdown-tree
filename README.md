# dropdown-tree
Lightweight component for tree like selection in combo box with single/multi select features

The component can be used in your own web application to show tree like structure in drop-down. It support multiple options to customize the component behaviour as per your need.
The library can be loaded as CommonJS module, AMD module, or as a regular javascript file.

Supported browsers: Chrome, Firefox, Safari, Opera, Internet Explorer 9+.

<img alt="drop-down tree" src="https://github.com/patidar-suresh/dropdown-tree/blob/master/example-img/example.PNG">


## Features

- Display your data in tree like drow-down list.
- Set selection mode between single select or multi select.
- Set cascading effect in case of multi select mode
- Option to provide callback for selection change event.
- Configure resizing behaviour (x, y or both)
- Define "text", "value" and "children" keys according to your data.
- Options to pre-select values.
- Option to set required validation


## Supported Options
- resize : 'none', /* none,x,y,both*/
- height : "100",
- cascadeCheck : "no",
- multiSelect : "yes",
- element : null,
- data : null,
- textKey : null,
- valueKey : null,
- childrenKey : null,
- selectedValues : [],
- required:'no',
- onChange:null

## Use

```html
<!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
      <meta name="author" content="Suresh Patidar">
      <title>Dropdown Tree Demo</title>
      <!-- Include the relevant css for the Dropdown tree component -->
      <link rel="stylesheet" href="./dist/dropdown-tree.min.css">
   </head>
   <body>
      <h2>Dropdown Tree Demo</h2>
      <select id="myDropDownTree" />
      <!-- Include the JQuery from CDN -->
      <script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>
      <!-- Include the Dropdown tree lib -->
      <script src="./dist/dropdown-tree.min.js"></script>
      <script>
         var myData = [{value:'USA',text:'United States of America'},
         {value:'IND',text:'India',children:[{value:'Delhi', text:'Delhi'},{value:'MH',text:'Maharashtra', children:[{value:'mum',text:'Mumbai'},{value:'pune',text:'Pune'}]}]},
         {value:'China',text:'China'},
         {value:'Aus',text:'Australia'}
         ];
         var options = {
         	element : $('#myDropDownTree'),
         	data:myData,
         	valueKey:'value',
         	resize:"both",
         	textKey:'text',
         	childrenKey:'children',
         	cascadeCheck:'yes',
         	multiSelect:'yes',
         	required:'no'
         };
         var ddt = new DropDownTree(options);
      </script>
   </body>
</html>
```