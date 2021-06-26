import * as authentication from '@feathersjs/authentication';
import { allowApiKey } from '../../hooks/allowApiKey';
import { shallowPopulate } from 'feathers-shallow-populate';
import { HookContext } from '@feathersjs/feathers';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const populateOptions = {
  include: {
    service: 'api/v1/views',
    nameAs: 'views',
    keyHere: 'id',
    keyThere: 'displayId',
  }
};

export default {
  before: {
    all: [ allowApiKey(), authenticate('jwt', 'api-key') ],
    find: [],
    get: [],
    create: [ includeViews ],
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
 * Automatically create nested views when creating a display
 * @param context
 */
function includeViews(context: HookContext): HookContext {
  const sequelize = context.app.get('sequelizeClient');
  context.params.sequelize = { include: [ { model: sequelize.models.view, as: 'views' } ] };
  return context;
}
