class Cache extends Map {
  /**
   * @typedef {{ ttl: Number }} CacheOptions
   * @param {CacheOptions} options - Cache Options
   */
  constructor (options) {
    super()
    this.ttl = options.ttl
  }

  get (key) {
    super.get(key)
  }

  set (key, value) {
    super.set(key, value)
    setTimeout(() => {
      this.delete(key)
    }, this.ttl)
  }
}
module.exports = Cache
