import express, { Request, Response } from 'express';
import { Server } from 'http';
import { Metric, MetricReporter } from 'readme-metric-reporter';
import request from 'supertest';

import { IMetricCollector } from './IMetricCollector';
import { report } from './report';
import { generateId } from './utils/generateId';

jest.useFakeTimers();
jest.setSystemTime(new Date('2022-01-01'));

jest.mock('os', () => ({
  ...jest.requireActual('os'),
  type: jest.fn().mockReturnValue('darwin'),
  release: jest.fn().mockReturnValue('10.0.0'),
}));

jest.mock('./utils/generateId');

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
      .use(report({ reporter, collector }))
      .use(express.json())
      .use((req, res) => res.status(200).json({ echo: req.body }))
      .listen(50000, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('reports metric', async () => {
    (generateId as jest.MockedFunction<typeof generateId>).mockReturnValue('12345');
    const report = jest.spyOn(reporter, 'report').mockImplementation(async () => {});
    await request(server).post('/echo?search=criteria').send({ message: 'test' });
    expect(report.mock.calls[0]?.[0]).toMatchSnapshot();
  });
});
