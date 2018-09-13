import { Component, OnInit } from '@angular/core';

import { TranslatorService } from '../translator.service';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.scss']
})
export class TranslatorComponent implements OnInit {

  private languages = {
    english: {
      label: 'English',
      sentence: 'There. You will have this gift. We must grant it to you, for it is a knowledge you cannot escape. Now follow the truth, and be our eyes. You will leave us here and seek to know what is real: such is your reward.'
    },
    gek:    { label: 'Gek',     sentence: '' },
    korvax: { label: 'Korvax',  sentence: '' },
    vykeen: { label: 'Vy’keen', sentence: '' },
    atlas:  { label: 'Atlas',   sentence: '' }
  }
  languageNames: string[] = Object.keys(this.languages);
  title = 'No Man’s Translator';

  constructor(
    private translatorService: TranslatorService
  ) { }

  /**
   * Updates the language boxes using the specified language as the source.
   * 
   * @param {string} fromLanguage the name of the source language
   */
  update(fromLanguage: string): void {
    if (this.languages[fromLanguage].sentence.length == 0) {  // No need to translate an empty sentence
      for (let toLanguage in this.languages) {
        this.languages[toLanguage].sentence = ''
      }
    } else {
      if (fromLanguage === 'english') {
        for (let toLanguage in this.languages) {
          if (toLanguage !== 'english') {
            this.translatorService.translateEnglishSentence$(toLanguage, this.languages.english.sentence)
              .subscribe(alienTranslation => this.languages[toLanguage].sentence = alienTranslation);
          }
        }
      } else {
        this.translatorService.translateAlienSentence$(fromLanguage, this.languages[fromLanguage].sentence)
          .subscribe(englishTranslation => {
            this.languages.english.sentence = englishTranslation;
            for (let toLanguage in this.languages) {
              if (toLanguage !== 'english' && toLanguage !== fromLanguage) {
                this.translatorService.translateEnglishSentence$(toLanguage, englishTranslation)
                  .subscribe(alienTranslation => this.languages[toLanguage].sentence = alienTranslation);
              }
            }
          });
      }
    }
  }

  ngOnInit() {
    this.update('english');
  }

}
