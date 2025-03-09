import chai from 'chai'
let should = chai.should();

const serverAddress = process.env.SERVER_URL ? process.env.SERVER_URL : 'http://localhost:3031'
const url = new URL(serverAddress)
url.protocol.should.be.oneOf(['http:', 'https:'], 'The URL must begin with http or https')
console.log(`Using ${url.origin} as base for all requests`);

/**
 * Preparations that need to happen, before the tests can start.
 *
 * @return {Promise<void>}
 */
export async function mochaGlobalSetup() {
  const maxAttempts = 40
  console.log(`Trying to connect to ${url.origin} and determine the ready state ...`);
  for (let i = 0; i < maxAttempts; i++) {
    if (i > 0) {
      // Wait a bit between attempts
      await sleep(3000)
    }

    try {
      const res = await chai.request(url.origin).get('/status')
      res.should.have.status(200);
      res.body.should.include({ ready: true });
      console.log('[OK] The server is reachable and ready');
      break
    } catch (e) {
      // Only throw, if maxAttempts is reached
      if (i === maxAttempts - 1) {
        throw e
      }
    }
  }
}

export const mochaHooks = {
  beforeAll(done) {
    this.server = {
      base: url.origin
    }
    done();
  }
};

async function sleep (duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  })
}
