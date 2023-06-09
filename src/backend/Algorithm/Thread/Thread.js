/* eslint-disable no-unused-vars */
import Predicates from "backend/Graph/Predicates.js";
import Graph from "backend/Graph/Graph.js";

// The array has one purpose: telling the thread to run or wait with Atomics.wait().
// If sharedArray[0] is 0, that means the Thread should wait. Once it is changed, the Thread wakes up from Atoimics.notify() from the Handler.
let sharedArray;
//Instance of the graph that the thread will be working with
let predicates;
//Lets the user automatically stop algorithm execution when a change to the graph happens when enabled
//When set to false the user will have to manually stop the algorithm execution.
let autoStepEnabled = true;

// Waiting, stepping and automatically stepping
/**
 * This function uses Atomics to cause the algorithm to wait for user input before continuing
 */
function wait() {
    Atomics.store(sharedArray, 0, 0);
    Atomics.wait(sharedArray, 0, 0);
}

/**
 * This function has the ability to take in a chunk of users code that has been
 * made into a funcyion. This will disable the autostep functionality so that the
 * code will run all the way through without waiting/stepping. Once done it will
 * generate a message with all the users steps and wait.
 * 
 * If no function is passed in then it posts a message of a step occuring and then waits.
 * 
 * @param {*} code optional parameter of a function from a users algorithm
 */
function step(code=null) {
    let prevAutoStep = autoStepEnabled;

    disableAutoStep();
    if (code != null) {
        code();
    }

    postMessage({type: "step"});
    wait();

    autoStepEnabled = prevAutoStep;
}

/**
 * This method is at the end of every api method that changes the graph
 * and if the user has not disabled autostep then it will automatically
 * step once the method is called.
 */
function autoStep() {
    if (autoStepEnabled) {
        step();
    }
}

/*******************************  *************************************************
 * API Methods for user to use *  * See programmer documentation for method usage *
 *******************************  *************************************************/


function enableAutoStep() {
    autoStepEnabled = true;
}

function disableAutoStep() {
    autoStepEnabled = false;
}

// Send messages to the console

function print(message) {
    postMessage({type: "console", content: message});
}

function error(message) {
    throw new Error(message);
}

// Prompt the user for input

function prompt(message, error="") {
    if (message === null || message === "") {
        message = "Prompt";
    }
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
    if (error === null) {
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

function hideNode(node) {
    // hide the node (getting an updated copy of the graph), then wait for a resume command
    let rule = predicates.update((graph) => {
        graph.hideNode(node);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

function showNode(node) {
    // hide the node (getting an updated copy of the graph), then wait for a resume command
    let rule = predicates.update((graph) => {
        graph.showNode(node);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

function hideEdge(edge) {
    // hide the node (getting an updated copy of the graph), then wait for a resume command
    let rule = predicates.update((graph) => {
        graph.hideEdge(edge);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

function showEdge(edge) {
    // hide the node (getting an updated copy of the graph), then wait for a resume command
    let rule = predicates.update((graph) => {
        graph.showEdge(edge);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

function hideNodeWeight(node) {
    let rule = predicates.update((graph) => {
        graph.hideNodeWeight(node);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

function showNodeWeight(node) {
    let rule = predicates.update((graph) => {
        graph.showNodeWeight(node);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

function hideNodeLabel(node) {
    let rule = predicates.update((graph) => {
        graph.hideNodeLabel(node);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

function showNodeLabel(node) {
    let rule = predicates.update((graph) => {
        graph.showNodeLabel(node);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

function hideEdgeLabel(edge) {
    let rule = predicates.update((graph) => {
        graph.hideEdgeLabel(edge);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

function showEdgeLabel(edge) {
    let rule = predicates.update((graph) => {
        graph.showEdgeLabel(edge);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

function hideEdgeWeight(edge) {
    let rule = predicates.update((graph) => {
        graph.hideEdgeWeight(edge);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

function showEdgeWeight(edge) {
    let rule = predicates.update((graph) => {
        graph.showEdgeWeight(edge);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

function hideAllNodeWeights() {
    let rule = predicates.update((graph) => {
        graph.hideAllNodeWeights();
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

function showAllNodeWeights() {
    let rule = predicates.update((graph) => {
        graph.showAllNodeWeights();
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

function hideAllEdgeWeights() {
    let rule = predicates.update((graph) => {
        graph.hideAllEdgeWeights();
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

function showAllEdgeWeights() {
    let rule = predicates.update((graph) => {
        graph.showAllEdgeWeights();
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

// Automatic getter/setter generation functions

function generateGetter(fnName) {
    return (...args) => {
        let graph = predicates.get();
        return graph[fnName].apply(graph, args);
    }
}

function generateSetter(fnName) {
    return (...args) => {
        let rule = predicates.update((graph) => {
            let method = graph[fnName]
            graph[fnName].apply(graph, args);
        });
        postMessage({type: "rule", content: rule});
        autoStep();
    }
}

// List getters
const getNodes = generateGetter("getNodes");
const getEdges = generateGetter("getEdges");
const getNumberOfNodes = generateGetter("getNumberOfNodes");
const getNumberOfEdges = generateGetter("getNumberOfEdges");

// Source/target
const source = generateGetter("source");
const target = generateGetter("target");
const getEdgesBetween = generateGetter("getEdgesBetween");
const getEdgeBetween = generateGetter("getEdgeBetween");
const other = generateGetter("other");

// Adjacencies
const incident = generateGetter("incident");
const incoming = generateGetter("incoming");
const outgoing = generateGetter("outgoing");
const adjacentNodes = generateGetter("adjacentNodes");
const incomingNodes = generateGetter("incomingNodes");
const outgoingNodes = generateGetter("outgoingNodes");

// Marks
const mark = generateSetter("mark");
const unmark = generateSetter("unmark");
const marked = generateGetter("marked");
const clearNodeMarks = generateSetter("clearNodeMarks");

// Highlights
const highlight = generateSetter("highlight");
const unhighlight = generateSetter("unhighlight");
const highlighted = generateGetter("highlighted");
const clearNodeHighlights = generateSetter("clearNodeHighlights");
const clearEdgeHighlights = generateSetter("clearEdgeHighlights");

// Colors
const color = generateSetter("color");
const uncolor = generateSetter("uncolor");
const getColor = generateGetter("getColor");
const hasColor = generateGetter("hasColor");
const clearNodeColors = generateSetter("clearNodeColors");
const clearEdgeColors = generateSetter("clearEdgeColors");

// Labels
const label = generateSetter("label");
const unlabel = generateSetter("unlabel");
const getLabel = generateGetter("getLabel");
const hasLabel = generateGetter("hasLabel");
const clearNodeLabels = generateSetter("clearNodeLabels");
const clearEdgeLabels = generateSetter("clearEdgeLabels");

// Weights
const setWeight = generateSetter("setWeight");
const clearWeight = generateSetter("clearWeight");
const weight = generateGetter("weight");
const hasWeight = generateGetter("hasWeight");
const clearNodeWeights = generateSetter("clearNodeWeights");
const clearEdgeWeights = generateSetter("clearEdgeWeights");

// Display
const display = generateSetter("display");

/** Just a little easter egg :) */
function fireworks() {
    postMessage({type: "fireworks", content: "boom. explosion sound effects."})
}

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


