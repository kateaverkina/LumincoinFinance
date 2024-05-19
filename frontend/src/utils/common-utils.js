export class CommonUtils {
    static switchButton() {
        const parent = document.querySelector('.main-actions');
        const mainAction = document.querySelectorAll('.main-action');
        const interval = document.getElementById('interval');
        const dateFrom = document.getElementById('date-from');
        const dateTo = document.getElementById('date-to');

        parent.addEventListener('click', (event) => {
            let target = event.target;

            if (target.classList.contains('main-action')) {
                for (let i = 0; i < mainAction.length; i++) {
                    mainAction[i].classList.remove('active');
                }
                target.classList.add('active');
                interval.classList.remove('active');
                dateFrom.value = '';
                dateTo.value = '';
                dateFrom.setAttribute('disabled', 'disabled');
                dateTo.setAttribute('disabled', 'disabled');
            }

            interval.addEventListener('click', () => {
                mainAction.forEach(action => {
                    action.classList.remove('active');
                })
                interval.classList.add('active');
                dateFrom.removeAttribute('disabled');
                dateTo.removeAttribute('disabled');
            })
        });
    }


}