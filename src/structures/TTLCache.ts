export class TTLCache extends Map {
    private ttl: number
    /**
     * TTL Cache, extends Map
     * @param ttl Time to live in milliseconds
     */
    constructor (ttl: number) {
        super()
        this.ttl = ttl
    }

    public set(key: any, value: any): this {
        setTimeout(() => {
            this.delete(key)
        }, this.ttl)
        return super.set(key, value);
    }
}