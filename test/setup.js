const testEnv = process.env.TEST_ENV || 'unit';

const fsUrls = {
  fileApiUrl: 'https://www.filestackapi.com/api/file',
  uploadApiUrl: 'https://upload.filestackapi.com',
  cloudApiUrl: 'https://cloud.filestackapi.com',
  cdnUrl: 'https://cdn.filestackcontent.com',
};

window.session = {
  apikey: 'fakekey',
  urls: fsUrls,
  handle: 'W1LOh6RdqHqolomhqMUQ',
  filelink: 'W1LOh6RdqHqolomhqMUQ',
};
window.secureSession = {
  apikey: 'fakekey',
  filelink: 'W1LOh6RdqHqolomhqMUQ',
  urls: fsUrls,
  signature: process.env.TEST_CLOUD_SIGNATURE || 'fakesignature',
  policy: process.env.TEST_CLOUD_POLICY || 'fakepolicy',
};

var ENV = window.ENV = {
  testEnv: testEnv,
};

var supermock = window.superMock = require('superagent-mock');
