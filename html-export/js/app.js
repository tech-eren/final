document.addEventListener('DOMContentLoaded', () => {
  const sidenav = document.getElementById('sidenav');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  const menuItems = [
    { name: 'Index', path: 'index.html', icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>' },
    { name: 'Profile', path: 'profile.html', icon: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>' },
    { name: 'Feed', path: 'feed.html', icon: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>' },
    { name: 'Cases', path: 'cases.html', icon: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>' },
    { name: 'Report', path: 'report.html', icon: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>' },
    { name: 'Saved Posts', path: 'saved.html', icon: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>' },
    { name: 'Settings', path: 'settings.html', icon: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>' },
  ];

  if (sidenav) {
    let linksHTML = menuItems.map(item => {
      const isActive = currentPath === item.path ? 'active' : '';
      return `
        <a href="${item.path}" class="sidenav-link ${isActive}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            ${item.icon}
          </svg>
          ${item.name}
        </a>
      `;
    }).join('');

    sidenav.innerHTML = `
      <div class="logo">UbiqLoupe</div>
      <nav class="nav-menu">
        ${linksHTML}
      </nav>
      
      <div style="margin-top: auto; padding-top: 2rem; border-top: 1px solid var(--border-color);">
        <div class="card-header" style="margin-bottom:0;">
          <div class="avatar" style="width:40px;height:40px;font-size:1rem;">U</div>
          <div class="user-info">
            <h4 style="font-size:1rem;color:var(--text-primary)">User Name</h4>
            <p style="font-size:0.8rem">@username</p>
          </div>
        </div>
      </div>
    `;
  }
});
