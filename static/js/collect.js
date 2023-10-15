function Collect() {
  const me = {};

  me.reloadDrinks = async function () {
    const userName = checkUserLoginStatus();
    if (!userName) {
      console.error("User not logged in");
      return;
    }

    try {
      const response = await fetch(`/api2/collectDrinks?userName=${userName}`, {
        method: "GET",
      });

      if (response.status !== 200) {
        console.error("Error loading drinks");
        return;
      }

      const drinksObject = await response.json();
      const drinksArray = Object.values(drinksObject);
      me.renderDrinks(drinksArray);
    } catch (error) {
      console.error("Error while fetching the drinks:", error);
    }
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
                  <button class="btn btn-danger remove-drink" data-drink-id="${drink._id}">Remove</button>
              </div>
          </div>
      </div>`;
  };

  me.renderDrinks = function (drinks) {
    const drinksContainer = document.querySelector("#drinks-container");
    drinksContainer.innerHTML = drinks.map(renderDrink).join("\n");

    drinksContainer.querySelectorAll('.remove-drink').forEach(button => {
      button.addEventListener('click', async function() {
          const drinkId = this.dataset.drinkId;
          await me.removeDrink(drinkId);
          me.reloadDrinks();
      });
    });
  };

  me.removeDrink = async function(drinkId) {
    try {
      const userName = checkUserLoginStatus();
      if (!userName) {
        console.error("User not logged in");
        return;
      }
  
      const response = await fetch(`/api2/removeFromCollection?userName=${userName}&drinkId=${drinkId}`, {
        method: "DELETE",
      });
  
      if (response.status !== 200) {
        console.error("Error removing drink");
        return;
      }
  
    } catch (error) {
      console.error("Error while removing the drink:", error);
    }
  };
  
  


  document.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", function () {
      const baseId = this.dataset.baseId;
      collect.filterByBaseId(baseId);
    });
  });

  me.filterByBaseId = async function (baseId) {
    const endpoint =
      baseId == 0
        ? "/api2/collectDrinks"
        : `/api2/collectDrinks?base_id=${baseId}`;
    const res = await fetch(endpoint);
    if (res.status !== 200 && res.status !== 304) {
      console.error("Error loading drinks");
      return;
    }
    const drinks = await res.json();
    me.renderDrinks(drinks);
  };

  function checkUserLoginStatus() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user && user.username ? user.username : null;
  }

  return me;
}

const collect = Collect();
collect.reloadDrinks();
