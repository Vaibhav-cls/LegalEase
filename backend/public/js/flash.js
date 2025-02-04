window.addEventListener("load", () => {
  let successToast = document.getElementById("successToast");
  let errorToast = document.getElementById("errorToast");

  if (successToast) {
    successToast.classList.add("show");
    setTimeout(() => {
      successToast.classList.remove("show");
    }, 3000);
  }

  if (errorToast) {
    errorToast.classList.add("show");
    setTimeout(() => {
      errorToast.classList.remove("show");
    }, 3000);
  }
});
