// Toggle expansão
document.getElementById('toggleBtn').addEventListener('click', function () {
    const conteudo = document.getElementById('conteudoFlutuante');
    if (conteudo.style.display === 'none') {
        conteudo.style.display = 'block';
        this.textContent = '−'; // muda para ícone de fechar
    } else {
        conteudo.style.display = 'none';
        this.textContent = '+'; // volta para ícone de expandir
    }
});