const NodeHttpAdapter = require('@pollyjs/adapter-node-http');
const FSPersister = require('@pollyjs/persister-fs');
const { Polly, setupMocha: setupPolly } = require('@pollyjs/core');


Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

console.log('==== RUN POLLY (Node) ====');

const polly = new Polly('Api', {
  adapters: ['node-http'],
  logging: false 
});

polly.server.host('https://upload.filestackapi.com', () => {
  polly.server.post('/multipart/start').intercept((req, res) => {
    res.status(200).json({
      uri: '/testfile.gif',
      region: 'us-east-1',
      upload_id: 'test_upload_ud',
      location_url: 'test_upload.filestackapi.com',
    });
  });

  polly.server.post('/multipart/upload').intercept((req, res) => {
    res.status(200).json({
      location_url: 'test_upload.filestackapi.com',
      url: 'test_location_url',
      headers: {
        forward: true,
      },
    });
  });

  polly.server.post('/multipart/complete').intercept((req, res) => {
    res.status(200).json({
      handle: '7xSJALUhSlCDCNujt5Ku',
      url: 'https://agnostic-cdn.filestackapi.com/7xSJALUhSlCDCNujt5Ku',
      filename: 'dutton.gif',
      size: 35,
      mimetype: 'image/gif',
      status: 'Stored',
    });
  });

  polly.server.post('/multipart/commit').intercept((req, res) => {
    res.setHeader('etag', 'some_etag').status(200);
  });

  polly.server.put('/fakeS3').intercept((req, res) => {
    res.setHeader('etag', 'some_etag').status(200);
  });
});

global.pollyServer = polly.server;
