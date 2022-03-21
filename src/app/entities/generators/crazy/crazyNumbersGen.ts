import {UtilService} from "../../../services/util.service";
import {Crazy, elementType} from "../../crazy";
import {getRandomElementFromList, randomNumberInRange} from "../gen";
import {GeneratorBase} from "../generatorBase";
import {colorList} from "../data";
/*
Sum up all digits/numbers
Sum all even/odd numbers
Sum all all numbers in blue/red/green
Sum up the highest and the lowest number
Sum up the two highest/lowest numbers

Which letter exists only once?
Which letter exists twice?


 */

export class CrazyNumbersGen extends GeneratorBase {

  title= "Math: Calculate";
  tags= ['Math', 'Perception'];
  text= "Calculate the result of the expression:";
 // protected selectedLevel: MathLevelType ;
  constructor() {
    super();
  //constructor(selectedLevel : MathLevelType) {
    //this.selectedLevel = selectedLevel;
  }
  public static getConfigTag() : string {
    return "GEN_CRAZY.DIGITS";
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

  public generate():Crazy {

    let letters : elementType[] = [];
    let sum = 0;
    let nrOfDigits = randomNumberInRange(3, 7);
    for( let i = 0; i < nrOfDigits; i++) {
      let x = randomNumberInRange(10, 80);
      let y = randomNumberInRange(20, 70);
      let dx = -3+Math.floor(Math.random()*6);
      let dy = -3+Math.floor(Math.random()*6);
      let r = -40+Math.floor(Math.random()*90);
      let dr = -30+Math.floor(Math.random()*60);
      // let s = Math.floor(Math.random()*10);
      let ds = Math.floor(Math.random()*100.0)/1000.0;
      let color = getRandomElementFromList( colorList);
      let label = 1+Math.floor(Math.random()*9);
      let textLabel = ""+label;
      if ( ( label == 6) || (label==9))
        textLabel = textLabel+".";
      let e : elementType = {
        x: x, y:y, dx:dx, dy:dy, r:r, dr:dr, s:1.0, ds:ds, label:textLabel, color:color, t1:"", t2:"" };
      letters.push(e);
      sum = sum + label;
    }

    let strAnswers : string[] = [];
    //let exValues = this.createValues(this.selectedLevel);
    //exValues.answers.forEach(a => strAnswers.push(""+a));

    strAnswers = this.createAnswers( sum );
    let objAnswers : any[] = [];
    strAnswers.forEach(e=>{
      let o = { name:e };
      objAnswers.push( o);
    });
    let c1 = new Crazy(this.title,this.text,
    '', this.descLink, this.tags,objAnswers );
    c1.letters = letters;
    c1.difficulty = "Easy";
    if (nrOfDigits > 6) {
      c1.difficulty = "Hard";
    } else if (nrOfDigits > 4) {
      c1.difficulty = "Medium";
    }
    return c1;
  }
}
