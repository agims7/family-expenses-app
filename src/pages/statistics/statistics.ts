import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';


import { MonthStatisticPage } from "../month-statistic/month-statistic";

@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html',
})
export class StatisticsPage implements OnInit {
  monthStatisticPage = MonthStatisticPage;
  public expenseFullList: FirebaseListObservable<any[]>
  private currentYear: string = moment().format('YYYY');
  public allMonthlyMoney = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  public polishMonth = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień',]
  public dbList;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database: AngularFireDatabase,
  ) {
  }


  ngOnInit() {

  }

}
