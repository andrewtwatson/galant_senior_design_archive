import StepHandler from "./StepHandler";
import Predicates from "backend/Graph/Predicates";
import ThreadHandler from "./Thread/ThreadHandlerDemo";
import {produce} from 'immer';

export default class AlgorithmHandler {

    constructor(graph, algorithm, updateGraph, onMessage, onStatusChanged) {
        this.graph = graph;
        this.algorithm = algorithm;
        this.updateGraph = updateGraph;
        this.onMessage = onMessage;
        this.onStatusChanged = onStatusChanged;

        this.#initAlgorithm();
    }
    
    #initAlgorithm() {
        let predicates = new Predicates(produce(this.graph, draft => {}));
        this.threadHandler = new ThreadHandler(predicates, this.algorithm, (message) => this.#onMessage(message));
        this.stepHandler = new StepHandler(this.updateGraph, () => this.threadHandler.resumeThread());
        this.threadHandler.startThread();
        
        this.onStatusChanged(this.stepHandler.getStatus());
    }

    #onMessage(message) {
        if (message.type == "rule") {
            this.stepHandler.ruleStep(message.content);
            this.#broadcastStatus();
        } else if (this.onMessage != null) { // console messages
            this.onMessage(message.content);
        }
    }

    #broadcastStatus() {
        if (this.onStatusChanged != null) {
            this.onStatusChanged(this.stepHandler.getStatus());
        }
    }

    setGraph(graph) {
        this.threadHandler.killThread();
        this.graph = graph;
        this.#initAlgorithm();
    }

    setAlgorithm(algorithm) {
        this.stepHandler.revertAll();
        this.threadHandler.killThread();
        this.algorithm = algorithm;
        this.#initAlgorithm();
    }

    stepForward() {
        this.stepHandler.stepForward();
        this.#broadcastStatus();
    }

    stepBack() {
        this.stepHandler.stepBack();
        this.#broadcastStatus();
    }


}