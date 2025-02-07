const showBtn = document.getElementById("show-btn");
const password = document.querySelector("input[type='password']");
showBtn.addEventListener("click", () => {
  if (password.type === "password") {
    password.type = "text";
    showBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
  } else {
    password.type = "password";
    showBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
  }
});
