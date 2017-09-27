import { Component } from '@angular/core';

import { StatisticsPage } from "../statistics/statistics";
import { ExpensesPage } from "../expenses/expenses";
import { NewExpensesPage } from "../new-expenses/new-expenses";
import { CategoriesPage } from "../categories/categories";
import { ShoppingListPage } from "../shopping-list/shopping-list";

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  statisticsPage = StatisticsPage;
  expensesPage = ExpensesPage;
  newExpensesPage = NewExpensesPage;
  categoriesPage = CategoriesPage;
  shoppingListPage = ShoppingListPage;
}
