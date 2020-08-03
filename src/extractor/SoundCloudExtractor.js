const BaseExtractor = require('../structures/BaseExtractor')
const Cache = require('../structures/Cache')
const fetch = require('node-fetch')
class SoundCloudExtrator extends BaseExtractor {
  constructor () {
    super('soundcloud')
    this.APP_SCRIPT_REGEX = /<script.*?src="(.*?)"/gi
    this.APP_SCRIPT_CLIENT_ID_REGEX = /,client_id:"(([a-zA-Z0-9-_]+))"/g
    this.VALID_URL_REGEX = /(https?:\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/
    this.SC_URL = 'http://localhost/'
    this.SC_API_V2_BASE = 'https://api-v2.soundcloud.com/'
    this.cache = new Cache({ ttl: 1000 })
  }

  async parseClientID () {
    try {
      const scriptUrls = await this.parseScriptURLs()
      const fetchResults = await Promise.all(scriptUrls.map(el => fetch(el)))
      const scripts = await Promise.all(fetchResults.map(el => el.text()))
      const clientIds = scripts.map(el => this.APP_SCRIPT_CLIENT_ID_REGEX.exec(el)).filter(el => el)[0]
      const clientId = clientIds[1]
      this.cache.set('clientId', clientId)
      return clientId
    } catch (e) {
      throw new Error('Failed to get SoundCloud API Key ' + e.stack)
    }
  }

  async parseScriptURLs () {
    const soundCloudFetchResult = await fetch(this.SC_URL)
    const soundCloudHTML = await soundCloudFetchResult.text()
    return soundCloudHTML.match(this.APP_SCRIPT_REGEX).map(scriptTag => scriptTag.match(this.VALID_URL_REGEX)[0]).reverse()
  }

  get () {
    fetch(new URL('resolve', this.SC_API_V2_BASE))
  }
}

module.exports = SoundCloudExtrator
