import {UtilService} from "../../../services/util.service";
import {Quiz} from "../../quiz";
import {GeneratorBase} from "../generatorBase";
/*
Sum up all digits/numbers
Sum all even/odd numbers
Sum all all numbers in blue/red/green
Sum up the highest and the lowest number
Sum up the two highest/lowest numbers

Which letter exists only once?
Which letter exists twice?
 */

export class MemoNumbersOperatorsGen2 extends GeneratorBase {

  title= "Memo: NumberOperators";
  tags= ['Memo', 'Math'];
  text= "";
  // protected selectedLevel: MathLevelType ;

  public static getConfigTag() : string {
    return "GEN_QUIZ.MEMO_NUMBERS";
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

    let start = 10+Math.floor(Math.random()*70);
    let sub = 2+Math.floor(Math.random()*8);
    let step2 = start -sub;

    let step3 = step2
      .toString()
      .split('')
      .map(Number)
      .reduce(function (a, b) {
        return a + b;
      }, 0);

    let mul = 2+Math.floor(Math.random()*4);
    let step4 = step3 * mul;

    let exText = this.text+"<br/>"

  //  exText = exText + "<br/>1. Starten Sie mit der Zahl: "+start+"<br/>";
    exText = exText + `<br/>1. Starten Sie mit der Zahl: ${start}<br/>`;
    exText = exText + "2. Ziehen Sie "+sub+" ab<br/>";
    exText = exText + "3. Bilden Sie die Quersumme<br/>";
    exText = exText + "4. Mit "+mul+" multiplizieren<br/>";
    exText = exText + "Wie lautet das Ergebnis?<br/>";

    var reusable = () => `This ${object} was created by ${creator}`;

    var object = "template string", creator = "a function";
    console.log (reusable()); // "This template string was created by a function"

    object = "example", creator = "me";
    console.log (reusable()); // "This example was created by me"

    let strAnswers : string[] = [];
    //let exValues = this.createValues(this.selectedLevel);
    //exValues.answers.forEach(a => strAnswers.push(""+a));

    strAnswers = this.createAnswers( step4 );

    let c1 = new Quiz(this.title ,exText,
      '', '', this.tags,strAnswers );

    c1.difficulty = "Easy";
    //if (nrOfDigits > 6) {
    //  c1.difficulty = "Hard";
    //} else if (nrOfDigits > 4) {
    //  c1.difficulty = "Medium";
    //}
    return c1;
  }
}
