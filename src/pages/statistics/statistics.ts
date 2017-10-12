import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, PopoverController  } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';
import { RangeStatisticPage } from "../range-statistic/range-statistic";
import { MonthStatisticPage } from "../month-statistic/month-statistic";
import { ExpensesService } from "../../services/expenses";
import { Subscription } from 'rxjs/Subscription';
import { DatePickerDirective } from 'ionic3-datepicker';
import { LogoutPage } from '../logout/logout';


@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html',
})
export class StatisticsPage {
  @ViewChild(DatePickerDirective) private datepickerDirective: DatePickerDirective;

  rangeStatisticPage = RangeStatisticPage;
  monthStatisticPage = MonthStatisticPage;
  public expenseFullList: FirebaseListObservable<any[]>
  public allMonthlyMoney = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  public polishMonths = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień']
  private dbList = 'michal1dydo/expenseItems/';
  public expenseListOfYears: FirebaseListObservable<any[]>
  public expenseListOfYearsSubscription: Subscription;
  public maxDate: Date = moment()['_d'];
  public object = {
    monday: true,
    weekdays: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz'],
    months: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień']
  };
  public year: string = moment().format('YYYY');

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService,
    public popoverCtrl: PopoverController
  ) {
  }

  ionViewDidLeave() {
    this.expensesService.safeUnsubscribe(this.expenseListOfYearsSubscription);
  }

  ionViewCanEnter() {
    this.expensesService.loaderOn();
  }

  ionViewDidEnter() {
    this.getAvailableYears();
  }

  onShowOptions(event: MouseEvent) {
    const popover = this.popoverCtrl.create(LogoutPage);
    popover.present({ ev: event });
  }

  getAvailableYears() {
    this.expensesService.availableYears = [];
    this.expenseListOfYears = this.expensesService.getItemsList(this.dbList).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
    this.expenseListOfYearsSubscription = this.expenseListOfYears.subscribe((data) => {
      for (var key of data) {
        this.expensesService.availableYears.push(key.$key)
      }
      this.expensesService.loaderOff();
    });
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
