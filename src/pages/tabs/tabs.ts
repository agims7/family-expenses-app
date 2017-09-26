import { Component } from '@angular/core';

import { StatisticsPage } from "../statistics/statistics";
import { ExpensesPage } from "../expenses/expenses";
import { NewExpensesPage } from "../new-expenses/new-expenses";

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  statisticsPage = StatisticsPage;
  expensesPage = ExpensesPage;
  newExpensesPage = NewExpensesPage;
}
