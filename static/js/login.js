function LogIn() {
  const me = {};

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
      console.log(response);

      if (response.status === 200) {
        const data = await response.json();
        const userData = { username: userName };
        sessionStorage.setItem("user", JSON.stringify(userData));

        logInForm.querySelector('input[name="username"]').value = "";
        logInForm.querySelector('input[name="password"]').value = "";
        window.location.href = "./index.html";
      } else {
        errorContainer.textContent =
          "Username or password is incorrect. Please try again.";
        console.error("Error login");
      }
    });
  });

  return me;
}

const logIn = LogIn();
