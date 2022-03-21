import {GeneratorBase} from "../generatorBase";
import {
  getRandomElementFromList,
  getRandomWordsWithFn,
  notInList,
  randomElementsFromListFn,
  randomNumberInRange
} from "../gen";
import {Crazy, elementType} from "../../crazy";
import {colorList} from "../data";

const symbolsLabels = ['icon-home','icon-office', 'icon-pencil', 'icon-image', 'icon-music', 'icon-camera','icon-book','icon-books','icon-table','icon-pacman','icon-mail', 'icon-dice', 'icon-headphones'];
const symbolsNames = [{en:'House',de:'Haus'},{en:'Office',de:'Büro'},{en:'Pencil',de:'Stift'},{en:'Image',de:'Bild'}, {en:'Music',de:'Musik'}, {en:'Camera',de:'Kamera'},{en:'Book',de:'Buch'},{en:'Books',de:'Bücher'},{en:'Table',de:'Tabelle'},{en:'Pacman',de:'Pacman'},{en:'Mail',de:'Brief'},{en:'Dice',de:'Würfel'},{en:'Headphones',de:'Kopfhörer'}];

// Category
// Tools, Buildings, Fruit & Vegetables, Beverage, Transportation, Faces,
// Animals, People
// currency or money symbols
// Electronic Devices: Tablet, TV,
// Watches, Time-Devices, Calenders
// Arrows
// Wetter related symbols
// handy
// kinds of smilies

// How many icon from the category "__XY__" are there?
// How many are there?

export class CrazySymbolsGen extends GeneratorBase {

  title= "Math: Calculate";
  tags= [ 'Perception'];
  text= "Calculate the result of the expression:";
  // protected selectedLevel: MathLevelType ;
  constructor() {
    super();
    //constructor(selectedLevel : MathLevelType) {
    //this.selectedLevel = selectedLevel;
  }

  public static getConfigTag() : string {
    return "GEN_CRAZY.SYMBOLS";
  }

  private createAnswers( target:string) :string[] {
    let existingLetters : string[] = [];
    existingLetters.push(target);
    let answers = getRandomWordsWithFn( symbolsLabels, 3, notInList(existingLetters));
    answers.push( target );
    return answers;
  }

  public generate():Crazy {

    let symbolNamesSelected :string[] = [];
    let letters : elementType[] = [];
    let nrOfSymbols = randomNumberInRange(6, 12);
    for( let i = 0; i < nrOfSymbols; i++) {
      let x = randomNumberInRange(10, 80);
      let y = randomNumberInRange(20, 70);
      let dx = randomNumberInRange(-3, 3); //-3+Math.floor(Math.random()*6);
      let dy = randomNumberInRange(-3, 3);
      let r = -40+Math.floor(Math.random()*90);
      let dr = -30+Math.floor(Math.random()*60);
      let ds = Math.floor(Math.random()*100.0)/1000.0;
      let color = getRandomElementFromList( colorList );
      let symbol = randomElementsFromListFn( symbolsLabels, 1, notInList(symbolNamesSelected) )[0];
      let e : elementType = {
        x: x, y:y, dx:dx, dy:dy, r:r, dr:dr, s:1.0, ds:ds, label:symbol, color:color, t1:"", t2:"" };
      letters.push(e);
      symbolNamesSelected.push(symbol);
    }

    let labelIndex = randomNumberInRange(0, nrOfSymbols-2);
    let label = letters[labelIndex].label;
    letters[letters.length-1].label = label;

    let strAnswers = this.createAnswers( label );

    let objAnswers : any[] = [];
    strAnswers.forEach(e=>{
      let idx = symbolsLabels.indexOf(e);
      let obj = symbolsNames[idx];
      let symbolObj = {icon: e, name: obj.en };
      if ( this.language == "de") {
        symbolObj.name = obj.de;
      }
      objAnswers.push( symbolObj );
    })

    let c1 = new Crazy(this.title,this.text,
      '', this.descLink, this.tags, objAnswers );
    c1.letters = letters;
    c1.elementType = "SYMBOL";
    c1.difficulty = "Easy";
    if (nrOfSymbols > 6) {
      c1.difficulty = "Hard";
    } else if (nrOfSymbols > 4) {
      c1.difficulty = "Medium";
    }
    return c1;
  }
}
