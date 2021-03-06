/*
# d3.colorLegend

This script can be used to draw a color legend for a [d3.js scale](https://github.com/mbostock/d3/wiki/Scales) on a specified html div element. [d3.js](http://mbostock.github.com/d3/) is required.

## Usage
The height and width of the legend are defined by the size of target element. The legend will be drawn on the top left (plus a small amount of padding) of the element, or filled in the entire display if 'fill' option is specified, or if the requested sizes are too big to fit in the available space. Labels and an optional title are drawn under the legend.

    colorLegend(target, scale, type, options);

### Parameters
  * target: the html element id to put the legend on (usually a div id, #el)
  * scale: the [d3 scale](https://github.com/mbostock/d3/wiki/Scales)
  * type: the type of d3 scale. Supported scales are:
    * [linear](https://github.com/mbostock/d3/wiki/Quantitative-Scales#wiki-linear): linear scales are drawn with a number of boxes that interpolate between the color range. The first and last items are labeled.
    * [quantile](https://github.com/mbostock/d3/wiki/Quantitative-Scales#wiki-quantile): quantile scales are drawn for each item in the color range. The first and last items are labeled.
    * [ordinal](https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-ordinal): ordinal scales are drawn for each item in the color range, with small spacing between the items. Each item is labeled.
  * options: optional parameters for controling the display
    * boxWidth:  integer to set the maximum width of an individual color box (default: 25)
    * boxHeight:  integer to set the maximum height of an individual color box (default: 25)
    * title:  string to add to the legend; centered, below the boxes and labels (default: '')
    * fill:  boolean to fill the entire space of the legend (default: false)
    * linearBoxes: integer to set the number of boxes to show for linear scales (default: 9)
  

## TODO
  * Option to put labels in the middle of boxes

*/
colorlegend = function(target, scale, type, options) {

  // check for valid input - 'quantize' not included
  var scaleTypes = ['linear', 'quantile', 'ordinal'];
  var found = false;
  for ( var i = 0 ; i < scaleTypes.length ; i++ ) {
    if ( scaleTypes[i] === type ) {
      found = true;
      break;
    }
  }
  if ( ! found ) {
    throw new Error('Scale type, ' + type + ', is not suported.');
    return false;
  }

  // empty options if none were passed
  var opts = arguments.length < 3 ? {} : options;
  
  // options or use defaults
  var boxWidth = opts.boxWidth || 25;     // width of each box (int)
  var boxHeight = opts.boxHeight || 25;   // height of each box (int)
  var title = opts.title || null;         // draw title (string)
  var fill = opts.fill || false;          // fill the element (boolean)
  var linearBoxes = opts.linearBoxes || 9; // number of boxes for linear scales (int)
  
  // get width and height of the target element - strip the prefix #
  var htmlElement;
  if ( target.substring(0, 1) === '#' ) {
    htmlElement = document.getElementById(target.substring(1, target.length));
  }
  else {
    htmlElement = document.getElementById(target);
  }
  var w = htmlElement.offsetWidth;
  var h = htmlElement.offsetHeight;
  
  // set padding for legend and individual boxes
  var padding = [2, 4, 12, 4]; // top, right, bottom, left
  var boxSpacing = type === 'ordinal' ? 4 : 0; // spacing between boxes
  var titlePadding = title ? 12 : 0;
  
  // properties of the scale that will be used
  var domain = scale.domain();
  var range = scale.range();
  
  // setup the colors to use
  var colors = [];
  if ( type === 'quantile' ) {
    colors = range;
  }
  else if ( type === 'ordinal' ) {
    for ( var i = 0 ; i < domain.length ; i++ ) {
      colors[i] = range[i];
    }
  }
  else if ( type === 'linear' ) {
    var min = domain[0];
    var max = domain[domain.length-1];
    for ( var i = 0; i < linearBoxes ; i++  ) {
      colors[i] = scale( i * ((max-min)/linearBoxes) );
    }
    console.log( min + '/' + max );
  }
  // check the width and height and adjust if necessary to fit in the element
  // use the range if quantile
  if ( fill || w < (boxWidth+boxSpacing)*colors.length + padding[1] + padding[3] ) {
    boxWidth = (w - padding[1] - padding[3] - (boxSpacing * colors.length)) / colors.length;
  }
  if ( fill || h < boxHeight + padding[0] + padding[2] + titlePadding ) {  
    boxHeight = h - padding[0] - padding[2] - titlePadding;    
  }
  
  // set up the legend graphics context
  var legend = d3.select(target)
    .append('svg')
      .attr('width', w)
      .attr('height', h)
    .append('g')
      .attr('transform', 'translate(' + padding[3] + ',' + padding[0] + ')');
      
  legendBoxes = legend.selectAll('g.legend')
      .data(colors)
    .enter().append('svg:g')
      .attr('class', 'legend');

  var boxes = legendBoxes.append('svg:rect')
      .attr('x', function(d,i){ return i*(boxWidth+boxSpacing); } )
      .attr('width', boxWidth)
      .attr('height', boxHeight)
      .style('fill', function(d, i) { return colors[i]; } );
  
  // minimum and maximum values at left and right (bottom)
  legendBoxes.append('svg:text')
      .attr('class', 'legendLabel')
      .attr('x', function(d,i) {return i * (boxWidth+boxSpacing) + (boxWidth/2);} )
      .attr('y', boxHeight+2)
      .attr('dy', '.71em')
      .style('font-size', '8.5px')
      .style('fill', '#666')
      .style('text-anchor', 'middle')
      .style('pointer-events', 'none')
      .text(function(d,i) {
        // show label for all ordinal values
        if ( type === 'ordinal' ) {
          var name = domain[i];
          if ( name === '' ) {
            name = 'unknown';
          }
          return name.length > 9 ? name.substr(0,8) + '..' : name;
        }
        // show only the first and last for others
        else {
          return i === 0 ? domain[0] : (i===colors.length-1 ? domain[domain.length-1] : '');          
        }
      });

  // show a title in center of legend (bottom)
  if ( title ) {
    legend.append('svg:text')
        .attr('class', 'legendTitle')
        .attr('x', (colors.length*(boxWidth/2)))
        .attr('y', boxHeight + titlePadding)
        .attr('dy', '.71em')
        .style('font-size', '10px')
        .style('fill', '#666')
        .style('text-anchor', 'middle')
        .style('pointer-events', 'none')
        .text(title);
  }
    
  return this;
}
