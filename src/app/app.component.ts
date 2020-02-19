import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef
} from "@angular/core";
import { create, all } from "mathjs";
import { tap, map, scan } from "rxjs/operators";
import { of, from, Observable, Subject } from "rxjs";

const config = {};
const math = create(all, config);

export interface Result {
  isPrime: boolean;
  value: number;
}

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(public CDR: ChangeDetectorRef) {
    this.source$
      .asObservable()
      .pipe(
        this.getRandomOperator,
        map(information => {
          let result = {
            isPrime: math.isPrime(information),
            value: information
          };
          if (result.isPrime) {
            this.source$.next(result.value);
          }
          return [result];
        }),
        scan((acc: Result[], curr: Result[]) => [...acc, ...curr], [])
      )
      .subscribe(results => {
        this.results = [...this.results, ...results];
      });
  }
  public results: Result[];
  public startingValue: number[] = [];
  public source$: Subject<number> = new Subject();
  public getRandomOperator = (data: Observable<any>): Observable<any> => {
    return data.pipe(map(info => info));
  };
  public getDivisors = (data: number): number[] => {
    let results: number[] = [];
    for (let v = 1; v <= math.sqrt(data); v++) {
      if (data % v == 0 && v !== 1 && v !== data && data !== 1) {
        if (data / v == v) {
          results.push(v);
        } else {
          results.push(v);
          results.push(data / v);
        }
      }
    }
    return results;
  };

  ngOnInit() {}

  ngAfterViewInit() {
    this.source$.next(math.ceil(math.random(1, 10)));
  }
}
