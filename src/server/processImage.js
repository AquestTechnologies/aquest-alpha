import fs from 'fs';
import gm from 'gm';
import s3 from 's3';
import uuid from 'uuid';
import { accessKeyId, secretAccessKey, imageBucketName, cloudFrontDomainName } from '../../config/dev_aws';

// To use this you must have GraphicsMagick on your local machine
// First download and install the png (libpgn) and jpeg (jpegsrc) delegates from ftp://ftp.graphicsmagick.org/pub/GraphicsMagick/delegates/
// Then download and install GraphicsMagick from http://www.graphicsmagick.org/download.html
// Finally check if every needed image format is supported by typing: 'gm convert -list formats'
// If your encounter 'gm: error while loading shared libraries: libjpeg.so.9: cannot open shared object file: No such file or directory' do: 
// sudo ranlib /usr/local/lib/libjpeg.a
// sudo ldconfig /usr/local/lib
// And retry 'gm convert -list formats', JPEG and PNG should be there.

// -- Config --
const maxWidth = 500;
const s3Client = s3.createClient({
  maxAsyncS3: 20,     // this is the default 
  s3RetryCount: 3,    // this is the default 
  s3RetryDelay: 1000, // this is the default 
  multipartUploadThreshold: 20971520, // this is the default (20 MB) 
  multipartUploadSize: 15728640, // this is the default (15 MB) 
  s3Options: {
    accessKeyId,
    secretAccessKey,
    // any other options are passed to new AWS.S3() 
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property 
  },
});

export default function processImage(path) {
  console.log('Proccessiog image:', path);
  return new Promise((resolve, reject) => {
    const image = gm(path);
    
    // Gets image info (could use .size() too)
    image.identify((err, data) => {
      if (err) return reject(err);
      
      const {width, height} = data.size;
      const newName = uuid.v1() + '.png';
      const localFile = 'temp/' + newName;
      
      // Resizes if necessary, renames and changes file format to png
      image
      .resize(width > maxWidth ? maxWidth : null)
      .write(localFile, err => {
        if (err) return reject(err);
        
        // Deletes original file
        fs.unlink(path, err => {
          if (err) return reject(err);
          
          console.log('Sending to s3:', localFile);
          var uploader = s3Client.uploadFile({ 
            localFile, 
            s3Params: {
              Bucket: imageBucketName,
              Key: newName,
              ACL: 'public-read', // !
              // other options supported by putObject, except Body and ContentLength. 
              // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property 
            }
          });
          uploader.on('error', err => reject(err));
          uploader.on('progress', () => console.log('...', Math.round(100 * uploader.progressAmount / uploader.progressTotal) + '%'));
          uploader.on('end', () => {
            console.log('Done uploading');
            
            fs.unlink(localFile, err => {
              if (err) return reject(err);
              
              resolve(cloudFrontDomainName + newName);
            });
          });
        });
      });
    });
    
  });
}