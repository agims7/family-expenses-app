import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController  } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ExpenseItem } from '../../models/expense-item.interface';
import { DayPage } from "../day/day";
import { LogoutPage } from '../logout/logout';
import { Subscription } from 'rxjs/Subscription';
import { ExpensesService } from "../../services/expenses";

@Component({
  selector: 'page-days',
  templateUrl: 'days.html',
})
export class DaysPage {
  dayPage = DayPage;
  public viewType: string;
  public title: string;
  private dbExpenseList: string;
  private dbBonusList: string;
  public daysList;
  public expenseListOfDays: FirebaseListObservable<any[]>
  public expenseListOfDaysSubscription: Subscription;
  public bonuseListOfDays: FirebaseListObservable<any[]>
  public bonusListOfDaysSubscription: Subscription;
  public days = [];
  public dayWithExpenses = {};
  public dayWithBonuses = {};
  public allMonthlyMoneySpent: number = 0;
  public allMonthlyBonuses: number = 0;
  public noExpenseData: boolean = true;
  public noBonusData: boolean = true;

  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService,
    public popoverCtrl: PopoverController
  ) {

  }

  ionViewDidLeave() {
    this.expensesService.safeUnsubscribe(this.expenseListOfDaysSubscription);
    this.expensesService.safeUnsubscribe(this.bonusListOfDaysSubscription);
  }

  ionViewCanEnter() {
    this.expensesService.loaderOn();
  }

  ionViewDidEnter() {
    this.clearAll();
    this.daysList = this.navParams.data[0];
    this.expensesService.selectedMonth = this.daysList.$key;
    this.getMonthNumber(this.daysList.$key);
    this.viewType = this.navParams.data[1];
    this.checkWhichBudget();
  }

  onShowOptions(event: MouseEvent) {
    const popover = this.popoverCtrl.create(LogoutPage);
    popover.present({ ev: event });
  }

  clearAll() {
    this.days = [];
    this.dayWithExpenses = {};
    this.dayWithBonuses = {};
    this.allMonthlyMoneySpent = 0;
    this.allMonthlyBonuses = 0;
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
    this.dbExpenseList = 'michal1dydo/expenseItems/' + this.expensesService.selectedYear + '/' + this.expensesService.selectedMonth;
    this.expenseListOfDays = this.expensesService.getItemsList(this.dbExpenseList);
    this.expenseListOfDaysSubscription = this.expenseListOfDays.subscribe((data) => {
      if (data == null) {
        this.noExpenseData = true;
        return;
      } else {
        if (data.length < 1) {
          this.noExpenseData = true;
          return;
        } else {
          this.getDays(data);
          this.noExpenseData = false;
        }
      }
      this.expensesService.loaderOff();
    });
  }

  getBonusData() {
    this.dbBonusList = 'michal1dydo/bonusItems/' + this.expensesService.selectedYear + '/' + this.expensesService.selectedMonth;
    this.bonuseListOfDays = this.expensesService.getItemsList(this.dbBonusList);
    this.bonusListOfDaysSubscription = this.bonuseListOfDays.subscribe((data) => {
      if (data == null) {
        this.noBonusData = true;
        return;
      } else {
        if (data.length < 1) {
          this.noBonusData = true;
          return;
        } else {
          this.getDays(data);
          this.noBonusData = false;
        }
      }
      this.expensesService.loaderOff();
    });
  }

  getDays(data) {
    for (let day of data) {
      this.days.push(day.$key);
    }
    if (this.viewType === 'bonuses') {
      this.getBonusDayMoney();
    } else if(this.viewType === 'expenses') {
      this.getExpenseDayMoney();
    }
  }

  getExpenseDayMoney() {
    for (let day of this.days) {
      let databaseAddress = 'michal1dydo/expenseItems/' + this.expensesService.selectedYear + '/' + this.expensesService.selectedMonth + '/' + day;
      let listOfDay = this.database.list(databaseAddress);
      listOfDay.subscribe(data => {
        this.dayWithExpenses[day] = this.getFullSpentMoney(data);
        this.getMonthlySpentMoney();
      });
    }
  }

  getBonusDayMoney() {
    for (let day of this.days) {
      let databaseAddress = 'michal1dydo/bonusItems/' + this.expensesService.selectedYear + '/' + this.expensesService.selectedMonth + '/' + day;
      let listOfDay = this.database.list(databaseAddress);
      listOfDay.subscribe(data => {
        this.dayWithBonuses[day] = this.getFullBonuses(data);
        this.getMonthlyBonuses();
      });
    }
  }

  getFullSpentMoney(data) {
    let allMoney: number = 0;
    for (let expense of data) {
      allMoney += Number(expense.expenseValue);
    }
    return Number(allMoney);
  }

  getFullBonuses(data) {
    let allMoney: number = 0;
    for (let bonus of data) {
      allMoney += Number(bonus.bonusValue);
    }
    return Number(allMoney);
  }

  getMonthlySpentMoney() {
    this.allMonthlyMoneySpent = 0;
    for (let money in this.dayWithExpenses) {
      this.allMonthlyMoneySpent = this.allMonthlyMoneySpent + this.dayWithExpenses[money];
    }
  }

  getMonthlyBonuses() {
    this.allMonthlyBonuses = 0;
    for (let money in this.dayWithBonuses) {
      this.allMonthlyBonuses = this.allMonthlyBonuses + this.dayWithBonuses[money];
    }
  }

  getMonthNumber(month) {
    switch (month) {
      case ('styczeń'): { this.expensesService.selectedMonthNumber = 1; break; }
      case ('luty'): { this.expensesService.selectedMonthNumber = 2; break; }
      case ('marzec'): { this.expensesService.selectedMonthNumber = 3; break; }
      case ('kwiecień'): { this.expensesService.selectedMonthNumber = 4; break; }
      case ('maj'): { this.expensesService.selectedMonthNumber = 5; break; }
      case ('czerwiec'): { this.expensesService.selectedMonthNumber = 6; break; }
      case ('lipiec'): { this.expensesService.selectedMonthNumber = 7; break; }
      case ('sierpień'): { this.expensesService.selectedMonthNumber = 8; break; }
      case ('wrzesień'): { this.expensesService.selectedMonthNumber = 9; break; }
      case ('październik'): { this.expensesService.selectedMonthNumber = 10; break; }
      case ('listopad'): { this.expensesService.selectedMonthNumber = 11; break; }
      case ('grudzień'): { this.expensesService.selectedMonthNumber = 12; break; }
    }
  }

  monthNumber(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
  }

}
