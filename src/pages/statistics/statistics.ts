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





  public seconds: number = 0;
  public minutes: number = 0;
  public hours: number = 0;
  public buttonText: string = "Start"
  public interval;





  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService,
    public popoverCtrl: PopoverController
  ) {
  }

  start() {
    this.interval = setInterval(() => {
      this.seconds++;
      if (this.seconds > 59) {
        this.seconds = 0;
        this.minutes++;
        if (this.minutes > 59) {
          this.minutes = 0;
          this.hours++;
        }
      }
    }, 1000);
    this.buttonText = "Start"
  }

  pause() {
    clearInterval(this.interval);
    this.buttonText = "Restart"
  }

  clear() {
    clearInterval(this.interval);
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
    this.buttonText = "Start"
  }

  addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
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
