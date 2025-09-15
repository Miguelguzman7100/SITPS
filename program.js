//crear un objeto mapa desde la clase L que es leaflet
// L representa a  la biblioteca leaflet 
// Por ejemplo L.map () permite llamar a la funcion map() para crear mapas 

var map = L.map('map');
//objeto: un ejemplar de una clase que tiene atributos y comportamiento definido
// definir los valores iniciales para el objeto map 
// . setview(arreglo con la LAT. longitud del centro del mapa, entero que indica la zona)

map.setView([4.628138990880535, -74.06591620395287], 13);

//crear un objeto capa de teseñas (mapa base)
//L.titlelayer(url de donde voy a "extraer" el mapa, un Json con los valores de config)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
//cargar un archivo Geojson
//1. abrir el archivo. en js hay que tener cuidado con procesos que sean demorados 
//porque js no es sincrono. Es decir. si una sentencia se demora , js 
//continua con otra 

async function leerGeoJSON(url) {
    // fetch(): almacenar recurso (obtener recurso)
    var response = await fetch(url);

    return await response.json();
}

var myfile = leerGeoJSON("map.geojson");

const geolayer = L.geoJSON(myfile);
geolayer.addTo(map)