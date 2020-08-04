describe('Cache', () => {
  const Cache = require('../src/structures/Cache')
  it('Set', done => {
    const cache = new Cache({ ttl: 1000 })
    cache.set('key', 'value')
    done()
  })
  it('Delete', done => {
    const cache = new Cache({ ttl: 1000 })
    cache.set('key', 'value')
    cache.delete('key')
    done()
  })
  const TTL = 500
  it(`TTL - ${TTL}ms`, done => {
    const cache = new Cache({ ttl: TTL })
    cache.set('key', 'value')
    setTimeout(() => {
      if (cache.get('key')) return done(new Error('Cache - TTL test failed'))
      else done()
    }, TTL)
  })
})
