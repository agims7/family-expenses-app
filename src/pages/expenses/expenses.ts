import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ExpenseItem } from '../../models/expense-item.interface';
import { MonthsPage } from "../months/months";
import { ExpensesService } from "../../services/expenses";
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-expenses',
  templateUrl: 'expenses.html',
})
export class ExpensesPage {
  monthsPage = MonthsPage;
  private dbList = 'dydo/expenseItems/';
  public expenseListOfYears: FirebaseListObservable<any[]>
  public expenseListOfYearsSubscription: Subscription;
  public showSpinner: boolean = true;
  public noData: boolean = true;

  constructor(
    public navCtrl: NavController,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService
  ) {
    this.expenseListOfYears = database.list(this.dbList).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
  }

  ionViewDidLeave() {
    console.log('leave');
    this.expensesService.safeUnsubscribe(this.expenseListOfYearsSubscription);
  }

  ionViewDidEnter() {
    this.expenseListOfYears = this.expensesService.getItemsList(this.dbList).map((array) => array.reverse()) as FirebaseListObservable<any[]>;

    this.expenseListOfYearsSubscription = this.expenseListOfYears.subscribe((data) => {
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



