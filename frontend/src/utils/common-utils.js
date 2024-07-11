export class CommonUtils {
    static getType (type) {
        let typeHtml = null;

        switch (type) {
            case 'income':
                typeHtml = '<span class="text-success">доход</span>';
                break;
            case 'expense':
                typeHtml = '<span class="text-danger">расход</span>';
                break;
        }

        return typeHtml;
    }

    static switchType(typeElement) {
        let type = typeElement.value;
        switch (type) {
            case 'Доход':
                type = 'income';
                break;
            case 'Расход':
                type = 'expense';
                break;
        }
        return type;
    }
}