import { MemoLevelType} from "../../../services/memo-exercises.service";
import {Quiz} from "../../quiz";
import {Memorize} from "../../memorize";
import {getRandomNumbersInRangeFn, getRandomWords, notIn, randomNumberInRange} from "./../gen";
import { Data} from "./../data";
import {GeneratorBase} from "../generatorBase";

export class NumberGenerator extends GeneratorBase {

  nrInExercise : number[] = [];
  answers : string[] = [];
  title= "Memo: Word";
  tags= ['Memory', 'Math'];
  template1= "What was the smallest number in the list?";
  template2= "What was the highest number in the list?";
  text2 = "";

  constructor() {
    super();
  }

  public static getConfigTag() : string {
    return "GEN_MEMO.NUMBER_HIGH_LOW";
  }

  public init(configObj: any) {
    super.init( configObj);
    this.template1 = configObj["text1"];
    this.template2 = configObj["text2"];
  }

  protected getAnswers( ):void {
    let sortedNumbers = this.nrInExercise.sort((n1,n2) => n1 - n2);

    let selectedNr = sortedNumbers[0];
    this.text2 = this.template1;
    if ( Math.random()*2 > 1) {
      selectedNr = sortedNumbers[this.nrInExercise.length-1];
      this.text2= this.template2;
    }
    let nrArray : number[] = getRandomNumbersInRangeFn(3, 5, 25, [selectedNr]);
    this.answers = nrArray.map( e => ""+e);
    this.answers.push( ""+selectedNr );
  }

  public generate(selectedLevel : MemoLevelType):Quiz {
    let nrCount = randomNumberInRange( selectedLevel.minWord, selectedLevel.maxWord-1);
    this.nrInExercise = getRandomNumbersInRangeFn(nrCount, 5, 25, [0]);
    let nrStr = this.nrInExercise.map(e=>""+e).join(", ");
    this.getAnswers( );

    let q2 = new Memorize( this.title, this.text+"<br/><b>"+nrStr, "", this.descLink, this.tags, this.answers);
    q2.text2 = this.text2;
    q2.difficulty=selectedLevel.name;
    return q2;
  }
}
