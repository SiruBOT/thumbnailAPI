describe('SoundCloudExtractor', () => {
  const SoundCloudExtractor = require('../src/extractor/SoundCloudExtractor')
  const SoundCloud = new SoundCloudExtractor()
  it('Parse Soundcloud scripts from soundcloud html', (done) => {
    SoundCloud.parseScriptURLs().then(() => {
      done()
    }).catch(done)
  })
  it('Parse client_id from soudcloud scripts', (done) => {
    SoundCloud.parseClientID().then()
  })
})
