export class Song {
  id: string;
  name: string;
  composer: string;
  arranger: string;
  lyricist: string;
  bpm: number;
  notes: Note[];
  end: number;

  constructor();
  constructor(
    id: string,
    name: string,
    composer: string,
    arranger: string,
    lyricist: string,
    bpm: number,
    notes: Note[],
    end: number,
  );
  constructor(
    id?: string,
    name?: string,
    composer?: string,
    arranger?: string,
    lyricist?: string,
    bpm?: number,
    notes?: Note[],
    end?: number,
  ) {
    this.id = id ? id : "";
    this.name = name ? name : "";
    this.composer = composer ? composer : "";
    this.arranger = arranger ? arranger : "";
    this.lyricist = lyricist ? lyricist : "";
    this.bpm = bpm ? bpm : 0;
    this.notes = notes ? notes : [];
    this.end = end ? end : 0;
  }

  toBlob(): Blob {
    return new Blob([JSON.stringify(this)], { type: "application/json" });
  }
}

export class Note {
  timing: number;
  key: string;

  constructor(timing: number, key: string) {
    this.timing = timing;
    this.key = key;
  }
}
