import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { NewReceiptPage } from "../new-receipt/new-receipt";
import * as moment from 'moment';
import { PhotoViewer } from '@ionic-native/photo-viewer';

import { ExpensesService } from "../../services/expenses";

@Component({
  selector: 'page-receipts',
  templateUrl: 'receipts.html',
})
export class ReceiptsPage implements OnInit {
  newReceiptPage = NewReceiptPage;
  public receiptsList: FirebaseListObservable<any[]>
  public dbList;

  public edit: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService,
    private photoViewer: PhotoViewer
  ) {
  }

  showImageFullScreen(image, text) {
    this.photoViewer.show(image, text);
  }

  ngOnInit() {
    this.dbList = 'dydo/receiptsItems/';
    this.receiptsList = this.database.list(this.dbList).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
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
    return moment.unix(time).format('HH:mm / DD.MM.YYYY');
  }

  deleteReceipt(key: string) {
    this.receiptsList.remove(key);
  }

  saveEdition(key, name, value, description) {
    this.edit = !this.edit;
    this.receiptsList.update(key, {
      name: name,
      value: value,
      description: description
    });
  }

  editReceipt() {
    this.edit = !this.edit;
  }

}
