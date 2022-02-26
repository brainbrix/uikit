import {Card} from "./card";
import {EventsService, ExerciseEvent} from "../services/EventService";

export class Unscramble extends Card {
  type = "UNSCRAMBLE";
  cardClass = "uk-card-small uk-card-body unscramble-card base-card";

  target = "MOUSE";
  letters = ["O", "U", "S", "M", "E"];
  mode = 0;

  letter = 0;
  state = [0,0,0,0,0];
  test = "____";

  calc = false;
  help = false;
  targetValue =0;
  error = 0;

  buttonDisabled : string[] = [];

  public static eventService: EventsService;

  constructor(title: string, text: string, action: string, actionLink: string, tags: string[], target:string, letters:string[]) {
    super( title, text, action, actionLink, tags);
    this.letters = letters;
    this.target = target;
    this.onClear(false);
    this.error = 0;
  }

  public onClick( idx:number):void {
    if (this.mode == 2) return;
    this.error = 0;
    if (this.letter < this.state.length) {
      this.state[idx] = 1;
      //this.test = this.test + this.letters[idx];
      this.test = this.test.substring(0,this.letter) + this.letters[idx] + this.test.substring(this.letter+1);
      this.letter = this.letter+1;
      if (this.target == this.test) {
        this.mode = 2;
        let e : ExerciseEvent = {card:this, correct:true, timeOut:false};
        Unscramble.eventService.publishData(e);
      } else {
        if (this.calc && this.letter == this.target.length) {
          console.log( this.test);
          let result = this.targetValue + 42;
          try {
            result = eval(this.test);
          } catch (e) {}
          if ( Math.round( result ) == this.targetValue ) {
            this.mode = 2;
            let e : ExerciseEvent = {card:this, correct:true, timeOut:false};
            Unscramble.eventService.publishData(e);
          } else {
            this.onClear(true);
          }
        } else {
          if (this.letter >= this.letters.length) {
            this.onClear(true);
          }
        }
      }
    }
    this.updateButtonDisabled();
  }

  public onClear( onError:boolean) : void {
    this.letter = 0;
    this.state = [...Array(this.letters.length)].map(x => 0);
    this.test = "_".repeat(this.letters.length);
    this.updateButtonDisabled();
    if ( onError )
      this.error = 1;
  }
  public onHelp() : void {
    if (this.letter < this.state.length-1)  {
      let letterToSolve = this.target.substring(this.letter,this.letter+1);
      for (let idx=0; idx < this.letters.length; idx++) {
        if (this.letters[idx] == letterToSolve && this.state[idx] == 0) {
          this.onClick(idx);
          return;
        }
      }
    }
  }

  private disabled(id:number):string {
    return (this.state[id] == 1)?"disabled":"";
  }
  private updateButtonDisabled() {
    this.buttonDisabled = [];
    for (let i = 0; i < this.state.length; i++){
      this.buttonDisabled.push(this.disabled(i));
    }
  }

}
