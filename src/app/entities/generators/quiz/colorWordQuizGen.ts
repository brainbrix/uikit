import {GeneratorBase} from "../generatorBase";
import {Quiz} from "../../quiz";
import {randomNumberInRange} from "../gen";

export let colorList = ['#ff9400', '#44cb02', '#0056f1', '#ffd300'
  , '#fd51fd', '#aaaaaa', '#ff0008', '#000000'
  , '#02e7fa', '#945c27'];

export let colorListNames = ['orange', 'green', 'blue', 'yellow'
  , 'pink', 'gray', 'red',  'black', 'cyan', 'brown'];

export class ColorWordQuizGen extends GeneratorBase {

  title = "Quiz: Countries";
  tags = ['Memory', 'Perception'];
  text = "Which country is shown on the picture?";

  public static getConfigTag(): string {
    return "GEN_QUIZ.COLOR_MATCH";
  }

  public generate(): Quiz {
    let colorIndex :number[] = [];
    let nameIndex :number[] = [];
    while (colorIndex.length < 18) {
      colorIndex.push( randomNumberInRange(0, colorList.length-1) );
      nameIndex.push( randomNumberInRange(0, colorList.length-1) );
    }

    let svg3 = "";
    let parts:any = [];
    let ypos = 80;
    let xpos = 250;
    let index = 0;
    let colorMatch = 0;
    colorIndex.forEach( e=>{
      let color = colorList[e];
      let colorName = colorListNames[nameIndex[index]];
      if ( colorIndex[index] === nameIndex[index])
        colorMatch = colorMatch +1;

      if ( index == 9) {
        xpos = 700;
        ypos = 80;
      }
      let rotate = randomNumberInRange(-12, 12);
      svg3 = `<text fill="${color}" dominant-baseline="middle" text-anchor="middle" style="font: bold 90px sans-serif;" letter-spacing="10">${colorName}</text>`;
      let translate = `translate(${xpos},${ypos}) rotate(${rotate})`;
      let e1 = {  svg : svg3,  transform: translate, countryName:'ColorName', style:"stroke:"+color};
      parts.push( e1 );
      ypos = ypos +80;
      index = index +1;
    });

    let c1 = new Quiz(this.title,this.text,
      '', this.descLink, this.tags,['x','z','a',""+colorMatch] );
    c1.parts = parts;
    c1.hasPictureContent = "SVG";
    return c1;
  }
}
