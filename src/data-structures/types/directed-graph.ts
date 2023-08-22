// 0 means unknown, 1 means visiting, 2 means visited;
export type TopologicalStatus = 0 | 1 | 2;

export enum TopologicalProperty {
    VAL = 'VAL',
    NODE = 'NODE',
    ID = 'ID',
}
