describe('Select Unit Page', () => {
  beforeEach(() => {
    cy.visit('/select-unit');
  });

  it('deve exibir loading inicialmente', () => {
    cy.contains('Sincronizando com sistema...').should('be.visible');
  });

  it('deve renderizar unidades quando API responde', () => {
    cy.intercept('GET', '**/api/units', {
      statusCode: 200,
      body: [
        { id: 1, name: 'UTI Adulto' },
        { id: 2, name: 'Pediatria' },
      ],
    }).as('getUnits');

    cy.visit('/select-unit');

    cy.wait('@getUnits');

    cy.contains('UTI Adulto').should('be.visible');
    cy.contains('Pediatria').should('be.visible');
  });

  it('deve navegar ao clicar em uma unidade', () => {
    cy.intercept('GET', '**/api/units', {
      statusCode: 200,
      body: [{ id: 1, name: 'UTI Adulto' }],
    }).as('getUnits');

    cy.visit('/select-unit');
    cy.wait('@getUnits');

    cy.get('[data-cy=unit-1]').click();

    cy.url().should('include', '/dashboard?unit=1');
  });

  it('deve usar fallback quando API falhar', () => {
    cy.intercept('GET', '**/api/units', {
      statusCode: 500,
    }).as('getUnitsError');

    cy.visit('/select-unit');
    cy.wait('@getUnitsError');

    // mensagem de aviso
    cy.contains('Modo offline').should('be.visible');

    // mock sendo exibido
    cy.contains('UTI Adulto').should('be.visible');
    cy.contains('Emergência').should('be.visible');
  });

  it('deve exibir mensagem quando não houver unidades', () => {
    cy.intercept('GET', '**/api/units', {
      statusCode: 200,
      body: [],
    }).as('getUnitsEmpty');

    cy.visit('/select-unit');
    cy.wait('@getUnitsEmpty');

    cy.contains('Nenhuma unidade disponível').should('be.visible');
  });
});