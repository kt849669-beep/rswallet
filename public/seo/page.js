const amount = document.getElementById('amount');
const result = document.getElementById('result');
function calculate() {
  const number = Number(amount.value);
  result.textContent = amount.value === '' || !Number.isFinite(number) || number < 0 || number > 1000000000 ? 'Enter a valid amount' : new Intl.NumberFormat('en-IN', {style:'currency', currency:'INR'}).format(number * 109.5);
}
amount.addEventListener('input', calculate);
document.querySelectorAll('[data-amount]').forEach(button => button.addEventListener('click', () => { amount.value = button.dataset.amount; calculate(); }));
