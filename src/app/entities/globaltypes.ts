//type OpenTriviaQuizEntry = {category:string; type:string; difficulty:string; question:string; correct_answer:string; incorrect_answers:string[]};
//type OpenTriviaQuizResponse = {response_code:number; results:OpenTriviaQuizEntry[]};

export interface OpenTriviaQuizEntry {
  category:string;
  type:string;
  difficulty:string;
  question:string;
  correct_answer:string;
  incorrect_answers:string[];
}

export interface OpenTriviaQuizResponse {
  response_code:number;
  results:OpenTriviaQuizEntry[]
}

export interface CategoryItems {
  label: string;
  id: string;
}

export type SvgInHtml = HTMLElement & SVGGraphicsElement;
