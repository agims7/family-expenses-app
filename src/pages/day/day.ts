import { Component, Query } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController, PopoverController  } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import { LogoutPage } from '../logout/logout';
import { ExpenseItem } from '../../models/expense-item.interface';
import { BonusItem } from '../../models/bonus-item.interface';
import { ExpensesService } from "../../services/expenses";
import { EditExpensePage } from "../edit-expense/edit-expense";


@Component({
  selector: 'page-day',
  templateUrl: 'day.html',
})
export class DayPage {
  public viewType: string;
  public title: string;
  public selectedMonth: string;
  private dbExpenseList: string;
  private dbBonusList: string;
  public dayList: any;
  public expensesListArray: any = [];
  public bonusesListArray: any = [];
  public expenseListOfDay: FirebaseListObservable<any[]>
  public expenseListSubscription: Subscription;
  public bonusListOfDay: FirebaseListObservable<any[]>
  public bonusListSubscription: Subscription;
  public allMoneySpent: number = 0;
  public allBonuses: number = 0
  public equal: string;
  public sortDateDown: boolean = true;
  public sortPriceDown: boolean = true;
  public noExpenseData: boolean = true;
  public noBonusData: boolean = true;
  private dbStart: string;
  private queryValue: string;
  private queryDate: string;

  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController
  ) {

  }

  ionViewDidLeave() {
    this.expensesService.safeUnsubscribe(this.expenseListSubscription);
    this.expensesService.safeUnsubscribe(this.bonusListSubscription);
  }

  ionViewCanEnter() {
    this.expensesService.loaderOn();
  }

  ionViewDidEnter() {
    this.clearAll();
    this.dayList = this.navParams.data[0];
    this.expensesService.selectedDay = this.dayList.$key
    this.viewType = this.navParams.data[1];
    this.checkWhichBudget();
  }

  onShowOptions(event: MouseEvent) {
    const popover = this.popoverCtrl.create(LogoutPage);
    popover.present({ ev: event });
  }

  clearAll() {
    this.expensesListArray = [];
    this.bonusesListArray = [];
    this.allMoneySpent = 0;
    this.allBonuses = 0;
  }

  checkWhichBudget() {
    if (this.viewType === 'bonuses') {
      this.title = "Bonusy";
      this.dbStart = 'michal1dydo/bonusItems/';
      this.queryValue = 'bonusValue';
      this.queryDate = 'bonusDate';
      this.getBonusData();
    } else if (this.viewType === 'expenses') {
      this.title = "Wydatki dzienne";
      this.dbStart = 'michal1dydo/expenseItems/';
      this.queryValue = 'expenseValue';
      this.queryDate = 'expenseDate';
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
          this.allMoneySpent = this.getFullSpentMoney(data);
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
          this.allBonuses = this.getFullBonuses(data);
          this.noBonusData = false;
        }
      }
    });
    this.expensesService.loaderOff();
  }

  getFullSpentMoney(data) {
    let allMoney: number = 0;
    for (let expense of data) {
      allMoney += Number(expense.expenseValue);
    }
    return allMoney;
  }

  getFullBonuses(data) {
    let allMoney: number = 0;
    for (let bonus of data) {
      allMoney += Number(bonus.bonusValue);
    }
    return Number(allMoney);
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

  deleteBonus(key: string) {
    const alert = this.alertCtrl.create({
      title: 'Usuwanie elementu',
      message: 'Czy na pewno chcesz usunąć ten element?',
      buttons: [
        {
          text: 'Tak',
          handler: () => {
            this.bonusListOfDay.remove(key);
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

  edit(key, name, description, value, category) {
    let modal = this.modalCtrl.create(EditExpensePage, [key, name, description, value, category]);
    modal.present();
  }

  // editExpense(key: string, name: string, description: string, amount, category) {
  //   const alert = this.alertCtrl.create({
  //     title: 'Edycja elementu',
  //     inputs: [
  //       {
  //         name: 'expenseName',
  //         placeholder: 'Nazwa',
  //         value: name
  //       },
  //       {
  //         name: 'expenseDescription',
  //         placeholder: 'Opis',
  //         value: description
  //       },
  //       {
  //         name: 'expenseValue',
  //         placeholder: 'Wydane',
  //         value: amount
  //       },
  //       {
  //         name: 'expenseCategory',
  //         placeholder: 'Kategoria',
  //         value: category
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Wstecz',
  //         role: 'cancel'
  //       },
  //       {
  //         text: 'Zapisz',
  //         handler: data => {
  //           this.expenseListOfDay.update(key, {
  //             expenseName: data.expenseName,
  //             expenseDescription: data.expenseDescription,
  //             expenseValue: data.expenseValue,
  //             expenseCategory: data.expenseCategory
  //           });
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

  // editBonus(key: string, name: string, description: string, amount) {
  //   const alert = this.alertCtrl.create({
  //     title: 'Edycja elementu',
  //     inputs: [
  //       {
  //         name: 'bonusName',
  //         placeholder: 'Nazwa',
  //         value: name
  //       },
  //       {
  //         name: 'bonusDescription',
  //         placeholder: 'Opis',
  //         value: description
  //       },
  //       {
  //         name: 'bonusValue',
  //         placeholder: 'Wydane',
  //         value: amount
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Wstecz',
  //         role: 'cancel'
  //       },
  //       {
  //         text: 'Zapisz',
  //         handler: data => {
  //           this.expenseListOfDay.update(key, {
  //             bonusName: data.bonusName,
  //             bonusDescription: data.bonusDescription,
  //             bonusValue: data.bonusValue
  //           });
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

  setChecked(data) {
    for (let i = 0; i < this.expensesService.categoriesData.length; i++) {
      this.expensesService.categoriesData[i].radioSign = false;
    }
    this.expensesService.categoriesData[data].radioSign = true;
  }

  dateAscending() {
    let dbList = this.dbStart + this.expensesService.selectedYear + '/' + this.expensesService.selectedMonth + '/' + this.expensesService.selectedDay;
    this.expenseListOfDay = this.expensesService.getItemsList(dbList, { orderByChild: this.queryDate });
    this.sortDateDown = false;
    this.setChecked(0);
  }

  dateDescending() {
    let dbList = this.dbStart + this.expensesService.selectedYear + '/' + this.expensesService.selectedMonth + '/' + this.expensesService.selectedDay;
    this.expenseListOfDay = this.expenseListOfDay = this.expensesService.getItemsList(dbList, { orderByChild: this.queryDate }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
    this.sortDateDown = true;
    this.setChecked(0);
  }

  priceAscending() {
    let dbList = this.dbStart + this.expensesService.selectedYear + '/' + this.expensesService.selectedMonth + '/' + this.expensesService.selectedDay;
    this.expenseListOfDay = this.expenseListOfDay = this.expensesService.getItemsList(dbList, { orderByChild: this.queryValue });
    this.sortPriceDown = false;
    this.setChecked(0);
  }

  priceDescending() {
    let dbList = this.dbStart + this.expensesService.selectedYear + '/' + this.expensesService.selectedMonth + '/' + this.expensesService.selectedDay;
    this.expenseListOfDay = this.expenseListOfDay = this.expensesService.getItemsList(dbList, { orderByChild: this.queryValue }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
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
        let dbList = 'michal1dydo/expenseItems/' + this.expensesService.selectedYear + '/' + this.expensesService.selectedMonth + '/' + this.expensesService.selectedDay;
        if (data == 0) {
          this.expenseListOfDay = this.expenseListOfDay = this.expensesService.getItemsList(dbList, { orderByChild: 'expenseCategory' });
        } else {
          this.expenseListOfDay = this.expenseListOfDay = this.expensesService.getItemsList(dbList, { orderByChild: 'expenseCategory', equalTo: this.equal });
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

  test(key: string, name: string, description: string, amount, category) {
    let modal = this.modalCtrl.create(EditExpensePage, [key, name, description, amount, category]);
    modal.present();
  }

}
