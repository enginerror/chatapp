class ChatInterface {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.initElements();
    this.addEvents();
  }

  // Get all important DOM references
  initElements() {
    this.floatingChatBtn = document.getElementById("floatingChatBtn");
    this.chatOverlay = document.getElementById("chatOverlay");
    this.chatInterface = document.getElementById("chatInterface");
    this.btnCloseChat = document.getElementById("btnCloseChat");
    this.btnToggleSize = document.getElementById("btnToggleSize");
    this.messageInput = document.getElementById("messageInput");
    this.chatMessages = document.getElementById("chatMessages");
    this.btnTalk = document.getElementById("btnTalk");
    this.chatHeaderAgentItem = document.querySelector(
      ".chat-header .agent-item"
    );
    this.sidebar = this.chatInterface?.querySelector(".sidebar");
    this.chatInputContainer = document.querySelector(".chat-input-container");
  }

  // Set up event listeners
  addEvents() {
    this.floatingChatBtn?.addEventListener("click", () => this.openChat());

    this.chatOverlay?.addEventListener("click", (e) => {
      if (e.target === this.chatOverlay) this.closeChat();
    });

    this.btnCloseChat?.addEventListener("click", () => this.closeChat());

    this.btnToggleSize?.addEventListener("click", () => {
      this.chatInterface.classList.toggle("fullscreen");
      this.chatInterface.classList.toggle("windowed");
    });

    this.messageInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    this.btnTalk?.addEventListener("click", () => this.sendMessage());

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) this.closeChat();
    });

    // Toggle collapse state of sidebar sections
    document.querySelectorAll(".sidebar-toggle").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const targetId = toggle.getAttribute("data-target");
        const content = document.getElementById(targetId);
        content?.classList.toggle("collapsed");
        toggle.classList.toggle("collapsed");
      });
    });

    // Enable smooth scroll on sidebar hover
    if (this.sidebar) this.enableSidebarHoverScroll();

    // Handle agent item click
    document
      .querySelectorAll("#connected-agents .agent-item")
      .forEach((item) => {
        item.addEventListener("click", () => this.selectAgent(item));
      });
  }

  // Enable smooth hover scrolling in sidebar
  enableSidebarHoverScroll() {
    let isHovering = false;
    let scrollSpeed = 0;
    let animationFrame;

    const animateScroll = () => {
      if (isHovering && scrollSpeed !== 0) {
        this.sidebar.scrollTop += scrollSpeed;
      }
      if (isHovering) {
        animationFrame = requestAnimationFrame(animateScroll);
      } else {
        cancelAnimationFrame(animationFrame);
      }
    };

    this.sidebar.addEventListener("mouseenter", () => {
      isHovering = true;
      animateScroll();
    });

    this.sidebar.addEventListener("mouseleave", () => {
      isHovering = false;
    });

    this.sidebar.addEventListener("mousemove", (e) => {
      const bounds = this.sidebar.getBoundingClientRect();
      const offsetY = e.clientY - bounds.top;
      const height = bounds.height;

      const edgeThreshold = 80;
      const maxSpeed = 12;

      if (offsetY < edgeThreshold) {
        scrollSpeed = -((edgeThreshold - offsetY) / edgeThreshold) * maxSpeed;
      } else if (offsetY > height - edgeThreshold) {
        scrollSpeed =
          ((offsetY - (height - edgeThreshold)) / edgeThreshold) * maxSpeed;
      } else {
        scrollSpeed = 0;
      }
    });
  }

  // Open the chat interface
  openChat() {
    this.isOpen = true;
    this.chatInterface.classList.add("show", "windowed");
    this.chatInterface.classList.remove("fullscreen");
    this.chatOverlay.classList.add("active");
    this.floatingChatBtn.classList.remove("show");
    this.messageInput.focus();

    const sentBtn = document.getElementById("sentBtn");
    if (sentBtn) {
      sentBtn.style.display = "none";
    }
  }

  // Close the chat interface
  closeChat() {
    this.isOpen = false;
    this.chatInterface.classList.remove("show", "fullscreen", "windowed");
    this.chatOverlay.classList.remove("active");
    this.floatingChatBtn.classList.add("show");
  }

  // Scrolls chat to bottom after messages
  scrollToBottom() {
    setTimeout(() => {
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }, 50);
  }

  // Escape HTML to prevent injection
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// On page load, initialize chat
document.addEventListener("DOMContentLoaded", () => {
  const chat = new ChatInterface();

  // Show floating button after page loads
  setTimeout(() => {
    document.getElementById("floatingChatBtn")?.classList.add("show");
  }, 0);

  // Color all agent statuses
  document.querySelectorAll(".agent-status").forEach((status) => {
    const text = status.textContent.trim().toLowerCase();
    status.style.color = text === "online" ? "rgb(5, 232, 168)" : "#9fb4c1";
  });
});

// Toggle sidebar visibility on small screens
function toggleSidebar() {
  const icon = document.querySelector(".w-btn i");
  icon.classList.toggle("rotate-180");

  const chatInterface = document.getElementById("chatInterface");
  const sidebar = chatInterface?.querySelector(".sidebar");
  if (sidebar) {
    sidebar.classList.toggle("show");
  }
}

// Sidebar tab switching logic
// function swapBox(clickedEl, type) {
//   const container = document.getElementById("topBar");
//   const children = Array.from(container.children);

//   document.querySelectorAll(".sidebar-content").forEach((el) => {
//     el.classList.add("collapsed");
//   });

//   const targetIdMap = {
//     connected: "connected-agents",
//     sent: "sent-request",
//     groups: "groups",
//     receive: "receive-request",
//   };

//   const targetId = targetIdMap[type];
//   const targetSection = document.getElementById(targetId);
//   if (targetSection) {
//     targetSection.classList.remove("collapsed");
//   }

//   const titleMap = {
//     connected: "Housbe Members",
//     sent: "Sent Request",
//     groups: "Groups",
//     receive: "Receive Request",
//   };

//   const sidebarTitle = document.getElementById("sidebarSectionTitle");
//   if (sidebarTitle) {
//     sidebarTitle.textContent = titleMap[type] || "";
//     sidebarTitle.setAttribute("data-target", targetId);
//   }

//   const sentBtn = document.getElementById("sentBtn");
//   if (sentBtn) {
//     sentBtn.style.display = (type === "groups") ? "flex" : "none";
//   }
// }

// Sidebar tab switching logic
// function swapBox(clickedEl, type) {
//   const container = document.getElementById("topBar");
//   const children = Array.from(container.children);

//   // Hide all sidebar content sections
//   document.querySelectorAll(".sidebar-content").forEach((el) => {
//     el.classList.add("collapsed");
//   });

//   // Determine the correct section ID to show
//   const targetIdMap = {
//     connected: "connected-agents",
//     sent: "sent-request",
//     groups: "groups",
//     receive: "receive-request",
//   };

//   const targetId = targetIdMap[type];
//   const targetSection = document.getElementById(targetId);
//   if (targetSection) {
//     targetSection.classList.remove("collapsed");
//   }

//   // Update the sidebar section title and its toggle target
//   const titleMap = {
//     connected: "Housbe Members",
//     sent: "Sent Request",
//     groups: "Groups",
//     receive: "Receive Request",
//   };

//   const sidebarTitle = document.getElementById("sidebarSectionTitle");
//   if (sidebarTitle) {
//     sidebarTitle.textContent = titleMap[type] || "";
//     sidebarTitle.setAttribute("data-target", targetId);
//   }

//   // Show the #sentBtn only when 'groups' is selected
//   const sentBtn = document.getElementById("sentBtn");
//   if (sentBtn) {
//     sentBtn.style.display = type === "groups" ? "flex" : "none";
//   }
// }

function swapBox(clickedEl, type) {
  const container = document.getElementById("topBar");
  const children = Array.from(container.children);

  document.querySelectorAll(".sidebar-content").forEach((el) => {
    el.classList.add("collapsed");
  });

  const targetIdMap = {
    connected: "connected-agents",
    sent: "sent-request",
    groups: "groups",
    receive: "receive-request",
  };

  const targetId = targetIdMap[type];
  const targetSection = document.getElementById(targetId);
  if (targetSection) {
    targetSection.classList.remove("collapsed");
  }

  const titleMap = {
    connected: "Housbe Members",
    sent: "Sent Request",
    groups: "Groups",
    receive: "Receive Request",
  };

  const sidebarTitle = document.getElementById("sidebarSectionTitle");
  if (sidebarTitle) {
    sidebarTitle.textContent = titleMap[type] || "";
    sidebarTitle.setAttribute("data-target", targetId);
  }

  // ✅ Show/hide #sentBtn depending on active tab
  const sentBtn = document.getElementById("sentBtn");
  if (sentBtn) {
    sentBtn.style.display = type === "groups" ? "flex" : "none";
  }
}
