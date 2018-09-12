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

  /**
   * Updates the language boxes using the specified language as the source.
   * 
   * @param {string} fromLanguage the name of the source language
   */
  update(fromLanguage: string): void {
    if (this.sentences[fromLanguage].length == 0) {  // No need to translate an empty sentence
      for (let toLanguage in this.sentences) {
        this.sentences[toLanguage] = ''
      }
    } else {
      if (fromLanguage === 'english') {
        for (let toLanguage in this.sentences) {
          if (toLanguage !== 'english') {
            this.translatorService.translateEnglishSentence$(toLanguage, this.sentences.english)
              .subscribe(translation => this.sentences[toLanguage] = translation);
          }
        }
      } else {
        this.translatorService.translateAlienSentence$(fromLanguage, this.sentences[fromLanguage])
          .subscribe(translation => {
            this.sentences.english = translation;
            for (let toLanguage in this.sentences) {
              if (toLanguage !== 'english' && toLanguage !== fromLanguage) {
                this.translatorService.translateEnglishSentence$(toLanguage, translation)
                  .subscribe(translation => this.sentences[toLanguage] = translation);
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
