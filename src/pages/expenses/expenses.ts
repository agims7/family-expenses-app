import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';
import { ExpenseItem } from '../../models/expense-item.interface';
import { DaysPage } from "../days/days";

@Component({
  selector: 'page-expenses',
  templateUrl: 'expenses.html',
})
export class ExpensesPage implements OnInit {
  daysPage = DaysPage;
  private currentYear: string = moment().format('YYYY');
  private dbList = 'dydo/expenseItems/' + this.currentYear;
  public expenseListOfMonths: FirebaseListObservable<any[]>

  constructor(
    public navCtrl: NavController,
    public database: AngularFireDatabase,
  ) {
    this.expenseListOfMonths = database.list(this.dbList);
  }

  ngOnInit() {

  }

}
