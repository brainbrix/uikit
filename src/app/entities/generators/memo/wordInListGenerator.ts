import {WordLengthGenerator} from "./wordLengthGenerator";
import {getRandomWords, getRandomWordsWithFn, notInList} from "../gen";

export class WordInListGenerator extends WordLengthGenerator {

  constructor() {
    super();
  }

  public static getConfigTag() : string {
    return "GEN_MEMO.WORD_IN_LIST";
  }

  public init(configObj: any) {
    super.init( configObj);
  }

  protected getAnswers( ):void {
    let select =Math.random()*2;
    if (select < 1)  {
      //this.text2= "Which word was in the list before?";
      this.text2= this.template1;
      this.answers = getRandomWordsWithFn( this.words, 3, notInList(this.wordsInExercise ) )
      this.answers.push( getRandomWords( this.wordsInExercise, 1 )[0] );
    } else {
      //this.text2= "Which word was not in the list before?";
      this.text2 = this.template2
      this.answers = getRandomWords( this.wordsInExercise , 3 )
      this.answers.push( getRandomWordsWithFn( this.words, 1, notInList(this.wordsInExercise ) )[0] );
    }
    let solutionText = "Correct answers is :"+this.answers[3]+" letters.";
    //console.log( solutionText );
  }
}
