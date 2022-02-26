import { Injectable } from '@angular/core';
import {Unscramble} from "../entities/unscramble";
import {ExpressionUnscramble} from "../entities/generators/order/expressionUnscramble";
import {WordUnscramble} from "../entities/generators/order/wordUnscramble";
import {TranslateService} from "@ngx-translate/core";

export type UnscrambleLevelType = { name:string, minWordLength:number, maxWordLength:number };

export const LEVELS : UnscrambleLevelType[] = [
  {name:"Easy", minWordLength:3, maxWordLength:5 },
  {name:"Medium", minWordLength:6, maxWordLength:7 },
  {name:"Hard", minWordLength:8, maxWordLength:12}
]

@Injectable({
  providedIn: 'root'
})
export class UnscrambleExercisesService {

  expressionUnscrambleGen = new ExpressionUnscramble( );
  wordUnscrambleGen = new WordUnscramble();

  constructor(private translateService: TranslateService) { }

  createExerciseCall( skill:string) : Unscramble {
    let selectedLevel = LEVELS.find(e=>e.name == skill) as UnscrambleLevelType;
    if (skill == '') {
      selectedLevel = LEVELS[Math.floor(Math.random()* LEVELS.length)];
    }
    return this.createExercise( selectedLevel );
  }

  createExercise( selectedLevel : UnscrambleLevelType) : Unscramble {
    let config  = this.translateService.instant(WordUnscramble.getConfigTag());
    config.language = this.translateService.getDefaultLang();
    this.wordUnscrambleGen.init( config );
    return this.wordUnscrambleGen.generate(selectedLevel);
  }

  createMath(): Unscramble  {
    let config  = this.translateService.instant(ExpressionUnscramble.getConfigTag());
    config.language = this.translateService.getDefaultLang();
    this.expressionUnscrambleGen.init( config );
    return this.expressionUnscrambleGen.generate(LEVELS[1]);
  }
}
