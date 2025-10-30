// script.js - Обновленная версия

const galleryEl = document.getElementById('gallery');
const filterLinks = document.querySelectorAll('nav a');
const searchInput = document.getElementById('searchInput');

let allPosts = [];
let currentFilter = 'all';

// Функция для загрузки постов через Netlify Function
async function fetchPostsFromTumblr() {
    const TUMBLR_BLOG = 'pletnyov.tumblr.com'; // ЗАМЕНИТЕ на ваш блог
    const NETLIFY_FUNCTION_URL = '/netlify/functions/tumblr-proxy.jr';
    
    galleryEl.innerHTML = '<div class="loading">Loading works...</div>';
    
    try {
        const url = `${NETLIFY_FUNCTION_URL}?blog=${encodeURIComponent(TUMBLR_BLOG)}&limit=20`;
        console.log('Fetching from Netlify function:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Tumblr data received:', data);
        
        if (data.response && data.response.posts) {
            allPosts = data.response.posts;
            console.log(`Successfully loaded ${allPosts.length} posts`);
            renderGallery(allPosts);
        } else {
            throw new Error('No posts in response');
        }
        
    } catch (error) {
        console.error('Error loading from Tumblr:', error);
        loadFallbackData();
    }
}

// Резервные данные если Tumblr не работает
function loadFallbackData() {
    const fallbackPosts = [
        {
            type: 'photo',
            photos: [{
                original_size: {
                    url: 'https://pin.it/5ovaO49lF'
                }
            }],
            tags: ['design', 'portfolio'],
            summary: 'Example Work 1'
        },
        {
            type: 'photo',
            photos: [{
                original_size: {
                    url: 'https://pin.it/4LHUDsOyK'
                }
            }],
            tags: ['web', 'development'],
            summary: 'Example Work 2'
        }
    ];
    
    allPosts = fallbackPosts;
    renderGallery(allPosts);
    console.log('Using fallback data');
}

// Отрисовка галереи
function renderGallery(posts) {
    galleryEl.innerHTML = '';

    if (!posts || posts.length === 0) {
        galleryEl.innerHTML = '<div class="no-works">No works found</div>';
        return;
    }

    posts.forEach((post, index) => {
        if (post.type !== 'photo' || !post.photos || post.photos.length === 0) {
            return; // Пропускаем посты без фото
        }

        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const photo = post.photos[0];
        const imgUrl = photo.original_size.url;
        const altText = post.summary || `Work ${index + 1}`;
        const tags = post.tags || [];

        item.innerHTML = `
            <img src="${imgUrl}" alt="${altText}" loading="lazy">
            <div class="post-info">
                <div class="tags">${tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}</div>
            </div>
        `;
        
        item.dataset.tags = tags.join(' ').toLowerCase();
        galleryEl.appendChild(item);
    });
}

// Остальной код (фильтрация) остается без изменений
function setupFiltering() {
    filterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = e.target.dataset.filter;

            filterLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');

            currentFilter = filter;
            filterPosts();
        });
    });

    searchInput.addEventListener('input', filterPosts);
}

function filterPosts() {
    let filteredPosts = allPosts;

    if (currentFilter !== 'all') {
        filteredPosts = filteredPosts.filter(post =>
            post.tags && post.tags.some(tag => 
                tag.toLowerCase() === currentFilter.toLowerCase()
            )
        );
    }

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
    fetchPostsFromTumblr();
    setupFiltering();
});