import log from '../../shared/utils/logTailor';

export function loadScripts(urls) {
  if (!(urls instanceof Array)) throw('loadScripts : wrong arg type');
  return Promise.all(urls.map(url => loadScript.call(this, url)));
}  

// Stackoverflow
export function loadScript(source) {
  const scripts = document.getElementsByTagName('script');
  return new Promise((resolve, reject) => {
    if ([].slice.call(scripts).every(script => script.src !== source)) {
      log('... Loading ', source);
      const newElement    = document.createElement('script');
      const scriptElement = scripts[0];
      newElement.src    = source;
      newElement.onload = newElement.onreadystatechange = () => {
        if (!this.readyState || this.readyState === 'complete') resolve();
      };
      scriptElement.parentNode.insertBefore(newElement, scriptElement);
    } 
    else resolve();
  });
}