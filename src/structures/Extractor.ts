import { MediaInfo } from "./MediaInfo";

export abstract class Extractor {
    constructor (public readonly name: string) {
        this.name = name;
    }

    public abstract get (query: string): Promise<MediaInfo | null>;

    protected createMediaInfo(title: string, artist: string, album: string, thumbnailURL: string): MediaInfo {
        return new MediaInfo(this.name, title, artist, album, thumbnailURL);
    }
}