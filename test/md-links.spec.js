const mdLinks = require("../md-links");
const assert = require("assert");

describe("mdLinks", () => {
  it("registrar todos los enlaces", () => {
    mdLinks("./test/resources/test-markdown.md")
      .then((links) => {
        assert(links[0].hasOwnProperty("href"));
        assert(links[0].hasOwnProperty("text"));
        assert(links[0].hasOwnProperty("file"));
      })
      .catch(console.error);
  });

  it("validar los archivos si la flag validate es true", () => {
    mdLinks("./test/resources/test-markdown", { validate: true })
      .then((links) => {
        // => [{ href, text, file, status, ok }]
      })
      .catch(console.error);
  });

  it("registrar todos los enlaces de los ficheros MD en una carpeta", () => {
    mdLinks("./test/resources/")
      .then((links) => {
        assert(links[0].hasOwnProperty("href"));
        assert(links[0].hasOwnProperty("text"));
        assert(links[0].hasOwnProperty("file"));
      })
      .catch(console.error);
  });
});
