/* VARIÁVEIS QUE RECEBEM DATA E POPULA FORMULÁRIO */
var telefone = '';
var d = new Date();
dataHora = (d.toLocaleString());

/* CALCULO DE IDADE PARA VALIDAR SE É MENOR QUE 18 ANOS */
function calcular_idade(data) {
    var hoje = new Date();
    var array_data = data.split("/");

    if (array_data.length != 3) {
        return String(false);
    }

    /* COMPROVA SE ANO É VÁLIDO */
    var ano = parseInt(array_data[2]);
    if (isNaN(ano)) {
        return String(false);
    }

    /* COMPROVA SE MÊS É VÁLIDO */
    var mes = parseInt(array_data[1]);
    if (isNaN(mes)) {
        return String(false);
    }

    /* COMPROVA SE DIA É VÁLIDO */
    var dia = parseInt(array_data[0]);
    if (isNaN(dia)) {
        return String(false);
    }

    /* SUBTRAI OS ANOS DAS SUAS DATAS */
    idade = hoje.getFullYear() - ano - 1; //-1 PORQUE AINDA NAO COMPLETOU ANO

    /* SE FOR MAIOR QUE 0, COMPLETOU ANO */
    if (hoje.getMonth() + 1 - mes < 0) { //+ 1 porque os meses comecam em 0
        return String(idade);
    }
    if (hoje.getMonth() + 1 - mes > 0) {
        return String(idade + 1);
    }

    /* SE FOREM IGUAIS, VEJO O DIA */
    /* SE DER MENOR QUE 0, ENTÃO NÃO COMPLETOU ANO */
    if (hoje.getUTCDate() - dia >= 0) {
        return String(idade + 1);
    }

    return String(idade);
}

function focusForm() {
    $('#txt_nome').focus();
}

function dadosForm(dados) {
    /* SETANDO MENSAGENS DE ERRO DO FORM PARA INVISIVEL */
    $('.telefone_addContainer').remove();
    $('#msg_erroDataNascimento').addClass('invisivel');
    $('#msg_dataMenorIdade').addClass('invisivel');
    $('#msg_erroCpf').addClass('invisivel');
    $('#msg_erroRg').addClass('invisivel');

    /* DADOS DO FORM */
    $('#id_cadastro').val(dados.Id);
    $('#sel_uf').val(dados.Uf);
    $("#txt_nome").val(dados.Nome);
    $("#txt_rg").val(dados.Rg);
    $("#txt_cpf").val(dados.Cpf);
    $("#txt_telefone").val(dados.Telefone);
    $("#txt_dataNascimento").val(dados.DataNascimento);
    $("#txt_dataCadastro").val(dados.DataCadastro);
}

function criar_linha_grid(dados) {
    var ret =
        '<tr data-id=' + dados.Id + '>' +
        '<td>' + dados.Nome + '</td>' +
        '<td>' + dados.Rg + '</td>' +
        '<td>' + dados.Cpf + '</td>' +
        '<td>' + dados.Telefone + '</td>' +
        '<td>' + dados.DataNascimento + '</td>' +
        '<td>' + dados.DataCadastro + '</td>' +
        '<td>' +
        '<a class="btn btn-primary btn-alterar" role="button" style="margin-right: 3px">Alterar <i class="glyphicon glyphicon-pencil"></i></a>' +
        '<a class="btn btn-danger btn-excluir" role="button">Excluir <i class="glyphicon glyphicon-trash"></i></a>' +
        '</td>' +
        '</tr>';

    return ret;
}

/* EVENTO QUE VALIDA SE TAMANHO DO CPF É VÁLIDO */
$(document).on('blur', '#txt_cpf', function () {
    var qtd = $(this).val();
    if (qtd.length < 14) {
        $('#msg_erroCpf').removeClass('invisivel');
        $(this).val('');
    } else {
        $('#msg_erroCpf').addClass('invisivel');
    }
});

/* EVENTO QUE VALIDA SE TAMANHO DO RG É VÁLIDO */
$(document).on('blur', '#txt_rg', function () {
    var qtd = $(this).val();
    if (qtd.length < 11) {
        $('#msg_erroRg').removeClass('invisivel');
        $(this).val('');
    } else {
        $('#msg_erroRg').addClass('invisivel');
    }
});

/* EVENTO PARA VERIFICAR IDADE */
$(document).on('blur', '#txt_dataNascimento', function () {
    var data = $(this).val();
    var result = calcular_idade(data);
    var uf = $('#sel_uf').val();
    if (result != 'false') {
        if (result < 18 && uf == 1) {
            $('#msg_erroDataNascimento').addClass('invisivel');
            $('#msg_dataMenorIdade').removeClass('invisivel');
            $(this).val('');
        }
    } else {
        $('#msg_erroDataNascimento').removeClass('invisivel');
        $('#msg_dataMenorIdade').addClass('invisivel');
        $(this).val('');
    }
});

/* EVENTO PARA ADICIONAR DADOS */
$(document).on('click', '#btn_adicionar', function () {
    $('#btn_addTelefone').show();
    abrir_form({ Id: 0, Nome: '', Ativo: true });
});

/* EVENTO PARA ALTERAR DADOS */
$(document).on('click', '.btn-alterar', function () {
    $('#btn_addTelefone').hide();
    var btn = $(this),
        id = btn.closest('tr').attr('data-id'),
        url = urlAlterar,
        param = { 'id': id };

    $.post(url, forgeryToken(param), function (response) {
        if (response) {
            abrir_form(response);
        }
    });
});

/* EVENTO PARA SALVAR DADOS DO FORM VIA AJAX */
$(document).on('click', '#btn_salvar', function () {
    var telefone = '';
    $.each($('.telefone_content'), function () {
        if (this.value == $('.telefone_content').last().val()) {
            telefone += this.value;
        } else {
            telefone += this.value + ' / ';
        }
    })

    var btn = $(this),
        url = urlSalvar,
        param = {
            Id: $('#id_cadastro').val(),
            Uf: $('#sel_uf').val(),
            Nome: $('#txt_nome').val(),
            Rg: $("#txt_rg").val(),
            Cpf: $("#txt_cpf").val(),
            Telefone: telefone,
            DataNascimento: $("#txt_dataNascimento").val(),
            DataCadastro: dataHora
        };
    $.post(url, forgeryToken(param), function (response) {
        if (response.Result == "OK") {
            if (param.Id == 0) {
                param.Id = response.IdSalvo;
                var table = $('#grid_cadastro').find('tbody'),
                    linha = criar_linha_grid(param);
                table.append(linha);
                $('#grid_cadastro').removeClass('invisivel');
                $('#msg_gridNulo').addClass('invisivel');
            }
            else {
                var linha = $('#grid_cadastro').find('tr[data-id=' + param.Id + ']').find('td');
                linha
                    .eq(0).html(param.Nome).end()
                    .eq(1).html(param.Rg).end()
                    .eq(2).html(param.Cpf).end()
                    .eq(3).html(param.Telefone).end()
                    .eq(4).html(param.DataNascimento).end()
                    .eq(5).html(param.DataCadastro);
            }

            $('#modal_cadastro').parents('.bootbox').modal('hide');
        }

        else if (response.Result == "ERRO") {
            $('#msg_aviso').hide();
            $('#msg_mensagem_aviso').hide();
            $('#msg_erro').show();
        }

        else if (response.Result == "AVISO") {
            $('#msg_mensagem_aviso').html(formatar_mensagem_aviso(response.Mensagens));
            $('#msg_aviso').show();
            $('#msg_mensagem_aviso').show();
            $('#msg_erro').hide();
        }
    });
});

/* EVENTO PARA EXCLUIR DADOS VIA AJAX */
$(document).on('click', '.btn-excluir', function () {
    var btn = $(this),
        tr = btn.closest('tr'),
        id = tr.attr('data-id'),
        url = urlExcluir,
        param = { 'id': id };

    bootbox.confirm({
        message: "Você está prestes a excluir o cadastro de uma pessoa. Deseja confirmar?",
        buttons: {
            confirm: {
                label: 'Sim',
                className: 'btn-danger'
            },
            cancel: {
                label: 'Não',
                className: 'btn-primary'
            }
        },
        callback: function (result) {
            if (result) {
                $.post(url, forgeryToken(param), function (response) {
                    if (response) {
                        tr.remove();
                        var qtd = $('#grid_cadastro > tbody > tr').length;
                        if (qtd == 0) {
                            $('#grid_cadastro').addClass('invisivel');
                            $('#msg_gridNulo').removeClass('invisivel');
                        }
                    }
                })
            }
        }
    });
});

/* EVENTOS PARA PAGINAÇÃO */
$('.page-item').on('click', function () {
    var btn = $(this),
        tamPage = $('#dropdownQtdPage').val(),
        filtroNome = $('#filtro_nome'),
        filtroDataNascimento = $('#filtro_dataNascimento'),
        filtroDataCadastro = $('#filtro_dataCadastro'),
        page = btn.text(),
        url = urlPagination,
        param = {
            'page': page,
            'tamPage': tamPage,
            'filtroNome': filtroNome.val(),
            'filtroDataNascimento': filtroDataNascimento.val(),
            'filtroDataCadastro': filtroDataCadastro.val()
        };
    $.post(url, forgeryToken(param), function (response) {
        if (response) {
            var table = $('#grid_cadastro').find('tbody');
            table.empty();
            if (response.length > 0) {
                $('#grid_cadastro').removeClass('invisivel');
                $('#msg_gridNulo').addClass('invisivel');

                for (var i = 0; i < response.length; i++) {
                    table.append(criar_linha_grid(response[i]));
                }
            } else {
                $('#grid_cadastro').addClass('invisivel');
                $('#msg_gridNulo').removeClass('invisivel');
            }
            btn.siblings().removeClass('active');
            btn.addClass('active');
        }
    });
});

/* EVENTO PARA DEFINIR QUANTIDADE DE LINHAS DO GRIP DE ACORDO COM SELECT */
$('#dropdownQtdPage').on('change', function () {
    var dropdown = $(this),
        tamPage = dropdown.val(),
        filtroNome = $('#filtro_nome'),
        filtroDataNascimento = $('#filtro_dataNascimento'),
        filtroDataCadastro = $('#filtro_dataCadastro'),
        page = 1,
        url = urlQtdPagination,
        param = {
            'page': page,
            'tamPage': tamPage,
            'filtroNome': filtroNome.val(),
            'filtroDataNascimento': filtroDataNascimento.val(),
            'filtroDataCadastro': filtroDataCadastro.val()
        };
    $.post(url, forgeryToken(param), function (response) {
        if (response) {
            var table = $('#grid_cadastro').find('tbody');
            table.empty();
            if (response.length > 0) {
                $('#grid_cadastro').removeClass('invisivel');
                $('#msg_gridNulo').addClass('invisivel');

                for (var i = 0; i < response.length; i++) {
                    table.append(criar_linha_grid(response[i]));
                }
            } else {
                $('#grid_cadastro').addClass('invisivel');
                $('#msg_gridNulo').removeClass('invisivel');
            }
        }
    });
})

/* EVENTO PARA FILTRAR NOME DO GRID VIA AJAX */
$('#filtro_nome').on('keyup', function () {
    var filtroNome = $(this),
        tamPage = $('#dropdownQtdPage').val(),
        filtroDataNascimento = $('#filtro_dataNascimento'),
        filtroDataCadastro = $('#filtro_dataCadastro'),
        page = 1,
        url = urlFiltroNome,
        param = {
            'page': page,
            'tamPage': tamPage,
            'filtroNome': filtroNome.val(),
            'filtroDataNascimento': filtroDataNascimento.val(),
            'filtroDataCadastro': filtroDataCadastro.val()
        };
    $.post(url, forgeryToken(param), function (response) {
        if (response) {
            var table = $('#grid_cadastro').find('tbody');
            table.empty();
            if (response.length > 0) {
                $('#grid_cadastro').removeClass('invisivel');
                $('#msg_gridNulo').addClass('invisivel');

                for (var i = 0; i < response.length; i++) {
                    table.append(criar_linha_grid(response[i]));
                }
            } else {
                $('#grid_cadastro').addClass('invisivel');
                $('#msg_gridNulo').removeClass('invisivel');
            }
        }
    });
});

/* EVENTO PARA FILTRAR DATA DE NASCIMENTO DO GRID VIA AJAX */
$('#filtro_dataNascimento').on('keyup', function () {
    var filtroDataNascimento = $(this),
        tamPage = $('#dropdownQtdPage').val(),
        filtroNome = $('#filtro_nome'),
        filtroDataCadastro = $('#filtro_dataCadastro'),
        page = 1,
        url = urlFiltroDataNascimento,
        param = {
            'page': page,
            'tamPage': tamPage,
            'filtroNome': String(filtroNome.val()),
            'filtroDataNascimento': String(filtroDataNascimento.val()),
            'filtroDataCadastro': String(filtroDataCadastro.val())
        };
    //alert(String(param.filtroNome) + ' - ' + String(param.filtroDataNascimento) + ' - ' + param.filtroDataCadastro);
    $.post(url, forgeryToken(param), function (response) {
        if (response) {
            var table = $('#grid_cadastro').find('tbody');
            table.empty();
            if (response.length > 0) {
                $('#grid_cadastro').removeClass('invisivel');
                $('#msg_gridNulo').addClass('invisivel');

                for (var i = 0; i < response.length; i++) {
                    table.append(criar_linha_grid(response[i]));
                }
            } else {
                $('#grid_cadastro').addClass('invisivel');
                $('#msg_gridNulo').removeClass('invisivel');
            }
        }
    });
});

/* EVENTO PARA FILTRAR DATA DE CADASTRO DO GRID VIA AJAX */
$('#filtro_dataCadastro').on('keyup', function () {
    var filtroDataCadastro = $(this),
        filtroNome = $('#filtro_nome'),
        filtroDataNascimento = $('#filtro_dataNascimento'),
        tamPage = $('#dropdownQtdPage').val(),
        page = 1,
        url = urlFiltroDataCadastro,
        param = {
            'page': page,
            'tamPage': tamPage,
            'filtroNome': filtroNome.val(),
            'filtroDataNascimento': filtroDataNascimento.val(),
            'filtroDataCadastro': filtroDataCadastro.val()
        };
    $.post(url, forgeryToken(param), function (response) {
        if (response) {
            var table = $('#grid_cadastro').find('tbody');
            table.empty();
            if (response.length > 0) {
                $('#grid_cadastro').removeClass('invisivel');
                $('#msg_gridNulo').addClass('invisivel');

                for (var i = 0; i < response.length; i++) {
                    table.append(criar_linha_grid(response[i]));
                }
            } else {
                $('#grid_cadastro').addClass('invisivel');
                $('#msg_gridNulo').removeClass('invisivel');
            }
        }
    });
});


/* CRIAR TELEFONE ADICIONAL */
$(document).on('click', '#btn_addTelefone', function () {
    telefone = $('#telefone_container').after('<div class="form-group telefone_addContainer"><div class="col-md-3"></div><div class="col-md-6"><input class="form-control telefone_content"><div class="col-md-3"></div></div></div></div>');
    $('#telefone_container').after(telefone);
});

/* HABILITA/DESABILITA RG DE ACORDO COM ESTADO */
$(document).on('change', '#sel_uf', function () {
    var uf = $(this).val();
    if (uf == 1) {
        $('#field_rg').addClass('invisivel');
        $('#field_rg').removeAttr('required');
    } else {
        $('#field_rg').removeClass('invisivel');
        $('#field_rg').attr('required');
    }
})

$('#txt_cpf').mask('000.000.000-00');
$('#txt_rg').mask('000.000.000');
$('#txt_dataNascimento').mask('00/00/0000');
$('.telefone_content').mask('(00) 0000-0000');
$('#filtro_dataNascimento').mask('00/00/0000');
$('#filtro_dataCadastro').mask('00/00/0000');


$('#filtro_nome').attr('placeholder', 'Filtro Nome');
$('#filtro_dataNascimento').attr('placeholder', 'Filtro Data Nascimento');
$('#filtro_dataCadastro').attr('placeholder', 'Filtro Data Cadastro');