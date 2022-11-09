[readme-metric-reporter-express](README.md) / Exports

# readme-metric-reporter-express

## Table of contents

### Interfaces

- [IMetricCollector](interfaces/IMetricCollector.md)
- [ReportOptions](interfaces/ReportOptions.md)

### Functions

- [report](modules.md#report)

## Functions

### report

▸ **report**(`__namedParameters`): (`req`: `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>, `res`: `Response`<`any`, `Record`<`string`, `any`\>\>, `next`: `NextFunction`) => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`ReportOptions`](interfaces/ReportOptions.md) |

#### Returns

`fn`

▸ (`req`, `res`, `next`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

##### Returns

`void`

#### Defined in

[report.ts:24](https://github.com/igrek8/readme-metric-reporter-express/blob/3dfb115/src/report.ts#L24)
