import * as authentication from '@feathersjs/authentication';
import { shallowPopulate } from 'feathers-shallow-populate';
import { allowApiKey } from '../../hooks/allowApiKey';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const populateOptions = {
  include: {
    service: 'api/v1/content-slots',
    nameAs: 'contentSlots',
    keyHere: 'id',
    keyThere: 'viewId',
  }
};

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
    all: [ shallowPopulate(populateOptions) ],
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
