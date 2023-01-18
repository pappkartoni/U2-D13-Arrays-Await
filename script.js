const url = "https://striveschool-api.herokuapp.com/books"
const allBooks = [];

const getBooks = async () => {
    try {
        return await (await fetch(url)).json();
    } catch (error) {
        console.log(error)
    }
}

const renderBooks = (bookJson) => {
    const row = document.getElementById("shop");
    const htmlString = bookJson.map(createCard).join("");
    row.innerHTML = htmlString;
}

const createCard = (book) => { //{"asin":"1940026091","title":"Pandemic (The Extinction Files, Book 1)","img":"https://images-na.ssl-images-amazon.com/images/I/91xrEMcvmQL.jpg","price":7.81,"category":"scifi"}
    return `<div class="col col-md-4 col-lg-3 mb-3">
                <div class="card mb-4 shadow-sm h-100" data-asin="${book.asin}">
                    <img class="card-img-top img-fluid" src="${book.img}">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${book.category}</h6>
                        <p class="card-text">
                            Price: ${book.price}€
                        </p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <button type="button" class="btn btn-sm btn-outline-secondary" onclick="addToCart(this)">Add</button>
                                <button type="button" class="btn btn-sm btn-outline-secondary" onclick="hideBook(this)">Skip</button>
                            </div>
                            <small class="text-muted">ASIN: ${book.asin}</small>
                        </div>
                    </div>
                </div>
            </div>`
}

const addToCart = (btn) => {
    btn.closest(".card").classList.add("border", "border-success");
    let bookToAdd = findBookById(btn.closest(".card").dataset.asin)
    const cart = document.getElementById("cart-row");
    if (cart.querySelector("#cart-filler")) {
        cart.innerHTML = "";
    }

    if (isNotInCart(bookToAdd)) {
        cart.innerHTML += `<div class="col col-md-4 mb-3">
                            <div class="card mb-4 shadow-sm" data-asin="${bookToAdd.asin}">
                                <div class="row no-gutters">
                                    <div class="col-4">
                                        <img class="card-img-top img-fluid h-100" src="${bookToAdd.img}">
                                    </div>
                                    <div class="col-8">
                                        <div class="card-body">
                                            <h5 class="card-title">${bookToAdd.title}</h5>
                                            <h6 class="card-subtitle mb-2 text-muted">${bookToAdd.category}</h6>
                                            <p class="card-text">
                                                Price: ${bookToAdd.price}€
                                            </p>
                                            <div class="d-flex justify-content-between align-items-center">
                                                <button type="button" class="btn btn-sm btn-outline-secondary" onclick="removeFromCart(this)">Remove</button>
                                                <small class="text-muted">ASIN: ${bookToAdd.asin}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
        updateCartCounter()
    } else {
        alert("Already in cart")
    }
}

const hideBook = (btn) => {
    btn.closest(".col").remove();
}

const removeFromCart = (btn) => {
    document.getElementById("shop").querySelector(`.card[data-asin="${btn.closest(".card").dataset.asin}"]`).classList.remove("border", "border-success");
    hideBook(btn);
    const cart = document.getElementById("cart-row");
    if (cart.childElementCount === 0) {
        renderCartFiller();
    }
    updateCartCounter();
}

const removeAllFromCart = () => {
    const cart = document.getElementById("cart-row");
    cart.querySelectorAll(".btn").forEach((btn) => removeFromCart(btn))
}

const searchForBooks = (event) => {
    const input = event.target.value;
    if (input.length > 2) {
        renderBooks(findBooksByTitle(input));
    } else if (input.length === 0) {
        renderBooks(allBooks);
    }
}

const renderCartFiller = () => {
    const cart = document.getElementById("cart-row");
    cart.innerHTML = `<div class="col-4 offset-4" id="cart-filler">
                        <p>
                            There is nothing in your shopping cart at the moment.
                        </p>
                    </div>`
} 

const findBookById = (id) => {
    return allBooks.find((book) => book.asin === id)
}

const findBooksByTitle = (str) => {
    return allBooks.filter((book) => book.title.toLowerCase().includes(str));
} 

const updateCartCounter = () => {
    let counter = document.querySelector("#count > small");
    counter.innerText = document.querySelectorAll("#cart-row .card").length
}

const isNotInCart = (book) => {
    const cart = document.getElementById("cart-row");
    return cart.querySelector(`.card[data-asin="${book.asin}"]`) === null;
    
}

window.onload = async () => {
    allBooks.push(...await getBooks());
    renderBooks(allBooks);
}