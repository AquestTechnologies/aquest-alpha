export function uploadFile(params, fnProgress, fnUpload) {
  
  if (!params) return Promise.reject(new Error('uploadFile: no params found in args'));
  
  return new Promise((resolve, reject) => {
    
    const xhr = new XMLHttpRequest();
    
    if (typeof fnUpload === 'function') xhr.upload.addEventListener('load', fnUpload);
    if (typeof fnProgress === 'function') xhr.upload.addEventListener('progress', fnProgress);
    
    xhr.onerror = err => reject(err);
    xhr.open('post', '/uploadFile');
    xhr.onload = () => {
      const { status, response } = xhr;
      if (status === 200) resolve(JSON.parse(response));
      else reject({ status, response });
    };
    
    let form = new FormData();
    for (let key in params) { 
      if (params.hasOwnProperty(key)) form.append(key, params[key]); 
    } 
    
    xhr.send(form);
  });
}
