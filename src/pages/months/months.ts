import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';
import { ExpenseItem } from '../../models/expense-item.interface';
import { DaysPage } from "../days/days";

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService
  ) {
    this.expenseListOfMonths = database.list(this.dbList).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
  }

  ngOnInit() {
    this.expensesService.selectedYear = this.navParams.data.$key;
  }

}
