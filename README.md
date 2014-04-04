#Gridded


A simple jQuery tile based grid.


## Examples

### Simple
This is a simple way to call Gridded where you can supply the width and height for the tiles as data attributes.
[Demo](http://codepen.io/Last1Here/pen/giaCq)

###### jQuery
```Javascript
$(function() {
	$('.container').gridded();
});
```

###### HTML
```html
<div class='container'>
  <div class='item' >1</div>
  <div class='item' >2</div>
  <div class='item' data-w="2">3</div>
  <div class='item' data-w="2" data-h="1">4</div>
  <div class='item' >5</div>
  <div class='item' >6</div>
  <div class='item' data-h="2">7</div>
  <div class='item' >8</div>
  <div class='item' >9</div>
  <div class='item' >10</div>
  <div class='item' data-w="1">11</div>
</div>
```

## Options

## Todo's

- better customisation