/// <reference types="cypress"/>

import { format } from '../support/utils'  

//opções para rodar em mobile:
//cy.viewport
//arquivos de config
//configs por linha de comando: npx cypress open --config viewportWidth=411,viewportHeight=823

//executar em modo headless: 
//npx cypress run --config viewportWidth=411,viewportHeight=823
//Gera automaticamente um vídeo da execução dos testes -> importante para documentação

context('Dev Finances Agilizei', () => {

  // Pode-se utilizar HOOKs, comandos que se repetem antes dos testes:
  //before: antes de tudo
  //beforeEach: antes de cada teste
  //after: depois de todos 
  //afterEach: depois de cada teste
  
  beforeEach(() => {
    cy.visit('https://dev-finance.netlify.app/', {
      onBeforeLoad: (win) => {
        prepareLocalStorage(win)
      }          
    })
  });

  it('Cadastrar entradas', () => {
  // Descrevendo a primeira ação de teste na página:
  // 1- Entender o fluxo manualmente 
  // 2- Mapear os elementos que vamos interagir 
  // 3- Descrever as interações
  // 4- Adicionar asseções
  
    cy.get('#transaction .button').click({force: true}) // método de busca por ID + classe e .click realiza a ação
    cy.get('#description').type('textoqualquer') //busca por ID. .type() realiza a ação de escrever um texto
    cy.get('[name=amount').type(500) //seleção por atributos
    cy.get('[type=date]').type('2024-07-09') //seleção por atributos. Dados devem estar no formato americano. 
    cy.get('button').contains('Salvar').click() //tipo e valor 
    // deve-se validar o resultado conferindo a alteração
    cy.get('#data-table tbody tr').should('have.length', 1)
    //espera-se que o tr contido em tbody de data-table tenha tamanho de 1 item.

  });

  it('Cadastrar saídas', () => {        

    cy.get('#transaction .button').click({force: true})
    cy.get('#description').type('textoqualquer')
    cy.get('[name=amount').type(-500)
    cy.get('[type=date]').type('2024-07-09') 
    cy.get('button').contains('Salvar').click()


  });

  it('Remover entradas e saídas', () => {
    const entrada = 'Mesada'
    const saída = 'Compras'

    cy.get('#transaction .button').click({force: true})
    cy.get('#description').type(entrada)
    cy.get('[name=amount]').type(100)
    cy.get('[type=date]').type('2024-07-09') 
    cy.get('button').contains('Salvar').click()

    cy.get('#transaction .button').click({force: true})
    cy.get('#description').type(saída)
    cy.get('[name=amount]').type(-50)
    cy.get('[type=date]').type('2024-07-09') 
    cy.get('button').contains('Salvar').click()

    cy.get('td.description') //deve-se usar um cy.get para restringir a busca de tipos de elemento antes do contains
      .contains(entrada)
      .parent() //encontra o elemento "pai"
      .find('img[onclick*=remove]') //busca o elemento no contexto da linha. 
      .click()

    //voltar para um elemento pai, avançar para um td img atributo
    //na busca, apesar de achar mais elementos por causa do seletor find, está preso por um elemento pai "entrada". 
    //Poderia utilizar: onclick="Transaction.remove(0)", sendo o 0 referente apenas à primeira transação. 
    //Estratégia 2: Buscar elementos irmãos e então buscar o que tem img+atributo


    cy.get('td.description')
      .contains(saída)
      .siblings()
      .children('img[onclick*=remove]')
      .click()

      cy.get('#data-table tbody tr').should('have.length', 0)

  });


  it.only('Validar saldo de diversas transações', () => {
    const entrada = 'Mesada'
    const saída = 'Compras'

    cy.get('#transaction .button').click({force: true})
    cy.get('#description').type(entrada)
    cy.get('[name=amount]').type(100)
    cy.get('[type=date]').type('2024-07-09') 
    cy.get('button').contains('Salvar').click()

    cy.get('#transaction .button').click({force: true})
    cy.get('#description').type(saída)
    cy.get('[name=amount]').type(-50)
    cy.get('[type=date]').type('2024-07-09') 
    cy.get('button').contains('Salvar').click()
    
    //1) capturar as linhas com as transações 
    //2) capturar o texto das colunas
    //3) formatar os valores das linhas 
    //4) somar os valores de entradas e saídas
    //5) capturar o texto do total
    //6) comparar o somatório dos valores com o total

    let incomes = 0
    let expenses = 0

    cy.get ('#data-table tbody tr')
        .each(($el, index, $list) => {  //each permite navegar em cada item da lista encontrada no cy.get

            cy.get($el).find('td.income, td.expense').invoke('text').then(text => { 
          //seleciona cada elemento($el) em td que seja classe income ou expense (classes de acordo com o cadastrado no site)
          //invoke serve para invocar uma função javascript, send essa a função text, para selecionar o valor textual
          if(text.includes('-')){ //verifica se o texto inclui o sinal negativo
            expenses = expenses+format(text)
      } else {
        incomes = incomes + format(text)  //conclui a lógica de somar entradas e saídas
      }
      //pode-se utilizar um log de controle que vai mostrar o resultado no Cypress ao rodar. 
        cy.log('entradas', incomes)
        cy.log('saidas', expenses)

      }) //obtem o valor de texto do elemento				



    })
  cy.get('#totalDisplay').invoke('text').then(text => {  //puxa elemento com ID única totaldisplay
  cy.log('valor total', format(text))

  //validar através de asserções!
  let formattedTotalDisplay = format(text)
  let expectedTotal = incomes + expenses 

  expect(formattedTotalDisplay).to.eq(expectedTotal)
  })

  });

  it('Cadastrar entradas', () => {
  

  });
});