function Index() {
  const me = {};
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event fired.");
    const loginButton = document.querySelector(".login");
    const welcomeElement = document.querySelector(".welcome-text");
    const signupButton = document.querySelector(".signup");

    const userLoggedIn = checkUserLoginStatus();

    if (userLoggedIn) {
      loginButton.style.display = "none";
      signupButton.style.display = "none";
      welcomeElement.style.display = "block";
      welcomeElement.textContent = `Start your journey here ${userLoggedIn.username}!`;
    } else {
      loginButton.style.display = "inline-block";
      signupButton.style.display = "inline-block";
      welcomeElement.style.display = "none";
    }
  });

  function checkUserLoginStatus() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    console.log("User from sessionStorage:", user);
    return user;
  }
  return me;
}

const index = Index();
