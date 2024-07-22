// Variável para contar o ID incremental
var idCount = 1;

// Função para validar o produto (converte para maiúsculas)
function validarProduto() {
    var produtoInput = document.getElementById('produto');
    produtoInput.value = produtoInput.value.toUpperCase().trim();
}

// Função para validar a quantidade (ajusta para 1 se for <= 0)
function validarQuantidade() {
    var qtdInput = document.getElementById('qtd');
    var qtdValue = parseInt(qtdInput.value);

    if (isNaN(qtdValue) || qtdValue <= 0) {
        qtdInput.value = '1';
    }
}

// Permitir somente números no campo de quantidade
function permitirSomenteNumeros(input) {
    input.value = input.value.replace(/[^0-9]/g, '');
}

// Função para validar o valor (ajusta para 1 se for <= 0)
function validarValor() {
    var valorInput = document.getElementById('valor');
    var valor = parseFloat(valorInput.value.replace(',', '.'));

    if (isNaN(valor) || valor <= 0) {
        valorInput.value = '1,00';
    } else {
        valorInput.value = valor.toFixed(2).replace('.', ',');
    }
}

// Função para validar e adicionar o item
function validarEAdicionarItem() {
    validarProduto();
    validarQuantidade();
    validarValor();

    var produto = document.getElementById('produto').value;
    var qtd = document.getElementById('qtd').value;
    var valor = document.getElementById('valor').value;

    if (!produto || !qtd || !valor) {
        alert('Por favor, preencha todos os campos antes de adicionar o produto.');
        return;
    }

    adicionarItem();
}

// Função para excluir um item
function excluirItem(id) {
    var item = document.getElementById('item-' + id);
    var modal = document.getElementById('modalExclusao');
    modal.style.display = 'block';

    document.getElementById('confirmarExclusao').onclick = function () {
        item.parentNode.removeChild(item);
        atualizarValorTotal();
        modal.style.display = 'none';
    };

    var closeBtn = document.getElementsByClassName('close')[0];
    closeBtn.onclick = function () {
        modal.style.display = 'none';
    };
}

// Função para adicionar um novo item
function adicionarItem() {
    var produto = document.getElementById('produto').value.trim();
    var qtd = parseInt(document.getElementById('qtd').value);
    var valor = parseFloat(document.getElementById('valor').value.replace(',', '.'));
    var valorTotalItem = valor * qtd; // Multiplica o valor pela quantidade

    var newItem = document.createElement('div');
    newItem.classList.add('item');
    newItem.id = 'item-' + idCount;

    var id = idCount++;
    newItem.innerHTML = `
        <p>${id}</p>
        <p>${produto}</p>
        <p>${qtd}x</p>
        <p>${valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        <p>${valorTotalItem.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p> <!-- Novo campo para valor total -->
        <button onclick="excluirItem(${id})">Excluir</button>
    `;

    document.getElementById('listaItens').appendChild(newItem);
    atualizarValorTotal();

    if (document.querySelectorAll('.item').length === 1) {
        document.getElementById('listaItens').parentNode.style.display = 'block';
    }

    limparCampos();
}

// Função para atualizar o valor total
function atualizarValorTotal() {
    var totalValor = 0;
    var items = document.querySelectorAll('.item');
    items.forEach(function (item) {
        var valorTotalItem = parseFloat(item.querySelector('p:nth-child(5)').textContent.replace(/[^\d,]/g, '').replace(',', '.'));
        totalValor += valorTotalItem;
    });
    document.getElementById('totalValor').textContent = totalValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para limpar os campos de entrada
function limparCampos() {
    document.getElementById('produto').value = '';
    document.getElementById('qtd').value = '';
    document.getElementById('valor').value = '';
    document.getElementById('produto').focus();
}

// Evento de tecla ao campo de valor para permitir adicionar item pressionando "Enter"
document.getElementById('valor').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        validarEAdicionarItem();
    }
});

// Evento de confirmação antes de recarregar a página
window.onbeforeunload = function () {
    return "Tem certeza que deseja sair desta página?";
};

// Função para enviar a lista de compras via WhatsApp
function enviarMensagemWhatsApp() {
    var itens = document.querySelectorAll('.item');

    if (itens.length === 0) {
        alert("Não há produtos na lista para enviar via WhatsApp.");
        return;
    }

    var mensagem = "Lista de Compras:\n";
    var total = 0;

    itens.forEach(function (item) {
        var produto = item.querySelector('p:nth-child(2)').textContent;
        var qtd = item.querySelector('p:nth-child(3)').textContent;
        var valorUnitario = item.querySelector('p:nth-child(4)').textContent;
        var valorTotalItem = item.querySelector('p:nth-child(5)').textContent;

        mensagem += `${produto} (${qtd}), ${valorTotalItem}\n`;
        total += parseFloat(valorTotalItem.replace(/[^\d,]/g, '').replace(',', '.'));
    });

    var valorTotalFormatado = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    mensagem += `\n*Total: ${valorTotalFormatado}*`;
    mensagem = encodeURIComponent(mensagem);
    window.open(`https://api.whatsapp.com/send?text=${mensagem}`);
}
