[readme-metric-reporter-express](../README.md) / [Exports](../modules.md) / IMetricCollector

# Interface: IMetricCollector

## Table of contents

### Methods

- [collect](IMetricCollector.md#collect)

## Methods

### collect

▸ **collect**(`req`, `res`, `metric`): `Metric`

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `metric` | `Metric` |

#### Returns

`Metric`

#### Defined in

[IMetricCollector.ts:5](https://github.com/igrek8/readme-metric-reporter-express/blob/b3d4e3b/src/IMetricCollector.ts#L5)
