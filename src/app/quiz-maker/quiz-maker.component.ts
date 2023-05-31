import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category, Difficulty, Question} from '../data.models';
import {BehaviorSubject, Observable, Subject, of, takeUntil, tap} from 'rxjs';
import {QuizService} from '../quiz.service';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css']
})
export class QuizMakerComponent implements OnInit, OnDestroy {

  readonly SUB_CATEGORY_KEY: string = ':';

  questions$!: Observable<Question[]>;
  parentCategories$ = new BehaviorSubject<Category[]>([]);
  subCategories$ = new BehaviorSubject<Category[]>([]);  
  allowChangeQuestion: boolean = true;
  categorySelected: Category = {} as Category;
  subCategorySelected: Category = {} as Category;
  showSubCategory = false;

  private questions: Question[] = [];
  private parentCategoriesWithChildren: Category[] = [];
  private selectedDifficulty: Difficulty | null = null;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(protected quizService: QuizService) {}

  ngOnInit() {
    this.quizService.getAllCategories().pipe(takeUntil(this.destroy$))
      .subscribe((allCategories: Category[]) => {
        this.buildCategoryList(allCategories);
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  categorySelectedClick(category: Category) {
    this.clearDisplayedQuestions();
    this.showSubCategoriesIfAny(category.id);
  }

  subCategorySelectedClick() {
    this.clearDisplayedQuestions();
  }  

  difficultySelected() {
    this.clearDisplayedQuestions();
  }  

  createQuiz(difficulty: string): void {

    this.allowChangeQuestion = true;

    this.selectedDifficulty = difficulty as Difficulty;

    const categoryId = this.selectedCategoryId();

    this.questions$ = this.quizService.createQuiz(categoryId, difficulty as Difficulty).pipe(
      tap (x => { this.questions = x })
    );
  }

  changeQuestionEvent(questionIndex: number): void {

    this.allowChangeQuestion = false;

    const categoryId = this.selectedCategoryId();

    this.quizService.createQuiz(categoryId, this.selectedDifficulty as Difficulty).pipe(takeUntil(this.destroy$))
      .subscribe(x => {
        this.questions[questionIndex] = x[questionIndex] ;
        this.questions$ = of(this.questions);
      })
  }

  private selectedCategoryId(): number {
    let categoryId: number = this.categorySelected.id;

    if (this.showSubCategory === true) {
      categoryId = this.subCategorySelected.id;
    }
    return categoryId;
  }

  private clearDisplayedQuestions(): void {
    this.questions$ = of([]);
  }

  private buildCategoryList(allCategories: Category[]): void {
    let fullCategoryList: Category[] = []

    allCategories.forEach( category => {
      let separatorIndex: number = category.name.indexOf(this.SUB_CATEGORY_KEY);
      if (separatorIndex === -1) {
        // Directly add if no sub category
        fullCategoryList.push(category);
      }
      else {
        let parentName: string = category.name.substring(0, separatorIndex);
        // Add the category if not already in category list
        if (fullCategoryList.find(x => x.name === parentName) === undefined) {
          fullCategoryList.push({id: category.id, name: parentName} as Category);
        };

        // Get the sub category name
        let subCategory = category.name.substring(separatorIndex+2);
        let parentId = fullCategoryList.find(x => x.name === parentName)?.id;
        if (parentId) {
          this.parentCategoriesWithChildren.push(
            {
              parentId: parentId, 
              id: category.id, 
              name: subCategory 
          });
        }
      }
    });

    this.parentCategories$.next(fullCategoryList);
  }

  private showSubCategoriesIfAny(parentCategoryId: number) : void {
    this.showSubCategory = false;

    this.subCategorySelected = {} as Category;

    const subCategories: Category[] = this.findAnySubCategoriesOfParent(parentCategoryId);

    this.subCategories$.next(subCategories);

    if (subCategories.length > 0) {
      this.showSubCategory = true;
    }
  }

  private findAnySubCategoriesOfParent(parentCategoryId: number): Category[] {
    return this.parentCategoriesWithChildren.filter(x => x.parentId === parentCategoryId);
  }

}
