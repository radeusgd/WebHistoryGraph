function debug(msg){
    $("#dbgmsg").html($("#dbgmsg").html()+msg+"<br>");
}
function trim(str){
    var maxLen = 45;
    if(str.length > maxLen){
        return str.substr(0,maxLen-3)+"...";
    }
    return str;
}
function prepareGraph(sites,links){
    var nodes = [];
    var edges = links;
    var outs = [];
    var ins = [];
    for(var i=0;i<sites.length;++i){
        debug(JSON.stringify(sites[i]));
        nodes.push({id:sites[i].id,label:trim(sites[i].title),shape:'box',font:{size:23},level:undefined});
        outs.push([]);
        ins.push([]);
    }
    for(var i=0;i<edges.length;++i){
        var e = edges[i];
        outs[e.from].push(e.to);
        ins[e.to].push(e.from);
    }
    /*//now compute levels: a kind of BFS - start with 0 and populate
    var BFS = function(startid){
        nodes[startid].level = 0;
        var queue = [startid];
        while(queue.length>0){
            var c = queue.shift();//pop
            for(var i=0;i<outs[c].length;++i){
                if(nodes[outs[c][i]].level === undefined){//TODO maybe add OR abs()<abs()???
                    nodes[outs[c][i]].level = nodes[c].level+1;
                    queue.push(outs[c][i]);
                }
            }
            for(var i=0;i<ins[c].length;++i){
                if(nodes[ins[c][i]].level === undefined){//TODO maybe add OR abs()<abs()???
                    nodes[ins[c][i]].level = nodes[c].level-1;
                    queue.push(ins[c][i]);
                }
            }
        }
    };
    for(var i=0;i<nodes.length;++i){
        if(nodes[i].level === undefined){
            BFS(i);
        }
    }*///level computing is disabled for now due to unsatisfactory results, currently we rely on physics
    return {nodes:nodes,edges:edges};
}
var graph = prepareGraph(chrome.extension.getBackgroundPage().sites,chrome.extension.getBackgroundPage().links);
var nodes = new vis.DataSet(graph.nodes);
var edges = new vis.DataSet(graph.edges);
var container = document.getElementById('webgraph');
var data = {
    nodes: nodes,
    edges: edges
};
var options = {
    layout: {
        randomSeed: 0
        /*hierarchical: {
            direction: 'LR',
            levelSeparation: 50,
            nodeSpacing: 30,
            treeSpacing: 80,
            parentCentralization: true
        }*/
    },
    edges: {
        smooth: true,
        arrows: {to : true }
    },
    physics:{
        barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.1,
            springLength: 25,
            springConstant: 0.007,
            damping: 0.3,
            avoidOverlap: 0.5
        },
        hierarchicalRepulsion: {
            centralGravity: 0.1,
            springLength: 90,
            springConstant: 0.01,
            nodeDistance: 120,
            damping: 0.09
        },
    }
};

$(function() {
    var network = new vis.Network(container, data, options);
    network.on( 'doubleClick', function(properties) {
        var url = chrome.extension.getBackgroundPage().sites[properties.nodes].url;
        var uid = chrome.extension.getBackgroundPage().sites[properties.nodes].uid;
        chrome.tabs.query({url:"*://"+uid+"*"},function(results){
            if(results.length>0){
                //switch to tab
                chrome.tabs.update(results[0].id,{active:true});
            }
            else{//no tabs found, open a new one
                chrome.tabs.create({ url: url });
            }
        });
    });
    $("#clear").click(function(){
        chrome.extension.getBackgroundPage().clearMemory();
        window.location.href="";
    });
    $("#wiki-only").change(function() {
        chrome.extension.getBackgroundPage().wikiOnly = this.checked;
        debug("set to: "+chrome.extension.getBackgroundPage().wikiOnly);
    });
    debug("loaded as: "+chrome.extension.getBackgroundPage().wikiOnly);
    $("#wiki-only").attr("checked",chrome.extension.getBackgroundPage().wikiOnly);
});
