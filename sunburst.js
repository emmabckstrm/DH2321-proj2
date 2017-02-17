
var width = 700,
    height = 700,
    radius = Math.min(width, height) / 2;

var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

var y = d3.scale.sqrt()
    .range([0, radius]);

var color = d3.scale.category20c();

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
  w: 125, h: 30, s: 3, t: 10
};


var chartOn = false;
var svg; 
var partition;
var arc;
var path;
initializeBreadcrumbTrail();

function updateChart(wave) {
  if (chartOn === false) {
    initChart(wave);
  } else {
    document.getElementById("chart").innerHTML = "";
    d3.select("#chart").selectAll("*").remove();
    svg = "";
    arc = "";
    path = "";
    initChart(wave);
  }
}


function initChart(wave) {
  chartOn = true;
  svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

  partition = d3.layout.partition()
    .sort(null)
    .value(function(d) { 
      //console.log(d);
      return d.size; });

  arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

// Add the mouseleave handler to the bounding circle.
  d3.select("#chart").on("mouseleave", mouseleave);

// Keep track of the node that is currently being displayed as the root.
var node;

  d3.json(wave, function(error, root) {
    node = root;
    path = svg.datum(root).selectAll("path")
        .data(partition.nodes)
      .enter().append("path")
        .attr("d", arc)
        .style("fill", function(d) { 
          //console.log(d);
          //console.log(continentColor[d.continent] ? d : d.parent);
          return color((d.children ? d : d.parent).name);
          //return color()
        })
        .style('stroke', 'white')
          .style('stroke-width', '.75')
        .attr("class", function(d) {
          return d.name;
        })
        .on("click", click)
        .each(stash)
        .on("mouseover", mouseover);;

    d3.selectAll("input").on("change", function change() {
      var value = this.value === "count"  // if statement
          ? function() { return 1; }    // if true
          : function(d) {               // else
            console.log(d.size);
            return d.size; };

      path
          .data(partition.value(value).nodes)
        .transition()
          .duration(1000)
          .attrTween("d", arcTweenData);
    });

    function click(d) {
      node = d;
      path.transition()
        .duration(1000)
        .attrTween("d", arcTweenZoom(d));
    }


  });
}

d3.select(self.frameElement).style("height", height + "px");

// Setup for switching data: stash the old values for transition.
function stash(d) {
  d.x0 = d.x;
  d.dx0 = d.dx;
}

// When switching data: interpolate the arcs in data space.
function arcTweenData(a, i) {
  var oi = d3.interpolate({x: a.x0, dx: a.dx0}, a);
  function tween(t) {
    var b = oi(t);
    a.x0 = b.x;
    a.dx0 = b.dx;
    return arc(b);
  }
  if (i == 0) {
   // If we are on the first arc, adjust the x domain to match the root node
   // at the current zoom level. (We only need to do this once.)
    var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
    return function(t) {
      x.domain(xd(t));
      return tween(t);
    };
  } else {
    return tween;
  }
}

// When zooming: interpolate the scales.
function arcTweenZoom(d) {
  var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
      yd = d3.interpolate(y.domain(), [d.y, 1]),
      yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
  return function(d, i) {
    return i
        ? function(t) { return arc(d); }
        : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
  };
}

// Fade all but the current sequence, and show it in the breadcrumb trail.
function mouseover(d) {

  // Fade all the segments.
  d3.selectAll("path")
      .style("opacity", 0.6);

  var sequenceArray = getAncestors(d);
  updateBreadcrumbs(sequenceArray, d.size);
  //updateBreadcrumbs(sequenceArray, percentageString);

  // Then highlight only those that are an ancestor of the current segment.
  svg.selectAll("path")
      .filter(function(node) {
                return (sequenceArray.indexOf(node) >= 0);
              })
      .style("opacity", 1);
}

// Restore everything to full opacity when moving off the visualization.
function mouseleave(d) {

  // Hide the breadcrumb trail
  d3.select("#trail")
      .style("visibility", "hidden");

  // Deactivate all segments during transition.
  d3.selectAll("path").on("mouseover", null);

  // Transition each segment to full opacity and then reactivate it.
  d3.selectAll("path")
      .transition()
      .duration(1000)
      .style("opacity", 1)
      .each("end", function() {
              d3.select(this).on("mouseover", mouseover);
            });

}

// Given a node in a partition layout, return an array of all of its ancestor
// nodes, highest first, but excluding the root.
function getAncestors(node) {
  var path = [];
  var current = node;
  while (current.parent) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}


function initializeBreadcrumbTrail() {
  // Add the svg area.
  var trail = d3.select("#sequence").append("svg:svg")
      .attr("width", width)
      .attr("height", 50)
      .attr("id", "trail");
  // Add the label at the end, for the percentage.
  trail.append("svg:text")
    .attr("id", "endlabel")
    .style("fill", "#000");
}

// Generate a string that describes the points of a breadcrumb polygon.
function breadcrumbPoints(d, i) {
  var points = [];
  //console.log(b);
  points.push("0,0");
  points.push(b.w + ",0");
  points.push(b.w + b.t + "," + (b.h / 2));
  points.push(b.w + "," + b.h);
  points.push("0," + b.h);
  if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
    points.push(b.t + "," + (b.h / 2));
  }
  return points.join(" ");
}
// Update the breadcrumb trail to show the current sequence and percentage.
function updateBreadcrumbs(nodeArray, percentageString) {

  // Data join; key function combines name and depth (= position in sequence).
  var g = d3.select("#trail")
      .selectAll("g")
      .data(nodeArray, function(d) { return d.name + d.depth; });

  // Add breadcrumb and label for entering nodes.
  var entering = g.enter().append("svg:g");

  entering.append("svg:polygon")
      .attr("points", breadcrumbPoints)
      .style("fill", function(d) { return color("blue"); });

  entering.append("svg:text")
      .attr("x", (b.w + b.t) / 2)
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { 
        return d.name; 
      }); // output in breadcrumbs

  // Set position for entering and updating nodes.
  g.attr("transform", function(d, i) {
    return "translate(" + i * (b.w + b.s) + ", 0)";
  });

  // Remove exiting nodes.
  g.exit().remove();

  // Now move and update the percentage at the end.
  d3.select("#trail").select("#endlabel")
      .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function() {
        if (percentageString !== undefined) {
          return percentageString + '%'
        } 
      });

  // Make the breadcrumb trail visible, if it's hidden.
  d3.select("#trail")
      .style("visibility", "");

}
