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
  const postButton = document.querySelector(".post-btn");

  // Create DOM elements: Render facts in list
  factList.innerHTML = "";

  let facts = [];

  me.reloadFacts = async function () {
    const res = await fetch("/api2/funFacts");
    if (res.status !== 200) {
      console.error("Error loading facts");
      return;
    }
    facts = await res.json();
    me.renderFacts(facts);
  };

  const renderFact = function (fact) {
    const category = CATEGORIES.find((cat) => cat.name === fact.category);
    const backgroundColor = category ? category.color : "#FFFFFF";

    return `
    <li class="fact" id="fact-${fact._id}">
       <p>
       ${fact.text}
         <a class="source" href="${fact.source}" target="_blank">(source)</a>
      </p>
       <span class="tag" style="background-color: ${backgroundColor}">${fact.category}</span>
       <div class="vote-buttons">
       <button class="vote-btn" data-factid="${fact._id}" data-votetype="👍">👍 ${fact.votesInteresting}</button>
       <button class="vote-btn" data-factid="${fact._id}" data-votetype="🤯">🤯 ${fact.votesMindblowing}</button>
       <button class="vote-btn" data-factid="${fact._id}" data-votetype="⛔️">⛔️ ${fact.votesFalse}</button>
       
      </div>
      </li>`;
  };

  me.renderFacts = function (facts) {
    const html = facts.map(renderFact).join("\n");
    factList.insertAdjacentHTML("afterbegin", html);
  };

  document.addEventListener("DOMContentLoaded", function () {
    const voteButtons = document.querySelectorAll(".vote-btn");
    console.log("voteButtons:", voteButtons);
    voteButtons.forEach((button) => {
      console.log("voteButtons:", voteButtons);

      button.addEventListener("click", async () => {
        console.log("CLick vote!");
        const factId = button.getAttribute("data-factid");
        const voteType = button.getAttribute("data-votetype");
        console.log(factId, voteType);

        const response = await fetch("/api2/voteFact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ factId, voteType }),
        });

        if (response.status === 200) {
          const updatedFact = await response.json();
          const factElement = document.getElementById(`fact-${factId}`);
          if (factElement) {
            const votesElement = factElement.querySelector(
              `button[data-factid="${factId}"][data-votetype="${voteType}"]`
            );
            if (votesElement) {
              votesElement.textContent = `${voteType} ${updatedFact.votes}`;
            }
          }
        } else {
          console.error("Error voting for fact");
        }
      });
    });
  });

  // const handleVoteButtonClick = async (event) => {
  //   const button = event.target;
  //   const factId = button.getAttribute("data-factid");
  //   const voteType = button.getAttribute("data-votetype");

  //   const response = await fetch("/api2/voteFact", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ factId, voteType }),
  //   });

  //   if (response.status === 200) {
  //     const updatedFact = await response.json();
  //     const factElement = document.getElementById(`fact-${factId}`);
  //     if (factElement) {
  //       const votesElement = factElement.querySelector(
  //         `button[data-factid="${factId}"][data-votetype="${voteType}"]`
  //       );
  //       if (votesElement) {
  //         votesElement.textContent = `${voteType} ${updatedFact.votes}`;
  //       }
  //     }
  //   } else {
  //     console.error("Error voting for fact");
  //   }
  // };

  const categoryFilter = function CategoryFilter() {
    const categoryButtons = CATEGORIES.map(
      (cat) => `
      <li class="category">
        <button class="btn btn-category" data-category="${cat.name}" style="background-color: ${cat.color}">
          ${cat.name}
        </button>
      </li>
    `
    ).join("");

    return `
      <aside>
        <ul>
          <li class="category">
            <button class="btn btn-all">ALL</button>
          </li>
          ${categoryButtons}
        </ul>
      </aside>
    `;
  };

  categoryList.innerHTML = categoryFilter();

  const allButton = document.querySelector(".btn-all");
  document.addEventListener("DOMContentLoaded", function () {
    allButton.addEventListener("click", async () => {
      await me.reloadFacts();
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    categoryList.addEventListener("click", async (event) => {
      if (event.target.classList.contains("btn")) {
        const category = event.target.getAttribute("data-category");

        facts.forEach((fact) => {
          const factElement = document.getElementById(`fact-${fact._id}`);
          if (factElement) {
            factElement.style.display = "none";
          }
        });

        facts
          .filter((fact) => fact.category === category)
          .forEach((fact) => {
            const factElement = document.getElementById(`fact-${fact._id}`);
            if (factElement) {
              factElement.style.display = "block";
            }
          });
      }
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    postButton.addEventListener("click", async (event) => {
      event.preventDefault();

      const factText = factForm.querySelector('input[name="factText"]').value;
      const source = factForm.querySelector('input[name="source"]').value;
      console.log("Button clicked!");
      const category = factForm.querySelector('select[name="category"]').value;

      const factData = {
        factText,
        source,
        category,
      };

      const response = await fetch("/api2/postFact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(factData),
      });

      if (response.status === 200) {
        factForm.querySelector('input[name="factText"]').value = "";
        factForm.querySelector('input[name="source"]').value = "";
        factForm.querySelector('select[name="category"]').value = "";
      } else {
        console.error("Error posting fact");
      }
    });
  });

  return me;
}

const frontend2 = FrontEnd2();
frontend2.reloadFacts();
