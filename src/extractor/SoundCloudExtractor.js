const BaseExtractor = require('../structures/BaseExtractor')
const fetch = require('node-fetch')
class SoundCloudExtrator extends BaseExtractor {
    constructor () {
        super('soundcloud')
        this.APP_SCRIPT_REGEX = new RegExp('https://[A-Za-z0-9-.]+/assets/app-[a-f0-9-]+\\.js');
        this.APP_SCRIPT_CLIENT_ID_REGEX = new RegExp(',client_id:"([a-zA-Z0-9-_]+)"');
    }

    async parseClientID () {
    }

    parse () {
        
    }
}
module.exports = SoundCloudExtrator