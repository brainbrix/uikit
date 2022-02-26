import {Quiz} from "../../quiz";
import {
  notIn,
  randomElementsFromList, randomElementsFromListFn,
  randomNumberInRange
} from "../gen";
import { countryNames_DE, countryNames_EN} from "./countries";
import {GeneratorBase} from "../generatorBase";
import {colorList} from "../data";

export class CountryBorderMultipleGen extends GeneratorBase {

  title= "Quiz: Countries";
  tags= ['Memory', 'Perception'];
  text= "Which country is shown on the picture?";

  // protected selectedLevel: MathLevelType ;
  //constructor() {
  //constructor(selectedLevel : MathLevelType) {
  //this.selectedLevel = selectedLevel;
  //}

  public static getConfigTag() : string {
    return "GEN_QUIZ.COUNTRY.BORDER_MULTIPLE";
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

  public generate():Quiz {
    let namesEn = randomElementsFromList(countryNames_EN, 2);
    let namesAnswer = [namesEn[0],namesEn[1] ];
    randomElementsFromListFn( countryNames_EN,2, notIn(namesAnswer) ).forEach( e=>namesAnswer.push(e));
    if ( this.language != "en" )
      namesAnswer = this.translateAll(namesAnswer);

    let strAnswers = [ namesAnswer[0]+", "+namesAnswer[2], namesAnswer[1]+", "+namesAnswer[3], namesAnswer[2]+", "+namesAnswer[3], namesAnswer[0]+", "+namesAnswer[1] ];

    let c1 = new Quiz(this.title,this.text,
      '', this.descLink, this.tags,strAnswers );

    c1.difficulty = "Medium";
    c1.hasPictureContent = "SYMBOLS";

    let colors = randomElementsFromList(colorList, 2);
    let index = 0;
    namesEn.forEach( n => {
      let angle = randomNumberInRange(-45,45);
      let e1 = {svg : 'svg3', transform:" rotate( "+angle+",500,400 )", countryName:n, style:"stroke:"+colors[index] };
      c1.parts.push( e1 );
      index = index +1;
    });

    // Easy: No Angle or -45..45
    // Medium: Angle -90..90
    // Hard: Angle 45..315

    return c1;
  }
}
