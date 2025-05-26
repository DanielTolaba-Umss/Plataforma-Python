import React from "react";
import GestionCurso from "../../src/paginas/docente/GestionCursos/GestionCurso";
import { mount } from "cypress/react";

describe("GestionCurso Component", () => {
  beforeEach(() => {
    mount(<GestionCurso />);
  });

  it("crear una nueva lección en el módulo básico", () => {
    cy.contains("Nivel Básico").click();
    cy.contains("Lecciones").should("be.visible");

    cy.get('button').contains(/agregar lección/i).click();

    cy.get('input[aria-label="título"]').type("Nueva Lección");
    cy.get('textarea[aria-label="descripción"]').type("Descripción de la nueva lección");

    cy.get('button').contains(/crear/i).click();

    cy.contains("Nueva Lección").should("be.visible");
  });

  it("editar una lección existente", () => {
    cy.contains("Nivel Básico").click();
    cy.contains("Introducción a Python").should("be.visible");

    cy.get('button').contains(/editar/i).first().click();

    cy.get('input[aria-label="título"]').clear().type("Python Básico Editado");
    cy.get('button').contains(/guardar/i).click();

    cy.contains("Python Básico Editado").should("be.visible");
  });

  it("eliminar una lección", () => {
    cy.contains("Nivel Básico").click();
    cy.contains("Variables y Tipos de Datos").should("be.visible");

    cy.get('button').contains(/eliminar/i).eq(1).click();
    cy.get('button').contains(/confirmar/i).click();

    cy.contains("Variables y Tipos de Datos").should("not.exist");
  });
});
