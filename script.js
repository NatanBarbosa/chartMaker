class Porcentagem{
    constructor(nome, cor, porcent){
        this.nome = nome
        this.cor = cor
        this.porcent = porcent
    }
}

//instância da classe bd que vai mexer com localStorage
let bd = new BD()

//Array que vai conter os objetos retirados de localStorage
let porcentagem
function getPorcentagem() {
    //função para poder atualizar o array temporário em relação ao localStorage
    porcentagem = bd.select()
}
getPorcentagem()

function recebeValores(){
    let nome = document.getElementById('nome').value
    let cor = document.getElementById('cor').value
    let porcent = Number(document.getElementById('porcent').value)

    if(validaValores(nome, cor, porcent)){
        //se for retornado true, ele coloca o gráfico

        //colocar novo objeto na ultima posição do array
        porcentagem.push(new Porcentagem(nome, cor, porcent))

        //adicionar objeto ao localStorage
        bd.insert(new Porcentagem(nome, cor, porcent))

        //esconder modal
        $('#confirm').modal('hide')

        //limpar modal
        document.getElementById('nome').value = ''
        document.getElementById('cor').value = ''
        document.getElementById('porcent').value = ''

        colocaGrafico()
    }
}

function validaValores(nome, cor, porcent, editar = false){
    //Validando dados
    let adicionar = true

    //Verificando se a soma das porcentagens atingiu 100
    let max = 0
    for(let i in porcentagem){
        max += porcentagem[i].porcent
    }

    //validar valores
    if(nome.length === 0|| cor == '' || porcent==0 || porcent==''){
        alert('[ERRO!] preencha todos os dados')
        adicionar = false
    } else if(porcent > 100 || porcent < 0){
        alert('[ERRO!] Digite valores percentuais de 0 a 100')
        adicionar = false
    } else if(max + porcent > 100){
        alert('[ERRO!]A porcentagem total já atingiu 100% \n Tente excluir algum registro ou limpar a tabela')
        adicionar = false
    }

    //validar cor (não pode ter cores iguais)
    if(!editar){
        if(porcentagem.length !== 0){
            for (let i in porcentagem){
                if(cor === porcentagem[i].cor){
                    alert('[ERRO!] escolha cores diferentes')
                    adicionar = false
                }
            }
        }
    }

    //decidindo de os valores são ou não válidos
    return adicionar
}

//Percorrer array de objetos do gráfico
function percorreArray(atributo) {
    let retorno = []
    for (let i in porcentagem){
        retorno.push(porcentagem[i][atributo])
    }

    return retorno
}

function colocaGrafico() {
    //Exibindo e escondendo elementos dependendo se o gráfico está ou não na tela
    //removendo o canvas e adicionando novamente o jumbutron de boas vindas e o select caso não haja valores
    const canvas = document.getElementById('myChart')
    let jumbotron = document.getElementById('boasVindas')
    let botao = document.getElementById('baixarImg')
    let aviso = document.getElementById('aviso')

    if(porcentagem.length === 0){
        jumbotron.className = 'd-block jumbotron'
        canvas.className = 'd-none'
        botao.className = 'd-none'
        aviso.className = 'd-none'
    }
    //esconder Boas vindas e exibindo o canvas e o botão de baixar img e o de selecionar tipo de gráfico
    if(porcentagem.length >= 1){
        jumbotron.className = 'd-none'
        canvas.className = 'd-block'
        botao.className = 'btn btn-info btn-lg'
        aviso.className = 'd-block text-info'
    }

    let ctx = canvas.getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: percorreArray('nome') , //colocar nome dos objetos
            datasets: [{
                label: 'Sua %',
                data: percorreArray('porcent'), //numero dos objetos
                backgroundColor: percorreArray('cor'), //cores dos objetos
                borderColor: percorreArray('cor'),
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function listaValores(id){
    let modalBody = document.getElementById(id)

    modalBody.innerHTML = 'Não há porcentagens adicionadas'

    for(let i in porcentagem){
        if(i == 0){
            modalBody.innerHTML = ''
        }
        if(id === 'modalRemoverBody'){
            modalBody.innerHTML += `${porcentagem[i].nome} &rarr; <button class="btn btn-outline-danger btn-sm" onclick="removeValores(${i})"> <i class="fas fa-minus"></i> </button> <small class="text-danger">Remover porcentagem</small> <br>`
        } else if(id === 'modalEditarBody'){
            modalBody.innerHTML += `${porcentagem[i].nome} &rarr; <button class="btn btn-outline-primary btn-sm" onclick="recebeValoresParaEditar(${i})"> <i class="fas fa-edit"></i> </button> <small class="text-primary">Editar porcentagem</small> <br>`
        }
    }
}

function removeValores(key) {
    //removendo do localStorage
    let id = porcentagem[key].id
    bd.delete(id)

    //criando um novo canvas para atualizar gráfico
    document.getElementById('myChart').remove()

    let newCanvas = document.createElement('canvas')
    newCanvas.id = 'myChart'
    newCanvas.width = 400
    newCanvas.height = 400

    document.getElementById('ApresentarCanvas').appendChild(newCanvas)
    getPorcentagem()
    colocaGrafico()

    //removendo da barra
    $('#remover').modal('hide') //esconder modal
}

function recebeValoresParaEditar(key){
    //Colocar valores anteriores no modal de edição
    document.getElementById('newNome').value = porcentagem[key].nome
    document.getElementById('newCor').value = porcentagem[key].cor
    document.getElementById('newPorcent').value = porcentagem[key].porcent

    $('#editar').modal('show')
    $('#listarEdit').modal('hide')

    //criar um input hidden para passar o valor que será atualizado
    if(document.getElementById('porcentagemEditada')){
        //se esse input ja existir, remova ele
        document.getElementById('porcentagemEditada').remove()
    }

    let input = document.createElement('input')
    input.type = 'hidden'
    input.id = 'porcentagemEditada'
    input.value = key
    document.getElementById('editForm').appendChild(input)
}

function editaValores() {

    //recebendo valores
    let newNome = document.getElementById('newNome').value
    let newCor = document.getElementById('newCor').value
    let newPorcent = Number(document.getElementById('newPorcent').value)
    let valor = Number(document.getElementById('porcentagemEditada').value)

    //esvaziando valor de porcentagem antes de editar (para poder validar certinho, senão ele considera os novos valores acima como adicionais, e não substitutos)
    porcentagem[valor]['porcent'] = 0

    if(validaValores(newNome, newCor, newPorcent, true)){
        //se for retornado true, ele atualiza os valores e o gráfico

        //instanciando nova classe de porcentagem para editar
        let updatePorcentagem = new Porcentagem(newNome, newCor, newPorcent)

        let id = parseInt(porcentagem[valor].id)
        bd.update(id, updatePorcentagem)

        //atualizando gráfico
        getPorcentagem()
        colocaGrafico()
        $('#editar').modal('hide')
    }
}

function baixarGrafico() {
    let canvas = document.querySelector("#myChart")
    let botaoImg = document.querySelector("#baixarImg")

    //Transformando o canvas em uma imagem (toDataURL) para poder baixa-lo
    botaoImg.setAttribute("href", canvas.toDataURL());
    botaoImg.setAttribute("download", "chart.jpg");
}

function alterarExibicao() {
    if (porcentagem[0]){
        //caso exista valores adicionados pelo usuário
        document.getElementById('boasVindas').className = 'd-none'
        document.getElementById('myChart').className = 'd-block'
        document.getElementById('aviso').className = 'd-block text-info'
        colocaGrafico()
    } else {
        //caso não exista valores adicionados pelo usuário
        document.getElementById('boasVindas').className = 'd-block jumbotron'
        document.getElementById('myChart').className = 'd-none'
        document.getElementById('aviso').className = 'd-none'
    }
}