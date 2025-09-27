CREATE TABLE IF NOT EXISTS "aves" (
	"id"	INTEGER,
	"nombre_comun"	TEXT,
	"nombre_cientifico"	TEXT,
	"reino"	TEXT,
	"filo"	TEXT,
	"clase"	TEXT,
	"orden"	TEXT,
	"familia"	TEXT,
	"genero"	TEXT,
	"especie"	TEXT,
	"tamano_poblacion"	TEXT,
	"esperanza_vida"	TEXT,
	"velocidad_maxima"	TEXT,
	"peso"	TEXT,
	"longitud"	TEXT,
	"envergadura"	TEXT,
	"descripcion"	TEXT,
	"ruta_imagen"	TEXT,
	"ruta_mapa"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE IF NOT EXISTS "reservas" (
	"id"	INTEGER,
	"nombre"	TEXT,
	"descripcion"	TEXT,
	"latitud"	REAL,
	"longitud"	REAL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "guias" (
	"id"	INTEGER,
	"nombre"	TEXT,
	"especialidad"	TEXT,
	"id_reserva"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );
