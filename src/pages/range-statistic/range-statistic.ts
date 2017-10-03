import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';
import { ExpensesService } from "../../services/expenses";

@Component({
  selector: 'page-range-statistic',
  templateUrl: 'range-statistic.html',
})
export class RangeStatisticPage {
  public polishMonths = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień',]
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
  public statisticYearsList: FirebaseListObservable<any[]>
  public statisticMonthsList: FirebaseListObservable<any[]>;
  public statisticDaysList: [FirebaseListObservable<any[]>];
  public dbList: string;
  public dbMonthsList: string;
  public dbDaysList: string;
  public statisticYearsListSubscription: Subscription;
  public statisticMonthsListtSubscription: Subscription;
  public statisticDaysListtSubscription: Subscription;
  public noData: boolean = true;
  public monthsDays = [];

  public categories: any = [];
  public categoriesLength: number;

  public allSpentMoney: number = 0;
  public categoriesAllSpentMoney: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService
  ) {
  }

  ionViewDidLeave() {
    console.log('leave');
    this.expensesService.safeUnsubscribe(this.statisticYearsListSubscription);
    this.expensesService.safeUnsubscribe(this.statisticMonthsListtSubscription);
    this.expensesService.safeUnsubscribe(this.statisticDaysListtSubscription);
  }

  ionViewDidEnter() {
    this.monthsDays = [];
    this.selectedDateFrom = this.navParams.data[0];
    this.selectedDateTo = this.navParams.data[1];
    this.getCategories();
    this.getSelectedYears();
    this.getSelectedMonths();
    this.getSelectedDays();
    this.getMoneySpent();
    console.log('years:', this.yearsRange, 'months:', this.monthsRange)
    console.log('first day / last day: ', this.firstDay, this.lastDay)
  }

  getCategories() {
    for (var category of this.expensesService.categoriesData) {
      this.categories.push(category.name);
    }
    this.categoriesLength = this.categories.length;
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
    this.statisticYearsList = this.expensesService.getItemsList(this.dbList);

    for (let year of this.yearsRange) {
      for (let month of this.monthsRange) {
        this.dbMonthsList = 'dydo/expenseItems/' + year + '/' + this.getMonthFromNumber(month);
        console.log(this.dbMonthsList)
        this.statisticMonthsList = this.expensesService.getItemsList(this.dbMonthsList);
        this.statisticMonthsListtSubscription = this.statisticMonthsList.subscribe(data => {
          console.log(data);
          this.getDays(data, month, year);
        });
      }
    }
  }

  getDays(data, month, year) {
    let monthName = this.getMonthFromNumber(month)
    this.monthsDays[monthName] = [];
    for (let day of data) {
      if (month == this.firstMonth) {
        if (day.$key >= this.firstDay) {
          this.getDayMoney(day)
          this.monthsDays[monthName].push(day.$key)
        }
      } else if (month == this.lastMonth) {
        if (day.$key <= this.lastDay) {
          this.getDayMoney(day)
          this.monthsDays[monthName].push(day.$key)
        }
      } else {
        this.getDayMoney(day)
        this.monthsDays[monthName].push(day.$key)
      }
    }
  }

  getDayMoney(day) {
    for (let expenses in day) {
      console.log(expenses)
      let money = day[expenses].expenseValue;
      this.allSpentMoney = this.allSpentMoney + Number(money);
      // console.log(money, this.allSpentMoney)
      // console.log(day[expenses]);
      for (let i = 0; i < this.categoriesLength; i++) {
        let name = day[expenses].expenseCategory;
        console.log(name, day.$key, this.categories[i], day[expenses].expenseValue)
        if (name === this.categories[i]) {
          this.categoriesAllSpentMoney[name] =+ Number(money);
        }
      }
    }
    console.log(' this.categoriesAllSpentMoney',  this.categoriesAllSpentMoney);
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

}

