import { TestBed } from '@angular/core/testing';

import { MemoExercisesService } from './memo-exercises.service';

describe('MemoExercisesService', () => {
  let service: MemoExercisesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemoExercisesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
