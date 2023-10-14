document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  console.log("Client-Side Retrieved ID:", id);

  if (!id) {
    console.error("ID is not present in the URL.");
    return;
  }

  try {
    const response = await fetch(`/api/details/${id}`);

    if (!response.ok)
      throw new Error("Network response was not ok" + response.statusText);

    const text = await response.text();
    console.log("Response Body:", text);

    try {
      const drink = JSON.parse(text);
      renderDetailPage(drink);
      collectRecipes(drink);
    } catch (parseError) {
      console.error("Error parsing response body:", parseError);
    }
  } catch (error) {
    console.error("Fetch operation error: ", error);
  }
});

function renderDetailPage(drink) {
  const detailHTML = `
    <div class="card h-100">
        <img src="${drink.image_url}" class="card-img-top detail-image" alt="${drink.label}">
        <div class="card-body">
            <h1 id="drink-title">${drink.label}</h1>
            <hr/>
            <h3>Key Ingredients</h3>
            <p id="drink-description">${drink.description}</p>
            <h3>Detailed Recipe</h3>
            <p id="drink-recipe">${drink.recipe}</p>
            <div id="button-wrapper">
            <a class="btn btn-info collect-button">❤️COLLECT</a>
              <a href="./recipe.html" id="back-button" class="btn btn-info">Go Back</a>
            </div>
        </div>
    </div>`;

  const detailContainer = document.querySelector("#detail-container");
  detailContainer.innerHTML = detailHTML;
}

function collectRecipes(drink) {
  const collectButton = document.querySelector(".collect-button");

  collectButton.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("CLICK!");

    const drinkId = drink._id;
    const userLoggedIn = checkUserLoginStatus().username;
    collectDrink(userLoggedIn, drinkId);
  });

  async function collectDrink(userName, drinkId) {
    try {
      const response = await fetch("/api2/addToCollection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, drinkId }),
      });

      if (response.status === 200) {
        console.log("Drink collected successfully");
      } else {
        console.error("Failed to collect the drink");
      }
    } catch (error) {
      console.error("Error while collecting the drink:", error);
    }
  }

  function checkUserLoginStatus() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    console.log("User from sessionStorage:", user);
    return user;
  }
}
