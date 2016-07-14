var sites = [];
var links = [];

var siteDict = {};
var idcounter = 0;

function addSite(s){
   if(siteDict[s]!==undefined){
      return siteDict[s];
   }
   siteDict[s] = idcounter++;
   sites.push({id: siteDict[s],label:s});
   return siteDict[s];
}

chrome.runtime.onMessage.addListener(function (msg, sender) {
   //if(f.indexOf("//")==-1) return;
   var f = addSite(msg.from);
   var t = addSite(msg.to);
   links.push({from:f,to:t});//TODO deal with duplicates
   console.log(msg);
});
