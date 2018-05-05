/* VALIDAÇÃO ANTI FORGERY TOKEN */
function forgeryToken(data) {
    data.__RequestVerificationToken = $('[name=__RequestVerificationToken]').val();
    return data;
}

/* FUNÇÃO QUE FORMATA MENSAGENS DE ERRO E AVISOS DO FORM */
function formatar_mensagem_aviso(mensagens) {
    var res = '';

    for (var i = 0; i < mensagens.length; i++) {
        res += '<li>' + mensagens[i] + '</li>'
    }

    return '<ul>' + res + '</ul>';
}

function abrir_form(dados) {
    dadosForm(dados);

    var modal_cadastro = $('#modal_cadastro');

    $('#msg_mensagem_aviso').empty();
    $('#msg_aviso').hide();
    $('#msg_mensagem_aviso').hide();
    $('#msg_erro').hide();

    bootbox.dialog({
        title: titulo,
        message: modal_cadastro
    })
        .on('shown.bs.modal', function () {
            modal_cadastro.show(0, function () {
                focusForm();
                
            });
        })
        .on('hidden.bs.modal', function () {
            modal_cadastro.hide().appendTo('body');
        });
}