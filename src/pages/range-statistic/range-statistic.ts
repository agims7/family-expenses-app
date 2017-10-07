import { Component, HostListener } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { RangeStatisticByCategoryPage } from "../range-statistic-by-category/range-statistic-by-category";

import { Subscription } from 'rxjs/Subscription';
import { ExpensesService } from "../../services/expenses";
import * as _ from 'lodash';
import * as moment from 'moment';

declare var AmCharts: any;

@Component({
  selector: 'page-range-statistic',
  templateUrl: 'range-statistic.html',
})
export class RangeStatisticPage {
  rangeStatisticByCategoryPage = RangeStatisticByCategoryPage;
  public polishMonths = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień',]
  public selectedDateFrom: string;
  public selectedDateTo: string;
  public firstYear: any;
  public lastYear: any;
  public firstMonth: any;
  public lastMonth: any;
  public firstDay: any;
  public lastDay: any;
  public sameYear: boolean = false;
  public sameMonth: boolean = false;
  public yearsRange = [];
  public monthsRange = [];
  public statisticYearsList: FirebaseListObservable<any[]>
  public statisticMonthsList: FirebaseListObservable<any[]>;
  public dbList: string;
  public dbMonthsList: string;
  public statisticMonthsListSubscription: Subscription;
  public noData: boolean = true;
  public monthsDays = [];
  public chart: any;
  public categories: any = [];
  public categoriesLength: number;
  public allSpentMoney: number = 0;
  public categoriesAllSpentMoney: any = [];
  public categoriesTable: any = [];
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
    this.expensesService.safeUnsubscribe(this.statisticMonthsListSubscription);
  }

  ionViewCanEnter() {
    this.expensesService.loaderOn();
  }

  ionViewDidEnter() {
    this.clearValues();
    this.selectedDateFrom = moment(this.expensesService.dateFrom).format('YYYY.MM.DD');
    this.selectedDateTo = moment(this.expensesService.dateTo).format('YYYY.MM.DD');
    this.getCategories();
    this.getSelectedYears();
    this.getSelectedMonths();
    this.getSelectedDays();
    this.getMoneySpent();
    setTimeout(() => {
      this.setChart()
    }, 500);
    this.localCategoriesData = _.clone(this.categoriesAllSpentMoney);
    this.localCategoriesData.shift();
    this.expensesService.loaderOff();    
  }

  clearValues() {
    this.categories = [];
    this.categoriesAllSpentMoney = [];
    this.allSpentMoney = 0;
  }

  getCategories() {
    for (var category of this.expensesService.categoriesData) {
      this.categories.push(category.name);
      this.categoriesAllSpentMoney.push({
        allMoney: 0,
        name: category.name
      });
    }
    this.categoriesLength = this.categories.length;
  }

  getSelectedYears() {
    this.yearsRange = [];
    this.firstYear = Number(this.selectedDateFrom.slice(0, 4));
    this.lastYear = Number(this.selectedDateTo.slice(0, 4));
    if (this.firstYear == this.lastYear) {
      this.sameYear = true;
      this.yearsRange.push(this.firstYear);
    } else {
      let first = this.firstYear;
      let last = this.lastYear;
      for (first; first <= last; first++) {
        this.yearsRange.push(first);
      }
    }
  }

  getSelectedMonths() {
    this.monthsRange = [];
    this.firstMonth = Number(this.selectedDateFrom.slice(5, 7));
    this.lastMonth = Number(this.selectedDateTo.slice(5, 7));
    if (this.firstMonth == this.lastMonth) {
      this.sameMonth = true;
      this.monthsRange.push(this.firstMonth);
    } else {
      let first = this.firstMonth;
      let last = this.lastMonth;
      for (first; first <= last; first++) {
        this.monthsRange.push(first);
      }
    }
  }

  getSelectedDays() {
    this.firstDay = Number(this.selectedDateFrom.slice(8, 10));
    this.lastDay = Number(this.selectedDateTo.slice(8, 10));
  }

  getMoneySpent() {  
    this.dbList = 'dydo/receiptsItems/';
    this.statisticYearsList = this.expensesService.getItemsList(this.dbList);
    for (let year of this.yearsRange) {
      for (let month of this.monthsRange) {
        this.dbMonthsList = 'dydo/expenseItems/' + year + '/' + this.expensesService.getMonthFromNumber(month);
        this.statisticMonthsList = this.expensesService.getItemsList(this.dbMonthsList);
        this.statisticMonthsListSubscription = this.statisticMonthsList.subscribe(data => {
          this.getDays(data, month, year);
        });
      }
    }
  }

  getDays(data, month, year) {    
    let monthName = this.expensesService.getMonthFromNumber(month)
    this.monthsDays[monthName] = [];
    for (let day of data) {
      if (month == this.firstMonth) {
        if (day.$key >= this.firstDay) {
          this.getDayMoney(day)
          this.monthsDays[monthName].push(day.$key)
        }
      } else if (month == this.lastMonth) {
        if (day.$key <= this.lastDay) {
          this.getDayMoney(day)
          this.monthsDays[monthName].push(day.$key)
        }
      } else {
        this.getDayMoney(day)
        this.monthsDays[monthName].push(day.$key)
      }
    }
  }

  getDayMoney(day) {
    for (let expenses in day) {
      let money = day[expenses].expenseValue;
      this.allSpentMoney = this.allSpentMoney + Number(money);
      for (let i = 0; i < this.categoriesLength; i++) {
        let name = day[expenses].expenseCategory;
        if (name === this.categories[i]) {
          this.categoriesAllSpentMoney[i].allMoney += Number(money);
        }
      }
    }
  }

  getChartInfoRange() {
    this.expensesService.categoriesColorTable = [];
    this.categoriesTable = []

    for (let i = 0; i < this.categories.length; i++) {
      this.categoriesTable.push({
        "name": this.categoriesAllSpentMoney[i].name,
        "value": this.expensesService.valueFixed(this.categoriesAllSpentMoney[i].allMoney)
      });
      this.expensesService.categoriesColorTable.push(this.expensesService.categoriesData[i].color);
    }
    this.categoriesTable.splice(0, 1);
    this.expensesService.categoriesColorTable.splice(0, 1);
  }

  setChart() {
    this.getChartInfoRange();
    this.chart = AmCharts.makeChart("chartdiv", {
      "type": "pie",
      "language": "pl",
      "autoDisplay": true,
      "colors": this.expensesService.categoriesColorTable,
      "dataProvider": this.categoriesTable,
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

