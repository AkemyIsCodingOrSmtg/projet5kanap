// Initialisation du localStorage
let productsLocalStorage = JSON.parse(localStorage.getItem('product'))

//fetch price
async function fetchPriceOneProduct(productId) {
    const data = await fetch("http://localhost:3000/api/products/" + productId)
        .then(response => response.json())
        .catch(error => console.log(error))
    return data
}

async function loadActionsAndCalcPrice() {
    //Modifier la quantité de produit
    const quantityToEdit = document.querySelectorAll(".itemQuantity")

    quantityToEdit.forEach((el, k) =>
        el.addEventListener("change", async (event) => {
            event.preventDefault()

            const initialQuantityValue = productsLocalStorage[k].quantity
            let newQuantityValue = el.valueAsNumber

            newQuantityValue = (newQuantityValue < 1 || newQuantityValue > 100 || !newQuantityValue) ? initialQuantityValue : newQuantityValue
            productsLocalStorage[k].quantity = newQuantityValue

            localStorage.setItem("product", JSON.stringify(productsLocalStorage))
            location.reload()
        })
    )

    // Suppression d'un produit
    const deleteButtons = document.querySelectorAll(".deleteItem")
    deleteButtons.forEach((el, i) =>
        el.addEventListener("click", (event) => {
            event.preventDefault()

            const deleteIDElement = productsLocalStorage[i].idProduit
            const deleteColorElement = productsLocalStorage[i].color

            productsLocalStorage = productsLocalStorage.filter(element => 
                element.idProduit !== deleteIDElement || 
                element.color !== deleteColorElement
            )

            localStorage.setItem("product", JSON.stringify(productsLocalStorage))
            if (localStorage.product == '[]') {
                localStorage.removeItem("product")
            }
            location.reload()
        })
    )

    // Total des produits
    const elementsQuantity = document.getElementsByClassName('itemQuantity')

    // Total de quantité
    const totalQuantity = Array.from(elementsQuantity).reduce((sum, el) => sum + el.valueAsNumber, 0)
    document.getElementById('totalQuantity').innerHTML = totalQuantity

    // Total de prix
    /**
     * Calcul du total de prix des produits en utilisant async et promises.
     * Conversion de elementsQuantity en tableau JS (via Array.from)
     * Promesse.all est déclenché quand le Array.From et l'async sont exécutés et complétés.
     * Donc Promesse.all trigger seulement quand le await fetchPriceOneProduct est trigger est complété autant de fois que nécessaire via la boucle
     */
    const totalPrice = await Promise.all(Array.from(elementsQuantity, async (el, i) => {
        const product = await fetchPriceOneProduct(productsLocalStorage[i].id)
        return el.valueAsNumber * product.price
    })).then(prices => prices.reduce((sum, price) => sum + price, 0))

    document.getElementById('totalPrice').innerHTML = totalPrice
}

//Récupération du contenue du Panier
async function getCartContent() {

    const positionCart = document.querySelector('#cart__items')
    //Si le panier est vide
    if (!productsLocalStorage) {
        positionCart.innerHTML += "<p><b>Votre panier est vide.</b></p>"
        return
    }

    // Récupère les prix des produits en utilisant les promise
    const prices = await Promise.all(productsLocalStorage.map(async product => {
        const result = await fetchPriceOneProduct(product.id)
        return {...product, price: result.price}
    }))

     // Construit les cartes des articles avec le .map()
     const itemCards = prices.map(product => `
     <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
         <div class="cart__item__img">
             <img src="${product.image}" alt="${product.alt}">
         </div>
         <div class="cart__item__content">
             <div class="cart__item__content__description">
                 <h2>${product.name}</h2>
                 <p>${product.color}</p>
                 <p>${product.price} €</p>
                 </div>
                 <div class="cart__item__content__settings">
                     <div class="cart__item__content__settings__quantity">
                       <p>Qté : </p>
                       <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                     </div>
                     <div class="cart__item__content__settings__delete">
                       <p class="deleteItem">Supprimer</p>
                     </div>
                 </div>
             </div>
         </article>`).join('')
         positionCart.innerHTML = itemCards // Affiche les cartes d'articles dans la page HTML
         await loadActionsAndCalcPrice()
}

getCartContent()

//Vérification de la validité du formulaire
function verifyForm() {
    var orderForm = document.querySelector('.cart__order__form')

    //Variable Regex du formulaire
    let regexEmail = new RegExp('^[a-zA-Z0-9.-_]{2,}[@]{1}[a-zA-Z0-9.-_]{2,}[.]{1}[a-z]{2,}$')
    let regexName = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç '-]{2,}")
    let regexAddress = new RegExp("^[0-9]{1,3}[ '-]{1}[a-zA-Zàâäéèêëïîôöùûüç]{2,}")

    //Variable de validation du formulaire
    validFirstName = false
    validLastName = false
    validAddress = false
    validCity = false
    validEmail = false

    //Suivi des changement du formulaire
    orderForm.firstName.addEventListener('change', function (checkFirstName) {
        checkValidity(this)
    })
    orderForm.lastName.addEventListener('change', function (checkLastName) {
        checkValidity(this)
    })
    orderForm.address.addEventListener('change', function (checkAddress) {
        checkValidity(this)
    })
    orderForm.city.addEventListener('change', function (checkCity) {
        checkValidity(this)
    })
    orderForm.email.addEventListener('change', function (checkEmail) {
        checkValidity(this)
    })

    //Message d'erreur et validation du form
    var checkValidity = function (input) {

        var inputErrorMessage = input.nextElementSibling
        inputErrorMessage.innerHTML = ""
        switch (input.name) {
            case "firstName":
                if (!regexName.test(input.value)) {
                    inputErrorMessage.innerHTML = 'Insérer des caractères autorisés (2 caractères minimum).'
                    validFirstName = false
                }
                if (input.value.length === 0) {
                    inputErrorMessage.innerHTML = 'Le champ Prénom doit être rempli.'
                    validFirstName = false
                }
                if (regexName.test(input.value)) {
                    validFirstName = true
                }
                break
            case "lastName":
                if (!regexName.test(input.value)) {
                    inputErrorMessage.innerHTML = 'Insérer des caractères autorisés (2 caractères minimum).'
                    validLastName = false
                }
                if (input.value.length === 0) {
                    inputErrorMessage.innerHTML = 'Le champ Nom doit être rempli.'
                    validLastName = false
                }
                if (regexName.test(input.value)) {
                    validLastName = true
                }
                break
            case "address":
                if (!regexAddress.test(input.value)) {
                    inputErrorMessage.innerHTML = 'Insérer des caractères autorisés (ex : 29 rue Dupon).'
                    validAddress = false
                }
                if (input.value.length === 0) {
                    inputErrorMessage.innerHTML = 'Le champ Adresse doit être rempli.'
                    validAddress = false
                }
                if (regexAddress.test(input.value)) {
                    validAddress = true
                }
                break
            case "city":
                if (!regexName.test(input.value)) {
                    inputErrorMessage.innerHTML = 'Insérer des caractères autorisés (2 caractères minimum).'
                    validCity = false
                }
                if (input.value.length === 0) {
                    inputErrorMessage.innerHTML = 'Le champ Ville doit être rempli.'
                    validCity = false
                }
                if (regexName.test(input.value)) {
                    validCity = true
                }
                break
            case "email":
                if (!regexEmail.test(input.value)) {
                    inputErrorMessage.innerHTML = 'Insérer des caractères autorisés (ex : jeanluc@mail.com).'
                    validEmail = false
                }
                if (input.value.length === 0) {
                    inputErrorMessage.innerHTML = 'Le champ Email doit être rempli.'
                    validEmail = false
                }
                if (regexEmail.test(input.value)) {
                    validEmail = true
                }
                break
        }
    }
}
verifyForm()

function getOrder() {
    //Vérification que le panier ne soit pas vide
    if (!productsLocalStorage) {
        alert('Votre panier est vide !')
        return
    }

    //Vérification de la validité du formulaire finale
    if (!(validFirstName && validLastName && validAddress && validCity && validEmail)) {
        alert('Il y a un problème avec votre formulaire, merci de le revérifier.')
        return
    }

    //Récupération des produits du panier
    event.preventDefault()

    let products = []

    for (let i = 0; i < productsLocalStorage.length; i++) {
        products.push(productsLocalStorage[i].id)
    }

    //Récupération des coordonées du client
    const contact = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        email: document.getElementById('email').value,
    }

    //Enregistrement de l'id de la commande dans le localStorage
    fetchOrderId(contact, products)
}

//Fetch orderID
function fetchOrderId(contact, products) {
    const options = {
        method: 'POST',
        body: JSON.stringify({ contact, products }),
        headers: {
            'Content-Type': 'application/json',
        }
    }

    fetch(`http://localhost:3000/api/products/order`, options)
        .then((response) => response.json())
        .then((data) => {
            localStorage.setItem(`orderId`, data.orderId)
            document.location.href = `confirmation.html`
        })
        .catch((error) => {
            console.log(error)
            alert(error.message)
        })
}

//Envoie du formulaire au localStorage
function postOrder() {
    const orderButton = document.getElementById('order')
    //A la confirmation de la commande
    orderButton.addEventListener("click", (event) => {

        //Récupération de la commande
        getOrder()
    })
}
postOrder()