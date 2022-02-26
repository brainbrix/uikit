import {
  getRandomWordsWithFn,
  notInList
} from "./../gen";

import {WordLengthGenerator} from "./wordLengthGenerator";

export class WordPositionGenerator extends WordLengthGenerator {

  template3 = "";
  template4 = "";

  constructor() {
    super();
  }

  public static getConfigTag() : string {
    return "GEN_MEMO.WORD_POSITION";
  }

  public init(configObj: any) {
    super.init( configObj);
    this.template3 = configObj["text3"];
    this.template4 = configObj["text4"];
  }

  protected getAnswers( ):void {
    let select = Math.floor(Math.random()*4);
    let correctWord = this.wordsInExercise[0];
    //this.text2 = "Which word was the first in the list?";
    this.text2 = this.template1;
    if ( select == 1) {
      correctWord = this.wordsInExercise[1];
      //this.text2 = "Which word was the second in the list?";
      this.text2 = this.template2;
    } else if ( select == 2) {
      correctWord = this.wordsInExercise[this.wordsInExercise.length-1];
      //this.text2 = "Which word was the last in the list?";
      this.text2 = this.template3;
    } else if ( select == 3) {
      correctWord = this.wordsInExercise[this.wordsInExercise.length-2];
      //this.text2 = "Which word was the second last in the list?";
      this.text2 = this.template4;
    }
    this.answers = getRandomWordsWithFn( this.wordsInExercise, 3, notInList([correctWord]) )
    this.answers.push( correctWord );

  }

}
