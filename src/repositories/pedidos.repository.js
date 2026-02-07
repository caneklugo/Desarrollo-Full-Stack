class PedidosRepository {
    constructor() {
        this.pedidos = [];
        this.nextId = 1;
        // pedido nuevo en estado "pendiente"
        this.estado = "pendiente";
    }

    getAll() {
        return this.pedidos;
    }

    getById(id) {
        return this.pedidos.find(pedido => pedido.id === id);
    }

    create(producto, cantidad) {
        const newPedido = { id: this.nextId++, producto, cantidad, estado: this.estado };
        this.pedidos.push(newPedido);
        return newPedido;
    }

    update(id, data) {
        const pedido = this.getById(id);
        if (pedido) {
            if (data.producto) pedido.producto = data.producto;
            if (data.cantidad !== undefined) pedido.cantidad = data.cantidad;
            if (data.estado) pedido.estado = data.estado;
            return pedido;
        }
        return null;
    }

    delete(id) {
        const index = this.pedidos.findIndex(pedido => pedido.id === id);
        if (index !== -1) {
            return this.pedidos.splice(index, 1)[0];
        }
        return null;
    }
}

module.exports = { PedidosRepository }