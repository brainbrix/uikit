import { TestBed } from '@angular/core/testing';

import { MathExercisesService } from './math-exercises.service';

describe('MathExercisesService', () => {
  let service: MathExercisesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MathExercisesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
