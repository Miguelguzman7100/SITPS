var map = L.map('map').setView([4.628138990880535, -74.06591620395287], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
var marker = L.marker([4.628138990880535, -74.06591620395287]).addTo(map);


<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cargador de GeoJSON - Paraderos SITP</title>
    
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-color: #f0f2f5;
            color: #333;
            line-height: 1.6;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        header {
            background: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
        }
        
        h1 {
            margin-bottom: 10px;
            font-size: 2.2rem;
        }
        
        .description {
            max-width: 800px;
            margin: 0 auto 20px;
            font-size: 1.1rem;
        }
        
        .content {
            display: flex;
            flex-direction: column;
            padding: 20px;
        }
        
        @media (min-width: 768px) {
            .content {
                flex-direction: row;
            }
        }
        
        .map-container {
            flex: 1;
            min-height: 450px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        
        #map {
            width: 100%;
            height: 100%;
            min-height: 450px;
        }
        
        .controls {
            width: 100%;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        @media (min-width: 768px) {
            .controls {
                width: 300px;
                margin-right: 20px;
                margin-bottom: 0;
            }
        }
        
        .instructions {
            background: #e8f4fc;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .instructions h3 {
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .instructions ol {
            padding-left: 20px;
        }
        
        .instructions li {
            margin-bottom: 8px;
        }
        
        .file-input {
            margin: 15px 0;
        }
        
        button {
            background: #3498db;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            width: 100%;
            transition: background 0.3s;
            margin-bottom: 10px;
        }
        
        button:hover {
            background: #2980b9;
        }
        
        .secondary-btn {
            background: #2c3e50;
        }
        
        .secondary-btn:hover {
            background: #1a252f;
        }
        
        .status {
            margin-top: 15px;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
        }
        
        .success {
            background: #d4edda;
            color: #155724;
        }
        
        .error {
            background: #f8d7da;
            color: #721c24;
        }
        
        footer {
            text-align: center;
            padding: 20px;
            background: #2c3e50;
            color: white;
            margin-top: 20px;
        }
        
        .legend {
            padding: 10px;
            background: white;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin-top: 10px;
        }
        
        .legend h4 {
            margin: 0 0 10px;
            text-align: center;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
        }
        
        .legend-color {
            width: 20px;
            height: 20px;
            margin-right: 8px;
            border-radius: 50%;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Cargador de GeoJSON - Paraderos SITP</h1>
            <p class="description">Carga y visualiza archivos GeoJSON en un mapa Leaflet. Perfecto para visualizar paraderos del SITP.</p>
        </header>
        
        <div class="content">
            <div class="controls">
                <div class="instructions">
                    <h3>Instrucciones de uso:</h3>
                    <ol>
                        <li>Selecciona un archivo GeoJSON con el botón "Seleccionar archivo"</li>
                        <li>Haz clic en "Cargar GeoJSON" para visualizarlo en el mapa</li>
                        <li>Usa "Centrar mapa" para ajustar la vista</li>
                        <li>Haz clic en cualquier paradero para ver su información</li>
                    </ol>
                </div>
                
                <div class="file-input">
                    <input type="file" id="geojson-file" accept=".geojson,.json" />
                </div>
                
                <button onclick="cargarGeoJSON()">Cargar GeoJSON</button>
                <button onclick="centrarMapa()" class="secondary-btn">Centrar mapa</button>
                <button onclick="limpiarMapa()" class="secondary-btn">Limpiar mapa</button>
                
                <div id="status" class="status"></div>
                
                <div class="legend">
                    <h4>Leyenda</h4>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #3498db;"></div>
                        <span>Paradero SITP</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #2ecc71;"></div>
                        <span>Zona de cobertura</span>
                    </div>
                </div>
            </div>
            
            <div class="map-container">
                <div id="map"></div>
            </div>
        </div>
        
        <footer>
            <p>© 2023 - Cargador de GeoJSON para Leaflet | Diseñado para estudios de ingeniería</p>
        </footer>
    </div>

    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    
    <script>
        // Inicializar el mapa
        var map = L.map('map').setView([4.6097, -74.0817], 12); // Centrado en Bogotá
        
        // Añadir capa base de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Variable para almacenar la capa actual del GeoJSON
        var capaGeoJSON = null;
        
        /**
         * FUNCIÓN PARA CARGAR Y MOSTRAR ARCHIVO GEOJSON
         * Esta función lee un archivo GeoJSON seleccionado por el usuario
         * y lo muestra en el mapa de Leaflet
         */
        function cargarGeoJSON() {
            // Obtener el archivo seleccionado por el usuario
            const archivoInput = document.getElementById('geojson-file');
            const archivo = archivoInput.files[0];
            
            // Verificar si se seleccionó un archivo
            if (!archivo) {
                mostrarEstado('Por favor, selecciona un archivo GeoJSON primero.', 'error');
                return;
            }
            
            // Crear un FileReader para leer el archivo
            const lector = new FileReader();
            
            // Definir lo que sucede cuando se carga el archivo
            lector.onload = function(e) {
                try {
                    // Intentar parsear el contenido del archivo como JSON
                    const datosGeoJSON = JSON.parse(e.target.result);
                    
                    // Procesar los datos GeoJSON
                    procesarGeoJSON(datosGeoJSON);
                    
                    // Mostrar mensaje de éxito
                    mostrarEstado('GeoJSON cargado exitosamente!', 'success');
                } catch (error) {
                    // Manejar errores de parsing
                    console.error('Error al parsear JSON:', error);
                    mostrarEstado('El archivo no tiene un formato JSON válido.', 'error');
                }
            };
            
            // Definir lo que sucede en caso de error al leer el archivo
            lector.onerror = function() {
                mostrarEstado('Error al leer el archivo.', 'error');
            };
            
            // Leer el archivo como texto
            lector.readAsText(archivo);
        }
        
        /**
         * FUNCIÓN PARA PROCESAR Y MOSTRAR LOS DATOS GEOJSON EN EL MAPA
         * @param {Object} datos - Objeto GeoJSON con los datos geográficos
         */
        function procesarGeoJSON(datos) {
            // Remover la capa anterior si existe
            if (capaGeoJSON) {
                map.removeLayer(capaGeoJSON);
            }
            
            // Crear una nueva capa con los datos GeoJSON
            capaGeoJSON = L.geoJSON(datos, {
                // Estilo para los elementos del GeoJSON
                style: function(feature) {
                    // Personalizar el estilo según el tipo de geometría
                    if (feature.geometry.type === 'Point') {
                        return {
                            color: '#3498db',
                            weight: 2,
                            opacity: 0.8,
                            fillColor: '#3498db',
                            fillOpacity: 0.8,
                            radius: 6
                        };
                    } else {
                        return {
                            color: '#2ecc71',
                            weight: 2,
                            opacity: 0.8,
                            fillColor: '#2ecc71',
                            fillOpacity: 0.4
                        };
                    }
                },
                
                // Para puntos, crear círculos en lugar de marcadores predeterminados
                pointToLayer: function(feature, latlng) {
                    return L.circleMarker(latlng, {
                        radius: 6,
                        fillColor: "#3498db",
                        color: "#000",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                    });
                },
                
                // Función para mostrar información al hacer clic en un elemento
                onEachFeature: function(feature, layer) {
                    // Verificar si el feature tiene propiedades
                    if (feature.properties) {
                        // Crear contenido para el popup
                        let contenidoPopup = '<div style="padding: 10px; min-width: 150px;">';
                        contenidoPopup += '<h4 style="margin-bottom: 10px; color: #2c3e50;">Información del paradero</h4>';
                        
                        // Recorrer todas las propiedades y mostrarlas
                        for (let propiedad in feature.properties) {
                            contenidoPopup += `<p style="margin-bottom: 5px;"><strong>${propiedad}:</strong> ${feature.properties[propiedad]}</p>`;
                        }
                        
                        contenidoPopup += '</div>';
                        
                        // Asignar el popup a la capa
                        layer.bindPopup(contenidoPopup);
                    }
                }
            }).addTo(map); // Añadir la capa al mapa
            
            // Ajustar la vista del mapa para que muestre toda la capa
            map.fitBounds(capaGeoJSON.getBounds());
            
            // Mostrar información en consola para debugging
            console.log('GeoJSON cargado exitosamente:', datos);
        }
        
        /**
         * FUNCIÓN PARA CENTRAR EL MAPA EN LOS DATOS CARGADOS
         */
        function centrarMapa() {
            if (capaGeoJSON) {
                map.fitBounds(capaGeoJSON.getBounds());
                mostrarEstado('Mapa centrado en los datos.', 'success');
            } else {
                mostrarEstado('No hay datos cargados para centrar.', 'error');
            }
        }
        
        /**
         * FUNCIÓN PARA LIMPIAR EL MAPA
         */
        function limpiarMapa() {
            if (capaGeoJSON) {
                map.removeLayer(capaGeoJSON);
                capaGeoJSON = null;
                mostrarEstado('Mapa limpiado correctamente.', 'success');
            } else {
                mostrarEstado('No hay datos que limpiar.', 'error');
            }
        }
        
        /**
         * FUNCIÓN PARA MOSTRAR ESTADO DE LA OPERACIÓN
         * @param {string} mensaje - Mensaje a mostrar
         * @param {string} tipo - Tipo de mensaje: 'success' o 'error'
         */
        function mostrarEstado(mensaje, tipo) {
            const statusElement = document.getElementById('status');
            statusElement.textContent = mensaje;
            statusElement.className = 'status ' + tipo;
            
            // Limpiar el mensaje después de 5 segundos
            setTimeout(() => {
                statusElement.textContent = '';
                statusElement.className = 'status';
            }, 5000);
        }
        
        // Cargar automáticamente el archivo paraderos-sitp.geojson si está disponible
        // Nota: Por razones de seguridad, los navegadores no permiten cargar archivos locales
        // directamente. Esta función está preparada para cuando el archivo esté en un servidor.
        function cargarArchivoPorDefecto() {
            // Esta es solo una demostración de cómo cargarías un archivo específico
            // En un entorno real, necesitarías un servidor para cargar el archivo
            console.log("Para cargar 'paraderos-sitp.geojson', necesitas tenerlo en tu servidor.");
        }
        
        // Llamar a la función de carga por defecto al iniciar
        window.onload = cargarArchivoPorDefecto;
    </script>
</body>
</html>