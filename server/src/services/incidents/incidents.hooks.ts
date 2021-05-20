import * as authentication from '@feathersjs/authentication';
import { allowApiKey } from '../../hooks/allowApiKey';
import { HookContext } from '@feathersjs/feathers';
import { shallowPopulate } from 'feathers-shallow-populate';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

// TODO make sure that incidents that are mirrored from the Hub do not get modified
// TODO make sure that local incidents cannot be assigned a hubIncidentId

const populateOptions = {
  include: {
    service: 'api/v1/locations',
    nameAs: 'location',
    keyHere: 'id',
    keyThere: 'incidentId',
    asArray: false
  }
};

export default {
  before: {
    all: [ allowApiKey(), authenticate('jwt', 'api-key') ],
    find: [],
    get: [],
    create: [ includeAssociations ],
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

async function includeAssociations(context: HookContext): Promise<HookContext> {
  if (context.data.location) {
    const LocationService = context.app.service('api/v1/locations');
    context.params.sequelize = {
      include: [{ model: LocationService.Model }]
    };
  }
  return context;
}
