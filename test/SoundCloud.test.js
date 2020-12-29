describe('SoundCloudExtractor', () => {
  const { SoundCloudExtractor } = require('../src/extractors')
  const SoundCloud = new SoundCloudExtractor()
  describe('Parser', () => {
    it('Parse Soundcloud scripts from soundcloud html', (done) => {
      SoundCloud.parseScriptURLs().then(() => {
        done()
      }).catch(done)
    })
    it('Parse client_id from soudcloud scripts', (done) => {
      SoundCloud.parseClientID().then(() => {
        done()
      }).catch(done)
    })
  })
})
