export class Card {

  type = "CARD";
  cardClass = "uk-card-small uk-card-body info-card base-card";

  title = 'The title';
  text = 'This is the description.';
  action = 'Open Article';
  actionLink = 'https://hirnsport.de';
  tags = ['Info', 'Quiz'];
  difficulty = 'Medium';
  hide = false;

  constructor(title: string, text: string, action: string, actionLink: string, tags: string[]) {
    this.title = title;
    this.text =text;
    this.action = action;
    this.actionLink = actionLink;
    this.tags = tags;
   // this.tags = this.tags.splice(p,1);
   // this.getCardClass(this);
  }

  static createDummy() : Card {
    return new this('Info Card','This is an information card.', 'Open Hirnsport.de', 'https://hirnsport.de', [ 'Info'] );
  }

  public hideCard():void {
    this.hide = true;
    this.cardClass = this.cardClass+ " hideme";
  }
}
