# NexGen Frontend Template - Guide

Welcome to the NexGen professional frontend template. This project is designed to be a "backend-ready" starting point.

## Folder Structure
- `/index.html`: Home page.
- `/pages/`: Secondary pages (Login, Products, etc.).
- `/css/`: Modular stylesheets. `style.css` contains the design system.
- `/js/`: Functional logic.
  - `main.js`: Handles global UI (Navbar, Footer injection, Auth state).
  - `api.js`: **Crucial File**. This is where you will swap simulated calls for real `fetch()` calls later.
  - `auth.js`: Handles registration and login flow.

## How to Connect a Backend Later

When you are ready to connect a backend (FastAPI, Node.js, etc.), follow these steps:

1.  **Update API Base URL**: In `js/api.js`, define a constant for your API:
    ```javascript
    const API_BASE_URL = "http://localhost:8000/api";
    ```
2.  **Swap Simulated Delays for Fetch**:
    Instead of:
    ```javascript
    await new Promise(r => setTimeout(r, 800));
    return mockData;
    ```
    Use:
    ```javascript
    const response = await fetch(`${API_BASE_URL}/products`);
    return await response.json();
    ```
3.  **Real Authentication**:
    In `js/auth.js`, replace the `localStorage.setItem('users', ...)` logic with a POST request to your `/register` or `/login` endpoint. Save the returned JWT token to `localStorage` or `sessionStorage`.

## Key Features
- **Responsive Navigation**: The navbar adapts based on whether a user is logged in.
- **Route Protection**: If you try to access `dashboard.html` without logging in, it redirects you.
- **Loading States**: Includes skeleton loaders and button "loading" text for a premium feel.

---
*Created by Antigravity AI*
