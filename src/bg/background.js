var wikiOnly = false;

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
        if(site.uid.indexOf("wikipedia.org")>=0) return true;//TODO options to add more "WIKI" sites, better filter
        return false;
    }
    else{
        if(site.title!="") return true;
        return false;
    }
}

function filter(title){
    if(wikiOnly){
        var wiki = title.lastIndexOf("Wikipedia");
        console.log("FLT ",title,wiki);
        if(wiki>=0){
            return title.substring(0,wiki-3);
        }
    }
    return title;
}

function getSiteId(site){
    if(uidToSiteId[site.uid]!==undefined){//if site is already registered
        return uidToSiteId[site.uid];//return its id
    }
    //otherwise register the site
    site.id = sites.length;
    console.log(site);
    if(wikiOnly && site.title == site.uid){
        //TODO fetch title from wikipedia?
    }
    site.title = filter(site.title);
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
