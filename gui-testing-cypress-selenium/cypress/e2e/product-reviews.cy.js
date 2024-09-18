describe("product reviews", () => {
  beforeEach(() => {
    cy.visit("/admin");
    cy.get('[id="_username"]').type("sylius");
    cy.get('[id="_password"]').type("sylius");
    cy.get(".primary").click();

    // Click in product reviews in side menu
    cy.clickInFirst('a[href="/admin/product-reviews/"]');
  });
  // Remove .only and implement others test cases!
  it("changing rating of specify product review", () => {
    // Type in value input to search for specify product review
    cy.get('[id="criteria_title_value"]').type("rerum");
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last product review
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Edit product review rating
    cy.get('[for="sylius_product_review_rating_4"]').scrollIntoView().click();
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that product review has been updated
    cy.get("body").should(
      "contain",
      "Product review has been successfully updated."
    );
  });

  it("test case 2: Filtrar avaliações de produto pelo título", () => {
    cy.get('[id="criteria_title_value"]').type("consequuntur");
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Assert que verifica se o filtro funcionou corretamente
    cy.get("tbody").should("contain", "consequuntur");

    // Limpar parte do filtro
    cy.get('[id="criteria_title_value"]').clear().type("consequun");
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get("tbody").should("contain", "consequun");

    // Limpar o filtro completamente
    cy.get('[id="criteria_title_value"]').clear();
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get("tbody").should("not.be.empty");
  });

  it("test case 3: Editar uma avaliação existente", () => {
    cy.get('[id="criteria_title_value"]').type("et quia aut");
    cy.get('*[class^="ui labeled icon button "]').last().click();
    cy.get('[id="sylius_product_review_title"]')
      .clear()
      .type("Titulo atualizado.");
    cy.get('[id="sylius_product_review_comment"]')
      .clear()
      .type("Comentário atualizado.");
    cy.get('[id="sylius_save_changes_button"]').click();

    // Assert que verifica se a avaliação foi atualizada
    cy.get("body").should(
      "contain",
      "Product review has been successfully updated."
    );
  });

  it("test case 4: Ordenar avaliações de produto pelo título e avaliação ao clicar no cabeçalho", () => {
    cy.get("tbody tr").then(($rowsBefore) => {
      cy.get("th").contains("Title").click();

      cy.wait(1000);

      cy.get("tbody tr").then(($rowsAfter) => {
        const rowsBeforeText = $rowsBefore
          .map((i, el) => Cypress.$(el).text())
          .get()
          .join("\n");
        const rowsAfterText = $rowsAfter
          .map((i, el) => Cypress.$(el).text())
          .get()
          .join("\n");

        // Assert que verifica se o conteúdo das linhas mudou, confirmando que a tabela foi reordenada
        expect(rowsBeforeText).to.not.equal(rowsAfterText);
      });
    });

    // Ordenar por Avaliação
    cy.get("tbody tr").then(($rowsBeforeRating) => {
      cy.get("th").contains("Rating").click();

      cy.wait(1000); // Aguarda a ordenação

      cy.get("tbody tr").then(($rowsAfterRating) => {
        const rowsBeforeRatingText = $rowsBeforeRating
          .map((i, el) => Cypress.$(el).text())
          .get()
          .join("\n");
        const rowsAfterRatingText = $rowsAfterRating
          .map((i, el) => Cypress.$(el).text())
          .get()
          .join("\n");

        // Assert que verifica se o conteúdo das linhas mudou, confirmando que a tabela foi reordenada por avaliação
        expect(rowsBeforeRatingText).to.not.equal(rowsAfterRatingText);
      });
    });
  });

  it("test case 5: Remover uma avaliação de produto e verificar a exclusão", () => {
    cy.get('[id="criteria_title_value"]').type("sed");
    cy.get("th").contains("Status").click();
    cy.get("button.ui.red.labeled.icon.button").last().click();
    cy.get('[id="confirmation-button"]').click();

    // Assert que verifica se a avaliação foi excluída com sucesso
    cy.get("body").should(
      "contain",
      "Product review has been successfully deleted."
    );
  });

  it("test case 6: Filtrar avaliações de produto que não contêm ou é igual a uma palavra-chave específica", () => {
    // Filtrar avaliações que NÃO contêm uma palavra-chave específica
    cy.get('[id="criteria_title_type"]').select("Not contains");
    cy.get('[id="criteria_title_value"]').type("voluptatem");
    cy.get('*[class^="ui blue labeled icon button"]').click();

    // Verifica se as avaliações filtradas não contêm a palavra-chave
    cy.get("tbody tr").each(($row) => {
      cy.wrap($row).find("td").eq(1).should("not.contain", "voluptatem");
    });
    // Verifica se a palavra-chave não aparece no corpo da página
    cy.get("body").should("not.contain", "voluptatem");

    cy.get('[id="criteria_title_value"]').clear();
    cy.get('*[class^="ui blue labeled icon button"]').click();

    // Aplicar novo filtro para verificar igualdade
    cy.get('[id="criteria_title_type"]').select("Equal");
    cy.get('[id="criteria_title_value"]').type("est sequi accusamus");
    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.wait(2000);
    // Verifica se as avaliações filtradas é igual a palavra-chave
    cy.get("tbody tr").each(($row) => {
      cy.wrap($row).find("td").eq(2).should("contain", "est sequi accusamus");
    });
  });

  it.only("test 7: Navegar entre páginas de avaliações de produto", () => {
    cy.get('a[rel="next"]').first().should("exist").click();

    // Verifica se a URL foi atualizada para incluir page=2
    cy.url().should("include", "page=2");
    cy.get('a[rel="prev"]').first().should("exist").click();

    // Verificar se a URL não contém page=2 após clicar em "Previous":
    cy.url().should("not.include", "page=2");

    // Clicar diretamente no botão para a página 3
    cy.get('a[href*="page=3"]').first().click();
    // Verifica se a URL foi atualizada para incluir page=3
    cy.url().should("include", "page=3");

    // Clicar diretamente no botão para a página 1
    cy.get('a[href*="page=1"]').first().click();
    // Verifica se a URL foi atualizada para incluir page=1
    cy.url().should("include", "page=1");
  });

  it("test 8: Validar campos obrigatórios ao editar uma avaliação", () => {
    cy.get('*[class^="ui labeled icon button "]').last().click();
    cy.get('[id="sylius_product_review_title"]').clear();
    cy.get('[id="sylius_save_changes_button"]').click();

    // FALTA ADICIONAR MAIS ITERAÇÕES

    // Verifica a mensagem de erro de campo obrigatório
    cy.get("body").should("contain", "Review title should not be blank.");
  });

  it("test 9: Cancelar a edição e garantir que as alterações não foram salvas", () => {
    cy.get('*[class^="ui labeled icon button "]').last().click();
    cy.get('[id="sylius_product_review_title"]')
      .clear()
      .type("Titulo não salvo");

    // FALTA ADICIONAR MAIS ITERAÇÕES

    cy.get("a.ui.button").contains("Cancel").should("be.visible").click();

    // Assert que verifica se o título não foi alterado
    cy.get("tbody").should("not.contain", "Titulo não salvo");
  });

  it("test 10: Alterar o número de itens por página para 25", () => {
    cy.get(".sylius-grid-nav__perpage .dropdown").first().click();
    cy.get(".menu a").contains("25").click();

    // FALTA ADICIONAR MAIS ITERAÇÕES

    // Verifica se a URL foi atualizada corretamente
    cy.url().should("include", "/admin/product-reviews/?limit=25");

    // Verifica se a interface indica que 25 itens estão sendo exibidos
    cy.get(".sylius-grid-nav__perpage").should("contain", "Show 25");
  });
});
