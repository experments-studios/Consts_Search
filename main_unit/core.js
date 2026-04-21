// ===== SEARCH & LANGUAGE FUNCTIONS =====
let sites = [];
let photos = [];
let shops = [];
let siteJsonData = [];
let currentLang = localStorage.getItem('language') || 'en';
let currentFilter = 'all';

const STOP_WORDS = new Set([
    // Turkish
    "ve", "bir", "mi", "mı", "mu", "mü", "ki", "da", "de", "için", "gibi", 
    "hakkında", "ile", "ama", "fakat", "lakin", "çünkü", "eğer", "her", "tüm", 
    "çok", "daha", "en", "bu", "o", "şu", "ben", "sen", "biz", "siz", "onlar", 
    "yazıp", "deneme", "makale", "alt", "gitmek", "bunu", "onu", "şunu", "yaz", 
    // English
    "in", "on", "at", "by", "for", "with", "from", "to", "of", "the", "a", "an",
    // Spanish
    "y", "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "en", "con", 
    "por", "para", "es", "son", "lo", 
    // Korean
    "그리그", "은", "는", "이", "가", "을", "를", "의", "에", "에서", "와", "과", "도", "하고", "만", "그", "이것", "저것",
    // German (NEW)
    "und", "der", "die", "das", "ein", "eine", "mit", "für", "von", "zu", "auf", "ist", "im", "nicht", "auch",
    // French (NEW)
    "et", "le", "la", "les", "un", "une", "des", "du", "de", "dans", "en", "par", "pour", "est", "avec",
    // Japanese (NEW)
    "の", "に", "は", "を", "た", "が", "で", "て", "と", "し", "れ", "さ", "ある", "いる", "も", "する"
]);

const translations = {
    en: {
        searchPlaceholder: "Search sites...",
        noResults: "No results found for your search.",
        wikiTitle: "Wikipedia Result",
        filterAll: "All", filterAI: "AI", filterSite: "Site/Page", filterShop: "Shop", filterPhotos: "Photos",
        categories: {
            "Technology": "Technology", "Design": "Design", "Education": "Education",
            "Marketing": "Marketing", "E-commerce": "E-commerce", "Gaming": "Gaming",
            "Tools": "Tools", "Artificial Intelligence": "Artificial Intelligence",
            "Social Media": "Social Media", "News": "News", "Entertainment": "Entertainment",
            "Health": "Health", "Finance": "Finance", "Travel": "Travel", "Food": "Food",
            "Science": "Science", "Sports": "Sports", "Photography": "Photography",
            "Music": "Music", "Programming": "Programming", "Fashion": "Fashion",
            "Home & Garden": "Home & Garden", "Automotive": "Automotive", "Art": "Art",
            "History": "History", "Literature": "Literature", "Philosophy": "Philosophy",
            "Environment": "Environment", "Business": "Business", "Personal Development": "Personal Development",
            "Global": "Global", "Social": "Social"
        }
    },
    az: {
        searchPlaceholder: "Saytları axtarın...",
        noResults: "Axtarışınıza uyğun nəticə tapılmadı.",
        wikiTitle: "Vikipediya Nəticəsi",
        filterAll: "Hamısı", filterAI: "AI", filterSite: "Sayt/Səhifə", filterShop: "Mağaza", filterPhotos: "Fotoları",
        categories: {
            "Technology": "Texnologiya", "Design": "Dizayn", "Education": "Təhsil",
            "Marketing": "Marketinq", "E-commerce": "E-ticarət", "Gaming": "Oyun",
            "Tools": "Alətlər", "Artificial Intelligence": "Süni İntellekt",
            "Social Media": "Sosial Media", "News": "Xəbərlər", "Entertainment": "Əyləncə",
            "Health": "Sağlamlıq", "Finance": "Maliyyə", "Travel": "Səyahət", "Food": "Qida",
            "Science": "Elm", "Sports": "İdman", "Photography": "Fotoqrafiya",
            "Music": "Musiqi", "Programming": "Proqramlaşdırma", "Fashion": "Moda",
            "Home & Garden": "Ev və Bağ", "Automotive": "Avtomobil", "Art": "İncəsənət",
            "History": "Tarix", "Literature": "Ədəbiyyat", "Philosophy": "Fəlsəfə",
            "Environment": "Ətraf Mühit", "Business": "Biznes", "Personal Development": "Şəxsi İnkişaf",
            "Global": "Qlobal", "Social": "Sosial"
        }
    },
    tr: {
        searchPlaceholder: "Siteleri ara...",
        noResults: "Aramanıza uygun sonuç bulunamadı.",
        wikiTitle: "Vikipedi Sonucu",
        filterAll: "Hepsi", filterAI: "AI", filterSite: "Site/Sayfa", filterShop: "Mağaza", filterPhotos: "Fotoları",
        categories: {
            "Technology": "Teknoloji", "Design": "Tasarım", "Education": "Eğitim",
            "Marketing": "Pazarlama", "E-commerce": "E-ticaret", "Gaming": "Oyun",
            "Tools": "Araçlar", "Artificial Intelligence": "Yapay Zeka",
            "Social Media": "Sosyal Medya", "News": "Haberler", "Entertainment": "Eğlence",
            "Health": "Sağlık", "Finance": "Finans", "Travel": "Seyahat", "Food": "Yemek",
            "Science": "Bilim", "Sports": "Spor", "Photography": "Fotoğrafçılık",
            "Music": "Müzik", "Programming": "Programlama", "Fashion": "Moda",
            "Home & Garden": "Ev ve Bahçe", "Automotive": "Otomotiv", "Art": "Sanat",
            "History": "Tarih", "Literature": "Edebiyat", "Philosophy": "Felsefe",
            "Environment": "Çevre", "Business": "İş", "Personal Development": "Kişisel Gelişim",
            "Global": "Küresel", "Social": "Sosyal"
        }
    },
    ko: {
        searchPlaceholder: "사이트 검색...",
        noResults: "검색 결과가 없습니다.",
        wikiTitle: "위키백과 결과",
        filterAll: "모두", filterAI: "AI", filterSite: "사이트/페이지", filterShop: "상점", filterPhotos: "사진",
        categories: {
            "Technology": "기술", "Design": "디자인", "Education": "교육",
            "Marketing": "마케팅", "E-commerce": "이커머스", "Gaming": "게임",
            "Tools": "도구", "Artificial Intelligence": "인공지능",
            "Social Media": "소셜 미디어", "News": "뉴스", "Entertainment": "엔터테인먼트",
            "Health": "건강", "Finance": "금융", "Travel": "여행", "Food": "음식",
            "Science": "과학", "Sports": "스포츠", "Photography": "사진",
            "Music": "음악", "Programming": "프로그래ミング", "Fashion": "패션",
            "Home & Garden": "홈 및 가든", "Automotive": "자동차", "Art": "예술",
            "History": "역사", "Literature": "문학", "Philosophy": "철학",
            "Environment": "환경", "Business": "비즈니스", "Personal Development": "자기계발",
            "Global": "글로벌", "Social": "소셜"
        }
    },
    es: {
        searchPlaceholder: "Buscar sitios...",
        noResults: "No se encontraron resultados para su búsqueda.",
        wikiTitle: "Resultado de Wikipedia",
        filterAll: "Todos", filterAI: "AI", filterSite: "Sitio/Página", filterShop: "Tienda", filterPhotos: "Fotos",
        categories: {
            "Technology": "Tecnología", "Design": "Diseño", "Education": "Educación",
            "Marketing": "Marketing", "E-commerce": "Comercio electrónico", "Gaming": "Juegos",
            "Tools": "Herramientas", "Artificial Intelligence": "Inteligencia Artificial",
            "Social Media": "Redes Sociales", "News": "Noticias", "Entertainment": "Entretenimiento",
            "Health": "Salud", "Finance": "Finanzas", "Travel": "Viajes", "Food": "Comida",
            "Science": "Ciencia", "Sports": "Deportes", "Photography": "Fotografía",
            "Music": "Música", "Programming": "Programación", "Fashion": "Moda",
            "Home & Garden": "Hogar y Jardín", "Automotive": "Automotriz", "Art": "Arte",
            "History": "Historia", "Literature": "Literatura", "Philosophy": "Filosofía",
            "Environment": "Medio Ambiente", "Business": "Negocios", "Personal Development": "Desarrollo Personal",
            "Global": "Global", "Social": "Social"
        }
    },
    jp: {
        searchPlaceholder: "サイトを検索...",
        noResults: "検索結果が見つかりませんでした。",
        wikiTitle: "Wikipediaの結果",
        filterAll: "すべて", filterAI: "AI", filterSite: "サイト/ページ", filterShop: "ショップ", filterPhotos: "写真",
        categories: {
            "Technology": "テクノロジー", "Design": "デザイン", "Education": "教育",
            "Marketing": "マーケティング", "E-commerce": "電子商取引", "Gaming": "ゲーム",
            "Tools": "ツール", "Artificial Intelligence": "人工知能",
            "Social Media": "ソーシャルメディア", "News": "ニュース", "Entertainment": "エンターテインメント",
            "Health": "健康", "Finance": "財務", "Travel": "旅行", "Food": "料理",
            "Science": "科学", "Sports": "スポーツ", "Photography": "写真",
            "Music": "音楽", "Programming": "プログラミング", "Fashion": "ファッション",
            "Home & Garden": "ホーム＆ガーデン", "Automotive": "自動車", "Art": "アート",
            "History": "歴史", "Literature": "文学", "Philosophy": "哲学",
            "Environment": "環境", "Business": "ビジネス", "Personal Development": "自己啓発",
            "Global": "グローバル", "Social": "ソーシャル"
        }
    },
    de: {
        searchPlaceholder: "Websites suchen...",
        noResults: "Keine Ergebnisse für Ihre Suche gefunden.",
        wikiTitle: "Wikipedia-Ergebnis",
        filterAll: "Alle", filterAI: "KI", filterSite: "Seite", filterShop: "Shop", filterPhotos: "Fotos",
        categories: {
            "Technology": "Technologie", "Design": "Design", "Education": "Bildung",
            "Marketing": "Marketing", "E-commerce": "E-Commerce", "Gaming": "Gaming",
            "Tools": "Werkzeuge", "Artificial Intelligence": "Künstliche Intelligenz",
            "Social Media": "Soziale Medien", "News": "Nachrichten", "Entertainment": "Unterhaltung",
            "Health": "Gesundheit", "Finance": "Finanzen", "Travel": "Reisen", "Food": "Essen",
            "Science": "Wissenschaft", "Sports": "Sport", "Photography": "Fotografie",
            "Music": "Musik", "Programming": "Programmierung", "Fashion": "Mode",
            "Home & Garden": "Haus & Garten", "Automotive": "Automobil", "Art": "Kunst",
            "History": "Geschichte", "Literature": "Literatur", "Philosophy": "Philosophie",
            "Environment": "Umwelt", "Business": "Business", "Personal Development": "Persönlichkeitsentwicklung",
            "Global": "Global", "Social": "Sozial"
        }
    },
    fr: {
        searchPlaceholder: "Rechercher des sites...",
        noResults: "Aucun résultat trouvé pour votre recherche.",
        wikiTitle: "Résultat de Wikipédia",
        filterAll: "Tout", filterAI: "IA", filterSite: "Site/Page", filterShop: "Boutique", filterPhotos: "Photos",
        categories: {
            "Technology": "Technologie", "Design": "Design", "Education": "Éducation",
            "Marketing": "Marketing", "E-commerce": "E-commerce", "Gaming": "Jeux vidéo",
            "Tools": "Outils", "Artificial Intelligence": "Intelligence Artificielle",
            "Social Media": "Réseaux Sociaux", "News": "Actualités", "Entertainment": "Divertissement",
            "Health": "Santé", "Finance": "Finance", "Travel": "Voyage", "Food": "Cuisine",
            "Science": "Science", "Sports": "Sports", "Photography": "Photographie",
            "Music": "Musique", "Programming": "Programmation", "Fashion": "Mode",
            "Home & Garden": "Maison & Jardin", "Automotive": "Automobile", "Art": "Art",
            "History": "Histoire", "Literature": "Littérature", "Philosophy": "Philosophie",
            "Environment": "Environnement", "Business": "Affaires", "Personal Development": "Développement Personnel",
            "Global": "Global", "Social": "Social"
        }
    }
};

function normalizeText(text) {
    if (!text) return '';
    let normalized = text.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase().trim();
    normalized = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const charMap = { 'ş': 's', 'ı': 'i', 'ç': 'c', 'ğ': 'g', 'ü': 'u', 'ö': 'o', 'ə': 'e' };
    return normalized.split('').map(char => charMap[char] || char).join('');
}

async function fetchWikipediaResult(query, lang = 'en') {
    try {
        const wikiLang = lang === 'az' ? 'az' : lang === 'tr' ? 'tr' : lang === 'en' ? 'en' : lang === 'ko' ? 'ko' : lang === 'jp' ? 'jp' : lang === 'fr' ? 'fr' : lang === 'es' ? 'es' : lang === 'de';
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
        const detailResponse = await fetch(
            `https://${wikiLang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=extracts&explaintext=true&exintro=true&format=json&origin=*`
        );
        const detailData = await detailResponse.json();
        const pages = detailData.query?.pages || {};
        const pageContent = Object.values(pages)[0];
        if (!pageContent) return null;
        return {
            title: pageContent.title || pageTitle,
            excerpt: pageContent.extract || firstResult.snippet,
            url: `https://${wikiLang}.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`
        };
    } catch (error) {
        console.error('Wikipedia API error');
        return null;
    }
}
function generateDynamicSearchResults(query, lang) {
    if (!query || query.trim().length === 0) return [];
    
    const encodedQuery = encodeURIComponent(query);
    const cleanQuery = query.replace(/\s+/g, '');
    
    return [
        {
            t: `YouTube Search - ${query}`,
            c: "Social",
            d: {
                en: `Watch videos about "${query}"`,
                tr: `"${query}" hakkında video izle`,
                az: `"${query}" haqqında video izlə`,
                es: `Ver videos sobre "${query}"`,
                ko: `"${query}"에 대한 비디오 시청`
            },
            u: `https://www.youtube.com/results?search_query=${encodedQuery}`,
            icon: '',
            type: ''
        },
        {
            t: `YouTube Hashtag - #${cleanQuery}`,
            c: "Social",
            d: {
                en: `Explore #${cleanQuery} videos`,
                tr: `#${cleanQuery} videolarını keşfet`,
                az: `#${cleanQuery} videolarını kəşf et`,
                es: `Explorar videos #${cleanQuery}`,
                ko: `#${cleanQuery} 비디오 탐색`
            },
            u: `https://www.youtube.com/hashtag/${cleanQuery}`,
            icon: '',
            type: ''
        },
        {
            t: `Wikipedia - ${query}`,
            c: "Global",
            d: {
                en: `Read about "${query}" on Wikipedia`,
                tr: `"${query}" Vikipedi'de oku`,
                az: `"${query}" Vikipediyada oxu`,
                es: `Leer sobre "${query}" en Wikipedia`,
                ko: `위키백과에서 "${query}" 읽기`
            },
            u: `https://${lang === 'az' ? 'az' : lang === 'tr' ? 'tr' : lang === 'en' ? 'en' : lang === 'es' ? 'es' : lang === 'fr' ? 'fr' : lang === 'de' ? 'de' : lang === 'ko' ? 'ko' : 'jp'}.wikipedia.org/wiki/Special:Search?search=${encodedQuery}`,
            icon: '',
            type: ''
        },
        {
            t: `Wikipedia EN - ${query}`,
            c: "Global",
            d: {
                en: `English Wikipedia article about "${query}"`,
                tr: `"${query}" İngilizce Vikipedi makalesi`,
                az: `"${query}" İngilis dilində Vikipediya məqaləsi`,
                es: `Artículo de Wikipedia en inglés sobre "${query}"`,
                ko: `"${query}"에 대한 영어 위키백과 문서`
            },
            u: `https://en.wikipedia.org/wiki/Special:Search?search=${encodedQuery}`,
            icon: '',
            type: ''
        },
        {
            t: `Instagram - #${cleanQuery}`,
            c: "Social",
            d: {
                en: `Photos tagged with #${cleanQuery}`,
                tr: `#${cleanQuery} etiketli fotoğraflar`,
                az: `#${cleanQuery} teqli fotolar`,
                es: `Fotos etiquetadas con #${cleanQuery}`,
                ko: `#${cleanQuery} 태그된 사진`
            },
            u: `https://www.instagram.com/explore/tags/${cleanQuery}/`,
            icon: '',
            type: ''
        },
        {
            t: `Instagram Search - ${query}`,
            c: "Social",
            d: {
                en: `Search "${query}" on Instagram`,
                tr: `Instagram'da "${query}" ara`,
                az: `Instagram-da "${query}" axtar`,
                es: `Buscar "${query}" en Instagram`,
                ko: `Instagram에서 "${query}" 검색`
            },
            u: `https://www.instagram.com/search?q=${encodedQuery}`,
            icon: '',
            type: ''
        },
        {
            t: `TikTok Search - ${query}`,
            c: "Social",
            d: {
                en: `TikTok videos about "${query}"`,
                tr: `"${query}" TikTok videoları`,
                az: `"${query}" TikTok videoları`,
                es: `Videos de TikTok sobre "${query}"`,
                ko: `TikTok에서 "${query}" 비디오`
            },
            u: `https://www.tiktok.com/search?q=${encodedQuery}`,
            icon: '',
            type: ''
        },
        {
            t: `TikTok Hashtag - #${cleanQuery}`,
            c: "Social",
            d: {
                en: `Trending #${cleanQuery} on TikTok`,
                tr: `TikTok'ta trend #${cleanQuery}`,
                az: `TikTok-da trend #${cleanQuery}`,
                es: `Tendencia #${cleanQuery} en TikTok`,
                ko: `TikTok에서 트렌드 #${cleanQuery}`
            },
            u: `https://www.tiktok.com/tag/${cleanQuery}`,
            icon: '',
            type: ''
        },
        {
            t: `TikTok User - @${cleanQuery}`,
            c: "Social",
            d: {
                en: `Find user @${cleanQuery} on TikTok`,
                tr: `TikTok'ta @${cleanQuery} kullanıcısını bul`,
                az: `TikTok-da @${cleanQuery} istifadəçisini tap`,
                es: `Encontrar usuario @${cleanQuery} en TikTok`,
                ko: `TikTok에서 @${cleanQuery} 사용자 찾기`
            },
            u: `https://www.tiktok.com/@${cleanQuery}`,
            icon: '',
            type: ''
        }
    ].map((item, index) => ({ ...item, isDynamic: true, order: index }));
}

function findMatchingJsonFiles(queryTerms) {
    if (!siteJsonData || siteJsonData.length === 0 || queryTerms.length === 0) return [];
    
    const matches = siteJsonData.map(item => {
        let score = 0;
        const keywords = item.keywords || [];
        queryTerms.forEach(term => {
            keywords.forEach(keyword => {
                const normalizedKeyword = normalizeText(keyword);
                if (normalizedKeyword === term) score += 10;
                else if (normalizedKeyword.includes(term)) score += 5;
                else if (term.includes(normalizedKeyword)) score += 3;
            });
        });
        return { ...item, score };
    }).filter(item => item.score > 0).sort((a, b) => b.score - a.score);
    
    return matches.slice(0, 2).map(m => m.json);
}

async function loadJsonData(jsonFiles) {
    const loadedSites = [];
    for (const jsonFile of jsonFiles) {
        try {
            const response = await fetch(jsonFile);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) loadedSites.push(...data);
                else if (data.sites && Array.isArray(data.sites)) loadedSites.push(...data.sites);
            }
        } catch (err) {
            console.warn(`Error loading ${jsonFile}:`, err);
        }
    }
    return loadedSites;
}

async function loadAllData() {
    try {
        try {
            const siteJsonDataResponse = await fetch('sitejsondata.json');
            if (siteJsonDataResponse.ok) siteJsonData = await siteJsonDataResponse.json();
        } catch (err) {
            console.warn('sitejsondata.json error:', err);
        }

        const searchInput = document.getElementById('search');
        const currentQuery = searchInput ? searchInput.value : '';
        const normalizedQuery = normalizeText(currentQuery);
        const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 0 && !STOP_WORDS.has(term));

        let additionalSites = [];
        if (queryTerms.length > 0) {
            const matchingFiles = findMatchingJsonFiles(queryTerms);
            if (matchingFiles.length > 0) additionalSites = await loadJsonData(matchingFiles);
        }

        try {
            const sitesResponse = await fetch('sites.json');
            if (sitesResponse.ok) {
                const sitesData = await sitesResponse.json();
                if (Array.isArray(sitesData)) sites = [...additionalSites, ...sitesData];
                else if (sitesData.sites && Array.isArray(sitesData.sites)) sites = [...additionalSites, ...sitesData.sites];
                else sites = [...additionalSites];
            } else {
                sites = additionalSites;
            }
        } catch (err) {
            sites = additionalSites;
        }

        try {
            const shopsResponse = await fetch('https://database.plugetsearch.pages.dev/shops.json');
            if (shopsResponse.ok) shops = await shopsResponse.json();
        } catch (err) {
            console.warn('shops.json:', err);
        }

        try {
            const photosResponse = await fetch('https://database.plugetsearch.pages.dev/photos.json');
            if (photosResponse.ok) photos = await photosResponse.json();
        } catch (err) {
            console.warn('photos.json:', err);
        }

        initializeApp();
    } catch (err) {
        console.error("error:", err);
        const res = document.getElementById('results');
        if (res) res.innerHTML = `<div class="no-results">error: no results</div>`;
    }
}

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
            searchSites(searchInput ? searchInput.value : '');
        };
        filterContainer.appendChild(btn);
    });
}

function createCategories(lang) {
    const container = document.getElementById('siteCategories');
    if (!container || sites.length === 0) return;
    container.innerHTML = '';
    const uniqueCats = [...new Set(sites.map(s => s.c || s.category))].filter(Boolean);
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

function handleSearchInput(event) {
    const query = event.target.value;
    const normalizedQuery = normalizeText(query);
    const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 0 && !STOP_WORDS.has(term));
    
    if (queryTerms.length > 0) {
        const matchingFiles = findMatchingJsonFiles(queryTerms);
        if (matchingFiles.length > 0) {
            loadJsonData(matchingFiles).then(additionalSites => {
                const existingUrls = new Set(sites.map(s => s.u || s.url));
                const newSites = additionalSites.filter(s => !existingUrls.has(s.u || s.url));
                sites = [...newSites, ...sites];
                searchSites(query);
            });
            return;
        }
    }
    searchSites(query);
    
    const url = new URL(window.location);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    window.history.replaceState({}, '', url);
}

async function searchSites(query, category = '', lang = currentLang) {
    const resultsContainer = document.getElementById('results');
    const categoriesContainer = document.getElementById('siteCategories');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    const t = translations[lang];
    const normalizedQuery = normalizeText(query);
    const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 0 && !STOP_WORDS.has(term));
    
    let hasResults = false;
    
    // 1. ÖNCE STATİK SİTELERİ YÜKLE ve GÖSTER
    if (currentFilter === 'all' || currentFilter === 'site') {
        let filteredSites = category
            ? sites.filter(site => normalizeText(site.c || site.category) === normalizeText(category))
            : [...sites];
            
        if (queryTerms.length > 0) {
            if (categoriesContainer) categoriesContainer.style.display = 'none';
            filteredSites = filteredSites.map(site => {
                let score = 0;
                const siteTitle = normalizeText(site.t || site.title || '');
                const siteDesc = normalizeText((site.d && site.d[lang]) || (site.d && site.d.en) || site.description || "");
                const siteCat = normalizeText(t.categories[site.c || site.category] || site.c || site.category || '');
                
                queryTerms.forEach(term => {
                    if (siteTitle === term) score += 100;
                    else if (siteTitle.includes(term)) score += 50;
                    else if (siteCat.includes(term)) score += 20;
                    else if (siteDesc.includes(term)) score += 10;
                });
                return { ...site, score, resultType: 'static' };
            }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);
        } else {
            if (categoriesContainer) categoriesContainer.style.display = 'flex';
        }
        
        if (filteredSites.length > 0) {
            hasResults = true;
            filteredSites.forEach(item => renderStaticCard(item, lang, t, resultsContainer));
        }
    }
    
    // 2. SHOP SONUÇLARI
    if (currentFilter === 'all' || currentFilter === 'shop') {
        let filteredShops = [...shops];
        if (queryTerms.length > 0) {
            filteredShops = filteredShops.map(shop => {
                let score = 0;
                const shopName = normalizeText(shop.name || '');
                const shopDesc = normalizeText(shop.description || '');
                queryTerms.forEach(term => {
                    if (shopName === term) score += 100;
                    else if (shopName.includes(term)) score += 50;
                    else if (shopDesc.includes(term)) score += 10;
                });
                return { ...shop, score, resultType: 'shop' };
            }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);
        }
        
        if (filteredShops.length > 0) {
            hasResults = true;
            filteredShops.forEach(item => renderShopCard(item, lang, resultsContainer));
        }
    }
    
    // 3. PHOTOS SONUÇLARI
    if (currentFilter === 'all' || currentFilter === 'photos') {
        let filteredPhotos = [...photos];
        if (queryTerms.length > 0) {
            filteredPhotos = filteredPhotos.map(photo => {
                let score = 0;
                const photoTitle = normalizeText(photo.title || '');
                const photoDesc = normalizeText(photo.description || '');
                queryTerms.forEach(term => {
                    if (photoTitle === term) score += 100;
                    else if (photoTitle.includes(term)) score += 50;
                    else if (photoDesc.includes(term)) score += 10;
                });
                return { ...photo, score, resultType: 'photo' };
            }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);
        }
        
        if (filteredPhotos.length > 0) {
            hasResults = true;
            filteredPhotos.forEach(item => renderPhotoCard(item, lang, resultsContainer));
        }
    }
    
    // 4. WIKIPEDIA API SONUCU (statiklerden sonra)
    if ((currentFilter === 'ai' || currentFilter === 'all') && queryTerms.length > 0) {
        const filteredQuery = queryTerms.join(' ');
        const wikiResult = await fetchWikipediaResult(filteredQuery, lang);
        
        if (wikiResult) {
            hasResults = true;
            renderWikiCard({
                t: ` Wikipedia: ${wikiResult.title}`,
                c: "Global",
                d: { [lang]: wikiResult.excerpt.substring(0, 150) + '...' },
                u: wikiResult.url
            }, lang, t, resultsContainer);
        }
    }
    
    // 5. EN SON DİNAMİK SONUÇLARI GÖSTER - BAŞLIKSIZ
    if ((currentFilter === 'all' || currentFilter === 'site') && queryTerms.length > 0) {
        const dynamicResults = generateDynamicSearchResults(query, lang);
        
        if (dynamicResults.length > 0) {
            hasResults = true;
            // BAŞLIK YOK - direkt kartları render et
            dynamicResults.forEach(item => {
                renderDynamicCard(item, lang, t, resultsContainer);
            });
        }
    }
    
    // Hiç sonuç yoksa
    if (!hasResults && queryTerms.length > 0) {
        resultsContainer.innerHTML = `<div class="no-results">${t.noResults}</div>`;
    }
}

// Dinamik kart render - EN Sonda, başlıksız
function renderDynamicCard(site, lang, t, container) {
    const card = document.createElement('div');
    card.className = 'site-card dynamic-card';
    
    const categoryLabel = translations[lang].categories[site.c] || site.c;
    const desc = site.d[lang] || site.d.en;
    
    card.innerHTML = `
        <div class="dynamic-header">
            <span class="dynamic-icon">${site.icon}</span>
            <span class="dynamic-type">${site.type}</span>
        </div>
        <h2>${site.t}</h2>
        <span class="site-category">${categoryLabel}</span>
        <p>${desc}</p>
        <a href="${site.u}" target="_blank">go to →</a>
    `;
    container.appendChild(card);
}

// Wikipedia kart render
function renderWikiCard(site, lang, t, container) {
    const card = document.createElement('div');
    card.className = 'site-card wiki-card';
    card.innerHTML = `
        <div class="wiki-badge">📖 ${t.wikiTitle}</div>
        <h2>${site.t}</h2>
        <span class="site-category">${translations[lang].categories[site.c] || site.c}</span>
        <p>${site.d[lang] || site.d.en}</p>
        <a href="${site.u}" target="_blank">Wikipedia →</a>
    `;
    container.appendChild(card);
}

// Statik site kart render
function renderStaticCard(site, lang, t, container) {
    const card = document.createElement('div');
    card.className = 'site-card';
    
    const categoryLabel = translations[lang].categories[site.c || site.category] || (site.c || site.category);
    const title = site.t || site.title || '';
    const desc = (site.d && site.d[lang]) || (site.d && site.d.en) || site.description || '';
    const url = site.u || site.url || '#';
    
    card.innerHTML = `
        <h2>${title}</h2>
        <span class="site-category">${categoryLabel}</span>
        <p>${desc}</p>
        <a href="${url}" target="_blank">visit site →</a>
    `;
    container.appendChild(card);
}

// Shop kart render
function renderShopCard(shop, lang, container) {
    const card = document.createElement('div');
    card.className = 'site-card shop-card';
    
    let photosHTML = '';
    if (shop.photos && shop.photos.length > 0) {
        photosHTML = `<div class="shop-photos">${shop.photos.map(p => `<img src="${p}" alt="product" class="shop-photo">`).join('')}</div>`;
    }
    
    card.innerHTML = `
        <h2>${shop.name || ''}</h2>
        ${shop.category ? `<span class="site-category">${shop.category}</span>` : ''}
        <p>${shop.description || ''}</p>
        ${photosHTML}
        <a href="${shop.url || '#'}" target="_blank">visit shop →</a>
    `;
    container.appendChild(card);
}

// Photo kart render
function renderPhotoCard(photo, lang, container) {
    const card = document.createElement('div');
    card.className = 'site-card photo-card';
    card.innerHTML = `
        <h2>${photo.title || ''}</h2>
        <img src="${photo.image || ''}" alt="${photo.title || ''}" class="photo-image">
        <p>${photo.description || ''}</p>
        ${photo.credit ? `<small style="color: var(--text-secondary);"> ${photo.credit}</small>` : ''}
    `;
    container.appendChild(card);
}

function initializeApp() {
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = currentLang;
        languageSelect.addEventListener('change', (e) => setLanguage(e.target.value));
    }
    
    const searchInput = document.getElementById('search');
    if (searchInput) searchInput.addEventListener('keyup', handleSearchInput);
    
    setLanguage(currentLang);
    
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
        const decodedQ = decodeURIComponent(q);
        if (searchInput) searchInput.value = decodedQ;
        searchSites(decodedQ);
    }
}

const designState = {
    theme: 'dark', animationsEnabled: true, glassmorphEnabled: true,
    blurStrength: 30, transparency: 35, gradientIntensity: 100,
    glassOrbsEnabled: true, insetShadowEnabled: true, blurBackgroundEnabled: true
};

const designElements = {
    body: document.body, settingsToggle: document.getElementById('settingsToggle'),
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
        designElements.themeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.theme === savedTheme));
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
        designElements.settingsToggle.addEventListener('click', () => designElements.settingsPanel.classList.toggle('open'));
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
    if (designElements.animationSwitch) designElements.animationSwitch.addEventListener('click', toggleDesignAnimations);
    if (designElements.glassmorphSwitch) designElements.glassmorphSwitch.addEventListener('click', toggleDesignGlassmorphism);
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
    if (designElements.orbsSwitch) designElements.orbsSwitch.addEventListener('click', toggleDesignGlassOrbs);
    if (designElements.insetShadowSwitch) designElements.insetShadowSwitch.addEventListener('click', toggleDesignInsetShadow);
    if (designElements.blurBackgroundSwitch) designElements.blurBackgroundSwitch.addEventListener('click', toggleDesignBlurBackground);
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

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    const t = translations[lang];
    const searchInput = document.getElementById('search');
    if (searchInput && t) searchInput.placeholder = t.searchPlaceholder;
    createFilterButtons(lang);
    createCategories(lang);
    searchSites(searchInput?.value || '', '', lang);
}

document.addEventListener('DOMContentLoaded', () => {
    loadAllData();
    initDesignSettings();
    window.addEventListener('storage', (e) => {
        if (e.key === 'language') setLanguage(e.newValue);
        else if (e.key === 'pluget-theme') setDesignTheme(e.newValue);
    });
});