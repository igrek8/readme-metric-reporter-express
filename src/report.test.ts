import * as express from 'express';
import { Request, Response } from 'express';
import { Server } from 'http';
import { Metric, MetricReporter } from 'readme-metric-reporter';
import * as request from 'supertest';

import { randomUUID } from 'crypto';
import { IMetricCollector } from './IMetricCollector';
import { report } from './report';

jest.useFakeTimers();
jest.setSystemTime(new Date('2022-01-01'));

jest.mock('os', () => ({
  ...jest.requireActual('os'),
  type: jest.fn().mockReturnValue('darwin'),
  release: jest.fn().mockReturnValue('10.0.0'),
}));

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn(),
}));

const reporter = new MetricReporter('apiKey');

const collector: IMetricCollector = {
  collect(_req: Request, _res: Response, metric: Metric) {
    return metric;
  },
};

describe('createMiddleware', () => {
  let server: Server;

  beforeAll((done) => {
    server = express()
      .use(report({ reporter, collector, baseUrl: 'http://example.com' }))
      .use(express.json())
      .use((req, res) => res.status(200).json({ echo: req.body }))
      .listen(50000, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('reports metric', async () => {
    (randomUUID as jest.MockedFunction<typeof randomUUID>).mockReturnValueOnce('00000000-0000-0000-0000-000000000000');
    const report = jest.spyOn(reporter, 'report').mockImplementation(async () => {});
    await request(server).post('/echo?search=criteria').send({ message: 'test' }).set('x-readme-api-explorer', '0.0.0');
    expect(report.mock.calls[0]?.[0]).toMatchSnapshot();
  });
});
