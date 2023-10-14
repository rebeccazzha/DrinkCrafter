function LogOut() {
  const me = {};

  document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector(".logout-btn");

    logoutButton.addEventListener("click", async (event) => {
      event.preventDefault();
      try {
        const response = await fetch("/api2/logout", {
          method: "GET",
        });

        if (response.status === 200) {
          sessionStorage.removeItem("user");
          window.location.href = "./index.html";
        } else {
          console.error("Logout failed");
        }
      } catch (error) {
        console.error("Error during logout:", error);
      }
    });
  });

  return me;
}

const logOut = LogOut();
