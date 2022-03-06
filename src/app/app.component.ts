import { Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {Card} from "./entities/card";
import {Quiz} from "./entities/quiz";
import { HttpClient } from '@angular/common/http';
import {CategoryItems, OpenTriviaQuizEntry, OpenTriviaQuizResponse} from "./entities/globaltypes";
import {MathExercisesService} from "./services/math-exercises.service";
import {MemoExercisesService} from "./services/memo-exercises.service";
import {Unscramble} from "./entities/unscramble";
import {UnscrambleExercisesService} from "./services/unscramble-exercises.service";
import {EventsService, ExerciseEvent} from "./services/EventService";
import {Version} from "../version";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {TranslateService } from '@ngx-translate/core';
import {QuizExercisesService} from "./services/quiz-exercises.service";
import {StrikeoutGen} from "./entities/generators/strikeout/strikeoutGen";
import {ColorWordQuizGen} from "./entities/generators/quiz/colorWordQuizGen";

declare var UIkit: any;
const MAX_CARD = 125;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  skill='';
  category='';

  answers=0;
  correct=0;

  cards : Card[] = [];
//  cardIndex = 0;

  skillList: CategoryItems[] = [
    {id:'', label:'GENERAL.All'}, {id:'Easy', label:'GENERAL.Easy'},{id:'Medium', label:'GENERAL.Medium'}, {id:'Hard', label:'GENERAL.Hard'}];

  categoryList: CategoryItems[] = [
    {id:'', label:'GENERAL.All'},
    //   {id:'Sports', label:'Sports'},{ id:'History', label:'History'},{id: 'Music', label:'Music'},
    //   {id:'Video Games', label:'Video Games'},
    //   {id:'Television',label:'Television'},
    {id:'Perception', label:'GENERAL.Perception'},{id:'Language', label:'GENERAL.Language'},
    {id:'Math', label:'GENERAL.Math'}, {id:'Memory', label:'GENERAL.Memory'}
  ]

  modalitem : any;
  countObj:any = {"Quiz":0};
  showfilter=false;

  doToggleFilter() {
    this.showfilter = !this.showfilter;
  }

  // @ts-ignore
  constructor( @Inject(DOCUMENT) document, private http: HttpClient,
               private events: EventsService,
               private quizService: QuizExercisesService,
               private mathService: MathExercisesService,
               private memoService: MemoExercisesService,
               private unscrambleService: UnscrambleExercisesService,
               private sanitizer: DomSanitizer,
               private translateService: TranslateService
  ){
    console.log('setInitialAppSettings()' );
//      this.translateService.setTranslation("en", );
//    this.translateService.setTranslation("de", );
//      let language = this.translateService.getBrowserLang();
    let language = Version.lang;
    console.log("getBrowserLang",language);
    if (!language) {
      language = 'en';
    }
//      language = 'de';
    this.translateService.setDefaultLang(language);


    //console.log("translateStr ", translateStr);
    /*
          this.storage.get(LNG_KEY).then(val => {
            if (val) {
              this.setLanguage(val);
              this.selected = val;
            }
          });
        }
      */

    Unscramble.eventService = this.events;
    this.events.getObservable().subscribe((data:ExerciseEvent) => {

      this.removeCardId(data.card);
      this.answers++;
      if (data.correct) {
        this.correct++;
      }
    });

  }

  async ngOnInit() {
    console.log('ngOnInit()');

    //await this.translateService.use('en').toPromise();

    await this.translateService.get( 'HOME.linkTitleWebsite').toPromise();
    let translateStr = this.translateService.instant( 'HOME.linkTitleWebsite');
    // language = this.translateService.currentLang;
    // console.log("Language used: ", language);
    // translateService.use("en").subscribe(res => {
    //   this.modalitem = new CrazyNumbersGen().generate();
    //let translateStr = this.translateService.get( 'HOME.linkTitleWebsite');
//        console.log("translateStr ", translateStr);
//    this.addInitialData();

//    let m2 = new Memorize("Memorize Numbers", "Keep these numbers in your memory:<br/>3, six, 14, 7, ten, 5.", "", "", ['Memory'], ['2', '4', '5', '3']);
//    m2.text2 = "Recall: Answer this question:<br/>How many numbers where odd?";
//    m2.difficulty='Medium';
    //   this.addToCards( m2 );

//    let q2 = this.mathService.createExerciseCall(this.skill);
//    this.addToCards( q2 );
    this.getRefresh();
  }

  showItem():void {
    UIkit.modal("#crazy-modal").show();
  }

  addToCards( quizEntry : Card) : void {
    this.cards.push( quizEntry );
  }

  getAsQuiz(item:any):Quiz {
    return <Quiz>item;
  }

  removeCardId(card:Card): void {
    card.hideCard();
  }

  removeOnClose(card:Card): void {
    card.hideCard();
    this.cards= this.cards.filter( c => c != card );
    this.calcCardCounts();
  }

  getDataTags(card:Card) : string {
    const dataTags:string[] = [];
    card.tags.forEach(e=>dataTags.push(e.replace(" ", "")));
    return dataTags.join(' ');
  }

  onClickAnswer( card:Card, answerNr:number) : void {
    let quizCard = card as Quiz;
    quizCard.clickAnswer(answerNr);
    this.removeCardId(card);

    let e : ExerciseEvent = {card:quizCard, correct:quizCard.answerCorrect == answerNr, timeOut:false};
    Unscramble.eventService.publishData(e);
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

      let quizEntry = new Quiz('Quiz: '+tags[0], "<b>"+item.question+"</b>",
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

  action=false;
  getRefresh() :void {
    if (this.action)
      return;
    this.action = true;
    setTimeout(() => { this.getRefreshIntern();}, 250);
  }

  private getRefreshIntern() :void {

    let cards :Card[] = [];

    let gen1 = new ColorWordQuizGen();
    let configObject1  = this.translateService.instant(ColorWordQuizGen.getConfigTag());
    configObject1["language"] = this.translateService.getDefaultLang();
    gen1.init( configObject1);
    let so1 = gen1.generate() ;

    let gen = new StrikeoutGen();
    let configObject  = this.translateService.instant(StrikeoutGen.getConfigTag());
    configObject["language"] = this.translateService.getDefaultLang();
    gen.init( configObject);
    let so = gen.generate("")

 //   let so2 = new Strikeout("Ziffern entfernen", "Entfernen Sie in der Rechnung zwei Ziffern und erreichen Sie das Ergebnis: 10", "", "", ["Math"],[] );
    cards.push( so );
    cards.push( so1 );
//    cards.push( so2 );
    cards.push(  this.memoService.createNrExercise());

    cards.push( this.quizService.createWordScrambleQuiz(this.skill) );
    cards.push( this.mathService.createExerciseRomanCall(this.skill) );
    cards.push( this.mathService.createExerciseCall(this.skill) );
    cards.push( this.memoService.createExerciseCall( this.skill) );
    cards.push( this.memoService.createExerciseCall( this.skill) );
    cards.push( this.mathService.createExerciseRomanQuizCall(this.skill));
    cards.push( this.quizService.createWortCategoryQuiz(this.skill));
    cards.push( this.quizService.createWortCategoryQuiz(this.skill));

    cards.push( this.unscrambleService.createExerciseCall(this.skill) );
    cards.push( this.unscrambleService.createMath() );

    cards.push (this.quizService.createCrazyNumberQuiz(""));
    cards.push( this.quizService.createCrazyLetterQuiz(""));

    cards.push( this.quizService.createMemoQuiz(""));
    cards.push( this.quizService.createMemoQuiz(""));

    cards.push( this.quizService.createCountryMultipleBorder(""));
    cards.push( this.quizService.createCountryBorder(""));

    //cards.push( Card.createDummy());

    if (this.cards.length > MAX_CARD) {
      for (let i=0;i< 20;i++ ) {
        this.cards[i].hide = true;
      }
    }
    let newCards = this.cards.filter( card => !card.hide );

    newCards.push(...cards);
    this.cards = newCards;
    //this.calcCardCounts();
    setTimeout(() => { this.calcCardCounts();}, 200);
    this.action = false;
  }

  calcCardCounts():void {
    let co:any = {};
    this.skillList.forEach(e=>{ co[e.id] = 0;});
    this.categoryList.forEach(e=>{ co[e.id] = 0; })
    for (let c of this.cards) {
      co[c.difficulty] = co[c.difficulty]+1;
      for (let t of c.tags) {
        co[t] = co[t]+1;
      }
    }
    co[""]= this.cards.length;
    this.countObj = co;
  }

  private filterSkill() : Card[] {
    if (this.skill != "" ) {
      return this.cards.filter( card =>{return card.difficulty == this.skill});
    }
    return this.cards;
  }
  private filterCategory() : Card[] {
    if ( this.category != "" ) {
      return this.filterSkill().filter(card => {
        return card.tags.includes(this.category);
      });
    } else {
      return this.filterSkill();
    }
  }

  getAllCard():any[] {
    if (this.skill == "" && this.category == "")
      return this.cards;
    return this.filterCategory();
  }

  getVersion() : string {
    return Version.number
  }

  getSvgContent( svgString :string) :SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svgString);
  }

  onLanguage():void {
    let language = this.translateService.getDefaultLang();
    if ( language == "en") {
      language = "de";
    } else {
      language = "en";
    }
    this.translateService.setDefaultLang(language);
    this.cards = [];
    this.getRefresh();
  }
  getLanguage():string {
    return this.translateService.getDefaultLang();
  }
  /*
    checkPicture(quiz:Quiz) : void {

      if ( quiz.hasPicture()) {
        let element : SvgInHtml = document.getElementById('layer1'+quiz.id) as unknown as SvgInHtml;
        if ( element ) {
          let bbox=element.getBBox();
  //        console.log("box", bbox);

        //    let viewBoxX = 0;
        //    let viewBoxY = 0;
          const viewBoxWidth = 1000;
          const viewBoxHeight = 800;

         //   let cx = viewBoxX +(viewBoxWidth/2);
         //   let cy = viewBoxY +(viewBoxHeight/2);

            let scaleFactorX = 0.42* viewBoxWidth / (bbox.width / 2);
            let scaleFactorY = 0.42* viewBoxHeight / (bbox.height / 2);
            let minScaleFactor = Math.min(scaleFactorX, scaleFactorY);
          minScaleFactor = 1.0;
  //          var x = cx - ( bbox.width-bbox.x) / 2;
  //          var y = cy - ( bbox.height-bbox.y) / 2;
  //          x = x * minScaleFactor;
  //          y = y * minScaleFactor;

            let x = (viewBoxWidth - ((bbox.width+bbox.x) * minScaleFactor))/2;
            let y = (viewBoxHeight - ((bbox.height+bbox.y) * minScaleFactor))/2;
  x = 0;
  y = 0;
            //x = (+1)*bbox.x*minScaleFactor;
            //y = (+1)*bbox.y*minScaleFactor;
            //var matrix = '1 0 0 1 ' + x + ' ' + y;
            //console.log("matrix", matrix);

            //element.setAttribute('transform', 'matrix(' + matrix + ')');
            //quiz.transformsvg1 = 'translate(' + x.toFixed(1)+','+y.toFixed(1) + ')';
            //quiz.transformsvg2 = 'scale('+minScaleFactor.toFixed(1)+','+minScaleFactor.toFixed(1)+')';

            let centerBoundingBoxX = ( bbox.width-bbox.x) / 2;
            let centerBoundingBoxy = ( bbox.height-bbox.y) / 2;

          centerBoundingBoxX = 500;
          centerBoundingBoxy = 400;

            //let angel = randomNumberInRange(0,360);
            //quiz.transformsvg2 = quiz.transformsvg2 + " rotate( "+angel+","+centerBoundingBoxX.toFixed(1)+","+centerBoundingBoxy.toFixed(1)+" )";

          //}
        }
      }
    }
   */
}
