import {Crazy, elementType} from "../../crazy";
import {getRandomElementFromList, getRandomWordsWithFn, notInList, randomNumberInRange} from "../gen";
import {GeneratorBase} from "../generatorBase";
import {colorList} from "../data";
/*
Sum up all digits/numbers
Sum up all even/odd numbers
Sum up all numbers in blue/red/green
Sum up the highest and the lowest number
Sum up the two highest/lowest numbers

Which letter exists only once?
Which letter exists twice?

 */

const letterLabels = ['A','B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X','Y'];
export class CrazyLettersGen extends GeneratorBase {

  title= "Math: Calculate";
  tags= [ 'Language', 'Perception'];
  text= "Calculate the result of the expression:";
 // protected selectedLevel: MathLevelType ;
  constructor() {
    super();
  //constructor(selectedLevel : MathLevelType) {
    //this.selectedLevel = selectedLevel;
  }

  public static getConfigTag() : string {
    return "GEN_CRAZY.LETTERS";
  }

  private createAnswers( target:string) :string[] {
    let existingLetters : string[] = [];
    existingLetters.push(target);
    let answers = getRandomWordsWithFn( letterLabels, 3, notInList(existingLetters));
    answers.push( target );
    return answers;
  }

  public generate():Crazy {

    let letters : elementType[] = [];
    let nrOfLetters = randomNumberInRange(6, 13);
    for( let i = 0; i < nrOfLetters; i++) {
      let x = randomNumberInRange(10, 80);
      let y = randomNumberInRange(20, 70);
      let dx = randomNumberInRange(-3, 3); //-3+Math.floor(Math.random()*6);
      let dy = randomNumberInRange(-3, 3);
      let r = -40+Math.floor(Math.random()*90);
      let dr = -30+Math.floor(Math.random()*60);
      // let s = Math.floor(Math.random()*10);
      let ds = Math.floor(Math.random()*100.0)/1000.0;
      let color = getRandomElementFromList( colorList);
      let label = letterLabels[i];
      let random1 = Math.floor(Math.random()*3);
      if ( random1 > 1) {
        label = label.toLowerCase();
      }
      let e : elementType = {
        x: x, y:y, dx:dx, dy:dy, r:r, dr:dr, s:1.0, ds:ds, label:label, color:color, t1:"", t2:"" };
      letters.push(e);
    }

    let labelIndex = randomNumberInRange(0, nrOfLetters-1);
    let label = letters[labelIndex].label.toUpperCase();
    letters[letters.length-1].label = label.toLowerCase();
    letters[labelIndex].label = label;

    let strAnswers : string[] = [];
    strAnswers = this.createAnswers( label );
    let objAnswers : any[] = [];
    strAnswers.forEach(e=>{
      let o = { name:e };
      objAnswers.push( o);
    });


    let c1 = new Crazy(this.title,this.text,
    '', this.descLink, this.tags,objAnswers );
    c1.letters = letters;
    c1.difficulty = "Easy";
    if (nrOfLetters > 6) {
      c1.difficulty = "Hard";
    } else if (nrOfLetters > 4) {
      c1.difficulty = "Medium";
    }
    return c1;
  }
}
