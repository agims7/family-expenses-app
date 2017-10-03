import { Component  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';
import { ExpensesService } from "../../services/expenses";
import { ExpenseItem } from '../../models/expense-item.interface';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-new-expenses',
  templateUrl: 'new-expenses.html',
})
export class NewExpensesPage {
  public expenseItem = {} as ExpenseItem;
  public expenseItemsList: FirebaseListObservable<ExpenseItem[]>
  public categoriesDataList: FirebaseListObservable<ExpenseItem[]>
  public categoriesDbList: string;
  public expensesDbList: string;
  public categoriesDataListSubscription: Subscription;
  public showSpinner: boolean = true;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService
  ) {
    moment.locale('pl');
  }

  ionViewDidLeave() {
    this.expensesService.safeUnsubscribe(this.categoriesDataListSubscription);
  }

  ionViewDidEnter() {
    this.categoriesDbList = 'dydo/categoriesItems/';
    this.categoriesDataList = this.expensesService.getItemsList(this.categoriesDbList);
    this.categoriesDataListSubscription = this.categoriesDataList.subscribe((data) => {
      this.expensesService.categoriesData = data;
      this.showSpinner = false
    });
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
    this.expensesDbList = 'dydo/expenseItems/' + this.getYear() + '/' + this.getMonth() + '/' + this.getDay();
    this.expenseItemsList = this.expensesService.getItemsList(this.expensesDbList);
    this.expenseItemsList.push({
      expenseName: this.expenseItem.expenseName,
      expenseDescription: this.expenseItem.expenseDescription,
      expenseValue: Number(this.expenseItem.expenseValue),
      expenseCategory: this.expenseItem.expenseCategory,
      expenseDate: moment().unix()
    });    
    this.expenseItem = {
      expenseName: null,
      expenseDescription: null,
      expenseValue: null,
      expenseCategory: null,
      expenseDate: null
    }
  }

}
