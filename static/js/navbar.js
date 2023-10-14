function NavBarLogin() {
  const me = {};
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event fired.");
    const loginButton = document.querySelector(".login-btn");
    const userNameElement = document.querySelector(".user-name");
    const logoutButton = document.querySelector(".logout-btn");

    const userLoggedIn = checkUserLoginStatus();

    if (userLoggedIn) {
      loginButton.style.display = "none";
      logoutButton.style.display = "block";
      userNameElement.style.display = "block";
      userNameElement.textContent = `Hi ${userLoggedIn.username}!`;
    } else {
      loginButton.style.display = "block";
      logoutButton.style.display = "none";
      userNameElement.style.display = "none";
    }
  });

  function checkUserLoginStatus() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    console.log("User from sessionStorage:", user);
    return user;
  }
  return me;
}

const navBarLogin = NavBarLogin();
