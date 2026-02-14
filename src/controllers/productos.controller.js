const { ProductosRepository } = require('../repositories/productos.repository');

const repo = new ProductosRepository();

async function getAll(req, res) {
  const productos = await repo.getAll();
  console.log(productos)
  return res.json(productos)
}

async function getAllVisible(req, res) {
  const productos = await repo.getAllActive()
  return res.json(productos)
}

async function getById(req, res) {
  const id = Number(req.params.id)
  const producto = await repo.getById(id)

  if (!producto) {
    return res.status(404).json({error: 'Producto no encontrado'})
  }

  return res.json(producto)
}

async function create(req, res) {
  const { nombre, precio } = req.body;

  if (!nombre || typeof nombre !== 'string') {
    return res.status(400).json({error: 'Nombre inválido'})
  }

  const precioNumber = Number(precio);
  if (precio <= 0) {
    return res.status(400).json({error: 'Precio inválido'})
  }

  const nuevo = await repo.create(nombre, precioNumber)
  return res.status(201).json(nuevo)
}

function update(req, res) {
  const id = Number(req.params.id);
  const actualizado = repo.update(id, req.body)

  if (!actualizado) {
    return res.status(404).json({error: 'No encontrado'})
  }

  return res.json(actualizado)
}

function remove(req, res) {
  const id = Number(req.params.id);
  const ok = repo.delete(id)

  if (!ok) {
    return res.status(404).json({error: 'No encontrado'})
  }

  return res.status(204).send()
}

async function search(req, res) {
  try {
    const { nombre, minPrecio, maxPrecio, page, limit } = req.query;

    const pageNum = parseInt(page) || 1; // Si no envían page, usa 1
    const limitNum = parseInt(limit) || 10; // Si no envían limit, usa 10
    
    if (pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ error: 'Page y Limit deben ser números positivos' });
    }

    const filtros = {
      nombre: nombre,
      minPrecio: minPrecio ? Number(minPrecio) : undefined,
      maxPrecio: maxPrecio ? Number(maxPrecio) : undefined,
      page: pageNum,
      limit: limitNum
    };

    if ((filtros.minPrecio && isNaN(filtros.minPrecio)) || (filtros.maxPrecio && isNaN(filtros.maxPrecio))) {
      return res.status(400).json({ error: 'Los precios deben ser numéricos' });
    }

    const resultado = await repo.search(filtros);

    return res.json({
      data: resultado.data,
      page: pageNum,
      limit: limitNum,
      total: resultado.total
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { getAll, getAllVisible, getById, create, update, remove, search };