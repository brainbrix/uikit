import {Quiz} from "./quiz";
import {ExerciseEvent} from "../services/EventService";
import {Unscramble} from "./unscramble";

export type elementType = { x:number, y:number,dx:number, dy:number, r:number, dr:number, s:number, ds:number, label:string, color:string, t1:string, t2:string};

const TIME_FRACTION_MS = 80;

export class Crazy extends Quiz {
  type = "CRAZY";
  cardClass = "uk-card-small uk-card-body crazy-card base-card";

  intervalId = 0;
  mode = 0;
  timer = 0;
  timerMax = 25 * 1000;
  timerValue = "100";
  elementType = "LETTER"

  public letters: elementType[] = [
    {x:10, y:20, dx:2, dy:2, r:0, dr:-2, s:1.0, ds:0.02, label:"X", color:"red", t1:"", t2:""},
    {x:20, y:40, dx:2, dy:2, r:10, dr:5,s:1.0, ds:0.01, label:"Y", color:"red", t1:"",t2:""}];

  constructor(title: string, text: string, action: string, actionLink: string, tags: string[], answers:string[]) {
    super( title, text, action, actionLink, tags,answers);
    this.timer = 0;
  }

  private moveElement(element:elementType) {
    element.x = element.x + element.dx;

    if ( element.x < 5 ) { element.dx = 2;
    } else if ( element.x > 96 ) { element.dx = -2 }

    element.y = element.y + element.dy;
    element.dy = element.dy +0.3;
    if ( element.y > 76 ) {
      element.dy = element.dy * -0.955;
    }
    element.r = (element.r + element.dr)%360;

    element.s = element.s+element.ds;
    if ( (element.s > 2.5) || (element.s < 0.4)) {
      element.ds = element.ds*-1;
    }
    element.t1 = "translate("+element.x.toFixed(1)+","+element.y.toFixed(1)+")" as string;
    element.t2 = "scale("+element.s.toFixed(1)+") rotate("+element.r+")"
  }

  public getTransformGroup(element:elementType):string {
    return "translate("+element.x.toFixed(1)+","+element.y.toFixed(1)+")";
  }

  public getTransform(element:elementType):string {
    return "scale("+element.s.toFixed(1)+") rotate("+element.r+")";
  }
  public getColor(element:elementType):string {
    return element.color;
  }

  //getTimer() : string {
  //  return Math.abs(100-(100*(this.timer/ this.timerMax)) ).toFixed(0);
 // }

  start():void {

    if (this.intervalId != 0) {
      clearInterval(this.intervalId);
      this.intervalId = 0;
      this.mode = 2;
      return;
    }
    this.mode = 1;
    this.intervalId = setInterval(() => {
      this.letters.forEach( e=>this.moveElement(e));
      this.timer = this.timer + TIME_FRACTION_MS;
      this.timerValue = (100-(100*(this.timer/ this.timerMax))).toFixed(1);
      if (this.timer > this.timerMax) {
        clearInterval(this.intervalId);
        let e : ExerciseEvent = {card:this, correct:false, timeOut:true};
        Unscramble.eventService.publishData(e);
        this.clickAnswer(17);
      }
    }, TIME_FRACTION_MS);

  }

}
