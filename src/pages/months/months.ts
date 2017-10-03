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
  private currentYear: string = moment().format('YYYY');
  private dbList = 'dydo/expenseItems/' + this.currentYear;
  public expenseListOfMonths: FirebaseListObservable<any[]>
  public expenseListOfMonthsSubscription: Subscription;
  public showSpinner: boolean = true;
  public noData: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService
  ) {
  }

  ionViewDidLeave() {
    console.log('leave');
    this.expensesService.safeUnsubscribe(this.expenseListOfMonthsSubscription);
  }

  ionViewDidEnter() {
    this.expensesService.selectedYear = this.navParams.data.$key;
    this.expenseListOfMonths = this.expensesService.getItemsList(this.dbList).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
    this.expenseListOfMonthsSubscription = this.expenseListOfMonths.subscribe((data) => {
      this.showSpinner = false
      if (data == null) {
        this.noData = true;
        return;
      } else {
        if (data.length < 1) {
          this.noData = true;
          return;
        } else {
          this.noData = false;
        }
      }
    });
  }

}
