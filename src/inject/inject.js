
function removeTrail(old){
	var index = 0;
	var res = old;
	index = old.indexOf('?');
	if(index == -1){
		index = old.indexOf('#');
	}
	if(index != -1){
		res = old.substring(0, index);
	}
	//index = res.indexOf("//");
	//res = res.substring(index+2);
	return res;
}

$(document).ready(function(){
	var from = removeTrail(document.referrer);
	var to = removeTrail(document.URL);
	console.log(from+" -> "+to);
	chrome.extension.sendMessage({from:from,to:to});
});
