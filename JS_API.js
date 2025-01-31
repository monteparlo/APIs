
//BMO 
document.addEventListener("DOMContentLoaded", function () {
  var face = document.getElementById("face");
  var expression = document.getElementById("expression");
  var blocks = document.getElementById("blocks");
  var isActive = false; 
  function toggleExpression() {
      if (isActive) {
          
          face.src = "assets/face.png"; 
          expression.src = "assets/music.png"; 
          blocks.classList.remove("show"); 
      } else {
          
          face.src = "assets/onhoverface.png"; 
          expression.src = "assets/onhover.png"; 
          blocks.classList.add("show"); 
      }
      isActive = !isActive; 
  }

  face.addEventListener("mouseenter", toggleExpression);
  face.addEventListener("mouseleave", toggleExpression);

  face.addEventListener("click", function () {
      toggleExpression();
  });
});


 //Spotify API