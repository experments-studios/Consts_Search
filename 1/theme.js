document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');
    
    const currentTheme = savedTheme 
        ? savedTheme 
        : (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    
    if (currentTheme === 'light') {
        document.body.classList.add('light');
    }

    if (themeToggle) {
        updateToggleButton(currentTheme, themeToggle);
        themeToggle.addEventListener('click', toggleTheme);
    }
});

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    body.classList.toggle('light');
    
    const isLight = body.classList.contains('light');
    const newTheme = isLight ? 'light' : 'dark';

    localStorage.setItem('theme', newTheme);
    updateToggleButton(newTheme, themeToggle);
}

function updateToggleButton(theme, button) {
    if (button) {
        button.innerHTML = theme === 'light' ? '☀️' : '🌙';
    }
}