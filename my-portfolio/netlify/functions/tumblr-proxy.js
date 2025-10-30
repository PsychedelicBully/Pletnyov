// netlify/functions/tumblr-proxy.js
exports.handler = async function(event, context) {
    // Ваш API ключ Tumblr - лучше использовать переменные окружения
    const API_KEY = process.env.TUMBLR_API_KEY || 'qtzZSMnxVflcPiFZI3fyH9HoSlpqsnHcVBmYwo40u7prEGd1X8';
    
    try {
        const { blog, limit = 20 } = event.queryStringParameters;
        
        if (!blog) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Blog parameter is required' })
            };
        }

        const url = `https://api.tumblr.com/v2/blog/${blog}/posts?api_key=${API_KEY}&limit=${limit}`;
        
        console.log('Fetching from Tumblr:', url);
        
        const response = await fetch(url);
        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};