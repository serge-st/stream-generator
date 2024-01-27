export class ProgressAPI {
    public chunksParsed = 0;
    public isParsing = false;

    public reset() {
        this.isParsing = false;
        this.chunksParsed = 0;
    }

    public increment() {
        this.isParsing = true;
        this.chunksParsed++;
    }

    public getProgress() {
        if (!this.isParsing) return `Not started`;
        return `Progress: ${this.chunksParsed} chunks parsed`;
    }
}

export const progressAPI = new ProgressAPI();