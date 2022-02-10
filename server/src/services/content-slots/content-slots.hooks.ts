import * as authentication from '@feathersjs/authentication';
import { allowApiKey } from '../../hooks/allowApiKey';
import { unserializeJson } from '../../hooks/unserializeJson';
import { HookContext } from '@feathersjs/feathers';
import { getItems, replaceItems } from 'feathers-hooks-common';
import { ContentSlotData } from '../../declarations';
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
    all: [ unserializeJson('options'), ensureDefaultOptions ],
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

const defaultOptions = new Map<string, any>([
  ['AnnouncementList', { title: '' }],
  ['DWDWarningMap', { areaCode: 'DE', mapType: 'area' }]
]);

function ensureDefaultOptions(context: HookContext): HookContext {
  const items = getItems(context) as ContentSlotData|ContentSlotData[];
  if (Array.isArray(items)) {
    items.forEach(item => {
      item.options = Object.assign({}, defaultOptions.get(item.component) || {}, item.options);
    });
  } else {
    items.options = Object.assign({}, defaultOptions.get(items.component) || {}, items.options);
  }

  replaceItems(context, items);
  return context;
}
