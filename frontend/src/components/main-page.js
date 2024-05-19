import {CommonUtils} from "../utils/common-utils";

export class MainPage {
    constructor() {
        CommonUtils.switchButton();

        this.chooseDate();
    }

    chooseDate() {
        $('#date-from').datetimepicker({
            format: 'L'
        });

        $('#date-to').datetimepicker({
            format: 'L'
        });
    }
}