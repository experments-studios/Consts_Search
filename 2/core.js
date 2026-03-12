// ===== SEARCH & LANGUAGE FUNCTIONS =====
let sites = []; 
let currentLang = localStorage.getItem('language') || 'en';
const STOP_WORDS = new Set(["ve", "bir", "mi", "mı", "mu", "mü", "ki", "da", "de", "için", "gibi", "hakkında", "ile", "ama", "fakat", "lakin", "çünkü", "eğer", "her", "tüm", "çok", "daha", "en", "bu", "o", "şu", "ben", "sen", "biz", "siz", "onlar", "yazıp", "deneme", "makale", "alt", "gitmek", "bunu", "onu", "şunu", "yaz", "in", "on", "at", "by", "for", "with", "from", "to", "of", "the", "a", "an"]);

const translations = {
    en: {
        searchPlaceholder: "Search sites...",
        noResults: "No results found for your search.",
        wikiTitle: "Wikipedia Result",
        categories: { 
            "Technology": "Technology", 
            "Design": "Design", 
            "Education": "Education", 
            "Marketing": "Marketing", 
            "E-commerce": "E-commerce", 
            "Gaming": "Gaming", 
            "Tools": "Tools", 
            "Artificial Intelligence": "Artificial Intelligence", 
            "Social Media": "Social Media", 
            "News": "News", 
            "Entertainment": "Entertainment", 
            "Health": "Health", 
            "Finance": "Finance", 
            "Travel": "Travel", 
            "Food": "Food", 
            "Science": "Science", 
            "Sports": "Sports", 
            "Photography": "Photography", 
            "Music": "Music", 
            "Programming": "Programming", 
            "Fashion": "Fashion", 
            "Home & Garden": "Home & Garden", 
            "Automotive": "Automotive", 
            "Art": "Art", 
            "History": "History", 
            "Literature": "Literature", 
            "Philosophy": "Philosophy", 
            "Environment": "Environment", 
            "Business": "Business", 
            "Personal Development": "Personal Development" 
        }
    },
    az: {
        searchPlaceholder: "Saytları axtarın...",
        noResults: "Axtarışınıza uyğun nəticə tapılmadı.",
        wikiTitle: "Vikipediya Nəticəsi",
        categories: { 
            "Technology": "Texnologiya", 
            "Design": "Dizayn", 
            "Education": "Təhsil", 
            "Marketing": "Marketinq", 
            "E-commerce": "E-ticarət", 
            "Gaming": "Oyun", 
            "Tools": "Alətlər", 
            "Artificial Intelligence": "Süni İntellekt", 
            "Social Media": "Sosial Media", 
            "News": "Xəbərlər", 
            "Entertainment": "Əyləncə", 
            "Health": "Sağlamlıq", 
            "Finance": "Maliyyə", 
            "Travel": "Səyahət", 
            "Food": "Qida", 
            "Science": "Elm", 
            "Sports": "İdman", 
            "Photography": "Fotoqrafiya", 
            "Music": "Musiqi", 
            "Programming": "Proqramlaşdırma", 
            "Fashion": "Moda", 
            "Home & Garden": "Ev və Bağ", 
            "Automotive": "Avtomobil", 
            "Art": "İncəsənət", 
            "History": "Tarix", 
            "Literature": "Ədəbiyyat", 
            "Philosophy": "Fəlsəfə", 
            "Environment": "Ətraf Mühit", 
            "Business": "Biznes", 
            "Personal Development": "Şəxsi İnkişaf" 
        }
    },
    tr: {
        searchPlaceholder: "Siteleri ara...",
        noResults: "Aramanıza uygun sonuç bulunamadı.",
        wikiTitle: "Vikipedi Sonucu",
        categories: { 
            "Technology": "Teknoloji", 
            "Design": "Tasarım", 
            "Education": "Eğitim", 
            "Marketing": "Pazarlama", 
            "E-commerce": "E-ticaret", 
            "Gaming": "Oyun", 
            "Tools": "Araçlar", 
            "Artificial Intelligence": "Yapay Zeka", 
            "Social Media": "Sosyal Medya", 
            "News": "Haberler", 
            "Entertainment": "Eğlence", 
            "Health": "Sağlık", 
            "Finance": "Finans", 
            "Travel": "Seyahat", 
            "Food": "Yemek", 
            "Science": "Bilim", 
            "Sports": "Spor", 
            "Photography": "Fotoğrafçılık", 
            "Music": "Müzik", 
            "Programming": "Programlama", 
            "Fashion": "Moda", 
            "Home & Garden": "Ev ve Bahçe", 
            "Automotive": "Otomotiv", 
            "Art": "Sanat", 
            "History": "Tarih", 
            "Literature": "Edebiyat", 
            "Philosophy": "Felsefe", 
            "Environment": "Çevre", 
            "Business": "İş", 
            "Personal Development": "Kişisel Gelişim" 
        }
    }
};

// Metin Normalleştirme
function normalizeText(text) {
    if (!text) return '';
    let normalized = text.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase().trim();
    normalized = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const charMap = { 'ş': 's', 'ı': 'i', 'ç': 'c', 'ğ': 'g', 'ü': 'u', 'ö': 'o', 'ə': 'e' };
    return normalized.split('').map(char => charMap[char] || char).join('');
}

// Wikipedia API'den veri çekme
async function fetchWikipediaResult(query, lang = 'en') {
    try {
        const wikiLang = lang === 'az' ? 'az' : lang === 'tr' ? 'tr' : 'en';
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(
            `https://${wikiLang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodedQuery}&format=json&origin=*`
        );
        
        if (!response.ok) return null;
        
        const data = await response.json();
        const searchResults = data.query?.search || [];
        
        if (searchResults.length === 0) return null;
        
        const firstResult = searchResults[0];
        const pageTitle = firstResult.title;
        
        // Detaylı bilgi al
        const detailResponse = await fetch(
            `https://${wikiLang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=extracts&explaintext=true&exintro=true&format=json&origin=*`
        );
        
        const detailData = await detailResponse.json();
        const pages = detailData.query?.pages || {};
        const pageContent = Object.values(pages)[0];
        
        if (!pageContent) return null;
        
        return {
            title: pageTitle,
            excerpt: pageContent.extract || firstResult.snippet,
            url: `https://${wikiLang}.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`
        };
    } catch (error) {
        console.error('Wikipedia API Hatası:', error);
        return null;
    }
}

// Veri Çekme
async function loadSitesData() {
    try {
        const response = await fetch('sites.json');
        if (!response.ok) throw new Error('sites.json bulunamadı!');
        sites = await response.json();
        initializeApp();
    } catch (err) {
        console.error("Hata:", err);
        const res = document.getElementById('results');
        if (res) res.innerHTML = `<div class="no-results">Veriler yüklenemedi. Lütfen sayfayı yenileyin.</div>`;
    }
}

// Ana Arama Fonksiyonu
async function searchSites(query, category = '', lang = currentLang) {
    const resultsContainer = document.getElementById('results');
    const categoriesContainer = document.getElementById('siteCategories');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    const t = translations[lang];
    const normalizedQuery = normalizeText(query);
    const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 0 && !STOP_WORDS.has(term));
    
    let filteredSites = category 
        ? sites.filter(site => normalizeText(site.category) === normalizeText(category))
        : [...sites];
    
    // Wikipedia sonucunu kontrol et ve göster
    if (queryTerms.length > 0) {
        const filteredQuery = queryTerms.join(' ');
        const wikiResult = await fetchWikipediaResult(filteredQuery, lang);
        
        if (wikiResult) {
            const wikiCard = document.createElement('div');
            wikiCard.className = 'site-card wiki-card';
            wikiCard.innerHTML = `
                <div class="wiki-badge">📖 ${t.wikiTitle}</div>
                <h2>${wikiResult.title}</h2>
                <p class="wiki-excerpt">${wikiResult.excerpt.substring(0, 200)}...</p>
                <a href="${wikiResult.url}" target="_blank">Wikipediya →</a>
            `;
            resultsContainer.appendChild(wikiCard);
        }
    }
    
    if (queryTerms.length > 0) {
        if (categoriesContainer) categoriesContainer.style.display = 'none';
        
        filteredSites = filteredSites.map(site => {
            let score = 0;
            const siteTitle = normalizeText(site.title);
            const siteDesc = normalizeText(site.description[lang] || site.description.en || "");
            const siteCat = normalizeText(t.categories[site.category] || site.category);
            queryTerms.forEach(term => {
                if (siteTitle.includes(term)) score += 10;
                if (siteTitle === term) score += 15;
                if (siteCat.includes(term)) score += 5;
                if (siteDesc.includes(term)) score += 2;
            });
            return { ...site, score };
        }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);
    } else {
        if (categoriesContainer) categoriesContainer.style.display = 'flex';
    }
    
    renderUI(filteredSites, lang);
}

// UI Render
function renderUI(list, lang) {
    const resultsContainer = document.getElementById('results');
    if (list.length === 0 && resultsContainer.children.length === 0) {
        resultsContainer.innerHTML = `<div class="no-results">${translations[lang].noResults}</div>`;
        return;
    }
    
    list.forEach(site => {
        const card = document.createElement('div');
        card.className = 'site-card';
        const categoryLabel = translations[lang].categories[site.category] || site.category;
        const desc = site.description[lang] || site.description.en || "";
        card.innerHTML = `
            <h2>${site.title}</h2>
            <span class="site-category">${categoryLabel}</span>
            <p>${desc}</p>
            <a href="${site.url}" target="_blank">visit site →</a>
        `;
        resultsContainer.appendChild(card);
    });
}

// Dil Ayarı
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    const t = translations[lang];
    const searchInput = document.getElementById('search');
    if (searchInput) searchInput.placeholder = t.searchPlaceholder;
    createCategories(lang);
    searchSites(searchInput?.value || '', '', lang);
}

// Kategoriler
function createCategories(lang) {
    const container = document.getElementById('siteCategories');
    if (!container || sites.length === 0) return;
    container.innerHTML = '';
    const uniqueCats = [...new Set(sites.map(s => s.category))];
    uniqueCats.forEach(cat => {
        const item = document.createElement('div');
        item.className = 'category-item';
        item.textContent = translations[lang].categories[cat] || cat;
        item.onclick = () => {
            const input = document.getElementById('search');
            if (input) input.value = '';
            searchSites('', cat, lang);
        };
        container.appendChild(item);
    });
}

// Search Input Handler
function handleSearchInput(event) {
    const query = event.target.value;
    searchSites(query);
    
    const url = new URL(window.location);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    window.history.replaceState({}, '', url);
}

// Initialize
function initializeApp() {
    setLanguage(currentLang);
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
        const searchInput = document.getElementById('search');
        const decodedQ = decodeURIComponent(q);
        if (searchInput) searchInput.value = decodedQ;
        searchSites(decodedQ);
    }
}

// ===== DESIGN SETTINGS (Shared with Index) =====
const designState = {
    theme: 'dark',
    animationsEnabled: true,
    glassmorphEnabled: true,
    blurStrength: 30,
    transparency: 35,
    gradientIntensity: 100,
    glassOrbsEnabled: true,
    insetShadowEnabled: true,
    blurBackgroundEnabled: true
};

const designElements = {
    body: document.body,
    settingsToggle: document.getElementById('settingsToggle'),
    settingsPanel: document.getElementById('settingsPanel'),
    animationSwitch: document.getElementById('animationSwitch'),
    glassmorphSwitch: document.getElementById('glassmorphSwitch'),
    blurSlider: document.getElementById('blurSlider'),
    transparencySlider: document.getElementById('transparencySlider'),
    gradientSlider: document.getElementById('gradientSlider'),
    orbsSwitch: document.getElementById('orbsSwitch'),
    insetShadowSwitch: document.getElementById('insetShadowSwitch'),
    blurBackgroundSwitch: document.getElementById('blurBackgroundSwitch'),
    themeButtons: document.querySelectorAll('[data-theme]')
};

function initDesignSettings() {
    const savedTheme = localStorage.getItem('consts-theme') || 'dark';
    const animationsEnabled = localStorage.getItem('consts-animations') !== 'false';
    const blurValue = localStorage.getItem('consts-blur') || '30';
    const transparencyValue = localStorage.getItem('consts-transparency') || '35';
    const gradientValue = localStorage.getItem('consts-gradient') || '100';
    const orbsEnabled = localStorage.getItem('consts-orbs') !== 'false';
    
    setDesignTheme(savedTheme);
    designElements.themeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === savedTheme);
    });
    
    if (!animationsEnabled) toggleDesignAnimations();
    
    designState.blurStrength = parseInt(blurValue);
    designElements.blurSlider.value = designState.blurStrength;
    document.getElementById('blurValue').textContent = designState.blurStrength;
    
    designState.transparency = parseInt(transparencyValue);
    designElements.transparencySlider.value = designState.transparency;
    document.getElementById('transparencyValue').textContent = designState.transparency;
    
    designState.gradientIntensity = parseInt(gradientValue);
    designElements.gradientSlider.value = designState.gradientIntensity;
    document.getElementById('gradientValue').textContent = designState.gradientIntensity;
    
    if (orbsEnabled) {
        designElements.orbsSwitch.classList.add('active');
        designElements.body.classList.add('glass-orbs');
    }
    
    setupDesignListeners();
}

function setupDesignListeners() {
    designElements.settingsToggle.addEventListener('click', () => {
        designElements.settingsPanel.classList.toggle('open');
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.settings-panel') && !e.target.closest('.settings-toggle')) {
            designElements.settingsPanel.classList.remove('open');
        }
    });
    
    designElements.themeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            designElements.themeButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            setDesignTheme(e.target.dataset.theme);
        });
    });
    
    designElements.animationSwitch.addEventListener('click', toggleDesignAnimations);
    designElements.glassmorphSwitch.addEventListener('click', toggleDesignGlassmorphism);
    
    designElements.blurSlider.addEventListener('input', (e) => {
        designState.blurStrength = parseInt(e.target.value);
        document.getElementById('blurValue').textContent = designState.blurStrength;
        localStorage.setItem('consts-blur', designState.blurStrength);
    });
    
    designElements.transparencySlider.addEventListener('input', (e) => {
        designState.transparency = parseInt(e.target.value);
        document.getElementById('transparencyValue').textContent = designState.transparency;
        localStorage.setItem('consts-transparency', designState.transparency);
    });
    
    designElements.gradientSlider.addEventListener('input', (e) => {
        designState.gradientIntensity = parseInt(e.target.value);
        document.getElementById('gradientValue').textContent = designState.gradientIntensity;
        localStorage.setItem('consts-gradient', designState.gradientIntensity);
    });
    
    designElements.orbsSwitch.addEventListener('click', toggleDesignGlassOrbs);
    designElements.insetShadowSwitch.addEventListener('click', toggleDesignInsetShadow);
    designElements.blurBackgroundSwitch.addEventListener('click', toggleDesignBlurBackground);
}

function setDesignTheme(theme) {
    designState.theme = theme;
    designElements.body.classList.remove('dark-theme', 'light-theme', 'neon-theme');
    if (theme === 'light') designElements.body.classList.add('light-theme');
    else if (theme === 'neon') designElements.body.classList.add('neon-theme');
    localStorage.setItem('consts-theme', theme);
}

function toggleDesignAnimations() {
    designState.animationsEnabled = !designState.animationsEnabled;
    designElements.animationSwitch.classList.toggle('active');
    designElements.body.classList.toggle('animations-enabled');
    designElements.settingsToggle.classList.toggle('animations-enabled');
    localStorage.setItem('consts-animations', designState.animationsEnabled);
}

function toggleDesignGlassmorphism() {
    designState.glassmorphEnabled = !designState.glassmorphEnabled;
    designElements.glassmorphSwitch.classList.toggle('active');
    localStorage.setItem('consts-glassmorphism', designState.glassmorphEnabled);
}

function toggleDesignGlassOrbs() {
    designState.glassOrbsEnabled = !designState.glassOrbsEnabled;
    designElements.orbsSwitch.classList.toggle('active');
    designElements.body.classList.toggle('glass-orbs');
    localStorage.setItem('consts-orbs', designState.glassOrbsEnabled);
}

function toggleDesignInsetShadow() {
    designState.insetShadowEnabled = !designState.insetShadowEnabled;
    designElements.insetShadowSwitch.classList.toggle('active');
    localStorage.setItem('consts-inset-shadow', designState.insetShadowEnabled);
}

function toggleDesignBlurBackground() {
    designState.blurBackgroundEnabled = !designState.blurBackgroundEnabled;
    designElements.blurBackgroundSwitch.classList.toggle('active');
    localStorage.setItem('consts-blur-bg', designState.blurBackgroundEnabled);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    loadSitesData();
    initDesignSettings();
});