import sqlite3
import os
from flask import Flask, jsonify, send_from_directory

# --- Configuración Inicial ---
app = Flask(__name__)
DB_FILE = 'ecoaves.db'

def conectar_db():
    """Crea una conexión a la base de datos."""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row 
    return conn

# --- Rutas de la API (para obtener datos) ---

@app.route('/api/aves')
def obtener_todas_las_aves():
    """Devuelve una lista de todas las aves en formato JSON."""
    conn = conectar_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM aves ORDER BY nombre_comun;")
    lista_aves_raw = cursor.fetchall()
    conn.close()
    lista_aves = [dict(row) for row in lista_aves_raw]
    return jsonify(lista_aves)

@app.route('/api/ave/<int:id_ave>')
def obtener_ave_por_id(id_ave):
    """Busca UNA SOLA ave por su ID y devuelve sus datos."""
    conn = conectar_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM aves WHERE id = ?;", (id_ave,))
    ave_raw = cursor.fetchone()
    conn.close()
    if ave_raw is None:
        return jsonify({"error": "Ave no encontrada"}), 404
    return jsonify(dict(ave_raw))

# --- Rutas para Servir las Páginas y Archivos (¡LA PARTE NUEVA!) ---

@app.route('/')
def servir_inicio():
    """Sirve la página de inicio principal."""
    return send_from_directory('.', 'inicio.html')

@app.route('/<path:path>')
def servir_archivos(path):
    """
    Sirve cualquier otro archivo solicitado (HTML, CSS, JS, imágenes).
    """
    # Medida de seguridad para no permitir salir del directorio del proyecto
    if ".." in path:
        return "Ruta no válida", 404

    # Si el archivo no existe, devuelve un error 404
    if not os.path.exists(path):
        return "Archivo no encontrado", 404

    return send_from_directory('.', path)

# --- Ejecución del Servidor ---

if __name__ == '__main__':
    app.run(debug=True, port=5000)
    