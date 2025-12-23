/**
 * main.js - Global UI Controller
 * Responsible for Navbar, Footer, and Authentication UI state.
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderNavbar();
    renderFooter();
    handleAuthUI();
}

/**
 * Renders the Navigation Bar dynamically
 */
function renderNavbar() {
    const header = document.getElementById('main-header');
    if (!header) return;

    const isSubPage = window.location.pathname.includes('/pages/');
    const pathPrefix = isSubPage ? '../' : '';

    header.innerHTML = `
        <nav class="navbar">
            <div class="container nav-container">
                <a href="${pathPrefix}index.html" class="logo">NexGen.</a>
                
                <ul class="nav-links">
                    <li><a href="${pathPrefix}index.html" class="nav-link">Home</a></li>
                    <li><a href="${pathPrefix}pages/products.html" class="nav-link">Products</a></li>
                    <li><a href="${pathPrefix}pages/contact.html" class="nav-link">Contact</a></li>
                    <li id="nav-dashboard-container" style="display:none">
                        <a href="${pathPrefix}pages/dashboard.html" class="nav-link">Dashboard</a>
                    </li>
                </ul>

                <div class="nav-auth" id="auth-ui-container">
                    <!-- Buttons will be injected by handleAuthUI() -->
                    <a href="${pathPrefix}pages/login.html" class="btn btn-outline" style="padding: 0.5rem 1rem;">Login</a>
                    <a href="${pathPrefix}pages/register.html" class="btn btn-primary" style="padding: 0.5rem 1rem;">Join Now</a>
                </div>
            </div>
        </nav>
    `;
}

/**
 * Handles the Visibility of authenticated vs public UI links
 */
function handleAuthUI() {
    const userJson = localStorage.getItem('user');
    if (!userJson) return;

    try {
        const user = JSON.parse(userJson);
        const authContainer = document.getElementById('auth-ui-container');
        const dashboardContainer = document.getElementById('nav-dashboard-container');

        if (user && authContainer) {
            // Show Dashboard link
            if (dashboardContainer) dashboardContainer.style.display = 'block';

            // Swap Login/Join buttons for User Profile & Logout
            authContainer.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="font-weight: 600; color: var(--primary);">Hi, ${user.username}</span>
                    <button id="logout-btn" class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">Logout</button>
                </div>
            `;

            document.getElementById('logout-btn').addEventListener('click', () => {
                localStorage.removeItem('user');
                localStorage.removeItem('access_token');
                window.location.reload();
            });
        }
    } catch (e) {
        console.error("Auth UI Error:", e);
        localStorage.removeItem('user');
    }
}

/**
 * Renders the Shared Footer
 */
function renderFooter() {
    const footer = document.getElementById('main-footer');
    if (!footer) return;

    footer.innerHTML = `
        <footer class="footer">
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-col">
                        <h4 class="logo">NexGen.</h4>
                        <p>A complete frontend + backend solution for modern applications.</p>
                    </div>
                </div>
                <div class="text-center mt-4" style="border-top: 1px solid #ddd; padding-top: 1rem; color: #666; font-size: 0.9rem;">
                    &copy; 2025 NexGen Professional. Built with FastAPI & Vanilla JS.
                </div>
            </div>
        </footer>
    `;
}
