import app from '../../src/app';

describe('\'status\' service', () => {
  it('registered the service', () => {
    const service = app.service('status');
    expect(service).toBeTruthy();
  });

  it('should return the ready status', async () => {
    const statusData = await app.service('status').find();
    expect(statusData).toEqual(expect.objectContaining({ ready: expect.any(Boolean) }));
  });
});
