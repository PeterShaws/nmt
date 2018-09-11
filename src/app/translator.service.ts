import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators";

import { Dictionary } from "./dictionary";
import { all } from 'q';

@Injectable({
  providedIn: 'root'
})
export class TranslatorService {

  private dictionaries: Array<Dictionary> = [];

  constructor(private http: HttpClient) { }

  /**
   * Attempts to load the dictionary for the named language, caching it if the load is successful.
   *
   * @private
   * @param {string} language The name of the language whose dictionary is to be loaded.
   * @returns {Observable<Dictionary>} An Observable of the loaded dictionary.
   * @memberof TranslatorService
   */
  private getDictionary(language: string): Observable<Dictionary> {
    let dictionary = this.dictionaries.find(d => d.language === language);
    if (dictionary) {
      return of(dictionary);
    } else {
      return this.http.get<Dictionary>(`api/${language}`)
        .pipe(
          tap(d => d && this.dictionaries.push(d)),
          catchError(this.handleError('getDictionary', { language: 'none', entries: [] }))
        );
    }
  }

  /**
   * Splits a sentence in tokens.
   *
   * @private
   * @param {string} sentence The sentence to be split.
   * @returns {Array<string>} A string array containing the tokens contained in the sentence.
   * @memberof TranslatorService
   */
  private getTokens(sentence: string): Array<string> {
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
   * @param {string} token The token to be tested.
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
   * @param {string} token The token to be tested.
   * @returns {boolean} `true` if the token consists of sentence-ending punctuation;
   * `false` otherwise.
   * @memberof TranslatorService
   */
  private isEndOfSentence(token: string): boolean {
    if (typeof token === 'string' && token.length > 0) {
      return !!token.trim().match(/^[.?!]+$/);
    } else {
      return false;
    }
  }

  /**
   * Translates a word from English to the target language, asynchronously.
   * 
   * @param {string} toLanguage The name of the target language.
   * @param {string} word The word to be translated.
   * @param {boolean} caps Whether to choose the capitalized or the common term.
   * @returns {Observable<string>} An Observable of the translated word.
   * @memberof TranslatorService
   */
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

  /**
   * Translates a word from English to the target language, synchronously.
   * 
   * @param {string} toLanguage The name of the target language.
   * @param {string} word The word to be translated.
   * @param {boolean} caps Whether to choose the capitalized or the common term.
   * @param {Dictionary} [dictionary] If provided, use this dictionary instead of the cached one.
   * @returns {string} The translated word.
   * @memberof TranslatorService
   */
  translateWordFromEnglish(toLanguage: string, word: string, caps: boolean, dictionary?: Dictionary): string {
    let translation = word.toUpperCase();

    dictionary = dictionary || this.dictionaries.find(d => d.language === toLanguage);

    let entry = dictionary.entries.find(e => e.english.toLowerCase() == word.toLowerCase());

    if (entry) {
      if (caps && entry.capitalized.length > 0) {
        translation = entry.capitalized;
      } else {
        translation = entry.common;
      }
    }

    return translation;
  }

  /**
   * Translate a word from a source language to English, asynchronously.
   * 
   * @param {string} fromLanguage The name of the source language.
   * @param {string} word The word to be translated.
   * @returns {Observable<string>} An Observable of the translated word.
   * @memberof TranslatorService
   */
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

  /**
   * Translate a word from a source language to English, synchronously.
   * 
   * @param {string} fromLanguage The name of the source language.
   * @param {string} word The word to be translated.
   * @param {Dictionary} [dictionary] If provided, use this dictionary instead of the cached one.
   * @returns {string} The translated word.
   * @memberof TranslatorService
   */
  translateWordToEnglish(fromLanguage: string, word: string, dictionary?: Dictionary): string {
    let translation = word.toUpperCase();

    dictionary = dictionary || this.dictionaries.find(d => d.language === fromLanguage);

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

    return translation;
  }

  /**
   * Translates a sentence from English to the target language, asynchronously.
   * 
   * @param {string} toLanguage The name of the target language.
   * @param {string} sentence The sentence to be translated.
   * @returns {Observable<string>} An Observable of the translated sentence.
   * @memberof TranslatorService
   */
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

  /**
   * Translates a sentence from English to the target language, synchronously.
   * 
   * @param {string} toLanguage The name of the target language.
   * @param {string} sentence The sentence to be translated.
   * @param {Dictionary} [dictionary] If provided, use this dictionary instead of the cached one.
   * @returns {string} The translated sentence.
   * @memberof TranslatorService
   */
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

  /**
   * Translates a sentence from a source language to English, asynchronously.
   * 
   * @param {string} fromLanguage The name of the source language.
   * @param {string} sentence The sentence to be translated.
   * @returns {Observable<string>} An Observable of the translated sentence.
   * @memberof TranslatorService
   */
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

  /**
   * Translates a sentence from a source language to English, synchronously.
   * 
   * @param {string} fromLanguage The name of the source language.
   * @param {string} sentence The sentence to be translated.
   * @param {Dictionary} [dictionary] If provided, use this dictionary instead of the cached one.
   * @returns The translated sentence.
   * @memberof TranslatorService
   */
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

  /**
   * Logs an error and returns an optional valid result to the caller.
   * 
   * @private
   * @template T The type of the expected result.
   * @param {string} [operation='operation'] The name of the operation.
   * @param {T} [result] An optional valid result.
   * @returns An Observable of the result.
   * @memberof TranslatorService
   */
  private handleError<T>(operation: string = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed with error ${error.status} (${error.statusText}): ${error.message}`);
      return of(result as T);
    }
  }

}
