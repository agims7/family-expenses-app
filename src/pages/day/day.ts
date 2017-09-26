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
  private dbList = 'expenseItems/' + this.currentYear;
  public dayList;
  public expensesListArray: any = [];
  public expenseListOfDay: FirebaseListObservable<any[]>
  public allMoneySpent: number;
  public equal: string;
  public radioRachunki: boolean = false;
  public radioDzieci: boolean = false;
  public radioZakupy: boolean = false;
  public radioOsobiste: boolean = false;
  public radioPrezenty: boolean = false
  public radioAll: boolean = true;

  public radioSign = [];

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
    switch (data) {
      case ('rachunki'): {
        this.radioRachunki = true;
        this.radioDzieci = false;
        this.radioZakupy = false;
        this.radioOsobiste = false;
        this.radioPrezenty = false;
        this.radioAll = false;
        break;
      }
      case ('dzieci'): {
        this.radioRachunki = false;
        this.radioDzieci = true;
        this.radioZakupy = false;
        this.radioOsobiste = false;
        this.radioPrezenty = false;
        this.radioAll = false;
        break;
      }
      case ('zakupy'): {
        this.radioRachunki = false;
        this.radioDzieci = false;
        this.radioZakupy = true;
        this.radioOsobiste = false;
        this.radioPrezenty = false;
        this.radioAll = false;
        break;
      }
      case ('osobiste'): {
        this.radioRachunki = false;
        this.radioDzieci = false;
        this.radioZakupy = false;
        this.radioOsobiste = true;
        this.radioPrezenty = false;
        this.radioAll = false;
        break;
      }
      case ('prezenty'): {
        this.radioRachunki = false;
        this.radioDzieci = false;
        this.radioZakupy = false;
        this.radioOsobiste = false;
        this.radioPrezenty = true;
        this.radioAll = false;
        break;
      }
      case ('wszystkie'): {
        this.radioRachunki = false;
        this.radioDzieci = false;
        this.radioZakupy = false;
        this.radioOsobiste = false;
        this.radioPrezenty = false;
        this.radioAll = true;
        break;
      }
    }
  }

  dateAscending() {
    this.expenseListOfDay = this.database.list('expenseItems/' + this.currentYear + '/' + this.expensesService.selectedMonth + '/' + this.expensesService.selectedDay, {
      query: {
        orderByChild: 'expenseDate'
      }
    });
    this.sortDateDown = false;
    this.setChecked('wszystkie');
  }

  dateDescending() {
    this.expenseListOfDay = this.database.list('expenseItems/' + this.currentYear + '/' + this.expensesService.selectedMonth + '/' + this.expensesService.selectedDay, {
      query: {
        orderByChild: 'expenseDate'
      }
    }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
    this.sortDateDown = true;
    this.setChecked('wszystkie');
  }

  priceAscending() {
    this.expenseListOfDay = this.database.list('expenseItems/' + this.currentYear + '/' + this.expensesService.selectedMonth + '/' + this.expensesService.selectedDay, {
      query: {
        orderByChild: 'expenseValue'
      }
    });
    this.sortPriceDown = false;
    this.setChecked('wszystkie');
  }

  priceDescending() {
    this.expenseListOfDay = this.database.list('expenseItems/' + this.currentYear + '/' + this.expensesService.selectedMonth + '/' + this.expensesService.selectedDay, {
      query: {
        orderByChild: 'expenseValue'
      }
    }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
    this.sortPriceDown = true;
    this.setChecked('wszystkie');
  }


  filter() {
      let alert = this.alertCtrl.create();
      alert.setTitle('Wybierz kategorie');

for (let category of this.expensesService.categories) {
  alert.addInput({ type: 'radio', label: category, value: category, checked: this.radioRachunki });
}

      alert.addInput({ type: 'radio', label: 'Rachunki', value: 'rachunki', checked: this.radioRachunki });
      alert.addInput({ type: 'radio', label: 'Dzieci', value: 'dzieci', checked: this.radioDzieci });
      alert.addInput({ type: 'radio', label: 'Zakupy', value: 'zakupy', checked: this.radioZakupy });
      alert.addInput({ type: 'radio', label: 'Osobiste', value: 'osobiste', checked: this.radioOsobiste });
      alert.addInput({ type: 'radio', label: 'Prezenty', value: 'prezenty', checked: this.radioPrezenty });
      alert.addInput({ type: 'radio', label: 'Wszystkie', value: 'wszystkie', checked: this.radioAll });

      alert.addButton('Wstecz');
      alert.addButton({
        text: 'OK',
        handler: data => {
          this.equal = data;
          this.setChecked(data)
          if (data == 'wszystkie') {
            this.expenseListOfDay = this.database.list('expenseItems/' + this.currentYear + '/' + this.expensesService.selectedMonth + '/' + this.expensesService.selectedDay, {
              query: {
                orderByChild: 'expenseCategory'
              }
            });
          } else {
            this.expenseListOfDay = this.database.list('expenseItems/' + this.currentYear + '/' + this.expensesService.selectedMonth + '/' + this.expensesService.selectedDay, {
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

  showTime(time){
    return moment.unix(time).format('LTS');
  }

  setRadioSigns() {
    for (let category of this.expensesService.categories) {
      this.radioSign.push(
        {
          name: category,
          checked: false
        }
      )
      }
      console.log('this.radioSign ', this.radioSign)
    }

  ngOnInit() {
    this.setRadioSigns();
    this.dayList = this.navParams.data;
    this.expensesService.selectedDay = this.dayList.$key
    this.dbList = 'expenseItems/' + this.currentYear + '/' + this.expensesService.selectedMonth + '/' + this.expensesService.selectedDay;
    this.expenseListOfDay = this.database.list(this.dbList).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
    this.expenseListOfDay.subscribe(x => {
      this.allMoneySpent = this.getFullSpentMoney(x);
    });
  }

}
