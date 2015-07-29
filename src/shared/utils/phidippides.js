import log      from './logTailor.js';

import actionCreators from '../actionCreators';

export default function phidippides(routerState, dispatch) {
  
  if (!routerState) return Promise.resolve();
  
  // Configuration
  const VERBOSE       = false;            // Affiche les log
  const PLACEHOLDER   = '__dependency.';  // Le placeholder pour les arguments des actions
  const METHOD_NAME   = 'runPhidippides'; // Le nom de la méthode des composants react
  const DEVELOPMENT   = process.env.NODE_ENV === 'production' ? false : true;
  
  let completedTasks  = []; // Les tâches terminée
  let failedTasks     = []; // Les tâches non terminées car il manque les dépendances
  let preventInfinite = 0;  // Compte le nombre de cycles pour empecher les boucles infinies (-_-)
  
  // Récupère les tâches
  const TASKS = routerState.branch
  // .filter(route    => route.component)
  .map   (route    => route.component[METHOD_NAME])  // Recherche de runPhidippides dans chaque handler
  .filter(method   => typeof method === 'function')  // Filtre si c'est une fonction
  .map   (method   => method(routerState)         )  // Appel de runPhidippides
  .filter(returned => returned instanceof Array   )  // Filtre si runPhidippides retourne un array(de tâches)
  .reduce((a, b)   => a.concat(b), []             )  // Réduction de l'array d'array de tâches en array de tâches
  .filter(task     => checkFormat(task)           ); // Évince les tâches hors format
  
  let nbTasks    = TASKS.length;
  let spkEnglish = nbTasks > 1 ? ' tasks : ' : ' task : ';
  if (nbTasks === 0) return Promise.resolve();
  log('*** Resolving ' + nbTasks + spkEnglish + TASKS.map(task => task.id));
  
  // Exécute les tâches
  return clearTasks(TASKS);
  

  // Log
  function logMeOrNot(...messages) {
    if (VERBOSE) log(...messages);
  }
  
  
  // Parcours completedTask pour déterminer si une dependance est terminée
  function checkDependency(dependency) {
    logMeOrNot('*** _ checkDependency named ' + dependency);
    if (!dependency) return true;
    for (let t of completedTasks) {
      if (t.task.id === dependency) return true;
    }
    return false;
  }
  
  
  // Complete toutes les tâches
  function clearTasks(tasks) {
    preventInfinite++;
    failedTasks = []; // RAZ des tâches irrésolues devenues tâches à accomplir
    return new Promise((resolve, reject) => {
      
      // Attend que toutes les tâches soient résolues
      Promise.all(tasks.map(task => clearOneTask(task))).then(
        () => {
          logMeOrNot('\n');
          logMeOrNot('*** * clearTasks ended * ');
          logMeOrNot('*** completed tasks : ' + completedTasks.map(task => task.task.id));
          logMeOrNot('*** failed tasks : ' + failedTasks.map(task => task.id));
          logMeOrNot('\n');
          
          // Si aucune tache n'a échoué c'est terminé
          if (!failedTasks.length) resolve();
            
          // Sinon on rappel les tâches échouées (possible boucle infinie ici)
          else { 
            if (preventInfinite > 10) throw('!!! Infinite loop detected');
            
            // Inception des promises 8)
            clearTasks(failedTasks).then(
              () => resolve(),
              error => reject(error));
          }
        },
        error => reject(error));
    });
  }
  
  
  // Complete une tâche
  function clearOneTask(task) {
    logMeOrNot('*** clearOneTask ' + task.id);
    return new Promise((resolve, reject) => {
      if(checkDependency(task.dependency)) {
        callActionCreator(task).then(
          data => {
            completedTasks.push({
              task: task,
              result: data
            });
            logMeOrNot('*** clearOneTask OK ' + task.id + ' [dependency ok -> fetch ok]');
            resolve();
          },
          error => reject(error)
        );
      } else {
        failedTasks.push(task);
        logMeOrNot('*** clearOneTask FAILED ' + task.id + ' [dependency failed]');
        resolve();
      }
    });
  }
  
  
  // Appel l'action associée à une task
  function callActionCreator(task) {
    
    logMeOrNot('*** _ callActionCreator ' + task.creator);
    
    const creator = actionCreators[task.creator];
    let realArgs = [], realArg;
    
    if (!creator || typeof creator !== 'function') return Promise.reject('callActionCreator creator ' + task.creator + ' does not exist.');

    // Traitement des arguments
    task.args.forEach(arg => {
      logMeOrNot('*** ___ processing arg ' + arg);
      realArg = arg;
      // Si un argument string possède PLACEHOLDER alors il faut le traiter
      if (typeof arg === 'string' && arg.search(PLACEHOLDER) !== -1) {
        logMeOrNot('*** ___ dependency found');
        // à commenter
        let dataTree = arg.replace(PLACEHOLDER, '').split('.'); // '__dependency.truc.machin.id' --> ['truc', 'machin', 'id']
        completedTasks.forEach(t => {
          if (t.task.id === task.dependency) {
            logMeOrNot('*** ___ dependency resolved');
            // Quand on l'a trouvée on recupère le résultat de la tache pour le passer en argument à l'action
            realArg = t.result;
            for (let i = 0, l = dataTree.length; i < l; i++) {
              realArg = realArg[dataTree[i]]; // ['truc', 'machin', 'id'] --> t.result[truc][machin][id]
            }
            logMeOrNot('*** ___ realArg is ' + realArg.toString().substring(0,9));
          }
        });
      }
      realArgs.push(realArg);
    });
    
    return new Promise((resolve, reject) => {
      // Appel de l'action creator et dispatch de l'action
      logMeOrNot('*** ___ calling with args ' + realArgs);
      const action = creator.apply(null, realArgs);
      dispatch(action);
      
      if (!action.promise) resolve(action.payload);
      else action.promise.then(
        data => {
          logMeOrNot('***  _ Dispatch for ' + task.id + ' resolved');
          logMeOrNot(JSON.stringify(data).substr(0,150));
          resolve(data);
        },
        error => reject(error));
    });
  }
  
  
  // Vérifie l'intégrité du markup des handlers
  function checkFormat(task) {
    if (DEVELOPMENT) {
      let whatIsWrong = '';
      
      if (task.hasOwnProperty('id')) {
        if (typeof task.id !== 'string') whatIsWrong += '\'id\' property should be a string\n';
      } 
      else whatIsWrong += 'task is missing \'id\' property\n';
      
      if (task.hasOwnProperty('creator')) {
        if (typeof task.creator !== 'string') whatIsWrong += '\'creator\' property should be a string\n';
      } 
      else whatIsWrong += 'task is missing \'creator\' property\n';
      
      if (task.hasOwnProperty('args')) {
        if (!(task.args instanceof Array)) whatIsWrong += '\'args\' property should be an array\n';
      } 
      else whatIsWrong += 'task is missing \'args\' property\n';
      
      if (task.hasOwnProperty('dependency') && typeof task.dependency !== 'string') whatIsWrong += '\'dependency\' property should be a string\n';
      
      if (whatIsWrong.length) {
        log('!!! Please check task format for task : ' + JSON.stringify(task), whatIsWrong);
        return false;
      }
    }
    return true;
  }
}
