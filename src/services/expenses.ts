import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';

@Injectable()
export class ExpensesService {
    private currentYear: string = moment().format('YYYY');
    public selectedMonth;
    public selectedMonthNumber: number;
    public selectedYear: number;
    public selectedDay;
    public categoriesData;
    public categoriesDataObservable: FirebaseListObservable<any[]>;
    public dbList: string;


    constructor(
        public database: AngularFireDatabase
    ) { }

    getItemsList( path, query = {} ): FirebaseListObservable<any[]> {
        return this.database.list(path, {
          query: query
        });
      }

    valueFixed(value: any) {
        return Number(value).toFixed(2);
    }

    safeUnsubscribe(subscription) {
        try {
            subscription.unsubscribe();
        }
        catch (err) {
            if (typeof subscription !== 'undefined') {
                console.log('unsubscribe error: ', err);
            }
        }
    }

}