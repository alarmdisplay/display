import { Server } from 'http';
import url from 'url';
import axios, { AxiosError } from 'axios';

import app from '../src/app';

const port = app.get('port') || 8998;
const getUrl = (pathname?: string): string => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname
});

describe('Feathers application tests (with jest)', () => {
  let server: Server;

  beforeAll(done => {
    server = app.listen(port);
    (app.get('databaseReady') as Promise<void>).then(done);
  }, 60000);

  afterAll(done => {
    server.close(done);
  });

  it('starts and shows the index page', async () => {
    expect.assertions(1);

    const { data } = await axios.get(getUrl());

    expect(data.indexOf('<html lang="de">')).not.toBe(-1);
  });

  describe('404', () => {
    it('shows a 404 HTML page', async () => {
      expect.assertions(4);

      try {
        await axios.get(getUrl('path/to/nowhere'), {
          headers: {
            'Accept': 'text/html'
          }
        });
      } catch (error) {
        expect(error).toBeInstanceOf(AxiosError);
        const { response } = error as AxiosError;

        expect(response?.status).toBe(404);
        expect(typeof response?.data).toBe('string');
        expect((response?.data as string).startsWith('<html>')).toBeTruthy();
      }
    });

    it('shows a 404 JSON error without stack trace', async () => {
      expect.assertions(3);

      try {
        await axios.get(getUrl('path/to/nowhere'));
      } catch (error) {
        expect(error).toBeInstanceOf(AxiosError);
        const { response } = error as AxiosError;

        expect(response?.status).toBe(404);
        expect(response?.data).toMatchObject({
          code: 404,
          message: 'Page not found',
          name: 'NotFound'
        });
      }
    });
  });
});
