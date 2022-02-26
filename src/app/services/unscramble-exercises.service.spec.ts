import { TestBed } from '@angular/core/testing';

import { UnscrambleExercisesService } from './unscramble-exercises.service';

describe('UnscrambleExercisesService', () => {
  let service: UnscrambleExercisesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnscrambleExercisesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
