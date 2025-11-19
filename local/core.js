function normalizeText(text) {
    if (!text)
        return '';
    let normalized = text.toLowerCase().trim();
    normalized = normalized.normalize("NFD");
    normalized = normalized.replace(/[\u0300-\u036f]/g, "");
    normalized = normalized.replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ə/g, 'e');
    return normalized;
}

const STOP_WORDS = new Set(["ve", "bir", "mi", "mı", "mu", "mü", "ki", "da", "de", "için", "gibi", "hakkında", "ile", "ama", "fakat", "lakin", "çünkü", "eğer", "her", "tüm", "çok", "daha", "en", "bu", "o", "şu", "ben", "sen", "biz", "siz", "onlar", "yazıp", "deneme", "makale", "alt", "gitmek", "bunu", "onu", "şunu", "yaz", "in", "on", "at", "by", "for", "with", "from", "to", "of", "the", "a", "an"]);

const translations = {
    en: {
        searchPlaceholder: "Search...",
        noResults: "No results found for your search.",
        addCookie: "Add Cookie",
        settings: "Videos",
        news: "News",
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
        searchPlaceholder: "Axtarış edin...",
        noResults: "Axtarışınıza uyğun nəticə tapılmadı.",
        addCookie: "Kuki Əlavə Et",
        settings: "Videolar",
        news: "Xəbərlər",
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
        searchPlaceholder: "Ara...",
        noResults: "Aramanıza uygun sonuç bulunamadı.",
        addCookie: "Çerez Ekle",
        settings: "Videolar",
        news: "Haberler",
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

const sites = [
   
];

let currentLang = "en";

function updateUI(lang) {
    const t = translations[lang];

    const searchInput = document.getElementById('search');
    if (searchInput)
        searchInput.placeholder = t.searchPlaceholder;

    const addCookieBtn = document.getElementById('addCookieBtn');
    if (addCookieBtn)
        addCookieBtn.textContent = t.addCookie;

    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn)
        settingsBtn.textContent = t.settings;

    const newsBtn = document.getElementById('newsBtn');
    if (newsBtn)
        newsBtn.textContent = t.news;

    createCategories(lang);

    const currentQuery = searchInput ? searchInput.value.trim() : '';
    searchSites(currentQuery, '', lang);
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    updateUI(lang);
}

function searchSites(query, category='', lang=currentLang) {
    const resultsContainer = document.getElementById('results');
    const categoriesContainer = document.getElementById('siteCategories');

    if (!resultsContainer || !categoriesContainer)
        return;

    resultsContainer.innerHTML = '';
    const t = translations[lang];

    const rawQuery = query.trim();
    const normalizedQuery = normalizeText(rawQuery);

    const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 0 && !STOP_WORDS.has(term));

    let sitesToSearch = sites;
    let filteredSites = [];

    if (category) {
        sitesToSearch = sites.filter(site => normalizeText(site.category) === normalizeText(category));
    }

    if (rawQuery.length > 0) {
        categoriesContainer.style.display = 'none';
    } else {
        categoriesContainer.style.display = 'flex';
    }

    sitesToSearch.forEach(site => {
        let score = 0;

        // Yalnızca geçerli arama terimleri varsa puanlama yap
        if (queryTerms.length > 0) {

            const siteTitleNormalized = normalizeText(site.title);

            // Phrase Matching (Yan Yana Kelime Eşleşmesi)
            if (queryTerms.length > 1 && siteTitleNormalized.includes(normalizedQuery)) {
                score += 10;
            }

            const searchFields = [{
                text: siteTitleNormalized,
                weight: 3
            }, {
                text: normalizeText(t.categories[site.category] || site.category),
                weight: 2
            }, {
                text: normalizeText(site.description[lang] || site.description.en),
                weight: 1
            }];

            queryTerms.forEach(term => {
                searchFields.forEach(field => {
                    if (field.text.includes(term)) {

                        if (field.text.split(/\s+/).includes(term)) {
                            score += field.weight * 2;
                        } else {
                            score += field.weight * 0.8;
                        }

                        if (field.text.startsWith(term)) {
                            score += 1.5;
                        }

                        if (field.weight === 3 && field.text === term) {
                            score += 5;
                        }
                    }
                }
                );
            }
            );
        }

        // Sorgu yoksa (kategori araması veya ana liste) veya puan > 0 ise göster
        if (queryTerms.length === 0 || score > 0) {
            filteredSites.push({
                ...site,
                score: score
            });
        }
    }
    );

    if (queryTerms.length > 0) {
        filteredSites.sort( (a, b) => b.score - a.score);
    }

    if (filteredSites.length === 0) {
        resultsContainer.innerHTML = `<p style="text-align: center; margin-top: 30px; color: var(--text-color);">${t.noResults}</p>`;
        return;
    }

    filteredSites.forEach(site => {
        const card = document.createElement('div');
        card.className = 'site-card';
        const categoryDisplay = t.categories[site.category] || site.category;

        card.innerHTML = `
          <h2>${site.title}</h2>
          <p class="site-category">${categoryDisplay}</p>
          <p>${site.description[lang] || site.description.en}</p> 
          <a href="${site.url}" target="_blank">open</a>
        `;
        resultsContainer.appendChild(card);
    }
    );
}

function handleSearchInput(event) {
    const searchInput = document.getElementById('search');
    if (!searchInput)
        return;

    const query = searchInput.value.trim();

    searchSites(query, '', currentLang);

    if (event.key === 'Enter' && query) {
        window.open(`https://contextsearch.pages.dev?q=${encodeURIComponent(query)}`, '_blank');
        window.open(`https://contextsearch.pages.dev?q=${encodeURIComponent(query)}`, '_blank');

        const newUrl = new URL(window.location.origin + window.location.pathname);
        newUrl.searchParams.set('q', encodeURIComponent(query));
        window.history.pushState({
            path: newUrl.href
        }, '', newUrl.href);
    } else if (event.key !== 'Enter') {
        if (query === '') {
            const newUrl = new URL(window.location.origin + window.location.pathname);
            window.history.pushState({
                path: newUrl.href
            }, '', newUrl.href);
        } else {
            const newUrl = new URL(window.location.origin + window.location.pathname);
            newUrl.searchParams.set('q', encodeURIComponent(query));
            window.history.replaceState({
                path: newUrl.href
            }, '', newUrl.href);
        }
    }
}

function searchByCategory(categoryOriginalName) {
    const searchInput = document.getElementById('search');
    const categoriesContainer = document.getElementById('siteCategories');

    if (searchInput)
        searchInput.value = '';

    if (categoriesContainer)
        categoriesContainer.style.display = 'flex';

    searchSites('', categoryOriginalName, currentLang);

    const newUrl = new URL(window.location.origin + window.location.pathname);
    window.history.pushState({
        path: newUrl.href
    }, '', newUrl.href);
}

function createCategories(lang=currentLang) {
    const categoriesContainer = document.getElementById('siteCategories');
    if (!categoriesContainer)
        return;

    categoriesContainer.innerHTML = '';
    const uniqueCategoriesOriginal = [...new Set(sites.map(site => site.category))];

    uniqueCategoriesOriginal.forEach(categoryOriginalName => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.textContent = translations[lang].categories[categoryOriginalName] || categoryOriginalName;
        categoryItem.onclick = () => searchByCategory(categoryOriginalName);
        categoriesContainer.appendChild(categoryItem);
    }
    );
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

function displaySites(sitesList) {
    const resultsContainer = document.getElementById('results');
    const categoriesContainer = document.getElementById('siteCategories');
    if (!resultsContainer || !categoriesContainer)
        return;

    resultsContainer.innerHTML = '';
    categoriesContainer.style.display = 'flex';

    sitesList.forEach(site => {
        const card = document.createElement('div');
        card.className = 'site-card';
        const categoryDisplay = translations[currentLang].categories[site.category] || site.category;

        card.innerHTML = `
            <h2>${site.title}</h2>
            <p class="site-category">${categoryDisplay}</p>
            <p>${site.description}</p> 
            <a href="${site.url}" target="_blank">open</a>
        `;
        resultsContainer.appendChild(card);
    }
    );
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }

    const langSelect = document.getElementById('language-select');
    const savedLang = localStorage.getItem('language') || 'en';
    if (langSelect)
        langSelect.value = savedLang;
    setLanguage(savedLang);

    const urlParams = new URLSearchParams(window.location.search);
    const queryFromUrl = urlParams.get('q');
    const searchInput = document.getElementById('search');

    if (queryFromUrl) {
        if (searchInput) {
            const decodedQuery = decodeURIComponent(queryFromUrl);
            searchInput.value = decodedQuery;
            searchSites(decodedQuery, '', currentLang);
        }
    } else {
        displaySites(sites.map(site => ({
            ...site,
            description: site.description[currentLang] || site.description.en
        })));
    }
}
);

window.addEventListener('popstate', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryFromUrl = urlParams.get('q');
    const searchInput = document.getElementById('search');

    if (queryFromUrl) {
        if (searchInput) {
            const decodedQuery = decodeURIComponent(queryFromUrl);
            searchInput.value = decodedQuery;
            searchSites(decodedQuery, '', currentLang);
        }
    } else {
        if (searchInput)
            searchInput.value = '';
        displaySites(sites.map(site => ({
            ...site,
            description: site.description[currentLang] || site.description.en
        })));
    }
}
);