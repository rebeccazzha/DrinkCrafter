function FrontEnd2() {
  const me = {};
  const CATEGORIES = [
    { name: "rum", color: "#3b82f6" },
    { name: "whiskey", color: "#16a34a" },
    { name: "vodka", color: "#ef4444" },
    { name: "tequila", color: "#eab308" },
    { name: "gin", color: "#db2777" },
    { name: "brandy", color: "#14b8a6" },
    { name: "wine", color: "#f97316" },
  ];

  // Selecting DOM elements
  const toggleButton = document.querySelector(".btn-open");
  const factForm = document.querySelector(".fact-form");
  const factList = document.querySelector(".fact-list");

  // Create DOM elements: Render facts in list
  factList.innerHTML = "";

  me.reloadFacts = async function () {
    const res = await fetch("/api/funFacts");
    if (res.status !== 200) {
      console.error("Error loading drinks");
      return;
    }
    const facts = await res.json();
    createFactList(facts);
  };

  function createFactList(dataArray) {
    const htmlArr = dataArray.map(
      (fact) => `<li class="fact">
            <p>
            ${fact.text}
              <a class="source" href="${
                fact.source
              }" target="_blank">(source)</a>
            </p>
            <span class="tag" style="background-color: ${
              CATEGORIES.find((cat) => cat.name === fact.category).color
            }">${fact.category}</span>
            </li>`
    );
    const html = htmlArr.join("");
    factList.insertAdjacentHTML("afterbegin", html);
  }

  // Toggle form visibility
  toggleButton.addEventListener("click", function () {
    if (factForm.classList.contains("hidden")) {
      factForm.classList.remove("hidden");
      toggleButton.textContent = "CLOSE";
    } else {
      factForm.classList.add("hidden");
      toggleButton.textContent = "SHARE";
    }
  });

  return me;
}

const frontend = FrontEnd2();
frontend.reloadDrinks();
frontend.reloadFacts();
