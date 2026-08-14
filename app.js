/* ==========================================================================
   CAREPULSE APPLICATION CORE - STATE & INTERACTION LOGIC
   ========================================================================== */

// 1. MOCK DATABASE & STATIC DATA
const STATIC_SERVICES = [
  {
    id: "serv-1",
    title: "General Health Consultation",
    category: "consultation",
    categoryLabel: "Specialty Consult",
    classBanner: "gen",
    description: "Detailed medical consultation covering diagnosis, custom health plan, prescription renewals, and specialist referral coordination.",
    duration: "30 Minutes",
    price: 60,
    rating: 4.8,
    reviewCount: 92,
    doctors: [
      { name: "Dr. Olivia Vance", specialty: "Internal Medicine Specialist", rating: 4.9, img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256" },
      { name: "Dr. Liam Kade", specialty: "Family Physician", rating: 4.7, img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256" }
    ]
  },
  {
    id: "serv-2",
    title: "Cardiology Diagnostic Assessment",
    category: "cardiology",
    categoryLabel: "Specialty Consult",
    classBanner: "card",
    description: "In-depth cardiovascular review including ECG diagnostics, vital statistics logging, and genetic risk analysis guidance.",
    duration: "45 Minutes",
    price: 150,
    rating: 4.9,
    reviewCount: 56,
    doctors: [
      { name: "Dr. Noah Sterling", specialty: "Chief of Cardiology", rating: 5.0, img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=256" },
      { name: "Dr. Elena Rostova", specialty: "Interventional Cardiologist", rating: 4.8, img: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=256" }
    ]
  },
  {
    id: "serv-3",
    title: "Comprehensive Blood Panel & Lipid Profile",
    category: "diagnostics",
    categoryLabel: "Diagnostics",
    classBanner: "diag",
    description: "Full hematology screening mapping blood count, glucose, metabolic profiles, thyroid hormones, and liver/kidney biomarkers.",
    duration: "20 Minutes",
    price: 90,
    rating: 4.6,
    reviewCount: 110,
    doctors: [
      { name: "Dr. Helen Ross", specialty: "Clinical Pathologist", rating: 4.7, img: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=256" }
    ]
  },
  {
    id: "serv-4",
    title: "Dental Prophylaxis & Deep Cleanse",
    category: "dental",
    categoryLabel: "Dental Care",
    classBanner: "dent",
    description: "Premium oral healthcare including plaque scaling, stain polish, tooth enamel fluoridation, and ultrasonic checkup.",
    duration: "45 Minutes",
    price: 80,
    rating: 4.7,
    reviewCount: 42,
    doctors: [
      { name: "Dr. Sophia Chen", specialty: "Cosmetic Dentist", rating: 4.8, img: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=256" }
    ]
  },
  {
    id: "serv-5",
    title: "Cognitive Behavioral Therapy (CBT)",
    category: "therapy",
    categoryLabel: "Therapy & Mental Health",
    classBanner: "ther",
    description: "Private professional psychological therapy sessions focused on coping mechanisms, anxiety relief, and mindfulness development.",
    duration: "60 Minutes",
    price: 110,
    rating: 4.9,
    reviewCount: 78,
    doctors: [
      { name: "Dr. Arthur Brooks", specialty: "Licensed Clinical Psychologist", rating: 4.9, img: "https://images.unsplash.com/photo-162290204749a-878505a2f817?auto=format&fit=crop&q=80&w=256" }
    ]
  },
  {
    id: "serv-6",
    title: "Pediatric Wellness Check",
    category: "consultation",
    categoryLabel: "Specialty Consult",
    classBanner: "gen",
    description: "Routine pediatric health checkup measuring growth milestones, developmental markers, and routine vaccine verification advice.",
    duration: "30 Minutes",
    price: 70,
    rating: 4.8,
    reviewCount: 35,
    doctors: [
      { name: "Dr. Olivia Vance", specialty: "Pediatric Associate Specialist", rating: 4.9, img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256" }
    ]
  }
];

const INITIAL_REVIEWS = {
  "serv-1": [
    { user: "Marcus Aurelius", rating: 5, comment: "Dr. Vance was extremely thorough. She answered all my health concerns patiently and explained my new prescription details clearly.", date: "2 days ago" },
    { user: "Jane Foster", rating: 4, comment: "Very prompt timing. The consult was quick and effective. Highly recommend their general health plans.", date: "1 week ago" }
  ],
  "serv-2": [
    { user: "Leonidas Reed", rating: 5, comment: "Extremely professional cardiological checkup. The clinic's ECG tech is top tier. Dr. Sterling is highly knowledgeable.", date: "3 days ago" }
  ]
};

// 2. CORE APPLICATION STATE
let state = {
  currentUser: {
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    role: "patient", // 'patient' or 'admin'
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    details: {
      phone: "+1 (555) 382-9901",
      dob: "1995-04-12",
      blood: "O+",
      height: 168,
      weight: 62,
      allergies: "Penicillin, Peanuts (Mild)"
    }
  },
  bookings: [
    {
      id: "CP-9430",
      serviceId: "serv-1",
      serviceTitle: "General Health Consultation",
      doctorName: "Dr. Olivia Vance",
      doctorSpecialty: "Internal Medicine Specialist",
      doctorImg: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256",
      doctorRating: 4.9,
      date: "2026-08-15",
      time: "10:00 AM",
      location: "Clinic Building B, Room 402",
      status: "approved", // pending, approved, completed, cancelled
      patientName: "Sarah Jenkins",
      symptoms: "Mild headaches and fatigue over the past 3 days.",
      timestamp: "Today, 10:14 AM"
    },
    {
      id: "CP-4820",
      serviceId: "serv-3",
      serviceTitle: "Comprehensive Blood Panel & Lipid Profile",
      doctorName: "Dr. Helen Ross",
      doctorSpecialty: "Clinical Pathologist",
      doctorImg: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=256",
      doctorRating: 4.7,
      date: "2026-08-20",
      time: "11:00 AM",
      location: "Laboratory Wing, 1st Floor",
      status: "pending",
      patientName: "Sarah Jenkins",
      symptoms: "Annual routine biometric check.",
      timestamp: "Yesterday, 3:45 PM"
    },
    {
      id: "CP-1284",
      serviceId: "serv-4",
      serviceTitle: "Dental Prophylaxis & Deep Cleanse",
      doctorName: "Dr. Sophia Chen",
      doctorSpecialty: "Cosmetic Dentist",
      doctorImg: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=256",
      doctorRating: 4.8,
      date: "2026-06-12",
      time: "02:30 PM",
      location: "Dental Clinic, Room 102",
      status: "completed",
      patientName: "Sarah Jenkins",
      symptoms: "Teeth cleaning and regular checkup.",
      timestamp: "2026-06-12, 11:00 AM"
    }
  ],
  notifications: [
    { id: "notif-1", title: "Appointment Scheduled", message: "Your General Health Consultation has been approved for Aug 15.", time: "Today, 10:15 AM", type: "success", read: false },
    { id: "notif-2", title: "New Result Available", message: "Your lab tests from June 12 are ready for download in your Profile panel.", time: "Yesterday, 4:30 PM", type: "info", read: true },
    { id: "notif-3", title: "Insurance Verified", message: "CarePulse has successfully verified your medical insurance provider card.", time: "3 days ago", type: "success", read: true }
  ],
  reviews: { ...INITIAL_REVIEWS },
  medicalRecords: [
    { id: "rec-1", name: "Annual Blood Report.pdf", date: "2026-06-14", size: "1.8 MB" },
    { id: "rec-2", name: "Dental X-Ray Scans.png", date: "2026-06-12", size: "3.4 MB" },
    { id: "rec-3", name: "Immunization Record Card.pdf", date: "2026-01-10", size: "850 KB" }
  ],
  activeView: "dashboard",
  activeTrackerBookingId: null,
  wizardSelectedService: null,
  wizardStep: 1,
  chartMetrics: {
    steps: [6200, 7100, 8400, 5900, 7854, 8200, 7500],
    heart: [72, 74, 69, 78, 98, 71, 73],
    sleep: [7.5, 6.8, 8.0, 7.2, 6.5, 8.2, 7.8]
  },
  activeChartMetric: "steps"
};

// 3. UI ELEMENT SELECTORS
const DOM = {
  authContainer: document.getElementById("auth-container"),
  appContainer: document.getElementById("app-container"),
  loginFormWrapper: document.getElementById("login-form-wrapper"),
  registerFormWrapper: document.getElementById("register-form-wrapper"),
  loginForm: document.getElementById("login-form"),
  registerForm: document.getElementById("register-form"),
  toRegister: document.getElementById("to-register"),
  toLogin: document.getElementById("to-login"),
  
  sidebar: document.querySelector(".sidebar"),
  sidebarNavLinks: document.querySelectorAll(".nav-link[data-view]"),
  sidebarUserAvatar: document.getElementById("sidebar-user-avatar"),
  sidebarUserName: document.getElementById("sidebar-user-name"),
  sidebarUserRole: document.getElementById("sidebar-user-role"),
  logoutBtn: document.getElementById("logout-btn"),
  
  headerViewTitle: document.getElementById("header-view-title"),
  headerViewSubtitle: document.getElementById("header-view-subtitle"),
  themeToggleBtn: document.getElementById("theme-toggle-btn"),
  bellBtn: document.getElementById("bell-btn"),
  bellBadgeDot: document.getElementById("bell-badge-dot"),
  avatarDropdownBtn: document.getElementById("avatar-dropdown-btn"),
  headerUserAvatar: document.getElementById("header-user-avatar"),
  headerDropdown: document.getElementById("header-dropdown"),
  dropdownUserName: document.getElementById("dropdown-user-name"),
  dropdownUserEmail: document.getElementById("dropdown-user-email"),
  dropdownLogout: document.getElementById("dropdown-logout"),
  
  views: document.querySelectorAll(".content-view"),
  
  // Dashboard elements
  dashBookingCount: document.getElementById("dash-booking-count"),
  dashRecordsCount: document.getElementById("dash-records-count"),
  dashBookNowBtn: document.getElementById("dash-book-now-btn"),
  dashViewServicesBtn: document.getElementById("dash-view-services-btn"),
  dashEditProfileBtn: document.getElementById("dash-edit-profile-btn"),
  dashUpcomingList: document.getElementById("dash-upcoming-list"),
  dashViewAllBookings: document.getElementById("dash-view-all-bookings"),
  chartMetricSelect: document.getElementById("chart-metric-select"),
  
  // Services & Categories elements
  searchServicesInput: document.getElementById("search-services-input"),
  filterCategorySelect: document.getElementById("filter-category-select"),
  sortServicesSelect: document.getElementById("sort-services-select"),
  servicesCardsContainer: document.getElementById("services-cards-container"),
  
  // Bookings / Tracking elements
  totalBookingsPill: document.getElementById("total-bookings-pill"),
  bookingsTabs: document.querySelectorAll(".booking-tab"),
  bookingsListContainer: document.getElementById("bookings-list-container"),
  trackerEmptyState: document.getElementById("tracker-empty-state"),
  trackerActiveContent: document.getElementById("tracker-active-content"),
  trackBookingId: document.getElementById("track-booking-id"),
  trackServiceName: document.getElementById("track-service-name"),
  trackStatusBadge: document.getElementById("track-status-badge"),
  trackDoctorImg: document.getElementById("track-doctor-img"),
  trackDoctorName: document.getElementById("track-doctor-name"),
  trackDoctorSpecialty: document.getElementById("track-doctor-specialty"),
  trackDoctorRating: document.getElementById("track-doctor-rating"),
  trackBookingDate: document.getElementById("track-booking-date"),
  trackBookingTime: document.getElementById("track-booking-time"),
  trackBookingLocation: document.getElementById("track-booking-location"),
  btnCancelBooking: document.getElementById("btn-cancel-booking"),
  btnRateConsultation: document.getElementById("btn-rate-consultation"),
  bookingsCountBadge: document.getElementById("bookings-count-badge"),
  
  // Timeline nodes
  tlStepSubmitted: document.getElementById("tl-step-submitted"),
  tlTimeSubmitted: document.getElementById("tl-time-submitted"),
  tlStepApproved: document.getElementById("tl-step-approved"),
  tlTimeApproved: document.getElementById("tl-time-approved"),
  tlStepReady: document.getElementById("tl-step-ready"),
  tlStepCompleted: document.getElementById("tl-step-completed"),
  
  // Profile elements
  profilePageAvatar: document.getElementById("profile-page-avatar"),
  avatarInput: document.getElementById("avatar-input"),
  profileFullName: document.getElementById("profile-full-name"),
  profileMetaDesc: document.getElementById("profile-meta-desc"),
  profileEditForm: document.getElementById("profile-edit-form"),
  profileName: document.getElementById("profile-name"),
  profileEmail: document.getElementById("profile-email"),
  profilePhone: document.getElementById("profile-phone"),
  profileDob: document.getElementById("profile-dob"),
  profileBlood: document.getElementById("profile-blood"),
  profileHeight: document.getElementById("profile-height"),
  profileWeight: document.getElementById("profile-weight"),
  profileAllergies: document.getElementById("profile-allergies"),
  btnUploadRecord: document.getElementById("btn-upload-record"),
  recordFileInput: document.getElementById("record-file-input"),
  profileRecordsList: document.getElementById("profile-records-list"),
  
  // Admin dashboard elements
  adminUserCount: document.getElementById("admin-user-count"),
  adminTotalBookings: document.getElementById("admin-total-bookings"),
  adminRevenueText: document.getElementById("admin-revenue-text"),
  adminPendingCount: document.getElementById("admin-pending-count"),
  adminBookingsTable: document.getElementById("admin-bookings-table"),
  
  // Notifications elements
  notificationsDrawer: document.getElementById("notifications-drawer"),
  closeNotificationsBtn: document.getElementById("close-notifications-btn"),
  btnMarkAllRead: document.getElementById("btn-mark-all-read"),
  btnClearNotifications: document.getElementById("btn-clear-notifications"),
  notificationsListContainer: document.getElementById("notifications-list-container"),
  
  // Modals elements
  serviceDetailModal: document.getElementById("service-detail-modal"),
  closeServiceModalBtn: document.getElementById("close-service-modal-btn"),
  modalServiceHero: document.getElementById("modal-service-hero"),
  modalServiceCategory: document.getElementById("modal-service-category"),
  modalServiceTitle: document.getElementById("modal-service-title"),
  modalServiceStars: document.getElementById("modal-service-stars"),
  modalServiceRatingVal: document.getElementById("modal-service-rating-val"),
  modalServiceRatingCount: document.getElementById("modal-service-rating-count"),
  modalServiceDesc: document.getElementById("modal-service-desc"),
  modalServiceDuration: document.getElementById("modal-service-duration"),
  modalServicePrice: document.getElementById("modal-service-price"),
  modalDoctorsList: document.getElementById("modal-doctors-list"),
  modalReviewsList: document.getElementById("modal-reviews-list"),
  btnTriggerReview: document.getElementById("btn-trigger-review"),
  modalBookTriggerBtn: document.getElementById("modal-book-trigger-btn"),
  
  // Write Review Modal
  writeReviewModal: document.getElementById("write-review-modal"),
  closeReviewModalBtn: document.getElementById("close-review-modal-btn"),
  writeReviewForm: document.getElementById("write-review-form"),
  reviewStarsContainer: document.getElementById("review-stars-container"),
  reviewRatingValue: document.getElementById("review-rating-value"),
  reviewComment: document.getElementById("review-comment"),
  
  // Booking Wizard elements
  bookingWizardModal: document.getElementById("booking-wizard-modal"),
  closeBookingModalBtn: document.getElementById("close-booking-modal-btn"),
  wizardTitle: document.getElementById("wizard-title"),
  bookDoctorSelect: document.getElementById("book-doctor-select"),
  bookDateInput: document.getElementById("book-date-input"),
  bookingSlotsGrid: document.getElementById("booking-slots-grid"),
  bookSelectedSlot: document.getElementById("book-selected-slot"),
  bookPatientName: document.getElementById("book-patient-name"),
  bookSymptoms: document.getElementById("book-symptoms"),
  bookShareRecords: document.getElementById("book-share-records"),
  btnWizardPrev: document.getElementById("btn-wizard-prev"),
  btnWizardNext: document.getElementById("btn-wizard-next"),
  btnWizardSubmit: document.getElementById("btn-wizard-submit"),
  receiptService: document.getElementById("receipt-service"),
  receiptDoctor: document.getElementById("receipt-doctor"),
  receiptDatetime: document.getElementById("receipt-datetime"),
  receiptPatient: document.getElementById("receipt-patient"),
  receiptPrice: document.getElementById("receipt-price"),
  
  // Sidebar toggles
  toggleSidebarBtn: document.getElementById("toggle-sidebar-btn"),
  closeSidebarBtn: document.getElementById("close-sidebar-btn")
};

// Charts references
let healthChartInstance = null;
let adminChartInstance = null;

// ==================== 4. APPLICATION ROUTING & VIEWS ====================
function switchView(viewName) {
  state.activeView = viewName;
  
  // Sync URL hash for multi-page routing
  if (window.location.hash !== `#${viewName}`) {
    history.pushState(null, "", `#${viewName}`);
  }

  // Update sidebar links styling
  DOM.sidebarNavLinks.forEach(link => {
    if (link.getAttribute("data-view") === viewName) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
  
  // Hide all views, display selected
  DOM.views.forEach(view => {
    if (view.id === `view-${viewName}`) {
      view.classList.add("active");
    } else {
      view.classList.remove("active");
    }
  });

  // Dynamic header details based on view
  updateHeaderDetails(viewName);
  
  // View specific initializations
  if (viewName === "dashboard") {
    renderDashboardUpcoming();
    initHealthChart();
  } else if (viewName === "services") {
    renderServicesList();
  } else if (viewName === "bookings") {
    renderBookingsList();
    updateBookingDetailTracker();
  } else if (viewName === "profile") {
    renderRecordsList();
  } else if (viewName === "admin-panel") {
    renderAdminBoard();
    initAdminChart();
  }
  
  // Rebuild lucide icons
  lucide.createIcons();
  
  // Close mobile sidebar if open
  DOM.sidebar.classList.remove("active");
}

function updateHeaderDetails(viewName) {
  let title = "Dashboard";
  let subtitle = `Welcome back, ${state.currentUser.name}! Here is your health overview.`;
  
  switch(viewName) {
    case "dashboard":
      title = "Health Dashboard";
      break;
    case "services":
      title = "Medical Services & Specialists";
      subtitle = "Browse clinical categories, read physician review cards, or book slots.";
      break;
    case "bookings":
      title = "My Consultations";
      subtitle = "Review and track active scheduling pipelines or visit history logs.";
      break;
    case "profile":
      title = "Profile & Records Center";
      subtitle = "Manage biometric values, medication warnings, and checkup file PDFs.";
      break;
    case "admin-panel":
      title = "Clinic Admin Console";
      subtitle = "Review booking requests, track clinic analytics graphs, and manage staff.";
      break;
  }
  
  DOM.headerViewTitle.textContent = title;
  DOM.headerViewSubtitle.textContent = subtitle;
}

// Bind sidebar and dropdown-triggered links
function bindNavLinks() {
  DOM.sidebarNavLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetView = link.getAttribute("data-view");
      if (targetView) {
        switchView(targetView);
      }
    });
  });

  document.querySelectorAll("[data-view-trigger]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const targetView = el.getAttribute("data-view-trigger");
      DOM.headerDropdown.classList.remove("active");
      switchView(targetView);
    });
  });

  window.addEventListener("popstate", () => {
    const hash = window.location.hash.replace("#", "");
    const validViews = ["dashboard", "services", "bookings", "profile", "admin-panel"];
    if (hash && validViews.includes(hash)) {
      switchView(hash);
    }
  });
}

// ==================== 5. AUTHENTICATION & LOGIN WORKFLOW ====================
function initAuth() {
  const hash = window.location.hash.replace("#", "");

  if (hash === "login") {
    performLogout();
    DOM.loginFormWrapper.classList.remove("hidden");
    DOM.registerFormWrapper.classList.add("hidden");
    return;
  } else if (hash === "register") {
    performLogout();
    DOM.loginFormWrapper.classList.add("hidden");
    DOM.registerFormWrapper.classList.remove("hidden");
    return;
  }

  // If user is already "logged in", show app. Otherwise, show auth view
  DOM.authContainer.classList.add("hidden");
  DOM.appContainer.style.display = "grid";
  
  // Populate details
  updateUserProfileDisplay();

  const validViews = ["dashboard", "services", "bookings", "profile", "admin-panel"];
  const initialView = (hash && validViews.includes(hash)) ? hash : "dashboard";
  switchView(initialView);
}

function updateUserProfileDisplay() {
  // Sidebar display
  DOM.sidebarUserName.textContent = state.currentUser.name;
  DOM.sidebarUserRole.textContent = state.currentUser.role === 'admin' ? "Administrator" : "Patient";
  DOM.sidebarUserAvatar.src = state.currentUser.avatar;
  
  // Header display
  DOM.headerUserAvatar.src = state.currentUser.avatar;
  DOM.dropdownUserName.textContent = state.currentUser.name;
  DOM.dropdownUserEmail.textContent = state.currentUser.email;
  
  // Lock or unlock admin views
  const adminLinks = document.querySelectorAll(".admin-only");
  adminLinks.forEach(el => {
    if (state.currentUser.role === 'admin') {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });
  
  // If user is not admin, prevent landing on admin-panel
  if (state.currentUser.role !== 'admin' && state.activeView === 'admin-panel') {
    switchView("dashboard");
  }
}

// Forms submit handlers
DOM.loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const emailInput = document.getElementById("login-email").value.trim();
  const passwordInput = document.getElementById("login-password").value.trim();
  
  if (emailInput && passwordInput) {
    let name = "Sarah Jenkins";
    let role = "patient";
    let avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256";
    
    // Simple admin mock
    if (emailInput.toLowerCase().includes("admin") || emailInput.toLowerCase() === "admin@carepulse.com") {
      name = "Dr. Noah Sterling";
      role = "admin";
      avatar = "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=256";
    }
    
    state.currentUser.name = name;
    state.currentUser.email = emailInput;
    state.currentUser.role = role;
    state.currentUser.avatar = avatar;
    
    // Logged in!
    updateUserProfileDisplay();
    DOM.authContainer.classList.add("hidden");
    DOM.appContainer.style.display = "grid";
    
    // Add success notification
    addNotification("Authentication Successful", `Welcome back to CarePulse, ${name}!`, "success");
    
    switchView("dashboard");
  }
});

DOM.registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("register-name").value.trim();
  const emailInput = document.getElementById("register-email").value.trim();
  const roleSelect = document.getElementById("register-role").value;
  
  if (nameInput && emailInput) {
    state.currentUser.name = nameInput;
    state.currentUser.email = emailInput;
    state.currentUser.role = roleSelect;
    state.currentUser.avatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256"; // Default male/unisex avatar placeholder
    
    // Logged in!
    updateUserProfileDisplay();
    DOM.authContainer.classList.add("hidden");
    DOM.appContainer.style.display = "grid";
    
    addNotification("Welcome to CarePulse", `Account successfully registered under ${nameInput}.`, "success");
    switchView("dashboard");
  }
});

// Auth switches
DOM.toRegister.addEventListener("click", (e) => {
  e.preventDefault();
  DOM.loginFormWrapper.classList.add("hidden");
  DOM.registerFormWrapper.classList.remove("hidden");
});

DOM.toLogin.addEventListener("click", (e) => {
  e.preventDefault();
  DOM.registerFormWrapper.classList.add("hidden");
  DOM.loginFormWrapper.classList.remove("hidden");
});

DOM.logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  performLogout();
});

DOM.dropdownLogout.addEventListener("click", (e) => {
  e.preventDefault();
  performLogout();
});

function performLogout() {
  DOM.appContainer.style.display = "none";
  DOM.authContainer.classList.remove("hidden");
  DOM.loginFormWrapper.classList.remove("hidden");
  DOM.registerFormWrapper.classList.add("hidden");
}

// ==================== 6. THEME TOGGLE (DARK / LIGHT) ====================
DOM.themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  
  // Toggle the icon
  const icon = DOM.themeToggleBtn.querySelector("i");
  if (isDark) {
    icon.setAttribute("data-lucide", "sun");
  } else {
    icon.setAttribute("data-lucide", "moon");
  }
  lucide.createIcons();
});

// Dropdown toggle
DOM.avatarDropdownBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  DOM.headerDropdown.classList.toggle("active");
});
document.addEventListener("click", () => {
  DOM.headerDropdown.classList.remove("active");
});

// ==================== 7. NOTIFICATIONS CENTER ====================
function addNotification(title, message, type = "info") {
  const newNotif = {
    id: `notif-${Date.now()}`,
    title,
    message,
    time: "Just now",
    type,
    read: false
  };
  state.notifications.unshift(newNotif);
  renderNotifications();
  triggerBellPulse();
}

function triggerBellPulse() {
  DOM.bellBadgeDot.classList.remove("hidden");
}

function renderNotifications() {
  DOM.notificationsListContainer.innerHTML = "";
  let unreadCount = 0;
  
  state.notifications.forEach(notif => {
    if (!notif.read) unreadCount++;
    
    const card = document.createElement("div");
    card.className = `notification-card ${notif.read ? '' : 'unread'} ${notif.type}`;
    card.innerHTML = `
      <h4>${notif.title}</h4>
      <p>${notif.message}</p>
      <span class="time">${notif.time}</span>
      <button class="btn-read-toggle" data-id="${notif.id}" title="${notif.read ? 'Mark as Unread' : 'Mark as Read'}">
        <i data-lucide="${notif.read ? 'check-circle' : 'circle'}"></i>
      </button>
    `;
    DOM.notificationsListContainer.appendChild(card);
  });
  
  if (unreadCount > 0) {
    DOM.bellBadgeDot.classList.remove("hidden");
  } else {
    DOM.bellBadgeDot.classList.add("hidden");
  }
  
  // Bind actions
  DOM.notificationsListContainer.querySelectorAll(".btn-read-toggle").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const notifId = btn.getAttribute("data-id");
      toggleNotifRead(notifId);
    });
  });
  
  lucide.createIcons();
}

function toggleNotifRead(id) {
  const notif = state.notifications.find(n => n.id === id);
  if (notif) {
    notif.read = !notif.read;
    renderNotifications();
  }
}

DOM.bellBtn.addEventListener("click", () => {
  DOM.notificationsDrawer.classList.add("active");
  renderNotifications();
});

DOM.closeNotificationsBtn.addEventListener("click", () => {
  DOM.notificationsDrawer.classList.remove("active");
});

DOM.btnMarkAllRead.addEventListener("click", () => {
  state.notifications.forEach(n => n.read = true);
  renderNotifications();
});

DOM.btnClearNotifications.addEventListener("click", () => {
  state.notifications = [];
  renderNotifications();
});

// ==================== 8. HEALTH CHART & ANALYTICS ====================
function initHealthChart() {
  const ctx = document.getElementById("health-metrics-chart");
  if (!ctx) return;
  
  if (healthChartInstance) {
    healthChartInstance.destroy();
  }
  
  let label = "Steps Walked";
  let color = "#0d9488"; // Primary Teal
  let dataPoints = state.chartMetrics[state.activeChartMetric];
  
  if (state.activeChartMetric === "heart") {
    label = "Heart Rate (bpm)";
    color = "#f43f5e"; // Coral
  } else if (state.activeChartMetric === "sleep") {
    label = "Sleep (hours)";
    color = "#4f46e5"; // Indigo
  }
  
  const isDark = document.body.classList.contains("dark-mode");
  const gridColor = isDark ? "#1e293b" : "#e2e8f0";
  const textColor = isDark ? "#94a3b8" : "#64748b";

  healthChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [{
        label: label,
        data: dataPoints,
        borderColor: color,
        backgroundColor: color + "1a", // transparency
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: color,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor,
            font: { family: "Outfit" }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: textColor,
            font: { family: "Outfit" }
          }
        }
      }
    }
  });
}

DOM.chartMetricSelect.addEventListener("change", (e) => {
  state.activeChartMetric = e.target.value;
  initHealthChart();
});

// ==================== 9. SERVICES LISTING & RENDER ====================
function renderServicesList() {
  const query = DOM.searchServicesInput.value.toLowerCase();
  const categoryFilter = DOM.filterCategorySelect.value;
  const sortBy = DOM.sortServicesSelect.value;
  
  // Filter
  let filtered = STATIC_SERVICES.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(query) || 
                          service.description.toLowerCase().includes(query) ||
                          service.doctors.some(d => d.name.toLowerCase().includes(query));
    
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort
  if (sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } // Else default 'popular' (keep static array order)
  
  DOM.servicesCardsContainer.innerHTML = "";
  
  if (filtered.length === 0) {
    DOM.servicesCardsContainer.innerHTML = `
      <div class="tracker-empty-state" style="grid-column: 1/-1;">
        <i data-lucide="search-code"></i>
        <h3>No services found</h3>
        <p>Try matching spelling or broadening filters</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }
  
  filtered.forEach(service => {
    const card = document.createElement("div");
    card.className = "service-card";
    card.innerHTML = `
      <div class="service-card-banner ${service.classBanner}">
        <span class="category-tag">${service.categoryLabel}</span>
      </div>
      <div class="service-card-body">
        <div>
          <h3>${service.title}</h3>
          <p class="desc">${service.description.substring(0, 95)}...</p>
        </div>
        <div>
          <div class="service-meta-stats">
            <span class="service-price">$${service.price}</span>
            <div class="service-rating">
              <i data-lucide="star"></i>
              <span>${service.rating}</span>
              <span class="count">(${service.reviewCount})</span>
            </div>
          </div>
          <button class="btn btn-secondary btn-block btn-details" data-id="${service.id}">View Details</button>
        </div>
      </div>
    `;
    
    card.querySelector(".btn-details").addEventListener("click", () => {
      openServiceDetailsModal(service.id);
    });
    
    DOM.servicesCardsContainer.appendChild(card);
  });
  
  lucide.createIcons();
}

DOM.searchServicesInput.addEventListener("input", renderServicesList);
DOM.filterCategorySelect.addEventListener("change", renderServicesList);
DOM.sortServicesSelect.addEventListener("change", renderServicesList);

// ==================== 10. BOOKING SYSTEM & WIZARD ====================
function openBookingWizard(serviceId) {
  const service = STATIC_SERVICES.find(s => s.id === serviceId);
  if (!service) return;
  
  state.wizardSelectedService = service;
  state.wizardStep = 1;
  
  // Set doctors list dropdown options
  DOM.bookDoctorSelect.innerHTML = "";
  service.doctors.forEach(doc => {
    const opt = document.createElement("option");
    opt.value = doc.name;
    opt.textContent = `${doc.name} (${doc.specialty})`;
    DOM.bookDoctorSelect.appendChild(opt);
  });
  
  // Limit calendars min date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  DOM.bookDateInput.min = tomorrowStr;
  DOM.bookDateInput.value = tomorrowStr;
  
  // Reset slots selection
  DOM.bookSelectedSlot.value = "";
  document.querySelectorAll(".slot-chip").forEach(chip => {
    chip.classList.remove("selected");
  });
  
  // Show modal
  DOM.bookingWizardModal.classList.add("active");
  updateWizardUI();
}

// Bind slots chip click
document.querySelectorAll(".slot-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".slot-chip").forEach(c => c.classList.remove("selected"));
    chip.classList.add("selected");
    DOM.bookSelectedSlot.value = chip.getAttribute("data-time");
  });
});

function updateWizardUI() {
  // Hide all step bodies
  document.getElementById("booking-step-1").classList.add("hidden");
  document.getElementById("booking-step-2").classList.add("hidden");
  document.getElementById("booking-step-3").classList.add("hidden");
  
  // Reset buttons status
  DOM.btnWizardPrev.classList.add("hidden");
  DOM.btnWizardNext.classList.remove("hidden");
  DOM.btnWizardSubmit.classList.add("hidden");
  
  // Dots styles
  document.getElementById("step-dot-1").className = "step-dot completed";
  document.getElementById("step-dot-2").className = "step-dot";
  document.getElementById("step-dot-3").className = "step-dot";
  document.getElementById("step-line-1").classList.remove("active");
  document.getElementById("step-line-2").classList.remove("active");

  if (state.wizardStep === 1) {
    document.getElementById("booking-step-1").classList.remove("hidden");
    document.getElementById("step-dot-1").className = "step-dot active";
    DOM.wizardTitle.textContent = "Book Health Service - Step 1";
  } 
  else if (state.wizardStep === 2) {
    document.getElementById("booking-step-2").classList.remove("hidden");
    DOM.btnWizardPrev.classList.remove("hidden");
    document.getElementById("step-dot-1").className = "step-dot completed";
    document.getElementById("step-dot-2").className = "step-dot active";
    document.getElementById("step-line-1").classList.add("active");
    DOM.wizardTitle.textContent = "Intake Intake - Step 2";
  } 
  else if (state.wizardStep === 3) {
    document.getElementById("booking-step-3").classList.remove("hidden");
    DOM.btnWizardPrev.classList.remove("hidden");
    DOM.btnWizardNext.classList.add("hidden");
    DOM.btnWizardSubmit.classList.remove("hidden");
    
    document.getElementById("step-dot-1").className = "step-dot completed";
    document.getElementById("step-dot-2").className = "step-dot completed";
    document.getElementById("step-dot-3").className = "step-dot active";
    document.getElementById("step-line-1").classList.add("active");
    document.getElementById("step-line-2").classList.add("active");
    DOM.wizardTitle.textContent = "Summary Verification - Step 3";
    
    // Render receipt confirmation summary details
    DOM.receiptService.textContent = state.wizardSelectedService.title;
    DOM.receiptDoctor.textContent = DOM.bookDoctorSelect.value;
    DOM.receiptDatetime.textContent = `${DOM.bookDateInput.value} at ${DOM.bookSelectedSlot.value || '10:00 AM'}`;
    DOM.receiptPatient.textContent = DOM.bookPatientName.value || state.currentUser.name;
    DOM.receiptPrice.textContent = `$${state.wizardSelectedService.price}.00`;
  }
}

DOM.btnWizardNext.addEventListener("click", () => {
  if (state.wizardStep === 1) {
    // Validate slot
    if (!DOM.bookSelectedSlot.value) {
      alert("Please select an appointment time slot chip before proceeding.");
      return;
    }
  }
  state.wizardStep++;
  updateWizardUI();
});

DOM.btnWizardPrev.addEventListener("click", () => {
  state.wizardStep--;
  updateWizardUI();
});

DOM.btnWizardSubmit.addEventListener("click", () => {
  // Save new booking to state
  const doctorName = DOM.bookDoctorSelect.value;
  const doctor = state.wizardSelectedService.doctors.find(d => d.name === doctorName);
  
  const newBooking = {
    id: `CP-${Math.floor(1000 + Math.random() * 9000)}`,
    serviceId: state.wizardSelectedService.id,
    serviceTitle: state.wizardSelectedService.title,
    doctorName: doctorName,
    doctorSpecialty: doctor ? doctor.specialty : "Medical Specialist",
    doctorImg: doctor ? doctor.img : "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256",
    doctorRating: doctor ? doctor.rating : 4.8,
    date: DOM.bookDateInput.value,
    time: DOM.bookSelectedSlot.value,
    location: "Main Clinic Campus, Tower A",
    status: "pending", // Newly created are pending approval
    patientName: DOM.bookPatientName.value || state.currentUser.name,
    symptoms: DOM.bookSymptoms.value || "General inquiry.",
    timestamp: "Just now"
  };
  
  state.bookings.unshift(newBooking);
  
  // Close modals
  DOM.bookingWizardModal.classList.remove("active");
  DOM.serviceDetailModal.classList.remove("active");
  
  // Notifications
  addNotification(
    "Booking Request Placed", 
    `Your request for ${newBooking.serviceTitle} with ${newBooking.doctorName} is pending admin verification.`, 
    "warning"
  );
  
  // Switch to bookings tab and show tracking details
  state.activeTrackerBookingId = newBooking.id;
  switchView("bookings");
});

DOM.closeBookingModalBtn.addEventListener("click", () => {
  DOM.bookingWizardModal.classList.remove("active");
});

// ==================== 11. MY BOOKINGS & TIMELINE TRACKING ====================
let bookingActiveTab = "active";

function renderBookingsList() {
  DOM.bookingsListContainer.innerHTML = "";
  
  const filteredBookings = state.bookings.filter(b => {
    if (bookingActiveTab === "active") {
      return b.status === "pending" || b.status === "approved";
    } else {
      return b.status === "completed" || b.status === "cancelled";
    }
  });
  
  DOM.totalBookingsPill.textContent = `${filteredBookings.length} ${bookingActiveTab === "active" ? "Active" : "Past"} Record(s)`;
  
  // update booking count badge in sidebar
  const pendingCount = state.bookings.filter(b => b.status === 'pending' || b.status === 'approved').length;
  DOM.bookingsCountBadge.textContent = pendingCount;
  DOM.bookingsCountBadge.style.display = pendingCount > 0 ? "inline-block" : "none";
  
  if (filteredBookings.length === 0) {
    DOM.bookingsListContainer.innerHTML = `
      <div class="tracker-empty-state">
        <i data-lucide="folder-open"></i>
        <h3>No matching bookings</h3>
        <p>You have no consultations logged in this category</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }
  
  filteredBookings.forEach(b => {
    const card = document.createElement("div");
    card.className = `booking-item-card ${state.activeTrackerBookingId === b.id ? 'selected' : ''}`;
    
    let statusClass = "status-pending";
    if (b.status === "approved") statusClass = "status-approved";
    else if (b.status === "completed") statusClass = "status-completed";
    else if (b.status === "cancelled") statusClass = "status-cancelled";
    
    card.innerHTML = `
      <div class="b-card-meta">
        <h4>${b.serviceTitle}</h4>
        <p class="doc">${b.doctorName} &bull; ${b.doctorSpecialty}</p>
        <span class="time"><i data-lucide="clock"></i> ${b.date} at ${b.time}</span>
      </div>
      <div class="b-card-status">
        <span class="status-badge ${statusClass}">${b.status}</span>
      </div>
    `;
    
    card.addEventListener("click", () => {
      state.activeTrackerBookingId = b.id;
      // re-render the list to update selected styling
      renderBookingsList();
      updateBookingDetailTracker();
    });
    
    DOM.bookingsListContainer.appendChild(card);
  });
  
  lucide.createIcons();
}

DOM.bookingsTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    DOM.bookingsTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    bookingActiveTab = tab.getAttribute("data-tab");
    renderBookingsList();
  });
});

function updateBookingDetailTracker() {
  const currentTrackerId = state.activeTrackerBookingId;
  const booking = state.bookings.find(b => b.id === currentTrackerId);
  
  if (!booking) {
    DOM.trackerEmptyState.classList.remove("hidden");
    DOM.trackerActiveContent.classList.add("hidden");
    return;
  }
  
  DOM.trackerEmptyState.classList.add("hidden");
  DOM.trackerActiveContent.classList.remove("hidden");
  
  // Fill text
  DOM.trackBookingId.textContent = `#${booking.id}`;
  DOM.trackServiceName.textContent = booking.serviceTitle;
  
  DOM.trackStatusBadge.textContent = booking.status.toUpperCase();
  DOM.trackStatusBadge.className = `tracker-status-badge status-${booking.status}`;
  
  DOM.trackDoctorImg.src = booking.doctorImg;
  DOM.trackDoctorName.textContent = booking.doctorName;
  DOM.trackDoctorSpecialty.textContent = booking.doctorSpecialty;
  DOM.trackDoctorRating.textContent = booking.doctorRating;
  
  DOM.trackBookingDate.textContent = booking.date;
  DOM.trackBookingTime.textContent = booking.time;
  DOM.trackBookingLocation.textContent = booking.location;
  
  // Render tracking timeline markers
  resetTimelineStyle();
  
  // Timeline dates simulation
  DOM.tlTimeSubmitted.textContent = booking.timestamp;
  
  if (booking.status === "pending") {
    DOM.tlStepSubmitted.classList.add("active-step");
    DOM.btnCancelBooking.classList.remove("hidden");
    DOM.btnRateConsultation.classList.add("hidden");
  } 
  else if (booking.status === "approved") {
    DOM.tlStepSubmitted.classList.add("completed-step");
    DOM.tlStepApproved.classList.add("active-step");
    DOM.tlTimeApproved.textContent = "Scheduled";
    DOM.btnCancelBooking.classList.remove("hidden");
    DOM.btnRateConsultation.classList.add("hidden");
  } 
  else if (booking.status === "completed") {
    DOM.tlStepSubmitted.classList.add("completed-step");
    DOM.tlStepApproved.classList.add("completed-step");
    DOM.tlStepReady.classList.add("completed-step");
    DOM.tlStepCompleted.classList.add("active-step");
    
    DOM.btnCancelBooking.classList.add("hidden");
    DOM.btnRateConsultation.classList.remove("hidden");
  } 
  else if (booking.status === "cancelled") {
    // Show timeline as canceled
    DOM.tlStepSubmitted.classList.add("completed-step");
    DOM.tlStepApproved.querySelector("h5").textContent = "Appointment Cancelled";
    DOM.tlStepApproved.querySelector("p.desc").textContent = "This request was cancelled. You can book a new service on the Services page.";
    DOM.tlStepApproved.className = "timeline-item active-step";
    
    // Hide details steps
    DOM.tlStepReady.classList.add("hidden");
    DOM.tlStepCompleted.classList.add("hidden");
    
    DOM.btnCancelBooking.classList.add("hidden");
    DOM.btnRateConsultation.classList.add("hidden");
  }
  
  lucide.createIcons();
}

function resetTimelineStyle() {
  DOM.tlStepSubmitted.className = "timeline-item";
  DOM.tlStepApproved.className = "timeline-item";
  DOM.tlStepApproved.querySelector("h5").textContent = "Confirmed & Scheduled";
  DOM.tlStepApproved.querySelector("p.desc").textContent = "Medical administrator is reviewing slots to confirm matching availability.";
  DOM.tlStepApproved.querySelector("p.time").textContent = "Awaiting confirmation";
  
  DOM.tlStepReady.className = "timeline-item";
  DOM.tlStepReady.classList.remove("hidden");
  
  DOM.tlStepCompleted.className = "timeline-item";
  DOM.tlStepCompleted.classList.remove("hidden");
}

DOM.btnCancelBooking.addEventListener("click", () => {
  if (confirm("Are you sure you want to cancel this appointment schedule?")) {
    const booking = state.bookings.find(b => b.id === state.activeTrackerBookingId);
    if (booking) {
      booking.status = "cancelled";
      addNotification("Appointment Cancelled", `You cancelled ${booking.serviceTitle} on ${booking.date}`, "coral");
      renderBookingsList();
      updateBookingDetailTracker();
      
      // Update dashboard upcoming count
      renderDashboardUpcoming();
    }
  }
});

// Trigger review modal from rating button in tracker
DOM.btnRateConsultation.addEventListener("click", () => {
  const booking = state.bookings.find(b => b.id === state.activeTrackerBookingId);
  if (booking) {
    openWriteReviewModal(booking.serviceId);
  }
});

// ==================== 12. SERVICE DETAILS MODAL ====================
function openServiceDetailsModal(serviceId) {
  const service = STATIC_SERVICES.find(s => s.id === serviceId);
  if (!service) return;
  
  state.wizardSelectedService = service;
  
  DOM.modalServiceCategory.textContent = service.categoryLabel;
  DOM.modalServiceTitle.textContent = service.title;
  DOM.modalServiceRatingVal.textContent = service.rating;
  DOM.modalServiceRatingCount.textContent = `(${service.reviewCount} Ratings)`;
  DOM.modalServiceDesc.textContent = service.description;
  DOM.modalServiceDuration.textContent = service.duration;
  DOM.modalServicePrice.textContent = `$${service.price}.00`;
  
  // Render stars
  DOM.modalServiceStars.innerHTML = "";
  const floorRating = Math.floor(service.rating);
  for (let i = 1; i <= 5; i++) {
    const icon = document.createElement("i");
    icon.setAttribute("data-lucide", "star");
    if (i > floorRating) {
      icon.className = "star-empty";
    }
    DOM.modalServiceStars.appendChild(icon);
  }
  
  // Render Doctors list badges
  DOM.modalDoctorsList.innerHTML = "";
  service.doctors.forEach(doc => {
    const badge = document.createElement("div");
    badge.className = "doc-badge";
    badge.innerHTML = `
      <img src="${doc.img}" alt="${doc.name}">
      <span>${doc.name}</span>
    `;
    DOM.modalDoctorsList.appendChild(badge);
  });
  
  // Render reviews list
  renderModalReviews(serviceId);
  
  // Bind Book now trigger
  DOM.modalBookTriggerBtn.onclick = () => {
    openBookingWizard(service.id);
  };
  
  DOM.serviceDetailModal.classList.add("active");
  lucide.createIcons();
}

function renderModalReviews(serviceId) {
  DOM.modalReviewsList.innerHTML = "";
  const reviews = state.reviews[serviceId] || [];
  
  if (reviews.length === 0) {
    DOM.modalReviewsList.innerHTML = `<p class="subtitle" style="font-style: italic;">No reviews uploaded yet. Be the first to consult and rate this service!</p>`;
    return;
  }
  
  reviews.forEach(rev => {
    const card = document.createElement("div");
    card.className = "review-item-card";
    
    let starsHtml = "";
    for (let i = 1; i <= 5; i++) {
      starsHtml += `<i data-lucide="star" style="width:12px; height:12px; margin-right:2px; color:var(--amber); ${i <= rev.rating ? 'fill:var(--amber);' : ''}"></i>`;
    }
    
    card.innerHTML = `
      <div class="review-user-row">
        <h5>${rev.user}</h5>
        <div style="display:flex; align-items:center;">
          ${starsHtml}
          <span style="font-size:0.75rem; color:var(--text-muted); margin-left:6px;">${rev.date}</span>
        </div>
      </div>
      <p>${rev.comment}</p>
    `;
    DOM.modalReviewsList.appendChild(card);
  });
}

DOM.closeServiceModalBtn.addEventListener("click", () => {
  DOM.serviceDetailModal.classList.remove("active");
});

// ==================== 13. WRITE REVIEWS WORKFLOW ====================
function openWriteReviewModal(serviceId) {
  // Bind rating value selector
  const stars = DOM.reviewStarsContainer.querySelectorAll(".star-icon");
  
  stars.forEach(star => {
    star.addEventListener("click", () => {
      const ratingVal = parseInt(star.getAttribute("data-rating"));
      DOM.reviewRatingValue.value = ratingVal;
      
      // Update active colors
      stars.forEach(s => {
        const sVal = parseInt(s.getAttribute("data-rating"));
        if (sVal <= ratingVal) {
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });
    });
  });
  
  // Form submission
  DOM.writeReviewForm.onsubmit = (e) => {
    e.preventDefault();
    const commentText = DOM.reviewComment.value.trim();
    const ratingValue = parseInt(DOM.reviewRatingValue.value);
    
    if (commentText) {
      if (!state.reviews[serviceId]) {
        state.reviews[serviceId] = [];
      }
      
      state.reviews[serviceId].unshift({
        user: state.currentUser.name,
        rating: ratingValue,
        comment: commentText,
        date: "Just now"
      });
      
      // Update counts and average in service object
      const service = STATIC_SERVICES.find(s => s.id === serviceId);
      if (service) {
        service.reviewCount++;
        service.rating = Number(((service.rating * (service.reviewCount - 1) + ratingValue) / service.reviewCount).toFixed(1));
      }
      
      DOM.writeReviewModal.classList.remove("active");
      DOM.reviewComment.value = "";
      
      // Refresh displays
      renderModalReviews(serviceId);
      renderServicesList();
      addNotification("Review Submitted", "Thank you! Your healthcare review is now live.", "success");
    }
  };
  
  // Default 5 stars
  stars.forEach(s => s.classList.add("active"));
  DOM.reviewRatingValue.value = 5;
  
  DOM.writeReviewModal.classList.add("active");
}

DOM.btnTriggerReview.addEventListener("click", () => {
  openWriteReviewModal(state.wizardSelectedService.id);
});

DOM.closeReviewModalBtn.addEventListener("click", () => {
  DOM.writeReviewModal.classList.remove("active");
});

// ==================== 14. PROFILE MANAGEMENT ====================
DOM.profileEditForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  state.currentUser.name = DOM.profileName.value.trim();
  state.currentUser.email = DOM.profileEmail.value.trim();
  state.currentUser.details.phone = DOM.profilePhone.value;
  state.currentUser.details.dob = DOM.profileDob.value;
  state.currentUser.details.blood = DOM.profileBlood.value;
  state.currentUser.details.height = Number(DOM.profileHeight.value);
  state.currentUser.details.weight = Number(DOM.profileWeight.value);
  state.currentUser.details.allergies = DOM.profileAllergies.value.trim();
  
  // Update header and displays
  updateUserProfileDisplay();
  
  // Fill profile views text
  DOM.profileFullName.textContent = state.currentUser.name;
  
  addNotification("Profile Updated", "Your medical profile details were saved successfully.", "success");
});

// Records list upload mock
DOM.btnUploadRecord.addEventListener("click", () => {
  DOM.recordFileInput.click();
});

DOM.recordFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const newRecord = {
      id: `rec-${Date.now()}`,
      name: file.name,
      date: new Date().toISOString().split("T")[0],
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB"
    };
    state.medicalRecords.unshift(newRecord);
    renderRecordsList();
    addNotification("Document Uploaded", `${file.name} saved under secure profile cloud.`, "info");
  }
});

function renderRecordsList() {
  DOM.profileRecordsList.innerHTML = "";
  
  // Update dashboard stats
  DOM.dashRecordsCount.textContent = `${state.medicalRecords.length} Records`;
  
  state.medicalRecords.forEach(rec => {
    const card = document.createElement("div");
    card.className = "record-card";
    card.innerHTML = `
      <div class="record-details">
        <div class="record-icon"><i data-lucide="file-text"></i></div>
        <div class="record-text">
          <h5>${rec.name}</h5>
          <p>${rec.date} &bull; ${rec.size}</p>
        </div>
      </div>
      <button class="btn btn-secondary btn-xs btn-delete-rec" data-id="${rec.id}"><i data-lucide="trash-2" style="width:14px; height:14px; color:var(--coral);"></i></button>
    `;
    
    card.querySelector(".btn-delete-rec").addEventListener("click", (e) => {
      e.stopPropagation();
      state.medicalRecords = state.medicalRecords.filter(r => r.id !== rec.id);
      renderRecordsList();
    });
    
    DOM.profileRecordsList.appendChild(card);
  });
  lucide.createIcons();
}

// Avatar upload
DOM.avatarInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      state.currentUser.avatar = event.target.result;
      updateUserProfileDisplay();
      DOM.profilePageAvatar.src = event.target.result;
      addNotification("Avatar Changed", "Profile image updated successfully.", "success");
    };
    reader.readAsDataURL(file);
  }
});

// ==================== 15. CLINIC ADMIN BOARD & CONTROL ====================
function renderAdminBoard() {
  // Update metrics
  const activeCount = state.bookings.filter(b => b.status === "pending" || b.status === "approved").length;
  DOM.adminTotalBookings.textContent = `${activeCount} Active`;
  DOM.adminUserCount.textContent = "483 Users";
  
  const pendingBookings = state.bookings.filter(b => b.status === "pending");
  DOM.adminPendingCount.textContent = `${pendingBookings.length} Pending Approval(s)`;
  
  // Calculate est revenue: sum of completed and approved bookings
  const valRevenue = state.bookings
    .filter(b => b.status === 'completed' || b.status === 'approved')
    .reduce((sum, b) => {
      const serv = STATIC_SERVICES.find(s => s.id === b.serviceId);
      return sum + (serv ? serv.price : 100);
    }, 0);
  DOM.adminRevenueText.textContent = `$${valRevenue.toLocaleString()}`;
  
  // Populate Table
  const tbody = DOM.adminBookingsTable.querySelector("tbody");
  tbody.innerHTML = "";
  
  if (state.bookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No records registered</td></tr>`;
    return;
  }
  
  state.bookings.forEach(b => {
    const tr = document.createElement("tr");
    
    let badgeClass = "status-pending";
    if (b.status === "approved") badgeClass = "status-approved";
    else if (b.status === "completed") badgeClass = "status-completed";
    else if (b.status === "cancelled") badgeClass = "status-cancelled";
    
    let actionsHtml = "";
    if (b.status === "pending") {
      actionsHtml = `
        <button class="btn btn-success btn-xs btn-adm-approve" data-id="${b.id}">Approve</button>
        <button class="btn btn-secondary btn-xs btn-adm-reject" data-id="${b.id}" style="color:var(--coral);">Reject</button>
      `;
    } else if (b.status === "approved") {
      actionsHtml = `
        <button class="btn btn-primary btn-xs btn-adm-complete" data-id="${b.id}">Mark Done</button>
      `;
    } else {
      actionsHtml = `<span class="subtitle" style="font-size:0.75rem;">Verified</span>`;
    }
    
    tr.innerHTML = `
      <td>
        <div class="table-patient-cell">
          <h5>${b.patientName}</h5>
          <p>${b.id}</p>
        </div>
      </td>
      <td>
        <div>
          <span style="font-weight:600;">${b.serviceTitle}</span>
          <p style="font-size:0.75rem; color:var(--text-secondary);">${b.doctorName}</p>
        </div>
      </td>
      <td>
        <div>
          <span>${b.date}</span>
          <p style="font-size:0.75rem; color:var(--text-secondary);">${b.time}</p>
        </div>
      </td>
      <td><span class="status-badge ${badgeClass}">${b.status}</span></td>
      <td class="table-actions-cell">${actionsHtml}</td>
    `;
    
    // Bind buttons
    const btnApprove = tr.querySelector(".btn-adm-approve");
    if (btnApprove) {
      btnApprove.addEventListener("click", () => verifyAdminBooking(b.id, "approved"));
    }
    
    const btnReject = tr.querySelector(".btn-adm-reject");
    if (btnReject) {
      btnReject.addEventListener("click", () => verifyAdminBooking(b.id, "cancelled"));
    }
    
    const btnComplete = tr.querySelector(".btn-adm-complete");
    if (btnComplete) {
      btnComplete.addEventListener("click", () => verifyAdminBooking(b.id, "completed"));
    }
    
    tbody.appendChild(tr);
  });
  
  lucide.createIcons();
}

function verifyAdminBooking(id, status) {
  const booking = state.bookings.find(b => b.id === id);
  if (booking) {
    booking.status = status;
    
    if (status === "approved") {
      addNotification("Appointment Confirmed", `Your request for ${booking.serviceTitle} is scheduled for ${booking.date}`, "success");
    } else if (status === "cancelled") {
      addNotification("Appointment Rejected", `Clinic could not confirm slot for ${booking.serviceTitle}`, "coral");
    } else if (status === "completed") {
      addNotification("Consultation Complete", `Please review your service experience with ${booking.doctorName}`, "info");
    }
    
    renderAdminBoard();
    initAdminChart(); // Redraw clinic stats
    
    // Refresh bookings view tracker if selected
    if (state.activeTrackerBookingId === id) {
      updateBookingDetailTracker();
    }
    
    // Update dashboard cards count
    renderDashboardUpcoming();
  }
}

function initAdminChart() {
  const ctx = document.getElementById("admin-analytics-chart");
  if (!ctx) return;
  
  if (adminChartInstance) {
    adminChartInstance.destroy();
  }
  
  // Calculate bookings grouped by day for chart
  // Mock grouping: count occurrences
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const bookingsCounts = [4, 6, 8, 5, 9, 3, 2]; // Base logs
  
  // Add live bookings count to today (Thursday/Friday mockup)
  bookingsCounts[4] = state.bookings.length;
  
  const isDark = document.body.classList.contains("dark-mode");
  const gridColor = isDark ? "#1e293b" : "#e2e8f0";
  const textColor = isDark ? "#94a3b8" : "#64748b";

  adminChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: days,
      datasets: [{
        label: "Consultations Booked",
        data: bookingsCounts,
        backgroundColor: "#4f46e5", // Indigo
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          grid: { color: gridColor },
          ticks: { color: textColor, font: { family: "Outfit" } }
        },
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { family: "Outfit" } }
        }
      }
    }
  });
}

// ==================== 16. DASHBOARD QUICK WIDGETS ====================
function renderDashboardUpcoming() {
  // Update numbers
  const activeBookings = state.bookings.filter(b => b.status === "pending" || b.status === "approved");
  DOM.dashBookingCount.textContent = `${activeBookings.length} Active`;
  
  DOM.dashUpcomingList.innerHTML = "";
  
  if (activeBookings.length === 0) {
    DOM.dashUpcomingList.innerHTML = `
      <p class="subtitle" style="text-align:center; padding:10px; font-style:italic;">No upcoming appointments scheduled</p>
    `;
    return;
  }
  
  // Render top 2 active bookings
  const top2 = activeBookings.slice(0, 2);
  top2.forEach(b => {
    const card = document.createElement("div");
    card.className = `appointment-mini-card ${b.status === 'approved' ? 'border-indigo' : ''}`;
    card.innerHTML = `
      <img src="${b.doctorImg}" alt="Doc" class="doc-avatar">
      <div class="appointment-mini-info">
        <h4>${b.doctorName}</h4>
        <p>${b.serviceTitle}</p>
        <p><i data-lucide="calendar"></i> ${b.date} at ${b.time} &bull; <strong style="color:var(--primary); font-size:0.7rem;">${b.status}</strong></p>
      </div>
    `;
    
    // Clicking opens tracking card details
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      state.activeTrackerBookingId = b.id;
      switchView("bookings");
    });
    
    DOM.dashUpcomingList.appendChild(card);
  });
  
  lucide.createIcons();
}

// Dashboard buttons bindings
DOM.dashBookNowBtn.addEventListener("click", () => switchView("services"));
DOM.dashViewServicesBtn.addEventListener("click", () => switchView("services"));
DOM.dashEditProfileBtn.addEventListener("click", () => switchView("profile"));
DOM.dashViewAllBookings.addEventListener("click", (e) => {
  e.preventDefault();
  switchView("bookings");
});

// Mobile Sidebar toggling
DOM.toggleSidebarBtn.addEventListener("click", () => {
  DOM.sidebar.classList.add("active");
});

DOM.closeSidebarBtn.addEventListener("click", () => {
  DOM.sidebar.classList.remove("active");
});

// ==================== 17. INITIALIZATION ====================
window.addEventListener("DOMContentLoaded", () => {
  // Initialize Auth
  initAuth();
  
  // Bind navigation and dynamic event listeners
  bindNavLinks();
  
  // Draw icons
  lucide.createIcons();
});
