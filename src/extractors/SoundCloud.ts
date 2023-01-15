import { Extractor } from "../structures/Extractor";
import { MediaInfo } from "../structures/MediaInfo";
import { TTLCache } from "../structures/TTLCache";
import { fetch } from "undici";
import { ParseError } from "../structures/ParseError";

interface SoundCloudStub {
  title: string;
  user: {
    username: string;
  };
  artwork_url: string;
  publisher_metadata: {
    id: number,
    urn: string,
    artist: string,
    album_title: string,
    contains_music: boolean
  }
}


// "publisher_metadata": {
//   "id": 1360197958,
//   "urn": "soundcloud:tracks:1360197958",
//   "artist": "윤하 (YOUNHA)",
//   "album_title": "YOUNHA 6th Album Repackage 'END THEORY : Final Edition'",
//   "contains_music": true
// },

export class SoundCloudExtractor extends Extractor {
  private APP_SCRIPT_REGEX: RegExp;
  private APP_SCRIPT_CLIENT_ID_REGEX: RegExp;
  private VALID_URL_REGEX: RegExp;
  private SC_URL: string;
  private SC_API_V2_BASE: string;
  private cache: TTLCache;

  constructor() {
    super("SoundCloud");
    this.APP_SCRIPT_REGEX = /<script.*?src="(.*?)"/gi;
    this.APP_SCRIPT_CLIENT_ID_REGEX = /,client_id:"(([a-zA-Z0-9-_]+))"/g;
    this.VALID_URL_REGEX =
      /(https?:\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()[\]{};:'".,<>?«»“”‘’]))?/;
    this.SC_URL = "http://soundcloud.com/";
    this.SC_API_V2_BASE = "https://api-v2.soundcloud.com/";
    this.cache = new TTLCache(15 * 60 * 1000); // 15 minutes
  }

  public override async get(query: string): Promise<MediaInfo | null> {
    if (!this.VALID_URL_REGEX.test(query))
      throw new Error("Invalid url provided");
    const searchParams = await this.getParamsURL(query);
    const soundcloudResult = await (await fetch(searchParams.toString())).json() as SoundCloudStub;
    if (Object.keys(soundcloudResult).length == 0) return null;
    const { title, user, artwork_url, publisher_metadata } = soundcloudResult;
    return await this.createMediaInfo(
      title,
      publisher_metadata.artist || user.username,
      publisher_metadata.album_title || user.username,
      artwork_url
      );
  }

  /**
   * Get the client ID from the SoundCloud website
   * @returns {Promise<string>} The soundcloud api client id
   */
  private async getClientId(): Promise<string> {
    const clientId = this.cache.get("clientId");
    if (clientId) return clientId;
    return await this.parseClientId();
  }

  /**
   * Parse soundcloud api client id from the parsed script urls
   * @returns {Promise<string>} The soundcloud api client id
   */
  private async parseClientId(): Promise<string> {
    // Get soundcloud html
    const html = await fetch(this.SC_URL).then((res) => res.text());
    // Get script urls from html
    const scriptURLs = this.parseScriptURLsFromHTML(html);
    if (scriptURLs.length == 0)
      throw new ParseError("Could not parse script urls from soundcloud html");
    // Get scripts from script urls
    const scripts = await Promise.all(
      scriptURLs.map((url) => fetch(url).then((res) => res.text()))
    );
    // Find script that includes client id
    const script = scripts.find((script) => script.includes("client_id"));
    if (!script)
      throw new ParseError(
        "Could not find script that includes soundcloud client id"
      );
    const clientId = this.APP_SCRIPT_CLIENT_ID_REGEX.exec(script)[1];
    // Store client id to cache
    this.cache.set("clientId", clientId);
    return clientId;
  }

  /**
   * Parse script urls from soundcloud html
   * @param {string} html The soundcloud html
   * @returns {string[]} The soundcloud script urls
   */
  private parseScriptURLsFromHTML(html: string): string[] {
    return html
      .match(this.APP_SCRIPT_REGEX) // <script src="??"> tags
      .map((scriptTag) => scriptTag.match(this.VALID_URL_REGEX)[0]) // Check if url is valid soundcloud url
      .reverse();
  }

  /**
   * Get soundcloud api url with query params
   * @param query Soundcloud track url
   * @returns {URL} URL Object with query params
   */
  private async getParamsURL(query): Promise<URL> {
    const searchURL = new URL("resolve", this.SC_API_V2_BASE);
    searchURL.searchParams.append("client_id", await this.getClientId());
    searchURL.searchParams.append("url", query);
    return searchURL;
  }
}
