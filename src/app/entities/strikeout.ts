import {Quiz} from "./quiz";

const operatorLetters = "+-*/()=";

export const isOperatorCharacter = (c:string) : boolean =>  {
  return (operatorLetters.indexOf(c)) > -1;
};

export class Strikeout extends Quiz {

  type = "STRIKEOUT";
  cardClass = "uk-card-small uk-card-body strikeout-card base-card";
  mode = 0;

  public calc = true;
  public targetValue = 10;
  public targetString = "";

  items = [
    { label: '1', visible: true, visibleTag:'hidden', class:'number' },
    { label: '+', visible: true, visibleTag:'hidden', class:'number' },
    { label: '7', visible: true, visibleTag:'hidden', class:'number' }
  ];

  constructor(title: string, text: string, action: string, actionLink: string, tags: string[], answers:string[]) {
    super( title, text, action, actionLink, tags,answers);
    let r = Math.random();
    if (r < 0.2) {
      this.setCalcExercise("19+73-2", 10);
    } else if (r < 0.5) {
      this.setCalcExercise( "19+73-20+134", 10);
      //this.setExercise(false, "HHALxLOw", 0, "HALLO");
    } else if (r < 0.99) {
      this.setTextExercise( "HHALxLOw",  "HALLO");
    }
  }

  public getTransform2() {
    let length = 26+(this.items.length*25);
    return `translate(${155-(length/2)},5)`;
  }

  public getTransform(index:number) {
    return `translate(${(10+(index*25))},5)`;
  }

  public setCalcExercise( text:string, targetValue:number) {
    this.targetValue = targetValue;
    this.calc = true;
    this.init(text);
  }
  public setTextExercise( text:string, targetString:string) {
    this.targetString = targetString;
    this.calc = false;
    this.init(text);
  }

  private init(  text:string) {
    this.items = text.split('')
      .map( e=> { return {label:e, visible:true, visibleTag:'hidden',class:'number'}} );
    for( let i = 0; i< this.items.length; i++) {
      this.items[i].class = this.getClass(i);
    }
  }

  private getVisible(index:number) {
    return (this.items[index].visible)?"hidden":"visible";
  }
  private getClass(index:number) {
    if (isOperatorCharacter(this.items[index].label )) {
      return 'operator';
    } else {
      if (this.mode == 0) {
        return 'number';
      } else {
        return (this.items[index].visible)?'number_ok':'operator';
      }
    }
  }

  public clickNumber(index:number) {
    if ( this.mode ==1) return;
    if (isOperatorCharacter(this.items[index].label )) {
      return;
    }
    this.items[index].visible = !this.items[index].visible;
    this.items[index].visibleTag = this.getVisible(index);
    if (this.evaluate()) {
      this.mode = 1;
      this.hideCard();
    }
    for( let i = 0; i< this.items.length; i++) {
      this.items[i].class = this.getClass(i);
    }
  }

  private evaluate():boolean {
    let expression = this.items.filter( e=>e.visible ).map(e=>e.label).join('');
    if ( this.calc) {
      try {
        let result = eval(expression);
        return ( result == this.targetValue)
      } catch (e) {}
    } else {
      return (expression === this.targetString );
    }
    return false;
  }

}
