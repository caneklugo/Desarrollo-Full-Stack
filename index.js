const express = require('express');
const {router: pedidosRouter} = require('./src/routes/pedidos.routes')

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('API OK');
})

app.use('/pedidos', pedidosRouter);

app.listen(3000, () => {
  console.log(`Servidor escuchando en el puerto 3000`)
})