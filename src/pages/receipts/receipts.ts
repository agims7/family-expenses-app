import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { NewReceiptPage } from "../new-receipt/new-receipt";
import * as moment from 'moment';

import { ExpensesService } from "../../services/expenses";

@Component({
  selector: 'page-receipts',
  templateUrl: 'receipts.html',
})
export class ReceiptsPage implements OnInit {
  newReceiptPage = NewReceiptPage;
  public receiptsList: FirebaseListObservable<any[]>
  public dbList;

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
    this.receiptsList.subscribe(x => {
     console.log(x);
    });
  }

  showImage(key, status) {
    this.receiptsList.update(key, {
      showImage: !status
    });
  }

  showTime(time) {
    return moment.unix(time).format('LTS');
  }

}
