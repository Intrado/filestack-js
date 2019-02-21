const toxy = require('toxy');
require('./setup_node.js');

// const host = ENV.intelligentSession.urls.intelligentUploadApiUrl ;
const host = '0.0.0.0';

const proxy500 = toxy();
proxy500
  .forward(host)
  .options({ forwardHost: true, cors: true });
proxy500
  .post('/multipart/upload')
  .poison(toxy.poisons.inject({
    code: 500,
    body: '{"error": "toxy injected error"}',
    headers: { 'Content-Type': 'application/json' },
  }));
proxy500.all('/*');
proxy500.listen(9900);
console.log('Launched toxy proxy with HTTP 500 poison on http://localhost:9900');

const proxyAbort = toxy();
proxyAbort
  .forward(host)
  .options({ forwardHost: true, cors: true });
proxyAbort.put('/fakeS3').poison(toxy.poisons.abort());
proxyAbort.all('/*');
proxyAbort.listen(9901);
console.log('Launched toxy proxy with abort poison on http://localhost:9901');

const proxy400 = toxy();
proxy400
  .forward(host)
  .options({ forwardHost: true, cors: true });
proxy400
  .post('/multipart/upload')
  .poison(toxy.poisons.inject({
    code: 400,
    body: '{"error": "toxy injected error"}',
    headers: { 'Content-Type': 'application/json' },
  }));
proxy400.all('/*');
proxy400.listen(9902);
console.log('Launched toxy proxy with HTTP 400 poison on http://localhost:9902');

const proxySlowUpload = toxy();
proxySlowUpload
  .forward(host)
  .options({ forwardHost: true, cors: true });

proxySlowUpload.post('/multipart/upload')
  .poison(toxy.poisons.slowOpen({ delay: 2000 }))
proxySlowUpload.all('/*');
proxySlowUpload.listen(9903);
console.log('Launched toxy proxy with HTTP slowOpen on http://localhost:9903');

