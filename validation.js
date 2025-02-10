function validateCurrentStep() {
    const currentStepElement = document.querySelector(`.step:not(.d-none)`);
    const stepNumber = currentStepElement.dataset.step;
    
    switch(stepNumber) {
        case '1':
            return validateIncomeStep();
        case '2':
            return validateExpenseStep();
        case '3':
            return validatePurchaseStep();
        case '4':
            return validatePrinciplesStep();
        default:
            return true;
    }
}

function validateIncomeStep() {
    const salary = document.getElementById('salary').value;
    const additionalIncome = document.getElementById('additionalIncome').value;

    if (!salary || salary <= 0) {
        alert('Please enter a valid monthly salary');
        return false;
    }

    if (additionalIncome && additionalIncome < 0) {
        alert('Additional income cannot be negative');
        return false;
    }

    return true;
}

function validateExpenseStep() {
    const rent = document.getElementById('rent').value;
    const utilities = document.getElementById('utilities').value;
    const emis = document.getElementById('emis').value;

    if (!rent || rent < 0) {
        alert('Please enter a valid rent amount');
        return false;
    }

    if (!utilities || utilities < 0) {
        alert('Please enter a valid utilities amount');
        return false;
    }

    if (!emis || emis < 0) {
        alert('Please enter a valid EMI amount');
        return false;
    }

    return true;
}

function validatePurchaseStep() {
    const itemType = document.getElementById('itemType').value;
    const itemCost = document.getElementById('itemCost').value;
    const downPayment = document.getElementById('downPayment').value;

    if (!itemType) {
        alert('Please select an item type');
        return false;
    }

    if (!itemCost || itemCost <= 0) {
        alert('Please enter a valid item cost');
        return false;
    }

    if (downPayment && (downPayment < 0 || downPayment > itemCost)) {
        alert('Down payment cannot be negative or greater than item cost');
        return false;
    }

    return true;
}

function validatePrinciplesStep() {
    const emergencyFund = document.getElementById('emergencyFund').value;
    const investmentRate = document.getElementById('investmentRate').value;
    const emiLoad = document.getElementById('emiLoad').value;

    if (!emergencyFund || !investmentRate || !emiLoad) {
        alert('Please answer all questions');
        return false;
    }

    return true;
}

function sanitizeInput(input) {
    return parseFloat(input.replace(/[^0-9.-]+/g, ''));
}
