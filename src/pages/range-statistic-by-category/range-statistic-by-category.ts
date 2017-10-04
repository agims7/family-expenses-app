import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ExpensesService } from "../../services/expenses";
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';

@Component({
  selector: 'page-range-statistic-by-category',
  templateUrl: 'range-statistic-by-category.html',
})
export class RangeStatisticByCategoryPage {
  private currentYear: string = moment().format('YYYY');
  private dbList;
  public rangeSategoryStatisticList: FirebaseListObservable<any[]>
  public rangeSategoryStatisticListSubscription: Subscription;
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
    // this.month = this.navParams.data[1];
    // this.category = this.navParams.data[0];

    // this.dbList = 'dydo/expenseItems/' + this.currentYear + '/' + this.month;
    // this.rangeSategoryStatisticList = this.expensesService.getItemsList(this.dbList);
    // this.rangeSategoryStatisticListSubscription = this.rangeSategoryStatisticList.subscribe(data => {
    //   this.showSpinner = false
    // });
  }

  ionViewDidLeave() {
    this.expensesService.safeUnsubscribe(this.rangeSategoryStatisticListSubscription);
  }

  showTime(time) {
    return moment.unix(time).format('DD.MM.YYYY');
  }

}
