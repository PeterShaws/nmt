import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators";

import { Dictionary } from "./dictionary";

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
   * @returns {Observable<Dictionary>} An Observable of the loaded dictionary; or, in case of
   * failure, an empty dictionary (i.e., with the `language` property set to "none" and the
   * `entries` property set to an empty array).
   */
  private getDictionary$(language: string): Observable<Dictionary> {
    let dictionary = this.dictionaries.find(d => d.language === language);
    if (dictionary) {
      return of(dictionary);
    } else {
      return this.http.get<Dictionary>(`api/${language}`)
        .pipe(
          tap(d => d && this.dictionaries.push(d)),
          catchError(this.handleError('getDictionary$', { language: 'none', entries: [] }))
        );
    }
  }

  /**
   * Splits a sentence in tokens, removing any brackets from previous failed translations.
   *
   * @private
   * @param {string} sentence The sentence to be split.
   * @returns {Array<string>} A string array of the tokens contained in the sentence, minus any
   * square brackets.
   */
  private getTokens(sentence: string): Array<string> {
    if (sentence.length > 0) {
      return sentence.match(/([a-zA-Z'\-]+|[^a-zA-Z\[\]\s]+|[\s]+)/g);
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
   */
  private isWord(token: string): boolean {
    if (token.length > 0) {
      return !!token.trim().match(/^[a-zA-Z'\-]+$/);
    } else {
      return false;
    }
  }

  /**
   * Determines whether a word token has all its letters in uppercase.
   * 
   * @private
   * @param {string} token The token to be tested.
   * @returns {boolean} `true` if the token is a word and all of its letters are in uppercase;
   * `false` otherwise.
   */
  private isAllCaps(token: string): boolean {
    if (token.length > 0 && this.isWord(token)) {
      return token === token.toUpperCase();
    } else {
      return false;
    }
  }

  /**
   * Determines whether a word token is capitalized.
   * 
   * @private
   * @param {string} token The token to be tested.
   * @returns {boolean} `true` if the token is a word and consists of a capital letter followed by
   * zero or more lower case letters; `false` otherwise.
   */
  private isCapitalized(token: string): boolean {
    if (token.length > 0 && this.isWord(token)) {
      return !!token.trim().match(/^[A-Z][a-z\-']*$/);
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
   */
  private isEndOfSentence(token: string): boolean {
    if (token.length > 0) {
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
   */
  translateEnglishWord$(toLanguage: string, word: string, caps: boolean): Observable<string> {
    return this.getDictionary$(toLanguage).pipe(map(dictionary => {
      return this.translateEnglishWord(word, caps, dictionary);
    }));
  }

  /**
   * Translates a word from English to the language of the provided dictionary, synchronously.
   * 
   * @param {string} word The word to be translated.
   * @param {boolean} caps Whether to choose the capitalized or the common term.
   * @param {Dictionary} dictionary Use this dictionary instead for the translation.
   * @returns {string} The translated word.
   */
  translateEnglishWord(word: string, caps: boolean, dictionary: Dictionary): string {
    let translation = `[${word.replace(/[\[\]]/g, '')}]`;
    
    let entry = dictionary.entries.find(e => e.english.toLowerCase() == word.toLowerCase());
    if (entry) {
      if (this.isAllCaps(word) && entry.allCaps.length > 0) {
        translation = entry.allCaps.toUpperCase();
      } else if (this.isAllCaps(word) && entry.capitalized.length > 0) {
        translation = entry.capitalized.toUpperCase();
      } else if ((this.isCapitalized(word) || caps) && entry.capitalized.length > 0) {
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
   */
  translateAlienWord$(fromLanguage: string, word: string): Observable<string> {
    return this.getDictionary$(fromLanguage).pipe(map(dictionary => {
      return this.translateAlienWord(word, dictionary);
    }));
  }

  /**
   * Translate a word from the language of the provided dictionary to English, synchronously.
   * 
   * @param {string} word The word to be translated.
   * @param {Dictionary} dictionary Use this dictionary for the translation.
   * @returns {string} The translated word.
   */
  translateAlienWord(word: string, dictionary: Dictionary): string {
    let translation = `[${word.replace(/[\[\]]/g, '')}]`;

    let allCaps = dictionary.entries.find(e => e.allCaps == word);
    if (allCaps) {
      translation = allCaps.english.toUpperCase();
    } else {
      let capitalized = dictionary.entries.find(e => e.capitalized == word);
      if (capitalized) {
        translation = capitalized.english.replace(/^./, c => c.toUpperCase());
      } else {
        let common = dictionary.entries.find(e => e.common == word);
        if (common) {
          translation = common.english;
        }
      }
    }

    return translation;
  }

  /**
   * Translates a sentence from English to the target language, asynchronously.
   * 
   * @param {string} toLanguage The name of the target language.
   * @param {string} sentence The sentence to be translated.
   * @returns {Observable<string>} An Observable of the translated sentence.
   */
  translateEnglishSentence$(toLanguage: string, sentence: string): Observable<string> {
    return this.getDictionary$(toLanguage).pipe(map(dictionary => {
      return this.translateEnglishSentence(sentence, dictionary);
    }));
  }

  /**
   * Translates a sentence from English to the language of the provided dictionary, synchronously.
   * 
   * @param {string} sentence The sentence to be translated.
   * @param {Dictionary} dictionary Use this dictionary for the translation.
   * @returns {string} The translated sentence.
   */
  translateEnglishSentence(sentence: string, dictionary: Dictionary): string {
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
            let soFar = tokens.slice(0, i).reverse();
            let lastNonBlank = soFar.findIndex(t => t.trim().length > 0);
            if (lastNonBlank > 0 && !this.isEndOfSentence(soFar[lastNonBlank])) caps = false;
          }
  
          translatedToken = this.translateEnglishWord(token, caps, dictionary);
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
   */
  translateAlienSentence$(fromLanguage: string, sentence: string): Observable<string> {
    return this.getDictionary$(fromLanguage).pipe(map(dictionary => {
      return this.translateAlienSentence(sentence, dictionary);
    }))
  }

  /**
   * Translates a sentence from the language of the provided dictionary to English, synchronously.
   * 
   * @param {string} sentence The sentence to be translated.
   * @param {Dictionary} dictionary Use this dictionary for the translation.
   * @returns The translated sentence.
   */
  translateAlienSentence(sentence: string, dictionary: Dictionary) {
    let translation = '';

    let tokens = this.getTokens(sentence);
    if (tokens.length > 0) {
      let translated: string[] = [];

      for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        let translatedToken: string;
        if (this.isWord(token)) {
          translatedToken = this.translateAlienWord(token, dictionary);
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
   */
  private handleError<T>(operation: string = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed with error ${error.status} (${error.statusText}): ${error.message}`);
      return of(result as T);
    }
  }

}
