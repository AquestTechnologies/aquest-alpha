import log      from '../utils/logTailor.js';
import isClient from '../utils/isClient.js';

import * as universeActions from '../actions/universeActions';
import * as chatActions     from '../actions/chatActions';
import * as topicActions    from '../actions/topicActions';

export default function phidippides(routerState, fluxState, dispatch) {
  
  // Configuration
  const VERBOSE = false;                // Affiche les log
  const DEVELOPMENT = true;             // Permet de ne pas appeller checkFormat en production !!! A remplacer par une constante de projet !!!
  const PLACEHOLDER = '__dependency.';  // Le placeholder pour les arguments des actions
  const METHOD_NAME = 'runPhidippides'; // Le nom de la méthode des composants react
  const ACTION_CREATORS = {
    universeActions: universeActions,
    chatActions: chatActions,
    topicActions: topicActions
  };
  
  let whatToFetch       = []; // Les taches à effectuer
  let completedTasks    = []; // Les taches terminée
  let failedTasks       = []; // Les taches non terminées car il manque les dépendances
  let displayOnConsole  = []; // Permet d'afficher les taches à effectuer sur la console
  let preventInfinite   = 0;  // Compte le nombre de cycles pour empecher les boucles infinies
  
  // Appel de runPhidippides dans chaque handler
  let runPhidippides = routerState.routes
  .map(route => route.handler[METHOD_NAME])
  .filter(method => typeof method === 'function')
  .map(method => method(routerState))
  .filter(handlerReturn => handlerReturn instanceof Array);
  
  // Extraction des taches vers whatToFetch
  runPhidippides.forEach(function(handlerReturn) {
    handlerReturn.forEach(function(somethingToFetch) {
      whatToFetch.push(somethingToFetch);
      displayOnConsole.push(somethingToFetch.shouldBePresent);
    });
  });
  
  let howMany = whatToFetch.length;
  let speakEnglish = howMany > 1 ? ' tasks : ' : ' task : ';
  log('*** Resolving ' + howMany + speakEnglish + displayOnConsole.toString());
  
  if (howMany === 0) return Promise.resolve();
  if (DEVELOPMENT && !checkFormat(whatToFetch)) return Promise.reject('*** ERROR ! invalid markup found.');
  
  return clearTasks(whatToFetch);
  

  function logMeOrNot(type, message) {
    if (VERBOSE === true) log(type, message);
  }
  
  
  // Vérifie l'intégrité du markup des handlers
  function checkFormat(tasks) {
    tasks.forEach(function(task) {
      let whatIsWrong     = '';
      let on              = task.hasOwnProperty('on');
      let ifNot           = task.hasOwnProperty('ifNot');
      let shouldBePresent = task.hasOwnProperty('shouldBePresent');
      
      if (on) {
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
      
      if (ifNot) {
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
      
      if (shouldBePresent) {
        let data = task.shouldBePresent;
        if (typeof data !== 'string' || data.replace('.', '') === data) whatIsWrong += '\'shouldBePresent\' property should be a string \'store.state\'\n';
      }
      else {
        whatIsWrong += 'task is missing \'shouldBePresent\' property\n';
      }
      
      if (task.hasOwnProperty('dependency') && typeof task.dependency !== 'string') whatIsWrong += '\'dependency\' property should be a string\n';
      
      if (whatIsWrong.length > 0) {
        log('error', '*** ERROR ! Please check task format for task : ' + JSON.stringify(task));
        log('error', whatIsWrong);
        return false;
      }
    });
    return true;
  }
  
  // Retourne l'élément du state correspondant à dataString
  function getValue(dataString) {
    let raw = dataString.split('.');
    let result = fluxState;
    for (let i = 0, l = raw.length; i < l; i++) {
      result = result[raw[i]];
    }
    return result;
  }
  
  
  // Vérifie la présence d'une donnée dans le state
  function checkPresence(dataString) {
    let whatToCheck = getValue(dataString);
    logMeOrNot('*** checkPresence whatToCheck is ' + JSON.stringify(whatToCheck));
    if (whatToCheck instanceof Array && whatToCheck.length === 0) return false;
    if (whatToCheck instanceof Object && Object.keys(whatToCheck).length === 0) return false;
    return whatToCheck !== undefined ? true : false;
  }


  // Vérifie que data ('store.data') possède la valeur demandée
  function checkValue(dataString, shouldHaveValue) {
    let whatToCheck = getValue(dataString);
    logMeOrNot('*** checkValue of ' + dataString + '=' + JSON.stringify(whatToCheck) + ' should contain ' + JSON.stringify(shouldHaveValue));
    // Si shouldHaveValue est un object on vérifie que whatToCheck est identique
    if (shouldHaveValue instanceof Object) {
      for (let key in shouldHaveValue) {
        if (whatToCheck[key] === undefined || whatToCheck[key] !== shouldHaveValue[key]) return false;
      }
    }
    // Sinon shouldHaveValue n'est pas un objet et on vérifie qu'il soit identique à shouldHaveValue
    else {
      if (whatToCheck !== shouldHaveValue) return false;
    }
    return true;
  }
  
  
  // Parcours completedTask pour déterminer si une dependance est terminée
  function checkDependency(dependency) {
    if (dependency === undefined) return true;
    let result = false;
    completedTasks.forEach(function(completedTask) {
      if (completedTask.task.shouldBePresent === dependency) result = true;
    });
    return result;
  }
  
  
  // Détermine si l'action doit être executée en fonction de l'environnement et de task.on
  function checkEnvironment(taskOn) {
    let env = isClient() ? 'client' : 'server';
    for (let i = 0, l = taskOn.length; i < l; i++) {
      if (taskOn[i] === env) return true;
    }
    return false;
  }
  
  
  // Complete toutes les taches
  function clearTasks(tasks) {
    preventInfinite++;
    failedTasks = [];
    return new Promise(function(resolve, reject) {
      // Peuple la liste des taches (promises) à accomplir
      let clearUs = [];
      tasks.forEach(function(task) {
        if (checkEnvironment(task.on)) clearUs.push(clearOneTask(task));
      });
      // Attend que toutes les taches soient résolues
      Promise.all(clearUs).then(function() {
        logMeOrNot('*** clearTasks ended');
        logMeOrNot('*** failedTasks :');
        logMeOrNot(failedTasks);
        logMeOrNot('*** completedTasks');
        logMeOrNot(completedTasks);
        if (failedTasks.length === 0) { // Si aucune tache n'a échoué c'est terminé
          resolve();
        }
        else { // Sinon on rappel les taches échouées (possible boucle infinie ici)
          if (preventInfinite > 10) throw('Infinite loop detected');
          clearTasks(failedTasks).then(function() {
            resolve();
          }).catch(function(why) {
            log('error', '*** ERROR ! clearTasks failed 2');
            reject(why);
          });
        }
      }).catch(function(why) {
        log('error', '*** ERROR ! clearTasks failed 1');
        reject(why);
      });
    });
  }
  
  
  // Complete une tache
  function clearOneTask(task) {
    logMeOrNot('*** clearOneTask ' + JSON.stringify(task));
  
    return new Promise(function(resolve, reject) {
  
      if (checkPresence(task.shouldBePresent)) { // Si la donnée est présente
        if (!task.hasOwnProperty('shouldHaveValue') || checkValue(task.shouldBePresent, task.shouldHaveValue)) { // Si la donnée possède la bonne valeure
          logMeOrNot('*** clearOneTask ' + task.shouldBePresent + ' OK [present > correct value]');
          completedTasks.push({
            task: task,
            result: null
          });
          resolve();
        }
        else { // Si la donnée ne possède pas la bonne valeure
          if (!task.hasOwnProperty('dependency') || checkDependency(task.dependency)) { // Si la dépendances est résolue
            callActionCreator(task).then(function(data) {
              completedTasks.push({
                task: task,
                result: data
              });
              logMeOrNot('*** clearOneTask ' + task.shouldBePresent + ' OK [present > wrong value > dependency complete]');
              resolve();
            }).catch(function(why) {
              log('error', '*** ERROR ! clearOneTask [present > wrong value > dependency complete]');
              reject(why);
            });
          }
          else { // Si la dépendance n'est pas résolue
            failedTasks.push(task);
            logMeOrNot('*** clearOneTask ' + task.shouldBePresent + ' FAILED [present > wrong value > dependency failed]');
            resolve();
          }
        }
      }
      else { // Si la donnée est absente
        if (checkDependency(task.dependency)) { // Si la dépendances est résolue
          callActionCreator(task).then(function(data) {
            completedTasks.push({
              task: task,
              result: data
            });
            logMeOrNot('*** clearOneTask ' + task.shouldBePresent + ' OK [missing > dependency complete]');
            resolve();
          }).catch(function(why) {
            log('error', '*** ERROR ! clearOneTask [missing > dependency complete]');
            reject(why);
          });
        }
        else { // Si la dépendance n'est pas résolue
          failedTasks.push(task);
          logMeOrNot('*** clearOneTask ' + task.shouldBePresent + ' FAILED [missing > dependency failed]');
          resolve();
        }
      }
    });
  }
  
  
  // Appel l'action associée à une task
  function callActionCreator(task) {
    
    let ifNot = task.ifNot;
    let raw = ifNot[0].split('.'); //'module.creator' -> ['module', 'creator']
    let creator;
    logMeOrNot('*** callActionCreator ' + ifNot[0] + ' ' + ifNot[1]);
    
    try { // Je ne sais pas si try catch est une bonne façon de faire ça
      creator = ACTION_CREATORS[raw[0]][raw[1]]; //ACTION_CREATORS[module][creator]
    }
    catch(err) {
      log('error', '*** ERROR ! callActionCreator ' + raw[0] + '.' + raw[1] + ' does not exist');
      log('error', err);
    }
    
    let args     = ifNot[1];
    let realArgs = [];
    
    // Traitement des arguments
    args.forEach(function(arg) {
      logMeOrNot('*** callActionCreator processing arg ' + arg);
      // Si un argument ne possède pas PLACEHOLDER alors il est assimilable tel quel
      if (typeof arg !== 'string' || arg.search(PLACEHOLDER) === -1) {
        realArgs.push(arg);
      }
      else { // Sinon il faut le traiter
        logMeOrNot('*** callActionCreator \'' + PLACEHOLDER + '\' found in arg ' + arg);
        // On ne garde que la partie sans PLACEHOLDER
        let attributeString = arg.replace(PLACEHOLDER, '');
        // Puis l'argument est potentiellement nesté (exemple : truc.machin.chose.id) 
        // Donc pour chaque niveau de nesting on extrait l'info utile avec la boucle A
        let attributes = attributeString.split('.');
        let realArg;
        // On compare cherche parmis les taches complétées la dependance de la tache actuelle
        completedTasks.forEach(function(completedTask) {
          if (completedTask.task.shouldBePresent === task.dependency) {
            // Quand on l'a trouvée on recupère le résultat de la tache pour le passer en argument à l'action
            realArg = completedTask.result;
            // Boucle A
            for (let i = 0, l = attributes.length; i < l; i++) {
              realArg = realArg[attributes[i]];
            }
          }
        });
        logMeOrNot('*** callActionCreator realArg is ' + realArg);
        realArgs.push(realArg);
      }
    });
    logMeOrNot('*** callActionCreator args processing complete, real args are ' + realArgs);
    return new Promise(function(resolve, reject) {
      // Appel de l'action creator
      dispatch(creator.apply(null, realArgs)).then(function(data) {
        logMeOrNot('*** callActionCreator dispatch resolved :');
        logMeOrNot('*** ' + data);
        resolve(data.result);
      }).catch(function(why) {
        log('error', '*** callActionCreator dispatch failed');
        reject(why);
      });
    });
  }
  
}
