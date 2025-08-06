document.addEventListener("DOMContentLoaded", () => {
    const item = document.getElementById("add-button");

    if (item) {
        item.addEventListener("click", () => {
            const amount = document.getElementById("amount").value;
            const type = document.getElementById("type").value;

            addItem(amount, type);
        });
    }
});
function addItem(amount, type) {
    if (amount === "" || type === "Select") {
        alert("Please enter both amount and type!");
        return;
    }

    fetch("http://localhost:3000/add-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount, type: type })
    })
    .then(response => response.json())  
    .then(data => {
        alert(data.message); 
        document.getElementById("amount").value = "";
        document.getElementById("type").value = "Select";
    })
    .catch(error => console.error("Error:", error));  
}
if (window.location.pathname === '/display.html') {
    document.addEventListener('DOMContentLoaded', function() {  
        fetch("http://localhost:3000/get-total-transactions")
            .then(response => response.json())
            .then(data => {
                const totalSavings = data.totalSavings;
                const totalExpenses = data.totalExpenses;

                const ctx = document.getElementById('myChart').getContext('2d');
                const myChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: ['Savings', 'Expenses'],
                        datasets: [{
                            label: 'Total Transactions',
                            data: [totalSavings, totalExpenses],
                            backgroundColor: ['rgba(40, 255, 87, 0.5)', 'rgba(255, 99, 132, 0.5)'],
                            borderColor: ['rgba(40, 255, 87, 1)', 'rgba(255, 99, 132, 1)'],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: false
                    }
                });
            })
            .catch(error => console.error("Error:", error));
    });
}
if (window.location.pathname === '/history.html') {
    document.addEventListener('DOMContentLoaded', function() {
        fetch("http://localhost:3000/get-transactions")
            .then(response => response.json())
            .then(transactions => {
                const tableBody = document.querySelector('#historyTable tbody');
                transactions.forEach(transaction => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${transaction.id}</td>
                        <td>${transaction.money}</td>
                        <td>${transaction.type}</td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => console.error("Error:", error));
    });
}
