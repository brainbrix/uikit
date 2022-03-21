import {GeneratorBase} from "../generatorBase";
import {Quiz} from "../../quiz";
import {notInList, randomNumberInRange, randomNumberInRangeFn} from "../gen";

export let colorList = ['#ff9400', '#44cb02', '#0056f1', '#ffd300'
  , '#fd51fd', '#aaaaaa', '#ff0008', '#000000'
  , '#02e7fa', '#945c27'];

export let colorListNames = ['orange', 'green', 'blue', 'yellow'
  , 'pink', 'gray', 'red',  'black', 'turquoise', 'brown'];

export let colorListNamesDE = ['Orange', 'Grün', 'Blau', 'Gelb'
  , 'Pink', 'Grau', 'Rot',  'Schwarz', 'Türkis', 'Braun'];

const skillLevels = new Map<string, any>([
  ["Easy", {count: 12, startY: 100, deltaY:110 }],
  ["Medium", {count: 16, startY: 100, deltaY:90 }],
  ["Hard", {count: 18, startY: 80, deltaY:80 }]
]);

export class ColorWordQuizGen extends GeneratorBase {

  title = "Farben erkennen";
  tags = ['Memory', 'Perception'];
  text = ".";
  text2 = ".";
  text3 = ".";

  public static getConfigTag(): string {
    return "GEN_QUIZ.COLOR_MATCH";
  }

  public init(configObj: any) {
    super.init( configObj);
    this.text2 = configObj["text2"];
    this.text3 = configObj["text3"];
  }

  public generate(): Quiz {
    let skill = skillLevels.get("Easy");

    let colorIndex :number[] = [];
    let nameIndex :number[] = [];
    while (colorIndex.length < skill.count) {
      colorIndex.push( randomNumberInRange(0, colorList.length-1) );
      nameIndex.push( randomNumberInRange(0, colorList.length-1) );
    }

    let parts:any = [];
    let ypos = skill.startY;
    let xpos = 250;
    let colorMatch = 0;
    let colorSelected = 0;
    let colorTarget = randomNumberInRange(0, colorList.length-1);
    for (let index = 0; index< skill.count; index ++) {
      let color = colorList[colorIndex[index]];
      let colorName = colorListNames[nameIndex[index]];
      if (this.language == "de")
        colorName = colorListNamesDE[nameIndex[index]];
      if ( colorIndex[index] == nameIndex[index])
        colorMatch = colorMatch +1;
      if (colorTarget == nameIndex[index])
        colorSelected = colorSelected +1;
      if (colorTarget == colorIndex[index])
        colorSelected = colorSelected +1;

      if ( index == (colorIndex.length / 2)) {
        xpos = 700;
        ypos = skill.startY;
      }
      let rotate = randomNumberInRange(-12, 12);
      colorName = this.scrambleCapital(colorName);
      let svg3 = `<text fill="${color}" dominant-baseline="middle" text-anchor="middle" style="font: bold 90px sans-serif;" letter-spacing="10">${colorName}</text>`;
      let translate = `translate(${xpos},${ypos}) rotate(${rotate})`;
      let e1 = { svg : svg3,  transform: translate, countryName:'ColorName', style:"stroke:"+color};
      parts.push( e1 );
      ypos = ypos +skill.deltaY;
    }

    let answers : number[] = [];
    let question = "";
    if (Math.random() > 0.5) {
      answers.push( colorSelected);
      let colorName = colorListNames[colorTarget];
      if (this.language=="de")
        colorName = colorListNamesDE[colorTarget];
      question = this.text3.replace("__COLOR__",  colorName);

    } else {
      if ((colorMatch == 0) || (Math.random() > 0.25)) {
        answers.push( skill.count - colorMatch);
        question = this.text2;
      } else {
        answers.push( colorMatch );
        question = this.text;
      }

    }
    while (answers.length<4) {
      let x = randomNumberInRangeFn(0, 15, notInList( answers ));
      if ( x !== colorSelected )
        answers = [x].concat(answers);
    }

    let strAnswers = answers.map(e=>""+e);

    let c1 = new Quiz(this.title, question,
      '', this.descLink, this.tags, strAnswers  );
    c1.parts = parts;
    c1.hasPictureContent = "SVG";
    return c1;
  }

  public scrambleCapital(word : string) :string {
    let letter = word.split("");
    return letter.map(e => ((Math.random()>0.5)? e.toUpperCase():e.toLowerCase())).join("");
  }
}
