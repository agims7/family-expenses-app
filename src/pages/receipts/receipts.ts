import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { NewReceiptPage } from "../new-receipt/new-receipt";
import * as moment from 'moment';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Subscription } from 'rxjs/Subscription';
import { ExpensesService } from "../../services/expenses";

@Component({
  selector: 'page-receipts',
  templateUrl: 'receipts.html',
})
export class ReceiptsPage {
  newReceiptPage = NewReceiptPage;
  public receiptsList: FirebaseListObservable<any[]>
  public dbList;
  public sortDateDown: boolean = true;
  public sortPriceDown: boolean = true;
  public edit: boolean = false;
  public receiptsListSubscription: Subscription;
  public noData: boolean = true;
  public showSpinner: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService,
    private photoViewer: PhotoViewer
  ) {
  }

  ionViewDidLeave() {
    console.log('leave');
    this.expensesService.safeUnsubscribe(this.receiptsListSubscription);
  }

  ionViewDidEnter() {
    this.dbList = 'dydo/receiptsItems/';
    this.receiptsList = this.expensesService.getItemsList(this.dbList).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
    this.receiptsListSubscription = this.receiptsList.subscribe((data) => {
      this.showSpinner = false
      if (data == null) {
        this.noData = true;
        return;
      } else {
        if (data.length < 1) {
          this.noData = true;
          return;
        } else {
          this.noData = false;
        }
      }
    });
  }

  showImageFullScreen(image, text) {
    this.photoViewer.show(image, text);
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
    const alert = this.alertCtrl.create({
      title: 'Usuwanie paragonu',
      message: 'Czy na pewno chcesz usunąć ten paragon?',
      buttons: [
        {
          text: 'Tak',
          handler: () => {
            this.receiptsList.remove(key);
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

  dateAscending() {
    this.receiptsList = this.database.list('dydo/receiptsItems/', {
      query: {
        orderByChild: 'date'
      }
    });
    this.sortDateDown = false;
  }

  dateDescending() {
    this.receiptsList = this.database.list('dydo/receiptsItems/', {
      query: {
        orderByChild: 'date'
      }
    }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
    this.sortDateDown = true;
  }

  priceAscending() {
    this.receiptsList = this.database.list('dydo/receiptsItems/', {
      query: {
        orderByChild: 'value'
      }
    });
    this.sortPriceDown = false;
  }

  priceDescending() {
    this.receiptsList = this.database.list('dydo/receiptsItems/', {
      query: {
        orderByChild: 'value'
      }
    }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
    this.sortPriceDown = true;
  }

}
