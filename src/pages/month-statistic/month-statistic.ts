import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ExpensesService } from "../../services/expenses";
import * as moment from 'moment';
import Chart from 'chart.js';

@Component({
  selector: 'page-month-statistic',
  templateUrl: 'month-statistic.html',
})
export class MonthStatisticPage implements OnInit {
  public selectedMonth;
  private currentYear: string = moment().format('YYYY');
  private dbList = 'expenseItems/' + this.currentYear;
  public daysList;
  public expenseListOfDays: FirebaseListObservable<any[]>

  public allMonthlyMoneySpent: number;
  public dayWithExpenses = {};
  public days = [];

  public chartOpen: boolean = false;
  public noData: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService
  ) {
  }

  ngOnInit() {
    this.selectedMonth = this.navParams.data;
    this.daysList = this.selectedMonth;
    this.dbList = 'expenseItems/' + this.currentYear + '/' + this.selectedMonth;

    this.expenseListOfDays = this.database.list(this.dbList);
    this.expenseListOfDays.subscribe(x => {
      if (x == null) {
        this.noData = true;
        return;
      } else {
        if (x.length < 1) {
          this.noData = true;
          return;
        } else {
          this.noData = false;
          this.getDays(x);
          setTimeout(() => {
            this.setChart()
          }, 500);
        }
      }
    });
  }

  getMonthlySpentMoney() {
    this.allMonthlyMoneySpent = 0;
    for (let money in this.dayWithExpenses) {
      this.allMonthlyMoneySpent = this.allMonthlyMoneySpent + this.dayWithExpenses[money];
    }
  }

  getDays(data) {
    for (let day of data) {
      this.days.push(day.$key);
    }
    this.getDayMoney();

    for (let category of this.expensesService.categories) {
      this.getDayMoneyByCategory(category);
    }
  }

  getDayMoneyByCategory(category) {
    for (let day of this.days) {
      let listOfDay = this.database.list('expenseItems/' + this.currentYear + '/' + this.selectedMonth + '/' + day, {
        query: {
          orderByChild: 'expenseCategory',
          equalTo: category
        }
      });
      listOfDay.subscribe(x => {
        for (let i = 0; i < this.expensesService.daysWithCategoriesExpensesInMonth.length; i++) {
          if (category == this.expensesService.daysWithCategoriesExpensesInMonth[i].name) {
            this.expensesService.daysWithCategoriesExpensesInMonth[i].days[day] = this.getFullSpentMoney(x);
            this.expensesService.allMonthlyMoneySpentForCategories[i] = 0;
            for (let money in this.expensesService.daysWithCategoriesExpensesInMonth[i].days) {
              this.expensesService.allMonthlyMoneySpentForCategories[i] = this.expensesService.allMonthlyMoneySpentForCategories[i] + this.expensesService.daysWithCategoriesExpensesInMonth[i].days[money];
            }
          }
        }
      });
    }
  }

  getDayMoney() {
    for (let day of this.days) {
      let databaseAddress = 'expenseItems/' + this.currentYear + '/' + this.selectedMonth + '/' + day;
      let listOfDay = this.database.list(databaseAddress);
      listOfDay.subscribe(x => {
        this.dayWithExpenses[day] = this.getFullSpentMoney(x);
        this.getMonthlySpentMoney();
      });
    }
  }

  getFullSpentMoney(data) {
    let allMoney: number = 0;
    for (let expense of data) {
      allMoney += Number(expense.expenseValue);
    }
    return allMoney;
  }

  setChart() {
    this.chartOpen = true;
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.expensesService.categories,
        datasets: [{
          backgroundColor: this.expensesService.categoriesColors,
          data: this.expensesService.allMonthlyMoneySpentForCategories
        }]
      }
    });
  }


}
