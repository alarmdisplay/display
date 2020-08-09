import * as authentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { BadRequest } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;
const { hashPassword, protect } = local.hooks;

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ enforceNameOnly, generateToken, hashPassword('tokenHash') ],
    update: [ enforceNameOnly ],
    patch: [ enforceNameOnly ],
    remove: []
  },

  after: {
    all: [
      // Make sure the tokenHash field is never sent to the client
      // Always must be the last hook
      protect('tokenHash')
    ],
    find: [],
    get: [],
    create: [ includeToken ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

/**
 * Make sure that a name is provided, but nothing more
 *
 * @param context
 */
function enforceNameOnly(context: HookContext): HookContext {
  // Make sure a name was submitted
  if (!context.data.name || context.data.name === '') {
    throw new BadRequest('A name for the token must be provided')
  }

  // Restrict the submitted data to only the name
  context.data = { name: context.data.name };

  return context;
}

/**
 * Generate a random token
 *
 * @param context
 */
function generateToken(context: HookContext): HookContext {
  // Generate a random token and add it to the submitted data. This will not be stored directly, but returned to the client once
  const hash = createHash('sha256');
  hash.update(uuidv4());
  context.data.token = hash.digest('hex');

  // Duplicate the value in the tokenHash field, which will be hashed and stored
  context.data.tokenHash = context.data.token;

  return context;
}

/**
 * Include the token in the result. This must only happen once, when creating the token.
 *
 * @param context
 */
function includeToken(context: HookContext): HookContext {
  context.result.token = context.data.token;
  return context;
}
