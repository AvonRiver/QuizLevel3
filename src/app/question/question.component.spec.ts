import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionComponent } from './question.component';
import { Question } from '../data.models';

describe('QuestionComponent', () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionComponent]
    });
    fixture = TestBed.createComponent(QuestionComponent);
    component = fixture.componentInstance;

    let question: Question = {
      question: '',
      correct_answer: '',
      incorrect_answers: [],
      all_answers: []
    }
    component.question = question;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
