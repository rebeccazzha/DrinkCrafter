function SignUp() {
  const me = {};

  document.addEventListener("DOMContentLoaded", () => {
    const signUpBtn = document.querySelector(".btn-submit");
    const signUpForm = document.querySelector(".form-signin");

    signUpBtn.addEventListener("click", async (event) => {
      event.preventDefault();

      const userName = signUpForm.querySelector('input[name="username"]').value;
      const userPsw = signUpForm.querySelector('input[name="password"]').value;

      const userData = {
        userName,
        userPsw,
      };

      const response = await fetch("/api2/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.status === 200) {
        signUpForm.querySelector('input[name="username"]').value = "";
        signUpForm.querySelector('input[name="password"]').value = "";
        window.location.href = "./login.html";
      } else {
        console.error("Error adding user");
      }
    });
  });

  return me;
}

const signUp = SignUp();
