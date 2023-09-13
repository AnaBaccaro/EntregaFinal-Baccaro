class Producto {
    constructor(id, nombre, precio, descripcion, img, alt, categoria, cantidad = 1) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.descripcion = descripcion;
        this.cantidad = cantidad;
        this.img = img;
        this.alt = alt;
        this.categoria = categoria;
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
                        <button class="btn btn-dark" id="disminuir-${this.id}"><i class="fa-solid fa-minus"></i></button>
                        ${this.cantidad}
                        <button class="btn btn-dark" id="aumentar-${this.id}"><i class="fa-solid fa-plus"></i></button>
                        </p>
                        <p class="card-text">Precio: $${this.precio * this.cantidad}</p>
                        <button id = "eliminarprod-${this.id}">
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
        <div class="card border-light" style="width: 18rem;">
            <img src="${this.img}" class="card-img-top" alt="${this.alt}">
            <div class="card-body">
                <h5 class="card-title">${this.nombre}</h5>
                <p class="card-text">${this.descripcion}</p>
                <p class="card-text">$${this.precio}</p>
                <button class="btn btn-cart" id="ap-${this.id}">Añadir al carrito</button>
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

    //Productos disponibles y sus propiedades
    cargarProductos(){

        this.agregar( new Producto (1, "Lentes de sol Almond",150, "Lentes de sol vintage, hechos en Italia", "http://127.0.0.1:5500/Recursos/lentes-green.jpg", "Lentes_de_sol", "Accesorios") )
        this.agregar(new Producto(2, "Camisa Mercury",60, "Camisa denim manga corta, realizada con desechos de fábrica", "http://127.0.0.1:5500/Recursos/camisa-denim.jpg", "Camisa_denim", "Ropa") )
        this.agregar(new Producto(3, "Tshirt Smoky" ,45, "Tshirt dont smoke", "http://127.0.0.1:5500/Recursos/dontsmoke-tee.jpg", "Tshirt_estampada", "Ropa") )
        this.agregar(new Producto(4, "Tshirt Donsmoke",45, "Tshirt oversize", "http://127.0.0.1:5500/Recursos/boypinktee.jpg", "Tshirt_oversize", "Ropa") )
        this.agregar(new Producto(5, "Tshirt Marie",45, "Tshirt fucsia con estampa", "http://127.0.0.1:5500/Recursos/remera-dontsmoke1.jpg", "Tshirt_estampa", "Ropa") )
        this.agregar(new Producto(6, "Campera Fuji",100, "Campera bordada", "http://127.0.0.1:5500/Recursos/campera-bordada.jpg", "Campera_bordada", "Ropa") )
        this.agregar(new Producto(7, "Tshirt Ozzy",100, "Tshirt con estampa de Ozzy Osbourne", "http://127.0.0.1:5500/Recursos/remera-banda.jpg", "Tshirt_ozzy", "Ropa") )
        this.agregar(new Producto(8, "Jean Ducky",100, "Straight Jeans, high waist con bordados de los Looney Tunes", "http://127.0.0.1:5500/Recursos/jean-bordado.jpg", "Jean_bordado", "Ropa") )
        this.agregar(new Producto(9, "Cardigan Justin",80, "Saco vintage a rayas", "https://images.pexels.com/photos/14844788/pexels-photo-14844788.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load", "Cardigan_vintage", "Ropa") )
        this.agregar(new Producto(10, "Hoodie D-Smoke",100, "Hoodie con estampa", "https://images.pexels.com/photos/14769361/pexels-photo-14769361.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load", "Hoodie_estampado", "Ropa") )
        this.agregar(new Producto(11, "Buzo Wulf", 100, "Buzo crop con cuello alto", "https://images.pexels.com/photos/14711368/pexels-photo-14711368.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load", "Buzo_vintage", "Ropa") )
        this.agregar(new Producto(12, "Botas Matrix",150, "Botas vintage", "https://images.pexels.com/photos/14700242/pexels-photo-14700242.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load", "Botas_vintage", "Zapatos") )
    }

    mostrarEnDOM(categoriaSeleccionada) {
        let contenedor_productos = document.getElementById("contenedor_productos");
        contenedor_productos.innerHTML = "";
    
        this.listaProductos.forEach(producto => {
            if (!categoriaSeleccionada || producto.categoria === categoriaSeleccionada) {
                contenedor_productos.innerHTML += producto.descripcionProducto();
            }
        })

        

        this.listaProductos.forEach(producto => {
            const btn_ap = document.getElementById(`ap-${producto.id}`)

            btn_ap.addEventListener("click",()=>{
                carrito.agregar(producto)
                carrito.guardarEnStorage()
                carrito.mostrarEnDOM()
            })
        })
    }
}

class Carrito {
    constructor() {
        this.listaCarrito = []
    }

    agregar(productoAgregar) {
        let existe = this.listaCarrito.some(producto => producto.id == productoAgregar.id);
    
        if (existe) {
            let producto = this.listaCarrito.find(producto => producto.id == productoAgregar.id);
            producto.aumentarCantidad();
            // Actualiza el precio total del producto
            producto.precioTotal = producto.precio * producto.cantidad;
        } else {
            if (productoAgregar instanceof Producto) {
                this.listaCarrito.push(productoAgregar);
                productoAgregar.precioTotal = productoAgregar.precio;
            }
        }
    }
    

    
    eliminar(productoAeliminar){
        let indice = this.listaCarrito.findIndex(producto => producto.id == productoAeliminar.id)
        this.listaCarrito.splice(indice,1)
    }

    guardarEnStorage(){
        let listaCarritoJSON = JSON.stringify(this.listaCarrito)
        localStorage.setItem("listaCarrito", listaCarritoJSON)
    }

    recuperarStorage(){
        let listaCarritoJSON = localStorage.getItem("listaCarrito")
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
    
        this.eventoEliminar();
        this.eventoAumentarCantidad();
        this.eventoDisminuirCantidad();
        this.mostrarTotal();
    }
    

    eventoEliminar(){
        this.listaCarrito.forEach(producto => {
            const btn_eliminar = document.getElementById(`eliminarprod-${producto.id}`)
            btn_eliminar .addEventListener("click", () => {
                this.eliminar(producto)
                this.guardarEnStorage()
                this.mostrarEnDOM()
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
    
    calcularTotal() {
        return this.listaCarrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0)
    }
    

    mostrarTotal(){
        const precio_total = document.getElementById("precio_total")
        precio_total.innerText = `Precio total: $${this.calcularTotal()}`
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
const todosProductosLink = document.getElementById("todos_productos_link");

todosProductosLink.addEventListener("click", () => {
    CP.mostrarEnDOM()
})



CP.cargarProductos()
CP.mostrarEnDOM()

carrito.recuperarStorage()
carrito.mostrarEnDOM()
