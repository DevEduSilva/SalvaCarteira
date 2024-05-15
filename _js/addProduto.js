var idCount = 1; // Variável para contar o ID incremental

// Função para validar o produto (converte para maiúsculas)
function validarProduto() {
    var produtoInput = document.getElementById('produto');
    produtoInput.value = produtoInput.value.toUpperCase();
}

// Função para validar a quantidade (ajusta para 1 se for <= 0)
function validarQuantidade() {
    var qtdInput = document.getElementById('qtd');
    var qtdValue = parseInt(qtdInput.value);

    if (isNaN(qtdValue) || qtdValue <= 0) {
        qtdInput.value = '1';
    }
}

// Função para validar o valor (ajusta para 1 se for <= 0)
function validarValor() {
    var valorInput = document.getElementById('valor');
    var valor = parseFloat(valorInput.value.replace(',', '.'));

    if (isNaN(valor) || valor <= 0) {
        valorInput.value = '1';
    }
}

// Função para validar e adicionar o item
function validarEAdicionarItem() {
    // Executa as validações
    validarProduto();
    validarQuantidade();
    validarValor();

    // Obtém os valores dos campos
    var produto = document.getElementById('produto').value;
    var qtd = document.getElementById('qtd').value;
    var valor = document.getElementById('valor').value;

    // Se todos os campos estiverem preenchidos, chama a função adicionarItem()
    if (produto.trim() === '' || qtd.trim() === '' || valor.trim() === '') {
        alert('Por favor, preencha todos os campos antes de adicionar o produto.');
        return;
    }

    // Se todos os campos estiverem preenchidos e validados, chama a função adicionarItem()
    adicionarItem();
}

// Função para excluir um item
function excluirItem(id) {
    // Obtém o elemento do item pelo ID
    var item = document.getElementById('item-' + id);

    // Exibe o modal de confirmação
    var modal = document.getElementById('modalExclusao');
    modal.style.display = 'block';

    // Define ação para o botão "Confirmar"
    document.getElementById('confirmarExclusao').onclick = function () {
        // Remove o item da lista
        item.parentNode.removeChild(item);

        // Atualiza o valor total
        var valorItem = parseFloat(item.querySelector('p:nth-child(4)').textContent.replace(/[^\d,]/g, '').replace(',', '.'));
        var qtdItem = parseInt(item.querySelector('p:nth-child(3)').textContent);
        var totalValor = parseFloat(document.getElementById('totalValor').textContent.replace(/[^\d,]/g, '').replace(',', '.'));
        totalValor -= valorItem * qtdItem;
        document.getElementById('totalValor').textContent = totalValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Fecha o modal
        modal.style.display = 'none';
    };

    // Define ação para o botão "Fechar" do modal
    var closeBtn = document.getElementsByClassName('close')[0];
    closeBtn.onclick = function () {
        modal.style.display = 'none';
    };
}

// Função para adicionar um novo item
function adicionarItem() {
    // Obtém os valores dos campos
    var produto = document.getElementById('produto').value.trim();
    var qtd = parseInt(document.getElementById('qtd').value);
    var valorInput = document.getElementById('valor');
    var valor = parseFloat(valorInput.value.replace(/[^\d,]/g, '').replace(',', '.'));

    // Cria um novo elemento div para o item
    var newItem = document.createElement('div');
    newItem.classList.add('item');
    newItem.id = 'item-' + idCount; // Define um ID para o item

    // Adiciona o ID incremental ao novo item
    var id = idCount;
    idCount++; // Incrementa o contador de ID

    // Monta o HTML do novo item
    newItem.innerHTML = '<p>' + id + '</p><p>' + produto + '</p><p>' + qtd + 'x</p><p>' + valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + '</p><button onclick="excluirItem(' + id + ')">Excluir</button>';

    // Adiciona o novo item à lista de itens
    document.getElementById('listaItens').appendChild(newItem);

    // Atualiza o valor total
    var totalValor = parseFloat(document.getElementById('totalValor').textContent.replace(/[^\d,]/g, '').replace(',', '.'));
    totalValor += valor * qtd;
    document.getElementById('totalValor').textContent = totalValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Verifica se a lista de itens está vazia para exibir a seção
    if (document.querySelectorAll('.item').length === 1) {
        document.getElementById('listaItens').parentNode.style.display = 'block';
    }

    // Limpa os campos de entrada
    document.getElementById('produto').value = '';
    document.getElementById('qtd').value = '';
    document.getElementById('valor').value = '';

    // Define o foco de volta no campo de entrada do produto
    document.getElementById('produto').focus();
}

// Adicionando evento de tecla ao campo de valor para permitir adicionar item pressionando "Enter"
document.getElementById('valor').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        validarEAdicionarItem();
    }
});

// Adiciona um evento de confirmação antes de recarregar a página
window.onbeforeunload = function () {
    return "Tem certeza que deseja sair desta página?";
};
