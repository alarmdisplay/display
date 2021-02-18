import logger from '../../../logger';
import { Application, LocationData, IncidentData } from '../../../declarations';

export interface RemoteLocationData {
  id: number
  rawText: string,
  latitude?: number,
  longitude?: number,
  name: string,
  street: string,
  number: string,
  detail: string,
  postCode: string,
  locality: string,
  country: string
  incidentId?: number
}

export default class LocationsWatcher {
  private app: Application;
  constructor(app: Application, socket: SocketIOClient.Socket) {
    this.app = app;
    socket.on('locations created', this.onCreated);
    socket.on('locations updated', this.onUpdated);
    socket.on('locations patched', this.onUpdated);
    socket.on('locations removed', this.onRemoved);
  }

  onCreated = async (data: RemoteLocationData): Promise<void> => {
    const newData: Partial<LocationData> = {
      rawText: data.rawText,
      latitude: data.latitude,
      longitude: data.longitude,
      name: data.name,
      street: data.street,
      number: data.number,
      detail: data.detail,
      locality: data.locality,
      hubLocationId: data.id
    };

    if (data.incidentId) {
      newData.incidentId = await this.translateIncidentId(data.incidentId);
    }

    const newLocation = await this.app.service('api/v1/locations').create(newData) as LocationData;
    logger.debug('Location mirrored (remote: %d, local: %d)', data.id, newLocation.id);
  };

  onUpdated = async (data: RemoteLocationData): Promise<void> => {
    logger.debug('Location updated/patched', data);
    const service = this.app.service('api/v1/locations');
    const locations = await service.find({ query: { hubLocationId: data.id }, paginate: false }) as LocationData[];
    if (locations.length === 0) {
      // We have not seen this Location before, pretend that it just got created
      await this.onCreated(data);
      return;
    }

    const updateData: Partial<LocationData> = {
      rawText: data.rawText,
      latitude: data.latitude,
      longitude: data.longitude,
      name: data.name,
      street: data.street,
      number: data.number,
      detail: data.detail,
      locality: data.locality
    };
    if (data.incidentId) {
      updateData.incidentId = await this.translateIncidentId(data.incidentId);
    }
    const updatedLocation = await service.patch(locations[0].id, updateData) as LocationData;
    logger.debug('Location updated (remote: %d, local: %d)', data.id, updatedLocation.id);
  };

  onRemoved = async (data: RemoteLocationData): Promise<void> => {
    logger.debug('Location removed', data);
    await this.app.service('api/v1/locations').remove(null, { query: { hubLocationId: data.id } });
  };

  /**
   * Translate the incident ID to the ID of the local copy
   *
   * @param id
   */
  private translateIncidentId = async (id: number): Promise<number | undefined> => {
    const incidents = await this.app.service('api/v1/incidents').find({ query: { hubIncidentId: id }, paginate: false }) as IncidentData[];
    if (incidents.length) {
      return incidents[0].id;
    }

    return undefined;
  }
}
