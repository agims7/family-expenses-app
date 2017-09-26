import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';

@Injectable()
export class ExpensesService {
    private currentYear: string = moment().format('YYYY');
    public categories = ['rachunki', 'dzieci', 'zakupy', 'osobiste', 'prezenty', 'auta', 'wakacje'];
    public categoriesColors = ["#996633", "#ffb84d", "#ff4d4d", "#0099ff", "#ffccff", "#b3b3b3", "#ffff66"];
    public allMonthlyMoneySpentForCategories = [0, 0, 0, 0, 0];
    public daysWithCategoriesExpensesInMonth = [
        {
            name: "rachunki",
            days: {}
        },
        {
            name: "dzieci",
            days: {}
        },
        {
            name: "zakupy",
            days: {}
        },
        {
            name: "osobiste",
            days: {}
        },
        {
            name: "prezenty",
            days: {}
        },
        {
            name: "auta",
            days: {}
        },
        {
            name: "wakacje",
            days: {}
        }

    ]
    public selectedMonth;
    public selectedMonthNumber: number;
    public selectedDay;

    constructor(
        public database: AngularFireDatabase
    ) { }

}