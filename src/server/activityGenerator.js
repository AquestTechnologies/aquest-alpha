import log from '../shared/utils/logTailor';
import {randomInteger, randomString, randomText} from '../shared/utils/randomGenerators';
import { generateOnePseudo } from '../shared/utils/pseudosGenerator';
// import {} from '../../shared/utils/fetchers';
import queryDb from './queryDb';

// I can't succeed in using for..in loops in here... Babel ?
export default class Activist {
	
	constructor() {
		this.id = randomString(10);
		this.isStarted = false;
		this.counter = 0; // Counts the number of actions taken
		this.actionProbabilities = {}; // Will be constructed from this.probabilities
		this.probabilities = { // Reflects the chances to perform a given action
			'createMessage': {
				prob: 1,
				params: {
					userId: 'testme',
					chatId: '1', 
					content: {type: 'text', text: randomText(30)}
				}
			},
			// 'readUniverses': {
			// 	prob: 0.2
			// },
			// 'readUniverse': {
			// 	prob: 0.4,
			// 	params: 'Startups'
			// },
			// 'createTopic': {
			// 	// prob: 0.09,
			// 	prob: 0.1,
			// 	params: {
			// 		id: 'required',
			// 		userId: 'abeseven', 
			// 		universeId: 'Startups',
			// 		title: randomText(5),
			// 		description: randomText(10),
			// 		content: [{type:'text', text: randomText(20)}]
			// 	}
			// }
			// 'createVote': {
			// 	prob: 0.3,
			// 	data: {
					
			// 	}
			// },
			// 'createUser':  {
			// 	prob: 0.05,
			// 	data: {
					
			// 	}
			// },
			// 'createUniverse': {
			// 	prob: 0.03,
			// 	data: {
					
			// 	}
			// }
		};
	}
	
	// Starts the show at a given pace
	start(pace) {
		if(!this._initialize()) throw 'Initialization failed.';
		this.isStarted = true;
		const loopActivities = () => this._generateActivity().then(
			data => {
				log(data.id ? data.id : data);
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
			sum += probabilities[key].prob;
			actionProbabilities[key] = {
				name: key,
				prob: [lastValue, lastValue + probabilities[key].prob], 
				params: probabilities[key].params ? probabilities[key].params : false
			};
			lastValue += probabilities[key].prob;
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
			const action = _selectAction(actionProbabilities);
			console.log(`generateActivity ${id} ${counter} ${action.name}`);
			_fetchRandomRow(action).then(
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
			const array = actionProbabilities[key].prob;
			if (x >= array[0] && x < array[1]) action = actionProbabilities[key];
		});
		return action;
	}
	
	_fetchRandomRow(action) {
		
		let newAction = {
			name: action.name,
			params: {}
		};
		
		//deep copy of params and unique Id creation for insert that needs it
		Object.keys(action.params).forEach(param => {
			param === 'id' ? newAction.params.id = randomString(12) : newAction.params[param] = action.params[param];
		});
		
		return new Promise((resolve, reject) => {
			queryDb(newAction.name, newAction.params).then(
				data => {resolve(data)},
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
