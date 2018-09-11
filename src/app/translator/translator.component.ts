import { Component, OnInit } from '@angular/core';

import { TranslatorService } from '../translator.service';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.css']
})
export class TranslatorComponent implements OnInit {

  private sentences = {
    english: 'How are you, traveller? Good, good! Great starship, the one you have there. Will we trade? No units required, the starship will be all. Now help me here!',
    gek: '',
    korvax: '',
    vykeen: ''
  }
  private labels = {
    english: 'English',
    gek: 'Gek',
    korvax: 'Korvax',
    vykeen: 'Vy’keen'
  }
  private languages: string[] = Object.keys(this.sentences);

  constructor(
    private translatorService: TranslatorService
  ) { }

  update(fromLanguage: string): void {
    switch (fromLanguage) {
      case 'english':
        for (let toLanguage in this.sentences) {
          if (toLanguage == 'english') continue;
          this.sentences[toLanguage] = this.translatorService.translateSentenceFromEnglish(toLanguage, this.sentences.english);
        }
        break;
      default:
        this.sentences.english = this.translatorService.translateSentenceToEnglish(fromLanguage, this.sentences[fromLanguage]);
        for (let toLanguage in this.sentences) {
          if (toLanguage == 'english' || toLanguage == fromLanguage) continue;
          this.sentences[toLanguage] = this.translatorService.translateSentenceFromEnglish(toLanguage, this.sentences.english);
        }
        break;
    };
  }

  ngOnInit() {
    this.update('english');
  }

}
