import { randomUUID } from 'crypto';
import type { NextFunction, Request, Response } from 'express';
import { release, type } from 'os';
import {
  IMetricReporter,
  MetricRequestHeader,
  MetricRequestQueryString,
  MetricResponseHeader,
} from 'readme-metric-reporter';
import { URL } from 'url';

import { IMetricCollector } from './IMetricCollector';
import { serialize } from './utils/serialize';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name, version } = require('../package.json');

export interface ReportOptions {
  /**
   * Base URL to your readme.io project
   */
  baseUrl?: string;
  reporter: IMetricReporter;
  collector: IMetricCollector;
  /**
   * Create a metric id for the request
   */
  createUUID?(req: Request, res: Response): string;
}

const comment = `${type()}/${release()}`.toLowerCase();

const EXPLORER_HEADER = 'x-readme-api-explorer';

const LOG_URL_HEADER = 'x-documentation-url';

export function report({ collector, reporter, createUUID = () => randomUUID(), baseUrl }: ReportOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = new Date();
    const _id = createUUID(req, res);
    const isExplorer = typeof req.header(EXPLORER_HEADER) === 'string';

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

    if (isExplorer && typeof baseUrl === 'string') {
      const url = new URL(baseUrl);
      url.pathname = `/logs/${_id}`;
      res.setHeader(LOG_URL_HEADER, url.toString());
    }

    res.once('finish', async () => {
      try {
        const end = new Date();
        const elapsed = end.getTime() - start.getTime();
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
        /* c8 ignore next */
      } catch {} // eslint-disable-line no-empty
    });
    next();
  };
}
