import {Card} from "./card";

export class Quiz extends Card {
  type = "QUIZ";
  cardClass = "uk-card-small uk-card-body quiz-card base-card";

  answers = ['Yes', 'No', 'don\'t know'];
  answersState = [1,1,1,1];
  answerCorrect = 3;
  answerGiven = -1;
  hasPictureContent = "";
  hasLongAnswers = false;
//  svgContent = "";
//  transformsvg1 = ""
//  transformsvg2 = ""
//  angle = 30

  parts :  {svg:string, transform:string}[] = [];
  buttonClass :string[] = [];
  buttonDisabled :string[] = [];

  constructor(title: string, text: string, action: string, actionLink: string, tags: string[], answers:string[]) {
    super( title, text, action, actionLink, tags);
    this.answers = answers;
    this.hasLongAnswers = (this.answers.join().length > 40);
    this.scrambleAnswers();
    for (let i = 0; i< 4; i++) {
      this.buttonClass[i] = this.getQuizButtonClass(i);
      this.buttonDisabled[i] = this.disabled(i);
    }
  }

  static createDummy() : Quiz {
    return new this('The title','This is the description',
      'Open Article', 'https://hirnsport.de', ['Brain', 'Info', 'Quiz'],['Answer1', 'Answer2', 'Answer3', 'Answer4'] );
  }

  disabled(id:number):string {
    if (this.answersState[id] == 0)
      return "disabled";
    return "";
  }

  protected setAnswers( newAnswers :string[]):void {
    this.answers = newAnswers;
    this.answerCorrect = 3;
    this.scrambleAnswers();
  }

  protected scrambleAnswers(): void {
    const newPos = Math.floor( Math.random()* this.answers.length );
    const swapAnswer = this.answers[newPos];
    this.answers[newPos] = this.answers[this.answerCorrect];
    this.answers[this.answerCorrect] = swapAnswer;
    this.answerCorrect = newPos;
  }

  public clickAnswer( answerNr : number) {
    this.answerGiven = answerNr;
    this.answersState = [0,0,0,0];
    for (let i = 0; i< 4; i++) {
      this.buttonClass[i] = this.getQuizButtonClass(i);
      this.buttonDisabled[i] = this.disabled(i);
    }
  }

  private getQuizButtonClass( idx:number):string {
    let className = "uk-button";
    if ( this.answerGiven !== -1 ) {
      if (this.answerCorrect == idx)
        return className+" uk-alert-success uk-animation-scale-up";
      if (this.answerGiven == idx && this.answerCorrect !== idx)
        return className+" uk-alert-danger uk-animation-shake";
      return className;
    } else {
      return className+" uk-button-primary";
    }
  }
}
