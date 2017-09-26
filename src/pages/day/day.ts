import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';
import "rxjs/add/operator/map";

import { ExpenseItem } from '../../models/expense-item.interface';
import { ExpensesService } from "../../services/expenses";

@Component({
  selector: 'page-day',
  templateUrl: 'day.html',
})
export class DayPage implements OnInit {
  private currentYear: string = moment().format('YYYY');
  public selectedMonth: string;
  private dbList = 'dydo/expenseItems/' + this.currentYear;
  public dayList;
  public expensesListArray: any = [];
  public expenseListOfDay: FirebaseListObservable<any[]>
  public allMoneySpent: number;
  public equal: string;

  public sortDateDown: boolean = true;
  public sortPriceDown: boolean = true;

  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService
  ) {

  }

  getFullSpentMoney(data) {
    let allMoney: number = 0;
    for (let expense of data) {
      allMoney += Number(expense.expenseValue);
    }
    return allMoney;
  }

  deleteExpense(key: string) {
    const alert = this.alertCtrl.create({
      title: 'Usuwanie elementu',
      message: 'Czy na pewno chcesz usunąć ten element?',
      buttons: [
        {
          text: 'Tak',
          handler: () => {
            this.expenseListOfDay.remove(key);
          }
        },
        {
          text: 'Nie',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }

  editExpense(key: string, name, description, amount, category) {
    const alert = this.alertCtrl.create({
      title: 'Edycja elementu',
      inputs: [
        {
          name: 'expenseName',
          placeholder: 'Nazwa',
          value: name
        },
        {
          name: 'expenseDescription',
          placeholder: 'Opis',
          value: description
        },
        {
          name: 'expenseValue',
          placeholder: 'Wydane',
          value: amount
        },
        {
          name: 'expenseCategory',
          placeholder: 'Kategoria',
          value: category
        }
      ],
      buttons: [
        {
          text: 'Wstecz',
          role: 'cancel'
        },
        {
          text: 'Zapisz',
          handler: data => {
            this.expenseListOfDay.update(key, {
              expenseName: data.expenseName,
              expenseDescription: data.expenseDescription,
              expenseValue: data.expenseValue,
              expenseCategory: data.expenseCategory
            });
          }
        }
      ]
    });
    alert.present();
  }

  setChecked(data) {
    for (let i = 0; i < this.expensesService.categoriesData.length; i++) {
      this.expensesService.categoriesData[i].radioSign = false;
    }
    this.expensesService.categoriesData[data].radioSign = true;
  }

  dateAscending() {
    this.expenseListOfDay = this.database.list('dydo/expenseItems/' + this.currentYear + '/' + this.expensesService.selectedMonth + '/' + this.expensesService.selectedDay, {
      query: {
        orderByChild: 'expenseDate'
      }
    });
    this.sortDateDown = false;
    this.setChecked(0);
  }

  dateDescending() {
    this.expenseListOfDay = this.database.list('dydo/expenseItems/' + this.currentYear + '/' + this.expensesService.selectedMonth + '/' + this.expensesService.selectedDay, {
      query: {
        orderByChild: 'expenseDate'
      }
    }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
    this.sortDateDown = true;
    this.setChecked(0);
  }

  priceAscending() {
    this.expenseListOfDay = this.database.list('dydo/expenseItems/' + this.currentYear + '/' + this.expensesService.selectedMonth + '/' + this.expensesService.selectedDay, {
      query: {
        orderByChild: 'expenseValue'
      }
    });
    this.sortPriceDown = false;
    this.setChecked(0);
  }

  priceDescending() {
    this.expenseListOfDay = this.database.list('dydo/expenseItems/' + this.currentYear + '/' + this.expensesService.selectedMonth + '/' + this.expensesService.selectedDay, {
      query: {
        orderByChild: 'expenseValue'
      }
    }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
    this.sortPriceDown = true;
    this.setChecked(0);
  }


  filter() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Wybierz kategorie');

    for (let i = 0; i < this.expensesService.categoriesData.length; i++) {
      alert.addInput({ type: 'radio', label: this.expensesService.categoriesData[i].name, value: i.toString(), checked: this.expensesService.categoriesData[i].radioSign });
    }
    alert.addButton('Wstecz');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.equal = this.expensesService.categoriesData[data].name;
        this.setChecked(data)
        if (data == 0) {
          this.expenseListOfDay = this.database.list('dydo/expenseItems/' + this.currentYear + '/' + this.expensesService.selectedMonth + '/' + this.expensesService.selectedDay, {
            query: {
              orderByChild: 'expenseCategory'
            }
          });
        } else {
          this.expenseListOfDay = this.database.list('dydo/expenseItems/' + this.currentYear + '/' + this.expensesService.selectedMonth + '/' + this.expensesService.selectedDay, {
            query: {
              orderByChild: 'expenseCategory',
              equalTo: this.equal
            }
          });
        }
      }
    });
    alert.present();
    this.sortPriceDown = false;
    this.sortDateDown = false;
  }

  showTime(time) {
    return moment.unix(time).format('LTS');
  }

  ngOnInit() {
    this.dayList = this.navParams.data;
    this.expensesService.selectedDay = this.dayList.$key
    this.dbList = 'dydo/expenseItems/' + this.currentYear + '/' + this.expensesService.selectedMonth + '/' + this.expensesService.selectedDay;
    this.expenseListOfDay = this.database.list(this.dbList).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
    this.expenseListOfDay.subscribe(x => {
      this.allMoneySpent = this.getFullSpentMoney(x);
    });
  }

}
