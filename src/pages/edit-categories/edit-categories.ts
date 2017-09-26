import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ExpensesService } from "../../services/expenses";

@Component({
  selector: 'page-edit-categories',
  templateUrl: 'edit-categories.html',
})
export class EditCategoriesPage implements OnInit {
  public newCategoryName: string;
  public color: string = '#ffffff';

  public categoriesItemsList: FirebaseListObservable<any[]>
  public categoriesColorsList: FirebaseListObservable<any[]>
  public categoriesDaysWithExpensesInMonthList: FirebaseListObservable<any[]>
  public categoriesAllMonthlyMoneySpentForCategoriesList: FirebaseListObservable<any[]>
  public categoriesRadioSignsList: FirebaseListObservable<any[]>

  public categoriesTable;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService
  ) {
  }

  ngOnInit() {
    this.categoriesItemsList = this.database.list('dydo/categoriesItems/categories');
    this.categoriesColorsList = this.database.list('dydo/categoriesItems/categoriesColors');
    this.categoriesRadioSignsList = this.database.list('dydo/categoriesItems/radioSignsForCategories');
    this.categoriesDaysWithExpensesInMonthList = this.database.list('dydo/categoriesItems/daysWithCategoriesExpensesInMonth');
    this.categoriesAllMonthlyMoneySpentForCategoriesList = this.database.list('dydo/categoriesItems/allMonthlyMoneySpentForCategories');

    this.categoriesItemsList.subscribe(x => {
      console.log(x);
    });
    this.categoriesTable = [this.categoriesItemsList, this.categoriesColorsList, this.categoriesDaysWithExpensesInMonthList, this.categoriesAllMonthlyMoneySpentForCategoriesList]
  }

  changeColor() {
    console.log(this.color)
  }

  clearInput() {
    this.newCategoryName = null;
    this.color = null;
  }

  addCategory() {
    // this.newCategoryName = this.newCategoryName.toLowerCase();
    // this.categoriesItemsList.push({
    //   name: this.newCategoryName
    // });
    // this.categoriesColorsList.push({
    //   color: this.color
    // })
    // this.categoriesRadioSignsList.push({
    //   checked: false,
    //   name: this.newCategoryName
    // })
    // this.categoriesDaysWithExpensesInMonthList.push({
    //   name: this.newCategoryName
    // })
    // this.categoriesAllMonthlyMoneySpentForCategoriesList.push({
    //   value: 0
    // })
    // this.clearInput();
  }

  deleteCategory(name, index, key) {
    // console.log(name, index, key);
    // this.iterateKeyTables(index);
  }

  iterateKeyTables(index) {
    let test = this.categoriesItemsList.subscribe(listData => {
      console.log(listData);
            // this.categoriesColorsList.remove(listData[index].$key).then(_ => {
            //   console.log('deleted!');
            //   test.unsubscribe();
            // });
        });
    // for (let lists of this.categoriesTable) {
    //   console.log(lists)
    //   let item;
    //   lists.subscribe(listData => {
    //     if (listData[index].$key !== undefined) {
    //       item = listData[index].$key;
    //     }
    //   });
    //   lists.remove(item);
    // }
    // let itemTwo;
    // this.categoriesRadioSignsList.subscribe(listData => {
    //   if (listData[index  1].$key !== undefined) {
    //     itemTwo = listData[index  1].$key;
    //   }
    // });
    // this.categoriesRadioSignsList.remove(itemTwo);
  }
}