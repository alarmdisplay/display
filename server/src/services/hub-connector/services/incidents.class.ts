import logger from '../../../logger';
import { Application, IncidentData } from '../../../declarations';

interface RemoteIncidentData {
  id: number
  time: string
  sender: string
  ref: string
  caller_name: string
  caller_number: string
  reason: string
  keyword: string
  description: string
  status: 'Actual'|'Exercise'|'Test'
  category: 'Geo'|'Met'|'Safety'|'Security'|'Rescue'|'Fire'|'Health'|'Env'|'Transport'|'Infra'|'CBRNE'|'Other'
  createdAt: string
  updatedAt: string
}

export default class IncidentsWatcher {
  private app: Application;
  constructor(app: Application, socket: SocketIOClient.Socket) {
    this.app = app;
    socket.on('incidents created', this.onCreated);
    socket.on('incidents updated', this.onUpdated);
    socket.on('incidents patched', this.onUpdated);
    socket.on('incidents removed', this.onRemoved);
  }

  onCreated = async (data: RemoteIncidentData): Promise<void> => {
    logger.debug('Incident created on Hub', data);
    const newIncident = await this.app.service('api/v1/incidents').create({
      time: new Date(data.time),
      sender: data.sender,
      ref: data.ref,
      caller_name: data.caller_name,
      caller_number: data.caller_number,
      reason: data.reason,
      keyword: data.keyword,
      description: data.description,
      status: data.status,
      category: data.category,
      hubIncidentId: data.id
    }) as IncidentData;
    logger.debug('Incident mirrored (remote: %d, local: %d)', data.id, newIncident.id);
  };

  onUpdated = async (data: RemoteIncidentData): Promise<void> => {
    logger.debug('Incident updated/patched', data);
    const service = this.app.service('api/v1/incidents');
    const incidents = await service.find({ query: { hubIncidentId: data.id }, paginate: false }) as IncidentData[];
    if (incidents.length === 0) {
      // We have not seen this incident before, pretend that it just got created
      await this.onCreated(data);
      return;
    }

    const updatedIncident = await service.patch(incidents[0].id, {
      time: new Date(data.time),
      sender: data.sender,
      ref: data.ref,
      caller_name: data.caller_name,
      caller_number: data.caller_number,
      reason: data.reason,
      keyword: data.keyword,
      description: data.description,
      status: data.status,
      category: data.category,
    }) as IncidentData;
    logger.debug('Incident updated (remote: %d, local: %d)', data.id, updatedIncident.id);
  };

  onRemoved = async (data: RemoteIncidentData): Promise<void> => {
    logger.debug('Incident removed', data);
    await this.app.service('api/v1/incidents').remove(null, { query: { hubIncidentId: data.id } });
  };
}
