// ==== SEU SCRIPT EXISTENTE (CARROSSEL) ====
const prevButton = document.getElementById('prev')
const nextButton = document.getElementById('next')
const items = document.querySelectorAll('.item')
const dots = document.querySelectorAll('.dot')
const numberIndicator = document.querySelector('.numbers')
const list = document.querySelector('.list')

let active = 0;
const total = items.length;
let timer;

function update(direction) {
    document.querySelector('.item.active').classList.remove('active')
    document.querySelector('.dot.active').classList.remove('active')

    if(direction > 0){
        active = active + 1
        if(active === total){
            active = 0
        }
    } 
    else if(direction < 0){
        active = active - 1
        if(active < 0){
            active = total - 1
        }
    }

    items[active].classList.add('active')
    dots[active].classList.add('active')
    numberIndicator.textContent = String(active + 1).padStart(2,'0')
}

clearInterval(timer)
timer = setInterval(() => {
   update(1)
}, 4000);

prevButton.addEventListener('click', () => update(-1));
nextButton.addEventListener('click', () => update(1));


// ==== CARRINHO DE COMPRAS ====
document.addEventListener("DOMContentLoaded", () => {
  // Criar botão do carrinho no menu
  const nav = document.querySelector("header nav ul");
  const liCarrinho = document.createElement("li");
  liCarrinho.innerHTML = `<a href="#" id="cart-btn">🛒 Carrinho (<span id="cart-count">0</span>)</a>`;
  nav.appendChild(liCarrinho);

  // Criar modal do carrinho
  const cartModal = document.createElement("div");
  cartModal.id = "cart-modal";
  cartModal.style.cssText = `
    position: fixed; top: 0; right: -400px; width: 350px; height: 100%;
    background: #fff; box-shadow: -2px 0 8px rgba(0,0,0,0.2);
    padding: 20px; transition: right 0.3s ease; z-index: 999;
    display: flex; flex-direction: column; overflow-y: auto;
  `;
  cartModal.innerHTML = `
    <h2>Carrinho</h2>
    <ul id="cart-items" style="flex:1; list-style:none; padding:0; margin:10px 0;"></ul>
    <p><strong>Total: R$ <span id="cart-total">0,00</span></strong></p>
    <button id="checkout-btn" style="margin:5px 0; padding:10px; background:#25d366; color:#fff; border:none; border-radius:5px; cursor:pointer;">Enviar no WhatsApp</button>
    <button id="clear-cart" style="margin:5px 0; padding:10px; background:#DAA520; color:#fff; border:none; border-radius:5px; cursor:pointer;">Limpar Carrinho</button>
    <button id="close-cart" style="margin:5px 0; padding:10px; background:#333; color:#fff; border:none; border-radius:5px; cursor:pointer;">Fechar</button>
  `;
  document.body.appendChild(cartModal);

  const cartBtn = document.getElementById("cart-btn");
  const cartCount = document.getElementById("cart-count");
  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");

  let cart = [];

  // Abrir/fechar modal
  cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    cartModal.style.right = cartModal.style.right === "0px" ? "-400px" : "0px";
  });
  document.getElementById("close-cart").addEventListener("click", () => {
    cartModal.style.right = "-400px";
  });

  // Adicionar produto ao carrinho (com tamanho)
  document.querySelectorAll(".product-card .btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product-card");
      const name = card.querySelector("h3").innerText;
      const priceText = card.querySelector(".price").innerText.replace("R$", "").replace(",", ".").trim();
      const price = parseFloat(priceText);
      const size = card.querySelector(".product-size").value; // pega tamanho selecionado

      cart.push({ name, price, size });
      updateCart();
    });
  });

  function updateCart() {
    cartItemsEl.innerHTML = "";
    let total = 0;
    cart.forEach((item, index) => {
      total += item.price;
      const li = document.createElement("li");
      li.textContent = `${item.name} - Tamanho: ${item.size} - R$ ${item.price.toFixed(2).replace(".", ",")}`;
      cartItemsEl.appendChild(li);
    });
    cartTotalEl.innerText = total.toFixed(2).replace(".", ",");
    cartCount.innerText = cart.length;
  }

  // Finalizar compra -> enviar para WhatsApp
  document.getElementById("checkout-btn").addEventListener("click", () => {
    if(cart.length === 0) return alert("Seu carrinho está vazio!");
    let msg = "🛒 Pedido:%0A";
    cart.forEach(item => {
      msg += `- ${item.name} (Tamanho: ${item.size}): R$ ${item.price.toFixed(2).replace(".", ",")}%0A`;
    });
    msg += `Total: R$ ${cart.reduce((t,i)=>t+i.price,0).toFixed(2).replace(".", ",")}`;
    window.open(`https://wa.me/5588981591229?text=${msg}`, "_blank");
  });

  // Limpar carrinho
  document.getElementById("clear-cart").addEventListener("click", () => {
    cart = [];
    updateCart();
  });
});

// ==== BUSCA DE PRODUTOS ====
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  document.querySelectorAll(".product-card").forEach(card => {
    const name = card.querySelector("h3").innerText.toLowerCase();
    const price = card.querySelector(".price").innerText.toLowerCase();
    const sizeOptions = Array.from(card.querySelectorAll(".product-size option")).map(o => o.value.toLowerCase());

    if (name.includes(term) || price.includes(term) || sizeOptions.some(s => s.includes(term))) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});


