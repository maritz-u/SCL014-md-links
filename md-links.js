const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const regexp = /\[([\w\s\d\.]+)\]\(([\w\d\.\/:]+)\)/g;

/**
 * Procesa una ruta, valida su existencia y efectúa llamados dependiendo si es directorio o fichero.
 * @param {*} ruta
 * @param {*} validate
 */
const procesarRuta = (ruta, validate) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(ruta)) {
      reject("No se encuentra!");
      return;
    }
    const stats = fs.lstatSync(ruta);

    if (stats.isDirectory()) {
      resolve(procesarDirectorio(ruta, validate));
    } else if (stats.isFile()) {
      resolve(leerArchivo(ruta, validate));
    } else {
      reject("Solo se reconocen directorios o archivos");
    }
  });
};

/**
 * Procesa todos los ficheros .MD de un directorio
 *
 * @param {*} ruta
 * @param {*} validate
 */
const procesarDirectorio = (ruta, validate) => {
  return new Promise((resolve, reject) => {
    const promesas = [];
    const archivos = fs.readdirSync(ruta);

    for (let archivo of archivos) {
      if (path.extname(archivo) === ".md") {
        promesas.push(leerArchivo(archivo, validate));
      }
    }

    Promise.all(promesas).then((resultados) => {
      resolve(resultados);
    });
  });
};

/**
 * Lee un archivo asumiendo codificación UTF8, luego procesa el texto con procesarTexto
 * @param {*} ruta
 * @param {*} validate
 */
const leerArchivo = (ruta, validate) => {
  return new Promise((resolve, reject) => {
    fs.readFile(ruta, "utf8", (err, data) => {
      resolve(procesarTexto(data, ruta, validate));
    });
  });
};

/**
 * Procesa una cadena de texto buscando enlaces en formato Markdown.
 * Devuelve el arreglo de objetos en el formato definido por crearObjetoEnlace.
 *
 * @param {*} data
 * @param {*} ruta
 * @param {*} validate
 */
const procesarTexto = (data, ruta, validate) => {
  return new Promise((resolve, reject) => {
    let coincidencia;
    const promesas = [];

    while ((coincidencia = regexp.exec(data)) !== null) {
      promesas.push(crearObjetoEnlace(coincidencia, ruta, validate));
    }

    Promise.all(promesas).then((resultados) => {
      resolve(resultados);
    });
  });
};

/**
 * Devuelve un objeto con las llaves href, text, file y si está siendo validado, se agregan status y ok.
 *
 * @param {*} coincidencia
 * @param {*} ruta
 * @param {*} validate
 */
const crearObjetoEnlace = (coincidencia, ruta, validate) => {
  return new Promise((resolve, reject) => {
    const enlace = {
      href: coincidencia[2],
      text: coincidencia[1],
      file: ruta,
    };

    if (validate) {
      fetch(enlace.href).then((res) => {
        enlace.status = res.status;
        enlace.ok = res.ok;
        resolve(enlace);
      });
    } else {
      resolve(enlace);
    }
  });
};

module.exports = (ruta, opts) => {
  const validate = opts && opts.validate;

  return procesarRuta(ruta, validate);
};
