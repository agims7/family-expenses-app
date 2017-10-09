import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { EditCategoryPage } from "../edit-category/edit-category";
import { ExpensesService } from "../../services/expenses";
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {
  editCategoryPage = EditCategoryPage;
  public newCategoryName: string;
  public color: string = '#ffffff';
  public categoriesItemsList: FirebaseListObservable<any[]>;
  public categoriesDataList: FirebaseListObservable<any[]>;
  public categoriesItemsListSubscription: Subscription;
  public categoriesDataListSubscription: Subscription;
  public dbList: string = 'dydo/categoriesItems';
  public categoriesTable;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService,
    public modalCtrl: ModalController
  ) {
  }

  ionViewDidLeave() {
    this.expensesService.safeUnsubscribe(this.categoriesItemsListSubscription);
    this.expensesService.safeUnsubscribe(this.categoriesDataListSubscription);
  }

  ionViewCanEnter() {
    this.expensesService.loaderOn();
  }

  ionViewDidEnter() {
    this.categoriesItemsList = this.expensesService.getItemsList(this.dbList);
    this.categoriesItemsListSubscription = this.categoriesItemsList.subscribe(() => {
      this.expensesService.loaderOff();
    });
  }

  clearInput() {
    this.newCategoryName = null;
    this.color = null;
  }

  addCategory() {
    this.newCategoryName = this.newCategoryName.toLowerCase();
    this.categoriesItemsList.push({
      name: this.newCategoryName,
      days: {},
      color: this.color,
      allMonthlyMoneySpent: 0,
      radioSign: false,
      removable: true
    });
    this.updateCategories()
    this.clearInput();
  }

  editCategory(category) {
    let modal = this.modalCtrl.create(EditCategoryPage, category);
    modal.present();
  }

  deleteCategory(key) {
    const alert = this.alertCtrl.create({
      title: 'Usuwanie kategorii',
      message: 'Czy na pewno chcesz usunąć tą kategorie?',
      buttons: [
        {
          text: 'Tak',
          handler: () => {
            this.categoriesItemsList.remove(key);
            this.updateCategories();
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

  updateCategories() {
    this.categoriesDataList = this.expensesService.getItemsList(this.dbList);
    this.categoriesDataListSubscription = this.categoriesDataList.subscribe((data) => {
      this.expensesService.categoriesData = data;
    });
  }
}