import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ExpensesService } from "../../services/expenses";
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';


@Component({
  selector: 'page-edit-expense',
  templateUrl: 'edit-expense.html',
})
export class EditExpensePage {
  public viewType: string;
  public title: string;
  public key: string;
  public name: string;
  public description: string;
  public value: string;
  public category: string;
  public localCategoriesData: any = [];
  public categoriesDataList: FirebaseListObservable<any[]>
  public categoriesDbList: string;
  public categoriesDataListSubscription: Subscription;
  public expenseListOfDay: FirebaseListObservable<any[]>
  public expenseListSubscription: Subscription;
  public bonusListOfDay: FirebaseListObservable<any[]>
  public bonusListSubscription: Subscription;
  private dbExpenseList: string;
  private dbBonusList: string;  
  private dbStart: string;
  public noExpenseData: boolean = true;
  public noBonusData: boolean = true;  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public expensesService: ExpensesService,
    public viewCtrl: ViewController,
  ) {
  }

  ionViewDidLeave() {
    this.expensesService.safeUnsubscribe(this.categoriesDataListSubscription);
    this.expensesService.safeUnsubscribe(this.expenseListSubscription);
    this.expensesService.safeUnsubscribe(this.bonusListSubscription);
  }

  ionViewCanEnter() {
    this.expensesService.loaderOn();
  }

  ionViewDidEnter() {
    this.categoriesDbList = 'dydo/categoriesItems/';
    this.categoriesDataList = this.expensesService.getItemsList(this.categoriesDbList);
    this.categoriesDataListSubscription = this.categoriesDataList.subscribe((data) => {
      this.expensesService.categoriesData = data;
      this.localCategoriesData = _.clone(this.expensesService.categoriesData);
      this.localCategoriesData.shift();
    });
    this.key = this.navParams.data[0];
    this.name = this.navParams.data[1];
    this.description = this.navParams.data[2];
    this.value = this.navParams.data[3];
    this.category = this.navParams.data[4];
    this.checkWhichBudget();
  }

  checkWhichBudget() {
    if (this.category === undefined) {
    this.viewType = 'bonuses';
    this.title = "Edycja bonusu";
    this.dbStart = 'dydo/bonusItems/';
    this.getBonusData();
    
    } else {
      this.viewType = 'expenses';
      this.title = "Edycja wydatku";
      this.dbStart = 'dydo/expenseItems/';
      this.getExpenseData();
    }
  }

  getExpenseData() {
    this.dbExpenseList = this.dbStart + this.expensesService.selectedYear + '/' + this.expensesService.selectedMonth + '/' + this.expensesService.selectedDay;
    this.expenseListOfDay = this.expensesService.getItemsList(this.dbExpenseList);
    this.expenseListSubscription = this.expenseListOfDay.subscribe((data) => {
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
    });
    this.expensesService.loaderOff();
  }

  getBonusData() {
    this.dbBonusList = this.dbStart + this.expensesService.selectedYear + '/' + this.expensesService.selectedMonth + '/' + this.expensesService.selectedDay;
    this.bonusListOfDay = this.expensesService.getItemsList(this.dbBonusList);
    this.bonusListSubscription = this.bonusListOfDay.subscribe((data) => {
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
    });
    this.expensesService.loaderOff();    
  }

  editExpenseItem() {
    this.expenseListOfDay.update(this.key, {
      expenseName: this.name,
      expenseDescription: this.description,
      expenseValue: this.value,
      expenseCategory: this.category
    });
    this.dismiss();
  }

  editBonusItem() {
    this.bonusListOfDay.update(this.key, {
      bonusName: this.name,
      bonusDescription: this.description,
      bonusValue: this.value,
    });
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
