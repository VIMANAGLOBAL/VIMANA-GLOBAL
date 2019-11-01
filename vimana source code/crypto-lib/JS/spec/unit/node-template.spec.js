import KeyGenerator from "../../src/app/KeyGenerator"
import assert from 'assert'
import {
    SALT
} from '../../src/app/vimryptoParams';
import path from 'path';

import log from '../../lgo-config'

describe("NodeTemplate", () => {
  it("works", () => {

      const tetData = {
          privateKey: {
              X: '16dc10273b3381b665avimf8cde906cafbd0ef5fb34e53e7cef8e74bcf645247827dd7315a4f3d82cd35bd34f294b6a034ebe568732ff34cb4a17e0fa426c4c2d05',
              Y: '14e23b47cb32c9205af269a17aba91cf6f20fd9328476c2194c83d72b9c6cb1d48881e7d7d156415f93ad5f54a1bf2c1045d4d4340524a6e0253ac27e55d7496e46'
          },
          pubicKey: {
              X: '16dc10273b3381b665avimf8cde906cafbd0ef5fb34e53e7cef8e74bcf645247827dd7315a4f3d82cd35bd34f294b6a034ebe568732ff34cb4a17e0fa426c4c2d05',
              Y: '14e23b47cb32c9205af269a17aba91cf6f20fd9328476c2194c83d72b9c6cb1d48881e7d7d156415f93ad5f54a1bf2c1045d4d4340524a6e0253ac27e55d7496e46'
          }
      };



      const secretPhrase = '1234567890 and or 0987654321';

      const pair = KeyGenerator.deriveFromPasssPhrase(secretPhrase, SALT);

    assert.equal(1,1);
  })
});

describe("deriveFromPasssPhrase", () => {
    it("works", () => {
        console.log('generateKeys');

        const tetData = 'a2fd6fbb04be8a3c08d04c14bb383a8a88f9e3ef13fa5452d88cf935a4e4efe5acdd4b97e3bc2a0b98b97681ab66bb66ec01c3bdb379db1399dcd08119ba314d746aee153b73107664b994657e602e4b9578a42b930e33667946c3a24b89737a7746242916fe860f20397a10bc847f5f0eb0707472210c73138edf95d3b00398'

        const secretPhrase = '1234567890 and or 0987654321';

        const pair = KeyGenerator.deriveFromPasssPhrase(secretPhrase, SALT);

        try {
            assert.equal(pair,tetData);
            log('deriveFromPasssPhrase', 'info', 'OK');

        } catch (err) {
            const e = new Error(err);

            log('deriveFromPasssPhrase', 'error', err.stack);
        }
    })
});


