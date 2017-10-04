import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { Subscription } from 'rxjs/Subscription';
import { ExpensesService } from "../../services/expenses";

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'page-statistic-by-category',
  templateUrl: 'statistic-by-category.html',
})
export class StatisticByCategoryPage {
  private currentYear: string = moment().format('YYYY');
  private dbList;
  public categoryStatisticList: FirebaseListObservable<any[]>
  public categoryStatisticListSubscription: Subscription;
  public month: string;
  public category: string
  public showSpinner: boolean = true;
  public categoryData: any = [];
  public noData: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService
  ) {
  }

  ionViewDidEnter() {
    this.month = this.navParams.data[1];
    this.category = this.navParams.data[0];

    this.dbList = 'dydo/expenseItems/' + this.currentYear + '/' + this.month;
    this.categoryStatisticList = this.expensesService.getItemsList(this.dbList);
    this.categoryStatisticListSubscription = this.categoryStatisticList.subscribe(data => {
      this.showSpinner = false
      this.getDays(data);
    });
  }

  getDays(data) {
    for (let day of data) {
      let filter = _.filter(day, {'expenseCategory': this.category});
      for (let key of filter) {
        this.categoryData.push(key)
      }
    }
    this.categoryData = _.sortBy(this.categoryData, ['expenseDate']);
    if (this.categoryData.length < 1) {
      this.noData = true;
    }
    console.log(this.categoryData)
  }

  showTime(time) {
    return moment.unix(time).format('DD.MM.YYYY');
  }

}
