import {Quiz} from "../../quiz";
import {
  getRandomWordsWithFn,
  notInList, randomElementsFromList,
  randomNumberInRange
} from "../gen";
import {countryNames_DE, countryNames_EN} from "./countries";
import {GeneratorBase} from "../generatorBase";
import {colorList} from "../data";

export class CountryBorderGen extends GeneratorBase {

  title= "Quiz: Countries";
  tags= ['Memory', 'Perception'];
  text= "Which country is shown on the picture?";

  // protected selectedLevel: MathLevelType ;
  //constructor() {
  //constructor(selectedLevel : MathLevelType) {
  //this.selectedLevel = selectedLevel;
  //}

  public static getConfigTag() : string {
    return "GEN_QUIZ.COUNTRY.BORDER";
  }

  private mapCountryName( countryName: string):string {
    const index = countryNames_EN.indexOf(countryName);
    if ( index > -1) {
      return countryNames_DE[index];
    } else {
      return countryName;
    }
  }
  private translateAll( strArray: string[] ):string[] {
    return strArray.map( e=>this.mapCountryName(e));
  }

  private createAnswers( correctAnswer:string) :string[] {
    let answers = getRandomWordsWithFn(countryNames_EN, 3, notInList([correctAnswer]));
    answers.push( correctAnswer );
    return answers;
  }

  public generate():Quiz {

    let country  = randomElementsFromList( countryNames_EN, 1)[0];

    let strAnswers = this.createAnswers( country );
    if ( this.language != "en" )
      strAnswers = this.translateAll(strAnswers);
    let c1 = new Quiz(this.title,this.text,
      '', this.descLink, this.tags,strAnswers );

    c1.difficulty = "Easy";
    c1.hasPictureContent = "SYMBOLS";
    let color = randomElementsFromList(colorList,1)[0];

    let angle = randomNumberInRange(0,90);
    let e1 = {  svg : 'svg3',  transform:" rotate( "+angle+",500,400 )", countryName:country, style:"stroke:"+color};
    c1.parts.push( e1 );

    // Easy: No Angle or -45..45
    // Medium: Angle -90..90
    // Hard: Angle 45..315

    return c1;
  }
}
