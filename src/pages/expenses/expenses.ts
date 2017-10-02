import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ExpenseItem } from '../../models/expense-item.interface';
import { MonthsPage } from "../months/months";

@Component({
  selector: 'page-expenses',
  templateUrl: 'expenses.html',
})
export class ExpensesPage implements OnInit {
  monthsPage = MonthsPage;
  private dbList = 'dydo/expenseItems/';
  public expenseListOfMonths: FirebaseListObservable<any[]>

  constructor(
    public navCtrl: NavController,
    public database: AngularFireDatabase,
  ) {
    this.expenseListOfMonths = database.list(this.dbList).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
  }

  ngOnInit() {

  }

}
