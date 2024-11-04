document.addEventListener("DOMContentLoaded", function () {
    const part1 = document.querySelector(".sign-up-part-1");
    const part2 = document.querySelector(".sign-up-part-2");
    const part3 = document.querySelector(".sign-up-part-3");
    const nextBtns = document.querySelectorAll(".next");
    const prevBtns = document.querySelectorAll(".prev");
    const userTypeSwitch = document.getElementById("toggle-switch");
    const clientNextBtn = part2.querySelector(".next-btn");

    let isClient = false;

    // Function to update visibility based on user type
    function updateVisibility() {
        part1.style.display = "block";
        part2.style.display = "none";
        part3.style.display = "none";
        clientNextBtn.textContent = isClient ? "Sign Up" : "Next";
    }

    // Initial visibility setup
    updateVisibility();

    // Event listener for user type toggle
    userTypeSwitch.addEventListener("change", () => {
        isClient = userTypeSwitch.checked;
        updateVisibility();
    });

    // Next button functionality
    nextBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (part1.style.display === "block") {
                part1.style.display = "none";
                part2.style.display = "block";
            } else if (part2.style.display === "block") {
                if (isClient) {
                    // If client, "Sign Up" action here
                    alert("Client signed up!");
                    updateVisibility();
                } else {
                    part2.style.display = "none";
                    part3.style.display = "block";
                }
            }
        });
    });

    // Previous button functionality
    prevBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (part2.style.display === "block") {
                part2.style.display = "none";
                part1.style.display = "block";
            } else if (part3.style.display === "block") {
                part3.style.display = "none";
                part2.style.display = "block";
            }
        });
    });
});
