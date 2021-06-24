import * as authentication from '@feathersjs/authentication';
import { allowApiKey } from '../../hooks/allowApiKey';
import { HookContext } from '@feathersjs/feathers';
import { getItems, replaceItems } from 'feathers-hooks-common';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [ allowApiKey(), authenticate('jwt', 'api-key') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
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
        item.value = JSON.parse(item.value);
      }
    });
  } else {
    if (typeof items.value === 'string') {
      items.value = JSON.parse(items.value);
    }
  }

  replaceItems(context, items);
  return context;
}
