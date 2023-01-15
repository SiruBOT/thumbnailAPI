export class MediaInfo {
    public readonly extractor: string
    public readonly title: string
    public readonly artist: string
    public readonly album: string
    public readonly thumbnailURL: string

    constructor (extractor: string, title: string, artist: string, album: string, thumbnailURL: string) {
        this.extractor = extractor
        this.title = title
        this.artist = artist
        this.album = album
        this.thumbnailURL = thumbnailURL
    }
    
    public toJSON(): string {
        return JSON.stringify({
            extractor: this.extractor,
            title: this.title,
            artist: this.artist,
            album: this.album,
            thumbnail: this.thumbnailURL
        })
    }
}