import log from '../../shared/utils/logTailor';
import {randomInteger, randomString, randomText} from '../../shared/utils/randomGenerators';
import {generateOnePseudo} from '../../shared/utils/pseudosGenerator';
// import {} from '../../shared/utils/fetchers';
import queryDb from '../queryDb';

// I can't succeed in using for..in loops in here... Babel ?
export default class Activist {
	
	constructor() {
		this.id = randomString(10);
		this.isStarted = false;
		this.counter = 0; // Counts the number of actions taken
		this.actionProbabilities = {}; // Will be constructed from this.probabilities
		this.probabilities = { // Reflects the chances to perform a given action
			'createMessage': 0.53,
			'createVote': 0.3,
			'createTopic': 0.09,
			'createUser': 0.05,
			'createUniverse': 0.03
		};
	}
	
	// Starts the show at a given pace
	start(pace) {
		if(!this._initialize()) throw 'Initialization failed.';
		this.isStarted = true;
		const loopActivities = () => this._generateActivity().then(
			data => {
				console.log(data.id);
				if (this.isStarted) setTimeout(loopActivities, pace);
			},
			error => log(error)
		);
		loopActivities();
	}
	
	// Stops the activity
	stop() {
		this.isStarted = false;
	}
	
	_initialize() {
		const {probabilities, actionProbabilities} = this;
		let sum = 0;
		let lastValue = 0;
		
		// actionProbabilities construction
		Object.keys(probabilities).forEach(key => {
			sum += probabilities[key];
			actionProbabilities[key] = [lastValue, lastValue + probabilities[key]];
			lastValue += probabilities[key];
		});
		
		// Checks if sum of probabilities === 1
		// if (sum !== 1) return false;
		// return true;
		return sum === 1;
	}
	
	// The main loop
	_generateActivity() {
		this.counter++;
		const {id, _selectAction, _fetchRandomRow, actionProbabilities, counter} = this;
		
		return new Promise((resolve, reject) => {
			console.log(`generateActivity ${id} ${counter} ${_selectAction(actionProbabilities)}`);
			_fetchRandomRow('universe').then(
				data => resolve(data),
				error => reject(error)
			);
		});
	}
	
	// Returns a random action 
	_selectAction(actionProbabilities) {
		const x = Math.random();
		let action;
		Object.keys(actionProbabilities).forEach(key => {
			const array = actionProbabilities[key];
			if (x >= array[0] && x < array[1]) action = key;
		});
		return action;
	}
	
	_fetchRandomRow(table) {
		const query = {
			source: 'randomRow',
			params: table
		};
		return new Promise((resolve, reject) => {
			queryDb(query).then(
				data => resolve(data),
				error => reject(error)
			);
		});
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
