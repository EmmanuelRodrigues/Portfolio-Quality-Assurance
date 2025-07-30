describe('Central de Atendimentos TAT', () => {
    
    beforeEach(() => {
        cy.visit('https://cac-tat-v3.s3.eu-central-1.amazonaws.com/index.html')


    });
    it('Verifica o título da aplicação', () => {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')

    });

    it('Ex1: Digita o NOME e demais dados', () => {
        cy.get('#firstName')
            .as('camponome')
            .should('be.visible')
            .type('Fulano de Tal',{delay:20})
        cy.get('@camponome')
            .should('have.value','Fulano de Tal')

        cy.get('#lastName')
            .as('camposobrenome')
            .should('be.visible')
            .type('Rodrigues',{delay:20})
        cy.get('@camposobrenome')
            .should('have.value','Rodrigues')

        cy.get('#email')
            .as('email')
            .should('be.visible')
            .type('fulano@gmail.com',{delay:20})
        cy.get('@email')
            .should('have.value','fulano@gmail.com')

        cy.get('#phone')
            .as('phone')
            .should('be.visible')
            .type('549836',{delay:20})
        cy.get('@phone')
            .should('have.value','549836')

        cy.get('#open-text-area').type('Ótimo atendimento')
        cy.get('#email-checkbox').click()
        cy.get('button[type="submit"]').click()
        cy.get('.success').should('be.visible')

    });

    it('Ex2: exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
         cy.get('#email')
            .as('email')
            .should('be.visible')
            .type('fulano2gmail,com',{delay:50})
    
            cy.get('button[type="submit"]').click()
            cy.get('.error').should('be.visible')

    });

    it('Ex3: Verifica que o campo "telefone" continua vazio ao receber valor não numérico', () => {
        
        cy.get('input[type="number"]').type('abcde',{delay:0})
        cy.get('input[type="number"]').should('have.value', '')

        
    });

    it('Ex4: exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        
        cy.get('#firstName').as('camponome').should('be.visible').type('Fulano de Tal',{delay:2})
        cy.get('@camponome').should('have.value','Fulano de Tal')

        cy.get('#lastName').as('camposobrenome').should('be.visible').type('Rodrigues',{delay:2})
        cy.get('@camposobrenome').should('have.value','Rodrigues')

        cy.get('#email').as('email').should('be.visible').type('fulano@gmail.com',{delay:2})
        cy.get('@email').should('have.value','fulano@gmail.com')

        cy.get('#open-text-area').type('Ótimo atendimento')

        cy.get('input[id="phone-checkbox"]').click()
        cy.get('.phone-label-span').should('be.visible')
        cy.get('button[type="submit"]').click()     
        cy.get('.error').should('be.visible')

    });

    it.only('Ex6: exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.get('button[type="submit"]').click()     
        cy.get('.error').should('be.visible')
    });
});