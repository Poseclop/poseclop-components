import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'chapter'})
export class ChapterPipe implements PipeTransform {
  private chapters?: { title: string; time: number; }[];

  transform(seconds: number, chapters: { title: string; time: number; }[]): string {
    if (!this.chapters) {
      this.chapters = [...chapters].sort((a, b) => b.time - a.time);
    }
    const chapter = this.chapters.find(chapter => seconds >= chapter.time);
    return chapter ? chapter.title : '';
  }
}
