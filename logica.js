let productos;
obtenerJsonProds();
console.table(productos);
let carro = JSON.parse(localStorage.getItem('carro')) || []; //operador de asignacion condicional
//si habia algo en el storage entonces dibujar las filas de la tabla al comienzo con esa info
let tablaBody = document.getElementById('tablabody');
let contenedorProds = document.getElementById('misprods');
let finalizarBtn = document.getElementById("finalizar");
let vaciarBtn = document.getElementById("vaciar");

//tratamiento si encontramos algo en un carrito abandonado
(carro.length != 0) && dibujarTabla();

//dibujo tabla si hay algo en el storage al comienzo
function dibujarTabla(){
    for(const producto of carro){
        document.getElementById("tablabody").innerHTML += `
        <tr>
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td><button class="btn btn-light" onclick="eliminar(event)">🗑️</button></td>
        </tr>
    `;
    }
    totalCarrito = carro.reduce((acumulador,producto)=> acumulador + producto.precio,0);
    let infoTotal = document.getElementById("total");
    infoTotal.innerText="Total a pagar $: "+totalCarrito;
    
}

//funcion para eliminar elementos del carro
//Para eliminar prods del carro
function eliminar(ev){
    console.log(ev);
    let fila = ev.target.parentElement.parentElement;
    console.log(fila);
    let id = fila.children[0].innerText;
    console.log(id);
    let indice = carro.findIndex(producto => producto.id == id);
    console.log(indice)
    //remueve el producto del carro
    carro.splice(indice,1);
    console.table(carro);
    //remueve la fila de la tabla
    fila.remove();
    //recalcular el total
    let preciosAcumulados = carro.reduce((acumulador,producto)=>acumulador+producto.precio,0);
    total.innerText="Total a pagar $: "+preciosAcumulados;
    //agregar el calculo en pesos 💪


    //storage
    localStorage.setItem("carro",JSON.stringify(carro));
}


//DOM
function renderizarProductos(listaProds){
    //vaciamos en contenedor para evitar duplicados
    contenedorProds.innerHTML='';
    //cargamos las cartas de los productos solicitados
    for(const prod of listaProds){
        contenedorProds.innerHTML+=`
            <div class="card col-sm-2">
                <img class="card-img-top" src=${prod.foto} alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${prod.nombre}</h5>
                    <p class="card-text">$ ${prod.precio}</p>
                    <button id=${prod.id} class="btn btn-primary compra">Comprar</button>
                </div>
            </div>
        `;
    }

    //eventos
    let botones = document.getElementsByClassName('compra');
    for(const boton of botones){
        //opcion 1
        boton.addEventListener('click',()=>{
            //console.log('Hiciste click en el producto con id: '+boton.id);
            const prodACarro = productos.find((producto) => producto.id == boton.id);
            console.log(prodACarro);
            //cargar prods al carro
            agregarACarrito(prodACarro);
        })

        //opcion 2
        boton.onmouseover = () => {
            /* boton.classList.remove('btn-primary');
            boton.classList.add('btn-warning'); */
            boton.classList.replace('btn-primary','btn-warning');
        }
        boton.onmouseout = () => {
            boton.classList.replace('btn-warning','btn-primary');
        }
    }
}

function agregarACarrito(producto) {
    carro.push(producto);
    console.table(carro);
    Swal.fire({
        title: 'Fantastico !',
        text: `Agregaste ${producto.nombre} al carrito ! 💪`,
        imageUrl: producto.foto,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: producto.nombre,
    });
    tablaBody.innerHTML += `
      <tr id="producto-${producto.id}">
        <td>${producto.id}</td>
        <td>${producto.nombre}</td>
        <td>${producto.precio}</td>
        <td>
        <button class="btn btn-light" onclick="decrementar(${producto.id})">-</button>
        <span id="cantidad-${producto.id}">1</span>
        <button class="btn btn-light" onclick="incrementar(${producto.id})">+</button>
        </td>
        <td><button class="btn btn-light" onclick="eliminar(${producto.id})">🗑️</button></td>
      </tr>
    `;
    // Aquí calculamos el total
    let total = carro.reduce((ac,prod)=> ac + prod.precio,0);
    console.log(total);
    document.getElementById('total').innerText = `Total a pagar $:${total}`;
    //Trabajamos con el almacenamiento local (localStorage)
    localStorage.setItem('carro', JSON.stringify(carro));
}

function incrementar(id) {
    const cantidadElement = document.getElementById(`cantidad-${id}`);
    let cantidad = parseInt(cantidadElement.innerText);
    cantidad++;
    cantidadElement.innerText = cantidad.toString();
    actualizarTotal(id, cantidad);
}

function decrementar(id) {
    const cantidadElement = document.getElementById(`cantidad-${id}`);
    let cantidad = parseInt(cantidadElement.innerText);
    if (cantidad > 1) {
      cantidad--;
      cantidadElement.innerText = cantidad.toString();
    };
    actualizarTotal(id, cantidad);
}


//trabajamos con los filtros
let filtro = document.getElementById('filtro');
let min = document.getElementById('min');
let max = document.getElementById('max');

//funcion para poder filtrar por precio
function filtrarPorPrecio(precioMin, precioMax){
    const filtrados = productos.filter((prod)=> (prod.precio >= precioMin) && (prod.precio <=precioMax));
    sessionStorage.setItem('filtrados',JSON.stringify(filtrados));
    return filtrados;
}

filtro.onclick = () => {
    console.log('click');
    console.log(min.value, max.value);
    if((min.value != '')&&(max.value != '')&&(min.value < max.value)){
        let listaFiltrados = filtrarPorPrecio(min.value, max.value);
        console.log(listaFiltrados);
        renderizarProductos(listaFiltrados);
    }
}

//agregar boton de borrar filtros para ver todo como al comienzo, campos vacios y toda la lista de productos

finalizarBtn.onclick=()=>{
    //antes de vaciar el carro envio con POST el pedido a JsonPlaceholder para simular el fin del proceso - OPCION
    carro=[];
    document.getElementById('tablabody').innerHTML='';
    document.getElementById('total').innerText = 'Total a pagar $:';
    Swal.fire('Gracias por tu compra','Pronto la recibirás','success');
    //storage NEW
    localStorage.removeItem("carro");
}

//vaciar carrp
vaciarBtn.onclick=()=>{
    carro=[];
    document.getElementById('tablabody').innerHTML='';
    document.getElementById('total').innerText = 'Total a pagar $:';
    Swal.fire('Hemos vaciado el carro','Puedes volver a comenzar','success')
    //storage NEW
    localStorage.removeItem("carro");
}

//JSON
async function obtenerJsonProds(){
    const URLJSON = '/productos.json';
    const respuesta = await fetch(URLJSON);
    const data = await respuesta.json();
    console.log(data);
    productos = data;
    renderizarProductos(productos);
}

