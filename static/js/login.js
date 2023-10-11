function LogIn() {
  const me = {};

  document.addEventListener("DOMContentLoaded", () => {
    const logInBtn = document.querySelector(".btn-submit");
    const logInForm = document.querySelector(".form-signin");
    console.log("TEST!");

    logInBtn.addEventListener("click", async (event) => {
      event.preventDefault();
      console.log("TEST CLICK!");

      const userName = logInForm.querySelector('input[name="username"]').value;
      const userPsw = logInForm.querySelector('input[name="password"]').value;
      console.log("Button clicked!");

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
        logInForm.querySelector('input[name="username"]').value = "";
        logInForm.querySelector('input[name="password"]').value = "";
        window.location.href = "./index.html";
      } else {
        console.error("Error posting fact");
      }
    });
  });

  return me;
}

const logIn = LogIn();
