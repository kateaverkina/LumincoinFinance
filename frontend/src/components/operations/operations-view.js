import {OperationsService} from "../../service/operations-service.js";
import {CommonUtils} from "../../utils/common-utils.js";

export class OperationsView {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.findElements();
        this.chooseDate();
        this.init().then();
        this.getOperationsWithFilter().then();
    }

    chooseDate() {
        $(this.dateFrom).datetimepicker({
            format: 'L'
        });

        $(this.dateTo).datetimepicker({
            format: 'L'
        });
    }

    findElements() {
        this.popup = document.getElementById('popup');
        this.recordsElement = document.getElementById('records');
        this.dateFrom = document.getElementById('date-from');
        this.dateTo = document.getElementById('date-to');
        this.parentElement = document.getElementById('main-actions');
        this.mainAction = document.querySelectorAll('.main-action');
        this.intervalElement = document.getElementById('interval');
    }

    async init() {
        let dateTo = '';
        let dateFrom = '';

        const response = await OperationsService.getOperations(dateFrom, dateTo);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        this.recordsElement.innerHTML = '';

        this.showOperations(response.operations);
        this.operationsDelete(response.operations);
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
                
                this.recordsElement.innerHTML = '';

                this.showOperations(response.operations);
                this.operationsDelete(response.operations);
            }
        })

        $('#table').DataTable({
            "paging": false,
            "lengthChange": false,
            "searching": false,
            "ordering": false,
            "info": false,
            "autoWidth": false,
            "responsive": true,
        });
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

            intervalDates[i].addEventListener('blur', async() => {
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

                if(this.dateFrom.value && this.dateTo.value) {
                    const response = await OperationsService.getOperations(sendDateFrom, sendDateTo);
                    if (response.error) {
                        alert(response.error);
                        return response.redirect ? this.openNewRoute(response.redirect) : null;
                    }
                    this.recordsElement.innerHTML = '';

                    this.showOperations(response.operations);
                    this.operationsDelete(response.operations);
                }
            })
        }
    }


    showOperations(operations) {
        for (let i = 0; i < operations.length; i++) {
            const trElement = document.createElement('tr');
            let toolsElement = document.getElementById('tools');
            if (screen.width <= 1024) {
                toolsElement.parentElement.prepend(toolsElement);
                trElement.insertCell().innerHTML = this.generateGridToolsColumn('operations', operations[i].id);
                trElement.insertCell().innerText = i + 1;
                trElement.insertCell().innerHTML = CommonUtils.getType(operations[i].type);
                trElement.insertCell().innerText = operations[i].category;
                trElement.insertCell().innerText = operations[i].amount + '$';
                trElement.insertCell().innerText = operations[i].date;
                trElement.insertCell().innerText = operations[i].comment;
            } else {
                trElement.insertCell().innerText = i + 1;
                trElement.insertCell().innerHTML = CommonUtils.getType(operations[i].type);
                trElement.insertCell().innerText = operations[i].category;
                trElement.insertCell().innerText = operations[i].amount + '$';

                let dateParts = operations[i].date.split('-');
                let date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                let day = (`0${date.getDate()}`).slice(-2);
                let month = (`0${date.getMonth() + 1}`).slice(-2);
                let year = date.getFullYear();
                trElement.insertCell().innerText = day + "." + month + "." + year;

                trElement.insertCell().innerText = operations[i].comment;
                trElement.insertCell().innerHTML = this.generateGridToolsColumn('operations', operations[i].id);
            }
            this.recordsElement.appendChild(trElement);
        }
    }

    generateGridToolsColumn(entity, id) {
        return '<div class="' + entity + '-tools">' +
            '<a class="delete mr-2 trash"><svg width="14" height="15" viewBox="0 0 14 15"\n' +
            '                                                 fill="none"\n' +
            '                                                 xmlns="http://www.w3.org/2000/svg">\n' +
            '                                                <path d="M4.5 5.5C4.77614 5.5 5 5.72386 5 6V12C5 12.2761 4.77614 12.5 4.5 12.5C4.22386 12.5 4 12.2761 4 12V6C4 5.72386 4.22386 5.5 4.5 5.5Z"\n' +
            '                                                      fill="black"/>\n' +
            '                                                <path d="M7 5.5C7.27614 5.5 7.5 5.72386 7.5 6V12C7.5 12.2761 7.27614 12.5 7 12.5C6.72386 12.5 6.5 12.2761 6.5 12V6C6.5 5.72386 6.72386 5.5 7 5.5Z"\n' +
            '                                                      fill="black"/>\n' +
            '                                                <path d="M10 6C10 5.72386 9.77614 5.5 9.5 5.5C9.22386 5.5 9 5.72386 9 6V12C9 12.2761 9.22386 12.5 9.5 12.5C9.77614 12.5 10 12.2761 10 12V6Z"\n' +
            '                                                      fill="black"/>\n' +
            '                                                <path fill-rule="evenodd" clip-rule="evenodd"\n' +
            '                                                      d="M13.5 3C13.5 3.55228 13.0523 4 12.5 4H12V13C12 14.1046 11.1046 15 10 15H4C2.89543 15 2 14.1046 2 13V4H1.5C0.947715 4 0.5 3.55228 0.5 3V2C0.5 1.44772 0.947715 1 1.5 1H5C5 0.447715 5.44772 0 6 0H8C8.55229 0 9 0.447715 9 1H12.5C13.0523 1 13.5 1.44772 13.5 2V3ZM3.11803 4L3 4.05902V13C3 13.5523 3.44772 14 4 14H10C10.5523 14 11 13.5523 11 13V4.05902L10.882 4H3.11803ZM1.5 3V2H12.5V3H1.5Z"\n' +
            '                                                      fill="black"/>\n' +
            '                                            </svg></a>' +
            '<a href="/' + entity + '/update?id=' + id + '" class="update pencil"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"\n' +
            '                                                     xmlns="http://www.w3.org/2000/svg">\n' +
            '                                                    <path d="M12.1465 0.146447C12.3417 -0.0488155 12.6583 -0.0488155 12.8536 0.146447L15.8536 3.14645C16.0488 3.34171 16.0488 3.65829 15.8536 3.85355L5.85357 13.8536C5.80569 13.9014 5.74858 13.9391 5.68571 13.9642L0.68571 15.9642C0.500001 16.0385 0.287892 15.995 0.146461 15.8536C0.00502989 15.7121 -0.0385071 15.5 0.0357762 15.3143L2.03578 10.3143C2.06092 10.2514 2.09858 10.1943 2.14646 10.1464L12.1465 0.146447ZM11.2071 2.5L13.5 4.79289L14.7929 3.5L12.5 1.20711L11.2071 2.5ZM12.7929 5.5L10.5 3.20711L4.00001 9.70711V10H4.50001C4.77616 10 5.00001 10.2239 5.00001 10.5V11H5.50001C5.77616 11 6.00001 11.2239 6.00001 11.5V12H6.29291L12.7929 5.5ZM3.03167 10.6755L2.92614 10.781L1.39754 14.6025L5.21903 13.0739L5.32456 12.9683C5.13496 12.8973 5.00001 12.7144 5.00001 12.5V12H4.50001C4.22387 12 4.00001 11.7761 4.00001 11.5V11H3.50001C3.28561 11 3.10272 10.865 3.03167 10.6755Z"\n' +
            '                                                          fill="black"/>\n' +
            '                                                </svg></a>' +

            '</div>';
    }

    operationsDelete(operations) {
        for (let i = 0; i < operations.length; i++) {
            const deleteElements = document.querySelectorAll('.delete');
            for (let i = 0; i < deleteElements.length; i++) {

                deleteElements[i].addEventListener('click', () => {
                    this.popup.classList.add('open');
                    document.getElementById('delete-operation').href = 'operations/delete?id=' + operations[i].id;
                })

                document.getElementById('operations-do-not-delete').addEventListener('click', () => {
                    this.popup.classList.remove('open');
                })
            }
        }
    }
}