describe('First Access - Configuração SIGH', () => {
  beforeEach(() => {
    cy.visit('/first-access');
  });

  it('deve renderizar a página corretamente', () => {
    cy.contains('Primeiro Acesso').should('be.visible');
    cy.get('input[placeholder="Nome do Hospital"]').should('exist');
  });

  it('deve preencher o formulário e enviar com sucesso', () => {
    // Mock da API
    cy.intercept('POST', '**/config/setup', {
      statusCode: 200,
      body: { success: true },
    }).as('setupRequest');

    // Preenche dados institucionais
    cy.get('input[placeholder="Nome do Hospital"]').type('Hospital Teste');

    // Preenche formulário SIGH
    cy.get('input[placeholder="Host"]').type('127.0.0.1');
    cy.get('input[placeholder="Porta"]').clear().type('5432');
    cy.get('input[placeholder="Banco"]').type('sigh_db');
    cy.get('input[placeholder="Usuário"]').type('admin');
    cy.get('input[placeholder="Senha"]').type('123456');

    // Envia
    cy.contains('Salvar Configuração').click();

    // Espera requisição
    cy.wait('@setupRequest');

    // Verifica redirecionamento
    cy.url().should('include', '/select-unit');
  });

  it('deve mostrar erro quando API falhar', () => {
    cy.intercept('POST', '**/config/setup', {
      statusCode: 500,
    }).as('setupError');

    cy.get('input[placeholder="Nome do Hospital"]').type('Hospital Teste');

    cy.get('input[placeholder="Host"]').type('127.0.0.1');
    cy.get('input[placeholder="Porta"]').clear().type('5432');
    cy.get('input[placeholder="Banco"]').type('sigh_db');
    cy.get('input[placeholder="Usuário"]').type('admin');
    cy.get('input[placeholder="Senha"]').type('123456');

    cy.contains('Salvar Configuração').click();

    cy.wait('@setupError');

    // Se estiver usando toast
    cy.contains('Erro ao configurar sistema').should('be.visible');
  });
});