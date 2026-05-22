const cursor = document.querySelector(".cursor-ring");

let mouseX = 0;
let mouseY = 0;

let x = 0;
let y = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animate() {
  x += (mouseX - x) * 0.18;
  y += (mouseY - y) * 0.18;

  cursor.style.transform = `translate(${x}px, ${y}px)`;

  requestAnimationFrame(animate);
}

animate();

const targets = document.querySelectorAll(
  "a, button, .project-card, .about-card, .card, .navbar, footer"
);

targets.forEach(el => {
  el.addEventListener("mouseover", () => {
    cursor.style.opacity = "0";
  });

  el.addEventListener("mouseout", () => {
    cursor.style.opacity = "1";
  });
});