import log from '../../shared/utils/logTailor';
import {randomInteger, randomString, randomText} from '../../shared/utils/randomGenerator';
import {generateOnePseudo} from '../../shared/utils/pseudosGenerator';
// import {} from '../../shared/utils/fetchers';

// I can't succeed in using for..in loops in here... Babel ?
export default class Activist {
	
	constructor() {
		this.id = randomString(10);
		this.counter = 0; // Counts the number of actions taken
		this.probabilities = { // Reflects the chances to perform a given action
			'createMessage': 0.53,
			'createVote': 0.3,
			'createTopic': 0.09,
			'createUser': 0.05,
			'createUniverse': 0.03
		};
		this.actionProbabilities = {}; // Will be constructed from this.probabilities
	}
	
	initialize() {
		const {probabilities, actionProbabilities} = this;
		
		// Check if sum of probabilities === 1
		let sum = 0;
		const keys = Object.keys(probabilities);
		keys.forEach(key => sum += probabilities[key]);
		if (sum !== 1) return false;
		
		// actionProbabilities construction
		let lastValue = 0;
		keys.forEach(key => {
			actionProbabilities[key] = [lastValue, lastValue + probabilities[key]];
			lastValue += probabilities[key];
		});
		
		return true;
	}
	
	// Starts the show at a given pace
	start(pace) {
		if(!this.initialize()) throw 'Check failed.';
		this.timer = setInterval(this.generateActivity.bind(this), pace);
	}
	
	// Stops the activity
	stop() {
		const {timer} = this;
		if (timer) clearInterval(timer);
	}
	
	// The main loop
	generateActivity() {
		this.counter++;
		const {id, selectAction, actionProbabilities, counter} = this;
		console.log(`generateActivity ${id} ${counter} ${selectAction(actionProbabilities)}`);
	}
	
	// Returns a random action 
	selectAction(actionProbabilities) {
		const x = Math.random();
		const keys = Object.keys(actionProbabilities);
		let action;
		keys.forEach(key => {
			const array = actionProbabilities[key];
			if (x >= array[0] && x < array[1]) action = key;
		});
		return action;
	}
	
}

// Creates a bunch of activists
export function createActivists(n, minPace, maxPace) {
	
	let activists = [];
	let paces = [];
	
	for (let i = 0; i < n; i++) {
		activists.push(new Activist());
		paces.push(randomInteger(minPace, maxPace));
	}
	
	function startActivists() {
		for (let i = 0; i < n; i++) {
			activists[i].start(paces[i]);
		}
	}
	
	function stopActivists() {
		for (let i = 0; i < n; i++) {
			activists[i].stop();
		}
	}
	
	return {startActivists, stopActivists};
}
