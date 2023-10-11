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
  
    const CATEGORIES = [
      { name: "rum", base_id: 3, color: "#3b82f6" },
      { name: "whiskey", base_id: 2, color: "#16a34a" },
      { name: "vodka", base_id: 1, color: "#ef4444" },
      { name: "tequila", base_id: 4, color: "#eab308" },
      { name: "gin", base_id: 5, color: "#db2777" },
      { name: "brandy", base_id: 7, color: "#14b8a6" },
    ];
  
    const renderDrink = function (drink) {
      const category = CATEGORIES.find((cat) => cat.base_id === drink.base_id);
      const drinkName = category ? category.name : "other";
      const backgroundColor = category ? category.color : "#FFFFFF";
  
      const detailPageLink = `/detail.html?id=${drink._id}`;
      return `
      <div class="col-sm-12 col-md-4 thumb-container">
          <div class="card h-100">
              <img src="${drink.image_url}" class="card-img-top thumbnail-image" alt="${drink.label}">
              <div class="card-body">
                  <h5 class="card-title">${drink.label}</h5>
                  <span class="tag" style="background-color: ${backgroundColor}">${drinkName}</span>
                  <p class="card-text">Ingredients: ${drink.description}</p>
                  <a href="${detailPageLink}" class="btn btn-explore">Explore</a>
              </div>
          </div>
      </div>`;
    };
  
    me.renderDrinks = function (drinks) {
      const drinksContainer = document.querySelector("#drinks-container");
      drinksContainer.innerHTML = drinks.map(renderDrink).join("\n");
    };
  
    return me;
  }
  
  const frontend = FrontEnd();
  frontend.reloadDrinks();
  