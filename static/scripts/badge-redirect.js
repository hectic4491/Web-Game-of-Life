const githubBadge = document.getElementById("githubButton");
const linkedinBadge = document.getElementById("linkedinButton");
const instagramBadge = document.getElementById("instagramButton");


const githubURL = "https://github.com/hectic4491";
const linkedinURL = "https://www.linkedin.com/in/rob-hunt-developer";
const instagramURL = "https://www.instagram.com/furtiveplant/";


$("#githubButton").click(() => {
  window.open(githubURL, "_blank");
});
$("#linkedinButton").click(() => {
  window.open(linkedinURL, "_blank");
});
$("#instagramButton").click(() => {
  window.open(instagramURL, "_blank");
});