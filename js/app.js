class Producto { 
    constructor(id, nombre, precio, descripcion, img, alt, categoria, stock, cantidad = 1) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.descripcion = descripcion;
        this.cantidad = cantidad;
        this.img = img;
        this.alt = alt;
        this.categoria = categoria;
        this.stock = stock;
    }

    //Aumentar y dismuir las cantidades de los productos en el carrito
    aumentarCantidad(){
        this.cantidad++
    }

    disminuirCantidad(){
        if (this.cantidad > 1){
            this.cantidad--
        }
    }

    estaAgotado() {
        return this.stock <= 0
    }
    
    actualizarStock(cantidad) {
        const stockDisponible = this.stock >= this.cantidad
        if (stockDisponible) {
            this.stock -= cantidad
        }
        return stockDisponible
        }
    

    //Modal carrito
    descripcionCarrito(){
        return `
        <div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${this.img}" class="img-fluid rounded-start" alt="${this.alt}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${this.nombre}</h5>
                        <p class="card-text">Cantidad:
                        <button class="btn btn-cantidad" id="disminuir-${this.id}"><i class="fa-solid fa-minus"></i></button>
                        ${this.cantidad > 0 ? this.cantidad : "Agotado"}
                        <button class="btn btn-cantidad" id="aumentar-${this.id}"><i class="fa-solid fa-plus"></i></button>
                        </p>
                        <p class="card-text">Precio: $${this.precio * this.cantidad}</p>
                        <button class="btn-eliminar mt-5" id = "eliminarprod-${this.id}">
                            <i class="fa-solid fa-trash"></i>
                        </button>                    
                    </div>
                </div>
            </div>
        </div>`
    }

    //Card productos
    descripcionProducto(){
        return `
        <div class="card border-light custom-card mx-auto" style="width: 18rem;">
            <img src="${this.img}" class="card-img-top card_img" alt="${this.alt}">
            <div class="card-body">
                <h5 class="card-title fw-bold nombre_producto">${this.nombre}</h5>
                <p class="card-text descripcion_producto">${this.descripcion}</p>
                <p class="card-text fw-bold descripcion_precio">USD $${this.precio}</p>
                <button class="btn btn-cart" data-product-id="${this.id}">Añadir al carrito</button>
            </div>
        </div>`
    }
}

class ProductoController {
    constructor() {
        this.listaProductos = []
    }

    agregar(producto) {
        if( producto instanceof Producto){
            this.listaProductos.push(producto)
        }
    }

    //Productos que provienen de la API creada
     async preparar_contenedor_productos(){
        this.listaProductosJSON = await fetch("productos.json")
        let listaProductosJS = await this.listaProductosJSON.json()

        listaProductosJS.forEach(producto => {
            let nuevoProducto = new Producto(producto.id, producto.nombre, producto.precio, producto.descripcion, producto.img, producto.alt, producto.categoria, producto.stock, producto.cantidad)
            this.agregar(nuevoProducto)
        })

        this.mostrarEnDOM()
    }

    mostrarEnDOM(categoriaSeleccionada) {
        let contenedor_productos = document.getElementById("contenedor_productos")
        let productosFiltrados = []

        this.listaProductos.forEach(producto => {
            if (!categoriaSeleccionada || producto.categoria === categoriaSeleccionada) {
                productosFiltrados.push(producto)
            }
        })

        contenedor_productos.innerHTML = ""

        productosFiltrados.forEach(producto => {
            contenedor_productos.innerHTML += producto.descripcionProducto()
        })

    const btns_ap = document.querySelectorAll('.btn-cart')

    btns_ap.forEach((btn) => {
        const productoId = btn.getAttribute("data-product-id")
        const producto = productosFiltrados.find((p) => p.id === parseInt(productoId))


            btn.addEventListener("click", () => {
                if (producto.stock > 0){
                carrito.agregar(producto)
                carrito.guardarEnStorage()
                carrito.mostrarEnDOM()
                carrito.actualizarCantidadCarrito()
                carrito.actualizarCantidadCarritoEnIcono()
            } else {
                carrito.mostrarToastifyStock(producto)
            }
            })
        })
    

    carrito.actualizarCantidadCarrito()
        const carritoCount = document.getElementById("carrito-count");
        const cantidadEnCarrito = carrito.listaCarrito.reduce((total, producto) => total + producto.cantidad, 0)
        carritoCount.textContent = cantidadEnCarrito.toString();
    }
}


class Carrito {
    constructor() {
        this.localStorageKey = "listaCarrito"
        this.listaCarrito = JSON.parse(localStorage.getItem(this.localStorageKey)) || []
    }

    agregar(productoAgregar) {
        const productoId = productoAgregar.id
        let existe = this.listaCarrito.find(producto => producto.id == productoId)
    
        if (existe) {
            const cantidad = productoAgregar.cantidad
    
            if (existe.actualizarStock(cantidad)) {
                existe.aumentarCantidad(cantidad)
                existe.precioTotal = existe.precio * existe.cantidad
            } else {
                this.mostrarToastifyStock()
            }
        } else if (productoAgregar instanceof Producto) {
            if (productoAgregar.actualizarStock(1)) {
                this.listaCarrito.push(productoAgregar)
                productoAgregar.precioTotal = productoAgregar.precio
                this.mostrarToastifyAñadirAlCarrito()
            } else {
                this.mostrarToastifyStock()
            }
        }
        this.guardarEnStorage()
        
    }
        
    eliminar(productoAeliminar){
        let indice = this.listaCarrito.findIndex(producto => producto.id == productoAeliminar.id)
        this.listaCarrito.splice(indice,1)

        this.guardarEnStorage()
    }

    guardarEnStorage(){
        let listaCarritoJSON = JSON.stringify(this.listaCarrito)
        localStorage.setItem(this.localStorageKey, listaCarritoJSON)
    }

    recuperarStorage(){
        let listaCarritoJSON = localStorage.getItem(this.localStorageKey)
        let listaCarritoJS = JSON.parse(listaCarritoJSON)
        let listaAux = []
        listaCarritoJS.forEach( producto => {
            
            let nuevoProducto = new Producto(producto.id, producto.nombre, producto.precio, producto.descripcion, producto.img, producto.alt, producto.cantidad)
            listaAux.push(nuevoProducto)
        })
        this.listaCarrito = listaAux
    }

    mostrarEnDOM() {
        let contenedor_carrito = document.getElementById("contenedor_carrito")
        contenedor_carrito.innerHTML = ""
    
        this.listaCarrito.forEach(producto => {
            contenedor_carrito.innerHTML += producto.descripcionCarrito()
        })
    
        this.eventoEliminar()
        this.eventoAumentarCantidad()
        this.eventoDisminuirCantidad()
        this.mostrarTotal()
        this.actualizarCantidadCarritoEnIcono()
    }
    

    eventoEliminar(){
        this.listaCarrito.forEach(producto => {
            const btn_eliminar = document.getElementById(`eliminarprod-${producto.id}`)
            btn_eliminar .addEventListener("click", () => {
                this.eliminar(producto)
                this.guardarEnStorage()
                this.mostrarEnDOM()
                this.mostrarToastifyEliminar()
            })
        })
    }

    eventoAumentarCantidad(){
        this.listaCarrito.forEach(producto => {
            const btn_aumentar = document.getElementById(`aumentar-${producto.id}`)
            btn_aumentar.addEventListener("click", () => {
                producto.aumentarCantidad()
                this.mostrarEnDOM()
            })
        })
    }

    eventoDisminuirCantidad(){
        this.listaCarrito.forEach(producto => {
            const btn_disminuir = document.getElementById (`disminuir-${producto.id}`)
            btn_disminuir.addEventListener("click", () => {
                producto.disminuirCantidad()
                this.mostrarEnDOM()
            })
        })
    }

    calcularCantidadTotal() {
        return this.listaCarrito.reduce((total, producto) => total + producto.cantidad, 0)
    }

    
    actualizarCantidadCarrito(){
        const carritoCount = document.getElementById("carrito-count")
        const cantidadEnCarrito = this.calcularCantidadTotal()
        carritoCount.textContent = cantidadEnCarrito.toString
    }

    actualizarCantidadCarritoEnIcono() {
        const carritoCount = document.getElementById("carrito-count")
        const cantidadEnCarrito = this.calcularCantidadTotal()
        carritoCount.textContent = cantidadEnCarrito.toString()
    }

    calcularTotal() {
        return this.listaCarrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0)
    }
    
    mostrarTotal(){
        const precio_total = document.getElementById("precio_total")
        precio_total.innerText = `Precio total: $${this.calcularTotal()}`
    }

    mostrarToastifyAñadirAlCarrito(){
        {
            Toastify({
                text: "¡Increíble elección! 😍 Tu artículo está listo en el carrito",
                duration: 2000,
                newWindow: true,
                close: true,
                gravity: "bottom", 
                position: "right", 
                stopOnFocus: true, 
                style: {
                background: "white",
                color: "black",
                },
                onClick: function(){} 
              }).showToast();
                }
    }

    mostrarToastifyEliminar(){
Toastify({
    text: "¡Producto voló del carrito! 🚀",
    duration: 2000,
    newWindow: true,
    close: true,
    gravity: "bottom", 
    position: "right", 
    stopOnFocus: true, 
    style: {
    background: "white",
    color: "black",
    },
    onClick: function(){} 
  }).showToast();
    }

    mostrarToastifyStock(){
        Toastify({
            text: "¡Este tesoro único encontró su dueño! \n Explora otras joyas en nuestra tienda que te encantarán 💚",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "bottom", 
            position: "right", 
            stopOnFocus: true, 
            style: { 
            background: "white",
            color: "black",
            },
            onClick: function(){} 
          }).showToast();
            }
    
    limpiarCarrito(){
        this.listaCarrito = []
    }

    eventoFinalizarCompra(){
        const finalizar_compra = document.getElementById("finalizar_compra")

        finalizar_compra.addEventListener("click", () => {

            if(this.listaCarrito.length > 0){
                localStorage.setItem(this.listaCarritoKey, "[]")
                this.limpiarCarrito()
                this.mostrarEnDOM()

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Compra exitosa. ¡Arrasa con tu estilo!😎',
                    showConfirmButton: false,
                    timer: 2000
                })
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Parece que tu carrito está un poco solitario. 🛒🌟 Dale vida añadiendo algunos productos geniales!',
                    showConfirmButton: false,
                    timer: 2000
                  })
            }
            
        })
    }
}


const CP = new ProductoController()
const carrito = new Carrito()


//Filtro de categoria de productos: Ropa - Zapatos - Accesorios
// Obtener los elementos del menú desplegable por su id
const ropaLink = document.getElementById("ropa_link")
const zapatosLink = document.getElementById("zapatos_link")
const accesoriosLink = document.getElementById("accesorios_link")

// Agregar eventos de click a los elementos
ropaLink.addEventListener("click", () => {
    CP.mostrarEnDOM('Ropa')
})

zapatosLink.addEventListener("click", () => {
    CP.mostrarEnDOM('Zapatos')
})

accesoriosLink.addEventListener("click", () => {
    CP.mostrarEnDOM('Accesorios')
})

//Filtro de categoria de productos: Todos los productos
const todosProductosLink = document.getElementById("todos_productos_link")

todosProductosLink.addEventListener("click", () => {
    CP.mostrarEnDOM()
})


CP.preparar_contenedor_productos()

carrito.recuperarStorage()
carrito.mostrarEnDOM()
carrito.eventoFinalizarCompra()
carrito.actualizarCantidadCarrito()
carrito.actualizarCantidadCarritoEnIcono()



