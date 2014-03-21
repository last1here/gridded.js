#Gridded


A simple jQuery tile based grid.


## Examples
### Simple
This is the simpliest way to call Gridded, currently just creates a basic grid with each tile exactly the same size.
[Example](http://codepen.io/Last1Here/pen/fFJsk/)
###### jQuery
```Javascript
$(function() {
	$('.container').gridded({
		col: 5,
		gutter: 15,
		auto: true
	});
});
```
###### HTML
```html
<div class='container' data-col='5' data-gut='15'>
  <div class='item'></div>
  <div class='item'></div>
  <div class='item'></div>
  <div class='item'></div>
</div>
```

### Simple V2
This is also a simple way to call Gridded but you do have to manually enter the data values as shown below.
[Example](http://codepen.io/Last1Here/pen/agpeF)
###### jQuery
```Javascript
$(function() {
	$('.container').gridded();
});
```
###### HTML
```html
<div class='container' data-col='5' data-gut='15'>
  <div class='item' data-pd='0' data-pr='0' data-w='1'></div>
  <div class='item' data-pd='1' data-pr='0' data-w='1'></div>
  <div class='item' data-pd='0' data-pr='1' data-w='2'></div>
  <div class='item' data-pd='0' data-pr='3' data-w='1'></div>
  <div class='item' data-pd='0' data-pr='4' data-w='1'></div>
  <div class='item' data-pd='1' data-pr='3' data-w='2'></div>
  <div class='item' data-pd='2' data-pr='0' data-w='1'></div>
  <div class='item' data-pd='2' data-pr='1' data-w='1'></div>
  <div class='item' data-pd='2' data-pr='2' data-w='1'></div>
  <div class='item' data-pd='3' data-pr='0' data-w='1'></div>
  <div class='item' data-pd='3' data-pr='1' data-w='1'></div>
  <div class='item' data-pd='3' data-pr='2' data-w='1'></div>
  <div class='item' data-pd='3' data-pr='3' data-w='1'></div>
  <div class='item' data-pd='3' data-pr='4' data-w='1'></div>
</div>
```



## Todo's

- Complex auto arrange for varing widths/heights