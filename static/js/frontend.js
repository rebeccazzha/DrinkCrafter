function FrontEnd() {
  const me = {};

  me.reloadDrinks = async function () {
    const res = await fetch("/api/drinks");
    if (res.status !== 200) {
      console.error("Error loading drinks");
      return;
    }
    const drinks = await res.json();
    me.renderDrinks(drinks);
  };

  const renderDrink = function (drink) {
    const detailPageLink = `/detail.html?id=${drink._id}`;
    return `
    <div class="col-sm-12 col-md-4 thumb-container">
        <div class="card h-100">
            <img src="${drink.image_url}" class="card-img-top thumbnail-image" alt="${drink.label}">
            <div class="card-body">
                <h5 class="card-title">${drink.label}</h5>
                <p class="card-text">Ingredients: ${drink.description}</p>
                <a href="${detailPageLink}" class="btn btn-primary">Explore</a>
            </div>
        </div>
    </div>`;
};


  me.renderDrinks = function (drinks) {
    const drinksContainer = document.querySelector("#drinks-container");
    drinksContainer.innerHTML = drinks.map(renderDrink).join("\n");
  };

  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function() {
      const baseId = this.dataset.baseId;
      frontend.filterByBaseId(baseId);
    });
  });
  
  me.filterByBaseId = async function (baseId) {
    const endpoint = baseId == 0 ? '/api/drinks' : `/api/drinks?base_id=${baseId}`;
    const res = await fetch(endpoint);
    if (res.status !== 200 && res.status !== 304) {
      console.error("Error loading drinks");
      return;
    }
    const drinks = await res.json();
    me.renderDrinks(drinks);
  };
  
  
  

  return me;
}

const frontend = FrontEnd();
frontend.reloadDrinks();
  
