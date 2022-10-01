import { NextFunction, Request, Response } from 'express';
import { release, type } from 'os';
import {
  IMetricReporter,
  MetricRequestHeader,
  MetricRequestQueryString,
  MetricResponseHeader,
} from 'readme-metric-reporter';

import { IMetricCollector } from './IMetricCollector';
import { generateId } from './utils/generateId';
import { serialize } from './utils/serialize';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name, version } = require('../package.json');

export interface ReportOptions {
  reporter: IMetricReporter;
  collector: IMetricCollector;
}

const comment = `${type()}/${release()}`.toLowerCase();

export function report({ collector, reporter }: ReportOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = new Date();

    /**
     * Capture outgoing response body
     */
    let _body: unknown;
    const _send = res.send;
    res.send = function send(body?: unknown) {
      _body = body;
      res.send = _send;
      return res.send(body);
    };

    res.once('finish', async () => {
      try {
        const end = new Date();
        const elapsed = end.getTime() - start.getTime();
        const _id = `${req.ip}-${generateId()}`;
        const url = req.protocol + '://' + req.get('host') + req.originalUrl;
        const httpVersion = `${req.protocol.toUpperCase()}/${req.httpVersion}`;
        const queryString = Object.entries(req.query).reduce<MetricRequestQueryString[]>((arr, [name, value]) => {
          if (value) {
            arr.push({
              name,
              value: value.toString(),
            });
          }
          return arr;
        }, []);
        const requestHeaders = Object.entries(req.headers).reduce<MetricRequestHeader[]>((arr, [name, value]) => {
          if (value) {
            arr.push({
              name,
              value: value.toString(),
            });
          }
          return arr;
        }, []);
        const responseHeaders = Object.entries(res.getHeaders()).reduce<MetricResponseHeader[]>(
          (arr, [name, value]) => {
            if (value) {
              arr.push({
                name,
                value: value.toString(),
              });
            }
            return arr;
          },
          []
        );
        await reporter.report(
          collector.collect(req, res, {
            _id,
            group: {
              id: req.ip,
            },
            clientIPAddress: req.ip,
            request: {
              log: {
                creator: {
                  name,
                  version,
                  comment,
                },
                entries: [
                  {
                    startedDateTime: end.toISOString(),
                    time: elapsed,
                    pageref: url,
                    request: {
                      url,
                      method: req.method,
                      headers: requestHeaders,
                      httpVersion: httpVersion,
                      queryString: queryString,
                      postData: {
                        mimeType: req.header('content-type')?.toString(),
                        text: serialize(req.body),
                      },
                    },
                    response: {
                      status: res.statusCode,
                      statusText: res.statusMessage,
                      headers: responseHeaders,
                      content: {
                        mimeType: req.header('content-type')?.toString(),
                        size: req.socket.bytesWritten,
                        text: serialize(_body),
                      },
                    },
                  },
                ],
              },
            },
          })
        );
      } catch {
        /* istanbul ignore next */
      }
    });
    next();
  };
}
