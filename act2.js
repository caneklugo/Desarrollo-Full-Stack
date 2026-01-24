const inputId = document.querySelector("#idPost")
const btn = document.querySelector("#btnBuscar")
const contenedor = document.querySelector("#showPost")

let listaIds = []

inputId.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addTaskButton.click()
    }
})

const getPost = async () => {
    const id = inputId.value
    if (listaIds.includes(id)) {
        console.log("Este post ya está en la pantalla")
        return
    }
    try { // fetch
        const respuesta = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
        const datos = await respuesta.json();
        // Destructuring
        const { title, body } = datos;
        // Spread Operator 
        const infoPost = {datos, leido: true }
        crearTarjeta(infoPost)
        listaIds.push(id)
    } catch (error) {
        console.log("Error al buscar")
    }
}

const crearTarjeta = (post) => {
    const { id, title, body } = post;
    const div = document.createElement("div")
    div.classList.add("tarjeta")
    div.innerHTML =
        `<h3>${id} - ${title}</h3>
        <p class="detalle oculto">${body}</p>`
    div.addEventListener("click", () => {
        const parrafo = div.querySelector(".detalle");
        parrafo.classList.toggle("oculto");
    })
    contenedor.appendChild(div)
};

btn.addEventListener("click", getPost)