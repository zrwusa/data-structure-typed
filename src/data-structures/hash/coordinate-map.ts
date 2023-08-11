export class CoordinateMap<V> extends Map<any, V> {
    private readonly _joint: string = '_';

    constructor(joint?: string) {
        super();
        if (joint !== undefined) this._joint = joint;
    }

    override has(key: number[]) {
        return super.has(key.join(this._joint));
    }

    override set(key: number[], value: V) {
        return super.set(key.join(this._joint), value);
    }

    override get(key: number[]) {
        return super.get(key.join(this._joint));
    }

    override delete(key: number[]) {
        return super.delete(key.join(this._joint));
    }
}