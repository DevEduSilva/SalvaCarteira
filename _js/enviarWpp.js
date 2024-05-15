function enviarMensagemWhatsApp() {
    // Obtém os itens da lista
    var itens = document.querySelectorAll('.item');

    // Verifica se há produtos na lista
    if (itens.length === 0) {
        alert("Não há produtos na lista para enviar via WhatsApp.");
        return;
    }

    // Inicializa a mensagem com um texto introdutório
    var mensagem = "Lista de Compras:\n";

    // Inicializa o valor total
    var total = 0;

    // Percorre cada item e adiciona à mensagem
    itens.forEach(function (item) {
        var produto = item.querySelector('p:nth-child(2)').textContent;
        var valor = item.querySelector('p:nth-child(4)').textContent;

        // Adiciona o produto e seu valor à mensagem
        mensagem += produto + ", " + valor + "\n";

        // Atualiza o valor total
        total += parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.'));
    });

    // Formata o valor total no formato desejado
    var valorTotalFormatado = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Formata a mensagem para incluir o valor total
    mensagem += "\n*Total: " + valorTotalFormatado + "*";

    // Formata a mensagem para que possa ser enviada via WhatsApp
    mensagem = encodeURIComponent(mensagem);

    // Abre o WhatsApp com a mensagem pré-preenchida
    window.open("https://api.whatsapp.com/send?text=" + mensagem);
}
