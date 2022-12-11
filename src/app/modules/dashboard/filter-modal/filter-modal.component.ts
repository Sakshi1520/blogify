import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogData } from '@models/filter-modal';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss']
})
export class FilterModalComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  count = 0;
  addOnBlur = true;
  filterForm!: FormGroup;
  filterCountSub$ = new BehaviorSubject<number>(0);
  filterAuthor!: string;
  filterTags!: string[];
  filterCount!: number;

  constructor(
    public dialogRef: MatDialogRef<FilterModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  get author() {
    return this.filterForm.get('author');
  }

  get tagsInput() {
    return this.filterForm.get('tagsInput');
  }

  onApplyFilter() {
    return ({author: this.author?.value.trim(), tags: this.tagsInput?.value, count: this.count});
  }

  onModalClose() {
    return ({author: this.filterAuthor, tags: this.filterTags, count:this.count});
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if(typeof(this.tagsInput?.value) === 'string'){
      var tagArray : string[] = [];
      tagArray.push(this.tagsInput?.value);
      this.tagsInput.setValue(tagArray);
    }
    if(value && !this.tagsInput?.value.includes(value)) {
      this.tagsInput?.value.push(value);
      this.tagsInput?.updateValueAndValidity();
    }
    event.chipInput!.clear();
  }

  remove(tag: string): void {
    const index = this.tagsInput?.value.indexOf(tag);
    if (index >= 0) {
      this.tagsInput?.value.splice(index, 1);
      this.tagsInput?.updateValueAndValidity();
    }
  }

  getCount() {
    if(this.data.author?.length && this.data.tags?.length) {
      this.filterCountSub$.next(2);
    }
    else if (this.data.author?.length || this.data.tags?.length) {
      this.filterCountSub$.next(1);
    }
    else {
      this.filterCountSub$.next(0);
    }
  }

  ngOnInit(): void {
    this.filterForm = new FormGroup({
      author: new FormControl(''),
      tagsInput: new FormControl([])
    });

    this.route.queryParams
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( params => {
      if(params) {
        var author: string ='';
        var tags: string[] = [];
        if(params['author']?.length) {
          author = params['author'];
          this.data.author = author;
          this.filterAuthor = author;
          this.getCount();
        }
        if(params['tags']?.length) {
          if(typeof(params['tags']) === 'string') {
            tags.push(params['tags']);
          }
          else {
            tags = params['tags'];
          }
          this.filterTags = tags;
          this.data.tags = tags;
          this.getCount();
        }
        this.filterForm.patchValue({
          author: author,
          tagsInput: [...tags],
        });
      }
    });

    this.filterForm.get('author')?.valueChanges
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( (value) => {
      this.data.author = value;
      this.getCount();
    });

    this.filterForm.get('tagsInput')?.valueChanges
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( (value) => {
      this.data.tags = value;
      this.getCount();
    });

    this.filterCountSub$
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((res) => {
      this.count = res;
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
