import { Injectable } from '@angular/core';
import {Quiz} from "../entities/quiz";
import {RomanCalculation} from "../entities/generators/math/romanCalculation";
import {Calculation} from "../entities/generators/math/calculation";
import {RomanNumeralQuiz} from "../entities/generators/math/romanNumeralQuiz";
import {TranslateService} from "@ngx-translate/core";

export type exType = { result:number,operands : number[], operators:string[], answers: number[], expression:string};
export type MathLevelType = { name:string, minOperands:number, maxOperands:number; countOperators:number, operators:string[] };
export const LEVELS : MathLevelType[] = [
  {name:"Easy", minOperands:-10, maxOperands:20, countOperators:2, operators:['+', '-']},
  {name:"Medium", minOperands:-20, maxOperands:25, countOperators:3, operators:['+', '-', '*']},
  {name:"Hard", minOperands:-50, maxOperands:50, countOperators:3, operators:['+', '-', '*']}
]
@Injectable({
  providedIn: 'root'
})
export class MathExercisesService {

  romanQuiz = new RomanNumeralQuiz();
  romanCalcQuiz = new RomanCalculation();
  calcQuiz = new Calculation();

  constructor(private translateService: TranslateService) {
    let language = this.translateService.currentLang;
    console.log("Language used: ", language);
    let translateStr = translateService.instant('HOME.linkTitleWebsite');
    console.log("translateStr ", translateStr);
  }

  createExerciseCall( skill:string) : Quiz {
    let selectedLevel = LEVELS.find(e=>e.name == skill) as MathLevelType;
    if (skill == '') {
      selectedLevel = LEVELS[Math.floor(Math.random()*LEVELS.length)];
    }

    let configObj  = this.translateService.instant(Calculation.getConfigTag());
    this.calcQuiz.init(configObj);
    return this.calcQuiz.generate(selectedLevel);
  }

  createExerciseRomanCall( skill:string) : Quiz {
    let selectedLevel = LEVELS.find(e=>e.name == skill) as MathLevelType;
    if (skill == '') {
      selectedLevel = LEVELS[Math.floor(Math.random()*LEVELS.length)];
    }

    let configObj  = this.translateService.instant(RomanCalculation.getConfigTag());
    this.romanCalcQuiz.init(configObj);
    return this.romanCalcQuiz.generate(selectedLevel);
  }

  createExerciseRomanQuizCall( skill:string) : Quiz {
    let selectedLevel = LEVELS.find(e=>e.name == skill) as MathLevelType;
    if (skill == '') {
      selectedLevel = LEVELS[Math.floor(Math.random()*LEVELS.length)];
    }

    let configObj  = this.translateService.instant(RomanNumeralQuiz.getConfigTag());
    this.romanQuiz.init(configObj);
    return this.romanQuiz.generate(selectedLevel);
  }
}
