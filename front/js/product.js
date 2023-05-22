//Récupération de l'id du produit avec l'url
const str = window.location.href
const url = new URL(str)
const productId = url.searchParams.get("id")

//Variables des elements html du produit
const image = document.getElementsByClassName('item__img')
let imageUrl = ''
let imageAlt = ''
const title = document.getElementById("title")
const price = document.getElementById("price")
const description = document.getElementById('description')
const colors = document.getElementById('colors')

//Fonction d'apparition d'un produit
function displaySingleProduct(singleProduct) {
    //Information du produit
    image[0].innerHTML = `<img src="${singleProduct.imageUrl}" alt="${singleProduct.altTxt}">`
    imageUrl = singleProduct.imageUrl
    imageAlt = singleProduct.altTxt
    title.innerHTML = `<h1>${singleProduct.name}<h1>`
    price.innerText = `${singleProduct.price}`
    description.innerText = `${singleProduct.description}`
    //Selecteur de couleurs
    singleProduct.colors.forEach(color => {
        let option = document.createElement("option")
        document.querySelector("#colors").appendChild(option)
        option.value = color
        option.innerHTML = color
    })
}

//Récupération et envoie des donnés d'un article de l'API
async function fetchSingleIdProduct() {
    fetch("http://localhost:3000/api/products/" + productId)
        .then(response => response.json())
        .then(data => displaySingleProduct(data))
        .catch(error => console.log(error))
}
fetchSingleIdProduct()

//Variable des sélection de l'utilisateur
const selectQuantity = document.getElementById('quantity')
const selectColors = document.getElementById('colors')

//EventListener au clique d'ajout au panier
const addToCart = document.getElementById('addToCart')
addToCart.addEventListener('click', (event) => {
    //Vérification de couleur et quantité sélectionner valide
    if (!selectColors.value[0]) {
        alert('Sélectionner une couleur.')
        return
    }

    if (selectQuantity.value < 1 || selectQuantity.value > 100) {
        alert('Sélectionner une quantité comprise entre 1 et 100.')
        return
    }

    //Element sélectionner
    const selected = {
        id: productId,
        image: imageUrl,
        alt: imageAlt,
        name: title.textContent,
        color: selectColors.value,
        quantity: selectQuantity.value
    }

    //Synchronisation du localStorage
    let productLocalStorage = JSON.parse(localStorage.getItem('product'))

    //Fonction d'ajoue du produit
    function addProductToStorage() {
        productLocalStorage.push(selected)
        localStorage.setItem('product', JSON.stringify(productLocalStorage))
    }

    //Boite de confirmation
    function addConfirm() {
        alert('Produit ajouter au panier.')
    }

    let update = false

    //Cas ou le produit est déjà dans le localStorage
    if (productLocalStorage) {
        productLocalStorage.forEach(function (productOk, key) {
            if (productOk.id == productId && productOk.color == selectColors.value) {
                let productTotalQuantity = parseInt(productOk.quantity) + parseInt(selectQuantity.value)
                //Cas ou la quantité finale ne dépasse pas 100
                if (productTotalQuantity <= 100) {
                    productLocalStorage[key].quantity = productTotalQuantity
                    localStorage.setItem('product', JSON.stringify(productLocalStorage))
                    update = true
                    addConfirm()
                }
                //Cas ou la quantité finale dépasse 100
                if (!update && productTotalQuantity > 100) {
                    productLocalStorage[key].quantity = 100
                    localStorage.setItem('product', JSON.stringify(productLocalStorage))
                    update = true
                    alert('Quantité maximale du produit dans votre panier dépasser. La quantité est ramené à 100')
                }
            }
        })
        //Ajoue du produit
        if (!update) {
            addProductToStorage()
            addConfirm()
        }
    }
    //Cas ou le localStorage n'existe pas
    else {
        productLocalStorage = []
        addProductToStorage()
        addConfirm()
    }
})