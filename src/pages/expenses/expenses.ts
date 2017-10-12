import { Component } from '@angular/core';
import { NavController, PopoverController  } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ExpenseItem } from '../../models/expense-item.interface';
import { MonthsPage } from "../months/months";
import { ExpensesService } from "../../services/expenses";
import { Subscription } from 'rxjs/Subscription';
import { LogoutPage } from '../logout/logout';

@Component({
  selector: 'page-expenses',
  templateUrl: 'expenses.html',
})
export class ExpensesPage {
  monthsPage = MonthsPage;
  private dbList = 'michal1dydo/expenseItems/';
  public expenseListOfYears: FirebaseListObservable<any[]>
  public expenseListOfYearsSubscription: Subscription;
  public noData: boolean = true;

  constructor(
    public navCtrl: NavController,
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
    this.expenseListOfYears = this.expensesService.getItemsList(this.dbList).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
    this.expenseListOfYearsSubscription = this.expenseListOfYears.subscribe((data) => {
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

      this.expensesService.loaderOff();
    });
  }

  onShowOptions(event: MouseEvent) {
    const popover = this.popoverCtrl.create(LogoutPage);
    popover.present({ ev: event });
  }

}

