
export class GeneratorBase {

  title = "base.title";
  text = "base.text";
  language = "en";
  descLink = "";

  public static getConfigTag(): string {
    return "";
  }

  public init(configObj: any) {
    this.title = configObj["title"];
    this.text = configObj["text"];
    this.descLink = configObj["descLink"];
    if ( configObj["language"] ) {
      this.language = configObj["language"];
    }
  }

}
