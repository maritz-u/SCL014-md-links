const mdLinks = require("../index");

describe("mdLinks", () => {
  it("registrar todos los enlaces", () => {
    mdLinks("./some/example.md")
      .then((links) => {
        // => [{ href, text, file }]
      })
      .catch(console.error);
  });

  it("validar los archivos si la flag validate es true", () => {
    mdLinks("./some/example.md", { validate: true })
      .then((links) => {
        // => [{ href, text, file, status, ok }]
      })
      .catch(console.error);
  });

  it("registrar todos los enlaces de los ficheros MD en una carpeta", () => {
    mdLinks("./some/dir")
      .then((links) => {
        // => [{ href, text, file }]
      })
      .catch(console.error);
  });
});
