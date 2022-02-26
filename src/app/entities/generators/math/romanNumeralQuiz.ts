import {UtilService} from "../../../services/util.service";
import {exType, MathLevelType} from "../../../services/math-exercises.service";
import {Quiz} from "../../quiz";
import {convert2Roman} from "../gen";
import {Calculation} from "./calculation";

export class RomanNumeralQuiz extends Calculation {

  title= "Math: Convert";
  tags= ['Mathematics'];
  text2= "What is the correct roman numeral of the arabic numeral:</br>";

  constructor() {
    super();
  }

  public static getConfigTag() : string {
    return "GEN_MATH.ROMAN_QUIZ";
  }

  public init( configObj:any) {
    super.init(configObj);
    this.text2 = configObj["text2"];
  }

  protected createPossibleAnswers( target:number, l:MathLevelType ) {
    if ( ((target > l.minOperands ) && (target < l.maxOperands)) || (Math.abs(target) < 20)) {
      return UtilService.randomValue(l.minOperands, l.maxOperands);
    } else {
      return UtilService.randomValueNearTarget(target, 0.25 );
    }
  }

  public generate(selectedLevel : MathLevelType):Quiz {

    let targetValue = UtilService.randomValueNonNull(selectedLevel.minOperands, selectedLevel.maxOperands*10);
    let strValue = convert2Roman(targetValue);

    let answersNr : number[] = [];
    while (answersNr.length < 3) {
      let nextAnswer = this.createPossibleAnswers( targetValue, selectedLevel );
      if ( !answersNr.includes(nextAnswer) && nextAnswer != targetValue) {
        answersNr.push( nextAnswer );
      }
    }
    let strAnswers:string[] = [];
    let exerciseText = "";

    if ( Math.floor(Math.random()*2.0)>=1) {

      answersNr.forEach(a => strAnswers.push(""+convert2Roman(a)));
      strAnswers.push(convert2Roman(targetValue));
      exerciseText= this.text+"</br><b>"+targetValue+"</b>";
    } else {
      strValue = convert2Roman(targetValue);
      answersNr.forEach(a => strAnswers.push(""+a));
      strAnswers.push(""+targetValue);
      exerciseText= this.text2+"</br><b>"+strValue+"</b>";
    }

    let q1 = new Quiz( this.title, exerciseText, "", this.descLink, ['Math'], strAnswers );
    q1.difficulty=selectedLevel.name;
    return q1;
  }

}
