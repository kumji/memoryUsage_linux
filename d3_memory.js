var dataset = [{label:"Active", value:20}, 
         {label:"Inactive", value:50}, 
         {label:"Free", value:30}];


setInterval(function(){
$.get("/checkMem", function(data){
    memData = JSON.parse(data);
    var total = Number(memData.MemTotal.size);
    var active = Number(memData.Active.size);
    var inactive = Number(memData.Inactive.size);
    var free = Number(memData.MemFree.size);

    var active100 = (active/total)*100;
    var inactive100 = (inactive/total)*100;
    var free100 = (free/total)*100;

    dataset[0].value = active100;
    dataset[1].value = inactive100;
    dataset[2].value = free100;
    console.log('check memory');
    change(dataset);
});
},1000);



var svg = d3.select("body")
    .append("svg")
    .append("g")

svg.append("g")
    .attr("class", "slices");
svg.append("g")
    .attr("class", "labels");
svg.append("g")
    .attr("class", "lines");


var width = 960,
    height = 450,
    radius = Math.min(width, height) / 2;

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
        return d.value;
    });

var arc = d3.svg.arc()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var key = function(d){ return d.data.label; };

var color = d3.scale.category20c();


function change(dataset) {

    var slice = svg.select(".slices").selectAll("path.slice")
        .data(pie(dataset), key);

    slice.enter()
        .insert("path")
        .style("fill", function(d, i){ return color(i); })
        .attr("class", "slice");

    slice       
        .transition().duration(1000)
        .attrTween("d", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                return arc(interpolate(t));
            };
        })

    slice.exit()
        .remove();


    var text = svg.select(".labels").selectAll("text")
        .data(pie(dataset), key);

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function(d, i) {
            return dataset[i].label + ": " + dataset[i].value;
        });
    
    function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    text.transition().duration(1000)
        .attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate("+ pos +")";
            };
        })
        .styleTween("text-anchor", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
            };
        });

    text.exit()
        .remove();


    var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(dataset), key);
    
    polyline.enter()
        .append("polyline");

    polyline.transition().duration(1000)
        .attrTween("points", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };          
        });
    
    polyline.exit()
        .remove();   

};