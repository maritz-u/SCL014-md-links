const path = require("path");
const fs = require("fs");
const regexp = /\[([\w\s\d\.]+)\]\(([\w\d\.\/:]+)\)/g;

const procesarPath = (path) => {
  if (!fs.existsSync(path)) {
    console.error("No se encuentra!");
    return;
  }

  const stats = fs.lstatSync(path);

  if(stats.isDirectory()) {

  } else if (stats.isFile()) {
    leerArchivo(path);
  }

  console.error("Solo se reconocen directorios o archivos")
  return;
};

const leerArchivo = (path) => {
  fs.readFile(path, "utf8", (err, data) => procesarTexto(data, path));
}

const procesarTexto = (data, path) => {
    let coincidencia;
    const resultados = [];
    while ((coincidencia = regexp.exec(data)) !== null) {
      resultados.push({
        href: coincidencia[2],
        text: coincidencia[1],
        file: path,
      });
    }
    console.log(resultados);
};

procesarPath(process.argv[2]);

exports.modules = {
  mdLinks: (path, opts) =>
    new Promise((resolve, reject) => {
      resolve(llamadoDeRuta(procesarPath(path)));
    }),
};
