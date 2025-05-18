/* global cy, describe, it */

import React from "react";
import GestionCursos from "../../src/paginas/docente/GestionCursos/GestionCursos";
import { mount } from "cypress/react";

describe("GestionCursos", () => {
  it("renderiza el componente y permite seleccionar un módulo", () => {
    mount(<GestionCursos />);
    cy.contains("Selecciona un módulo para gestionar").should("exist");
    cy.contains("Básico").click();
    cy.contains('Gestionar Módulo "Básico"').should("exist");
  });

  it('abre el modal de video al hacer clic en "Subir Videos"', () => {
    mount(<GestionCursos />);
    cy.contains("Intermedio").click();
    cy.contains("Subir Videos").click();
    cy.contains("Subir Video").should("exist");
  });

  it("valida los campos del formulario de video", () => {
    mount(<GestionCursos />);
    cy.contains("Avanzado").click();
    cy.contains("Subir Videos").click();
    cy.contains("Guardar").click();
    cy.contains("El título es obligatorio.").should("exist");
    cy.contains("La URL es obligatoria.").should("exist");
  });

  it("guarda el video correctamente si los datos son válidos", () => {
    cy.window().then((win) => cy.stub(win, "alert").as("alert")); // intercepta alert

    mount(<GestionCursos />);
    cy.contains("Básico").click();
    cy.contains("Subir Videos").click();
    cy.get('input[placeholder="Ej: Introducción a React"]').type(
      "Video prueba"
    );
    cy.get('input[placeholder="https://..."]').type(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    );
    cy.contains("Guardar").click();

    cy.get("@alert").should("have.been.calledWithMatch", /Video guardado/);
  });
});
