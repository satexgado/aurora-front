import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
})
export class SearchFieldComponent implements OnInit, AfterViewInit {
  @ViewChild('search') search!: ElementRef;
  research$ = new Subject<string>();
  constructor(public router: Router, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.research$.pipe(debounceTime(1500)).subscribe((keyword) => {
      this.research(keyword);
    });
  }

  research(keyword: string): void {
    this.router.navigate(['./'], {
      queryParams: { search: keyword || null, page: 1 },
      queryParamsHandling: 'merge',
      relativeTo: this.route,
    });
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe((params) => {
      if (params.search) {
        if (!this.search.nativeElement.value) {
          this.search.nativeElement.value = params.search;
        }
      }
    });
  }
}
