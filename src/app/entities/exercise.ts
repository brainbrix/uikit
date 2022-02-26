export class Exercise {

  title = 'The title';

  //public imageLabels: string[];

  constructor(public id: string, public text: string, public word: string, public answers: string[],
              public correctIndex: number, public imgUrl: string,
              public category: number, public difficulty: number, public keyWords: string) {

  }
  /*
      static fromQuizData(quizData : any ) : Question {
          return new this( quizData.)
      }
  */
  static fromSimpleData(id: string, question: string, word: string, answers: string[], correctIndex: number ) {
    return new this( id, question, word, answers, correctIndex, '', 0 , 0,  '');
  }

  static fromHirnSportData(id: string, question: string , word: string, answers: string[], correctIndex: number, imgUrl: string  ) {
    return new this( id, question, word, answers, correctIndex, imgUrl, 0, 0,  '');
  }

  static fromSimpleDataWithTitle( id: string, title: string, question: string , answers: string[], correctIndex: number ) {
    const questionObject =  new this( id, question, '', answers, correctIndex, '', 0 , 0,  '');
    questionObject.title = title;
    return questionObject;
  }

  getCorrectIndex(): number {
    return this.correctIndex;
  }

  getAnswers(): string[] {
    return this.answers;
  }

  getText(): string {
    return this.text;
  }


}
