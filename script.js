
const STORAGE_KEY = "steamx_schools";

let schools = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentPage = "dashboard";
let editingSchoolId = null;

// Save schools in browser storage
function saveSchools() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schools));
}

// Generate a unique school code
function generateSchoolCode() {
    let code;

    do {
        code = "STM-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    } while (schools.some(school => school.code === code));

    return code;
}

// Protect displayed text from HTML injection
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

// Dashboard
function dashboardPage() {
    return `
        <div class="stats">
            <div class="card">
                <p>Registered Schools</p>
                <strong>${schools.length}</strong>
            </div>

            <div class="card">
                <p>Teachers</p>
                <strong>0</strong>
            </div>

            <div class="card">
                <p>Students</p>
                <strong>0</strong>
            </div>
        </div>

        <div class="panel">
            <h2>Annual Learning Calendar</h2>
            <p class="muted">July – February · Robotics, Coding & AI</p>

            ${[
                "July — Electronics Foundations",
                "August — Sensors & Circuits",
                "September — Interactive Projects",
                "October — Games & Automation",
                "November — AI & Sensing",
                "December — Smart Systems",
                "January — Logic & Automation",
                "February — Final Projects"
            ].map(month => `
                <div class="list-item">
                    <span>${month}</span>
                    <span class="tag">Planned</span>
                </div>
            `).join("")}
        </div>

        <div class="panel">
            <h2>Welcome to Steamx Academy</h2>
            <p>Manage your schools and build the future of robotics education.</p>
        </div>
    `;
}

// School management page
function schoolsPage() {
    return `
        <div class="panel">
            <div class="section-heading">
                <div>
                    <h2>School Management</h2>
                    <p class="muted">Register and manage your partner schools.</p>
                </div>

                <button class="primary-btn" id="add-school-btn">
                    + Add School
                </button>
            </div>

            <div id="school-form-container"></div>

            <div class="search-box">
                <input
                    type="text"
                    id="school-search"
                    placeholder="Search schools by name, city or code..."
                >
            </div>

            <div class="school-count">
                Total registered schools: <strong>${schools.length}</strong>
            </div>

            <div id="school-list">
                ${schoolListHTML()}
            </div>
        </div>
    `;
}

// School list
function schoolListHTML(search = "") {
    const filteredSchools = schools.filter(school =>
        [
            school.name,
            school.city,
            school.code
        ].some(value =>
            String(value || "").toLowerCase().includes(search.toLowerCase())
        )
    );

    if (filteredSchools.length === 0) {
        return `
            <div class="empty-state">
                <h3>No schools found</h3>
                <p>Try another search or add a new school.</p>
            </div>
        `;
    }

    return filteredSchools.map(school => `
        <div class="school-record">
            <div class="school-details">
                <h3>${escapeHTML(school.name)}</h3>
                <p>${escapeHTML(school.city)}</p>
                <p class="school-code">
                    School Code: <strong>${escapeHTML(school.code)}</strong>
                </p>
                <p class="muted">Contact: ${escapeHTML(school.contact || "Not provided")}</p>
                <p class="muted">${escapeHTML(school.email || "No email provided")}</p>
            </div>

            <div class="school-actions">
                <button class="edit-btn" data-edit="${escapeHTML(school.id)}">
                    Edit
                </button>

                <button class="delete-btn" data-delete="${escapeHTML(school.id)}">
                    Delete
                </button>
            </div>
        </div>
    `).join("");
}

// School form
function schoolFormHTML(school = null) {
    const editing = Boolean(school);

    return `
        <div class="school-form">
            <h3>${editing ? "Edit School" : "Register New School"}</h3>

            <form id="school-form">
                <label>School Name *</label>
                <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter school name"
                    value="${escapeHTML(school?.name || "")}"
                >

                <label>City *</label>
                <input
                    type="text"
                    name="city"
                    required
                    placeholder="Enter city"
                    value="${escapeHTML(school?.city || "")}"
                >

                <label>Contact Person</label>
                <input
                    type="text"
                    name="contact"
                    placeholder="Principal / Coordinator"
                    value="${escapeHTML(school?.contact || "")}"
                >

                <label>School Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="school@example.com"
                    value="${escapeHTML(school?.email || "")}"
                >

                <div class="form-actions">
                    <button type="submit" class="primary-btn">
                        ${editing ? "Update School" : "Save School"}
                    </button>

                    <button type="button" class="cancel-btn" id="cancel-school">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
}

// Display pages
function showPage(pageName) {
    currentPage = pageName;

    const titles = {
        dashboard: "Admin Dashboard",
        schools: "School Management",
        teachers: "Teacher Management",
        students: "Student Management",
        curriculum: "Curriculum Management"
    };

    document.getElementById("page-title").textContent =
        titles[pageName] || "Admin Dashboard";

    const content = document.getElementById("page-content");

    if (pageName === "dashboard") {
        content.innerHTML = dashboardPage();
    } else if (pageName === "schools") {
        content.innerHTML = schoolsPage();
    } else {
        content.innerHTML = `
            <div class="panel">
                <h2>${titles[pageName]}</h2>
                <p class="muted">This section will be developed in the next milestone.</p>
            </div>
        `;
    }

    document.querySelectorAll(".nav-btn").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === pageName
        );
    });

    closeMenu();
}

// Event handling
document.addEventListener("click", function(event) {

    if (event.target.closest("#add-school-btn")) {
        editingSchoolId = null;

        document.getElementById("school-form-container").innerHTML =
            schoolFormHTML();
    }

    if (event.target.closest("#cancel-school")) {
        document.getElementById("school-form-container").innerHTML = "";
    }

    const editButton = event.target.closest("[data-edit]");

    if (editButton) {
        editingSchoolId = editButton.dataset.edit;

        const school = schools.find(s => s.id === editingSchoolId);

        if (school) {
            document.getElementById("school-form-container").innerHTML =
                schoolFormHTML(school);
        }
    }

    const deleteButton = event.target.closest("[data-delete]");

    if (deleteButton) {
        const id = deleteButton.dataset.delete;

        const confirmed = confirm(
            "Are you sure you want to delete this school?"
        );

        if (confirmed) {
            schools = schools.filter(school => school.id !== id);

            saveSchools();
            showPage("schools");
        }
    }

});

// Search schools
document.addEventListener("input", function(event) {
    if (event.target.id === "school-search") {
        document.getElementById("school-list").innerHTML =
            schoolListHTML(event.target.value);
    }
});

// Submit school form
document.addEventListener("submit", function(event) {
    if (event.target.id !== "school-form") return;

    event.preventDefault();

    const formData = new FormData(event.target);

    const schoolData = {
        name: formData.get("name").trim(),
        city: formData.get("city").trim(),
        contact: formData.get("contact").trim(),
        email: formData.get("email").trim()
    };

    if (editingSchoolId) {
        const school = schools.find(s => s.id === editingSchoolId);

        if (school) {
            Object.assign(school, schoolData);
        }

    } else {
        schools.push({
            id: crypto.randomUUID(),
            ...schoolData,
            code: generateSchoolCode(),
            createdAt: new Date().toISOString()
        });
    }

    saveSchools();

    editingSchoolId = null;

    showPage("schools");
});

// Mobile menu
const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");

function openMenu() {
    sidebar.classList.add("open");
    sidebarOverlay.classList.add("visible");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.textContent = "×";
}

function closeMenu() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("visible");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
}

menuToggle.addEventListener("click", () => {
    sidebar.classList.contains("open") ? closeMenu() : openMenu();
});

sidebarOverlay.addEventListener("click", closeMenu);

document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
});

// Start website
showPage("dashboard");
