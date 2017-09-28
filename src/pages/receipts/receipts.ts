import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { NewReceiptPage } from "../new-receipt/new-receipt";
import { EditReceiptPage } from "../edit-receipt/edit-receipt";
import * as moment from 'moment';

import { ExpensesService } from "../../services/expenses";

@Component({
  selector: 'page-receipts',
  templateUrl: 'receipts.html',
})
export class ReceiptsPage implements OnInit {
  newReceiptPage = NewReceiptPage;
  editReceiptPage = EditReceiptPage;
  public receiptsList: FirebaseListObservable<any[]>
  public dbList;

  public editt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService
  ) {
  }

  ngOnInit() {
    this.dbList = 'dydo/receiptsItems/';
    this.receiptsList = this.database.list(this.dbList);
  }

  showImage(key: string) {
    this.receiptsList.update(key, {
      showImage: true
    });
  }

  hideImage(key: string) {
    this.receiptsList.update(key, {
      showImage: false
    });
  }

  showTime(time) {
    return moment.unix(time).format('LTS');
  }

  deleteReceipt(key: string) {
    this.receiptsList.remove(key);
  }

  editReceipt(key) {
    console.log('click', this.edit)

    // this.navCtrl.push(EditReceiptPage, {
    //   key: key
    // })
    // this.receiptsList.update(key, {
    //   bought: !status
    // });
  }

  editReceiptItem() {
    console.log('klik')
  }

  edit(re) {
    this.editt = true;
  }

  // takePicture(){
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE
  //   }

  //   this.camera.getPicture(options).then((imageData) => {
  //     this.receiptImage = 'data:image/jpeg;base64,' + imageData;
  //     this.imageTaken = true;
  //    }, (err) => {
  //     console.log('error')
  //    });
  // }

}
