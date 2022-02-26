import {GeneratorBase} from "../generatorBase";
import {UtilService} from "../../../services/util.service";
import {Quiz} from "../../quiz";

export const makeTemplate = (templateString:string) => {
  return (templateData:any) => new Function(`{${Object.keys(templateData).join(',')}}`, 'return `' + templateString + '`')(templateData);
}

type memoType = {text:string; skill:string; answer:number};

export class MemoNumbersOperatorsGen extends GeneratorBase {

  title= "Memo: NumberOperators";
  tags= ['Memory', 'Math'];
  text= "";
  // protected selectedLevel: MathLevelType ;

  public static getConfigTag() : string {
    return "GEN_QUIZ.MEMO_NUMBERS";
  }

  init(configObj: any) {
    super.init(configObj);
    Operator.text = configObj;
  }

  private createAnswers( target:number) :string[] {
    let answers : string[] = [];
    while (answers.length < 3) {
      let value = UtilService.randomValueNearTarget( target, 0.25 )
      if ( value != target && !answers.includes(""+value) ) {
        answers.push(""+value);
      }
    }
    answers.push( ""+target );
    return answers;
  }

  public generate():Quiz {

//    var reusable = () => `This ${object} was created by ${creator}`;

//    var object = "template string", creator = "a function";
//    console.log (reusable()); // "This template string was created by a function"

//    object = "example", creator = "me";
//    console.log (reusable()); // "This example was created by me"

    let ex = new Exercise();
    let exercise = ex.createExercise(4,3);

    //let exValues = this.createValues(this.selectedLevel);
    //exValues.answers.forEach(a => strAnswers.push(""+a));

    let strAnswers = this.createAnswers( exercise.answer );
    let c1 = new Quiz(this.title ,exercise.text,
      '', this.descLink, this.tags, strAnswers );

    c1.difficulty = exercise.skill;

    return c1;
  }
}


class Exercise {

  private getSkillLevel(skillValue:number):string {
    if ( skillValue < 300) {
      return "Easy";
    } else if (skillValue < 700 ) {
      return "Medium";
    } else {
      return "Hard";
    }
  }

  private static createOperator(): Operator {
    let opClassNames = Object.getOwnPropertyNames(Store);
    let randOpIndex = Math.floor(Math.random()* opClassNames.length);
    return new DynamicClass(opClassNames[randOpIndex]) as any;
  }

  public createExercise(count:number, maxStringLength:number) : memoType {

    let exercise : memoType = { text:"", skill:"", answer:0};
    let ops = [];
    let valid = true;
    let skillFactor = 0;
    let state:CalcState;
    do {

      valid = true;
      skillFactor = 0;
      state = new CalcState();
      ops = [new OPStart()];
      for (let i = 0; i<count;i++) {
        ops.push( Exercise.createOperator() );
      }

      let valueHistory = ["0"];
      for ( let i =0; i< ops.length; i++) {
        //console.log(""+i+":"+ops[i].getText());
        valid = valid && ops[i].calc(state)
          && (state.stringValue != valueHistory[i])
          && (state.stringValue.length < maxStringLength)
          && (valueHistory.indexOf(state.stringValue) == -1);
        //console.log(""+i+":"+state.stringValue);
        valueHistory.push(state.stringValue);
        skillFactor = skillFactor + state.stringValue.length;
        if (!valid)
          break;
      }

      let skillSum = 0;
      for ( let i =0; i< ops.length; i++) {
        skillSum = skillSum + ops[i].getSkill()+ i;
      }
      skillFactor = skillFactor * skillSum;
      //console.log( "SkillSum:"+skillSum, "SkillFactor:"+skillFactor  );
      //console.log( this.getSkillLevel(skillFactor ));
      //console.log( "String:"+state.stringValue);
      exercise.skill = this.getSkillLevel(skillFactor );

    } while (!valid)
    exercise.skill = this.getSkillLevel(skillFactor );
    exercise.answer = state.numberValue;
    let text = "";
    let index = 1
    ops.forEach(s => {text = text +(index++)+". "+s.getText()+"<br/>"})
    exercise.text = text;
    return exercise;
  }
}

class Operator {

  static text:any={};
  operand1 =1+Math.floor(Math.random()*9);
  skill = 0;

  public getText() :string {
    return "";
  }
  public getSkill() : number {
    return this.skill;
  }

  public calc(state: object):boolean {
    return false;
  }
}

class OPStart extends Operator {
  operand1 =1+Math.floor(Math.random()*25);

  public getText() {
    let tpl = makeTemplate(Operator.text["opStart"]);
    return tpl( {operand: this.operand1});
  }
  public calc(state: CalcState):boolean {
    state.setNumber(this.operand1);
    this.skill = state.stringValue.length;
    return true;
  }
}

class OPAdd extends Operator {

  public getText() {
    let tpl = makeTemplate(Operator.text["opAddNumber"]);
    return tpl( {operand: this.operand1});
  }
  public calc(state: CalcState):boolean {
    state.setNumber(state.numberValue + this.operand1);
    this.skill = state.stringValue.length;
    return true;
  }
}
class OPMultiply extends Operator {
  operand1 =2+Math.floor(Math.random()*6);
  public getText() {
    let tpl = makeTemplate(Operator.text["opMultiplyNumber"]);
    return tpl( {operand: this.operand1});
  }
  public calc(state: CalcState):boolean {
    state.setNumber(state.numberValue * this.operand1);
    this.skill = 4*(""+this.operand1).length * state.stringValue.length;
    return true;
  }
}

class OPAddDigit extends Operator {

  left = (Math.random()*2) < 1;

  public getText() {
    let tpl = makeTemplate(Operator.text["opAddDigitLeft"]);
    if (!this.left) {
      tpl = makeTemplate(Operator.text["opAddDigitRight"]);
    }
    return tpl( {digit:this.operand1});
  }

  public calc(state: CalcState):boolean {
    if ( this.left)
      state.setString(""+this.operand1+state.stringValue);
    else
      state.setString(state.stringValue+ this.operand1);
    this.skill = 3*state.stringValue.length;
    return true;
  }
}

class OPRemoveDigit extends Operator {

  left = (Math.random()*2) < 1;

  public getText() {
    if (!this.left) {
      return Operator.text["opRemoveDigitRight"];
    } else {
      return Operator.text["opRemoveDigitLeft"];
    }
  }

  public calc(state: CalcState):boolean {
    if ( state.stringValue.length < 2)
      return false;
    this.skill = 3*state.stringValue.length;
    if (!this.left) {
      state.setString(state.stringValue.substring(0,state.stringValue.length-1));
    } else {
      state.setString(state.stringValue.substring(1));
    }
    if (state.stringValue.startsWith("0"))
      return false;
    return true;
  }
}

class OPSwapDigits extends Operator {

  public getText() {
    return Operator.text["opSwapFirstLastDigit"];;
  }

  public calc(state: CalcState):boolean {
    if ( (state.stringValue.length < 2) ||
      (state.stringValue.endsWith("0")))
      return false;

    let s = state.stringValue;

    var arr = s.split('');
    var temp = arr[0];
    arr[0] = arr[arr.length-1];
    arr[arr.length-1] = temp;

    state.setString(arr.join(''));

    this.skill = 2+s.length*s.length;
    return true;
  }
}

class OPSumOfDigits extends Operator {

  public getText() {
    return  Operator.text["opSumOfDigits"];;
  }

  public calc(state: CalcState):boolean {

    if ( state.stringValue.length < 2)
      return false;
    this.skill = 2*state.stringValue.length;
    let value = state.numberValue;
    let sum = 0;
    while (value) {
      sum += value % 10;
      value = Math.floor(value / 10);
    }
    state.setNumber( sum );
    return true;
  }
}

class CalcState {
  numberValue =0;
  stringValue ="0";

  setNumber( value :number) {
    this.numberValue = value;
    this.stringValue = ""+ value.toFixed(0) ;
  }
  setString( value :string) {
    this.stringValue = value;
    this.numberValue = parseInt(value);
  }
}
/*
const tpl =  makeTemplate('hello ${name}')
const name = 'world';
console.log(tpl({name}));
*/

export class DynamicClass {
  constructor(className: string) {
    if (Store[className] === undefined || Store[className] === null) {
      throw new Error(`Class type of \'${className}\' is not in the store`);
    }
    return new Store[className]();
  }
}

export const Store: any = {
  OPAdd,
  OPMultiply,
  OPAddDigit,
  OPSumOfDigits,
  OPRemoveDigit,
  OPSwapDigits
}
