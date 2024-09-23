function calcular() {
    // Captura os valores dos inputs
    const valorVenda = parseFloat(document.getElementById('valorVenda').value);
    const compra = parseFloat(document.getElementById('compra').value);
    const ipi = parseFloat(document.getElementById('ipi').value) || 0; // Tratamento para valor opcional
    const credICMS = parseFloat(document.getElementById('cred_icms').value) || 0;
    const fretePercent = parseFloat(document.getElementById('frete').value) || 0;
    const desconto = parseFloat(document.getElementById('desconto').value) || 0;

    // Validação de campos obrigatórios
    if (isNaN(valorVenda) || isNaN(compra)) {
        alert("Por favor, preencha os campos de Valor de Venda e Compra corretamente.");
        return;
    }

    // Cálculo do Preço de Compra com Desconto + IPI
    const precoCompra = compra * (1 - desconto / 100);

    // Recalcula a tabela e ajusta IPI e crédito ICMS
    const totalDivisaoTabela = calcularTabela();
    const precoCompraFinal = precoCompra * (1 + ipi / 100) - (totalDivisaoTabela / (1 + ipi / 100));
    
    // Cálculo do Crédito ICMS considerando o preço de compra com desconto
    const creditoICMS = (credICMS * precoCompra) / 100;

    // **ICMS fixo** (20,5% do preço de venda)
    const valorICMS = valorVenda * 20.5 / 100;

    // **PIS/COFINS fixo** (3,65% sobre (valorVenda - ICMS))
    const piscofins = (valorVenda - valorICMS) * 3.65 / 100;

    // Cálculo do Frete (percentual sobre o valor de compra SEM o IPI)
    const valorFrete = compra * (fretePercent / 100);

    // Cálculo do Custo Final
    let custoFinal = (((precoCompraFinal - creditoICMS) + valorICMS) + piscofins) + valorFrete;

    // Cálculo da Margem
    const margem = ((valorVenda - custoFinal) / valorVenda) * 100;

    // Exibe os resultados nos campos de saída
    document.getElementById('preco_compra').value = precoCompraFinal.toFixed(2);
    document.getElementById('cred_icms_result').value = creditoICMS.toFixed(2);
    document.getElementById('preco_venda').value = valorVenda.toFixed(2);
    document.getElementById('pis_cofins_result').value = piscofins.toFixed(2);
    document.getElementById('icms_result').value = valorICMS.toFixed(2);
    document.getElementById('custo_final').value = custoFinal.toFixed(2);
    document.getElementById('margem').value = margem.toFixed(2);
    document.getElementById('resultadoFrete').value = valorFrete.toFixed(2);
}

function calcularTabela() {
    const ipi = parseFloat(document.getElementById('ipi').value) / 100 || 0;
    const credICMS = parseFloat(document.getElementById('cred_icms').value) / 100 || 0;

    const rows = document.querySelectorAll('#tabelaDivisores tbody tr');
    let totalDivisaoIPI = 0;
    let totalDivisaoCredICMS = 0;
    let resultadoTotalTabela = 0; // Variável para o resultado total da tabela

    rows.forEach(row => {
        const valorDividir = parseFloat(row.querySelector('.valor-dividir').value);
        const resultadoIPICampo = row.querySelector('.resultado-ipi');
        const resultadoCredICMSCampo = row.querySelector('.resultado-cred-icms');

        if (!isNaN(valorDividir)) {
            // Dividir o valor pelo (1 + IPI)
            const resultadoIPI = valorDividir / (1 + ipi);
            resultadoIPICampo.value = resultadoIPI.toFixed(2);
            totalDivisaoIPI += resultadoIPI;

            const resultadoCredICMS = valorDividir * credICMS;
            resultadoCredICMSCampo.value = resultadoCredICMS.toFixed(2);
            totalDivisaoCredICMS += resultadoCredICMS;

            // Calcula o resultado total da tabela
            resultadoTotalTabela += (resultadoIPI + resultadoCredICMS);
        } else {
            resultadoIPICampo.value = '';
            resultadoCredICMSCampo.value = '';
        }
    });

    // Exibe os resultados totais da tabela
    document.getElementById('resultadoTabela').value = resultadoTotalTabela.toFixed(2);
    return resultadoTotalTabela; // Retorna o total para subtrair do custo final
}

// Adiciona eventos para recalcular quando a página carrega
document.addEventListener('DOMContentLoaded', calcular);
