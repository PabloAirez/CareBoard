describe('Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173'); 
  });

  it('deve logar com credenciais válidas', () => {
    cy.get('input[placeholder="Usuário"]').type('hrsj');
    cy.get('input[placeholder="Senha"]').type('123456');

    cy.contains('Entrar no Sistema').click();

    // espera redirecionamento
    cy.url().should('include', '/select-unit');
  });

  it('deve mostrar erro com credenciais inválidas', () => {
    cy.get('input[placeholder="Usuário"]').type('errado');
    cy.get('input[placeholder="Senha"]').type('123');

    cy.contains('Entrar no Sistema').click();

    cy.contains('Credenciais inválidas').should('be.visible');
  });
});