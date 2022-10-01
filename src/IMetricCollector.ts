import { Request, Response } from 'express';
import { Metric } from 'readme-metric-reporter';

export interface IMetricCollector {
  collect(req: Request, res: Response, metric: Metric): Metric;
}
