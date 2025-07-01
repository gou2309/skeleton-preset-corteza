import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
}

export async function initDb() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS zonas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tienda TEXT,
      zona_colonia TEXT,
      ciudad_estado TEXT,
      giro_negocio TEXT,
      ubicacion_exacta TEXT,
      nivel_competencia TEXT,
      publico_objetivo TEXT,
      rango_precios TEXT,
      trafico_personas TEXT,
      anuncios_entrelazados TEXT,
      app_activa TEXT,
      privacidad TEXT,
      consentimiento_datos TEXT,
      fecha_actualizacion TEXT
    )
  `);
  await db.close();
}

export async function getZonas(shop) {
  const db = await openDb();
  const zonas = await db.all('SELECT * FROM zonas WHERE tienda = ?', [shop]);
  await db.close();
  return zonas;
}

export async function saveZona(shop, zona) {
  const db = await openDb();
  const {
    zona_colonia,
    ciudad_estado,
    giro_negocio,
    ubicacion_exacta,
    nivel_competencia,
    publico_objetivo,
    rango_precios,
    trafico_personas,
    anuncios_entrelazados,
    app_activa,
    privacidad,
    consentimiento_datos
  } = zona;
  const result = await db.run(
    `INSERT INTO zonas (
      tienda,
      zona_colonia,
      ciudad_estado,
      giro_negocio,
      ubicacion_exacta,
      nivel_competencia,
      publico_objetivo,
      rango_precios,
      trafico_personas,
      anuncios_entrelazados,
      app_activa,
      privacidad,
      consentimiento_datos,
      fecha_actualizacion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      shop,
      zona_colonia,
      ciudad_estado,
      giro_negocio,
      ubicacion_exacta,
      nivel_competencia,
      publico_objetivo,
      rango_precios,
      trafico_personas,
      anuncios_entrelazados,
      app_activa,
      privacidad,
      consentimiento_datos,
      new Date().toISOString()
    ]
  );
  await db.close();
  return result.lastID;
}
