
/*
 * Copyright (c) 2019 by Filestack.
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

import { Security, Session, StoreOptions } from '../../client';
import { S3Uploader, UploadMode } from './uploaders/s3';
import { UploadOptions } from '../upload/types';
import { getFile } from './file_tools';

/**
 * Overlay to connect new uploader with old one without changing options
 *
 * @todo accept function as filename -> dynamic filename generation
 * @export
 * @class Upload
 */
export class Upload {
  private uploader: S3Uploader;

  constructor(
    private readonly options: UploadOptions = {},
    private readonly storeOptions: StoreOptions = {}
  ) {

    this.uploader = new S3Uploader(storeOptions, options.concurrency);

    this.uploader.setRetryConfig({
      retry: options.retry || 10,
      retryFactor: options.retryFactor || 2,
      retryMaxTime: options.retryMaxTime || 15000,
    });

    this.uploader.setTimeout(options.timeout || 120000);

    if (options.partSize) {
      this.uploader.setPartSize(options.partSize);
    }

    if (options.intelligentChunkSize) {
      this.uploader.setIntelligentChunkSize(options.intelligentChunkSize);
    }

    if (options.intelligent) {
      this.uploader.setUploadMode(options.intelligent === 'fallback' ? UploadMode.FALLBACK : UploadMode.INTELLIGENT);
    }
  }

  // @deprecated
  setSession(session: Session) {
    console.log('set session', session);
    this.uploader.setApikey(session.apikey);

    if (session.policy && session.signature) {
      this.uploader.setSecurity({
        policy: session.policy,
        signature: session.signature,
      });
    }

    this.uploader.setHost(session.urls.uploadApiUrl);
  }

  /**
   * Upload single file
   *
   * @param {(string | Buffer | Blob)} file
   * @param {string} [name] - overwrite file name?
   * @returns {Promise<any>}
   * @memberof Upload
   */
  async upload(input: string | Buffer | Blob): Promise<any> {
    const file = await getFile(input);
    this.uploader.addFile(file);
    return Promise.resolve((await this.uploader.execute()).pop());
  }

  /**
   * Upload multiple files at once
   *
   * @param {(string[] | Buffer[] | Blob[])} input
   * @returns {Promise<any>}
   * @memberof Upload
   */
  async multiupload(input: string[] | Buffer[] | Blob[]): Promise<any> {
    for (let i in input) {
      if (!input.hasOwnProperty(i)) {
        continue;
      }

      this.uploader.addFile(await getFile(input[i]));
    }

    return this.uploader.execute();
  }
}
