import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subscription } from 'rxjs/Subscription';

import { ExpensesService } from '../../services/expenses';

@Component({
  selector: 'page-statistic-by-category',
  templateUrl: 'statistic-by-category.html',
})
export class StatisticByCategoryPage {
  public title: string;
  private currentYear: string = moment().format('YYYY');
  private dbList: string;
  public statisticList: FirebaseListObservable<any[]>
  public statisticListSubscription: Subscription;
  public month: string;
  public category: string
  public showSpinner: boolean = true;
  public data: any = [];
  public noData: boolean = false;
  public expenseView: boolean;

  constructor( 
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService
  ) {
  }

  ionViewDidLeave() {
    this.expensesService.safeUnsubscribe(this.statisticListSubscription);
  }

  ionViewDidEnter() {
    this.clearAll();
    this.month = this.navParams.data[0];
    this.category = this.navParams.data[1];
    this.checkWhichBudget();
  }

  checkWhichBudget() {
    if (this.category === 'bonuses') {
      this.getBonusData();
      this.title = "Statystyki dla bonusów";
      this.expenseView = false;
    } else {
      this.getExpenseData();
      this.title = "Statystyki dla kategorii";
      this.expenseView = true;
    }
  }

  clearAll() {
    this.data = [];
  }

  getExpenseData() {
    this.dbList = 'dydo/expenseItems/' + this.currentYear + '/' + this.month;
    this.statisticList = this.expensesService.getItemsList(this.dbList);
    this.statisticListSubscription = this.statisticList.subscribe(data => {
      this.getExpenseDays(data);
    });
  }

  getBonusData() {
    this.dbList = 'dydo/bonusItems/' + this.currentYear + '/' + this.month;
    this.statisticList = this.expensesService.getItemsList(this.dbList);
    this.statisticListSubscription = this.statisticList.subscribe(data => {
      this.getBonusDays(data);
    });
  }

  getExpenseDays(data) { 
    for (let day of data) {
      let filter = _.filter(day, {'expenseCategory': this.category});
      for (let key of filter) {
        this.data.push(key)
      }
    }
    this.data = _.sortBy(this.data, ['expenseDate']);
    if (this.data.length < 1) {
      this.noData = true;
    }
    this.showSpinner = false
  }

  getBonusDays(data) {  
    for (let day of data) {
      for (let key in day) {
        this.data.push(day[key])
      }
    }
    this.data = _.sortBy(this.data, ['bonusDate']);
    if (this.data.length < 1) {
      this.noData = true;
    }
    this.showSpinner = false
  }

  showTime(time) {
    return moment.unix(time).format('DD.MM.YYYY');
  }

}
