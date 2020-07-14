//Esse script vai controlar a adição, edição e remoção dos itens no local storage

class BD {
    constructor() {
        //id do local storage
        let id = localStorage.getItem('id')

        //iniciando o localStorage
        if (id == null){
            localStorage.setItem('id', 0)
        }
    }

    getProximoId(){
        //método para evitar repetição de Ids
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    insert(grafico){
        //id para gravação no localStorage
        let id = this.getProximoId()

        //pegando o objeto no parâmetro e transformando em JSON
        let JSONgrafico = JSON.stringify(grafico)

        localStorage.setItem('id', id)
        localStorage.setItem(id, JSONgrafico)
    }

    select(){
        let localPorcentagem = []

        //total de procentagens cadastradas no localStorage
        let total = localStorage.getItem('id')

        //percorrendo o localStorage
        for (let i = 1; i <= total; i++){
            let porcentagem = localStorage.getItem(i) //recupera item
            porcentagem = JSON.parse(porcentagem) //transforma em objeto

            //evitar recuperação de itens nulos caso algum id foi pulado
            if (porcentagem == null){
                continue
            }

            porcentagem.id = i
            localPorcentagem.push(porcentagem)
        }

        return localPorcentagem
    }

    update(id, grafico){
        this.delete(id)

        //id para gravação no localStorage
        let updateId = id

        let JSONgrafico = JSON.stringify(grafico)
        localStorage.setItem(id, JSONgrafico)
    }

    delete(id){
        localStorage.removeItem(id)
    }

    deleteAll(){
        localStorage.clear()

        //iniciando o localStorage
        localStorage.setItem('id', 0)
    }
}
