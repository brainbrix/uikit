import {Unscramble} from "../../unscramble";
import {UtilService} from "../../../services/util.service";
import {UnscrambleLevelType} from "../../../services/unscramble-exercises.service";
import {getRandomElementFromList} from "../gen";
import {GeneratorBase} from "../generatorBase";

const EXERCISE = [ '3 * 8 - 1 = 23', '9 * 8 - 2 = 70', '99 - 1 = 98', '5 + 7 + 5 = 17', '9 * (8 - 5) = 27', '6 * (2 + 1) = 18', '9 * (8 - 5) = 27',
  '22 - 21 = 1',
  '10 + 5 = 15',
  '23 - 8 = 15',
  '12 / 2 = 6',
  '22 + 23 = 45',
  '8 + 15 = 23',
  '25 + 12 = 37',
  '13 * 23 = 299',
  '19 - 13 = 6',
]

export class ExpressionUnscramble extends GeneratorBase {

  title= "Unscramble: Expression";
  tags= ['Math', 'Memory'];
  text= "Unscramble the target expression and reach the result of ";


  constructor() {
    super();
  }

  public static getConfigTag() : string {
    return "GEN_ORDER.EXPRESSION";
  }

  public generate(selectedLevel : UnscrambleLevelType):Unscramble {

    let expression = this.getExpression();
    let target = expression.split("=")[0];
    let targetResult = parseInt(expression.split("=")[1]);
    let letters = UtilService.shuffleArray(target.split("")) as string[];
    //   let letters = ['20', '5', '1', '/','+']

    let s1 = new Unscramble( this.title, this.text + targetResult, "", this.descLink, this.tags, target, letters);
    s1.calc = true;
    s1.difficulty = 'Medium';
    s1.targetValue = targetResult;
    return s1;
  }

  public getExpression() : string {
    return getRandomElementFromList(EXERCISE).replace(/\s/g, "");
  }
}
