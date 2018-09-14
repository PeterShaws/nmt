import { Component, AfterViewInit } from '@angular/core';

import { TranslatorService } from '../translator.service';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.scss']
})
export class TranslatorComponent implements AfterViewInit {

  private defaultSentence = [
    'There. You will have this gift.',
    'We must grant it to you, for it is a knowledge you cannot escape.',
    'Now follow the truth, and be our eyes.',
    'You will leave us here and seek to know what is real: such is your reward.'
  ].join(' ');
  private languages = {
    english: { label: 'English', sentence: this.defaultSentence },
    gek:     { label: 'Gek',     sentence: '' },
    korvax:  { label: 'Korvax',  sentence: '' },
    vykeen:  { label: 'Vy’keen', sentence: '' },
    atlas:   { label: 'Atlas',   sentence: '' }
  };
  languageNames: string[] = Object.keys(this.languages);
  title = 'No Man’s Translator';

  constructor(private translatorService: TranslatorService) { }

  /**
   * Updates the language boxes using the specified textarea as the source for the translation.
   *
   * @param {HTMLTextAreaElement} textArea The textarea to be used as the translation source.
   */
  update(textArea: HTMLTextAreaElement): void {
    const fromLanguage = textArea.dataset.language;

    if (this.languages[fromLanguage].sentence.length === 0) {  // No need to translate an empty sentence
      for (const toLanguage in this.languages) {
        if (this.languages.hasOwnProperty(toLanguage)) {
          this.languages[toLanguage].sentence = '';
        }
      }
    } else {
      if (fromLanguage === 'english') {
        for (const toLanguage in this.languages) {
          if (toLanguage !== 'english') {
            this.translatorService.translateEnglishSentence$(toLanguage, this.languages.english.sentence)
              .subscribe(alienTranslation => this.languages[toLanguage].sentence = alienTranslation);
          }
        }
      } else {
        this.translatorService.translateAlienSentence$(fromLanguage, this.languages[fromLanguage].sentence)
          .subscribe(englishTranslation => {
            this.languages.english.sentence = englishTranslation;
            for (const toLanguage in this.languages) {
              if (toLanguage !== 'english' && toLanguage !== fromLanguage) {
                this.translatorService.translateEnglishSentence$(toLanguage, englishTranslation)
                  .subscribe(alienTranslation => this.languages[toLanguage].sentence = alienTranslation);
              }
            }
          });
      }
    }
  }

  ngAfterViewInit() {
    this.update(document.getElementById('text-area-english') as HTMLTextAreaElement);
  }

}
