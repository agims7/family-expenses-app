import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage implements OnInit {
  public bought: boolean;;
  public dbList;
  public shoppingListArray: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public database: AngularFireDatabase
  ) {
  }

  ngOnInit() {
    this.dbList = 'dydo/shoppingItems/';
    this.shoppingListArray = this.database.list(this.dbList)
    this.shoppingListArray.subscribe(x => {
      console.log(x);
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