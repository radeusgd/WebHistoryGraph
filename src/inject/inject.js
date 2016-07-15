$(document).ready(function(){
	var from = {url:document.referrer, uid:removeTrail(document.referrer), title: removeTrail(document.referrer)};//we use placeholder title as there's no other way to know it
	var to = {url:document.URL, uid: removeTrail(document.URL), title: document.title};
	chrome.extension.sendMessage({from:from,to:to});
});
