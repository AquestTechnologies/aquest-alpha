import {TextAtom, CreateTextAtom} from './TextAtom';
import {CreateImageAtom} from './ImageAtom';

const atomCreators = {
  text: CreateTextAtom,
  image: CreateImageAtom,
};

const atoms = {
  text: TextAtom,
};

export function getAtomCreators(universe) {
  
  // On peut imaginer un champ de la bdd universe.availableAtoms='text;image;tablature' ou une table universe_atoms
  // Pour dire quel univers a le droit à quels atomes
  // on génère la liste de ReactClass associée dynamiquement...
  // mais pour l'instant c'est assez rudimentaire :
  
  return atomCreators;
}

export function getAtoms(universe) {
  
  return atoms;
}