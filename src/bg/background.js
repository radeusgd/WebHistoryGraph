var wikiOnly = false;
var wikiDomains = ["wikipedia.org","wikia.com"];//TODO customize the list in options
var sites = [];
var links = [];
var uidToSiteId = {};

function clearMemory(){
    sites = [];
    links = [];
    uidToSiteId = {};
}

function isValid(site){
    if(wikiOnly){
        for(var i=0;i<wikiDomains.length;++i){
            if(site.uid.indexOf(wikiDomains[i])>=0) return true;
        }
        return false;
    }
    else{
        if(site.title!="") return true;
        return false;
    }
}

function getSiteId(site){
    if(uidToSiteId[site.uid]!==undefined){//if site is already registered
        if(sites[uidToSiteId[site.uid]].title == sites[uidToSiteId[site.uid]].uid){//if the site used to have a placeholder title (due to insufficient information)
            sites[uidToSiteId[site.uid]].title = site.title;//try updating it
        }
        return uidToSiteId[site.uid];//return its id
    }
    //otherwise register the site
    site.id = sites.length;
    console.log(site);
    if(wikiOnly && site.title == site.uid){
        //TODO fetch title from wikipedia?
    }
    uidToSiteId[site.uid] = sites.length;
    sites.push(site);
    return uidToSiteId[site.uid];
}

chrome.runtime.onMessage.addListener(function (msg, sender) {
    if(!isValid(msg.to)){
        return;
    }
    if(isValid(msg.from)){
        //insert a from to link
        var f = getSiteId(msg.from);
        var t = getSiteId(msg.to);
        var shouldAddLink = true;
        for(var i=0;i<links.length;++i){//consider optimizing that? (probably not that important, it's just O(E))
            if(links[i].from==f && links[i].to==t){
                shouldAddLink = false;
                break;
            }
        }
        if(shouldAddLink){
            links.push({from:f,to:t});
        }
    }else{
        //just insert the current website (most likely it was opened by typing the address hence no referrer)
        getSiteId(msg.to);
    }
});
