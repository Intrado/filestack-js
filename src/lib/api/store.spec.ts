/*
 * Copyright (c) 2018 by Filestack.
 * Some rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as assert from 'assert';
import { storeURL } from './store';

declare var session: any;
declare var secureSession: any;

describe('storeURL', function storeFunc() {

  it('should throw an error if no url is set', () => {
    assert.throws(() => storeURL(session));
  });

  it('should handle store without params', (done) => {
    const options = {};
    storeURL(session, session.externalImage, options)
      .then((res) => {
        assert.ok(res);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should support uppercase string options', (done) => {
    const options = { location: 'S3' };
    storeURL(session, session.externalImage, options)
      .then((res) => {
        assert.ok(res);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should replace ":" and "," with "_" in url', (done) => {
    const options = { filename: 'test:t,est.jpg' };
    storeURL(session, session.externalImage, options)
      .then((res) => {
        assert.ok(res);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should upload file correctly with "/" in path', (done) => {
    const options = { filename: 'test.jpg' , path: 'test/path'};
    storeURL(session, session.externalImage, options)
      .then((res) => {
        assert.ok(res);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should get an ok response with a valid url', (done) => {
    storeURL(session, session.externalImage)
      .then((res) => {
        assert.ok(res);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should get an ok response with a valid url and security', (done) => {
    storeURL(secureSession, secureSession.externalImage)
      .then((res) => {
        assert.ok(res);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should return the handle and mimetype as part of the response', (done) => {
    storeURL(session, session.externalImage)
      .then((res: any) => {
        assert.ok(res.handle);
        assert.equal(res.url.split('/').pop(), res.handle);
        assert.equal(res.mimetype, res.type);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should cancel request', (done) => {
    const token: any = {};

    storeURL(session, session.externalImage, {}, token)
    .then(() => {
      done(new Error('Success shouldnt be called'));
    })
    .catch((err) => {
      assert.ok(err instanceof Error);
      done();
    });

    setTimeout(() => token.cancel(), 10);
  });

  it.skip('should reject on request error', (done) => {
    storeURL(session, session.externalImage)
      .then(() => {
        done(new Error('Success shouldnt be called'));
      })
      .catch((err) => {
        assert.ok(err instanceof Error);
        done();
      });
  });

  it('should support workflows', (done) => {
    const options = { workflows: ['test', { id: 'test' }] };
    storeURL(session, session.externalImage, options)
      .then((res) => {
        assert.ok(res);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

});
