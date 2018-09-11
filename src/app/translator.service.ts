import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map } from "rxjs/operators";

import { Dictionary } from "./dictionary";
import { all } from 'q';

@Injectable({
  providedIn: 'root'
})
export class TranslatorService {

  private dictionaries: {
    gek: Dictionary,
    korvax: Dictionary,
    vykeen: Dictionary
  }

  constructor(
    private http: HttpClient
  ) {
    for (let language in this.dictionaries) {
      this.getDictionary(language)
        .subscribe(d => this.dictionaries[language] = d);
    }
  }

  /**
   * Attempts to load the dictionary for the named language.
   *
   * @private
   * @param {string} language name of the language whose dictionary is to be loaded
   * @returns {Observable<Dictionary>} an Observable for the loaded dictionary
   * @memberof TranslatorService
   */
  private getDictionary(language: string): Observable<Dictionary> {
    if (this.dictionaries && this.dictionaries[language]) {
      return of(this.dictionaries[language]);
    } else {
      return this.http.get<Dictionary>(`api/${language}`)
        .pipe(
          catchError(this.handleError('getDictionary', { language: 'none', entries: [] }))
        );
    }
  }

  /**
   * Splits a sentence in tokens.
   *
   * @private
   * @param {string} sentence the sentence to be split
   * @returns {string[]} the tokens which comprise the sentence
   * @memberof TranslatorService
   */
  private getTokens(sentence: string): string[] {
    if (typeof sentence === 'string' && sentence.length > 0) {
      return sentence.match(/([a-zA-Z'\-]+|[^a-zA-Z\s]+|[\s]+)/g);
    } else {
      return [];
    }
  }

  /**
   * Determines whether a token is a word.
   *
   * @private
   * @param {string} token the token to be tested
   * @returns {boolean} `true` if the token is a word; `false` otherwise.
   * @memberof TranslatorService
   */
  private isWord(token: string): boolean {
    if (typeof token === 'string' && token.length > 0) {
      return !!token.trim().match(/^[a-zA-Z'\-]+$/);
    } else {
      return false;
    }
  }

  /**
   * Determines whether a token consists of sentence-ending punctuation.
   *
   * @private
   * @param {string} token the token to be tested
   * @returns {boolean} `true` if the token consists of sentence-ending punctuation; `false` otherwise.
   * @memberof TranslatorService
   */
  private isEndOfSentence(token: string): boolean {
    if (typeof token === 'string' && token.length > 0) {
      return !!token.trim().match(/^[.?!]+$/);
    } else {
      return false;
    }
  }

  translateEnglishWord(toLanguage: string, word: string, caps: boolean): Observable<string> {
    return this.getDictionary(toLanguage).pipe(map(dictionary => {
      let translation = word.toUpperCase();
      let entry = dictionary.entries.find(e => e.english.toLowerCase() == word.toLowerCase());

      if (entry) {
        if (caps && entry.allCaps.length > 0) {
          translation = entry.allCaps;
        } else if (caps && entry.capitalized.length > 0) {
          translation = entry.capitalized;
        } else {
          translation = entry.common;
        }
      }

      return translation;
    }));
  }

  translateWordFromEnglish(toLanguage: string, word: string, caps: boolean, dictionary?: Dictionary): string {
    let translation = word.toUpperCase();

    // if (this.dictionaries[toLanguage]) {
    //   let dictionary: Dictionary = this.dictionaries[toLanguage];
      dictionary = dictionary || this.dictionaries[toLanguage];

      let entry = dictionary.entries.find(e => e.english.toLowerCase() == word.toLowerCase());

      if (entry) {
        if (caps && entry.capitalized.length > 0) {
          translation = entry.capitalized;
        } else {
          translation = entry.common;
        }
      }
    // }

    return translation;
  }

  translateAlienWord(fromLanguage: string, word: string): Observable<string> {
    return this.getDictionary(fromLanguage).pipe(map(dictionary => {
      let translation = word.toUpperCase();

      let allCaps = dictionary.entries.find(e => e.allCaps.toLowerCase() == word.toLowerCase());
      if (allCaps) {
        translation = allCaps.english;
      } else {
        let capitalized = dictionary.entries.find(e => e.capitalized.toLowerCase() == word.toLowerCase());
        if (capitalized) {
          translation = capitalized.english.replace(/^./, c => c.toUpperCase());
        } else {
          let common = dictionary.entries.find(e => e.common.toLowerCase() == word.toLowerCase());
          if (common) {
            translation = common.english;
          }
        }
      }

      return translation;
    }));
  }

  translateWordToEnglish(fromLanguage: string, word: string, dictionary?: Dictionary): string {
    let translation = word.toUpperCase();

    // if (this.dictionaries[fromLanguage]) {
      // let dictionary: Dictionary = this.dictionaries[fromLanguage];
      dictionary = dictionary || this.dictionaries[fromLanguage];

      let allCaps = dictionary.entries.find(e => e.allCaps.toLowerCase() == word.toLowerCase());
      let capitalized = dictionary.entries.find(e => e.capitalized.toLowerCase() == word.toLowerCase());
      let common = dictionary.entries.find(e => e.common.toLowerCase() == word.toLowerCase());

      if (allCaps) {
        translation = allCaps.english;
      } else if (capitalized) {
        translation = capitalized.english.replace(/^./, c => c.toUpperCase());
      } else if (common) {
        translation = common.english;
      }
    // }

    return translation;
  }

  translateEnglishSentence(toLanguage: string, sentence: string): Observable<string> {
    return this.getDictionary(toLanguage).pipe(map(dictionary => {
      let translation = '';
      
      let tokens = this.getTokens(sentence);
      if (tokens.length > 0) {
        let translated: string[] = [];
        
        for (let i = 0; i < tokens.length; i++) {
          let token = tokens[i];
          let translatedToken: string;
          
          if (this.isWord(token)) {
            let caps = true;
            
            if (i > 0) {
              let prevPunctuation: string[] = [];
              
              for (let j = i - 1; j >= 0 && (tokens[j].trim().length == 0 || this.isEndOfSentence(tokens[j])); j--) {
                if (tokens[j].trim().length > 0) {
                  prevPunctuation.push(tokens[j]);
                }
              }
              
              if (prevPunctuation.length == 0) {
                caps = false;
              }
            }
            
            translatedToken = this.translateWordFromEnglish(toLanguage, token, caps, dictionary);
          } else {
            translatedToken = token;
          }
          translated.push(translatedToken);
        }
        
        translation = translated.join('');
      }
      
      return translation;
    }));
  }

  translateSentenceFromEnglish(toLanguage: string, sentence: string, dictionary?: Dictionary): string {
    let translation = '';
    
    let tokens = this.getTokens(sentence);
    if (tokens.length > 0) {
      let translated: string[] = [];
  
      for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        let translatedToken: string;
  
        if (this.isWord(token)) {
          let caps = true;
  
          if (i > 0) {
            let prevPunctuation: string[] = [];
  
            for (let j = i - 1; j >= 0 && (tokens[j].trim().length == 0 || this.isEndOfSentence(tokens[j])); j--) {
              if (tokens[j].trim().length > 0) {
                prevPunctuation.push(tokens[j]);
              }
            }

            if (prevPunctuation.length == 0) {
              caps = false;
            }
          }
  
          translatedToken = this.translateWordFromEnglish(toLanguage, token, caps, dictionary);
        } else {
          translatedToken = token;
        }
        translated.push(translatedToken);
      }

      translation = translated.join('');
    }

    return translation;
  }

  translateAlienSentence(fromLanguage: string, sentence: string): Observable<string> {
    return this.getDictionary(fromLanguage).pipe(map(dictionary => {
      let translation = '';

      let tokens = this.getTokens(sentence);
      if (tokens.length > 0) {
        let translated: string[] = [];

        for (let i = 0; i < tokens.length; i++) {
          let token = tokens[i];
          let translatedToken: string;
          if (this.isWord(token)) {
            translatedToken = this.translateWordToEnglish(fromLanguage, token, dictionary);
          } else {
            translatedToken = token;
          }
          translated.push(translatedToken);
        }

        translation = translated.join('');
      }

      return translation;
    }))
  }

  translateSentenceToEnglish(fromLanguage: string, sentence: string, dictionary?: Dictionary) {
    let translation = '';

    let tokens = this.getTokens(sentence);
    if (tokens.length > 0) {
      let translated: string[] = [];

      for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        let translatedToken: string;
        if (this.isWord(token)) {
          translatedToken = this.translateWordToEnglish(fromLanguage, token, dictionary);
        } else {
          translatedToken = token;
        }
        translated.push(translatedToken);
      }

      translation = translated.join('');
    }

    return translation;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed with error ${error.status} (${error.statusText}):`);
      console.error(error.message);
      return of(result as T);
    }
  }

}
