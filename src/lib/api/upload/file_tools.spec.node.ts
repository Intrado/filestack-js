
/*
 * Copyright (c) 2019 by Filestack.
 * Some rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { getFile } from './file_tools';
import * as fs from 'fs';

jest.mock('fs');

const mockedTestFile = Buffer.from('text text');
const base64Svg = 'PHN2ZyBoZWlnaHQ9IjEwMCIgd2lkdGg9IjEwMCI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDAiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0icmVkIiAvPgogIFNvcnJ5LCB5b3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBpbmxpbmUgU1ZHLiAgCjwvc3ZnPiA=';

describe('Api/Upload/FileTools', () => {
  describe('getFileNode', () => {

    it('Should return file instance for nodejs loaded file from path', async () => {
      spyOn(fs, 'existsSync').and.returnValue(true);
      spyOn(fs, 'readFile').and.callFake((path, cb) => {
        cb(null, mockedTestFile);
      });

      const file = await getFile('/testfile.txt');

      expect(file.name).toEqual('testfile.txt');
      expect(file.mimetype).toEqual('text/plain');
      expect(file.size).toEqual(9);
    });

    it('Should reject if provided file cannot be read', () => {
      spyOn(fs, 'existsSync').and.returnValue(true);
      spyOn(fs, 'readFile').and.callFake((path, cb) => {
        cb('error');
      });

      return expect(getFile('/testfile.txt')).rejects.toEqual('error');
    });

    it('Should return correct mimetype', async () => {
      jest.unmock('fs');

      const file = await getFile('./filestack-logo.png');
      expect(file.mimetype).toEqual('image/png');
    });

    it('Should return correct file instance from buffer', async () => {
      const file = await getFile(mockedTestFile);

      expect(file.size).toEqual(9);
      expect(file.mimetype).toEqual('text/plain');
    });

    it('Should handle base64 encoded string', async () => {
      const file = await getFile(base64Svg);
      expect(file.mimetype).toEqual('image/svg+xml');
    });

    it('Should throw error when random string is provided', async () => {
      return expect(getFile('asdasdfasdf')).rejects.toEqual(new Error('Unsupported input file type'));
    });

    it('Should handle named file input', async () => {
      const file = await getFile({
        name: '123.jpg',
        file: mockedTestFile,
      });

      expect(file.name).toEqual('123.jpg');
      expect(file.size).toEqual(9);
      expect(file.mimetype).toEqual('text/plain');
    });

    it('Should reject on unsupported input file type', () => {
      // @ts-ignore
      return expect(getFile({})).rejects.toEqual(new Error('Unsupported input file type'));
    });
  });
});