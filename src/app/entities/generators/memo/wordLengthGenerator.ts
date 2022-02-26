import { MemoLevelType} from "../../../services/memo-exercises.service";
import {Quiz} from "../../quiz";
import {Memorize} from "../../memorize";
import {getRandomNumbersInRangeFn, getRandomWords} from "./../gen";
import { Data} from "./../data";
import {GeneratorBase} from "../generatorBase";

export class WordLengthGenerator extends GeneratorBase {

  wordsInExercise : string[] = [];
  answers : string[] = [];
  title= "Memo: Word";
  tags= ['Memory', 'Language'];
  template1= "How many letters had the shortest word(s) in den list?";
  template2= "How many letters had the longest word(s) in den list?";
  text2 = "";
  words = ["wordsempty"];

  constructor() {
    super();
  }

  public static getConfigTag() : string {
    return "GEN_MEMO.WORD_LENGTH";
  }

  public init(configObj: any) {
    super.init( configObj);
    this.template1 = configObj["text1"];
    this.template2 = configObj["text2"];
    this.words = Data.getWordsListForLanguage( this.language );
  }

  protected getAnswers( ):void {
    let letterOfShortestWord = this.wordsInExercise.map(e=>e.length).sort()[0];
    this.text2 = this.template1;
    if ( Math.random()*2 > 1) {
      letterOfShortestWord = this.wordsInExercise.map(e=>e.length).sort()[this.wordsInExercise.length-1];
      this.text2= this.template2;
    }
    let nrArray : number[] = getRandomNumbersInRangeFn(3, 2, 10, [letterOfShortestWord]);
    this.answers = nrArray.map( e => ""+e);
    this.answers.push( ""+letterOfShortestWord );
  }

  public generate(selectedLevel : MemoLevelType):Quiz {
    this.wordsInExercise = getRandomWords( this.words, selectedLevel.minWord);
    this.getAnswers( );
    let wordStr = this.wordsInExercise.join(", ");
    let q2 = new Memorize( this.title, this.text+"<br/><b>"+wordStr, "", this.descLink, this.tags, this.answers);
    q2.text2 = this.text2;
    q2.difficulty=selectedLevel.name;
    return q2;
  }
}
