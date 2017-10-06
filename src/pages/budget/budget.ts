import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ExpenseItem } from '../../models/expense-item.interface';
import { MonthsPage } from "../months/months";
import { ExpensesService } from "../../services/expenses";
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-budget',
  templateUrl: 'budget.html',
})
export class BudgetPage {
  monthsPage = MonthsPage;
  public budget: string = "expenses";
  private dbExpenseList: string;
  private dbBonusList: string;
  public expenseListOfYears: FirebaseListObservable<any[]>
  public expenseListOfYearsSubscription: Subscription;
  public bonuseListOfYears: FirebaseListObservable<any[]>
  public bonusListOfYearsSubscription: Subscription;
  public noExpenseData: boolean = true;
  public noBonusData: boolean = true;

  constructor(
    public navCtrl: NavController,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService
  ) {
  }

  ionViewDidLeave() {
    this.expensesService.safeUnsubscribe(this.expenseListOfYearsSubscription);
    this.expensesService.safeUnsubscribe(this.bonusListOfYearsSubscription);
  }

  ionViewCanEnter() {
    this.expensesService.loaderOn();
  }

  ionViewDidEnter() {
    this.getExpenseData();
  }

  segmentChanged($event) {
    this.expensesService.loaderOn();
    if ($event.value === 'bonuses') {
      this.getBonusData();
    } else if($event.value === 'expenses') {
      this.getExpenseData();
    }
  }

  getExpenseData() {
    this.dbExpenseList = 'dydo/expenseItems/';
    this.expenseListOfYears = this.expensesService.getItemsList(this.dbExpenseList).map((array) => array.reverse()) as FirebaseListObservable<any[]>;    
    this.expenseListOfYearsSubscription = this.expenseListOfYears.subscribe((data) => {
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
      this.expensesService.loaderOff();
    });
  }

  getBonusData() {
    this.dbBonusList = 'dydo/bonusItems/';
    this.bonuseListOfYears = this.expensesService.getItemsList(this.dbBonusList).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
    this.bonusListOfYearsSubscription = this.expenseListOfYears.subscribe((data) => {
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
      this.expensesService.loaderOff();
    });
  }

}
