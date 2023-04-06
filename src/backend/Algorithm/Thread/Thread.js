/* eslint-disable no-unused-vars */
import Predicates from "backend/Graph/Predicates.js";
import Graph from "backend/Graph/Graph.js";

// The array has one purpose: telling the thread to run or wait with Atomics.wait().
// If sharedArray[0] is 0, that means the Thread should wait. Once it is changed, the Thread wakes up from Atoimics.notify() from the Handler.
let sharedArray;
//Instance of the graph that the thread will be working with
let predicates;

/**
 * This is the listener for the Thread. It should recieve a SharedArray first, then an algorithm to run. 
 * 
 * @param {array} message - Has two main parts: subject and body. The first index is a string with the 
 *                          subject of the message. That is, what should be expected in the body. It can be:
 *                              - "shared": message[1] is the shared array that the Thread will `wait` on later.
 *                              - "algorithm/graph": message[1] is the graph object, message[2] is the algorithm
 * 
 * @author Noah
 * @author Andrew
 */
self.onmessage = message => { /* eslint-disable-line no-restricted-globals */
    message = message.data
    if (message[0] === 'shared') {
        sharedArray = message[1];
    }
    else if (message[0] === 'graph/algorithm') {
        let jsonGraph = message[1];
        let graph = new Graph(jsonGraph.nodes, jsonGraph.edges, jsonGraph.directed, jsonGraph.message);
        predicates = new Predicates(graph);
        print("Algorithm initialized");
        wait();

        try {
            eval(message[2]); /* eslint-disable-line no-eval */
            print("Algorithm completed");
            postMessage({type: "complete"});
        } catch (error) {
            let matches = error.stack.match(/eval:([0-9]+):[0-9]+\n/);
            if (matches != null) {
                error.lineNumber = parseInt(matches[1]);
            }
            // if there's an error, send a message with the error
            postMessage({type: "error", content: error});
            throw error
        }
    }
}

/*******************************
 * API Methods for user to use *
 * *****************************/

function getNodes() {
    return predicates.get().getNodes();
}

function getEdges() {
    return predicates.get().getEdges();
}

function numberOfNodes() {
    return predicates.get().getNumberOfNodes();
}

function numberOfEdges() {
    return predicates.get().getNumberOfEdges();
}

function colorNode(color, node) {
    let rule = predicates.update((graph) => {
        graph.colorNode(color, node);
    });
    postMessage({type: "rule", content: rule});
    wait();
}

function colorEdge(color, edge) {
    let rule = predicates.update((graph) => {
        graph.colorEdge(color, edge);
    });
    postMessage({type: "rule", content: rule});
    wait();
}

function outgoing(node) {
    return predicates.get().outgoing(node);
}

function incoming(node) {
    return predicates.get().incoming(node);
}

function adjacent(node) {
    return predicates.get().adjacent(node);
}

function outgoingNodes(node) {
    return predicates.get().outgoingNodes(node);
}

function incomingNodes(node) {
    return predicates.get().incomingNodes(node);
}

function adjacentNodes(node) {
    return predicates.get().adjacentNodes(node);
}

function source(edge) {
    return predicates.get().source(edge);
}

function target(edge) {
    return predicates.get().target(edge);
}

function getEdgeBetween(source, target) {
    return predicates.get().getEdgeBetween(source, target);
}

function mark(node) {
    // mark the node (getting an updated copy of the graph), then wait for a resume command
    let rule = predicates.update((graph) => {
        graph.mark(node);
    });
    postMessage({type: "rule", content: rule});
    wait();
}

function color(edge, color) {
    // color the edge (getting an updated copy of the graph), then wait for a resume command
    let rule = predicates.update((graph) => {
        graph.color(edge, color);
    });
    postMessage({type: "rule", content: rule});
    wait();
}

function unmark(node) {
    let rule = predicates.update((graph) => {
        graph.unmark(node);
    });
    postMessage({type: "rule", content: rule});
    wait();
}

function marked(node) {
    return predicates.get().marked(node);
}

function clearNodeMarks() {
    let rule = predicates.update((graph) => {
        graph.clearNodeMarks();
    });
    postMessage({type: "rule", content: rule});
    wait();
}

function print(message) {
    postMessage({type: "console", content: message});
}

function display(message) {
    let rule = predicates.update((graph) => {
        graph.display(message);
    });
    postMessage({type: "rule", content: rule});
    wait();
}

function prompt(message, error="") {
    postMessage({type: "prompt", content: [message, error]})
    wait();
    let len = Atomics.load(sharedArray, 1);
    let promptResult = "";
    for (let i = 0; i < len; i++) {
        promptResult += String.fromCharCode(Atomics.load(sharedArray, i + 2));
    }
    return promptResult;
}

function promptFrom(message, list, error) {
    if (list.length === 0) {
        throw new Error("Cannot prompt when no valid options exist.");
    }
    if (error == null) {
        error = "Must enter a value from " + list;
    }
    let promptResult = prompt(message);
    while (!list.includes(promptResult)) {
        promptResult = prompt(message, error);
    }
    return promptResult;
}

function promptBoolean(message) {
    return promptFrom(message, ["true", "false"], "Must enter a boolean value (true/false)") === "true";
}

function promptInteger(message) {
    let promptResult = parseInt(prompt(message));
    while (isNaN(promptResult)) {
        promptResult = parseInt(prompt(message, "Must enter an integer"));
    }
    return promptResult;
}

function promptNumber(message) {
    let promptResult = parseFloat(prompt(message));
    while (isNaN(promptResult)) {
        promptResult = parseFloat(prompt(message, "Must enter a number"));
    }
    return promptResult;
}

function promptNode(message) {
    let nodes = getNodes();
    if (nodes.length === 0) {
        throw new Error("Cannot prompt for a node when no valid nodes exist.");
    }
    return promptFrom(message, nodes, "Must enter a valid Node ID. The valid nodes are " + nodes);
}

function promptEdge(message) {
    let edges = getEdges();
    if (edges.length === 0) {
        throw new Error("Cannot prompt for an edge when no valid edges exist.");
    }
    return promptFrom(message, edges, "Must enter a valid Edge ID. The valid edges are " + edges);
}


function wait() {
    Atomics.store(sharedArray, 0, 0);
    Atomics.wait(sharedArray, 0, 0);
}

function disableAutoStep() {

}

function step() {

}
