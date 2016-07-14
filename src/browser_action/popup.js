/*// create an array with nodes
var nodes = new vis.DataSet([
{id: 1, label: 'Node 1'},
{id: 2, label: 'Node 2'},
{id: 3, label: 'Node 3'},
{id: 4, label: 'Node 4'},
{id: 5, label: 'Node 5'}
]);

// create an array with edges
var edges = new vis.DataSet([
{from: 1, to: 3},
{from: 1, to: 2},
{from: 2, to: 4},
{from: 2, to: 5}
]);*/
function nodes_prepare_for_graphing(sites){
  var nodes = [];
  //TODO
  for(var i=0;i<sites.length;++i){
    nodes.push({id:sites[i].id,label:sites[i].label,shape:'box',level:Math.floor(Math.random()*20)});//TODO levels
  }
  return nodes;
}

var nodes = new vis.DataSet(nodes_prepare_for_graphing(chrome.extension.getBackgroundPage().sites));
var edges = new vis.DataSet(chrome.extension.getBackgroundPage().links);
// create a network
var container = document.getElementById('mynetwork');
var data = {
   nodes: nodes,
   edges: edges
};
var options = {
   layout: {
      hierarchical: {
         sortMethod: 'directed ',
         direction: 'UD',
         levelSeparation: 20,
         nodeSpacing: 10,
         treeSpacing: 50,
         parentCentralization: false
      }
   },
   edges: {
      smooth: true,
      arrows: {to : true }
   }
};
var network = new vis.Network(container, data, options);
