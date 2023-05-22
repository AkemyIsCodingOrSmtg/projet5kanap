//Fonction d'apparition de tout les produits
function displayAllProducts(allProducts) {
    //Recherche de l'id "items" dans le html
    const itemsContainer = document.getElementById("items")
    //Boucle des produits à ajouter dans l'html
    let htmlToAdd = ""
    allProducts.forEach(singleProduct => {
        if (singleProduct) {
            htmlToAdd +=
                `
                <a href="./product.html?id=${singleProduct._id}">
            <article>
              <img src="${singleProduct.imageUrl}" alt="${singleProduct.altTxt}">
              <h3 class="productName">${singleProduct.name}</h3>
              <p class="productDescription">${singleProduct.description}</p>
            </article>
          </a>
            `
        }
    })
    //Ajout de la boucle à l'html
    itemsContainer.innerHTML = htmlToAdd
}

//Récupération et envoie de tout les articles de L'API
async function fetchAllProducts() {
    fetch("http://localhost:3000/api/products/")
        .then(response => response.json())
        .then(data => displayAllProducts(data))
        .catch(error => console.log(error))
}
fetchAllProducts()