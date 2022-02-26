import {Quiz} from "../../quiz";
import {
  getRandomElementFromList,
  getRandomElementFromListFn,
  getRandomWordsWithFn, not,
  notInList, randomElementsFromList,
  randomNumberInRange
} from "../gen";
import {GeneratorBase} from "../generatorBase";
import {words4de, words4en, words5de, words5en, words6de, words6en} from "../words";
import {UtilService} from "../../../services/util.service";
import {colorList2} from "../data";

const skillLevels = new Map<string, any>([
  ["Easy", {en: words4en, de: words4de}],
  ["Medium", {en: words5en, de: words5de}],
  ["Hard", {en: words6en, de: words6de}]
]);

export class WordScrambleQuizGen extends GeneratorBase {

  title= "Quiz: Letter Chaos";
  tags= [ 'Language', 'Perception'];
  text= "";

  // protected selectedLevel: MathLevelType ;
  //constructor() {
  //constructor(selectedLevel : MathLevelType) {
  //this.selectedLevel = selectedLevel;
  //}

  public static getConfigTag() : string {
    return "GEN_QUIZ.LETTER_CHAOS";
  }

  private createAnswers( correctAnswer:string, words:string[]) :string[] {
    let answers = getRandomWordsWithFn(words, 3, notInList([correctAnswer]));
    answers.push( correctAnswer );
    return answers;
  }

  public generate(skill:string):Quiz {

    if (!skill || skill == "") {
      skill = getRandomElementFromList(["Easy", "Medium", "Hard"]);
    }
    let words = skillLevels.get(skill)[this.language];

    let correctWord  = randomElementsFromList( words, 1)[0];
    let strAnswers = this.createAnswers( correctWord, words );

    if (skill == "Hard") {
      correctWord = correctWord.toUpperCase();
      strAnswers = strAnswers.map(e=>e.toUpperCase());
    }

    let c1 = new Quiz(this.title,this.text,
      '', this.descLink, this.tags,strAnswers );

    c1.difficulty = skill;
    c1.hasPictureContent = "SVG";;

    let step = 850 / correctWord.length;
    let letters = correctWord.split('') as string[];
    letters = UtilService.shuffleArray( letters );

    let startPosX = 150;
    let lastColor = "";
    letters.forEach( l => {

      let angle = randomNumberInRange(-70,70);
      let ypos = 400 + randomNumberInRange(-125,125);
      let color = getRandomElementFromListFn( colorList2, not(lastColor));
      lastColor = color;
      let s = "<text x=\""+startPosX+"\" y=\""+ypos+"\" style=\"font: bold 450px sans-serif;\" transform=\"rotate( "+angle+","+startPosX+","+ypos+" )\"\n" +
        " dominant-baseline=\"middle\" text-anchor=\"middle\"\n" +
        " fill=\""+color+"\"\n" +
        ">"+l+"</text>";
      startPosX = startPosX + step;
      c1.parts.push(  {svg : s, transform:""} );
    });

    // Easy: No Angle or -45..45
    // Medium: Angle -90..90
    // Hard: Angle 45..315

    return c1;
  }
}
