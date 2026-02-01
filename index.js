const express = require('express')
const app = express()
const PORT = 5000

app.use(express.json())

let perros = []

// METODOS CRUD PARA PERROS

// Leer
app.get('/perros', (req, res) => {
    res.json(perros)
})

// Crear
app.post('/perros', (req, res) => {
    const perro = req.body
    // validacion de body completo de 3 atributos
    if (!perro.nombre || perro.edad === undefined || !perro.tamaño) {
        res.status(400).json("Información incompleta")
        return
    }
    // nombre no vacio
    if (perro.nombre.trim() === "") {
        res.status(400).send("Nombre no puede estar vacío")
        return
    }
    // edad igual o mayor a 0
    if (perro.edad < 0) {
        res.status(400).send("Edad debe ser igual o mayor a 0")
        return
    }
    // tamaño no vacio
    if (perro.tamaño.trim() === "") {
        res.status(400).send("Tamaño no puede estar vacío")
        return
    }
     else {
        perros.push(perro)
        res.status(201).json("Perrito enviado correctamente")
    }
})

// Actualizar
app.put('/perros/:id', (req, res) => {
    const id = req.params.id
    const perro = req.body
    // validacion de id
    if (id < 0 || id >= perros.length) {
        res.status(404).send("ID no existe")
        return
    }
    // validar cada atributo si existe en el body
    if (perro.nombre !== undefined) {
        if (perro.nombre.trim() === "") {
            res.status(400).send("Nombre no puede estar vacío")
            return
        }
        perros[id].nombre = perro.nombre
    }
    if (perro.edad !== undefined) {
        if (perro.edad < 0) {
            res.status(400).send("Edad debe ser igual o mayor a 0")
            return
        }
        perros[id].edad = perro.edad
    }
    if (perro.tamaño !== undefined) {
        if (perro.tamaño.trim() === "") {
            res.status(400).send("Tamaño no puede estar vacío")
            return
        }
        perros[id].tamaño = perro.tamaño
    }    
    else {
        res.status(200).send("Perrito actualizado")
    }
})

// Borrar
app.delete('/perros/:id', (req, res) => {
    const id = req.params.id
    // validacion de id
    if (id < 0 || id >= perros.length) {
        res.status(404).send("ID no existe")
        return
    }
    else {
        perros.splice(id, 1)
        res.status(200).send('Perrito borrado')
    }
})

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
})