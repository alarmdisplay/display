import * as authentication from '@feathersjs/authentication';
import { allowApiKey } from '../../hooks/allowApiKey';
import { HookContext } from '@feathersjs/feathers';
import { disallow, getItems, replaceItems } from 'feathers-hooks-common';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [ allowApiKey(), authenticate('jwt', 'api-key') ],
    find: [],
    get: [],
    create: [ disallow('external') ],
    update: [],
    patch: [],
    remove: [ disallow('external') ]
  },

  after: {
    all: [ unserializeValue ],
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

function unserializeValue(context: HookContext): HookContext {
  const items = getItems(context);
  if (Array.isArray(items)) {
    items.forEach(item => {
      if (typeof item.value === 'string') {
        item.value = item.value.length === 0 ? null : JSON.parse(item.value);
      }
    });
  } else {
    if (typeof items.value === 'string') {
      items.value = items.value.length === 0 ? null : JSON.parse(items.value);
    }
  }

  replaceItems(context, items);
  return context;
}
