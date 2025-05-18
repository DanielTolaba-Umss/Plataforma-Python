/* global cy, describe, it, beforeEach */

import React from "react";
import ModuleList from "../../src/componentes/especificos/ModuleList"; // Ajusta si es necesario

describe("ModuleList Component", () => {
  beforeEach(() => {
    cy.mount(<ModuleList />);
  });

  it("crea tres módulos, edita los dos primeros y elimina el último", () => {
    // Crear Módulo 1
    cy.contains("+ Nuevo Módulo").click();
    cy.get('input[name="titulo"]').type("Módulo 1");
    cy.get('input[name="descripcion"]').type("Descripción 1");
    cy.get('input[name="orden"]').type("10");
    cy.contains("Crear Módulo").click();

    // Crear Módulo 2
    cy.contains("+ Nuevo Módulo").click();
    cy.get('input[name="titulo"]').type("Módulo 2");
    cy.get('input[name="descripcion"]').type("Descripción 2");
    cy.get('input[name="orden"]').type("11");
    cy.contains("Crear Módulo").click();

    // Crear Módulo 3
    cy.contains("+ Nuevo Módulo").click();
    cy.get('input[name="titulo"]').type("Módulo 3");
    cy.get('input[name="descripcion"]').type("Descripción 3");
    cy.get('input[name="orden"]').type("12");
    cy.contains("Crear Módulo").click();

    // Verificar que los tres módulos fueron creados
    cy.contains("Módulo 1").should("exist");
    cy.contains("Módulo 2").should("exist");
    cy.contains("Módulo 3").should("exist");

    // Editar Módulo 1
    cy.get(".editar").eq(-3).click(); // antepenúltimo botón de editar
    cy.get('input[name="titulo"]').clear().type("Módulo 1 Editado");
    cy.get('input[name="descripcion"]').clear().type("Descripción 1 Editada");
    cy.get('input[name="orden"]').clear().type("101");
    cy.contains("Guardar Cambios").click();

    // Editar Módulo 2
    cy.get(".editar").eq(-2).click(); // penúltimo botón de editar
    cy.get('input[name="titulo"]').clear().type("Módulo 2 Editado");
    cy.get('input[name="descripcion"]').clear().type("Descripción 2 Editada");
    cy.get('input[name="orden"]').clear().type("102");
    cy.contains("Guardar Cambios").click();

    // Verificar que las ediciones se realizaron
    cy.contains("Módulo 1 Editado").should("exist");
    cy.contains("Módulo 2 Editado").should("exist");
    cy.contains("Módulo 3").should("exist");

    // Eliminar Módulo 3
    cy.get(".eliminar").last().click();
    cy.contains("Eliminar").click();

    // Verificar que Módulo 3 fue eliminado y los otros dos existen
    cy.contains("Módulo 3").should("not.exist");
    cy.contains("Módulo 1 Editado").should("exist");
    cy.contains("Módulo 2 Editado").should("exist");
  });
});
