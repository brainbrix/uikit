import {Quiz} from "./quiz";

export class Memorize extends Quiz {
  type = "MEMO";
  cardClass = "uk-card-small uk-card-body memo-card base-card";

  mode = 0;
  text2='';

}
