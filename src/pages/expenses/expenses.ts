import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ExpenseItem } from '../../models/expense-item.interface';
import { MonthsPage } from "../months/months";
import { ExpensesService } from "../../services/expenses";

@Component({
  selector: 'page-expenses',
  templateUrl: 'expenses.html',
})
export class ExpensesPage implements OnInit {
  monthsPage = MonthsPage;
  private dbList = 'dydo/expenseItems/';
  public expenseListOfYears: FirebaseListObservable<any[]>

  constructor(
    public navCtrl: NavController,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService
  ) {
    this.expenseListOfYears = database.list(this.dbList).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
  }

  ngOnInit() {

  }

}



