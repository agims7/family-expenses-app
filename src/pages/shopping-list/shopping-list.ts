import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ExpensesService } from "../../services/expenses";
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {
  public bought: boolean;;
  public dbList: any;
  public shoppingListArray: FirebaseListObservable<any[]>;
  public shoppingListSubscription: Subscription;
  public showSpinner: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService
    ) {
  }

  ionViewDidLeave() {
    console.log('leave');
    this.expensesService.safeUnsubscribe(this.shoppingListSubscription);
  }

  ionViewDidEnter() {
    this.dbList = 'dydo/shoppingItems/';
    this.shoppingListArray = this.expensesService.getItemsList(this.dbList)
    this.shoppingListSubscription = this.shoppingListArray.subscribe((data) => {
      this.showSpinner = false
    });
  }

  addItem() {
    const alert = this.alertCtrl.create({
      title: 'Edycja elementu',
      inputs: [
        {
          name: 'name',
          placeholder: 'Nazwa',
        },
        {
          name: 'amount',
          placeholder: 'Ilość',
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
            this.shoppingListArray.push({
              name: data.name,
              amount: data.amount,
              bought: false              
            });
          }
        }
      ]
    });
    alert.present();
  }

  changeItemStatus(key: string, status) {
    this.shoppingListArray.update(key, {
      bought: !status
    });
  }
  
  deleteItem(key: string) {
    this.shoppingListArray.remove(key);
  }

}