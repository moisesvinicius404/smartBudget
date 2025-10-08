// ====== MODEL ======
class Transaction {
  constructor(description, value, type) {
    this.description = description;
    this.value = Number(value);
    this.type = type; // "entrada" ou "saida"
    this.date = new Date().toLocaleDateString('pt-BR');
  }
}

class TransactionModel {
  constructor() {
    this.transactions = [];
  }

  add(transaction) {
    this.transactions.push(transaction);
  }

  getAll() {
    return this.transactions;
  }

  getBalance() {
    return this.transactions.reduce((total, t) => {
      return t.type === "entrada" ? total + t.value : total - t.value;
    }, 0);
  }
}

// ====== VIEW ======
class TransactionView {
  constructor() {
    this.listElement = document.getElementById('transactionList');
    this.balanceElement = document.getElementById('balance');
  }

  render(transactions, balance) {
    // Atualiza saldo
    this.balanceElement.textContent = `R$ ${balance.toFixed(2)}`;
    this.balanceElement.className =
      balance >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold';

    // Renderiza tabela
    this.listElement.innerHTML = '';
    transactions.forEach(t => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2">${t.description}</td>
        <td class="p-2 ${t.type === 'entrada' ? 'text-green-600' : 'text-red-600'}">
          R$ ${t.value.toFixed(2)}
        </td>
        <td class="p-2 capitalize">${t.type}</td>
      `;
      this.listElement.appendChild(row);
    });
  }

  clearForm() {
    document.getElementById('desc').value = '';
    document.getElementById('value').value = '';
    document.getElementById('type').value = 'entrada';
  }
}

// ====== CONTROLLER ======
class TransactionController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Pega o formulário e adiciona evento
    this.form = document.getElementById('transactionForm');
    this.form.addEventListener('submit', (e) => this.handleAddTransaction(e));

    // Render inicial
    this.updateView();
  }

  handleAddTransaction(event) {
    event.preventDefault();

    const desc = document.getElementById('desc').value.trim();
    const value = parseFloat(document.getElementById('value').value);
    const type = document.getElementById('type').value;

    // Validação simples
    if (!desc || isNaN(value) || value <= 0) {
      alert('Preencha a descrição e valor corretamente.');
      return;
    }

    // Cria transação
    const transaction = new Transaction(desc, value, type);
    this.model.add(transaction);

    // Atualiza tela
    this.updateView();

    // Limpa o formulário
    this.view.clearForm();
  }

  updateView() {
    const all = this.model.getAll();
    const balance = this.model.getBalance();
    this.view.render(all, balance);
  }
}

// ====== INICIALIZAÇÃO ======
document.addEventListener('DOMContentLoaded', () => {
  const app = new TransactionController(
    new TransactionModel(),
    new TransactionView()
  );
});
