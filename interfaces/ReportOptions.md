[readme-metric-reporter-express](../README.md) / [Exports](../modules.md) / ReportOptions

# Interface: ReportOptions

## Table of contents

### Properties

- [baseUrl](ReportOptions.md#baseurl)
- [collector](ReportOptions.md#collector)
- [reporter](ReportOptions.md#reporter)

### Methods

- [createUUID](ReportOptions.md#createuuid)

## Properties

### baseUrl

• `Optional` **baseUrl**: `string`

Base URL to your readme.io project

#### Defined in

[report.ts:22](https://github.com/igrek8/readme-metric-reporter-express/blob/95db301/src/report.ts#L22)

___

### collector

• **collector**: [`IMetricCollector`](IMetricCollector.md)

#### Defined in

[report.ts:24](https://github.com/igrek8/readme-metric-reporter-express/blob/95db301/src/report.ts#L24)

___

### reporter

• **reporter**: `IMetricReporter`

#### Defined in

[report.ts:23](https://github.com/igrek8/readme-metric-reporter-express/blob/95db301/src/report.ts#L23)

## Methods

### createUUID

▸ `Optional` **createUUID**(`req`, `res`): `string`

Create a metric id for the request

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |

#### Returns

`string`

#### Defined in

[report.ts:28](https://github.com/igrek8/readme-metric-reporter-express/blob/95db301/src/report.ts#L28)
