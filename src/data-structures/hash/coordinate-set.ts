export class CoordinateSet extends Set {
    private readonly _joint: string = '_';

    constructor(joint?: string) {
        super();
        if (joint !== undefined) this._joint = joint;
    }

    override has(value: number[]) {
        return super.has(value.join(this._joint));
    }

    override add(value: number[]) {
        return super.add(value.join(this._joint));
    }

    override delete(value: number[]) {
        return super.delete(value.join(this._joint));
    }
}