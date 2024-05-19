import {CommonUtils} from "../../utils/common-utils";

export class OperationsView {
    constructor() {
        this.popup = document.getElementById('operations-popup');
        this.deleteElements = document.querySelectorAll('.delete');
        this.updatelements = document.querySelectorAll('.update');

        CommonUtils.switchButton();
        this.chooseDate();
        this.operationsDelete();
        this.operationsUpdate();
        this.responsiveTable();
    }

    chooseDate() {
        $('#date-from').datetimepicker({
            format: 'L'
        });

        $('#date-to').datetimepicker({
            format: 'L'
        });
    }

    operationsDelete() {
        this.deleteElements.forEach(item => {
            item.addEventListener('click', () => {
                this.popup.classList.add('open');
            })
        })

        document.getElementById('operations-do-not-delete').addEventListener('click', () => {
            this.popup.classList.remove('open');
        })
    }

    operationsUpdate() {
        this.updatelements.forEach(item => {
            item.onclick = function (e) {
                item.href = 'operations/update';
            }
        })
    }

    responsiveTable() {
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
}