function calculateResults() {
    const financialData = getFinancialData();
    const analysis = analyzeFinancialSituation(financialData);
    displayResults(analysis);
    updateCharts(financialData, analysis);
}

function getFinancialData() {
    return {
        income: {
            salary: parseFloat(document.getElementById('salary').value) || 0,
            additionalIncome: parseFloat(document.getElementById('additionalIncome').value) || 0
        },
        expenses: {
            rent: parseFloat(document.getElementById('rent').value) || 0,
            utilities: parseFloat(document.getElementById('utilities').value) || 0,
            emis: parseFloat(document.getElementById('emis').value) || 0
        },
        purchase: {
            itemType: document.getElementById('itemType').value,
            itemCost: parseFloat(document.getElementById('itemCost').value) || 0,
            downPayment: parseFloat(document.getElementById('downPayment').value) || 0
        },
        principles: {
            emergencyFund: document.getElementById('emergencyFund').value === 'yes',
            investmentRate: document.getElementById('investmentRate').value === 'yes',
            emiLoad: document.getElementById('emiLoad').value === 'yes'
        }
    };
}

function analyzeFinancialSituation(data) {
    const totalIncome = data.income.salary + data.income.additionalIncome;
    const totalExpenses = data.expenses.rent + data.expenses.utilities + data.expenses.emis;
    const disposableIncome = totalIncome - totalExpenses;
    
    // Calculate estimated EMI for the purchase
    const loanAmount = data.purchase.itemCost - data.purchase.downPayment;
    const estimatedEMI = calculateEstimatedEMI(loanAmount);
    
    // Calculate financial ratios
    const expenseRatio = (totalExpenses / totalIncome) * 100;
    const newEMIRatio = ((data.expenses.emis + estimatedEMI) / totalIncome) * 100;
    
    // Decision factors based on Warikoo's principles
    const decisions = {
        hasEmergencyFund: data.principles.emergencyFund,
        hasAdequateInvestments: data.principles.investmentRate,
        hasManageableEMI: data.principles.emiLoad,
        canAffordEMI: newEMIRatio <= 50,
        hasDisposableIncome: disposableIncome > estimatedEMI
    };
    
    // Generate recommendation
    const recommendation = generateRecommendation(decisions, newEMIRatio, data.purchase.itemType);
    
    return {
        totalIncome,
        totalExpenses,
        disposableIncome,
        estimatedEMI,
        expenseRatio,
        newEMIRatio,
        decisions,
        recommendation
    };
}

function calculateEstimatedEMI(loanAmount) {
    // Assuming 10% interest rate and 3-year tenure for calculation
    const interestRate = 10;
    const tenureMonths = 36;
    const monthlyRate = interestRate / 12 / 100;
    
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) /
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    
    return Math.round(emi);
}

function generateRecommendation(decisions, newEMIRatio, itemType) {
    let status = 'negative';
    let message = '';
    
    if (!decisions.hasEmergencyFund) {
        message = "Build your emergency fund first before making this purchase.";
    } else if (!decisions.hasAdequateInvestments) {
        message = "Focus on increasing your investments before considering this purchase.";
    } else if (!decisions.hasManageableEMI) {
        message = "Your current EMI burden is too high. Clear some existing debts first.";
    } else if (!decisions.canAffordEMI) {
        message = `The new EMI would take ${newEMIRatio.toFixed(1)}% of your income, which is too high.`;
    } else if (decisions.hasDisposableIncome) {
        status = 'positive';
        message = `You can afford this ${itemType}. Your financial situation looks healthy.`;
    } else {
        status = 'warning';
        message = "While you might be able to afford this, it would stretch your finances thin.";
    }
    
    return { status, message };
}

function displayResults(analysis) {
    const resultsSummary = document.getElementById('resultsSummary');
    const recommendation = analysis.recommendation;

    const recommendationClass = {
        positive: 'result-positive',
        warning: 'result-warning',
        negative: 'result-negative'
    }[recommendation.status];

    resultsSummary.innerHTML = `
        <div class="result-card ${recommendationClass}">
            <h5 class="mb-3">Recommendation</h5>
            <p class="mb-0">${recommendation.message}</p>
        </div>
        <div class="row mt-4">
            <div class="col-md-6">
                <h5>Financial Summary</h5>
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Total Monthly Income</span>
                        <span>₹${analysis.totalIncome.toLocaleString()}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Total Monthly Expenses</span>
                        <span>₹${analysis.totalExpenses.toLocaleString()}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Disposable Income</span>
                        <span>₹${analysis.disposableIncome.toLocaleString()}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Estimated New EMI</span>
                        <span>₹${analysis.estimatedEMI.toLocaleString()}</span>
                    </li>
                </ul>
                <div class="mt-4">
                    <a href="reports.html" class="btn btn-primary">
                        <i class="bi bi-file-earmark-text"></i> View Detailed Report
                    </a>
                </div>
            </div>
        </div>
    `;
}

function updateCharts(financialData, analysis) {
    //Add Chart update logic here.  This function is not defined in the original code, so it's assumed to exist elsewhere.
}