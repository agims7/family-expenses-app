import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { Camera, CameraOptions } from '@ionic-native/camera';


@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage implements OnInit {
  public bought: boolean;;
  public dbList;
  public shoppingListArray: any = [];

  public base64Image = {
    image: "",
    name: ""
  };
  public options: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public database: AngularFireDatabase,
    public camera: Camera
  ) {
  }
  

  takePicture(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.base64Image.image = 'data:image/jpeg;base64,' + imageData;
      this.base64Image.image = 'Zdjęcie';
     }, (err) => {
      console.log('error')
     });
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