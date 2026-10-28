// Portfolio interactions: navigation, project carousel, and video modal.
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.querySelector(".main-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Search is intentionally visual only for now; keep the typed text in the box.
document.getElementById("searchForm").addEventListener("submit", event => {
  event.preventDefault();
});

// Add your own project screenshots to assets/project-1.jpg ... assets/project-7.jpg.
const projects = [
  { image: "assets/project-1.png", title: "CCPOS Sewing Department POS" },
  { image: "assets/project-2.png", title: "Digital Artwork / Poster Design" },
  { image: "assets/project-3.png", title: "PC Build and Design" },
  { image: "assets/project-4.png", title: "Back to School Information Poster" },
  { image: "assets/project-5.png", title: "Website Design Project" },
  { image: "assets/project-6.png", title: "Database / Programming Project" },
  { image: "assets/project-7.png", title: "Other Academic Projects" }
];
let currentSlide = 0;
const projectImage = document.getElementById("projectImage");
const projectFallback = document.getElementById("projectFallback");
const fallbackTitle = document.getElementById("fallbackTitle");
const dots = [...document.querySelectorAll(".dot")];

function showProject(index) {
  currentSlide = (index + projects.length) % projects.length;
  const project = projects[currentSlide];
  projectImage.style.display = "block";
  projectFallback.style.display = "none";
  projectImage.src = project.image;
  projectImage.alt = project.title;
  fallbackTitle.textContent = project.title;
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSlide);
    dot.setAttribute("aria-pressed", String(i === currentSlide));
  });
  projectImage.onerror = () => {
    projectImage.style.display = "none";
    projectFallback.style.display = "grid";
  };
}
document.getElementById("prevSlide").addEventListener("click", () => showProject(currentSlide - 1));
document.getElementById("nextSlide").addEventListener("click", () => showProject(currentSlide + 1));
dots.forEach(dot => dot.addEventListener("click", () => showProject(Number(dot.dataset.slide))));

// Video modal: play the video stored in assets/portfolio-video.mp4.
const modal = document.getElementById("videoModal");
const video = document.getElementById("portfolioVideo");

function openModal() {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  video.load();
  video.play().catch(() => {
    // The browser may wait for the user to press Play; the video controls remain available.
  });
}
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  video.pause();
}
document.getElementById("openVideo").addEventListener("click", openModal);
document.getElementById("closeVideo").addEventListener("click", closeModal);
modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeModal(); });

// The range control is a working scrollbar for the skills image strip.
const skillGallery = document.getElementById("skillGallery");
const skillsScroller = document.getElementById("skillsScroller");

function updateSkillsScroller() {
  if (!skillGallery || !skillsScroller) return;
  const maxScroll = skillGallery.scrollWidth - skillGallery.clientWidth;
  skillsScroller.value = maxScroll <= 0 ? 0 : Math.round((skillGallery.scrollLeft / maxScroll) * 100);
}

if (skillGallery && skillsScroller) {
  skillsScroller.addEventListener("input", () => {
    const maxScroll = skillGallery.scrollWidth - skillGallery.clientWidth;
    skillGallery.scrollLeft = maxScroll * (Number(skillsScroller.value) / 100);
  });
  skillGallery.addEventListener("scroll", updateSkillsScroller, { passive: true });
  window.addEventListener("resize", updateSkillsScroller);
  window.addEventListener("load", updateSkillsScroller);
  updateSkillsScroller();
}

// Also allow mouse-dragging the skills strip left or right.
if (skillGallery) {
  let isDraggingSkills = false;
  let startSkillsX = 0;
  let startingSkillsScroll = 0;
  skillGallery.addEventListener("pointerdown", event => {
    if (event.target.closest("a, button, input")) return;
    isDraggingSkills = true;
    startSkillsX = event.clientX;
    startingSkillsScroll = skillGallery.scrollLeft;
    skillGallery.setPointerCapture(event.pointerId);
  });
  skillGallery.addEventListener("pointermove", event => {
    if (!isDraggingSkills) return;
    skillGallery.scrollLeft = startingSkillsScroll - (event.clientX - startSkillsX);
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(type => {
    skillGallery.addEventListener(type, () => { isDraggingSkills = false; });
  });
}
