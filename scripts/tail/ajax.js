tail.ajax = {
	get: function(url,callback) {
		// var request = new XMLHttpRequest();
		// request.open('GET',url);
		// request.send();
		// request.onreadystatechange = function() {
		// 	if(request.readyState==4 && request.status==200) {
		// 		callback(request.responseText);
		// 	} else ajax.error(request.status,request.responseText);
		// }
	},
	post: function(url,content,callback) {
		// var request = new XMLHttpRequest();
		// request.open('POST',url);
		// request.send(content);
		// request.onreadystatechange = function() {
		// 	if(request.readyState==4 && request.status==200) {
		// 		callback(request.responseText);
		// 	} else ajax.error(request.status,request.responseText);
		// }
	},
	error: function(status,responseText) {
		// console.log('error: '+status);
		var nothing;
	}
}