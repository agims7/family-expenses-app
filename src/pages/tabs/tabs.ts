import { Component } from '@angular/core';

import { StatisticsPage } from "../statistics/statistics";
import { BudgetPage } from "../budget/budget";
import { ExpensesPage } from "../expenses/expenses";
import { NewExpensesPage } from "../new-expenses/new-expenses";
import { CategoriesPage } from "../categories/categories";
import { ShoppingListPage } from "../shopping-list/shopping-list";
import { ReceiptsPage } from "../receipts/receipts";

import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  statisticsPage = StatisticsPage;
  budgetPage = BudgetPage;
  expensesPage = ExpensesPage;
  newExpensesPage = NewExpensesPage;
  categoriesPage = CategoriesPage;
  shoppingListPage = ShoppingListPage;
  receiptsPage = ReceiptsPage;
}
