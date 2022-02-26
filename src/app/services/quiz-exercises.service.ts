import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Quiz} from "../entities/quiz";
import {Calculation} from "../entities/generators/math/calculation";
import {WordCategoryGen} from "../entities/generators/quiz/wordCategoryGen";
import {MemoNumbersOperatorsGen} from "../entities/generators/quiz/memoNumbersOperatorsGen";
import {Crazy} from "../entities/crazy";
import {CrazyNumbersGen} from "../entities/generators/crazy/crazyNumbersGen";
import {CrazyLettersGen} from "../entities/generators/crazy/crazyLettersGen";
import {CountryBorderGen} from "../entities/generators/quiz/countryBorderGen";
import {CountryBorderMultipleGen} from "../entities/generators/quiz/countryBorderMultipleGen";
import {WordScrambleQuizGen} from "../entities/generators/quiz/wordScrambleQuizGen";


@Injectable({
  providedIn: 'root'
})
export class QuizExercisesService {

  memoNrGen = new MemoNumbersOperatorsGen();
  calcQuiz = new WordCategoryGen();
  crazyDigitGen = new CrazyNumbersGen();
  crazyLetterGen = new CrazyLettersGen();
  countryPictureGen = new CountryBorderGen();
  countryMultiplePictureGen = new CountryBorderMultipleGen();
  wordScrambleQuizGen = new WordScrambleQuizGen();

  constructor(private translateService: TranslateService) { }

  private createConfig( baseLanguageKey:string ):object  {
    let configObject  = this.translateService.instant(baseLanguageKey);
    configObject["language"] = this.translateService.getDefaultLang();
    return configObject;
  }

  createWortCategoryQuiz( skill:string) : Quiz {

    this.calcQuiz.init(this.createConfig(WordCategoryGen.getConfigTag()));
    return this.calcQuiz.generate(this.translateService.getDefaultLang());
  }

  createMemoQuiz(skill:string): Quiz {
    this.memoNrGen.init( this.createConfig(MemoNumbersOperatorsGen.getConfigTag()));
    return this.memoNrGen.generate();
  }

  createCrazyNumberQuiz(skill:string): Crazy {
    this.crazyDigitGen.init( this.createConfig(CrazyNumbersGen.getConfigTag()));
    return this.crazyDigitGen.generate();
  }

  createCrazyLetterQuiz(skill:string): Crazy {
    this.crazyLetterGen.init( this.createConfig(CrazyLettersGen.getConfigTag()));
    return this.crazyLetterGen.generate();
  }

  createCountryBorder(skill:string): Quiz {
    this.countryPictureGen.init( this.createConfig(CountryBorderGen.getConfigTag()));
    return this.countryPictureGen.generate();
  }

  createCountryMultipleBorder(skill:string):Quiz {
    this.countryMultiplePictureGen.init( this.createConfig(CountryBorderMultipleGen.getConfigTag()));
    return this.countryMultiplePictureGen.generate();
  }

  createWordScrambleQuiz(skill:string):Quiz {
    this.wordScrambleQuizGen.init( this.createConfig(WordScrambleQuizGen.getConfigTag()));
    return this.wordScrambleQuizGen.generate(skill);
  }
}
