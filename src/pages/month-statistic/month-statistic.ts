import { Component, HostListener } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';
import { ExpensesService } from "../../services/expenses";
import * as moment from 'moment';

declare var AmCharts: any;

@Component({
  selector: 'page-month-statistic',
  templateUrl: 'month-statistic.html',
})
export class MonthStatisticPage {
  public selectedMonth;
  private currentYear: string = moment().format('YYYY');
  private dbList = 'dydo/expenseItems/' + this.currentYear;
  public daysList;
  public expenseListOfDays: FirebaseListObservable<any[]>
  public expenseListSubscription: Subscription;
  public listOfDaySubscription: Subscription;
  public listOfDayTwoSubscription: Subscription;
  public allMonthlyMoneySpent: number;
  public dayWithExpenses = {};
  public days = [];
  public chartOpen: boolean = false;
  public categoriesColorTable = [];
  public categoriesTable = [];
  public chart: any;
  public showSpinner: boolean = true;
  public noData: boolean = true;

  @HostListener('init')
  handleInit(){
    this.chart.legend.addListener("rollOverItem", this.handleRollOver);
  }

  @HostListener('rollOverSlice', ['$event'])
  handleRollOver(event){
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
    console.log('leave');
    this.expensesService.safeUnsubscribe(this.expenseListSubscription);
    this.expensesService.safeUnsubscribe(this.listOfDaySubscription);
    this.expensesService.safeUnsubscribe(this.listOfDayTwoSubscription);
  }

  ionViewDidEnter() {
    this.selectedMonth = this.navParams.data;
    this.daysList = this.selectedMonth;
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
      let listOfDay = this.expensesService.getItemsList(dbList, {orderByChild: 'expenseCategory', equalTo: category});
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

  getChartInfo() {
    this.categoriesColorTable = [];
    this.categoriesTable = []

    for (let i = 0; i < this.expensesService.categoriesData.length; i++) {
      this.categoriesTable.push({
        "name": this.expensesService.categoriesData[i].name,
        "value": this.expensesService.categoriesData[i].allMonthlyMoneySpent
      })
      this.categoriesColorTable.push(this.expensesService.categoriesData[i].color);
    }
    this.categoriesTable.splice(0, 1);
    this.categoriesColorTable.splice(0, 1);
  }


  setChart() {
    this.getChartInfo();
    this.chart = AmCharts.makeChart("chartdiv", {
      "type": "pie",
      "language": "pl",
      "dataProvider": this.categoriesTable,
      "autoDisplay": true,
      "valueField": "value",
      "titleField": "name",
      "colors": this.categoriesColorTable,
      "addClassNames": true,
      "innerRadius": "10%",
      "labelRadius": "-40%",
      "labelText": "[[percents]]% <br> [[name]]",
      "marginTop": -50,
      "marginBottom": -50,
      "balloon": {
        "fixedPosition": true
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
