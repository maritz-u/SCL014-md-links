const path = require("path");
const fs = require("fs");
const regexp = /\[([\w\s\d\.]+)\]\(([\w\d\.\/:]+)\)/g;

const procesarRuta = (ruta) => {
  if (!fs.existsSync(ruta)) {
    console.error("No se encuentra!");
    return;
  }

  const stats = fs.lstatSync(ruta);

  if(stats.isDirectory()) {
    return new Promise((resolve, reject) => {
      const resultados = [];
      fs.readdir(ruta, (err, archivos) => {
        for(let archivo of archivos) {
          if(path.extname(archivo) === ".md") {
            leerArchivo(archivo).then((enlaces) => {
              resultados.push(enlaces);
            });
          }
        }
      });
      resolve(resultados);
    });
  } else if (stats.isFile()) {
    return leerArchivo(ruta);
  } else {
    console.error("Solo se reconocen directorios o archivos")
  }
};

const leerArchivo = (ruta) => {
  return new Promise((resolve, reject) => {
    fs.readFile(ruta, "utf8", (err, data) => {
      resolve(procesarTexto(data, ruta))
    });
  });
}

const procesarTexto = (data, ruta) => {
    let coincidencia;
    const resultados = [];
    while ((coincidencia = regexp.exec(data)) !== null) {
      resultados.push({
        href: coincidencia[2],
        text: coincidencia[1],
        file: ruta,
      });
    }

    return resultados;
};

procesarRuta(process.argv[2]).then((result) => console.log(result));

exports.modules = {
  mdLinks: (ruta, opts) => procesarRuta(ruta)
};
