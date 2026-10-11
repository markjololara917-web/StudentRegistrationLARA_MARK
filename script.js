
const form = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");
const agreement = document.getElementById("agreement");
const agreementError = document.getElementById("agreementError");

const fields = form.querySelectorAll("[data-required='true']");

function showError(field, message) {
    field.classList.add("error");
    field.setAttribute("aria-invalid", "true");

    const errorMessage = field.closest(".field").querySelector(".error-message");
    errorMessage.textContent = message;
}

function clearError(field) {
    field.classList.remove("error");
    field.removeAttribute("aria-invalid");

    const errorMessage = field.closest(".field").querySelector(".error-message");
    errorMessage.textContent = "";
}

function validateField(field) {
    const value = field.value.trim();
    const label = field.dataset.label;

    field.value = value;
    clearError(field);

    if (value === "") {
        showError(field, label + " is required.");
        return false;
    }

    if (field.id === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(value)) {
            showError(field, "Please enter a valid email address.");
            return false;
        }
    }

    if (field.id === "phone") {
        const phonePattern = /^(09\d{9}|\+639\d{9})$/;

        if (!phonePattern.test(value)) {
            showError(field, "Use 09XXXXXXXXX or +639XXXXXXXXX.");
            return false;
        }
    }

    if (field.id === "birthDate") {
        const selectedDate = new Date(value + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (Number.isNaN(selectedDate.getTime()) || selectedDate >= today) {
            showError(field, "Date of birth must be before today.");
            return false;
        }
    }

    if (field.id === "password" && value.length < 8) {
        showError(field, "Password must contain at least 8 characters.");
        return false;
    }

    if (field.id === "confirmPassword") {
        const password = document.getElementById("password").value;

        if (value !== password) {
            showError(field, "Passwords do not match.");
            return false;
        }
    }

    return true;
}

function validateAgreement() {
    const agreementBox = agreement.closest(".agreement");

    if (!agreement.checked) {
        agreementBox.classList.add("error-agreement");
        agreementError.textContent = "You must agree before registering.";
        return false;
    }

    agreementBox.classList.remove("error-agreement");
    agreementError.textContent = "";
    return true;
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    successMessage.hidden = true;

    let isValid = true;

    fields.forEach(function(field) {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    if (!validateAgreement()) {
        isValid = false;
    }

    if (isValid) {
        fields.forEach(function(field) {
            clearError(field);
        });

        successMessage.textContent =
            "Registration successful! All information has been validated.";

        successMessage.hidden = false;
        successMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    } else {
        const firstError = form.querySelector(".error");

        if (firstError) {
            firstError.focus();
        } else {
            agreement.focus();
        }
    }
});

fields.forEach(function(field) {
    field.addEventListener("input", function() {
        validateField(field);
        successMessage.hidden = true;
    });

    field.addEventListener("change", function() {
        validateField(field);
        successMessage.hidden = true;
    });
});

agreement.addEventListener("change", function() {
    validateAgreement();
    successMessage.hidden = true;
});

document.querySelectorAll(".show-password").forEach(function(button) {
    button.addEventListener("click", function() {
        const target = document.getElementById(button.dataset.target);
        const isVisible = target.type === "text";

        target.setAttribute("type", isVisible ? "password" : "text");

        button.classList.toggle("active", !isVisible);
        button.textContent = isVisible ? "Show" : "Hide";
        button.setAttribute("aria-pressed", String(!isVisible));
        button.setAttribute(
            "aria-label",
            (isVisible ? "Show " : "Hide ") +
            target.dataset.label.toLowerCase()
        );
    });
});

form.addEventListener("reset", function() {
    successMessage.hidden = true;
    agreementError.textContent = "";
    agreement.closest(".agreement").classList.remove("error-agreement");

    fields.forEach(function(field) {
        clearError(field);
    });

    document.querySelectorAll(".show-password").forEach(function(button) {
        const target = document.getElementById(button.dataset.target);

        target.setAttribute("type", "password");
        button.classList.remove("active");
        button.textContent = "Show";
        button.setAttribute("aria-pressed", "false");
        button.setAttribute(
            "aria-label",
            "Show " + target.dataset.label.toLowerCase()
        );
    });
});
