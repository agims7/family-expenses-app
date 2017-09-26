import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';

@Injectable()
export class ExpensesService {
    private currentYear: string = moment().format('YYYY');
    public selectedMonth;
    public selectedMonthNumber: number;
    public selectedDay;
    public categoriesData = [
        {
            name: "wszystkie",
            days: {},
            color: '#ffffff',
            allMonthlyMoneySpent: 0,
            radioSign: true
        },
        {
            name: "rachunki",
            days: {},
            color: '#996633',
            allMonthlyMoneySpent: 0,
            radioSign: false
        },
        {
            name: "dzieci",
            days: {},
            color: '#ffb84d',
            allMonthlyMoneySpent: 0,
            radioSign: false
        },
        {
            name: "zakupy",
            days: {},
            color: '#ff4d4d',
            allMonthlyMoneySpent: 0,
            radioSign: false
        },
        {
            name: "osobiste",
            days: {},
            color: '#0099ff',
            allMonthlyMoneySpent: 0,
            radioSign: false
        },
        {
            name: "prezenty",
            days: {},
            color: '#ffccff',
            allMonthlyMoneySpent: 0,
            radioSign: false
        },
        {
            name: "auta",
            days: {},
            color: '#b3b3b3',
            allMonthlyMoneySpent: 0,
            radioSign: false
        },
        {
            name: "wakacje",
            days: {},
            color: '#ffff66',
            allMonthlyMoneySpent: 0,
            radioSign: false
        }

    ]

    constructor(
        public database: AngularFireDatabase
    ) { }

}