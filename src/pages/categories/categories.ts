import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { EditCategoryPage } from "../edit-category/edit-category";

@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage implements OnInit {
  editCategoryPage = EditCategoryPage;
  public newCategoryName: string;
  public color: string = '#ffffff';
  public categoriesItemsList: FirebaseListObservable<any[]>
  public categoriesTable;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public database: AngularFireDatabase,
  ) {
  }

  ngOnInit() {
    this.categoriesItemsList = this.database.list('dydo/categoriesItems');
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
      radioSign: false
    });
    this.clearInput();
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
}