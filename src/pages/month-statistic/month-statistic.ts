import { Component, HostListener } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';
import { StatisticByCategoryPage } from "../statistic-by-category/statistic-by-category";
import { ExpensesService } from "../../services/expenses";
import * as moment from 'moment';
import * as _ from 'lodash';

declare var AmCharts: any;

@Component({
  selector: 'page-month-statistic',
  templateUrl: 'month-statistic.html',
})
export class MonthStatisticPage {
  statisticByCategoryPage = StatisticByCategoryPage;
  public selectedMonth;
  private currentYear: string = moment().format('YYYY');
  private dbList = 'dydo/expenseItems/' + this.currentYear;
  public expenseListOfDays: FirebaseListObservable<any[]>
  public expenseListSubscription: Subscription;
  public listOfDaySubscription: Subscription;
  public listOfDayTwoSubscription: Subscription;
  public allMonthlyMoneySpent: number = 0;
  public dayWithExpenses = {};
  public days = [];
  public chart: any;
  public showSpinner: boolean = true;
  public noData: boolean = true;
  public localCategoriesData: any = [];

  @HostListener('init')
  handleInit() {
    this.chart.legend.addListener("rollOverItem", this.handleRollOver);
  }

  @HostListener('rollOverSlice', ['$event'])
  handleRollOver(event) {
    var wedge = event.dataItem.wedge.node;
    wedge.parentNode.appendChild(wedge);
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService
  ) {
  }

  ionViewDidLeave() {
    this.expensesService.safeUnsubscribe(this.expenseListSubscription);
    this.expensesService.safeUnsubscribe(this.listOfDaySubscription);
    this.expensesService.safeUnsubscribe(this.listOfDayTwoSubscription);
  }

  ionViewDidEnter() {
    this.selectedMonth = this.navParams.data;
    this.dbList = 'dydo/expenseItems/' + this.currentYear + '/' + this.selectedMonth;

    this.expenseListOfDays = this.expensesService.getItemsList(this.dbList);
    this.expenseListSubscription = this.expenseListOfDays.subscribe(data => {
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
          this.getDays(data);
          setTimeout(() => {
            this.setChart()
          }, 500);
        }
      }
    });
    this.localCategoriesData = _.clone(this.expensesService.categoriesData);
    this.localCategoriesData.shift();
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

    for (let category of this.expensesService.categoriesData) {
      this.getDayMoneyByCategory(category.name);
    }
  }

  getDayMoneyByCategory(category) {
    this.createEmptyDaysObjects();
    for (let day of this.days) {
      let dbList = 'dydo/expenseItems/' + this.currentYear + '/' + this.selectedMonth + '/' + day;
      let listOfDay = this.expensesService.getItemsList(dbList, { orderByChild: 'expenseCategory', equalTo: category });
      this.listOfDaySubscription = listOfDay.subscribe(data => {
        for (let i = 0; i < this.expensesService.categoriesData.length; i++) {
          if (category == this.expensesService.categoriesData[i].name) {
            this.expensesService.categoriesData[i].days[day] = this.getFullSpentMoney(data);
            this.expensesService.categoriesData[i].allMonthlyMoneySpent = 0;
            for (let money in this.expensesService.categoriesData[i].days) {
              this.expensesService.categoriesData[i].allMonthlyMoneySpent = this.expensesService.categoriesData[i].allMonthlyMoneySpent + this.expensesService.categoriesData[i].days[money];
            }
          }
        }
      });
    }
  }

  createEmptyDaysObjects() {
    for (let i = 0; i < this.expensesService.categoriesData.length; i++) {
      this.expensesService.categoriesData[i].days = {};
    }
  }

  getDayMoney() {
    for (let day of this.days) {
      let databaseAddress = 'dydo/expenseItems/' + this.currentYear + '/' + this.selectedMonth + '/' + day;
      let listOfDay = this.expensesService.getItemsList(databaseAddress);

      this.listOfDayTwoSubscription = listOfDay.subscribe(data => {
        this.dayWithExpenses[day] = this.getFullSpentMoney(data);
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
    this.expensesService.getChartInfoMonths();
    this.chart = AmCharts.makeChart("chartdiv", {
      "type": "pie",
      "language": "pl",
      "autoDisplay": true,
      "colors": this.expensesService.categoriesColorTable,
      "dataProvider": this.expensesService.categoriesTable,
      "valueField": "value",
      "titleField": "name",
      "addClassNames": true,
      "theme": "light",
      "outlineAlpha": 1,
      "outlineThickness": 2,
      "outlineColor": "#fff",
      "innerRadius": "30%",
      "radius": 100,
      "labelText": "[[percents]]% <br> [[name]]",
      "fontSize": 12,
      "autoMargins": false,
      "marginTop": -50,
      "marginBottom": -50,
      "balloon": {
        "fixedPosition": true,
        "adjustBorderColor": true,
        "color": "#000000",
        "cornerRadius": 2,
        "fillColor": "#FFFFFF"
      },
      "legend": {
        "position": "bottom",
        "align": "center",
        "autoMargins": true,
        "fontSize": 11,
        "valueText": "[[value]] zł",
      },
      "export": {
        "enabled": false
      }
    });
  }

}
