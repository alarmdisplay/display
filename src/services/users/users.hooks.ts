import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { HookContext } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

function preventEmptyPassword (context: HookContext): HookContext {
  if ((context.method === 'create' || context.method === 'update') && !context.data.password) {
    throw new BadRequest('Password must not be empty');
  }

  if (context.data.password && context.data.password === '') {
    throw new BadRequest('Password must not be empty');
  }

  return context;
}

export default {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [ preventEmptyPassword, hashPassword('password') ],
    update: [ preventEmptyPassword, hashPassword('password'),  authenticate('jwt') ],
    patch: [ preventEmptyPassword, hashPassword('password'),  authenticate('jwt') ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [],
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
