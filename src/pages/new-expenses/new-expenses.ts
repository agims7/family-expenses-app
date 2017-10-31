import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, NavParams, PopoverController, ToastController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';
import { ExpensesService } from "../../services/expenses";
import { ExpenseItem } from '../../models/expense-item.interface';
import { BonusItem } from '../../models/bonus-item.interface';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';
import { LogoutPage } from '../logout/logout';
import { AuthService } from "../../services/auth";

import firebase from 'firebase';

declare var FCMPlugin;

@Component({
  selector: 'page-new-expenses',
  templateUrl: 'new-expenses.html',
})
export class NewExpensesPage {
  public viewType: string;
  public expenseItem = {} as ExpenseItem;
  public bonusItem = {} as BonusItem;
  public expenseItemsList: FirebaseListObservable<ExpenseItem[]>
  public bonusesItemsList: FirebaseListObservable<BonusItem[]>
  public categoriesDataList: FirebaseListObservable<ExpenseItem[]>
  public categoriesDbList: string;
  public expensesDbList: string;
  public bonusesDbList: string;
  public categoriesDataListSubscription: Subscription;
  public localCategoriesData: any = [];

  public expenses: boolean = true;
  public title: string = 'wydatek';

  // public firestore = firebase.database().ref('/michal1dydo/pushtokens');
  // firemsg = firebase.database().ref('/michal1dydo/messages');

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService,
    public popoverCtrl: PopoverController,
    public authService: AuthService,
    private toast: ToastController
  ) {
    moment.locale('pl');
    // this.tokensetup();
  }

  // ionViewDidLoad() {
  //   if (typeof FCMPlugin != 'undefined') {
  //     FCMPlugin.onNotification(function (data) {
  //       if (data.wasTapped) {
  //         //Notification was received on device tray and tapped by the user.
  //         alert(JSON.stringify(data));
  //       } else {
  //         //Notification was received in foreground. Maybe the user needs to be notified.
  //         alert(JSON.stringify(data));
  //       }
  //     });

  //     FCMPlugin.onTokenRefresh(function (token) {
  //       alert(token);
  //     });
  //   }
  // }

  // tokensetup() {
  //   console.log('start2')
  //   let fcmCheck = setInterval(() => {
  //     console.log('start43')
  //     if (typeof FCMPlugin != 'undefined') {
  //       console.log('start')
  //       let promise = new Promise((resolve, reject) => {
  //         FCMPlugin.getToken(token => {
  //           resolve(token);
  //         }, (err) => {
  //           reject(err);
  //         });
  //       })
  //       console.log(promise);
  //       return promise;
  //     }
  //   }, 1000);
  // }

  // storetoken(token) {
  //     this.database.list(this.firestore).push({
  //       uid: firebase.auth().currentUser.uid,
  //       devtoken: token
  //     });
  //     console.log('tetestestse')
  //     this.database.list(this.firemsg).push({
  //       sendername: firebase.auth().currentUser.displayName,
  //       message: 'hello'
  //     });
  //     console.log('tetestestse 2')
  // }





  ionViewDidLeave() {
    this.expensesService.safeUnsubscribe(this.categoriesDataListSubscription);
  }

  ionViewCanEnter() {
    // this.expensesService.loaderOn();
  }

  ionViewDidEnter() {

    // this.authService.getActiveUser().getToken()
    // .then(
    // (token: string) => {
    //   alert(token);
    //   console.log(token)
    // }
    // );
    this.viewType = 'expenses'
    this.categoriesDbList = 'michal1dydo/categoriesItems/';
    this.categoriesDataList = this.expensesService.getItemsList(this.categoriesDbList);
    this.categoriesDataListSubscription = this.categoriesDataList.subscribe((data) => {
      this.expensesService.categoriesData = data;
      this.localCategoriesData = _.clone(this.expensesService.categoriesData);
      this.localCategoriesData.shift();
      // this.expensesService.loaderOff();
    });
  }

  onShowOptions(event: MouseEvent) {
    const popover = this.popoverCtrl.create(LogoutPage);
    popover.present({ ev: event });
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
    this.expensesDbList = 'michal1dydo/expenseItems/' + this.getYear() + '/' + this.getMonth() + '/' + this.getDay();
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

  addBonusItem(bonusItem: BonusItem) {
    this.bonusesDbList = 'michal1dydo/bonusItems/' + this.getYear() + '/' + this.getMonth() + '/' + this.getDay();
    this.bonusesItemsList = this.expensesService.getItemsList(this.bonusesDbList);
    this.bonusesItemsList.push({
      bonusName: this.bonusItem.bonusName,
      bonusDescription: this.bonusItem.bonusDescription,
      bonusValue: Number(this.bonusItem.bonusValue),
      bonusDate: moment().unix()
    }
    );
    this.bonusItem = {
      bonusName: null,
      bonusDescription: null,
      bonusValue: null,
      bonusDate: null
    }
  }
}