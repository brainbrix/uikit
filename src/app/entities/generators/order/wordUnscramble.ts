import {getRandomWordsWithFn} from "./../gen";
import {Data} from "./../data";
import {Unscramble} from "../../unscramble";
import {UtilService} from "../../../services/util.service";
import {UnscrambleLevelType} from "../../../services/unscramble-exercises.service";
import {GeneratorBase} from "../generatorBase";

export class WordUnscramble extends GeneratorBase {

  title= "Unscramble: Word";
  tags= [ 'Language', 'Memory'];
  text= "Unscramble the target:";

  constructor() {
    super();
  }

  public static getConfigTag() : string {
    return "GEN_ORDER.WORD";
  }

  public generate(selectedLevel : UnscrambleLevelType):Unscramble {

    let words = Data.getWordsListForLanguage(this.language);
    let target = getRandomWordsWithFn( words, 1, w => (w.length >= selectedLevel.minWordLength && w.length<=selectedLevel.maxWordLength))[0].toUpperCase();

    let letters = UtilService.shuffleArray(target.split("")) as string[];

    let q2 = new Unscramble( this.title, this.text, "", this.descLink, this.tags, target, letters);
    q2.difficulty=selectedLevel.name;
    q2.help = true;
    return q2;
  }
}
