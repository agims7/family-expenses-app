import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { NavParams, PopoverController  } from 'ionic-angular';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subscription } from 'rxjs/Subscription';
import { LogoutPage } from '../logout/logout';
import { ExpensesService } from '../../services/expenses';

@Component({
  selector: 'page-statistic-by-category',
  templateUrl: 'statistic-by-category.html',
})
export class StatisticByCategoryPage {
  public title: string;
  public selectedYear: string;
  private dbList: string;
  public statisticList: FirebaseListObservable<any[]>
  public statisticListSubscription: Subscription;
  public month: string;
  public category: string
  public data: any = [];
  public noData: boolean = false;
  public expenseView: boolean;

  constructor( 
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService,
    public popoverCtrl: PopoverController
  ) {
  }

  ionViewDidLeave() {
    this.expensesService.safeUnsubscribe(this.statisticListSubscription);
  }

  ionViewCanEnter() {
    this.expensesService.loaderOn();
  }

  ionViewDidEnter() {
    this.clearAll();
    this.month = this.navParams.data[0];
    this.category = this.navParams.data[1];
    this.selectedYear = this.navParams.data[2];
    this.checkWhichBudget();
  }

  onShowOptions(event: MouseEvent) {
    const popover = this.popoverCtrl.create(LogoutPage);
    popover.present({ ev: event });
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
    this.dbList = 'michal1dydo/expenseItems/' + this.selectedYear + '/' + this.month;
    this.statisticList = this.expensesService.getItemsList(this.dbList);
    this.statisticListSubscription = this.statisticList.subscribe(data => {
      this.getExpenseDays(data);
    });
  }

  getBonusData() {
    this.dbList = 'michal1dydo/bonusItems/' + this.selectedYear + '/' + this.month;
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
    this.expensesService.loaderOff();
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
    this.expensesService.loaderOff();
  }

  showTime(time) {
    return moment.unix(time).format('DD.MM.YYYY');
  }

}
