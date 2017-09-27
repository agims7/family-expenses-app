import { Component, OnInit, HostListener } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ExpensesService } from "../../services/expenses";
import * as moment from 'moment';

declare var AmCharts: any;

@Component({
  selector: 'page-month-statistic',
  templateUrl: 'month-statistic.html',
})
export class MonthStatisticPage implements OnInit {
  public selectedMonth;
  private currentYear: string = moment().format('YYYY');
  private dbList = 'dydo/expenseItems/' + this.currentYear;
  public daysList;
  public expenseListOfDays: FirebaseListObservable<any[]>

  public allMonthlyMoneySpent: number;
  public dayWithExpenses = {};
  public days = [];

  public chartOpen: boolean = false;
  public noData: boolean = true;

  public categoriesDataTable = [];
  public categoriesColorTable = [];
  public categoriesLabelTable = [];

  public categoriesTable = [];

  public chart: any;

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

  ngOnInit() {
    this.selectedMonth = this.navParams.data;
    this.daysList = this.selectedMonth;
    this.dbList = 'dydo/expenseItems/' + this.currentYear + '/' + this.selectedMonth;

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

    for (let category of this.expensesService.categoriesData) {
      this.getDayMoneyByCategory(category.name);
    }
  }

  getDayMoneyByCategory(category) {
    this.createEmptyDaysObjects();
    for (let day of this.days) {
      let listOfDay = this.database.list('dydo/expenseItems/' + this.currentYear + '/' + this.selectedMonth + '/' + day, {
        query: {
          orderByChild: 'expenseCategory',
          equalTo: category
        }
      });
      listOfDay.subscribe(x => {
        for (let i = 0; i < this.expensesService.categoriesData.length; i++) {
          if (category == this.expensesService.categoriesData[i].name) {
            this.expensesService.categoriesData[i].days[day] = this.getFullSpentMoney(x);
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

  getChartInfo() {
    this.categoriesColorTable = [];
    this.categoriesLabelTable = [];
    this.categoriesDataTable = [];

    this.categoriesTable = []

    for (let i = 0; i < this.expensesService.categoriesData.length; i++) {
      this.categoriesTable.push({
        "name": this.expensesService.categoriesData[i].name,
        "value": this.expensesService.categoriesData[i].allMonthlyMoneySpent
      })
      this.categoriesColorTable.push(this.expensesService.categoriesData[i].color);
      // this.categoriesLabelTable.push(this.expensesService.categoriesData[i].name);
      // this.categoriesDataTable.push(this.expensesService.categoriesData[i].allMonthlyMoneySpent);
    }
    this.categoriesTable.splice(0, 1);
    this.categoriesColorTable.splice(0, 1);
    // this.categoriesLabelTable.splice(0, 1);
    // this.categoriesDataTable.splice(0, 1);

    console.log(this.categoriesTable)
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
      "labelRadius": -35,
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
