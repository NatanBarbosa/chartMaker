class Porcentagem{
    constructor(nome, cor, porcent, titulo){
        this.nome = nome
        this.cor = cor
        this.porcent = porcent
    }
}

//Arrays que vão conter as configurações
let cores = Array()
let nomes = Array()
let porcentagens = Array()
let porcentagem = Array()

function recebeValores(){
    let nome = document.getElementById('nome').value
    let cor = document.getElementById('cor').value
    let porcent = Number(document.getElementById('porcent').value)

    if(validaValores(nome, cor, porcent)){
        //se for retornado true, ele coloca o gráfico

        //colocar novo objeto na ultima posição do array
        porcentagem.push(new Porcentagem(nome, cor, porcent))

        //esconder modal
        $('#confirm').modal('hide')

        colocaGrafico()
    }

    //limpar modal 
    document.getElementById('nome').value = ''
    document.getElementById('cor').value = ''
    document.getElementById('porcent').value = ''
}

function validaValores(nome, cor, porcent){
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
    if(porcentagem.length !== 0){
        for (let i in porcentagem){
            if(cor === porcentagem[i].cor){
                alert('[ERRO!] escolha cores diferentes')
                adicionar = false
            }
        }
    }

    //decidindo de os valores são ou não válidos
    if(adicionar){
        return true
    } else {
        return false
    }
}

function colocaGrafico(atualizarGrafico = false, chartType = 'pie') {
    //Exibindo e escondendo elementos dependendo se o gráfico está ou não na tela
    //removendo o canvas e adicionando novamente o jumbutron de boas vindas e o select caso não haja valores
    const canvas = document.getElementById('myChart')
    let jumbotron = document.getElementById('boasVindas')
    let select = document.getElementById('chartType')
    let botao = document.getElementById('baixarImg')

    if(porcentagem.length === 0){
        jumbotron.className = 'd-block jumbotron'
        canvas.className = 'd-none'
        
        select.className = 'd-none'

        botao.className = 'd-none'
    }
    //esconder Boas vindas e exibindo o canvas e o botão de baixar img e o de selecionar tipo de gráfico
    if(porcentagem.length >= 1){
        jumbotron.className = 'd-none'
        select.className = 'form-control'

        canvas.className = 'd-block'

        botao.className = 'btn btn-info btn-lg'
    }

    //Gráfico chart.js
    if(!atualizarGrafico) {
        cores.push(porcentagem[porcentagem.length - 1].cor)
        nomes.push(porcentagem[porcentagem.length - 1].nome)
        porcentagens.push(porcentagem[porcentagem.length - 1].porcent)
    }

    let ctx = canvas.getContext('2d');
    let myChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: nomes, //colocar nome dos objetos
            datasets: [{
                label: 'Sua %',
                data: porcentagens, //numero dos objetos
                backgroundColor: cores, //cores dos objetos
                borderColor: cores,
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
            modalBody.innerHTML += `${porcentagem[i].nome} &rarr; <button class="btn btn-outline-danger btn-sm" onclick="removeValores(${i}, 1)"> <i class="fas fa-minus"></i> </button> <small class="text-danger">Remover porcentagem</small> <br>`
        } else if(id === 'modalEditarBody'){
            modalBody.innerHTML += `${porcentagem[i].nome} &rarr; <button class="btn btn-outline-primary btn-sm" onclick="recebeValoresParaEditar(${i})"> <i class="fas fa-edit"></i> </button> <small class="text-primary">Editar porcentagem</small> <br>`
        }
    }
}

function removeValores(start, deleteCount) {
    //removendo do array
    porcentagem.splice(start,deleteCount)
    cores.splice(start,deleteCount)
    nomes.splice(start,deleteCount)
    porcentagens.splice(start,deleteCount)

    //criando um novo canvas para atualizar gráfico
    const canvas = document.getElementById('myChart')

    canvas.remove()
    let newCanvas = document.createElement('canvas')
    newCanvas.id = 'myChart'
    newCanvas.width = 400
    newCanvas.height = 400

    document.getElementById('ApresentarCanvas').appendChild(newCanvas)
    colocaGrafico(true) //esse parâmetro previne o bug dele clonar a ultima posição do array porcentagem

    //removendo da barra
    $('#remover').modal('hide') //esconder modal
}

function recebeValoresParaEditar(valor){
    //Colocar valores anteriores no modal de edição
    document.getElementById('newNome').value = porcentagem[valor].nome
    document.getElementById('newCor').value = porcentagem[valor].cor
    document.getElementById('newPorcent').value = porcentagem[valor].porcent

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
    input.value = valor
    document.getElementById('editForm').appendChild(input)
}

function editaValores() {

    //recebendo valores
    let nome = document.getElementById('newNome').value
    let cor = document.getElementById('newCor').value
    let porcent = Number(document.getElementById('newPorcent').value)
    let valor = Number(document.getElementById('porcentagemEditada').value)

    //esvaziando valor de porcentagem antes de editar (para poder validar certinho, senão ele considera os novos valores acima como adicionais, e não substitutos)
    porcentagens[valor] = 0
    porcentagem[valor]['porcent'] = 0

    if(validaValores(nome, cor, porcent)){
        //se for retornado true, ele atualiza os valores e o gráfico

        //editando o valor dos arrays
        cores[valor] = cor
        nomes[valor] = nome
        porcentagens[valor] = porcent

        porcentagem[valor]['nome'] = nome
        porcentagem[valor]['cor'] = cor
        porcentagem[valor]['porcent'] = porcent

        //atualizando gráfico
        colocaGrafico(true)
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