let products=[];


async function fetchProducts() {
    try {
        const response = await fetch('https://pry-final-2024.onrender.com/products'); // Cambia la URL según tu backend
        products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
}

// Función para mostrar productos en la interfaz
function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Limpiar la lista de productos

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.imagenUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.descripcion}</p>
            <p>Precio: $${product.precio}</p>
            <button onclick="addToCart('${product.id}')">Añadir al carrito</button>
        `;
        productList.appendChild(productDiv);
    });
}

// Función para añadir un producto al carrito en Local Storage
function addToCart(productId) {
    const product= products.find(p=>p.id===productId);

    if(!product){
        alert('Producto no encontrado.');
        return;
    }

    let cart=JSON.parse(localStorage.getItem('cart')) || [];

    let productInCart=cart.find(item=>item.id===productId);

    if(productInCart){
        if(productInCart.quantity>=product.stock){
            alert('No se puede añadir más de este producto, no hay suficiente stock.');
            return;
        }
        productInCart.quantity += 1;
    }else{
        cart.push({ productId: productId, quantity: 1 }); 
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    alert('Producto añadido al carrito!');
}

fetchProducts();

document.getElementById('pagar-btn').addEventListener('click', function(){
    const sessionToken= sessionStorage.getItem('sessionToken');
    if(!sessionToken) {
        mostrarModalLogin();
    }else{
        iniciarProcesoPago();
    }
});

function mostrarModalLogin(){
    Swal.fire({
        title: 'Iniciar Sesión',
        html: `<input type="text" id="email" class="swal2-input" placeholder="Email">
               <input type="password" id="password" class="swal2-input" placeholder="Password">`,
        confirmButtonText: 'Iniciar Sesión',
        showCancelButton: true,
        preConfirm: () => {
            const email = Swal.getPopup().querySelector('#email').value;
            const password = Swal.getPopup().querySelector('#password').value;
            
            // Simular autenticación
            return fetch('https://pry-final-2024.onrender.com/auth', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`
                }
            }).then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            }).then(data => {
                // Guardar el token de sesión en sessionStorage
                sessionStorage.setItem('sessionToken', data.accessToken);
                sessionStorage.setItem('userId', data.userId);
                console.log('datosss',data);
                return data.accessToken;
            }).catch(error => {
                Swal.showValidationMessage(`Login failed: ${error}`);
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            iniciarProcesoPago();
        }
    });
}

function iniciarProcesoPago() {
    const sessionToken = sessionStorage.getItem('sessionToken');
    const userId = sessionStorage.getItem('userId'); // Asegúrate de almacenar el ID del usuario
 console.log(sessionToken);
 console.log(userId);
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    fetch('https://pry-final-2024.onrender.com/create-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`
        },
        body: JSON.stringify({
            carItems: cartItems,
            userId: userId
        })
    }).then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(`Error: ${response.status} ${response.statusText} - ${JSON.stringify(err)}`);
            });
        }
        return response.json();

    }).then(data => {
        const stripe = Stripe('pk_test_51PxIH0Ic5I4VtceaMBaGgLlI9kC6b6funy8D2HSqWy1xh0Xr8Vm1ZzfxfU9LMzMUufurqBUrMoGA0raR1MOHdDXQ00cEiscUEu');
        return stripe.redirectToCheckout({ sessionId: data.id });
    }).then(result => {
        if (result.error) {
            console.error(result.error.message);
        }
    }).catch(error => {
        console.error('Error en el proceso de pago:', error);
    });

    
}




