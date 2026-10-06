// Set dynamic year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Target WhatsApp Number (Replace with the real one)
// Ensure to include the country code without '+' or '00'
const WHATSAPP_NUMBER = "18297596401"; 

// Cart State
let cart = [];

// UI Elements
const cartSidebar = document.getElementById('cart-sidebar');
const cartBackdrop = document.getElementById('cart-backdrop');
const cartBadge = document.getElementById('cart-badge');
const cartItemsContainer = document.getElementById('cart-items');
const emptyCartMsg = document.getElementById('empty-cart-msg');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Toggle Cart Visibility
window.toggleCart = function() {
    const isClosed = cartSidebar.classList.contains('translate-x-full');
    if (isClosed) {
        cartBackdrop.classList.remove('hidden');
        // Small delay to allow display:block to apply before animating opacity
        setTimeout(() => cartBackdrop.classList.remove('opacity-0'), 10);
        cartSidebar.classList.remove('translate-x-full');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
        cartBackdrop.classList.add('opacity-0');
        cartSidebar.classList.add('translate-x-full');
        document.body.style.overflow = '';
        // Wait for animation to finish before hiding backdrop completely
        setTimeout(() => cartBackdrop.classList.add('hidden'), 300);
    }
}

// Add item to cart
window.addToCart = function(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    
    updateCartUI();
    
    // Animate cart badge
    cartBadge.classList.add('scale-125');
    setTimeout(() => cartBadge.classList.remove('scale-125'), 200);
    
    // UX Improvement: Visual feedback on the button itself
    if (window.event && window.event.currentTarget) {
        const btn = window.event.currentTarget;
        const originalHTML = btn.innerHTML;
        
        // Change to green check temporarily
        btn.innerHTML = '<i class="ph ph-check text-xl"></i>';
        btn.classList.add('bg-green-500');
        btn.classList.remove('bg-brand-dark');
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('bg-green-500');
            btn.classList.add('bg-brand-dark');
            
            // Open cart to show the added item after the animation
            if (cartSidebar.classList.contains('translate-x-full')) {
                toggleCart();
            }
        }, 600); // 600ms delay to let the user see the success check
    } else {
        // Fallback if event is not captured
        if (cartSidebar.classList.contains('translate-x-full')) {
            toggleCart();
        }
    }
}

// Update item quantity
window.updateQuantity = function(id, delta) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += delta;
        
        // Remove item if quantity falls to 0
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    updateCartUI();
}

// Render Cart items and calculate total
function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    
    let total = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartItemsContainer.appendChild(emptyCartMsg);
        emptyCartMsg.style.display = 'block';
        checkoutBtn.disabled = true;
        cartBadge.classList.remove('scale-100');
        cartBadge.classList.add('scale-0');
    } else {
        emptyCartMsg.style.display = 'none';
        checkoutBtn.disabled = false;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            totalItems += item.quantity;

            const itemEl = document.createElement('div');
            itemEl.className = 'flex justify-between items-center bg-brand-bg p-3 rounded-xl border border-brand-border shadow-sm';
            itemEl.innerHTML = `
                <div class="flex-1">
                    <h4 class="font-bold text-sm text-brand-text">${item.name}</h4>
                    <p class="text-brand-orange font-semibold text-sm">$${item.price.toFixed(2)}</p>
                </div>
                <div class="flex items-center gap-3 bg-brand-card rounded-lg p-1 border border-brand-border">
                    <button onclick="updateQuantity('${item.id}', -1)" class="w-8 h-8 flex items-center justify-center text-brand-muted hover:text-white hover:bg-brand-border rounded-md transition">
                        <i class="ph ph-minus"></i>
                    </button>
                    <span class="font-bold text-sm w-4 text-center text-brand-text">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', 1)" class="w-8 h-8 flex items-center justify-center text-brand-muted hover:text-white hover:bg-brand-border rounded-md transition">
                        <i class="ph ph-plus"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        cartBadge.textContent = totalItems;
        cartBadge.classList.remove('scale-0');
        cartBadge.classList.add('scale-100');
    }

    cartTotalEl.textContent = `$${total.toFixed(2)}`;
}

window.checkoutWhatsApp = function() {
    if (cart.length === 0) return;

    let total = 0;
    let message = "Hola! Quiero realizar el siguiente pedido de la tienda Be Yourself:%0A%0A";
    
    // Build the message string
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        // %0A is URL encoded newline
        message += `▪ ${item.quantity}x ${item.name} - $${itemTotal.toFixed(2)}%0A`;
    });
    
    message += `%0A*Total a pagar: $${total.toFixed(2)}*%0A%0A`;
    message += `Quedo atento/a para los detalles de pago y envío. ¡Gracias!`;

    // Open WhatsApp link in a new tab
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappURL, '_blank');
}

// --- Lógica para Eventos y Asesorías ---

window.registerEvent = function(eventName, eventDate) {
    const message = `Hola Be Yourself! 🌟%0A%0AQuiero adquirir una entrada para el evento:%0A*${eventName}*%0A📅 Fecha: ${eventDate}%0A%0APor favor, indícame la disponibilidad, el costo y los métodos de pago.`;
    
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappURL, '_blank');
}

window.scheduleMeeting = function() {
    const message = `Hola Be Yourself! 🤝%0A%0AEstoy interesado/a en agendar una *Sesión de Claridad 1 a 1* (45 min).%0A%0AMe gustaría conocer los horarios disponibles para esta semana y las tarifas de la asesoría.`;
    
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappURL, '_blank');
}