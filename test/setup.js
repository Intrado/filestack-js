const XhrAdapter = require('@pollyjs/adapter-xhr');
const FetchAdapter = require('@pollyjs/adapter-fetch');
const { session, sessionSecure } = require('./sessions');
const { Polly, setupMocha } = require('@pollyjs/core');
const mocks = require('./http.mock.js');

Polly.register(XhrAdapter);
Polly.register(FetchAdapter);

setupMocha({
    adapters:  ['fetch', 'xhr'],
});

beforeEach(function() {
    mocks(this.polly);
})


const testEnv = process.env.TEST_ENV || 'unit';

window.session = session;
window.secureSession = sessionSecure;

var ENV = window.ENV = {
  testEnv: testEnv,
};

