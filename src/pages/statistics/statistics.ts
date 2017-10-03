import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';
import { RangeStatisticPage } from "../range-statistic/range-statistic";
import { MonthStatisticPage } from "../month-statistic/month-statistic";

@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html',
})
export class StatisticsPage {
  rangeStatisticPage = RangeStatisticPage;
  monthStatisticPage = MonthStatisticPage;
  public expenseFullList: FirebaseListObservable<any[]>
  private currentYear: string = moment().format('YYYY');
  public allMonthlyMoney = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  public polishMonths = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień',]
  public dbList;

  // public dateFrom: string = moment().startOf('year').format('YYYY-MM-DD'); // do zmiany
  public dateFrom: string = moment("2017-09-01").format('YYYY-MM-DD');
  public dateTo: string = moment().endOf('month').format('YYYY-MM-DD');

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database: AngularFireDatabase,
  ) {
  }

}
