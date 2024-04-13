document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("taxForm");
  const modal = document.getElementById("modal");
  const taxDetails = document.getElementById("taxDetails");
  const submitButton = form.querySelector("button[type='submit']");
  const closeButton = document.querySelector(".close-button");

  modal.style.display = "none";
function showWarningIcon(inputElement, message) {
  const inputContainer = inputElement.closest(".input-container");

  // Create warning icon if not already present
  if (!inputContainer.querySelector(".warning-icon")) {
    const warningIcon = document.createElement("span");
    warningIcon.className = "warning-icon";
    warningIcon.textContent = "ⓘ"; // Warning icon

    // Create tooltip-like message
    const tooltipMessage = document.createElement("span");
    tooltipMessage.className = "tooltip-message";
    tooltipMessage.textContent = message; // Set message content

    // Append warning icon and tooltip message to input container
    inputContainer.appendChild(warningIcon);
    inputContainer.appendChild(tooltipMessage);

    // Position tooltip message relative to warning icon
    tooltipMessage.style.top = `${warningIcon.offsetTop}px`;

    // Show tooltip message on hover over warning icon
    warningIcon.addEventListener("mouseover", () => {
      tooltipMessage.style.visibility = "visible";
      tooltipMessage.style.opacity = "1";
    });

    // Hide tooltip message when mouse leaves the warning icon
    warningIcon.addEventListener("mouseout", () => {
      tooltipMessage.style.visibility = "hidden";
      tooltipMessage.style.opacity = "0";
    });
  }
}
  function hideWarningIcon(inputElement) {
    const inputContainer = inputElement.closest(".input-container");
    const warningIcon = inputContainer.querySelector(".warning-icon");
    const tooltipMessage = inputContainer.querySelector(".tooltip-message");
    if (warningIcon) inputContainer.removeChild(warningIcon);
    if (tooltipMessage) inputContainer.removeChild(tooltipMessage);
  }

  function validateInput(inputElement) {
    const inputValue = inputElement.value.trim();
    const isValid = !isNaN(parseFloat(inputValue)) && isFinite(inputValue);
    return isValid;
  }

  function handleInput(inputElement) {
    const isValid = validateInput(inputElement);
    if (isValid) {
      hideWarningIcon(inputElement);
    } else {
      showWarningIcon(inputElement, "Please enter numbers only.");
    }
    submitButton.disabled = !isValid;
  }

  // Add input event listeners to the numeric input fields
  const numericInputs = form.querySelectorAll('input[type="text"]');
  numericInputs.forEach((input) => {
    input.addEventListener("input", () => {
      handleInput(input);
    });

    input.addEventListener("change", () => {
      if (input.value.trim() === "") {
        hideWarningIcon(input);
        submitButton.disabled = false;
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hideWarningIcon(document.getElementById("income"));
    hideWarningIcon(document.getElementById("extraIncome"));
    hideWarningIcon(document.getElementById("deductions"));

    const age = document.getElementById("age").value;
    const income = parseFloat(document.getElementById("income").value) || 0;
    const extraIncome =
      parseFloat(document.getElementById("extraIncome").value) || 0;
    const deductions =
      parseFloat(document.getElementById("deductions").value) || 0;

    let isValid = true;

    if (!age) {
      showError("Please select your age group.");
      isValid = false;
    }

    if (!validateInput(document.getElementById("income"))) {
      showError("Invalid income value.");
      isValid = false;
    }

    if (!validateInput(document.getElementById("extraIncome"))) {
      showError("Invalid extra income value.");
      isValid = false;
    }

    if (isValid) {
      const taxableIncome = income + extraIncome - deductions;
      let taxAmount = 0;

      if (taxableIncome > 800000) {
        if (age === "<40") {
          taxAmount = (taxableIncome - 800000) * 0.3;
        } else if (age === "≥40 &lt;60") {
          taxAmount = (taxableIncome - 800000) * 0.4;
        } else if (age === "≥60") {
          taxAmount = (taxableIncome - 800000) * 0.1;
        }
      }

      const overallIncome = taxableIncome + deductions;
      const afterTaxDeductions = overallIncome - taxAmount;

      const formattedAfterTaxDeductions =
        formatNumberWithCommas(afterTaxDeductions);

      taxDetails.innerHTML = `
      <h1><strong>Your Overall Income will be</strong></h1>
      <span>${formattedAfterTaxDeductions}</span>
      <h5>After tax deductions</h5>
    `;

      modal.style.display = "block";
    }
  });
  function formatNumberWithCommas(number) {
    // Convert number to string
    const numberStr = number.toString();

    // Split into parts for integer and decimal
    const parts = numberStr.split(".");
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? "." + parts[1] : "";

    // Add commas for thousands, lakhs, etc. using regex
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{2})+(?!\d))/g,
      ","
    );

    // Combine integer and decimal parts
    return formattedIntegerPart + decimalPart;
  }
closeButton.addEventListener("click", () => {
  // Close the modal when the close button is clicked
  modal.style.display = "none";
});
});
