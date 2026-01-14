describe('Login Page', () => {
  it('should render the login form and allow typing credentials', () => {
    cy.visit('/');

    cy.contains('UBS Watchdog');
    cy.contains('Sistema de Monitoramento de Transações & Compliance.');

    cy.get('input[placeholder="Digite seu usuário"]').type('Admin');
    cy.get('input[placeholder="Digite sua senha"]').type('SenhaMuitoForte123!');

    cy.contains('button', 'Entrar').click();

    // Since the login is mocked, we just assert that we navigated to /home
    cy.url().should('include', '/home');
  });
});
