import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ExpensesService } from "../../services/expenses";
import { Subscription } from 'rxjs/Subscription';
import { LogoutPage } from '../logout/logout';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'page-range-statistic-by-category',
  templateUrl: 'range-statistic-by-category.html',
})
export class RangeStatisticByCategoryPage {
  public expenseView: boolean;
  public category: string;
  public firstYear: any;
  public lastYear: any;
  public firstMonth: any;
  public lastMonth: any;
  public firstDay: any;
  public lastDay: any;
  public yearsRange = [];
  public monthsRange = [];
  public expenseStatisticYearsList: FirebaseListObservable<any[]>
  public expensesStatisticMonthsList: FirebaseListObservable<any[]>;
  public expensesStatisticMonthsListSubscription: Subscription;
  public expenseMonthsDays = [];
  public expenseDbList: string;
  public expensedbMonthsList: string;
  public categoryData: any = [];
  public noData: boolean = false;

  public bonusesDbList: string;
  public bonusesStatisticYearsList: FirebaseListObservable<any[]>
  public bonusesStatisticMongthsList: FirebaseListObservable<any[]>;
  public bonusesStatisticMongthsListSubscription: Subscription;
  public bonusMonthsDays = [];
  public bonusedbMonthsList: string;
  public bonusData: any = [];
  public bonuses: number = 0;  

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService,
    public popoverCtrl: PopoverController
  ) {
  }

  ionViewDidLeave() {
    this.expensesService.safeUnsubscribe(this.expensesStatisticMonthsListSubscription);
    this.expensesService.safeUnsubscribe(this.bonusesStatisticMongthsListSubscription);  
  }

  ionViewCanEnter() {
    console.log('weszlo')
    this.expensesService.loaderOn();
  }

  ionViewDidEnter() {
    this.firstYear = this.navParams.data[0];
    this.lastYear = this.navParams.data[1];
    this.yearsRange = this.navParams.data[2];
    this.firstMonth = this.navParams.data[3];
    this.lastMonth = this.navParams.data[4];
    this.monthsRange = this.navParams.data[5];
    this.firstDay = this.navParams.data[6];
    this.lastDay = this.navParams.data[7];
    this.category = this.navParams.data[8];
    console.log(this.navParams.data, this.category);
    if (this.category !== undefined) {
      this.getMoneySpent();
      this.expenseView = true;
    } else {
      this.getBonusMoney();
      this.expenseView = false;
    }
  }

  onShowOptions(event: MouseEvent) {
    const popover = this.popoverCtrl.create(LogoutPage);
    popover.present({ ev: event });
  }

  getMoneySpent() {
    this.expenseDbList = 'michal1dydo/receiptsItems/';
    this.expenseStatisticYearsList = this.expensesService.getItemsList(this.expenseDbList);

    for (let year of this.yearsRange) {
      for (let month of this.monthsRange) {
        this.expensedbMonthsList = 'michal1dydo/expenseItems/' + year + '/' + this.expensesService.getMonthFromNumber(month);
        this.expensesStatisticMonthsList = this.expensesService.getItemsList(this.expensedbMonthsList);
        this.expensesStatisticMonthsListSubscription = this.expensesStatisticMonthsList.subscribe(data => {
          this.getExpenseDays(data, month, year);
        });
      }
    }
  }

  getBonusMoney() {
    this.bonusesDbList = 'michal1dydo/bonusItems/';
    this.bonusesStatisticYearsList = this.expensesService.getItemsList(this.bonusesDbList);

    for (let year of this.yearsRange) {
      for (let month of this.monthsRange) {
        this.bonusedbMonthsList = 'michal1dydo/bonusItems/' + year + '/' + this.expensesService.getMonthFromNumber(month);
        this.bonusesStatisticMongthsList = this.expensesService.getItemsList(this.bonusedbMonthsList);
        this.bonusesStatisticMongthsListSubscription = this.bonusesStatisticMongthsList.subscribe(data => {
          this.getBonusDays(data, month, year);
        });
      }
    }
  }

  getExpenseDays(data, month, year) {
    let monthName = this.expensesService.getMonthFromNumber(month)
    this.expenseMonthsDays[monthName] = [];
    for (let day of data) {
      if (month == this.firstMonth) {
        if (day.$key >= this.firstDay) {
          this.getDayMoney(day)
          this.expenseMonthsDays[monthName].push(day.$key)
        }
      } else if (month == this.lastMonth) {
        if (day.$key <= this.lastDay) {
          this.getDayMoney(day)
          this.expenseMonthsDays[monthName].push(day.$key)
        }
      } else {
        this.getDayMoney(day)
        this.expenseMonthsDays[monthName].push(day.$key)
      }
    }
  }

  getBonusDays(data, month, year) {
    let monthName = this.expensesService.getMonthFromNumber(month)
    this.bonusMonthsDays[monthName] = [];
    for (let day of data) {
      if (month == this.firstMonth) {
        if (day.$key >= this.firstDay) {
          this.getBonusDayMoney(day)
          this.bonusMonthsDays[monthName].push(day.$key)
        }
      } else if (month == this.lastMonth) {
        if (day.$key <= this.lastDay) {
          this.getBonusDayMoney(day)
          this.bonusMonthsDays[monthName].push(day.$key)
        }
      } else {
        this.getBonusDayMoney(day)
        this.bonusMonthsDays[monthName].push(day.$key)
      }
    }
  }

  getDayMoney(day) {
    let filter = _.filter(day, { 'expenseCategory': this.category });
    for (let key of filter) {
      this.categoryData.push(key)
    }
    if (this.categoryData.length < 1) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  getBonusDayMoney(day) {
    for (let bonus in day) {
      this.categoryData.push(day[bonus])
    }
    if (this.categoryData.length < 1) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  showTime(time) {
    return moment.unix(time).format('DD.MM.YYYY');
  }

}
