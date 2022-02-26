
export class UtilService {

  static randomValueNearTarget( target : number, rangePercent: number ) {
    if (Math.abs(target) < 10) {
      console.warn("randomValueNearTarget() for low value:", target);
      return UtilService.randomValue(1, 10);
    }
    let minRange = target * (1.0 - rangePercent );
    let maxRange = target * (1.0 + rangePercent );
    let randomValue = target;
    while ( (randomValue == target ) || (randomValue == 0)) {
      randomValue = Math.floor( Math.random() * (maxRange - minRange + 1) + minRange);
    }
    return randomValue;
  }

  static randomValue( min:number, max:number) : number {
    return Math.floor( Math.random() * (max - min + 1) + min);
  }
  static randomValueNonNull( min:number, max:number) : number {
    let value = 0;
    while (value == 0) {
      value = Math.floor( Math.random() * (max - min + 1) + min);
    }
    return value;
  }

  static shuffleArray(array:any[]) : any[] {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
}
