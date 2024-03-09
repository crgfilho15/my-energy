$(document).ready(function() {

    var custoMensalPorAparelho = [];
    var listAparelhosCadastrados = [];
    var id = -1;
    var idSelecionado;

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
            let diasNoMes = 30;
            let potenciaAparelho = parseFloat($("#campo-potencia-aparelho").val()) / 1000;
            let valorDiario = 0;
            let valorMensal = 0;
            let horasDeUso = $("#campo-tempo-uso-horas-aparelho").val() == "" ? 0 : parseInt($("#campo-tempo-uso-horas-aparelho").val());
            let minutosDeUso = $("#campo-tempo-uso-minutos-aparelho").val() == "" ? 0 : parseInt($("#campo-tempo-uso-minutos-aparelho").val());
            let tempoUsoDiario = horasDeUso + (minutosDeUso / 60);
            let tempoUsoMensal = tempoUsoDiario * diasNoMes;
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
            
            if ($("#botao_cadastrar").text() == "Cadastrar") {
                id++;
                
                let novoAparelho = {
                    id: id,
                    nome: $("#campo-nome-aparelho").val(),
                    potencia: $("#campo-potencia-aparelho").val(),
                    tempoUsoDiario: `${horas}:${minutos} ${horas_aux}`,
                    usoDiarioKWH: UsoDiarioKWH.toFixed(2),
                    valorDiario: valorDiario.toFixed(2),
                    tempoUsoMensal: `${horasPorMes} ${horas_aux_mensal}`,
                    usoMensalKWH: UsoMensalKWH.toFixed(2),
                    valorMensal: valorMensal.toFixed(2)
                };
            
                listAparelhosCadastrados.unshift(novoAparelho);
                
                // console.log(listAparelhosCadastrados);

            } else if ($("#botao_cadastrar").text() == "Editar"){

                let idLinha = idSelecionado;

                let objetoEncontrado = listAparelhosCadastrados.find(objeto => objeto.id == idLinha);

                objetoEncontrado.nome = $("#campo-nome-aparelho").val();
                objetoEncontrado.potencia = $("#campo-potencia-aparelho").val();
                objetoEncontrado.tempoUsoDiario = `${horas}:${minutos} ${horas_aux}`;
                objetoEncontrado.usoDiarioKWH = UsoDiarioKWH.toFixed(2);
                objetoEncontrado.valorDiario = `${valorDiario.toFixed(2)}`;
                objetoEncontrado.tempoUsoMensal = `${horasPorMes} ${horas_aux_mensal}`;
                objetoEncontrado.usoMensalKWH = UsoMensalKWH.toFixed(2);
                objetoEncontrado.valorMensal = `${valorMensal.toFixed(2)}`;
            }

            atualizarTabelaEValor();
            
            $("#campo-nome-aparelho").val("");
            $("#campo-potencia-aparelho").val("");
            $("#campo-tempo-uso-horas-aparelho").val("");
            $("#campo-tempo-uso-minutos-aparelho").val("");
            $("#botao_cadastrar").text("Cadastrar");
        } catch (err) {
            alert(err);
        }
    });

    $(document).on("click", ".botao-editar", function() {
        let idRegistro = $(this).closest("tr").attr("id");
        let linha = $(this).closest("tr");
        let informacoes = [];
        linha.find("td").each(function() {
            informacoes.push($(this).text());
        });

        let horas = informacoes[2].slice(0, 2);
        horas = parseInt(horas);
        let minutos = informacoes[2].slice(3, 5);
        minutos = parseInt(minutos);

        idSelecionado = idRegistro;

        $("#campo-nome-aparelho").val(informacoes[0]);
        $("#campo-potencia-aparelho").val(informacoes[1]);
        $("#campo-tempo-uso-horas-aparelho").val(horas);
        $("#campo-tempo-uso-minutos-aparelho").val(minutos);
        
        $("#botao_cadastrar").text("Editar");
    });

    $(document).on("click", ".botao-excluir", function() {
        let idRegistro = $(this).closest("tr").attr("id");

        let indexParaExcluir = listAparelhosCadastrados.findIndex(objeto => objeto.id == idRegistro);

        if (indexParaExcluir !== -1) {
            listAparelhosCadastrados.splice(indexParaExcluir, 1);
        }

        atualizarTabelaEValor();
        
    });

    function atualizarTabelaEValor() {
        let aparelhos_cadastrados = '';
            listAparelhosCadastrados.forEach(aparelho => {
                aparelhos_cadastrados += `<tr id="${aparelho.id}">`;
                aparelhos_cadastrados += `<td>${aparelho.nome}</td>`;
                aparelhos_cadastrados += `<td>${aparelho.potencia}</td>`;
                aparelhos_cadastrados += `<td>${aparelho.tempoUsoDiario}/dia</td>`;
                aparelhos_cadastrados += `<td>${aparelho.usoDiarioKWH}</td>`;
                aparelhos_cadastrados += `<td>R$${aparelho.valorDiario}/dia</td>`;
                aparelhos_cadastrados += `<td>${aparelho.tempoUsoMensal}/mês</td>`;
                aparelhos_cadastrados += `<td>${aparelho.usoMensalKWH}</td>`;
                aparelhos_cadastrados += `<td>R$${aparelho.valorMensal}/mês</td>`;
                aparelhos_cadastrados += `<td class="botao-tabela botao-editar"><i class="fa-solid fa-pen-to-square"></i></td>`;
                aparelhos_cadastrados += `<td class="botao-tabela botao-excluir"><i class="fa-solid fa-trash"></i></td>`;
                aparelhos_cadastrados += `</tr>`;
            });

            let valorTotal = 0;
            listAparelhosCadastrados.forEach(aparelho => {
                valorTotal += parseFloat(aparelho.valorMensal);
            });
            
            const percentualIluminacaoPublica = 0.05941397141;
            let valorluminacaoPublica = percentualIluminacaoPublica * valorTotal;
            valorluminacaoPublica = parseFloat(valorluminacaoPublica.toFixed(2));
            
            $("#iluminacao-publica").text(`R$${valorluminacaoPublica}`);
            $("#total-tabela").text(`R$${valorTotal.toFixed(2)}`);
            
            valorTotal += valorluminacaoPublica;
            
            $(".valor-final").text(`R$${valorTotal.toFixed(2)}`);
            
            $("#tabela-aparelhos-cadastrados").html(aparelhos_cadastrados);
    }

});