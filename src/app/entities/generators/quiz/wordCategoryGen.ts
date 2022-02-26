import {GeneratorBase} from "../generatorBase";
import {Data} from "../data";
import {Quiz} from "../../quiz";

export class WordCategoryGen extends GeneratorBase {

  title= "Quiz: Word categories";
  tags= ['Language'];
  text= "Which word does not belong to the other words in the list?";
  //selectedLevel: UnscrambleLevelType ;

  constructor() {
    super();
    //this.selectedLevel = selectedLevel;
  }

  public static getConfigTag() : string {
    return "GEN_QUIZ.WORD_CATEGORY";
  }

  public generate(language:string):Quiz {

    let answers = Data.getDataForCategoryQuiz(language);
    //console.log( answers);
    let q2 = new Quiz(this.title, this.text, "", this.descLink, this.tags,answers);
    q2.difficulty="Easy";
    return q2;
  }
}
