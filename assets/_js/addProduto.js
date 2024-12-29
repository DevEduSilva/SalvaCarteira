// Variável para contar o ID incremental
var idCount = 1;

// Função para validar o produto (converte para maiúsculas)
function validarProduto() {
    var produtoInput = $('#produto');
    produtoInput.val(produtoInput.val().toUpperCase().trim());
}

// Função para validar a quantidade (ajusta para 1 se for <= 0)
function validarQuantidade() {
    var qtdInput = $('#qtd');
    var qtdValue = parseInt(qtdInput.val());

    if (isNaN(qtdValue) || qtdValue <= 0) {
        qtdInput.val('1');
    }
}

// Permitir somente números no campo de quantidade
function permitirSomenteNumeros(input) {
    input.value = input.value.replace(/[^0-9]/g, '');
}

// Função para validar o valor (ajusta para 1 se for <= 0)
function validarValor() {
    var valorInput = $('#valor');
    var valor = parseFloat(valorInput.val().replace(',', '.'));

    if (isNaN(valor) || valor <= 0) {
        valorInput.val('1,00');
    } else {
        valorInput.val(valor.toFixed(2).replace('.', ','));
    }
}

// Função para validar e adicionar o item
function validarEAdicionarItem() {
    validarProduto();
    validarQuantidade();
    validarValor();

    var produto = $('#produto').val();
    var qtd = $('#qtd').val();
    var valor = $('#valor').val();

    if (!produto || !qtd || !valor) {
        alert('Por favor, preencha todos os campos antes de adicionar o produto.');
        return;
    }

    adicionarItem();
}

// Função para excluir um item
function excluirItem(id) {
    var item = $('#item-' + id);
    var modal = $('#modalExclusao');
    modal.show();

    $('#confirmarExclusao').click(function () {
        item.remove();
        atualizarValorTotal();

        // Verificar se ainda existem itens na lista
        if ($('.item').length === 0) {
            $('#listaItens').hide();
            $('#total').hide();
            $('.enviar-whatsapp').hide();
        }

        modal.hide();
    });

    $('.close').click(function () {
        modal.hide();
    });
}

// Função para adicionar um novo item
function adicionarItem() {
    var produto = $('#produto').val().trim();
    var qtd = parseInt($('#qtd').val());
    var valor = parseFloat($('#valor').val().replace(',', '.'));
    var valorTotalItem = valor * qtd;

    var newItem = $('<div>').addClass('item').attr('id', 'item-' + idCount);
    var id = idCount++;

    newItem.html(`
        <p>${id}</p>
        <p>${produto}</p>
        <p>${qtd}x</p>
        <p>${valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        <p>${valorTotalItem.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        <button class="excluirBtn" onclick="excluirItem(${id})">
            <span class="material-icons">delete</span>
        </button>
    `);

    $('#listaItens').append(newItem);
    atualizarValorTotal();

    // Mostrar a lista de itens, total e botão de WhatsApp após o primeiro item ser adicionado
    if ($('.item').length === 1) {
        $('#listaItens').show();
        $('#total').show();
        $('.enviar-whatsapp').show();
    }

    limparCampos();
}

// Função para atualizar o valor total
function atualizarValorTotal() {
    var totalValor = 0;
    $('.item').each(function () {
        var valorTotalItem = parseFloat($(this).find('p:nth-child(5)').text().replace(/[^\d,]/g, '').replace(',', '.'));
        totalValor += valorTotalItem;
    });
    $('#totalValor').text(totalValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
}

// Função para limpar os campos de entrada
function limparCampos() {
    $('#produto').val('');
    $('#qtd').val('');
    $('#valor').val('');
    $('#produto').focus();
}

// Evento de tecla ao campo de valor para permitir adicionar item pressionando "Enter"
$('#valor').keypress(function (event) {
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
    var itens = $('.item');

    if (itens.length === 0) {
        alert("Não há produtos na lista para enviar via WhatsApp.");
        return;
    }

    var mensagem = "Lista de Compras:\n";
    var total = 0;

    itens.each(function () {
        var produto = $(this).find('p:nth-child(2)').text();
        var qtd = $(this).find('p:nth-child(3)').text();
        var valorUnitario = $(this).find('p:nth-child(4)').text();
        var valorTotalItem = $(this).find('p:nth-child(5)').text();

        mensagem += `${produto}(${qtd} x ${valorUnitario}) - ${valorTotalItem}\n`;
        total += parseFloat(valorTotalItem.replace(/[^\d,]/g, '').replace(',', '.'));
    });

    var valorTotalFormatado = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    mensagem += `\n*Total: ${valorTotalFormatado}*`;
    mensagem = encodeURIComponent(mensagem);
    window.open(`https://api.whatsapp.com/send?text=${mensagem}`);
}
