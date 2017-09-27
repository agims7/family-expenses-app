import { Component, OnInit  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';
import { ExpensesService } from "../../services/expenses";
import { ExpenseItem } from '../../models/expense-item.interface';

@Component({
  selector: 'page-new-expenses',
  templateUrl: 'new-expenses.html',
})
export class NewExpensesPage implements OnInit {
  public expenseItem = {} as ExpenseItem;
  public expenseItemsList: FirebaseListObservable<ExpenseItem[]>

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService
  ) {
    moment.locale('pl');
  }

  getYear() {
    return moment().format('YYYY');
  }

  getMonth() {
    return moment().format('MMMM');
  }

  getDay() {
    return moment().format('DD');
  }

  addExpenseItem(expenseItem: ExpenseItem) {
    this.expenseItemsList = this.database.list('dydo/expenseItems/' + this.getYear() + '/' + this.getMonth() + '/' + this.getDay());
    this.expenseItemsList.push({
      expenseName: this.expenseItem.expenseName,
      expenseDescription: this.expenseItem.expenseDescription,
      expenseValue: Number(this.expenseItem.expenseValue),
      expenseCategory: this.expenseItem.expenseCategory,
      expenseDate: moment().unix()
    })    
    this.expenseItem = {
      expenseName: null,
      expenseDescription: null,
      expenseValue: null,
      expenseCategory: null,
      expenseDate: null
    }
  }

  ngOnInit() {

}

}
