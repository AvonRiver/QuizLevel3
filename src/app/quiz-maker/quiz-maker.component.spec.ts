import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizMakerComponent } from './quiz-maker.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Category } from '../data.models';

describe('Quiz Maker creation', () => {
  let component: QuizMakerComponent;
  let fixture: ComponentFixture<QuizMakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuizMakerComponent],
      providers: [HttpClient, HttpHandler]
    }).compileComponents();
    fixture = TestBed.createComponent(QuizMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

describe('Category separation', () => {
  let component: QuizMakerComponent;
  let fixture: ComponentFixture<QuizMakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuizMakerComponent],
      providers: [HttpClient, HttpHandler]
    }).compileComponents();
    fixture = TestBed.createComponent(QuizMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have 1 parent category id of 2 with two sub categories', () => {

    let allCategories: Category[] = [];
    allCategories.push({ id: 1, name: 'No sub 1', parentId: 0 });
    allCategories.push({ id: 2, name: 'Parent 1 : Sub 1', parentId: 0 });
    allCategories.push({ id: 3, name: 'Parent 1 : Sub 2', parentId: 0 });
    allCategories.push({ id: 4, name: 'No sub 2', parentId: 0 });

    component.buildCategoryList(allCategories);

    const categoriesWithSubCategories = component.parentCategoriesWithChildren;

    expect(categoriesWithSubCategories.length).toBe(2);

    let subCat = categoriesWithSubCategories.find(x => x.name === 'Sub 1');
    expect(subCat?.parentId).toBe(2);
    expect(subCat?.id).toBe(2);

    subCat = categoriesWithSubCategories.find(x => x.name === 'Sub 2');
    expect(subCat?.parentId).toBe(2);
    expect(subCat?.id).toBe(3);
  });

  it('should be no sub categories', () => {

    let allCategories: Category[] = [];
    allCategories.push({ id: 1, name: 'No sub 1', parentId: 0 });
    allCategories.push({ id: 2, name: 'No sub 2', parentId: 0 });
    allCategories.push({ id: 3, name: 'No sub 3', parentId: 0 });
    allCategories.push({ id: 4, name: 'No sub 4', parentId: 0 });

    component.buildCategoryList(allCategories);

    const categoriesWithSubCategories = component.parentCategoriesWithChildren;

    expect(categoriesWithSubCategories.length).toBe(0);
  });

});
