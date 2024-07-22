function validarValor(event) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9,.]/g, '');
}