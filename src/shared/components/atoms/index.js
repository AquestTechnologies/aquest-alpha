// An atom is a single piece of formated information (a text, a picture, ...)
// It can be created (in CreateTopic or ChatFooter)
// ... viewed (in Topic, or Message)
// ... previewed (in Inventory/Card)
// ... or validated (tdb)

// Augustin: j'ai trouvé un mec qui a reduit à 29kB la taille de Joi pour le client (sinon c'est 126kB)
// https://github.com/hapijs/joi/issues/528
// Ne vaudrait-il pas mieux utiliser une librairie plus petite et faire toutes les validations en isomorphique ?

const atomPlugins = [
  require('./textAtom'),
  require('./imageAtom'),
];

const atomViewers = {}; 
const atomCreators = {};
const atomPreviewers = {};
const atomContentValidators = {};

atomPlugins.forEach(({name, contentValidator, Creator, Viewer, Previewer}) => {
  atomViewers[name] = Viewer;
  atomCreators[name] = Creator;
  atomPreviewers[name] = Previewer;
  atomContentValidators[name] = contentValidator;
});

export function getAtomCreators(universe) {
  
  // On peut imaginer un champ de la bdd universe.availableAtoms='text;image;tablature' ou une table universe_atoms
  // Pour dire quel univers a le droit à quels atomes
  // on génère la liste de ReactClass associée dynamiquement...
  // mais pour l'instant c'est assez rudimentaire :
  
  return atomCreators;
}

export function getAtomViewers(universe) {
  
  return atomViewers;
}

export function getAtomPreviewers(universe) {
  
  return atomPreviewers;
}

export function getAtomContentValidators(universe) {
  
  return atomContentValidators;
}
