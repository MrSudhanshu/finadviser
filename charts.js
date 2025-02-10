function updateCharts(financialData, analysis) {
    createExpenseChart(financialData, analysis);
    createAffordabilityChart(analysis);
}

function createExpenseChart(financialData, analysis) {
    const ctx = document.getElementById('expenseChart').getContext('2d');

    // Destroy existing chart if it exists
    if (window.expenseChart instanceof Chart) {
        window.expenseChart.destroy();
    }

    const disposableAfterEMI = Math.max(0, analysis.disposableIncome - analysis.estimatedEMI);

    window.expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Rent', 'Utilities', 'Current EMIs', 'New EMI', 'Remaining'],
            datasets: [{
                data: [
                    financialData.expenses.rent,
                    financialData.expenses.utilities,
                    financialData.expenses.emis,
                    analysis.estimatedEMI,
                    disposableAfterEMI
                ],
                backgroundColor: [
                    '#007ACC',
                    '#28A745',
                    '#FFC107',
                    '#DC3545',
                    '#6C757D'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Monthly Expense Breakdown',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                }
            }
        }
    });
}

function createAffordabilityChart(analysis) {
    const ctx = document.getElementById('affordabilityChart').getContext('2d');

    // Destroy existing chart if it exists
    if (window.affordabilityChart instanceof Chart) {
        window.affordabilityChart.destroy();
    }

    const maxRecommendedEMI = analysis.totalIncome * 0.5; // 50% of income

    window.affordabilityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Current EMI Load', 'New EMI Load', 'Maximum Recommended'],
            datasets: [{
                label: 'EMI Amount (₹)',
                data: [
                    analysis.totalExpenses,
                    analysis.totalExpenses + analysis.estimatedEMI,
                    maxRecommendedEMI
                ],
                backgroundColor: [
                    '#28A745',
                    '#FFC107',
                    '#DC3545'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'EMI Affordability Analysis',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => '₹' + value.toLocaleString()
                    }
                }
            }
        }
    });
}