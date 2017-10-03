import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';
import { ExpensesService } from "../../services/expenses";

@Component({
  selector: 'page-range-statistic',
  templateUrl: 'range-statistic.html',
})
export class RangeStatisticPage {
  public selectedDateFrom: string;
  public selectedDateTo: string;
  public firstYear: any;
  public lastYear: any;
  public firstMonth: any;
  public lastMonth: any;
  public firstDay: any;
  public lastDay: any;
  public sameYear: boolean = false;
  public sameMonth: boolean = false;
  public yearsRange = [];
  public monthsRange = [];
  public statisticList: FirebaseListObservable<any[]>
  public dbList: string;
  public statisticListSubscription: Subscription;
  public noData: boolean = true;
  public monthsDays = [];

  public allSpentMoney;
  public categoriesAllSpentMoney;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService
  ) {
  }

  ionViewDidLeave() {
    console.log('leave');
    this.expensesService.safeUnsubscribe(this.statisticListSubscription);
  }

  ionViewDidEnter() {
    this.selectedDateFrom = this.navParams.data[0];
    this.selectedDateTo = this.navParams.data[1];
    this.getSelectedYears();
    this.getSelectedMonths();
    this.getSelectedDays();
    // this.getMoneySpent();
    console.log('years:', this.yearsRange, 'months:', this.monthsRange)
  }

  getSelectedYears() {
    this.yearsRange = [];
    this.firstYear = Number(this.selectedDateFrom.slice(0, 4));
    this.lastYear = Number(this.selectedDateTo.slice(0, 4));
    if (this.firstYear == this.lastYear) {
      this.sameYear = true;
      this.yearsRange.push(this.firstYear);
    } else {
      let first = this.firstYear;
      let last = this.lastYear;
      for (first; first <= last; first++) {
        this.yearsRange.push(first);
      }
    }
  }

  getSelectedMonths() {
    this.monthsRange = [];
    this.firstMonth = Number(this.selectedDateFrom.slice(5, 7));
    this.lastMonth = Number(this.selectedDateTo.slice(5, 7));
    if (this.firstMonth == this.lastMonth) {
      this.sameMonth = true;
      this.monthsRange.push(this.firstMonth);
    } else {
      let first = this.firstMonth;
      let last = this.lastMonth;
      for (first; first <= last; first++) {
        this.monthsRange.push(first);
      }
    }
  }

  getSelectedDays() {
    this.firstDay = Number(this.selectedDateFrom.slice(8, 10));
    this.lastDay = Number(this.selectedDateTo.slice(8, 10));
  }

  getMoneySpent() {

    this.dbList = 'dydo/receiptsItems/';
    this.statisticList = this.database.list(this.dbList);


    // for (let year of this.yearsRange) {
    //   console.log(year);
    //   for (let month of this.monthsRange) {
    //     console.log(month);
    //     this.dbList = 'dydo/expenseItems/' + year + '/' + month;
    //     this.statisticList = this.database.list(this.dbList);
    //     this.statisticListSubscription = this.statisticList.subscribe(data => {
    //       console.log('data', data)
    //       if (data == null) {
    //         this.noData = true;
    //         return;
    //       } else {
    //         if (data.length < 1) {
    //           this.noData = true;
    //           return;
    //         } else {
    //           this.noData = false;
    //           this.getDays(data, month);
    //           // setTimeout(() => {
    //           //   this.setChart()
    //           // }, 500);
    //         }
    //       }
    //     });
    //   }
    // }
  }

  getDays(data, month) {
    this.monthsDays = [];
    for (let day of data) {
      this.monthsDays[month].push(day.$key);
    }
    console.log(this.monthsDays)
    // this.getDayMoney();

    // for (let category of this.expensesService.categoriesData) {
    //   this.getDayMoneyByCategory(category.name);
    // }
  }

}

