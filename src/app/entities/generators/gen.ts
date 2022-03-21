import {ALL_WORDS_EN} from "./data";

type FunctionName = (n: string) => boolean;
type NumberFunctionName = (n: number) => boolean;
type AnyFunctionName = (n: any) => boolean;

export const notInList = (wordList:any[] ) : FunctionName => {
  return (word)=>!wordList.includes(word);
}

export const notIn = (anyList:any[] ) : AnyFunctionName => {
  return (nr)=>!anyList.includes(nr);
}

export const not = (anyElement:any ) : AnyFunctionName => {
  return (nr)=>(anyElement != nr);
}

export const getRandomWord = () : string => {
  let word = ALL_WORDS_EN[ randomNumberInRange(0, ALL_WORDS_EN.length-1)];
  return word;
}

export const getRandomElementFromList= (wordList : string[]) : string => {
  let word = wordList[ randomNumberInRange(0,wordList.length-1)];
  return word;
}

export const getRandomElementFromListFn= (wordList : string[], callback: (n: any) => boolean) : string => {
  let word: any;
  do {
    word = wordList[randomNumberInRange(0, wordList.length - 1)];
  } while (!callback(word))
  return word;
}

export const randomElementsFromList= (list : any[], count : number) : any[] => {
  let indexes :number[] = [];
  do {
    let newIndex = randomNumberInRange(0,list.length-1);
    if (!indexes.includes(newIndex))
      indexes.push(newIndex);
  } while (indexes.length < count);
  let resultList: any[] = [];
  indexes.forEach( e => {resultList.push(list[e])});
  return resultList;
}

export const randomElementsFromListFn= (list : any[], count : number, callback: (n: any) => boolean) : any[] => {
  let indexes :number[] = [];
  do {
    let newIndex = randomNumberInRange(0,list.length-1);
    if (!indexes.includes(newIndex) && callback(list[newIndex]))
      indexes.push(newIndex);
  } while (indexes.length < count);
  let resultList: any[] = [];
  indexes.forEach( e => {resultList.push(list[e])});
  return resultList;
}

export const getRandomWordWithFn = (wordList : string[], callback: (n: string) => boolean ) : string => {
  let word = "";
  do {
    word = wordList[ randomNumberInRange(0,wordList.length-1)];
  } while (!callback( word ));
  return word;
}

export const getRandomWordsWithFn = (wordList : string[], count:number, callback: (n: string) => boolean ) : string[] => {
  let wordResultList : string[] = [];
  while ( wordResultList.length < count) {
    let word = "";
    do {
      word = wordList[randomNumberInRange(0, wordList.length - 1)];
    } while (!callback(word));
    if ( !wordResultList.includes(word))
      wordResultList.push(word);
  }
  return wordResultList;
}

export const getRandomWords = ( wordList: string[], count: number) : string[] => {
  let wordResultList : string[] = [];
  while ( wordResultList.length < count) {
    let word = getRandomElementFromList( wordList );
    if ( !wordResultList.includes(word)) {
      wordResultList.push( word );
    }
  }
  return wordResultList;
}

export const randomNumberInRange = ( min:number, max:number ): number => {
  return Math.floor( Math.random() * (max - min + 1) + min);
}

export const randomNumberInRangeFn = ( min:number, max:number, callback: (n: any) => boolean ): number => {
  let value = 0;
  do {
    value = Math.floor(Math.random() * (max - min + 1) + min);
  } while ( !callback(value));
  return value;
}

export const getRandomNumbersInRangeFn = (count:number, min:number, max:number, nrArray:number[] ): number[] => {
  let nrResultList : number[] = [];
  while ( nrResultList.length < count) {
    let nr = 0;randomNumberInRange(min,max);
    do {
      nr = randomNumberInRange(min,max);
    } while (nrArray.includes(nr));
    if ( !nrResultList.includes(nr))
      nrResultList.push(nr);
  }
  return nrResultList;
}

export const  convert2Roman = ( nr2Convert : number ): string => {

  if ( nr2Convert == 0) return '';
  let romanNrResult = '';
  if ( nr2Convert < 0 ) {
    romanNrResult = '-';
    nr2Convert = Math.abs(nr2Convert);
  }

  let lookup: {[index: string]:any} = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
  let romanSymbol="";

  for ( romanSymbol in lookup ) {
    while ( nr2Convert >= lookup[romanSymbol] ) {
      romanNrResult += romanSymbol;
      nr2Convert -= lookup[romanSymbol];
    }
  }
  return romanNrResult;
}

export class Gen { }
