import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';
import { ExpenseItem } from '../../models/expense-item.interface';
import { DaysPage } from "../days/days";
import { Subscription } from 'rxjs/Subscription';
import { ExpensesService } from "../../services/expenses";

@Component({
  selector: 'page-months',
  templateUrl: 'months.html',
})
export class MonthsPage {
  daysPage = DaysPage;
  private viewType: string;
  public title: string;
  private currentYear: string = moment().format('YYYY');
  private dbExpenseList: string;
  private dbBonusList: string;
  public expenseListOfMonths: FirebaseListObservable<any[]>
  public expenseListOfMonthsSubscription: Subscription;
  public bonuseListOfMonths: FirebaseListObservable<any[]>
  public bonusListOfMonthsSubscription: Subscription;
  public showSpinner: boolean = true;
  public noExpenseData: boolean = true;
  public noBonusData: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService
  ) {
  }

  ionViewDidLeave() {
    this.expensesService.safeUnsubscribe(this.expenseListOfMonthsSubscription);
    this.expensesService.safeUnsubscribe(this.bonusListOfMonthsSubscription);
  }

  ionViewDidEnter() {
    this.expensesService.selectedYear = this.navParams.data[0].$key;
    this.viewType = this.navParams.data[1];
    this.checkWhichBudget();
  }

  checkWhichBudget() {
    if (this.viewType === 'bonuses') {
      this.getBonusData();
      this.title = "Bonusy";
    } else if(this.viewType === 'expenses') {
      this.getExpenseData();
      this.title = "Wydatki";
    }
  }

  getExpenseData() {
    this.dbExpenseList = 'dydo/expenseItems/' + this.expensesService.selectedYear;
    this.expenseListOfMonths = this.expensesService.getItemsList(this.dbExpenseList).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
    this.expenseListOfMonthsSubscription = this.expenseListOfMonths.subscribe((data) => {
      if (data == null) {
        this.noExpenseData = true;
        return;
      } else {
        if (data.length < 1) {
          this.noExpenseData = true;
          return;
        } else {
          this.noExpenseData = false;
        }
      }
      this.showSpinner = false;
    });
  }

  getBonusData() {
    this.dbBonusList = 'dydo/bonusItems/' + this.expensesService.selectedYear;
    this.bonuseListOfMonths = this.expensesService.getItemsList(this.dbBonusList).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
    this.bonusListOfMonthsSubscription = this.bonuseListOfMonths.subscribe((data) => {
      if (data == null) {
        this.noBonusData = true;
        return;
      } else {
        if (data.length < 1) {
          this.noBonusData = true;
          return;
        } else {
          this.noBonusData = false;
        }
      }
      this.showSpinner = false;
    });
  }

}
