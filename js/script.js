$(document).ready(function() {

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

            let horas = $("#campo-tempo-uso-horas-aparelho").val() == "" ? "00" : $("#campo-tempo-uso-horas-aparelho").val().padStart(2, "0");
            let minutos = $("#campo-tempo-uso-minutos-aparelho").val() == "" ? "00" : $("#campo-tempo-uso-minutos-aparelho").val().padStart(2, "0");
            let horas_aux = $("#campo-tempo-uso-horas-aparelho").val() == "" ? "min" : "hora(s)";

            let aparelhos_cadastrados = $("#tabela-aparelhos-cadastrados").html();

            aparelhos_cadastrados += `<tr>`;
            aparelhos_cadastrados += `<td>${$("#campo-nome-aparelho").val()}</td>`;
            aparelhos_cadastrados += `<td>${$("#campo-potencia-aparelho").val()}</td>`;
            aparelhos_cadastrados += `<td>${horas}:${minutos} ${horas_aux}/dia</td>`
            aparelhos_cadastrados += `<td class="botao-tabela"><i class="fa-solid fa-pen-to-square botao-editar"></i></td>`;
            aparelhos_cadastrados += `<td class="botao-tabela"><i class="fa-solid fa-trash botao-excluir"></i></td>`;
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