import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ExpensesService } from "../../services/expenses";
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'page-range-statistic-by-category',
  templateUrl: 'range-statistic-by-category.html',
})
export class RangeStatisticByCategoryPage {
  private currentYear: string = moment().format('YYYY');
  public category: string;
  public firstYear: any;
  public lastYear: any;
  public firstMonth: any;
  public lastMonth: any;
  public firstDay: any;
  public lastDay: any;
  public yearsRange = [];
  public monthsRange = [];
  public statisticYearsList: FirebaseListObservable<any[]>
  public statisticMonthsList: FirebaseListObservable<any[]>;
  public statisticMonthsListSubscription: Subscription;  
  public monthsDays = [];
  public dbList: string;
  public dbMonthsList: string;
  public categoryData: any = [];
  public showSpinner: boolean = true;
  public noData: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService
  ) {
  }

  ionViewDidEnter() {
    this.category = this.navParams.data[0];
    this.firstYear = this.navParams.data[1];
    this.lastYear = this.navParams.data[2];
    this.yearsRange = this.navParams.data[3];
    this.firstMonth = this.navParams.data[4];
    this.lastMonth = this.navParams.data[5];
    this.monthsRange = this.navParams.data[6];
    this.firstDay = this.navParams.data[7];
    this.lastDay = this.navParams.data[8];
    this.getMoneySpent();
  }

  ionViewDidLeave() {
  }

  getMoneySpent() {
    this.dbList = 'dydo/receiptsItems/';
    this.statisticYearsList = this.expensesService.getItemsList(this.dbList);

    for (let year of this.yearsRange) {
      for (let month of this.monthsRange) {
        this.dbMonthsList = 'dydo/expenseItems/' + year + '/' + this.expensesService.getMonthFromNumber(month);
        this.statisticMonthsList = this.expensesService.getItemsList(this.dbMonthsList);
        this.statisticMonthsListSubscription = this.statisticMonthsList.subscribe(data => {
          this.getDays(data, month, year);
        });
      }
    }
  }

  getDays(data, month, year) {
    let monthName = this.expensesService.getMonthFromNumber(month)
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
      } else {        this.getDayMoney(day)
        this.monthsDays[monthName].push(day.$key)
      }
    }
  }

  getDayMoney(day) {
    let filter = _.filter(day, {'expenseCategory': this.category});
    for (let key of filter) {
      this.categoryData.push(key)
    }
    if (this.categoryData.length < 1) {
      this.noData = true;
    }
    this.showSpinner = false
  }

  showTime(time) {
    return moment.unix(time).format('DD.MM.YYYY');
  }

}
