$(document).ready(function() {

    function horasParaHHMM(horas) {
        // Separar a parte inteira das horas
        let horasCompletas = Math.floor(horas);
        // Calcular os minutos fracionados e arredondá-los
        let minutos = Math.round((horas - horasCompletas) * 60);
        // Formatar as horas e minutos em "hh:mm"
        let formatoHHMM = horasCompletas.toString().padStart(2, '0') + ':' + minutos.toString().padStart(2, '0');
        return formatoHHMM;
    }

    $('#campo-tempo-uso-horas-aparelho').on('input', function() {
        if ($(this).val().length > 2) {
            $(this).val($(this).val().slice(0, 2));
        }
    });

    $('#campo-tempo-uso-minutos-aparelho').on('input', function() {
        if ($(this).val().length > 2) {
            $(this).val($(this).val().slice(0, 2));
        }
    });

    $("#botao_cadastrar").click(function() {
        try {
            if (!$("#campo-nome-aparelho").val()) {
                throw "Favor Preencher o Nome do Aparelho!";
            }
            
            if (!$("#campo-potencia-aparelho").val()) {
                throw "Favor Preencher a Potência do Aparelho!";
            }
            
            if (!$("#campo-tempo-uso-horas-aparelho").val() && !$("#campo-tempo-uso-minutos-aparelho").val()) {
                throw "Favor Preencher o Tempo de uso do Aparelho (Horas e/ou Minutos)!";
            }
            if ($("#campo-tempo-uso-horas-aparelho").val() < 0 || $("#campo-tempo-uso-horas-aparelho").val() > 24) {
                throw "Favor Preencher o Campo 'Tempo de Uso por Dia (horas)' com um valor válido (entre 0 e 24)!";
            }

            let horas = $("#campo-tempo-uso-horas-aparelho").val() == "" ? "00" : $("#campo-tempo-uso-horas-aparelho").val().padStart(2, "0");
            let minutos = $("#campo-tempo-uso-minutos-aparelho").val() == "" ? "00" : $("#campo-tempo-uso-minutos-aparelho").val().padStart(2, "0");
            let horas_aux = ($("#campo-tempo-uso-horas-aparelho").val() == 0) ? "min" : "horas";

            if (horas == "01" || horas == "1") {
                horas_aux = "hora";
            }

            let valorKWH = 1.016800;
            let potenciaAparelho = parseFloat($("#campo-potencia-aparelho").val()) / 1000;
            let valorDiario = 0;
            let valorMensal = 0;
            let horasDeUso = $("#campo-tempo-uso-horas-aparelho").val() == "" ? 0 : parseInt($("#campo-tempo-uso-horas-aparelho").val());
            let minutosDeUso = $("#campo-tempo-uso-minutos-aparelho").val() == "" ? 0 : parseInt($("#campo-tempo-uso-minutos-aparelho").val());
            let tempoUsoDiario = horasDeUso + (minutosDeUso / 60);
            let tempoUsoMensal = tempoUsoDiario * 30;
            let UsoDiarioKWH = tempoUsoDiario * potenciaAparelho;
            let UsoMensalKWH = UsoDiarioKWH * 30;

            valorDiario = UsoDiarioKWH * valorKWH;
            valorMensal = UsoMensalKWH * valorKWH;

            let horasPorMes = horasParaHHMM(tempoUsoMensal);
            let horas_aux_mensal = tempoUsoMensal;
            
            if (tempoUsoMensal < 1) {
                horas_aux_mensal = "min";
            } else if (tempoUsoMensal < 2) {
                horas_aux_mensal = "hora";
            } else {
                horas_aux_mensal = "horas";
            }

            let aparelhos_cadastrados = $("#tabela-aparelhos-cadastrados").html();

            aparelhos_cadastrados += `<tr id="${$("#campo-nome-aparelho").val()}">`; // TO DO: VERIFICAR SE O ID JÁ EXISTE ANTES DE CRIAR (NÃO PODE REPETIR). POSSO CRIAR UM ARRAY DE ID'S E VERIFICAR
            aparelhos_cadastrados += `<td>${$("#campo-nome-aparelho").val()}</td>`;
            aparelhos_cadastrados += `<td>${$("#campo-potencia-aparelho").val()}</td>`;
            aparelhos_cadastrados += `<td>${horas}:${minutos} ${horas_aux}/dia</td>`;
            aparelhos_cadastrados += `<td>${UsoDiarioKWH.toFixed(2)}`;
            aparelhos_cadastrados += `<td>R$${valorDiario.toFixed(2)}/dia</td>`;
            aparelhos_cadastrados += `<td>${horasPorMes} ${horas_aux_mensal}/mês</td>`;
            aparelhos_cadastrados += `<td>${UsoMensalKWH.toFixed(2)}`;
            aparelhos_cadastrados += `<td>R$${valorMensal.toFixed(2)}/mês</td>`;
            aparelhos_cadastrados += `<td class="botao-tabela botao-editar"><i class="fa-solid fa-pen-to-square botao-editar"></i></td>`;
            aparelhos_cadastrados += `<td class="botao-tabela botao-excluir"><i class="fa-solid fa-trash botao-excluir"></i></td>`;
            aparelhos_cadastrados += `</tr>`;

            $("#tabela-aparelhos-cadastrados").html(aparelhos_cadastrados);
            $("#campo-nome-aparelho").val("");
            $("#campo-potencia-aparelho").val("");
            $("#campo-tempo-uso-horas-aparelho").val("");
            $("#campo-tempo-uso-minutos-aparelho").val("");
        } catch (err) {
            alert(err);
        }
    });


});