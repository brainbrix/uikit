import {exType, MathLevelType} from "../../../services/math-exercises.service";
import {Quiz} from "../../quiz";
import {Calculation} from "./calculation";
import {convert2Roman} from "../gen";

export class RomanCalculation extends Calculation {

  constructor() {
    super();
  }

  public static getConfigTag() : string {
    return "GEN_MATH.CALC_ROMAN";
  }

  public generate(selectedLevel : MathLevelType):Quiz {

    //let randomLevel = this.levels[Math.floor(Math.random()*this.levels.length)];
    let romanResult = "";
    let romanExpression = "";
    let romanOperands : string[] = [];
    let romanAnswers : string[] = [];
    let found = false;
    while (!found) {

      let exValues = this.createValues(selectedLevel);
      romanExpression = "";
      romanOperands = [];
      for (let i = 0; i< selectedLevel.countOperators; i++) {
        romanOperands.push( convert2Roman(exValues.operands[i]));
        romanExpression = romanExpression +" "+romanOperands[i]
        if ( i < selectedLevel.countOperators-1)
          romanExpression = romanExpression +" "+exValues.operators[i];
      }
      romanResult = convert2Roman(exValues.result);

      romanAnswers = [];
      exValues.answers.forEach(a => romanAnswers.push(convert2Roman(a)));

      found = true;
      for (let i = 0; i< selectedLevel.countOperators; i++) {
        if ( romanOperands[i] ==  '')
          found = false;
      }

      if (romanResult == '') {
        found = false;
      }
    }

    let q1 = new Quiz( this.title, this.text+"<br/><b>"+romanExpression+"</b>", "", this.descLink, ['Math'], romanAnswers);
    q1.difficulty=selectedLevel.name;
    return q1;
  }

}
