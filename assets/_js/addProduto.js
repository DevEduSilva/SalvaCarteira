// Variável para contar os IDs existentes
var idCount = 1;
var valorMaximo = 0;
var valorTotalCompra = 0; // Variável global para controlar o total

// Função para contar os IDs existentes
function contarIdsExistentes() {
    var idsExistentes = $('.item').map(function () {
        return parseInt($(this).find('p:first').text(), 10); // Pega o primeiro <p> que é o ID
    }).get();

    if (idsExistentes.length > 0) {
        idCount = Math.max(...idsExistentes) + 1; // Define o próximo ID como o maior + 1
    }
}

// Função para abrir o seletor de arquivos
function abrirArquivo() {
    document.getElementById('inputArquivo').click();
}

// Event Listener para importar o arquivo JSON
document.getElementById('inputArquivo').addEventListener('change', function (event) {
    const arquivo = event.target.files[0];

    if (arquivo && arquivo.type === "application/json") {
        const leitor = new FileReader();
        leitor.onload = function (e) {
            try {
                const dados = JSON.parse(e.target.result);
                importarLista(dados);
            } catch (erro) {
                alert("Erro ao processar o arquivo. O arquivo não é um JSON válido.");
            }
        };
        leitor.readAsText(arquivo);
    } else {
        alert("O arquivo selecionado não é um arquivo JSON válido.");
    }
});

// Função para processar e adicionar os dados da lista
function importarLista(dados) {
    contarIdsExistentes();

    dados.produtos.forEach(item => {
        const produto = item["nome"];
        const qtd = item["quantidade"];
        const valorUnitario = item["valor_unitario"];
        const valorTotal = qtd * valorUnitario;

        if (produto && !isNaN(qtd) && !isNaN(valorUnitario) && !isNaN(valorTotal)) {
            var newItem = $('<div>').addClass('item').attr('id', 'item-' + idCount);
            var id = idCount++;

            newItem.html(`
                <p>${id}</p>
                <p>${produto}</p>
                <p>${qtd}x</p>
                <p>${valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                <p>${valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                <button class="excluirBtn" onclick="excluirItem(${id})">
                    <span class="material-icons">delete</span>
                </button>
            `);

            $('#listaItens').append(newItem);
            atualizarValorTotal();

            if ($('.item').length === 1) {
                $('#listaItens').show();
                $('#total').show();
            }
        }
    });

    atualizarBotaoImportarLista();
    alert("Lista importada com sucesso!");
}

// Função para validar o produto
function validarProduto() {
    var produtoInput = $('#produto');
    produtoInput.val(produtoInput.val().toUpperCase().trim());
}

// Função para validar a quantidade
function validarQuantidade() {
    var qtdInput = $('#qtd');
    var qtdValue = parseInt(qtdInput.val());
    if (isNaN(qtdValue) || qtdValue <= 0) qtdInput.val('1');
}

// Permitir somente números no campo de quantidade
function permitirSomenteNumeros(input) {
    input.value = input.value.replace(/[^0-9]/g, '');
}

// Função para validar o valor
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
        if ($('.item').length === 0) {
            $('#listaItens').hide();
            $('#total').hide();
        }
        atualizarBotaoImportarLista();
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

    if ($('.item').length === 1) {
        $('#listaItens').show();
        $('#total').show();
    }

    atualizarBotaoImportarLista();
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
    $('#valorTotalFlutuante').text(totalValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));

    valorTotalCompra = totalValor; // Atualiza variável global
    atualizarValorRestante();
}

// Função para atualizar o valor restante
function atualizarValorRestante() {
    const restante = valorMaximo - valorTotalCompra;
    const elemento = $('#valorRestante');

    if (restante >= 0) {
        elemento.text(restante.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
        elemento.css('color', '#333'); // cor padrão
    } else {
        elemento.text(restante.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
        elemento.css('color', 'red'); // saldo negativo
    }
}

// Função para confirmar valor máximo e ocultar input
function confirmarValorMax() {
    const input = $('#valorMax');
    valorMaximo = parseFloat(input.val().replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    input.parent().hide();
    $('#editarValorBtn').show();
    atualizarValorRestante();
}

// Função para reabrir input de valor máximo
function editarValorMax() {
    $('#valorMaxContainer').show();
    $('#editarValorBtn').hide();
    $('#valorMax').focus();
}

// Confirma valor máximo ao clicar fora do input (funciona no mobile)
$('#valorMax').on('blur', function () {
    if ($(this).val().trim() !== '') {
        confirmarValorMax();
    }
});

// Função para limpar os campos de entrada
function limparCampos() {
    $('#produto').val('');
    $('#qtd').val('');
    $('#valor').val('');
    $('#produto').focus();
}

// Função para atualizar a visibilidade do botão importar-lista
function atualizarBotaoImportarLista() {
    var btnList = $('#importar-lista');
    var btnWpp = $('#enviar-wpp');
    if ($('.item').length === 0) {
        btnList.show();
    } else {
        btnList.hide();
    }
    btnWpp.show();
}

// Evento de tecla ao campo de valor para permitir adicionar item pressionando "Enter"
$('#valor').keypress(function (event) {
    if (event.key === 'Enter') validarEAdicionarItem();
});

// Função para alterar a quantidade usando os botões "+" e "-"
function alterarQuantidade(incremento) {
    const qtdInput = document.getElementById('qtd');
    let qtdAtual = parseInt(qtdInput.value) || 1;
    qtdAtual += incremento;
    if (qtdAtual < 1) qtdAtual = 1;
    qtdInput.value = qtdAtual;
}

// Função para gerar o PDF
function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;

    const formatarData = (data) => {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    const dataHoje = new Date();
    const dataFormatada = formatarData(dataHoje);

    doc.setFillColor(234, 240, 249);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(0, 51, 102);
    doc.setFontSize(28);
    doc.text('LISTA DE COMPRAS', 105, 25, { align: 'center' });
    y += 32;

    doc.setFontSize(18);
    doc.setTextColor(50, 50, 50);
    doc.text(`${dataFormatada}`, 105, y, { align: 'center' });
    y += 12;

    doc.setDrawColor(0, 51, 102);
    doc.line(10, y, 200, y);
    y += 8;

    const colunas = ["Produto", "Quantidade", "Preço Unitário", "Total"];
    const colX = [10, 60, 120, 160];

    doc.setFillColor(220, 220, 220);
    doc.rect(10, y - 4, 190, 8, 'F');
    doc.setTextColor(0, 51, 102);
    doc.setFontSize(14);
    colunas.forEach((coluna, i) => doc.text(coluna, colX[i], y));
    y += 12;

    $('.item').each(function () {
        const dados = [
            $(this).find('p:nth-child(2)').text(),
            $(this).find('p:nth-child(3)').text(),
            $(this).find('p:nth-child(4)').text(),
            $(this).find('p:nth-child(5)').text()
        ];
        dados.forEach((dado, i) => doc.text(dado, colX[i], y));
        y += 10;
    });

    let totalValor = 0;
    $('.item').each(function () {
        const valorTotalItem = parseFloat($(this).find('p:nth-child(5)').text().replace(/[^\d,]/g, '').replace(',', '.'));
        totalValor += valorTotalItem;
    });

    y += 15;
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 102);
    doc.text(`Valor Total: ${totalValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 10, y);

    y += 15;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Gerado por Lista de Compras', 105, y, { align: 'center' });

    doc.save(`Lista_de_Compras_${dataFormatada}.pdf`);
}
