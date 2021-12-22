import { Component } from '@angular/core';
import {Card} from "./entities/card";
import {Quiz} from "./entities/quiz";
import { HttpClient } from '@angular/common/http';
import {CategoryItems, OpenTriviaQuizEntry, OpenTriviaQuizResponse} from "./entities/globaltypes";
import {Memorize} from "./entities/memorize";
import {MathExercisesService} from "./services/math-exercises.service";
import {MemoExercisesService} from "./services/memo-exercises.service";
import {Unscramble} from "./entities/unscramble";
import {UnscrambleExercisesService} from "./services/unscramble-exercises.service";
import {EventsService, ExerciseEvent} from "./services/EventService";
import {Crazy} from "./entities/crazy";

declare var UIkit: any;
const MAX_CARD = 125;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'uikit';

  skill='';
  answers=0;
  correct=0;
  category='';

  cards : Card[] = [];
  deletedId: number[] = [];
  markedForDelete: number[] = [];
  cardIndex = 0;

  skillList: CategoryItems[] = [
    {id:'', label:'All'}, {id:'Easy', label:'Easy'},{id:'Medium', label:'Medium'}, {id:'Hard', label:'Hard'}];

  categoryList: CategoryItems[] = [
    {id:'', label:'All'},
 //   {id:'Sports', label:'Sports'},{ id:'History', label:'History'},{id: 'Music', label:'Music'},
 //   {id:'Video Games', label:'Video Games'},
 //   {id:'Television',label:'Television'},
    {id:'Quiz', label:'Quiz'},
    {id:'Mathematics', label:'Mathematics'}, {id:'Memory', label:'Memory'}, {id:'Unscramble', label:'Unscramble'}
  ]

  modalitem = null;

  countMap = new Map<string, number>();

  constructor( private http: HttpClient,
               private events: EventsService,
               private mathService: MathExercisesService,
               private memoService: MemoExercisesService,
               private unscrambleService: UnscrambleExercisesService
  ){
    Unscramble.eventService = this.events;
    this.events.getObservable().subscribe((data:ExerciseEvent) => {
      this.removeCardId(data.id);
      this.answers++;
      if (data.correct) {
        this.correct++;
      }

    });

    this.addInitialData();

    let m2 = new Memorize(this.cards.length, "Memorize Numbers", "Keep these numbers in your memory:<br/>3, six, 14, 7, ten, 5.", "", "", ['Memory'], ['2', '4', '5', '3']);
    m2.text2 = "Recall: Answer this question:<br/>How many numbers where odd?";
    m2.difficulty='Medium';
    this.addToCards( m2 );

    let q2 = mathService.createExerciseCall(this.skill);
    this.addToCards( q2 );
  }

  addToCards( quizEntry : Card) : void {
    quizEntry.id = this.cardIndex;
    this.cardIndex++;
    this.cards.push( quizEntry );
  }

  isOfType(item:any) : string {
    if (item instanceof Unscramble ) return 'UNSCRAMBLE';
    if (item instanceof Memorize ) return 'MEMO';
    if (item instanceof Crazy ) return 'CRAZY';
    if (item instanceof Quiz ) return 'QUIZ';
    if (item instanceof Card ) return 'CARD';
    return 'NOTYPE';
  }
  getAsQuiz(item:any):Quiz {
    return <Quiz>item;
  }

   removeCardId(id:number): void {
    this.markedForDelete.push(id);
    // set Class fadeout
    //this.deletedId.push(id);
  }

  getDataTags(card:Card) : string {
    const dataTags:string[] = [];
    card.tags.forEach(e=>dataTags.push(e.replace(" ", "")));
    return dataTags.join(' ');
  }

  onClickAnswer( card:Card, answerNr:number) : void {
    let quizCard = card as Quiz;
    quizCard.answerGiven = answerNr;
    quizCard.answersState = [0,0,0,0];
    let e : ExerciseEvent = {id: quizCard.id, correct:quizCard.answerCorrect == answerNr};
    Unscramble.eventService.publishData(e);
  }

  getQuizButtonClass( card:Card, idx:number):string {
    let quizCard = card as Quiz;
    let className = "uk-button";
    if ( quizCard.answerGiven !== -1 ) {
      if (quizCard.answerCorrect == idx)
        return className+" uk-alert-success uk-animation-scale-up";
      if (quizCard.answerGiven == idx && quizCard.answerCorrect !== idx)
        return className+" uk-alert-danger uk-animation-shake";
      return className;
    } else {
      return className+" uk-button-primary";
    }
  }

  getCardClass(card :Card) : string {
    let cardClass = "uk-card-small uk-card-default uk-card-body";
    if ( card.tags[0] == 'Unscramble') {
      cardClass = cardClass + " unscramble-card"
    } else if ( card.tags[0] == 'Memory') {
      cardClass = cardClass + " memo-card"
    } else if ( card.tags[0] == 'Mathematics') {
      cardClass = cardClass + " math-card"
    } else {
      cardClass = cardClass + " quiz-card"
    }
    if (this.markedForDelete.indexOf(card.id) > -1 ) {
      return cardClass+" hideme";
    }
    return cardClass;
  }

  timeLeft: number = 60000;
  interval : any;

  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
        console.log("timer"+this.cards.length);
        this.getRefresh()

      } else {
        this.timeLeft = 6000;
      }
    },2000)
  }
  apiUrl = 'https://opentdb.com/api.php?amount=10&type=multiple';


  addDataToBoard( entries : OpenTriviaQuizEntry[]) :void {
    entries.forEach(item => {
      //console.log( JSON.stringify(item));
      item.incorrect_answers.push(item.correct_answer);
      item.category = item.category.replace("Entertainment: ", "");
      let tags = item.category.split( ': ');

      let quizEntry = new Quiz(this.cards.length, 'Quiz: '+tags[0], "<b>"+item.question+"</b>",
        'Open Article', 'https://hirnsport.de', tags, item.incorrect_answers );
      quizEntry.difficulty = item.difficulty;
      tags.push("Quiz");
      quizEntry.difficulty = quizEntry.difficulty.charAt(0).toUpperCase() + quizEntry.difficulty.slice(1);
      if (item.category.indexOf("Japanese Anime") < 0)
        this.addToCards( quizEntry);
    });
  }

  getData() :void {
    this.http.get<any>(this.apiUrl)
      .subscribe(data => {
        console.log(data);
        let q: OpenTriviaQuizResponse = data;
        this.addDataToBoard(q.results);
      });
  }

  addInitialData() {
    let s = {"response_code":0,"results":[{"category":"Entertainment: Video Games","type":"multiple","difficulty":"medium","question":"In the &quot;Halo&quot; franchise, in what country is New Mombasa?","correct_answer":"Kenya","incorrect_answers":["India","Turkey","Slovakia"]},{"category":"Entertainment: Music","type":"multiple","difficulty":"hard","question":"Which of these songs is not by Tatsuro Yamashita?","correct_answer":"Lucky Lady Feel So Good ","incorrect_answers":["Merry-Go Round","Let&#039;s Dance Baby","Love Talkin&#039;"]},{"category":"Entertainment: Video Games","type":"multiple","difficulty":"medium","question":"How many times do you fight the Imprisoned in The Legend of Zelda: Skyward Sword?","correct_answer":"3","incorrect_answers":["2","4","5"]},{"category":"Entertainment: Music","type":"multiple","difficulty":"medium","question":"In what film was the Michael Jackson song &quot;Will You Be There&quot; featured?","correct_answer":"Free Willy","incorrect_answers":["Sleepless in Seattle","Men in Black","Bad Boys"]},{"category":"Entertainment: Music","type":"multiple","difficulty":"medium","question":"Which of these is NOT a song by Pegboard Nerds?","correct_answer":"WiFi Tears","incorrect_answers":["Swamp Thing","Emoji","BAMF"]},{"category":"Entertainment: Television","type":"multiple","difficulty":"medium","question":"Baron Silas Greenback is the arch nemesis of which cartoon hero?","correct_answer":"Danger Mouse","incorrect_answers":["Bananaman","SuperTed","Captain Star"]},{"category":"Sports","type":"multiple","difficulty":"easy","question":"Who is often called &quot;the Maestro&quot; in the men&#039;s tennis circuit?","correct_answer":"Roger Federer","incorrect_answers":["Bill Tilden","Boris Becker","Pete Sampras"]},{"category":"History","type":"multiple","difficulty":"medium","question":"When did O, Canada officially become the national anthem?","correct_answer":"1980","incorrect_answers":["1950","1920","1880"]}]};
    this.addDataToBoard(s.results);
   // UIkit.modal.alert("UIkit alert!");
  }

  getRefresh() :void {
    if (this.cards.length > MAX_CARD) {
      // delete oldest
      for (let i=0;i< 8;i++ ) {
        this.removeCardId(this.cards[i].id)
      }
    }

    if (this.markedForDelete.length > 0) {
      let filtered: Card[] = [];
      for (let i = 0; i < this.cards.length; i++) {
        let index = this.markedForDelete.indexOf(this.cards[i].id);
        if (index == -1)
          filtered.push(this.cards[i]);
      }
      this.cards = filtered;
      this.markedForDelete = [];
    }

    let q2 = this.mathService.createExerciseRomanCall(this.skill);
    let q3 = this.mathService.createExerciseCall(this.skill);
    let q4 = this.memoService.createExerciseCall( this.skill);
    let q5 = this.memoService.createExerciseCall( this.skill);

    this.addToCards( q2 );
    this.addToCards( q3 );
    this.addToCards( q4 );
    this.addToCards( q5 );
    this.addToCards( this.mathService.createExerciseRomanQuizCall(this.skill));

    let s1 = this.unscrambleService.createExerciseCall(this.skill);
    this.addToCards( s1 );

    let m1 = this.unscrambleService.createMath();
    this.addToCards( m1 );

    let c1 = new Crazy(0,'Math: Crazy Digits','Digits are jumping around can You sum up all digit?',
      'Open Article', 'https://hirnsport.de', ['Mathematics', 'Crazy'],['Answer1', 'Answer2', 'Answer3', 'Answer4'] );
    this.addToCards(c1);
    this.calcCardCounts();
  }

  calcCardCounts():void {
    this.countMap = new Map<string, number>();
    for (let s of this.skillList ) {
      this.countMap.set( s.label, 0 );
    }
    for (let c of this.categoryList ) {
      this.countMap.set( c.label, 0 );
    }
    for (let c of this.cards) {
      let n = this.countMap.get(c.difficulty)||0;
      this.countMap.set(c.difficulty, n+1);
      for (let t of c.tags) {
        let n = this.countMap.get(t)||0;
        this.countMap.set(t, n+1);
      }
    }
    this.countMap.set("All",this.cards.length);
  }

  getAllCard():any[] {

    let filteredCards : Card[] = [];
    for (let i = 0; i < this.cards.length; i++) {
      const filterTags = this.cards[i].tags.join(",")+","+this.cards[i].difficulty;
      let pos = 1;
      if (this.category != '') {
        pos = filterTags.indexOf(this.category);
      }
      if ( (pos > -1) && (this.skill != '' )) {
        pos = filterTags.indexOf(this.skill);
      }
      if ( pos > -1)
          filteredCards.push(this.cards[i]);
    }

    return filteredCards;
  }

}
