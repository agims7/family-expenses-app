import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';
import { RangeStatisticPage } from "../range-statistic/range-statistic";
import { MonthStatisticPage } from "../month-statistic/month-statistic";
import { ExpensesService } from "../../services/expenses";
import { DatePickerDirective } from 'ionic3-datepicker';


@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html',
})
export class StatisticsPage {
  @ViewChild(DatePickerDirective) private datepickerDirective: DatePickerDirective;

  rangeStatisticPage = RangeStatisticPage;
  monthStatisticPage = MonthStatisticPage;
  public expenseFullList: FirebaseListObservable<any[]>
  private currentYear: string = moment().format('YYYY');
  public allMonthlyMoney = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  public polishMonths = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień']
  public dbList;
  // public dateFrom: string = moment().startOf('month').format('YYYY-MM-DD');
  // public dateTo: string = moment().endOf('month').format('YYYY-MM-DD');

  public maxDate: Date = moment()['_d'];
  public object = {
    monday: true,
    weekdays: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz'],
    months: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień']
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService
  ) {
  }

  ionViewDidEnter() {
  }

  setDateFrom(date: Date) {
    this.expensesService.dateFrom = date;
  }

  setDateTo(date: Date) {
    this.expensesService.dateTo = date;
  }

  showTime(time) {
    return moment(time).format('DD.MM.YYYY');
  }

}
