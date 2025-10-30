// config.js - вынесем конфигурацию отдельно
const CONFIG = {
    TUMBLR_BLOG: 'pletnyov.tumblr.com', // ЗАМЕНИТЕ на ваше имя блога
    API_KEY: 'qtzZSMnxVflcPiFZI3fyH9HoSlpqsnHcVBmYwo40u7prEGd1X8', // ЗАМЕНИТЕ на ваш API ключ
};

// Формируем URL для API запроса
function getApiUrl() {
    return `https://api.tumblr.com/v2/blog/${CONFIG.TUMBLR_BLOG}/posts?api_key=${CONFIG.API_KEY}&limit=20`;
}