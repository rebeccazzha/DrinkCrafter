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
  const categoryList = document.querySelector(".category");

  // Create DOM elements: Render facts in list
  factList.innerHTML = "";

  me.reloadFacts = async function () {
    const res = await fetch("/api2/funFacts");
    if (res.status !== 200) {
      console.error("Error loading facts");
      return;
    }
    const facts = await res.json();
    me.renderFacts(facts);
  };

  const renderFact = function (fact) {
    return `
    <li class="fact">
       <p>
       ${fact.text}
         <a class="source" href="${fact.source}" target="_blank">(source)</a>
      </p>
       <span class="tag" style="background-color: ${
         CATEGORIES.find((cat) => cat.name === fact.category).color
       }">${fact.category}</span>
      </li>`;
  };

  me.renderFacts = function (facts) {
    factList.innerHTML = facts.map(renderFact).join("\n");
  };

  const categoryFilter = function CategoryFilter() {
    return `
    <aside>
    <ul>
      <li class="category">
        <button class="btn btn-all">ALL</button>
      </li>

      {CATEGORIES.map((cat) => (
        <li class="category">
          <button
            class="btn btn-category"
            style={{ backgroundColor: ${cat.color}}
          >
            ${cat.name}
          </button>
        </li>
      ))}
    </ul>
  </aside>
    `;
  };

  // me.renderCategory = function (cats) {
  //   categoryList.innerHTML = cats.map(categoryFilter).join("\n");
  // };

  return me;
}

const frontend2 = FrontEnd2();
frontend2.reloadFacts();
