const NodeHttpAdapter = require('@pollyjs/adapter-node-http');
const { Polly, setupMocha } = require('@pollyjs/core');
const FSPersister = require('@pollyjs/persister-fs');
const mocks = require('./http.mock.js');
const { session, sessionSecure } = require('./sessions');

const testEnv = process.env.TEST_ENV || 'unit';

Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

setupMocha({
    adapters: ['node-http'],
});

beforeEach(function() {
    mocks(this.polly);
})

global.session = session;
global.secureSession = sessionSecure;

global.ENV = {
  isNode: true,
  testEnv,
};
