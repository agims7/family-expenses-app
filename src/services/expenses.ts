import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';

@Injectable()
export class ExpensesService {
    private currentYear: string = moment().format('YYYY');
    public categories = ['rachunki', 'dzieci', 'zakupy', 'osobiste', 'prezenty', 'auta', 'wakacje'];
    public categoriesColors = ["#996633", "#ffb84d", "#ff4d4d", "#0099ff", "#ffccff", "#b3b3b3", "#ffff66"];
    public allMonthlyMoneySpentForCategories = [0, 0, 0, 0, 0, 0, 0];
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
    public radioSignsForCategories = [];
    public selectedMonth;
    public selectedMonthNumber: number;
    public selectedDay;

    public categoriesData = [
        {
            name: "wszystkie",
            days: {},
            allMonthlyMoneySpent: 0,
            monthlyDaysWithExpenses: [],
            radioSign: true
        },
        {
            name: "rachunki",
            days: {},
            color: '#996633',
            allMonthlyMoneySpent: 0,
            monthlyDaysWithExpenses: [],
            radioSign: false
        },
        {
            name: "dzieci",
            days: {},
            color: '#ffb84d',
            allMonthlyMoneySpent: 0,
            monthlyDaysWithExpenses: [],
            radioSign: false
        },
        {
            name: "zakupy",
            days: {},
            color: '#ff4d4d',
            allMonthlyMoneySpent: 0,
            monthlyDaysWithExpenses: [],
            radioSign: false
        },
        {
            name: "osobiste",
            days: {},
            color: '#0099ff',
            allMonthlyMoneySpent: 0,
            monthlyDaysWithExpenses: [],
            radioSign: false
        },
        {
            name: "prezenty",
            days: {},
            color: '#ffccff',
            allMonthlyMoneySpent: 0,
            monthlyDaysWithExpenses: [],
            radioSign: false
        },
        {
            name: "auta",
            days: {},
            color: '#b3b3b3',
            allMonthlyMoneySpent: 0,
            monthlyDaysWithExpenses: [],
            radioSign: false
        },
        {
            name: "wakacje",
            days: {},
            color: '#ffff66',
            allMonthlyMoneySpent: 0,
            monthlyDaysWithExpenses: [],
            radioSign: false
        }

    ]

    constructor(
        public database: AngularFireDatabase
    ) { }

}