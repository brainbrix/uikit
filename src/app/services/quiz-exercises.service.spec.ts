import { TestBed } from '@angular/core/testing';

import { QuizExercisesService } from './quiz-exercises.service';

describe('QuizExercisesService', () => {
  let service: QuizExercisesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizExercisesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
