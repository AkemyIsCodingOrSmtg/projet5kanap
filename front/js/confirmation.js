//Affichage du numéro de commande
function orderCheckout() {
    const orderId = document.getElementById('orderId')
    orderId.innerHTML = localStorage.getItem('orderId')

    //Supression des données du localStorage
    localStorage.clear()
}
orderCheckout()