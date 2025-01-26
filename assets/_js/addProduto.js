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

// Função para alterar a quantidade usando os botões "+" e "-"
function alterarQuantidade(incremento) {
    const qtdInput = document.getElementById('qtd');
    let qtdAtual = parseInt(qtdInput.value) || 1;

    // Incrementa ou decrementa a quantidade
    qtdAtual += incremento;

    // Garante que a quantidade mínima seja 1
    if (qtdAtual < 1) {
        qtdAtual = 1;
    }

    // Atualiza o valor do input
    qtdInput.value = qtdAtual;
}

// Função para gerar o PDF
function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20; // Posição inicial para o texto

    // Obter a data atual no formato dd/mm/yyyy
    const dataHoje = new Date();
    const dia = String(dataHoje.getDate()).padStart(2, '0');
    const mes = String(dataHoje.getMonth() + 1).padStart(2, '0'); // Mes começa de 0
    const ano = dataHoje.getFullYear();
    const dataFormatada = `${dia}/${mes}/${ano}`;

    // Cabeçalho com fundo pastel suave e texto preto
    doc.setFillColor(234, 240, 249); // Fundo azul suave pastel
    doc.rect(0, 0, 210, 40, 'F'); // Fundo do cabeçalho
    doc.setTextColor(0, 0, 0); // Texto preto
    doc.setFontSize(28);
    doc.text('LISTA DE COMPRAS', 105, 25, { align: 'center' }); // Título
    y += 32;

    // Subtítulo com fonte maior e foco no design, agora incluindo a data de hoje
    doc.setFontSize(18);
    doc.setTextColor(0, 51, 102); // Azul suave
    doc.text(`Produtos da Lista - ${dataFormatada}`, 105, y, { align: 'center' });
    y += 10;

    // Linha de separação sutil (sem bordas muito grossas)
    doc.setDrawColor(0, 51, 102); // Azul suave
    doc.setLineWidth(0.5);
    doc.line(10, y, 200, y);
    y += 8;

    // Definição das colunas com fonte preta e padding pequeno
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Texto preto
    doc.text('Produto', 10, y);
    doc.text('Quantidade', 70, y);
    doc.text('Valor Unitário', 130, y);
    doc.text('Total', 170, y);
    y += 5;

    // Linha de separação entre categorias e dados
    doc.setDrawColor(0, 51, 102); // Azul suave
    doc.line(10, y, 200, y);
    y += 15;

    // Adiciona os itens com padding pequeno e fonte preta
    $('.item').each(function () {
        let produto = $(this).find('p:nth-child(2)').text();
        let qtd = $(this).find('p:nth-child(3)').text();
        let valorUnitario = $(this).find('p:nth-child(4)').text();
        let valorTotalItem = $(this).find('p:nth-child(5)').text();

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Texto preto

        // Adicionando o texto de cada item com padding pequeno
        doc.text(produto, 10, y);
        doc.text(qtd, 70, y);
        doc.text(valorUnitario, 130, y);
        doc.text(valorTotalItem, 170, y);

        y += 10;

        // Verifica se ultrapassou o limite da página, se sim, cria uma nova página
        if (y > 275) {
            doc.addPage(); // Adiciona uma nova página
            y = 10; // Reseta a posição
        }
    });

    // Cálculo do total geral com fonte preta
    let total = 0;
    $('.item').each(function () {
        let valorTotalItem = $(this).find('p:nth-child(5)').text();
        total += parseFloat(valorTotalItem.replace(/[^\d,]/g, '').replace(',', '.'));
    });

    // Total Geral com fonte em azul suave
    y += 15;
    doc.setFontSize(18);
    doc.setTextColor(0, 51, 102); // Azul suave
    doc.text(`Total Geral: ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 10, y);

    // Linha de finalização em azul suave
    y += 10;
    doc.setDrawColor(0, 51, 102); // Azul suave
    doc.line(10, y, 200, y);

    // Rodapé simples e delicado
    y += 15;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Cinza suave
    doc.text('Feito por WebDevSilva', 105, y, { align: 'center' });

    // Salva o PDF com um nome simples e suave
    doc.save('lista_de_compras_atrativa.pdf');
}

