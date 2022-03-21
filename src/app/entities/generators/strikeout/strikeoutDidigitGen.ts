import {GeneratorBase} from "../generatorBase";
import {Quiz} from "../../quiz";
import {getRandomElementFromList, randomNumberInRange} from "../gen";
import {Strikeout} from "../../strikeout";
import {words4de, words4en, words5de, words5en, words6de, words6en} from "../words";

const skillLevels = new Map<string, any>([
  ["Easy", {en: words4en, de: words4de, addChars:2}],
  ["Medium", {en: words5en, de: words5de, addChars:3}],
  ["Hard", {en: words6en, de: words6de, addChars:3}]
]);

const exercises_medium = [
{ exercise:"796-29-253", correct:"7_6-29-_53", target:"-6", digits:2},
{ exercise:"123+6-257+25", correct:"_23+6-25_+25", target:"29", digits:2},

{ exercise:"50-439-536", correct:"50-43_-53_", target:"-46", digits:2}
]

const exercise = [
  { exercise:"639*2", correct:"_3_*2", target:"6", digits:2},
  { exercise:"7984+2", correct:"7_8_+2", target:"80", digits:2},
  { exercise:"5064-30", correct:"5__4-30", target:"24", digits:2},

  { exercise:"16-750", correct:"1_-75_", target:"-74", digits:2},
  { exercise:"59-2476", correct:"59-2__6", target:"33", digits:2},
  { exercise:"4649/3", correct:"_6_9/3", target:"23", digits:2},

  { exercise:"27+2551", correct:"2+21", target:"23", digits:3},

  { exercise:"2210-53", correct:"__10-53", target:"-43", digits:2},
  { exercise:"4389+48", correct:"4__9+48", target:"97", digits:2},
  { exercise:"5099+44", correct:"50__+44", target:"94", digits:2},

  { exercise:"18-3727", correct:"18-_7_7", target:"-59", digits:2},

  { exercise:"94+219", correct:"9_+_19", target:"28", digits:2},
  { exercise:"94+230", correct:"_4+_30", target:"34", digits:2}
]

export class StrikeoutDigitsGen extends GeneratorBase {

  title= "..";
  tags= ['Math'];
  text= "..";

  public static getConfigTag() : string {
    return "GEN_STRIKEOUT.EXPRESSION";
  }

  public generate(skill:string):Quiz {
    if (!skill || skill == "") {
      skill = getRandomElementFromList(["Easy", "Medium", "Hard"]);
    }
    let skillLevel = skillLevels.get(skill);

    let exIndex = randomNumberInRange( 0, exercise.length-1 );
    let textExercise = this.text.replace("__XY__", ""+exercise[exIndex].digits);
    textExercise = textExercise.replace( "__AB__", exercise[exIndex].target);
    let q2 = new Strikeout(this.title, textExercise, "", this.descLink, this.tags,[] );

    let correctText = this.removeChars( exercise[exIndex].correct, " _");
    q2.setTextExercise( exercise[exIndex].exercise, correctText);
    q2.difficulty=skill;
    q2.calc = true;
    q2.targetValue = parseInt(exercise[exIndex].target);
    return q2;
  }

  replaceAllChars( word : string, target:string, replacement:string):string {
    let letters = word.split("");
    return letters.map( e=>{ (e==target)?replacement:e }).join("");
  }

  removeChars( word:string , charsToRemove:string) :string {
    let letters = word.split("");
    return letters.filter( e=> charsToRemove.indexOf(e) == -1).join("")
  }
}
