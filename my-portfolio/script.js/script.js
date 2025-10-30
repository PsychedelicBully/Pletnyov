// Конфигурация - ОБЯЗАТЕЛЬНО ЗАМЕНИТЕ эти значения!
const TUMBLR_BLOG = 'schnaider.cc'; // Пример, замените на ваш блог
const API_KEY = 'qtzZSMnxVflcPiFZI3fyH9HoSlpqsnHcVBmYwo40u7prEGd1X8'; // Ваш настоящий API ключ
const API_URL = `https://api.tumblr.com/v2/blog/${TUMBLR_BLOG}/posts?api_key=${API_KEY}&limit=20`;

// Элементы DOM
const galleryEl = document.getElementById('gallery');
const filterLinks = document.querySelectorAll('nav a');
const searchInput = document.getElementById('searchInput');

// Переменные состояния
let allPosts = [];
let currentFilter = 'all';

// Загружаем посты из Tumblr
async function fetchPosts() {
    galleryEl.innerHTML = '<div class="loading">Loading works from Tumblr...</div>';
    
    try {
        console.log('Fetching from:', API_URL);
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Tumblr API response:', data);

        if (data.meta.status === 200) {
            allPosts = data.response.posts;
            console.log(`Loaded ${allPosts.length} posts`);
            renderGallery(allPosts);
        } else {
            throw new Error(`API error: ${data.meta.msg}`);
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
        galleryEl.innerHTML = `
            <div class="error">
                <p>Sorry, failed to load works.</p>
                <p>Error: ${error.message}</p>
                <p>Check console for details.</p>
            </div>
        `;
    }
}

// Отрисовываем галерею
function renderGallery(posts) {
    galleryEl.innerHTML = '';

    if (posts.length === 0) {
        galleryEl.innerHTML = '<div class="no-works">No works found matching your criteria.</div>';
        return;
    }

    posts.forEach(post => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        let mediaContent = '';
        let tags = post.tags || [];

        console.log('Processing post:', post.type, post);

        // Обрабатываем фото-посты
        if (post.type === 'photo' && post.photos && post.photos.length > 0) {
            const photo = post.photos[0];
            const imgUrl = photo.original_size.url;
            const altText = post.summary || post.caption || 'Portfolio work';
            
            mediaContent = `
                <img src="${imgUrl}" alt="${altText}" loading="lazy">
                <div class="post-info">
                    <div class="tags">${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
                </div>
            `;
        }
        // Обрабатываем видео-посты
        else if (post.type === 'video' && post.video_url) {
            mediaContent = `
                <video controls muted preload="metadata">
                    <source src="${post.video_url}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <div class="post-info">
                    <div class="tags">${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
                </div>
            `;
        }
        // Пропускаем посты без медиа
        else {
            console.log('Skipping post - no media found:', post.type);
            return;
        }

        item.innerHTML = mediaContent;
        // Сохраняем теги в data-атрибут для фильтрации
        item.dataset.tags = tags.join(' ').toLowerCase();
        galleryEl.appendChild(item);
    });
}

// Фильтрация по тегам
function setupFiltering() {
    filterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = e.target.dataset.filter;

            // Обновляем активный класс
            filterLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');

            currentFilter = filter;
            filterPosts();
        });
    });

    // Поиск по вводу текста
    searchInput.addEventListener('input', filterPosts);
}

// Основная функция фильтрации
function filterPosts() {
    let filteredPosts = allPosts;

    // Фильтр по навигации (All, Design, Video)
    if (currentFilter !== 'all') {
        filteredPosts = filteredPosts.filter(post =>
            post.tags && post.tags.some(tag => 
                tag.toLowerCase() === currentFilter.toLowerCase()
            )
        );
    }

    // Фильтр по поисковому запросу
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        filteredPosts = filteredPosts.filter(post =>
            post.tags && post.tags.some(tag => 
                tag.toLowerCase().includes(searchTerm)
            )
        );
    }

    renderGallery(filteredPosts);
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    fetchPosts();
    setupFiltering();
});