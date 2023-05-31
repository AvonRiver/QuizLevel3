import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswersComponent } from './answers.component';
import { Question, Results } from '../data.models';

describe('AnswersComponent', () => {
  let component: AnswersComponent;
  let fixture: ComponentFixture<AnswersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnswersComponent]
    });
    fixture = TestBed.createComponent(AnswersComponent);
    component = fixture.componentInstance;

    let questions: Question[] = [];

    let results: Results = {
      questions: questions,
      answers: [],
      score: 123
    }
    component.data = results;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
