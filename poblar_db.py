import os
import sqlite3
from bs4 import BeautifulSoup

# --- Configuración ---
DB_FILE = 'ecoaves.db'
HTML_FOLDER = '.' # La carpeta actual donde están los archivos HTML

def extraer_datos_ave(html_content):
    """
    Extrae la información de un ave desde el contenido HTML de su ficha.
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    datos = {}

    # Diccionario para asegurar que todas las claves existan
    columnas = [
        'nombre_comun', 'nombre_cientifico', 'reino', 'filo', 'clase', 'orden', 
        'familia', 'genero', 'especie', 'tamano_poblacion', 'esperanza_vida', 
        'velocidad_maxima', 'peso', 'longitud', 'envergadura', 'descripcion', 
        'ruta_imagen', 'ruta_mapa'
    ]
    for col in columnas:
        datos[col] = None # Inicializa todas las claves con None

    try:
        # Extraer nombre común
        datos['nombre_comun'] = soup.find('h1').text.strip()
        
        # Extraer taxonomía
        taxonomy_items = soup.find('ul', class_='taxonomy').find_all('li')
        for item in taxonomy_items:
            # CORRECCIÓN: Se reemplaza la 'é' por 'e' para que coincida con la DB
            key = item.find('strong').text.strip().replace(':', '').lower().replace('é', 'e')
            value = item.text.replace(item.find('strong').text, '').strip()
            
            if key in datos:
                datos[key] = value

            if key == 'especie':
                datos['nombre_cientifico'] = value

        # Extraer estadísticas
        stats_divs = soup.find('div', class_='stats').find_all('div')
        for div in stats_divs:
            key_text = div.find('strong').text.strip().replace(':', '').lower().replace(' ', '_')
            value_text = div.find('span').text.strip()
            
            if 'tamaño' in key_text:
                datos['tamano_poblacion'] = value_text
            elif 'esperanza' in key_text:
                datos['esperanza_vida'] = value_text
            elif 'velocidad' in key_text:
                datos['velocidad_maxima'] = value_text
            elif 'peso' in key_text:
                datos['peso'] = value_text
            elif 'longitud' in key_text:
                datos['longitud'] = value_text
            elif 'envergadura' in key_text:
                datos['envergadura'] = value_text

        # Extraer descripción, imagen y mapa
        datos['descripcion'] = soup.find('p', class_='description').text.strip()
        datos['ruta_imagen'] = soup.find('div', class_='image-section').find('img')['src']
        datos['ruta_mapa'] = soup.find('div', class_='map-section').find('img')['src']

    except AttributeError as e:
        print(f"  -> Error procesando una sección del archivo: {e}")
        return None

    return datos

# --- Script Principal ---
if __name__ == "__main__":
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Limpiar la tabla antes de volver a insertar para no duplicar datos
    print("Limpiando la tabla 'aves' antes de la inserción...")
    cursor.execute("DELETE FROM aves;")
    conn.commit()
    print("Tabla 'aves' limpiada.")

    # Archivos HTML a ignorar
    archivos_a_ignorar = [
        'index.html', 'inicio.html', 'Ficha-Aves.html', 'calendario.html', 
        'conservacion.html', 'reservas.html', 'reservas-guias.html'
    ]

    print(f"\nBuscando archivos HTML en la carpeta: {os.path.abspath(HTML_FOLDER)}")
    
    contador_aves = 0
    # Recorrer todos los archivos en la carpeta del proyecto
    for filename in os.listdir(HTML_FOLDER):
        if filename.endswith('.html') and filename not in archivos_a_ignorar:
            print(f"Procesando archivo: {filename}...")
            
            filepath = os.path.join(HTML_FOLDER, filename)
            
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            datos_ave = extraer_datos_ave(content)

            if datos_ave:
                try:
                    # Prepara la sentencia SQL para insertar los datos
                    cursor.execute('''
                        INSERT INTO aves (
                            nombre_comun, nombre_cientifico, reino, filo, clase, orden, familia, 
                            genero, especie, tamano_poblacion, esperanza_vida, velocidad_maxima, 
                            peso, longitud, envergadura, descripcion, ruta_imagen, ruta_mapa
                        ) VALUES (
                            :nombre_comun, :nombre_cientifico, :reino, :filo, :clase, :orden, :familia, 
                            :genero, :especie, :tamano_poblacion, :esperanza_vida, :velocidad_maxima, 
                            :peso, :longitud, :envergadura, :descripcion, :ruta_imagen, :ruta_mapa
                        )
                    ''', datos_ave)
                    print(f"  -> ¡Éxito! '{datos_ave.get('nombre_comun', 'Nombre no encontrado')}' añadido a la base de datos.")
                    contador_aves += 1
                except sqlite3.InterfaceError as e:
                    print(f"  -> Error de datos al insertar '{datos_ave.get('nombre_comun')}': {e}")
                except sqlite3.Error as e:
                    print(f"  -> Error general de base de datos: {e}")
            else:
                print(f"  -> No se pudieron extraer datos válidos del archivo.")

    conn.commit()
    conn.close()
    
    print(f"\n¡Proceso completado! Se han añadido {contador_aves} aves a la base de datos.")