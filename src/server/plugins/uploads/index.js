import Joi from 'joi';
import Boom from 'boom';
import JWT from 'jsonwebtoken';
import queryDb from '../../queryDb';
import log from '../../../shared/utils/logTailor';


export default function uploadsPlugin(server, options, next) {
  
  const tempDir = 'temp/';
  const processors = [ // A list of authorized MIME type
    {
      MIMERegex: /image\/*/,
      processor: require('./processors/image')
    },
    {
      MIMERegex: /application\/pdf/,
      processor: require('./processors/default')
    },
  ];
  
  server.route({
    method: 'POST',
    path: '/uploadFile',
    config: {
      auth: 'jwt', // Auth required
      payload:{
        parse: true, // Converts payload with 'Content-type' into an object (true is the default)
        output:'stream', // With parse: true, field are text and files are stream
        maxBytes: 5 * 1024 * 1024, // 5 MB (5 Mo in French)
      },
      validate: { 
        payload: {
          file: Joi.object({ // From Joi#472
            pipe: Joi.func().required()
          }).unknown()
        },
        failAction: (request, reply, source, error) => { 
          const { details } = error.data;
          log('... Joi failed:', details);
          reply(Boom.badRequest(JSON.stringify(details)));
        }
      }
    },
    handler: (request, reply) => {
      
      const { file } = request.payload; // Stream
      const fileName = file.hapi.filename;
      const MIMEType = file.hapi.headers['content-type'];
      const { userId } = JWT.decode(request.state.jwt); // No need to try/catch token malformations because auth plugin validated it
      
      log('Received file:', userId, fileName);
      
      const typeMatch = processors.find(({MIMERegex}) => MIMERegex.test(MIMEType));
      
      if (!typeMatch) reply(Boom.unsupportedMediaType('That media is not supported')); // 415
      else typeMatch.processor(file, tempDir).then( // Processes the stream
        ({ name, url }) => {
          
          log('Upload processed, will query DB');
          
          // Inserts a record of who uploaded the file
          queryDb('createFile', { url, name, userId, ip: request.info.remoteAddress }).then(
            () => {
              log('Upload complete: ', name);
              reply({url});
            },
            
            error => {
              log('!!! Error while queryDb\n', error, error.stack);
              reply(Boom.badImplementation(error.message)); // 500, args are not sent to client, just logged by Boom on server
            }
          );
        },
        error => {
          log('!!! Error while file processing\n', error, error.stack);
          reply(Boom.badImplementation(error.message));
        }
      );
    }
  });
  
  next();
}

uploadsPlugin.attributes = {
  name:         'uploadsPlugin',
  description:  'A file upload handler',
};
