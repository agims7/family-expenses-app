import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
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
    public categoriesColorTable = [];
    public categoriesTable = [];
    public dateFrom: Date = moment().startOf('month')['_d'];
    public dateTo: Date = moment()['_d'];
    public loading: any;

    constructor(
        public loadingCtrl: LoadingController,
        public database: AngularFireDatabase
    ) { }

    getItemsList(path, query = {}): FirebaseListObservable<any[]> {
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

    getChartInfoMonths() {
        this.categoriesColorTable = [];
        this.categoriesTable = []

        for (let i = 0; i < this.categoriesData.length; i++) {
            this.categoriesTable.push({
                "name": this.categoriesData[i].name,
                "value": this.categoriesData[i].allMonthlyMoneySpent
            })
            this.categoriesColorTable.push(this.categoriesData[i].color);
        }
        this.categoriesTable.splice(0, 1);
        this.categoriesColorTable.splice(0, 1);
    }

    getMonthFromNumber(monthIndex) {
        switch (monthIndex) {
          case (1): { return 'styczeń'; }
          case (2): { return 'luty'; }
          case (3): { return 'marzec'; }
          case (4): { return 'kwiecień'; }
          case (5): { return 'maj'; }
          case (6): { return 'czerwiec'; }
          case (7): { return 'lipiec'; }
          case (8): { return 'sierpień'; }
          case (9): { return 'wrzesień'; }
          case (10): { return 'październik'; }
          case (11): { return 'listopad'; }
          case (12): { return 'grudzień'; }
        }
      }

      loaderOn() {
        this.loading = this.loadingCtrl.create({
          spinner: 'hide',
          content: `
          <div class="sk-cube-grid">
          <div class="sk-cube sk-cube1"></div>
          <div class="sk-cube sk-cube2"></div>
          <div class="sk-cube sk-cube3"></div>
          <div class="sk-cube sk-cube4"></div>
          <div class="sk-cube sk-cube5"></div>
          <div class="sk-cube sk-cube6"></div>
          <div class="sk-cube sk-cube7"></div>
          <div class="sk-cube sk-cube8"></div>
          <div class="sk-cube sk-cube9"></div>
          <div class="sk-cube sk-cube10"></div>
          <div class="sk-cube sk-cube11"></div>
          <div class="sk-cube sk-cube12"></div>
          <div class="sk-cube sk-cube13"></div>
          <div class="sk-cube sk-cube14"></div>
          <div class="sk-cube sk-cube15"></div>
          <div class="sk-cube sk-cube16"></div>
          <div class="sk-cube sk-cube17"></div>
          <div class="sk-cube sk-cube18"></div>
          <div class="sk-cube sk-cube19"></div>
          <div class="sk-cube sk-cube20"></div>
          <div class="sk-cube sk-cube21"></div>
          <div class="sk-cube sk-cube22"></div>
          <div class="sk-cube sk-cube23"></div>
        </div>`
        });
      
        this.loading.onDidDismiss(() => {
          console.log('Dismissed loading');
        });
      
        this.loading.present();
      }

      loaderOff() {
        this.loading.dismiss();
      }

}