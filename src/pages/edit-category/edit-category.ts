import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, NavParams, ViewController, PopoverController  } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { CategoriesPage } from '../categories/categories';
import { ExpensesService } from "../../services/expenses";
import { LogoutPage } from '../logout/logout';

@Component({
  selector: 'page-edit-category',
  templateUrl: 'edit-category.html',
})
export class EditCategoryPage {
  public categoryName: string;
  public categoryColor: string;
  public categoryKey: string;
  public selectedCategory;
  public dbList;
  public categoriesList: FirebaseListObservable<any[]>  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public viewCtrl: ViewController,
    public expensesService: ExpensesService,
    public popoverCtrl: PopoverController    
  ) {
  }

  ionViewCanEnter() {
    this.expensesService.loaderOn();
  }

  ionViewDidEnter() {
    this.setDbList();
    this.selectedCategory = this.navParams.data;
    this.categoryName = this.selectedCategory.name;
    this.categoryColor = this.selectedCategory.color;
    this.categoryKey = this.selectedCategory.$key;
  }

  onShowOptions(event: MouseEvent) {
    const popover = this.popoverCtrl.create(LogoutPage);
    popover.present({ ev: event });
  }

  changeName() {
    this.categoryName = this.categoryName.toLowerCase();
  }

  setDbList() {
    this.dbList = 'michal1dydo/categoriesItems/';
    this.categoriesList = this.database.list(this.dbList);
    this.expensesService.loaderOff();
  }

  editCategory() {
    this.categoriesList.update(this.categoryKey, {
      name: this.categoryName,
      color: this.categoryColor
    });
    this.navCtrl.push(CategoriesPage);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
