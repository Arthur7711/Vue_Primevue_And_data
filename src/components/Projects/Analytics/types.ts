

export type IIndex = Record<string, number>
export type IIsSHow = Record<string, boolean>

export interface IPropsAnalyticsChartsTable {
    thisMonth: string,
    activeKey: string
}
export type IEmitAnalyticsChartsTable = {
    (e: 'refresh-legend',  IIndex): void
}