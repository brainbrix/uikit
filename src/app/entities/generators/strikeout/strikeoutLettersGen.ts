import {GeneratorBase} from "../generatorBase";
import {Quiz} from "../../quiz";
import {Strikeout} from "../../strikeout";
import {getRandomElementFromList, randomElementsFromList, randomNumberInRange} from "../gen";
import {words4de, words4en, words5de, words5en, words6de, words6en, words7de, words7en} from "../words";
import {getRandomLetter} from "../data";

const skillLevels = new Map<string, any>([
  ["Easy", {en: words4en, de: words4de, addChars:2}],
  ["Medium", {en: words5en, de: words5de, addChars:3}],
  ["Hard", {en: words7en, de: words7de, addChars:3}]
]);

export class StrikeoutLettersGen extends GeneratorBase {

  title= "..";
  tags= ['Language'];
  text= "..";

  public static getConfigTag() : string {
    return "GEN_STRIKEOUT.WORD";
  }

  public generate(skill:string):Quiz {
    if (!skill || skill == "") {
      skill = getRandomElementFromList(["Easy", "Medium", "Hard"]);
    }
    let skillLevel = skillLevels.get(skill);
    let words = skillLevel[this.language];
    let correctWord  = randomElementsFromList( words, 1)[0];
    correctWord  = correctWord.toUpperCase();
    let exWord = correctWord;
    let arrayOfLetters = exWord.split("");
    for( let i=0;i<skillLevel.addChars;i++) {
      let randomPosition = randomNumberInRange(0, exWord.length);
      let char = getRandomLetter();
      arrayOfLetters.splice(randomPosition, 0, char);
    }
    exWord = arrayOfLetters.join("");
    let q2 = new Strikeout(this.title, this.text.replace("_XY_", ""+skillLevel.addChars), "", this.descLink, this.tags,[] );

    q2.setTextExercise( exWord, correctWord);
    q2.difficulty=skill;
    return q2;
  }
}
