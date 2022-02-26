import {UtilService} from "../../../services/util.service";
import {exType, MathLevelType} from "../../../services/math-exercises.service";
import {Quiz} from "../../quiz";
import {GeneratorBase} from "../generatorBase";

export class Calculation extends GeneratorBase {

  title= "Math: Calculate";
  tags= ['Math'];
  text= "Calculate the result of the expression:";

  constructor() {
    super();
  }

  public static getConfigTag() : string {
    return "GEN_MATH.CALC";
  }

/*
  public init2( translateService: TranslateService) {
    console.log( "init.", translateService);
    this.title = translateService.instant("GEN_MATH.CALC.title");
    this.text = translateService.instant("GEN_MATH.CALC.text");
    let obj  = translateService.instant("GEN_MATH.CALC");
    console.log("translateobj",obj);
  }
*/
  protected createValues (l:MathLevelType ) : exType  {

    let answers: number[] = [];
    const operators = l.operators;
    let operandsCount = l.countOperators;
    let operands : number[] ;
    let ops : string[] ;
    let expressionStr : string;
    let result : number;
    do {
      operands  = [];
      ops  = [];
      expressionStr = "";

      for (let i = 0; i < operandsCount; i++) {
        operands.push(UtilService.randomValueNonNull(l.minOperands, l.maxOperands));
        ops.push(operators[(Math.floor(Math.random() * operators.length))]);
        expressionStr = expressionStr + " " + operands[i];
        if (i < operandsCount - 1)
          expressionStr = expressionStr + " " + ops[i];
        //console.log(expressionStr);
      }
      result = eval(expressionStr);
    } while ((result < -1000) || (result > 1000) || (expressionStr.trim().length < 6));
    while (answers.length < 3) {
      let possibleAnswer = this.createPossibleAnswers(result, l);
      if ((possibleAnswer != 0) && (possibleAnswer != result) && (!answers.includes(possibleAnswer))) {
        answers.push(possibleAnswer);
      }
    }
    answers.push(result);

    let ex : exType = {result:result, operators: ops, operands:operands, answers:answers, expression: expressionStr};
    return ex;
  }

  protected createPossibleAnswers( target:number, l:MathLevelType ) {
    if ( ((target > l.minOperands ) && (target < l.maxOperands)) || (Math.abs(target) < 20)) {
      return UtilService.randomValue(l.minOperands, l.maxOperands);
    } else {
      return UtilService.randomValueNearTarget(target, 0.25 );
    }
  }

  public generate(selectedLevel : MathLevelType):Quiz {

    let strAnswers : string[] = [];
    let exValues = this.createValues(selectedLevel);
    exValues.answers.forEach(a => strAnswers.push(""+a));

    let q1 = new Quiz(this.title, this.text + "<br/><b>"+exValues.expression+"</b>", "", this.descLink, ['Math'], strAnswers );
    q1.difficulty=selectedLevel.name;

    return q1;
  }
}
