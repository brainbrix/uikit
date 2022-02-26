import {
  termsDe,
  termsEn,
  words4de,
  words4en,
  words5de,
  words5en,
  words6de,
  words6en,
  words7de,
  words7en,
  words8de,
  words8en
} from "./words";
import {
  getRandomElementFromList,
  getRandomWords,
  notIn,
  notInList,
  randomNumberInRange,
  randomNumberInRangeFn
} from "./gen";

export const colorList = ['#f68501', '#7CBB00', '#ff474f', '#0056f1',
  '#ee00ee','#8159f8','#32acfa', '#46464a'];

export const colorList2 = ['#f68501', '#F65314', '#7CBB00', '#00A1F1', '#FFBB00', '#ee00ee', '#aaaaaa'];

export const ALL_WORDS_EN = words5en.concat( words4en ).concat( words6en ).concat( words7en ).concat( words8en );
export const ALL_WORDS_DE = words5de.concat( words4de ).concat( words6de ).concat( words7de ).concat( words8de );

export const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const getRandomLetter= () : string => {
  return ALL_LETTERS.charAt(Math.floor(Math.random() * ALL_LETTERS.length));
}

export class Data {

  static getWordsListForLanguage( language:string ) : string[] {
    if (language == 'de') {
      return ALL_WORDS_DE
    } else {
      return ALL_WORDS_EN
    }
  }

  static getTermsForLanguage( language:string ) :{ words: string[]; categoryName: string }[] {
    if (language == 'de') {
      return termsDe;
    } else {
      return termsEn;
    }
  }

  static getDataForCategoryQuiz(language:string) :string[] {
    let terms = Data.getTermsForLanguage( language );
    let cat1 = randomNumberInRange(0, terms.length-1 );
    let cat2 = randomNumberInRangeFn(0, terms.length-1,notIn([cat1]) );

    let answers = getRandomWords( terms[cat1].words,3);
    answers.push( getRandomElementFromList(terms[cat2].words) );

    // Which word is the odd one out?
    // Which word does not belong to the other words in the list?

    return answers
  }
}
