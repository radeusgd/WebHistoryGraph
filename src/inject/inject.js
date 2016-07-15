
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
	index = res.indexOf("//");
	res = res.substring(index+2);
	return res;
}

$(document).ready(function(){
	var from = {url:document.referrer, uid:removeTrail(document.referrer), title: removeTrail(document.referrer)};//we use placeholder title as there's no other way to know it
	var to = {url:document.URL, uid: removeTrail(document.URL), title: document.title};
	chrome.extension.sendMessage({from:from,to:to});
});
