import {randomInteger} from '../../shared/utils/randomGenerators';

export default function selectRandomItemIn(array) {
  
	return array[randomInteger(0, array.length - 1)];
}
