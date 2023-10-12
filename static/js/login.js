function LogIn() {
  const me = {};
  let userToken = null;

  document.addEventListener("DOMContentLoaded", () => {
    const logInBtn = document.querySelector(".btn-submit");
    const logInForm = document.querySelector(".form-signin");
    const errorContainer = document.querySelector(".error-message");

    logInBtn.addEventListener("click", async (event) => {
      event.preventDefault();

      const userName = logInForm.querySelector('input[name="username"]').value;
      const userPsw = logInForm.querySelector('input[name="password"]').value;

      const userData = {
        userName,
        userPsw,
      };

      const response = await fetch("/api2/verifyUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.status === 200) {
        const data = await response.json();
        userToken = data.token;
        logInForm.querySelector('input[name="username"]').value = "";
        logInForm.querySelector('input[name="password"]').value = "";
        window.location.href = "./index.html";
      } else {
        errorContainer.textContent =
          "Username or password is incorrect. Please try again.";
        console.error("Error posting fact");
      }
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector(".logout-btn");

    logoutButton.addEventListener("click", async (event) => {
      event.preventDefault();
      if (userToken) {
        try {
          const response = await fetch("/api2/logout", {
            method: "POST",
            headers: {
              Authorization: userToken,
            },
          });

          if (response.status === 200) {
            window.location.href = "/login.html";
          } else {
            console.error("Logout failed");
          }
        } catch (error) {
          console.error("Error during logout:", error);
        }
      } else {
        console.error("User token not found");
      }
    });
  });

  return me;
}

const logIn = LogIn();
