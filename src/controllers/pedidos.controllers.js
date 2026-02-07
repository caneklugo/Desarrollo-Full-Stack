const {PedidosRepository} = require('../repositories/pedidos.repository');

const repo = new PedidosRepository()

function getAll(req, res) {
    return res.json(repo.getAll())
}

function getById(req, res) {
    const id = Number(req.params.id)
    const pedido = repo.getById(id)
    if (!pedido) {
        return res.status(404).json({ error: "Pedido no encontrado" })
    }
    return res.json(pedido)
}

function create(req, res) {
    const { producto, cantidad } = req.body
    if (!producto || typeof producto !== 'string') {
        return res.status(400).json({ error: "Producto invalido" })
    }
    const cantidadNumber = Number(cantidad)
    if (cantidadNumber <= 0) {
        return res.status(400).json({ error: "Cantidad invalida" })
    }
    const nuevo = repo.create(producto, cantidadNumber)
    return res.status(201).json(nuevo)
}

function update(req, res) {
    const id = Number(req.params.id);
    const { estado, producto, cantidad } = req.body; // Extraemos los posibles campos

    const pedidoActual = repo.getById(id);
    if (!pedidoActual) {
        return res.status(404).json({ error: "Pedido no encontrado" });
    }

    // confirmado y cancelado no se pueden modificar
    const estadosFinales = ['confirmado', 'cancelado'];
    if (estadosFinales.includes(pedidoActual.estado)) {
        return res.status(400).json({ 
            error: `No se puede modificar un pedido que ya está ${pedidoActual.estado}` 
        });
    }

    // no actualizar todo si no viene en el body
    const datosActualizados = {producto: producto || pedidoActual.producto, cantidad: cantidad !== undefined ? Number(cantidad) : pedidoActual.cantidad, estado: estado || pedidoActual.estado};

    // validar si cambia el estado que sea válido
    if (estado && !estadosFinales.includes(estado) && estado !== 'pendiente') {
        return res.status(400).json({ error: "Estado inválido" });
    }

    const pedidoActualizado = repo.update(id, datosActualizados);
    
    return res.status(200).json(pedidoActualizado);
}

function remove(req, res) {
    const id = Number(req.params.id)
    const pedido = repo.getById(id)
    if (!pedido) {
        return res.status(404).json({ error: "Pedido no encontrado" })
    }

    if (pedido.estado !== 'pendiente') {
        return res.status(400).json({ error: "Solo se pueden eliminar pedidos en estado pendiente" })
    }
    repo.delete(id)
    return res.status(204).json(`Pedido Id: ${id} eliminado`)
}

module.exports = { getAll, getById, create, update, remove }