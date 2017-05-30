//  var compressor = require('node-minify');
// // find files
// 	var base = 'js/';
// 	var partNames = ['other','plane','sideBar'];
// 	parts.other = ['app','storage','dom','player','tabs','help'];
// 	parts.plane = ['plane','envelopePlane','filtersPlane','wavePlane'];
// 	parts.sideBar = ['sideBar','envelopeSideBar','filtersSideBar','waveSideBar'];
// 	var files = [];
// 	for(var i=0; i<partNames.length; ++i) {
// 		var part = parts[partNames[i]];
// 		for(j=0; j<part.length; ++j) {
// 			files.push(base+partNames[i]+'/'+part[j]+'.js');
// 		}
// 	}
// // minify
// 	new compressor.minify({
// 		type: 'yui-js',
// 		fileIn: files,
// 		fileOut: 'public/min.js',
// 		callback: function(err,min){
// 			if(err) console.log(err);
// 		}
// 	});