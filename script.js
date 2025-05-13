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

    // Check for drill or test first
    const drillTestKeywords = [
      "drill", "test", "exercise", "rehearsal", "practice", "simulation", "fire drill", "earthquake drill", "active shooter drill"
    ];

    // Critical Keywords (life-threatening, immediate danger)
    const criticalKeywords = [
      "shooter", "active shooter", "bomb", "explosion", "fire", "fireball", "smoke", "hazardous material", "chemical spill", "poison",
      "gun", "earthquake", "tsunami", "hurricane", "tornado", "flood", "wildfire", "terrorist", "hostage", "kidnapping", "riots", 
      "violence", "building collapse", "crash", "plane crash", "car accident", "gas leak", "hostage situation", "flooding", 
      "school shooting", "emergency evacuation", "lockdown", "tsunami warning", "flood warning", "hurricane warning", "gas explosion",
      "medical emergency", "heart attack", "stroke", "severe injury", "severe bleeding", "fire evacuation"
    ];

    // Moderate Keywords (non-immediate, requires attention but not critical)
    const moderateKeywords = [
      "fire drill", "earthquake drill", "shooter drill", "evacuation", "first aid", "safety drill", "alarm", "construction",
      "workshop", "school evacuation", "lockdown drill", "school closure", "maintenance", "storm warning", "hazard", "road closure",
      "traffic accident", "minor injury", "sick student", "weather alert", "building inspection", "shelter in place", "pest control",
      "temporary evacuation", "medical checkup", "minor accident", "training session"
    ];

    // Important Keywords (serious but not life-threatening)
    const importantKeywords = [
      "tiger", "lion", "animal", "escaped animal", "wild animal", "dangerous animal", "bear", "shark", "snake", "pest infestation",
      "dog attack", "school fight", "aggressive student", "mental health issue", "injury", "fall", "collapsed ceiling", "leak",
      "collapsed building", "injured person", "broken arm", "bleeding", "medical emergency", "heat exhaustion", "fainting", "high fever",
      "panic attack", "behavioral issue", "physical altercation", "dangerous crowd", "falling debris", "unsafe conditions",
      "stray animal", "animal sighting", "dangerous situation"
    ];

    // Not Important Keywords (routine or trivial situations)
    const notImportantKeywords = [
      "game", "party", "class", "test", "homework", "field trip", "recess", "lunch break", "assembly", "meeting", "schedule change",
      "project", "vacation", "birthday", "holiday", "staff meeting", "presentation", "non-urgent", "play", "textbook", "book report",
      "school supply", "field day", "pop quiz", "announcement", "guest speaker", "relocation", "sick day", "exams", "quiz"
    ];

    // First check for "drill" or "test" to prevent them being classified as critical
    for (let keyword of drillTestKeywords) {
      if (lowerInput.includes(keyword)) {
        return "Moderate";
      }
    }

    // Check if the input matches any of the Critical keywords
    for (let keyword of criticalKeywords) {
      if (lowerInput.includes(keyword) && !lowerInput.includes("drill") && !lowerInput.includes("test")) {
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

    // If no match, return Uncertain
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
      if (severity === "Critical" || severity === "Important" || severity === "Moderate") {
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

    const additionalInfo = document.getElementById("additionalInfo").value.trim();
    
    // Prepare email data
    const emailData = {
      SEVERITY: severity,
      email: recipientEmails,
      EMERGENCY: input.value.trim(),
      OTHER_INFO: additionalInfo
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
