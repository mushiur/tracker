document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const records = JSON.parse(localStorage.getItem(loggedInUser.username + '_records')) || [];
    const form = document.getElementById('record-form');
    const recordsBody = document.getElementById('records-body');
    const totalIncomeElem = document.getElementById('total-income');
    const totalExpenseElem = document.getElementById('total-expense');
    const balanceElem = document.getElementById('balance');
    const filterMonth = document.getElementById('filter-month');
    const downloadReportBtn = document.getElementById('download-report');

    function renderRecords(filter = null) {
        recordsBody.innerHTML = '';
        let totalIncome = 0, totalExpense = 0;

        const filteredRecords = filter 
            ? records.filter(record => record.date.startsWith(filter))
            : records;

        filteredRecords.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.date}</td>
                <td>${record.category}</td>
                <td>${record.description}</td>
                <td>${record.amount}</td>
                <td>${record.type}</td>
                <td><button class="edit-btn">Edit</button><button class="delete-btn">Delete</button></td>
            `;
            recordsBody.appendChild(row);

            if (record.type === 'income') totalIncome += parseFloat(record.amount);
            else totalExpense += parseFloat(record.amount);

            row.querySelector('.edit-btn').addEventListener('click', () => editRecord(record));
            row.querySelector('.delete-btn').addEventListener('click', () => deleteRecord(record));
        });

        totalIncomeElem.textContent = totalIncome;
        totalExpenseElem.textContent = totalExpense;
        balanceElem.textContent = totalIncome - totalExpense;
    }

    function saveRecord(record) {
        records.push(record);
        localStorage.setItem(loggedInUser.username + '_records', JSON.stringify(records));
        renderRecords();
    }

    function deleteRecord(record) {
        const index = records.indexOf(record);
        records.splice(index, 1);
        localStorage.setItem(loggedInUser.username + '_records', JSON.stringify(records));
        renderRecords();
    }

    function editRecord(record) {
        document.getElementById('date').value = record.date;
        document.getElementById('category').value = record.category;
        document.getElementById('description').value = record.description;
        document.getElementById('amount').value = record.amount;
        document.getElementById('type').value = record.type;

        deleteRecord(record);
    }

    function downloadReport() {
        const filter = filterMonth.value;
        const filteredRecords = filter 
            ? records.filter(record => record.date.startsWith(filter))
            : records;

        const csvContent = "data:text/csv;charset=utf-8," + 
            ["Date,Category,Description,Amount,Type", 
            ...filteredRecords.map(record => 
                `${record.date},${record.category},${record.description},${record.amount},${record.type}` 
            )].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `report_${filter || 'all'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        const newRecord = {
            date: document.getElementById('date').value,
            category: document.getElementById('category').value,
            description: document.getElementById('description').value || '',
            amount: document.getElementById('amount').value,
            type: document.getElementById('type').value
        };
        saveRecord(newRecord);
        form.reset();
    });

    filterMonth.addEventListener('input', () => {
        renderRecords(filterMonth.value);
    });

    downloadReportBtn.addEventListener('click', downloadReport);

    renderRecords();
});
