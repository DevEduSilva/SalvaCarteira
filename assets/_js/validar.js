function validarValor(event) {
    const input = event.target;
    // Remove qualquer caractere que não seja número, vírgula ou ponto
    input.value = input.value.replace(/[^0-9.,]/g, '');

    // Substitui vírgulas extras por apenas uma (para evitar múltiplas vírgulas)
    if (input.value.includes(',')) {
        const parts = input.value.split(',');
        input.value = parts[0] + ',' + parts.slice(1).join('').replace(/,/g, '');
    }

    // Garante que não tenha mais de um ponto
    if (input.value.includes('.')) {
        const parts = input.value.split('.');
        input.value = parts[0] + '.' + parts.slice(1).join('').replace(/\./g, '');
    }
}

function permitirApenasNumeros(event) {
    const tecla = event.key;

    // Permite números, teclas de controle essenciais e símbolos iniciais permitidos
    const teclasPermitidas = [
        'Backspace',
        'Delete',
        'ArrowLeft',
        'ArrowRight',
        'Tab'
    ];

    const input = event.target;
    const valorAtual = input.value;

    // Permite números diretamente ou teclas essenciais
    if (/^[0-9]$/.test(tecla) || teclasPermitidas.includes(tecla)) {
        return; // Permite a entrada
    }

    // Permite a primeira vírgula, se ainda não houver nenhuma
    if (tecla === ',' && !valorAtual.includes(',')) {
        return; // Permite a entrada
    }

    // Permite o primeiro ponto, se ainda não houver nenhum
    if (tecla === '.' && !valorAtual.includes('.')) {
        return; // Permite a entrada
    }

    // Bloqueia qualquer outra tecla não permitida
    event.preventDefault();
}

