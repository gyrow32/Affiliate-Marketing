const loanAmountInput = document.getElementById('loan-amount');
const loanTermInput = document.getElementById('loan-term');
const interestRateInput = document.getElementById('interest-rate');
const extraPaymentInput = document.getElementById('optional-payment');
const reducedTermInput = document.getElementById('reduced-term');
const totalInterestInput = document.getElementById('total-interest-paid');
const paymentTableBody = document.querySelector('#payment-schedule tbody');

const paymentForm = document.getElementById('payment-form');
paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const loanAmount = parseFloat(loanAmountInput.value);
    const loanTerm = parseFloat(loanTermInput.value);
    const interestRate = parseFloat(interestRateInput.value) / 1200;
    const extraPayment = parseFloat(extraPaymentInput.value) || 0;

    const {paymentSchedule, reducedTerm, totalInterest} = calculatePayments(loanAmount, loanTerm, interestRate, extraPayment);

    updateTable(paymentSchedule);
    reducedTermInput.value = reducedTerm;
    totalInterestInput.value = totalInterest.toFixed(2);
});

function calculatePayments(loanAmount, loanTerm, interestRate, extraPayment) {
    const totalPayments = loanTerm;
    const paymentAmount = (loanAmount * interestRate) / (1 - Math.pow((1 + interestRate), -totalPayments));

    let loanBalance = loanAmount;
    let paymentSchedule = [];
    let paymentCount = 0;
    let totalInterest = 0;

    for (let i = 1; i <= totalPayments && loanBalance > 0; i++) {
        const interestPaid = loanBalance * interestRate;
        let principalPaid = paymentAmount - interestPaid;
        let actualExtraPayment = extraPayment;

        if (loanBalance - principalPaid - actualExtraPayment < 0) {
            actualExtraPayment = Math.max(0, loanBalance - principalPaid);
            principalPaid = loanBalance - actualExtraPayment;
        }

        loanBalance -= (principalPaid + actualExtraPayment);
        paymentCount++;
        totalInterest += interestPaid;

        paymentSchedule.push({
            month: i,
            totalPayment: principalPaid + interestPaid,
            interestPaid,
            principalPaid,
            loanBalance,
            extraPayment: actualExtraPayment
        });
    }

    return {paymentSchedule, reducedTerm: paymentCount, totalInterest};
}

function updateTable(paymentSchedule) {
    paymentTableBody.innerHTML = paymentSchedule.map(payment => `
        <tr>
            <td>${payment.month}</td>
            <td>$${payment.totalPayment.toFixed(2)}</td>
            <td>$${payment.interestPaid.toFixed(2)}</td>
            <td>$${payment.principalPaid.toFixed(2)}</td>
            <td>$${payment.loanBalance.toFixed(2)}</td>
            <td>$${payment.extraPayment.toFixed(2)}</td>
        </tr>
    `).join('');
}
