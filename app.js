let productos = JSON.parse(localStorage.getItem("productos_pepper")) || [
  { nombre: "Visor Pirámide Mini", formato: "Celular (4.5 - 6.7\")", precio: 8.00, tag: "MÁS VENDIDO" },
  { nombre: "Display Holográfico Pro", formato: "Tablet / iPad", precio: 18.00, tag: "EMPRENDEDORES" },
  { nombre: "Animación 3D Personalizada", formato: "Video 4 caras MP4", precio: 12.00, tag: "A MEDIDA" }
];

let carrito = [];
let solicitudes = JSON.parse(localStorage.getItem("solicitudes_pepper")) || [];

function renderProductos() {
  const grid = document.getElementById("grid-productos");
  const tabla = document.getElementById("tabla-productos");
  grid.innerHTML = "";
  tabla.innerHTML = "";

  productos.forEach((p, idx) => {
    grid.innerHTML += `
      <div class="card" data-aos="fade-up">
        <span class="badge">${p.tag || "DISPONIBLE"}</span>
        <h3>${p.nombre}</h3>
        <p>Formato: ${p.formato}</p>
        <div class="price">$${Number(p.precio).toFixed(2)}</div>
        <button class="btn" onclick="agregarCarrito(${idx})">+ Agregar al pedido</button>
      </div>
    `;
    tabla.innerHTML += `
      <tr>
        <td>${p.nombre}</td>
        <td>${p.formato}</td>
        <td>$${Number(p.precio).toFixed(2)}</td>
      </tr>
    `;
  });
}

function agregarCarrito(idx) {
  carrito.push(productos[idx]);
  renderCarrito();
}

function vaciarCarrito() {
  carrito = [];
  renderCarrito();
}

function quitarDelCarrito(idx) {
  carrito.splice(idx, 1);
  renderCarrito();
}

function renderCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalEl = document.getElementById("total-carrito");
  lista.innerHTML = carrito.length ? "" : "<li>Aún no has agregado productos.</li>";
  let total = 0;

  carrito.forEach((item, i) => {
    total += Number(item.precio);
    lista.innerHTML += `
      <li style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem; margin-bottom:0.4rem;">
        <span>• ${item.nombre} — $${Number(item.precio).toFixed(2)}</span>
        <button type="button" onclick="quitarDelCarrito(${i})" style="background:transparent; color:#f87171; border:1px solid #f87171; border-radius:6px; padding:0.15rem 0.45rem; cursor:pointer; font-size:0.8rem;">Quitar</button>
      </li>
    `;
  });

  totalEl.textContent = total.toFixed(2);
}

function enviarPedidoWhatsApp() {
  if (!carrito.length) return alert("Agrega al menos un producto al pedido.");
  const detalle = carrito.map(i => `- ${i.nombre} ($${Number(i.precio).toFixed(2)})`).join("%0A");
  const total = document.getElementById("total-carrito").textContent;
  const texto = `Hola, quiero hacer este pedido de Fantasma de Pepper:%0A${detalle}%0ATotal: $${total}`;
  window.open(`https://wa.me/?text=${texto}`, "_blank");
}

function generarSugerenciaIA(ideaPredefinida) {
  const inputIdea = document.getElementById("ia-idea");
  const idea = (typeof ideaPredefinida === "string" ? ideaPredefinida : inputIdea.value).trim() || "una figura luminosa con movimiento suave";
  if (typeof ideaPredefinida === "string") inputIdea.value = ideaPredefinida;

  const disp = document.getElementById("ia-dispositivo").value;
  const textoMinuscula = idea.toLowerCase();

  let enfoque = "Proyección visual equilibrada con rotación suave de 360° y transiciones limpias.";
  if (textoMinuscula.includes("logo") || textoMinuscula.includes("marca") || textoMinuscula.includes("tienda")) {
    enfoque = "Enfoque de marca: muestra el logotipo centrado, giro pausado y un destello sutil para facilitar su lectura en el visor.";
  } else if (textoMinuscula.includes("regalo") || textoMinuscula.includes("cumple") || textoMinuscula.includes("amor")) {
    enfoque = "Enfoque emocional: usa tonos cálidos o cian suave, movimiento lento y un mensaje corto fácil de leer.";
  } else if (textoMinuscula.includes("clase") || textoMinuscula.includes("educ") || textoMinuscula.includes("ciencia")) {
    enfoque = "Enfoque educativo: destaca contornos definidos y cambios pausados para explicar cómo se refleja la luz.";
  }

  document.getElementById("ia-respuesta").innerHTML = `
    <strong>Propuesta IA para "${idea}":</strong><br>
    • <strong>Dispositivo recomendado:</strong> ${disp}<br>
    • <strong>Guion y estilo:</strong> ${enfoque}<br>
    • <strong>Ajuste óptico:</strong> Fondo negro puro (#000000) con inclinación de 45° para evitar reflejos dobles.
  `;
}

function actualizarSimulador() {
  const texto = document.getElementById("sim-texto").value.trim() || "✦ HOLOGRAMA ✦";
  document.querySelectorAll(".holo-item").forEach(el => {
    el.textContent = texto;
  });
}

document.getElementById("form-contacto").addEventListener("submit", function (e) {
  e.preventDefault();
  const nueva = {
    nombre: document.getElementById("c-nombre").value,
    correo: document.getElementById("c-correo").value,
    mensaje: document.getElementById("c-mensaje").value,
    fecha: new Date().toLocaleDateString()
  };
  solicitudes.push(nueva);
  localStorage.setItem("solicitudes_pepper", JSON.stringify(solicitudes));
  document.getElementById("c-estado").textContent = "✅ Solicitud registrada con éxito. También puedes verla en el Panel Admin.";
  this.reset();
  renderSolicitudes();
});

function entrarAdmin() {
  const pass = document.getElementById("admin-pass").value;
  if (pass === "1234") {
    document.getElementById("admin-login").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
    renderSolicitudes();
  } else {
    alert("Clave incorrecta. Usa 1234.");
  }
}

function agregarProducto() {
  const nombre = document.getElementById("p-nombre").value.trim();
  const formato = document.getElementById("p-formato").value.trim();
  const precio = parseFloat(document.getElementById("p-precio").value);
  if (!nombre || !formato || isNaN(precio)) return alert("Completa todos los campos.");

  productos.push({ nombre, formato, precio, tag: "NUEVO" });
  localStorage.setItem("productos_pepper", JSON.stringify(productos));
  renderProductos();

  document.getElementById("p-nombre").value = "";
  document.getElementById("p-formato").value = "";
  document.getElementById("p-precio").value = "";
}

function renderSolicitudes() {
  const ul = document.getElementById("lista-solicitudes");
  ul.innerHTML = solicitudes.length ? "" : "<li>No hay solicitudes todavía.</li>";
  solicitudes.forEach(s => {
    ul.innerHTML += `<li><strong>${s.nombre}</strong> (${s.correo} - ${s.fecha}): ${s.mensaje}</li>`;
  });
}
function limpiarSolicitudes() {
  solicitudes = [];
  localStorage.setItem("solicitudes_pepper", JSON.stringify(solicitudes));
  renderSolicitudes();
}

renderProductos();
renderCarrito();
