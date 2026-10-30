
const pages = {
  dashboard: {
    title: "Admin Dashboard",
    content: `
      <div class="stats">
        <div class="card"><p>Registered Schools</p><strong>3</strong></div>
        <div class="card"><p>Teachers</p><strong>12</strong></div>
        <div class="card"><p>Students</p><strong>180</strong></div>
      </div>
      <div class="panel">
        <h2>Annual Learning Calendar</h2>
        <p class="muted">July – February · Robotics, Coding & AI</p>
        <div class="list-item"><span>July — Electronics Foundations</span><span class="tag">Planned</span></div>
        <div class="list-item"><span>August — Sensors & Circuits</span><span class="tag">Planned</span></div>
        <div class="list-item"><span>September — Interactive Projects</span><span class="tag">Planned</span></div>
        <div class="list-item"><span>October — Games & Automation</span><span class="tag">Planned</span></div>
        <div class="list-item"><span>November–February — Advanced Projects</span><span class="tag">Planned</span></div>
      </div>
      <div class="panel">
        <h2>Ai Robotics Academy</h2>
        <p>This is the starting layout for your multi-school robotics learning platform.</p>
      </div>`
  },
  schools: {
    title: "School Management",
    content: `<div class="panel"><h2>Schools</h2><p>Later, this page will let authorized administrators register schools and manage their school codes.</p><p class="muted">No real schools are registered in this prototype.</p></div>`
  },
  teachers: {
    title: "Teacher Management",
    content: `<div class="panel"><h2>Teachers</h2><p>Later, authorized administrators will invite teachers and assign them to schools.</p></div>`
  },
  students: {
    title: "Student Management",
    content: `<div class="panel"><h2>Students</h2><p>Later, authorized teachers and administrators will manage student accounts and progress.</p></div>`
  },
  curriculum: {
    title: "Curriculum Management",
    content: `<div class="panel"><h2>Annual Curriculum</h2><p>July–February · Classes 3–7</p><p>Our next step is to add editable lessons, project guides, homework and assessments.</p></div>`
  }
};

function showPage(pageName) {
  const page = pages[pageName];
  document.getElementById("page-title").textContent = page.title;
  document.getElementById("page-content").innerHTML = page.content;

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.page === pageName);
  });
}


const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");

function openMenu() {
  sidebar.classList.add("open");
  sidebarOverlay.classList.add("visible");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close navigation menu");
  menuToggle.textContent = "×";
}

function closeMenu() {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("visible");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  menuToggle.textContent = "☰";
}

menuToggle.addEventListener("click", () => {
  if (sidebar.classList.contains("open")) {
    closeMenu();
  } else {
    openMenu();
  }
});

sidebarOverlay.addEventListener("click", closeMenu);

document.querySelectorAll(".nav-btn").forEach(button => {
  button.addEventListener("click", () => {
    showPage(button.dataset.page);
    closeMenu();
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

showPage("dashboard");

