// Variável para contar os IDs existentes
var idCount = 1;

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

    // Verifica se o arquivo é JSON
    if (arquivo && arquivo.type === "application/json") {
        const leitor = new FileReader();

        leitor.onload = function (e) {
            try {
                // Tenta parsear o conteúdo do arquivo como JSON
                const dados = JSON.parse(e.target.result);
                // Se o parse for bem-sucedido, chama a função para processar os dados
                importarLista(dados);
            } catch (erro) {
                alert("Erro ao processar o arquivo. O arquivo não é um JSON válido.");
            }
        };

        leitor.readAsText(arquivo); // Lê o arquivo como texto
    } else {
        alert("O arquivo selecionado não é um arquivo JSON válido.");
    }
});

// Função para processar e adicionar os dados da lista
function importarLista(dados) {
    contarIdsExistentes(); // Atualiza o idCount com o maior ID existente

    dados.produtos.forEach(item => {
        const produto = item["nome"];
        const qtd = item["quantidade"];
        const valorUnitario = item["valor_unitario"];
        const valorTotal = qtd * valorUnitario;

        // Verificando se todos os campos estão presentes
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

            // Mostrar a lista de itens, total após o primeiro item ser adicionado
            if ($('.item').length === 1) {
                $('#listaItens').show();
                $('#total').show();
            }
        }
    });

    // Atualiza visibilidade do botão importar-lista
    atualizarBotaoImportarLista();

    alert("Lista importada com sucesso!");
}

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
        }

        // Atualiza visibilidade do botão importar-lista após exclusão
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

    // Mostrar a lista de itens e total após o primeiro item ser adicionado
    if ($('.item').length === 1) {
        $('#listaItens').show();
        $('#total').show();
    }

    // Atualiza visibilidade do botão importar-lista após adicionar item
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
}

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
    var btnWpp = $('#enviar-wpp'); // Selecionando o botão de enviar WhatsApp

    // Mostrar o botão de importar lista se não houver itens, senão esconder
    if ($('.item').length === 0) {
        btnList.show();
    } else {
        btnList.hide();
    }

    // Garantir que o botão de enviar WhatsApp sempre fique visível
    btnWpp.show();
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

    // Função para formatar a data
    const formatarData = (data) => {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês começa de 0
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    // Definindo os dados da data e título
    const dataHoje = new Date();
    const dataFormatada = formatarData(dataHoje);

    // Cabeçalho com fundo suave e texto preto
    doc.setFillColor(234, 240, 249); // Fundo azul suave pastel
    doc.rect(0, 0, 210, 40, 'F'); // Fundo do cabeçalho
    doc.setTextColor(0, 51, 102); // Texto azul suave
    doc.setFontSize(28);
    doc.text('LISTA DE COMPRAS', 105, 25, { align: 'center' }); // Título
    y += 32;

    // Subtítulo com a data formatada
    doc.setFontSize(18);
    doc.setTextColor(50, 50, 50); // Cinza suave
    doc.text(`${dataFormatada}`, 105, y, { align: 'center' });
    y += 12;

    // Linha de separação suave
    doc.setDrawColor(0, 51, 102); // Cor da linha
    doc.line(10, y, 200, y); // Linha de separação
    y += 8;

    // Cabeçalho da tabela (sem o ID) com um fundo suave
    const colunas = ["Produto", "Quantidade", "Preço Unitário", "Total"];
    const colX = [10, 60, 120, 160];

    doc.setFillColor(220, 220, 220); // Fundo do cabeçalho
    doc.rect(10, y - 4, 190, 8, 'F'); // Fundo das células do cabeçalho
    doc.setTextColor(0, 51, 102); // Texto azul suave
    doc.setFontSize(14);
    colunas.forEach((coluna, i) => {
        doc.text(coluna, colX[i], y);
    });
    y += 12;

    // Preenchendo os dados dos produtos na tabela
    $('.item').each(function () {
        const dados = [
            $(this).find('p:nth-child(2)').text(), // Produto
            $(this).find('p:nth-child(3)').text(), // Quantidade
            $(this).find('p:nth-child(4)').text(), // Preço Unitário
            $(this).find('p:nth-child(5)').text()  // Total
        ];

        dados.forEach((dado, i) => {
            doc.text(dado, colX[i], y);
        });

        y += 10;
    });

    // Calculando o valor total
    let totalValor = 0;
    $('.item').each(function () {
        const valorTotalItem = parseFloat($(this).find('p:nth-child(5)').text().replace(/[^\d,]/g, '').replace(',', '.'));
        totalValor += valorTotalItem;
    });

    // Adicionando o total ao PDF com estilo suave
    y += 15;
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 102); // Azul suave
    doc.text(`Valor Total: ${totalValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 10, y);

    // Rodapé com texto suave
    y += 15;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150); // Cinza suave
    doc.text('Gerado por Lista de Compras', 105, y, { align: 'center' });

    // Gerar o arquivo PDF
    doc.save(`Lista_de_Compras_${dataFormatada}.pdf`);
}


