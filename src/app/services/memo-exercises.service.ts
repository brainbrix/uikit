import { Injectable } from '@angular/core';
import {UtilService} from "./util.service";
import {ALL_WORDS_EN} from "./../entities/generators/data";
import {Quiz} from "../entities/quiz";
import {WordLengthGenerator} from "../entities/generators/memo/wordLengthGenerator";
import {WordPositionGenerator} from "../entities/generators/memo/wordPositionGenerator";
import {WordInListGenerator} from "../entities/generators/memo/wordInListGenerator";
import {TranslateService} from "@ngx-translate/core";
import {NumberGenerator} from "../entities/generators/memo/numberGen";

type exType = { result:number,operands : number[], operators:string[], answers: number[], expression:string};
export type MemoLevelType = { name:string, minWord:number, maxWord:number };

export const LEVELS : MemoLevelType[] = [
  {name:"Easy", minWord:5, maxWord:6 },
  {name:"Medium", minWord:6, maxWord:7 },
  {name:"Hard", minWord:7, maxWord:9}
]

@Injectable({
  providedIn: 'root'
})
export class MemoExercisesService {

  // Telefon, Star, SHAMROCK, finger left, finger right, Radiosactive, Peace, CAUTION SIGN, jin jang
  // public static SYMBOLS = ['&#x260F;','&#x2606;', '&#x2618;', '&#x261C;', '&#x261E;', '&#x2622;', '&#x262E;', '&#x2621;', '&#x262F;' ]

  wordPosGen: WordPositionGenerator;
  wordLengthGen: WordLengthGenerator;
  wordInListGen: WordInListGenerator;

  nrGen : NumberGenerator;

  constructor(private translateService: TranslateService) {
    this.wordPosGen = new WordPositionGenerator();
    this.wordLengthGen = new WordLengthGenerator();
    this.wordInListGen = new WordInListGenerator();
    this.nrGen = new NumberGenerator();
  }

  private createConfig( baseLanguageKey:string ):object  {
    let configObject  = this.translateService.instant(baseLanguageKey);
    configObject["language"] = this.translateService.getDefaultLang();
    return configObject;
  }

  createExerciseCall( skill:string) : Quiz {
    let selectedLevel = LEVELS.find(e=>e.name == skill) as MemoLevelType;
    if (skill == '') {
      selectedLevel = LEVELS[Math.floor(Math.random()*LEVELS.length)];
    }
    return this.createExercise( selectedLevel );
  }

  createExercise( selectedLevel : MemoLevelType) : Quiz {
    let select = Math.floor(Math.random()*3);
    if ( select < 1) {
      this.wordPosGen.init( this.createConfig(WordPositionGenerator.getConfigTag()) );
      return this.wordPosGen.generate(selectedLevel);
    } else if ( select < 2) {
      this.wordLengthGen.init( this.createConfig(WordLengthGenerator.getConfigTag()) );
      return this.wordLengthGen.generate(selectedLevel);
    } else {
      this.wordInListGen.init( this.createConfig(WordInListGenerator.getConfigTag()) );
      return this.wordInListGen.generate(selectedLevel);
    }
  }

  createNrExercise() : Quiz {
    this.nrGen.init(this.createConfig(NumberGenerator.getConfigTag()));
    let selectedLevel = LEVELS[Math.floor(Math.random()*LEVELS.length)];
    return this.nrGen.generate(selectedLevel) ;
  }


//    q2.text2 = "Which word was in the list before?";

    //q1.text2 = "Which word was the first, last, second in the list?"
    //q1.text2 = "How many letters had the longest, shortest word(s) in the list?"
    //q1.text2 = "How many letters had the first, last, second word in the list?

    //q1.text2 = "Which word was the longest word in the list?"
    //q1.text2 = "Which word was the shortest word in the list?"
    // How many words in the list started with/Contain the letter A?

  private static getRandomWord() : string {
    let word = ALL_WORDS_EN[ UtilService.randomValue(0, ALL_WORDS_EN.length-1)];
    return word;
  }

  private static getRandomWordFromList(wordList : string[]) : string {
    let word = wordList[ UtilService.randomValue(0,wordList.length-1)];
    return word;
  }

  public static getRandomWordWithFn(wordList : string[], callback: (n: string) => boolean ) : string {
    let word = "";
    do {
      word = wordList[ UtilService.randomValue(0,wordList.length-1)];
    } while (!callback( word ));
    return word;
  }

  private static getRandomWordsWithFn(wordList : string[], count:number, callback: (n: string) => boolean ) : string[] {
    let wordResultList : string[] = [];
    while ( wordResultList.length < count) {
      let word = "";
      do {
        word = wordList[UtilService.randomValue(0, wordList.length - 1)];
      } while (!callback(word));
      if ( !wordResultList.includes(word))
        wordResultList.push(word);
    }
    return wordResultList;
  }

  private static getRandomWords( wordList: string[], count: number) : string[] {
    let wordResultList : string[] = [];
    while ( wordResultList.length < count) {
      let word = this.getRandomWordFromList( wordList );
      if ( !wordResultList.includes(word)) {
        wordResultList.push( word );
      }
    }
    return wordResultList;
  }
}
