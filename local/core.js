// ===== SEARCH & LANGUAGE FUNCTIONS =====
let sites = []; 
let photos = [];
let shops = [];
let currentLang = localStorage.getItem('language') || 'en';
let currentFilter = 'all'; // all, ai, site, shop, photos

const STOP_WORDS = new Set(["ve", "bir", "mi", "mı", "mu", "mü", "ki", "da", "de", "için", "gibi", "hakkında", "ile", "ama", "fakat", "lakin", "çünkü", "eğer", "her", "tüm", "çok", "daha", "en", "bu", "o", "şu", "ben", "sen", "biz", "siz", "onlar", "yazıp", "deneme", "makale", "alt", "gitmek", "bunu", "onu", "şunu", "yaz", "in", "on", "at", "by", "for", "with", "from", "to", "of", "the", "a", "an" , "y", "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "en", "con", "por", "para", "es", "son", "lo", "그리고", "은", "는", "이", "가", "을", "를", "의", "에", "에서", "와", "과", "도", "하고", "만", "그", "이것", "저것"]);

const translations = {
    en: {
        searchPlaceholder: "Search sites...",
        noResults: "No results found for your search.",
        wikiTitle: "Wikipedia Result",
        filterAll: "All",
        filterAI: "AI",
        filterSite: "Site/Page",
        filterShop: "Shop",
        filterPhotos: "Photos",
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
        filterAll: "Hamısı",
        filterAI: "AI",
        filterSite: "Sayt/Səhifə",
        filterShop: "Mağaza",
        filterPhotos: "Fotoları",
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
        filterAll: "Hepsi",
        filterAI: "AI",
        filterSite: "Site/Sayfa",
        filterShop: "Mağaza",
        filterPhotos: "Fotoları",
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
    },
    ko: {
        searchPlaceholder: "사이트 검색...",
        noResults: "검색 결과가 없습니다.",
        wikiTitle: "위키백과 결과",
        filterAll: "모두",
        filterAI: "AI",
        filterSite: "사이트/페이지",
        filterShop: "상점",
        filterPhotos: "사진",
        categories: { 
            "Technology": "기술", 
            "Design": "디자인", 
            "Education": "교육", 
            "Marketing": "마케팅", 
            "E-commerce": "이커머스", 
            "Gaming": "게임", 
            "Tools": "도구", 
            "Artificial Intelligence": "인공지능", 
            "Social Media": "소셜 미디어", 
            "News": "뉴스", 
            "Entertainment": "엔터테인먼트", 
            "Health": "건강", 
            "Finance": "금융", 
            "Travel": "여행", 
            "Food": "음식", 
            "Science": "과학", 
            "Sports": "스포츠", 
            "Photography": "사진", 
            "Music": "음악", 
            "Programming": "프로그래밍", 
            "Fashion": "패션", 
            "Home & Garden": "홈 및 가든", 
            "Automotive": "자동차", 
            "Art": "예술", 
            "History": "역사", 
            "Literature": "문학", 
            "Philosophy": "철학", 
            "Environment": "환경", 
            "Business": "비즈니스", 
            "Personal Development": "자기계발" 
        }
    },
    es: {
        searchPlaceholder: "Buscar sitios...",
        noResults: "No se encontraron resultados para su búsqueda.",
        wikiTitle: "Resultado de Wikipedia",
        filterAll: "Todos",
        filterAI: "AI",
        filterSite: "Sitio/Página",
        filterShop: "Tienda",
        filterPhotos: "Fotos",
        categories: { 
            "Technology": "Tecnología", 
            "Design": "Diseño", 
            "Education": "Educación", 
            "Marketing": "Marketing", 
            "E-commerce": "Comercio electrónico", 
            "Gaming": "Juegos", 
            "Tools": "Herramientas", 
            "Artificial Intelligence": "Inteligencia Artificial", 
            "Social Media": "Redes Sociales", 
            "News": "Noticias", 
            "Entertainment": "Entretenimiento", 
            "Health": "Salud", 
            "Finance": "Finanzas", 
            "Travel": "Viajes", 
            "Food": "Comida", 
            "Science": "Ciencia", 
            "Sports": "Deportes", 
            "Photography": "Fotografía", 
            "Music": "Música", 
            "Programming": "Programación", 
            "Fashion": "Moda", 
            "Home & Garden": "Hogar y Jardín", 
            "Automotive": "Automotriz", 
            "Art": "Arte", 
            "History": "Historia", 
            "Literature": "Literatura", 
            "Philosophy": "Filosofía", 
            "Environment": "Medio Ambiente", 
            "Business": "Negocios", 
            "Personal Development": "Desarrollo Personal" 
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

// Wikipedia API'den veri çekme (Sadece AI filtresinde kullanılır)
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

// Veri Çekme - Tüm JSON dosyalarını yükle
async function loadAllData() {
    try {
        // sites.json yükle
        const sitesResponse = await fetch('https://database.plugetsearch.pages.dev/sites.json'); 
        if (sitesResponse.ok) {
            sites = await sitesResponse.json();
        } else {
            console.warn('sites.json bulunamadı');
        }
        
        // shops.json yükle
        try {
            const shopsResponse = await fetch('https://database.plugetsearch.pages.dev/shops.json');
            if (shopsResponse.ok) {
                shops = await shopsResponse.json();
            }
        } catch (err) {
            console.warn('shops.json yüklenemedi:', err);
        }
        
        // photos.json yükle
        try {
            const photosResponse = await fetch('https://database.plugetsearch.pages.dev/photos.json');
            if (photosResponse.ok) {
                photos = await photosResponse.json();
            }
        } catch (err) {
            console.warn('photos.json yüklenemedi:', err);
        }
        
        initializeApp();
    } catch (err) {
        console.error("error: no results:", err);
        const res = document.getElementById('results');
        if (res) res.innerHTML = `<div class="no-results">error: no results</div>`;
    }
}

// Filter butonları oluştur
function createFilterButtons(lang) {
    const filterContainer = document.getElementById('filterButtons');
    if (!filterContainer) return;
    
    filterContainer.innerHTML = '';
    const t = translations[lang];
    
    const filters = [
        { id: 'all', label: t.filterAll },
        { id: 'ai', label: t.filterAI },
        { id: 'site', label: t.filterSite },
        { id: 'shop', label: t.filterShop },
        { id: 'photos', label: t.filterPhotos }
    ];
    
    filters.forEach(filter => {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${filter.id === currentFilter ? 'active' : ''}`;
        btn.textContent = filter.label;
        btn.onclick = () => {
            currentFilter = filter.id;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const searchInput = document.getElementById('search');
            const query = searchInput ? searchInput.value : '';
            searchSites(query);
        };
        filterContainer.appendChild(btn);
    });
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

// Ana Arama Fonksiyonu
async function searchSites(query, category = '', lang = currentLang) {
    const resultsContainer = document.getElementById('results');
    const categoriesContainer = document.getElementById('siteCategories');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    const t = translations[lang];
    const normalizedQuery = normalizeText(query);
    const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 0 && !STOP_WORDS.has(term));
    
    // Wikipedia sonucunu kontrol et (sadece AI filtresinde ve sorgu varsa)
    if (currentFilter === 'ai' || currentFilter === 'all') {
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
                    <a href="${wikiResult.url}" target="_blank">Wikipedia →</a>
                `;
                resultsContainer.appendChild(wikiCard);
            }
        }
    }
    
    // Sites arama (all ve site filtrelerinde)
    if (currentFilter === 'all' || currentFilter === 'site') {
        let filteredSites = category 
            ? sites.filter(site => normalizeText(site.category) === normalizeText(category))
            : [...sites];
        
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
        
        renderSitesUI(filteredSites, lang, t);
    }
    
    // Shops arama (all ve shop filtrelerinde)
    if (currentFilter === 'all' || currentFilter === 'shop') {
        let filteredShops = [...shops];
        
        if (queryTerms.length > 0) {
            filteredShops = filteredShops.map(shop => {
                let score = 0;
                const shopName = normalizeText(shop.name);
                const shopDesc = normalizeText(shop.description ? shop.description : "");
                queryTerms.forEach(term => {
                    if (shopName.includes(term)) score += 10;
                    if (shopName === term) score += 15;
                    if (shopDesc.includes(term)) score += 2;
                });
                return { ...shop, score };
            }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);
        }
        
        renderShopsUI(filteredShops, lang);
    }
    
    // Photos arama (all ve photos filtrelerinde)
    if (currentFilter === 'all' || currentFilter === 'photos') {
        let filteredPhotos = [...photos];
        
        if (queryTerms.length > 0) {
            filteredPhotos = filteredPhotos.map(photo => {
                let score = 0;
                const photoTitle = normalizeText(photo.title);
                const photoDesc = normalizeText(photo.description ? photo.description : "");
                queryTerms.forEach(term => {
                    if (photoTitle.includes(term)) score += 10;
                    if (photoTitle === term) score += 15;
                    if (photoDesc.includes(term)) score += 2;
                });
                return { ...photo, score };
            }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);
        }
        
        renderPhotosUI(filteredPhotos, lang);
    }
    
    // Hiç sonuç bulunamadıysa
    if (resultsContainer.children.length === 0 && queryTerms.length > 0) {
        resultsContainer.innerHTML = `<div class="no-results">${t.noResults}</div>`;
    }
}

// Sites UI render
function renderSitesUI(list, lang, t) {
    const resultsContainer = document.getElementById('results');
    
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

// Shops UI render
function renderShopsUI(list, lang) {
    const resultsContainer = document.getElementById('results');
    
    list.forEach(shop => {
        const card = document.createElement('div');
        card.className = 'site-card shop-card';
        
        let photosHTML = '';
        if (shop.photos && shop.photos.length > 0) {
            photosHTML = `<div class="shop-photos">`;
            shop.photos.forEach(photo => {
                photosHTML += `<img src="${photo}" alt="product" class="shop-photo">`;
            });
            photosHTML += `</div>`;
        }
        
        card.innerHTML = `
            <h2>${shop.name}</h2>
            ${shop.category ? `<span class="site-category">${shop.category}</span>` : ''}
            <p>${shop.description || ''}</p>
            ${photosHTML}
            <a href="${shop.url}" target="_blank">visit shop →</a>
        `;
        resultsContainer.appendChild(card);
    });
}

// Photos UI render
function renderPhotosUI(list, lang) {
    const resultsContainer = document.getElementById('results');
    
    list.forEach(photo => {
        const card = document.createElement('div');
        card.className = 'site-card photo-card';
        card.innerHTML = `
            <h2>${photo.title}</h2>
            <img src="${photo.image}" alt="${photo.title}" class="photo-image">
            <p>${photo.description || ''}</p>
            ${photo.credit ? `<small style="color: var(--text-secondary);">📸 ${photo.credit}</small>` : ''}
        `;
        resultsContainer.appendChild(card);
    });
}

// Initialize
function initializeApp() {
    // Language select elementini bul ve event listener ekle
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        // Mevcut dili seçili yap
        languageSelect.value = currentLang;
        
        // Change event listener ekle
        languageSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }
    
    // Search input event listener
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('keyup', handleSearchInput);
    }
    
    // Sayfa yüklendiğinde mevcut dili ayarla
    setLanguage(currentLang);
    
    // URL'den query parametresi kontrol et
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
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
    
    if (designElements.themeButtons) {
        designElements.themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === savedTheme);
        });
    }
    
    if (!animationsEnabled) toggleDesignAnimations();
    
    designState.blurStrength = parseInt(blurValue);
    if (designElements.blurSlider) {
        designElements.blurSlider.value = designState.blurStrength;
        const blurValueEl = document.getElementById('blurValue');
        if (blurValueEl) blurValueEl.textContent = designState.blurStrength;
    }
    
    designState.transparency = parseInt(transparencyValue);
    if (designElements.transparencySlider) {
        designElements.transparencySlider.value = designState.transparency;
        const transparencyValueEl = document.getElementById('transparencyValue');
        if (transparencyValueEl) transparencyValueEl.textContent = designState.transparency;
    }
    
    designState.gradientIntensity = parseInt(gradientValue);
    if (designElements.gradientSlider) {
        designElements.gradientSlider.value = designState.gradientIntensity;
        const gradientValueEl = document.getElementById('gradientValue');
        if (gradientValueEl) gradientValueEl.textContent = designState.gradientIntensity;
    }
    
    if (orbsEnabled && designElements.orbsSwitch) {
        designElements.orbsSwitch.classList.add('active');
        designElements.body.classList.add('glass-orbs');
    }
    
    setupDesignListeners();
}

function setupDesignListeners() {
    if (designElements.settingsToggle && designElements.settingsPanel) {
        designElements.settingsToggle.addEventListener('click', () => {
            designElements.settingsPanel.classList.toggle('open');
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.settings-panel') && !e.target.closest('.settings-btn')) {
                designElements.settingsPanel.classList.remove('open');
            }
        });
    }
    
    if (designElements.themeButtons) {
        designElements.themeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                designElements.themeButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                setDesignTheme(e.target.dataset.theme);
            });
        });
    }
    
    if (designElements.animationSwitch) {
        designElements.animationSwitch.addEventListener('click', toggleDesignAnimations);
    }
    
    if (designElements.glassmorphSwitch) {
        designElements.glassmorphSwitch.addEventListener('click', toggleDesignGlassmorphism);
    }
    
    if (designElements.blurSlider) {
        designElements.blurSlider.addEventListener('input', (e) => {
            designState.blurStrength = parseInt(e.target.value);
            const blurValueEl = document.getElementById('blurValue');
            if (blurValueEl) blurValueEl.textContent = designState.blurStrength;
            localStorage.setItem('consts-blur', designState.blurStrength);
        });
    }
    
    if (designElements.transparencySlider) {
        designElements.transparencySlider.addEventListener('input', (e) => {
            designState.transparency = parseInt(e.target.value);
            const transparencyValueEl = document.getElementById('transparencyValue');
            if (transparencyValueEl) transparencyValueEl.textContent = designState.transparency;
            localStorage.setItem('consts-transparency', designState.transparency);
        });
    }
    
    if (designElements.gradientSlider) {
        designElements.gradientSlider.addEventListener('input', (e) => {
            designState.gradientIntensity = parseInt(e.target.value);
            const gradientValueEl = document.getElementById('gradientValue');
            if (gradientValueEl) gradientValueEl.textContent = designState.gradientIntensity;
            localStorage.setItem('consts-gradient', designState.gradientIntensity);
        });
    }
    
    if (designElements.orbsSwitch) {
        designElements.orbsSwitch.addEventListener('click', toggleDesignGlassOrbs);
    }
    
    if (designElements.insetShadowSwitch) {
        designElements.insetShadowSwitch.addEventListener('click', toggleDesignInsetShadow);
    }
    
    if (designElements.blurBackgroundSwitch) {
        designElements.blurBackgroundSwitch.addEventListener('click', toggleDesignBlurBackground);
    }
}

function setDesignTheme(theme) {
    designState.theme = theme;
    designElements.body.classList.remove('dark-theme', 'light-theme', 'neon-theme', 'midnight-theme', 'ocean-theme');
    
    if (theme === 'light') designElements.body.classList.add('light-theme');
    else if (theme === 'neon') designElements.body.classList.add('neon-theme');
    else if (theme === 'midnight') designElements.body.classList.add('midnight-theme');
    else if (theme === 'ocean') designElements.body.classList.add('ocean-theme');
    
    localStorage.setItem('consts-theme', theme);
}

function toggleDesignAnimations() {
    designState.animationsEnabled = !designState.animationsEnabled;
    if (designElements.animationSwitch) designElements.animationSwitch.classList.toggle('active');
    designElements.body.classList.toggle('animations-enabled');
    if (designElements.settingsToggle) designElements.settingsToggle.classList.toggle('animations-enabled');
    localStorage.setItem('consts-animations', designState.animationsEnabled);
}

function toggleDesignGlassmorphism() {
    designState.glassmorphEnabled = !designState.glassmorphEnabled;
    if (designElements.glassmorphSwitch) designElements.glassmorphSwitch.classList.toggle('active');
    localStorage.setItem('consts-glassmorphism', designState.glassmorphEnabled);
}

function toggleDesignGlassOrbs() {
    designState.glassOrbsEnabled = !designState.glassOrbsEnabled;
    if (designElements.orbsSwitch) designElements.orbsSwitch.classList.toggle('active');
    designElements.body.classList.toggle('glass-orbs');
    localStorage.setItem('consts-orbs', designState.glassOrbsEnabled);
}

function toggleDesignInsetShadow() {
    designState.insetShadowEnabled = !designState.insetShadowEnabled;
    if (designElements.insetShadowSwitch) designElements.insetShadowSwitch.classList.toggle('active');
    localStorage.setItem('consts-inset-shadow', designState.insetShadowEnabled);
}

function toggleDesignBlurBackground() {
    designState.blurBackgroundEnabled = !designState.blurBackgroundEnabled;
    if (designElements.blurBackgroundSwitch) designElements.blurBackgroundSwitch.classList.toggle('active');
    localStorage.setItem('consts-blur-bg', designState.blurBackgroundEnabled);
}

// Dil Ayarı
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    
    const t = translations[lang];
    const searchInput = document.getElementById('search');
    if (searchInput && t) searchInput.placeholder = t.searchPlaceholder;
    
    // Filter butonlarını ve kategorileri güncelle
    createFilterButtons(lang);
    createCategories(lang);
    
    // Mevcut arama sonuçlarını yeniden render et
    const query = searchInput?.value || '';
    searchSites(query, '', lang);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    loadAllData();
    initDesignSettings();
    
    // Tema senkronizasyonu için storage event listener
    window.addEventListener('storage', (e) => {
        if (e.key === 'language') {
            setLanguage(e.newValue);
        } else if (e.key === 'pluget-theme') {
            setDesignTheme(e.newValue);
        }
    });
});