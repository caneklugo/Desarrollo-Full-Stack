const { pool } = require('../db');

class ProductosRepository {

  async getAll() {
    const result = await pool.query('select id, nombre, precio from productos;');
    return result.rows;
  }

  async getAllActive() {
    const result = await pool.query('select id, nombre, precio from productos where activo = true;');
    return result.rows;
  }

  async getById(id) {
    const result = await pool.query(
      'select id, nombre, precio, stock, descripcion from productos where activo = true and id = $1;', [id]
    );
    return result.rows[0];
  }

  async create(nombre, precio) {
    const result = await pool.query(
      'insert into productos (nombre, precio) values ($1,$2) returning id, nombre, precio;', [nombre, precio]
    );
    return result.rows[0];
  }

  async update(id, data) {
    const result = await pool.query(
      'UPDATE productos SET nombre = coalesce($1, nombre), precio = coalesce($2, precio) WHERE id = $3 returning id, nombre, precio',
      [data.nombre ?? null, data.precio ?? null, data.id]
    )
    return result.rows[0] || null
  }

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM productos WHERE id = $1 returning id', [id]
    )
    return result.rows[0] || null
  }

  async search({ nombre, minPrecio, maxPrecio, page, limit }) {
    let queryBase = 'SELECT id, nombre, precio FROM productos WHERE activo = true';
    let countQueryBase = 'SELECT COUNT(*) as total FROM productos WHERE activo = true';
    
    const values = [];
    let counter = 1; 

    if (nombre) {
      queryBase += ` AND nombre ILIKE $${counter}`;
      countQueryBase += ` AND nombre ILIKE $${counter}`;
      values.push(`%${nombre}%`); 
      counter++;
    }

    if (minPrecio !== undefined) {
      queryBase += ` AND precio >= $${counter}`;
      countQueryBase += ` AND precio >= $${counter}`;
      values.push(minPrecio);
      counter++;
    }

    if (maxPrecio !== undefined) {
      queryBase += ` AND precio <= $${counter}`;
      countQueryBase += ` AND precio <= $${counter}`;
      values.push(maxPrecio);
      counter++;
    }

    const countResult = await pool.query(countQueryBase, values);
    const total = parseInt(countResult.rows[0].total, 10);

    queryBase += ' ORDER BY id DESC';

    const offset = (page - 1) * limit;
    
    queryBase += ` LIMIT $${counter} OFFSET $${counter + 1}`;
    
    const finalValues = [...values, limit, offset]; 

    const result = await pool.query(queryBase, finalValues);

    return {
      data: result.rows,
      total: total
    };
  }
}

module.exports = { ProductosRepository };