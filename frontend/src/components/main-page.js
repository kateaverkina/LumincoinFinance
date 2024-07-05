import {OperationsService} from "../service/operations-service.js";

export class MainPage {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.findElements();
        this.chooseDate();
        this.init().then();
        this.getOperationsWithFilter().then();
    }

    findElements() {
        this.dateFrom = document.getElementById('date-from');
        this.dateTo = document.getElementById('date-to');
        this.parentElement = document.getElementById('main-actions');
        this.mainAction = document.querySelectorAll('.main-action');
        this.intervalElement = document.getElementById('interval');
    }

    chooseDate() {
        $(this.dateFrom).datetimepicker({
            format: 'L'
        });

        $(this.dateTo).datetimepicker({
            format: 'L'
        });
    }

    async init() {
        let dateTo = '';
        let dateFrom = '';

        const response = await OperationsService.getOperations(dateFrom, dateTo);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showIncomeChart(response.operations);
        this.showExpenseChart(response.operations);
        this.intervalDates();
    }

    async getOperationsWithFilter() {
        this.parentElement.addEventListener('click', async (event) => {
            let target = event.target;

            if (target.classList.contains('main-action')) {
                for (let i = 0; i < this.mainAction.length; i++) {
                    this.mainAction[i].classList.remove('active');
                }
                target.classList.add('active');

                let date = new Date();
                let day = (`0${date.getDate()}`).slice(-2);
                let month = (`0${date.getMonth() + 1}`).slice(-2);
                let year = date.getFullYear();
                let dateTo = year + "-" + month + "-" + day;
                let dateFrom = year + "-" + month + "-" + day;

                if (target.classList.contains('today')) {
                    dateFrom = year + "-" + month + "-" + day;
                }
                if (target.classList.contains('week')) {
                    date.setDate(date.getDate() - 7);
                    dateFrom = date.toISOString().split('T')[0];
                }
                if (target.classList.contains('month')) {
                    date.setMonth(date.getMonth() - 1);
                    dateFrom = date.toISOString().split('T')[0];
                }
                if (target.classList.contains('year')) {
                    date.setFullYear(date.getFullYear() - 1);
                    dateFrom = date.toISOString().split('T')[0];
                }

                const response = await OperationsService.getOperations(dateFrom, dateTo);
                if (response.error) {
                    alert(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }

                this.showIncomeChart(response.operations);
                this.showExpenseChart(response.operations);
            }
        })
    }

    addData(chart, label, newData) {
        chart.data.labels.push(label);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(newData);
        });
        chart.update();
    }


    showIncomeChart(operations) {
        let incomeTypeOperations = operations.filter(operation => {
            return operation.type === 'income';
        })
        if (incomeTypeOperations) {
            let incomeChartCanvas = document.getElementById('incomeChart');
            let canvasParent = document.getElementById('canvasIncomeParent');

            incomeChartCanvas.remove();
            let newCanvas = document.createElement('canvas');
            newCanvas.setAttribute('id', 'incomeChart');
            canvasParent.appendChild(newCanvas);

            let pieChartCanvas = $('#incomeChart').get(0).getContext('2d');

            let pieData = {
                labels: [],
                datasets: [
                    {
                        data: [],
                        backgroundColor: ['#f56954', '#00a65a', '#f39c12', '#00c0ef', '#3c8dbc', '#d2d6de'],
                    }
                ]
            }

            let pieOptions = {
                maintainAspectRatio: false,
                responsive: true,
            }

            let incomeChart = new Chart(pieChartCanvas, {
                type: 'pie',
                data: pieData,
                options: pieOptions
            })

            let result = {};
            for (let element of incomeTypeOperations) {
                if (result[element.category] === undefined)
                    result[element.category] = 0;
                result[element.category] += element.amount;
            }

            for (let category in result) {
                this.addData(incomeChart, category, result[category]);
            }
        }
    }

    showExpenseChart(operations) {
        let expenseChart;
        if(expenseChart) {
            expenseChart.destroy();
        }
        let expenseTypeOperations = operations.filter(operation => {
            return operation.type === 'expense';
        })

        if (expenseTypeOperations) {
            let expenseChartCanvas = document.getElementById('expenseChart');
            let canvasParent = document.getElementById('canvasExpenseParent');

            expenseChartCanvas.remove();
            let newCanvas = document.createElement('canvas');
            newCanvas.setAttribute('id', 'expenseChart');
            canvasParent.appendChild(newCanvas);

            let pieChartCanvas = $('#expenseChart').get(0).getContext('2d');

            let pieData = {
                labels: [],
                datasets: [
                    {
                        data: [],
                        backgroundColor: ['#f56954', '#00a65a', '#f39c12', '#00c0ef', '#3c8dbc', '#d2d6de'],
                    }
                ]
            }

            let pieOptions = {
                maintainAspectRatio: false,
                responsive: true,
            }

            expenseChart = new Chart(pieChartCanvas, {
                type: 'pie',
                data: pieData,
                options: pieOptions
            })

            let result = {};
            for (let element of expenseTypeOperations) {
                if (result[element.category] === undefined)
                    result[element.category] = 0;
                result[element.category] += element.amount;
            }
            for (let category in result) {
                this.addData(expenseChart, category, result[category]);
            }
        }
    }

    intervalDates() {
        let intervalDates = [...document.getElementsByClassName('main-dates')];
        for (let i = 0; i < intervalDates.length; i++) {
            intervalDates[i].onchange = () => {
                this.mainAction.forEach(action => {
                    action.classList.remove('active');
                })
                this.intervalElement.classList.add('active');
            }

            intervalDates[i].addEventListener('blur', async () => {
                let sendDateFrom = '';
                let sendDateTo = '';
                let dateFromParts = this.dateFrom.value.split('.');
                let dateFrom = new Date(dateFromParts[2], dateFromParts[1] - 1, dateFromParts[0]);
                let dayFrom = (`0${dateFrom.getDate()}`).slice(-2);
                let monthFrom = (`0${dateFrom.getMonth() + 1}`).slice(-2);
                let yearFrom = dateFrom.getFullYear();
                sendDateFrom = yearFrom + "-" + monthFrom + "-" + dayFrom;

                let dateToParts = this.dateTo.value.split('.');
                let dateTo = new Date(dateToParts[2], dateToParts[1] - 1, dateToParts[0]);
                let dayTo = (`0${dateTo.getDate()}`).slice(-2);
                let monthTo = (`0${dateTo.getMonth() + 1}`).slice(-2);
                let yearTo = dateTo.getFullYear();
                sendDateTo = yearTo + "-" + monthTo + "-" + dayTo;

                if (this.dateFrom.value && this.dateTo.value) {
                    const response = await OperationsService.getOperations(sendDateFrom, sendDateTo);
                    if (response.error) {
                        alert(response.error);
                        return response.redirect ? this.openNewRoute(response.redirect) : null;
                    }

                    this.showIncomeChart(response.operations);
                    this.showExpenseChart(response.operations);
                }
            })
        }
    }
}
