import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, PopoverController  } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { NewReceiptPage } from "../new-receipt/new-receipt";
import * as moment from 'moment';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Subscription } from 'rxjs/Subscription';
import { ExpensesService } from "../../services/expenses";
import { LogoutPage } from '../logout/logout';

@Component({
  selector: 'page-receipts',
  templateUrl: 'receipts.html',
})
export class ReceiptsPage {
  newReceiptPage = NewReceiptPage;
  public receiptsList: FirebaseListObservable<any[]>
  public receiptsListLength: number;
  public dbList;
  public sortDateDown: boolean = true;
  public sortPriceDown: boolean = true;
  public edit: boolean = false;
  public receiptsListSubscription: Subscription;
  public noData: boolean = true;
  public selectedIndex: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService,
    private photoViewer: PhotoViewer,
    public popoverCtrl: PopoverController
  ) {
  }

  ionViewDidLeave() {
    this.expensesService.safeUnsubscribe(this.receiptsListSubscription);
  }

  ionViewCanEnter() {
    this.expensesService.loaderOn();
  }

  ionViewDidEnter() {
    this.dbList = 'michal1dydo/receiptsItems/';
    this.receiptsList = this.expensesService.getItemsList(this.dbList).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
    this.receiptsListSubscription = this.receiptsList.subscribe((data) => {
      this.receiptsListLength = data.length;
      this.createSelectedIndexObject();
      this.expensesService.loaderOff();
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

  onShowOptions(event: MouseEvent) {
    const popover = this.popoverCtrl.create(LogoutPage);
    popover.present({ ev: event });
  }

  createSelectedIndexObject() {
    for (let i = 0; i < this.receiptsListLength; i++) {
      this.selectedIndex.push({index: null})
    }
  }

  showImageFullScreen(image, text) {
    this.photoViewer.show(image, text);
  }

  showImage(index: number) {
    this.selectedIndex[index].index = index;
  }

  hideImage(index: number) {
    this.selectedIndex[index].index = null;
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
    this.receiptsList = this.expensesService.getItemsList('michal1dydo/receiptsItems/', { orderByChild: 'date' });
    this.sortDateDown = false;
  }

  dateDescending() {
    this.receiptsList = this.expensesService.getItemsList('michal1dydo/receiptsItems/', { orderByChild: 'date' }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
    this.sortDateDown = true;
  }

  priceAscending() {
    this.receiptsList = this.receiptsList = this.expensesService.getItemsList('michal1dydo/receiptsItems/', { orderByChild: 'value' });
    this.sortPriceDown = false;
  }

  priceDescending() {
    this.receiptsList = this.receiptsList = this.expensesService.getItemsList('michal1dydo/receiptsItems/', { orderByChild: 'value' }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
    this.sortPriceDown = true;
  }

}
