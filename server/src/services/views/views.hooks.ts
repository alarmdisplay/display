import * as authentication from '@feathersjs/authentication';
import { shallowPopulate } from 'feathers-shallow-populate';
import { allowApiKey } from '../../hooks/allowApiKey';
import { HookContext } from '@feathersjs/feathers';
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
    create: [ includeContentSlots ],
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

/**
 * Automatically create nested content slots when creating a view
 * @param context
 */
function includeContentSlots(context: HookContext): HookContext {
  const sequelize = context.app.get('sequelizeClient');
  context.params.sequelize = { include: [ { model: sequelize.models.content_slot, as: 'contentSlots' } ] };
  return context;
}
