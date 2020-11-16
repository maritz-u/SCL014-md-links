#!/usr/bin/env node
const yargs = require("yargs");
const mdLinks = require("./md-links.js");

/**
 * Configuración de librería yargs para recibir argumentos desde la CLI
 */
const argv = yargs
  .command("path", "Dirección apuntando a un archivo Markdown o directorio")
  .option("validate", {
    alias: "v",
    description: "Valida los enlaces encontrados",
    type: "boolean",
  })
  .option("stats", {
    alias: "s",
    description: "Entrega estadísticas de los enlaces",
    type: "boolean",
  })
  .help()
  .alias("help", "h").argv;

mdLinks(argv._[0], { validate: argv.validate }).then((result) => console.log(result));
