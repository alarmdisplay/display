import * as authentication from '@feathersjs/authentication';
import { shallowPopulate } from 'feathers-shallow-populate';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const populateOptions = {
  include: {
    service: 'api/v1/content-slot-options',
    nameAs: 'options',
    keyHere: 'id',
    keyThere: 'contentSlotId',
  }
};

export default {
  before: {
    all: [ authenticate('jwt') ],
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
