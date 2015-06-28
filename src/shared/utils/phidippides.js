import log      from './logTailor.js';
import isClient from './isClient.js';

import * as universeActions from '../actions/universeActions';
import * as chatActions     from '../actions/chatActions';
import * as topicActions    from '../actions/topicActions';

export default function phidippides(routerState, fluxState, dispatch) {
  
  // Qui d'autre que phidippides peut dedecter les 404 ? 
  // Exemple :'/_aefzgrjeflkvn' fait actuelement un fetch
  
  // Phidippides doit-il considérer un 404 si le fetch à échouer et rediriger ?
  
  // Configuration
  const VERBOSE         = false;            // Affiche les log
  const DEVELOPMENT     = true;             // Permet de ne pas appeller checkFormat en production !!! A remplacer par une constante de projet ? !!!
  const PLACEHOLDER     = '__dependency.';  // Le placeholder pour les arguments des actions
  const METHOD_NAME     = 'runPhidippides'; // Le nom de la méthode des composants react
  const STATE           = fluxState;        // Immutabilité ?
  const ENVIRONMENT     = isClient() ? 'client' : 'server';
  const ACTION_CREATORS = {                 // Si la 1.0 de Redux propose une méthode alternative alors MAJ
    universeActions: universeActions,
    chatActions: chatActions,
    topicActions: topicActions
  };
  
  let completedTasks    = []; // Les tâches terminée
  let failedTasks       = []; // Les tâches non terminées car il manque les dépendances
  let preventInfinite   = 0;  // Compte le nombre de cycles pour empecher les boucles infinies (-_-)
  
  // Récupère les tâches
  const TASKS = routerState.routes
  .map    ( route    => route.handler[METHOD_NAME]   )  // Recherche de runPhidippides dans chaque handler
  .filter ( method   => typeof method === 'function' )  // Filtre si c'est une fonction
  .map    ( method   => method(routerState)          )  // Appel de runPhidippides
  .filter ( returned => returned instanceof Array    )  // Filtre si runPhidippides retourne un array (de tâches)
  .reduce ( (a, b)   => a.concat(b)                  )  // Réduction de l'array d'array de tâches en array de tâches
  .filter ( task     => checkFormat(task)            )  // Évince les tâches hors format
  .filter ( task     => checkEnvironment(task.on)    ); // Évince les tâches ne devant pas tourner côté client/server
  
  let nbTasks      = TASKS.length;
  let spkEnglish   = nbTasks > 1 ? ' tasks : ' : ' task : ';
  if (nbTasks === 0) return Promise.resolve();
  log('*** Resolving ' + nbTasks + spkEnglish + TASKS.map(task => task.shouldBePresent));
  
  // Exécute les tâches
  return clearTasks(TASKS);
  
  // ___Fonctions___
  
  
  // Log
  function logMeOrNot(type, ...messages) {
    if (VERBOSE === true) log(type, ...messages);
  }
  
  
  // Parcours completedTask pour déterminer si une dependance est terminée
  function checkDependency(dependency) {
    logMeOrNot('*** checkDependency named ' + dependency);
    if (dependency === undefined) return true;
    for (let t of completedTasks) {
      if (t.task.shouldBePresent === dependency) return true;
    }
    return false;
  }
  
  
  // Détermine si l'action doit être executée en fonction de l'environnement et de task.on
  function checkEnvironment(taskOn) {
    for (let item of taskOn) {
      if (item === ENVIRONMENT) return true;
    }
    return false;
  }
  
  // Vérifie la présence et la valeure de la donnée derrière dataString
  // à commenter
  function checkData(dataString, shouldHaveValue) {
    let x = dataString.split('.');
    let data = STATE;
    for (let i in x) data = data[x[i]];
    logMeOrNot('*** checkData of ' + dataString + ' --> ' + JSON.stringify(data) + ' should contain ' + JSON.stringify(shouldHaveValue));
    
    // Évince undefined, null, [], {}, ''
    if (typeof data !== typeof shouldHaveValue)                       return false;
    if (data instanceof Array && !(shouldHaveValue instanceof Array)) return false;
    if (data === undefined || data === null || data === '')         return false;
    // Si shouldHaveValue est un object on vérifie que data est identique
    if (data instanceof Object) {
      if (data instanceof Array) {
        if (data.length === 0) return false;
        log('error', '!!! Code non vérifié !');
        for (let key of shouldHaveValue) {
          if (data[key] !== shouldHaveValue[key]) return false;
        }
      }
      else {
        if (Object.keys(data).length === 0) return false;
        for (let key in shouldHaveValue) {
          if (data[key] !== shouldHaveValue[key]) return false;
        }
      }
    }
    else if (data !== shouldHaveValue) {
      return false;
    }
    return true;
  }
  
  // Complete toutes les tâches
  function clearTasks(tasks) {
    preventInfinite++;
    failedTasks = []; // RAZ des tâches irrésolues devenues tâches à accomplir
    return new Promise(function(resolve, reject) {
      // Attend que toutes les tâches soient résolues
      Promise.all(tasks.map(task => clearOneTask(task))).then(function() {
      
        logMeOrNot('*** ___ clearTasks ended ___');
        logMeOrNot('*** completed tasks : ' + completedTasks.map(task => task.task.shouldBePresent));
        logMeOrNot('*** failed tasks : ' + failedTasks.map(task => task.shouldBePresent));
        logMeOrNot('*** ___');
        // Si aucune tache n'a échoué c'est terminé
        if (failedTasks.length === 0) {
          resolve();
        }
        // Sinon on rappel les tâches échouées (possible boucle infinie ici)
        else { 
          if (preventInfinite > 10) throw('Infinite loop detected');
          // Inception des promises 8)
          clearTasks(failedTasks).then(function() {
            resolve();
          }).catch(function(why) {
            log('error', '*** ERROR ! clearTasks failed after some failled tasks');
            reject(why);
          });
        }
      }).catch(function(why) {
        log('error', '*** ERROR ! clearTasks failed 1');
        reject(why);
      });
    });
  }
  
  
  // Complete une tâche
  function clearOneTask(task) {
    logMeOrNot('*** clearOneTask ' + task.shouldBePresent);
    return new Promise(function(resolve, reject) {
      
      // [dependency ok]
      if(checkDependency(task.dependency)) {
        // [dependency ok -> data ok]
        if (checkData(task.shouldBePresent, task.shouldHaveValue)) {
          logMeOrNot('*** clearOneTask OK ' + task.shouldBePresent + ' [dependency ok -> data ok]');
          completedTasks.push({
            task: task,
            result: null
          });
          resolve();
        } 
        // [dependency ok -> data failed]
        else {
          callActionCreator(task).then(function(data) {
            completedTasks.push({
              task: task,
              result: data
            });
            logMeOrNot('*** clearOneTask OK ' + task.shouldBePresent + ' [dependency ok -> data failed -> fetch ok]');
            resolve();
          }).catch(function(why) {
            log('error', '*** clearOneTask FAILED ' + task.shouldBePresent + ' [dependency ok -> data failed -> fetch failed]');
            reject(why);
          });
        }
      } 
      // [dependency failed]
      else {
        failedTasks.push(task);
        logMeOrNot('*** clearOneTask FAILED ' + task.shouldBePresent + ' [dependency failed]');
        resolve();
      }
    });
  }
  
  
  // Appel l'action associée à une task
  function callActionCreator(task) {
    
    const ifNot  = task.ifNot;
    const callMe = ifNot[0].split('.'); //'module.creator' -> ['module', 'creator']
    let creator, realArgs = [], realArg;
    
    logMeOrNot('*** callActionCreator ' + ifNot[0] + ' ' + ifNot[1]);
    
    try { // Je ne sais pas si try catch est une bonne façon de faire ça
      creator = ACTION_CREATORS[callMe[0]][callMe[1]]; //ACTION_CREATORS[module][creator]
    }
    catch(err) {
      log('error', '*** ERROR ! callActionCreator ' + callMe[0] + '.' + callMe[1] + ' does not exist', err);
    }

    // Traitement des arguments
    ifNot[1].forEach(function(arg) {
      logMeOrNot('*** callActionCreator processing arg ' + arg);
      realArg = arg;
      // Si un argument string possède PLACEHOLDER alors il faut le traiter
      if (typeof arg === 'string' && arg.search(PLACEHOLDER) !== -1) {
        logMeOrNot('*** callActionCreator \'' + PLACEHOLDER + '\' found in arg ' + arg);
        // à commenter
        let dataTree = arg.replace(PLACEHOLDER, '').split('.');
        completedTasks.forEach(function(completedTask) {
          if (completedTask.task.shouldBePresent === task.dependency) {
            // Quand on l'a trouvée on recupère le résultat de la tache pour le passer en argument à l'action
            realArg = completedTask.result;
            for (let i = 0, l = dataTree.length; i < l; i++) {
              realArg = realArg[dataTree[i]];
            }
          }
        });
      }
      realArgs.push(realArg);
      logMeOrNot('*** callActionCreator realArg is ' + realArg);
    });
    
    return new Promise(function(resolve, reject) {
      // Appel de l'action creator et dispatch de l'action
      logMeOrNot('*** callActionCreator calling with args ' + realArgs);
      dispatch(creator.apply(null, realArgs)).then(function(data) {
        logMeOrNot('*** callActionCreator dispatch resolved');
        resolve(data.result);
      }).catch(function(why) {
        log('error', '*** callActionCreator dispatch failed');
        reject(why);
      });
    });
  }
  
  
  // Vérifie l'intégrité du markup des handlers
  // Peut mieux faire... ^^
  function checkFormat(task) {
    if (DEVELOPMENT) {    // Absolument inutile, il faut plutot exporter checkFormat pour épargner le client
      let whatIsWrong     = '';
      
      if (task.hasOwnProperty('on')) {
        if (task.on instanceof Array) {
          task.on.forEach(function(item) {
            if (item !== 'client' && item !== 'server') whatIsWrong += 'Incorrect \'on\' property on item ' + item + '\n';
          });
        }
        else {
          whatIsWrong += '\'on\' property should be an array\n';
        }
      }
      else {
        whatIsWrong += 'Task is missing \'on\' property\n';
      }
      
      if (task.hasOwnProperty('ifNot')) {
        if (task.ifNot instanceof Array) {
          if (task.ifNot.length === 2) {
            let action = task.ifNot[0];
            if (!(task.ifNot[1] instanceof Array)) whatIsWrong += 'ifNot[1] should be an array of args\n';
            if (typeof action !== 'string' || action.replace('.', '') === action) whatIsWrong += 'ifNot[0] should be a string \'actionmodule.actioncreator\'\n';
          }
          else {
            whatIsWrong += 'ifNot.length should be 2\n';
          }
        }
        else {
          whatIsWrong += '\'ifNot\' property should be an array\n';
        }
      }
      else {
        whatIsWrong += 'task is missing \'ifNot\' property\n';
      }
      
      if (task.hasOwnProperty('shouldBePresent')) {
        let data = task.shouldBePresent;
        if (typeof data !== 'string' || data.replace('.', '') === data) whatIsWrong += '\'shouldBePresent\' property should be a string \'store.state\'\n';
      }
      else {
        whatIsWrong += 'task is missing \'shouldBePresent\' property\n';
      }
      
      if (task.hasOwnProperty('dependency') && typeof task.dependency !== 'string') whatIsWrong += '\'dependency\' property should be a string\n';
      
      if (whatIsWrong.length > 0) {
        log('error', '*** ERROR ! Please check task format for task : ' + JSON.stringify(task), whatIsWrong);
        return false;
      }
      return true;
    }
    else {
      return true;
    }
  }
  
}
