document.addEventListener('DOMContentLoaded', function() {
    let currentStep = 1;
    const totalSteps = 5;
    const progressBar = document.querySelector('.progress-bar');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    // Initialize the progress bar
    updateProgress();

    // Event listeners for navigation buttons
    nextBtn.addEventListener('click', handleNext);
    prevBtn.addEventListener('click', handlePrev);

    function handleNext() {
        if (currentStep < totalSteps) {
            if (validateCurrentStep()) {
                if (currentStep === 4) {
                    nextBtn.textContent = 'Calculate';
                }
                hideStep(currentStep);
                currentStep++;
                showStep(currentStep);
                updateProgress();
                
                if (currentStep === 5) {
                    calculateResults();
                    nextBtn.style.display = 'none';
                }
            }
        }
    }

    function handlePrev() {
        if (currentStep > 1) {
            hideStep(currentStep);
            currentStep--;
            showStep(currentStep);
            updateProgress();
            nextBtn.textContent = 'Next';
            nextBtn.style.display = 'block';
        }
    }

    function hideStep(step) {
        const currentStepElement = document.querySelector(`[data-step="${step}"]`);
        currentStepElement.classList.add('d-none');
    }

    function showStep(step) {
        const nextStepElement = document.querySelector(`[data-step="${step}"]`);
        nextStepElement.classList.remove('d-none');
        prevBtn.style.display = step === 1 ? 'none' : 'block';
    }

    function updateProgress() {
        const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
    }

    // Save form data to localStorage after each input change
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('change', () => {
            saveFormData();
        });
    });

    // Load saved form data on page load
    loadFormData();
});

function saveFormData() {
    const formData = {
        income: {
            salary: document.getElementById('salary').value,
            additionalIncome: document.getElementById('additionalIncome').value
        },
        expenses: {
            rent: document.getElementById('rent').value,
            utilities: document.getElementById('utilities').value,
            emis: document.getElementById('emis').value
        },
        purchase: {
            itemType: document.getElementById('itemType').value,
            itemCost: document.getElementById('itemCost').value,
            downPayment: document.getElementById('downPayment').value
        },
        principles: {
            emergencyFund: document.getElementById('emergencyFund').value,
            investmentRate: document.getElementById('investmentRate').value,
            emiLoad: document.getElementById('emiLoad').value
        }
    };
    localStorage.setItem('financialToolData', JSON.stringify(formData));
}

function loadFormData() {
    const savedData = localStorage.getItem('financialToolData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        // Populate income fields
        document.getElementById('salary').value = formData.income.salary;
        document.getElementById('additionalIncome').value = formData.income.additionalIncome;
        
        // Populate expense fields
        document.getElementById('rent').value = formData.expenses.rent;
        document.getElementById('utilities').value = formData.expenses.utilities;
        document.getElementById('emis').value = formData.expenses.emis;
        
        // Populate purchase fields
        document.getElementById('itemType').value = formData.purchase.itemType;
        document.getElementById('itemCost').value = formData.purchase.itemCost;
        document.getElementById('downPayment').value = formData.purchase.downPayment;
        
        // Populate principles fields
        document.getElementById('emergencyFund').value = formData.principles.emergencyFund;
        document.getElementById('investmentRate').value = formData.principles.investmentRate;
        document.getElementById('emiLoad').value = formData.principles.emiLoad;
    }
}
