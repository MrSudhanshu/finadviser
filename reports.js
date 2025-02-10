// Function to initialize all charts and data when the page loads
function initializeReports() {
    const financialData = getFinancialData();
    if (!financialData) {
        showNoDataMessage();
        return;
    }

    const analysis = analyzeFinancialData(financialData);

    renderIncomeAnalysis(financialData, analysis);
    renderExpenseAnalysis(financialData, analysis);
    renderHealthIndicators(financialData, analysis);
    renderPurchaseAnalysis(financialData, analysis);
    renderRecommendations(financialData, analysis);
    renderProjections(financialData, analysis);
}

// Analyze financial data
function analyzeFinancialData(data) {
    const totalIncome = data.income.salary + data.income.additionalIncome;
    const totalExpenses = data.expenses.rent + data.expenses.utilities + data.expenses.emis;
    const disposableIncome = totalIncome - totalExpenses;
    const savingsRate = ((disposableIncome / totalIncome) * 100).toFixed(1);

    return {
        totalIncome,
        totalExpenses,
        disposableIncome,
        savingsRate,
        expenseRatio: ((totalExpenses / totalIncome) * 100).toFixed(1),
        emiRatio: ((data.expenses.emis / totalIncome) * 100).toFixed(1)
    };
}

// Get financial data from localStorage
function getFinancialData() {
    const savedData = localStorage.getItem('financialToolData');
    return savedData ? JSON.parse(savedData) : null;
}

// Show message when no data is available
function showNoDataMessage() {
    document.querySelector('.card-body').innerHTML = `
        <div class="alert alert-warning">
            <h4 class="alert-heading">No Financial Data Available</h4>
            <p>Please complete a financial assessment first to view detailed reports.</p>
            <hr>
            <a href="/assessment" class="btn btn-primary">Start New Assessment</a>
        </div>
    `;
}

// Render Income Analysis
function renderIncomeAnalysis(data, analysis) {
    const incomeBreakdown = document.getElementById('incomeBreakdown');

    incomeBreakdown.innerHTML = `
        <div class="list-group">
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-0">Primary Income</h6>
                    <small class="text-muted">Monthly Salary</small>
                </div>
                <strong>₹${data.income.salary.toLocaleString()}</strong>
            </div>
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-0">Additional Income</h6>
                    <small class="text-muted">Other Sources</small>
                </div>
                <strong>₹${data.income.additionalIncome.toLocaleString()}</strong>
            </div>
            <div class="list-group-item d-flex justify-content-between align-items-center bg-light">
                <div>
                    <h6 class="mb-0">Total Monthly Income</h6>
                </div>
                <strong>₹${analysis.totalIncome.toLocaleString()}</strong>
            </div>
        </div>
    `;

    const ctx = document.getElementById('incomeChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Primary Income', 'Additional Income'],
            datasets: [{
                data: [data.income.salary, data.income.additionalIncome],
                backgroundColor: ['#007ACC', '#28A745']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Income Distribution'
                }
            }
        }
    });
}

// Render Expense Analysis
function renderExpenseAnalysis(data, analysis) {
    const expenseBreakdown = document.getElementById('expenseBreakdown');

    expenseBreakdown.innerHTML = `
        <div class="list-group">
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-0">Housing</h6>
                    <small class="text-muted">Rent/Mortgage</small>
                </div>
                <strong>₹${data.expenses.rent.toLocaleString()}</strong>
            </div>
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-0">Utilities</h6>
                    <small class="text-muted">Bills & Services</small>
                </div>
                <strong>₹${data.expenses.utilities.toLocaleString()}</strong>
            </div>
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-0">Current EMIs</h6>
                    <small class="text-muted">Existing Loans</small>
                </div>
                <strong>₹${data.expenses.emis.toLocaleString()}</strong>
            </div>
            <div class="list-group-item d-flex justify-content-between align-items-center bg-light">
                <div>
                    <h6 class="mb-0">Total Monthly Expenses</h6>
                </div>
                <strong>₹${analysis.totalExpenses.toLocaleString()}</strong>
            </div>
        </div>
    `;

    const ctx = document.getElementById('expensePieChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Housing', 'Utilities', 'EMIs'],
            datasets: [{
                data: [data.expenses.rent, data.expenses.utilities, data.expenses.emis],
                backgroundColor: ['#DC3545', '#FFC107', '#17A2B8']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Expense Distribution'
                }
            }
        }
    });
}

// Render Health Indicators
function renderHealthIndicators(data, analysis) {
    const healthIndicators = document.getElementById('healthIndicators');

    const getHealthStatus = (value, type) => {
        if (type === 'expense') {
            if (value < 50) return 'text-success';
            if (value < 70) return 'text-warning';
            return 'text-danger';
        }
        if (type === 'savings') {
            if (value > 30) return 'text-success';
            if (value > 15) return 'text-warning';
            return 'text-danger';
        }
    };

    healthIndicators.innerHTML = `
        <div class="list-group">
            <div class="list-group-item">
                <h6 class="d-flex justify-content-between">
                    <span>Expense Ratio</span>
                    <span class="${getHealthStatus(analysis.expenseRatio, 'expense')}">${analysis.expenseRatio}%</span>
                </h6>
                <div class="progress">
                    <div class="progress-bar ${getHealthStatus(analysis.expenseRatio, 'expense')}" style="width: ${analysis.expenseRatio}%"></div>
                </div>
            </div>
            <div class="list-group-item">
                <h6 class="d-flex justify-content-between">
                    <span>EMI Load</span>
                    <span class="${getHealthStatus(analysis.emiRatio, 'expense')}">${analysis.emiRatio}%</span>
                </h6>
                <div class="progress">
                    <div class="progress-bar ${getHealthStatus(analysis.emiRatio, 'expense')}" style="width: ${analysis.emiRatio}%"></div>
                </div>
            </div>
            <div class="list-group-item">
                <h6 class="d-flex justify-content-between">
                    <span>Savings Rate</span>
                    <span class="${getHealthStatus(analysis.savingsRate, 'savings')}">${analysis.savingsRate}%</span>
                </h6>
                <div class="progress">
                    <div class="progress-bar ${getHealthStatus(analysis.savingsRate, 'savings')}" style="width: ${analysis.savingsRate}%"></div>
                </div>
            </div>
        </div>
    `;

    const ctx = document.getElementById('healthRadarChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Income', 'Expenses', 'EMI Load', 'Savings', 'Emergency Fund'],
            datasets: [{
                label: 'Financial Health Score',
                data: [
                    100 - analysis.expenseRatio,
                    100 - (analysis.totalExpenses / analysis.totalIncome * 100),
                    100 - analysis.emiRatio,
                    analysis.savingsRate,
                    data.principles.emergencyFund === 'yes' ? 100 : 0
                ],
                backgroundColor: 'rgba(0, 122, 204, 0.2)',
                borderColor: '#007ACC',
                pointBackgroundColor: '#007ACC'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Render Purchase Analysis
function renderPurchaseAnalysis(data, analysis) {
    const purchaseAnalysis = document.getElementById('purchaseAnalysis');
    const loanAmount = data.purchase.itemCost - data.purchase.downPayment;
    const estimatedEMI = calculateEstimatedEMI(loanAmount);

    purchaseAnalysis.innerHTML = `
        <div class="list-group">
            <div class="list-group-item">
                <h6 class="mb-2">Purchase Details</h6>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span>Item Type</span>
                    <strong class="text-capitalize">${data.purchase.itemType}</strong>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span>Total Cost</span>
                    <strong>₹${data.purchase.itemCost.toLocaleString()}</strong>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <span>Down Payment</span>
                    <strong>₹${data.purchase.downPayment.toLocaleString()}</strong>
                </div>
            </div>
            <div class="list-group-item">
                <h6 class="mb-2">Loan Analysis</h6>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span>Loan Amount</span>
                    <strong>₹${loanAmount.toLocaleString()}</strong>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <span>Estimated EMI</span>
                    <strong>₹${estimatedEMI.toLocaleString()}/month</strong>
                </div>
            </div>
        </div>
    `;
}

// Calculate estimated EMI
function calculateEstimatedEMI(loanAmount) {
    const interestRate = 10; // 10% per annum
    const tenureMonths = 36; // 3 years
    const monthlyRate = interestRate / 12 / 100;

    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) /
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    return Math.round(emi);
}

// Render Recommendations
function renderRecommendations(data, analysis) {
    const recommendations = document.getElementById('recommendations');
    const savingsTarget = analysis.totalIncome * 0.3;
    const emergencyFundTarget = analysis.totalExpenses * 6;

    recommendations.innerHTML = `
        <div class="list-group">
            <div class="list-group-item">
                <h6><i class="bi bi-piggy-bank text-primary"></i> Savings Goal</h6>
                <p>Aim to save ₹${savingsTarget.toLocaleString()} monthly (30% of income)</p>
                <div class="progress">
                    <div class="progress-bar" style="width: ${Math.min(100, (analysis.disposableIncome/savingsTarget) * 100)}%"></div>
                </div>
            </div>
            <div class="list-group-item">
                <h6><i class="bi bi-shield-check text-success"></i> Emergency Fund</h6>
                <p>Target: ₹${emergencyFundTarget.toLocaleString()} (6 months of expenses)</p>
                ${data.principles.emergencyFund === 'yes' ? 
                    '<div class="alert alert-success mb-0">You have achieved this goal!</div>' :
                    '<div class="alert alert-warning mb-0">Priority: Build your emergency fund</div>'}
            </div>
            <div class="list-group-item">
                <h6><i class="bi bi-graph-up text-warning"></i> Investment Strategy</h6>
                ${data.principles.investmentRate === 'yes' ?
                    '<p class="text-success">You are on track with your investment goals</p>' :
                    `<p>Consider investing ₹${(analysis.totalIncome * 0.3).toLocaleString()} monthly in:</p>
                     <ul>
                         <li>Mutual Funds</li>
                         <li>Fixed Deposits</li>
                         <li>Government Securities</li>
                     </ul>`}
            </div>
        </div>
    `;
}

// Render Future Projections
function renderProjections(data, analysis) {
    const projections = document.getElementById('projections');
    const monthlyInvestment = analysis.disposableIncome * 0.5;
    const years = 5;
    const projectedAmount = calculateInvestmentGrowth(monthlyInvestment, years);

    projections.innerHTML = `
        <div class="list-group">
            <div class="list-group-item">
                <h6>5-Year Investment Projection</h6>
                <p>If you invest ₹${monthlyInvestment.toLocaleString()} monthly:</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span>Projected Value</span>
                    <strong>₹${projectedAmount.toLocaleString()}</strong>
                </div>
            </div>
            <div class="list-group-item">
                <h6>Recommended Actions</h6>
                <ul class="list-unstyled mb-0">
                    <li><i class="bi bi-check-circle-fill text-success"></i> Start SIP investments</li>
                    <li><i class="bi bi-check-circle-fill text-success"></i> Review portfolio quarterly</li>
                    <li><i class="bi bi-check-circle-fill text-success"></i> Increase investment with income growth</li>
                </ul>
            </div>
        </div>
    `;

    const ctx = document.getElementById('projectionsChart').getContext('2d');
    const monthlyLabels = Array.from({length: years * 12 + 1}, (_, i) => i);
    const projectedValues = monthlyLabels.map(month => 
        calculateInvestmentGrowth(monthlyInvestment, month/12));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthlyLabels,
            datasets: [{
                label: 'Projected Growth',
                data: projectedValues,
                borderColor: '#007ACC',
                fill: true,
                backgroundColor: 'rgba(0, 122, 204, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '5-Year Investment Projection'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => '₹' + value.toLocaleString()
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Months'
                    }
                }
            }
        }
    });
}

// Calculate investment growth
function calculateInvestmentGrowth(monthlyInvestment, years) {
    const annualRate = 0.12; // 12% annual return
    const monthlyRate = annualRate / 12;
    const months = years * 12;

    const amount = monthlyInvestment * 
                  ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
                  (1 + monthlyRate);

    return Math.round(amount);
}

// Initialize reports when the page loads
document.addEventListener('DOMContentLoaded', initializeReports);

function downloadReport() {
    var divContent = document.getElementById("main-report").innerHTML;
    var originalContent = document.body.innerHTML;
    document.body.innerHTML = divContent;
    document.getElementById("downloadReportBtn").style.display = "none";
    window.print();
    document.getElementById("downloadReportBtn").style.display = "block";
    document.body.innerHTML = originalContent; // Restore original content
    location.reload(); // Reload page to avoid any UI issues
}