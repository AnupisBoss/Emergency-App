// Wait for the DOM to fully load before attaching event listeners
document.addEventListener('DOMContentLoaded', function () {
  // Get elements
  const button = document.getElementById('check-button');
  const input = document.getElementById('emergency-input');
  const result = document.getElementById('result');
  const sendEmailButton = document.getElementById('send-email-button'); // Hidden button for sending email
  const recipientSelection = document.getElementById('recipient-selection');

  // Define preset emails for each recipient group
  const recipientEmailMap = {
    Parents: "technyctest@gmail.com",
    Students: "anupshanbhag4@gmail.com",
    Staff: "beniscool3479@gmail.com"
  };

  // Define the categorization function with a broad set of keywords
  function categorizeEmergency(inputText) {
    const lowerInput = inputText.toLowerCase();

    const criticalKeywords = [
      "shooter", "gun", "active shooter", "hostage", "explosion", "bomb", "fire", "chemical spill", "gas leak", "poison", 
      "earthquake", "tsunami", "hurricane", "tornado", "flood", "wildfire", "terrorist", "school shooting", "suicide"
    ];

    const moderateKeywords = [
      "fire drill", "evacuation", "first aid", "safety drill", "alarm", "construction", "staff meeting", "school assembly"
    ];

    const importantKeywords = [
      "escaped animal", "dangerous animal", "animal attack", "injured student", "sports injury", "burns", "allergic reaction"
    ];

    const notImportantKeywords = [
      "game", "party", "field trip", "birthday", "homework", "quiz", "test"
    ];

    // Check if the input matches any of the Critical keywords
    for (let keyword of criticalKeywords) {
      if (lowerInput.includes(keyword)) {
        return "Critical";
      }
    }

    // Check if the input matches any of the Important keywords
    for (let keyword of importantKeywords) {
      if (lowerInput.includes(keyword)) {
        return "Important";
      }
    }

    // Check if the input matches any of the Moderate keywords
    for (let keyword of moderateKeywords) {
      if (lowerInput.includes(keyword)) {
        return "Moderate";
      }
    }

    // Check if the input matches any of the Not Important keywords
    for (let keyword of notImportantKeywords) {
      if (lowerInput.includes(keyword)) {
        return "Not Important";
      }
    }

    return "Uncertain";
  }

  // Add event listener for check severity button
  button.addEventListener('click', function () {
    const inputText = input.value.trim(); // Get the trimmed input value

    if (inputText === "") {
      result.textContent = "Please enter a valid emergency.";
      result.style.color = "red";  // Show error in red
      sendEmailButton.style.display = 'none'; // Hide email button when input is invalid
    } else {
      const severity = categorizeEmergency(inputText);

      result.textContent = `Severity Level: ${severity}`;

      // Update color based on severity
      if (severity === "Critical") {
        result.style.color = "red";
      } else if (severity === "Important") {
        result.style.color = "blue";
      } else if (severity === "Moderate") {
        result.style.color = "orange";
      } else if (severity === "Not Important") {
        result.style.color = "green";
      } else {
        result.style.color = "gray";
      }

      // Show the send email button only for critical or important emergencies
      if (severity === "Critical" || severity === "Important") {
        sendEmailButton.style.display = 'block';
      } else {
        sendEmailButton.style.display = 'none';
      }
    }
  });

  // Add event listener for send email button
  sendEmailButton.addEventListener('click', function () {
    const severity = result.textContent.split(":")[1].trim();
    const selectedRecipients = Array.from(recipientSelection.querySelectorAll('input[type="checkbox"]:checked'))
      .map(checkbox => checkbox.value);

    if (selectedRecipients.length === 0) {
      alert("Please select at least one recipient.");
      return;
    }

    // Combine selected emails
    let recipientEmails = selectedRecipients
      .map(role => recipientEmailMap[role])
      .join(",");

    // Prepare email data
    const emailData = {
      SEVERITY: severity,
      email: recipientEmails,
      EMERGENCY: input.value.trim(),
    };

    // Send email using EmailJS
    emailjs.send("service_osnl86s", "template_i8ik4om", emailData)
      .then(function (response) {
        alert("Emergency alert sent successfully!");
      }, function (error) {
        alert("Failed to send alert: " + error);
      });
  });
});
