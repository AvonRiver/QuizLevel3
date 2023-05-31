import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {combineLatest, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {DropdownOption} from '../types';

@Component({
  selector: 'app-autofilter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  styleUrls: ['./filter-dropdown.component.css']
})
export class FilterDropdownComponent<T extends DropdownOption> implements OnInit {

  @Input()
  entries$: Observable<T[]> = of([]);

  @Input()
  placeholder!: string;

  @Input()
  set selection(entry: T) {
    if (entry) {
      this.entryControl.setValue(entry.name);
    } else {
      this.entryControl.setValue('');
    }
  }

  @Output()
  selectionChange = new EventEmitter<T>();

  filteredEntries$!: Observable<T[]>;
  entryControl = new FormControl<string>('');

  ngOnInit() {
    this.filteredEntries$ = combineLatest([this.entryControl.valueChanges, this.entries$]).pipe(
      map(([userInput, entries]) => entries.filter(c => c.name.toLowerCase().indexOf((userInput ?? "").toLowerCase()) !== -1))
    );
  }

  newSelection(entry: T) {
    this.entryControl.setValue(entry.name);
    this.selectionChange.emit(entry);
  }
}
