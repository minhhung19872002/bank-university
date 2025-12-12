/**
 * Static Site Generator for HUB University
 * Generates folder-based URLs: /{category}/{slug}/index.html
 *
 * Usage: node build/build.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    baseUrl: 'https://hub.edu.vn',
    dataDir: path.join(__dirname, 'data'),
    templatesDir: path.join(__dirname, 'templates'),
    outputDir: path.join(__dirname, '..'), // Root of project
    categories: ['tin-tuyen-sinh', 'su-kien', 'dai-hoc', 'thac-si', 'tien-si']
};

/**
 * Read JSON data file
 */
function readJsonData(category) {
    const filePath = path.join(CONFIG.dataDir, `${category}.json`);
    if (!fs.existsSync(filePath)) {
        console.warn(`Warning: Data file not found: ${filePath}`);
        return [];
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}

/**
 * Read HTML template
 */
function readTemplate(category) {
    const filePath = path.join(CONFIG.templatesDir, `${category}.html`);
    if (!fs.existsSync(filePath)) {
        // Fallback to default template
        const defaultPath = path.join(CONFIG.templatesDir, 'default.html');
        if (!fs.existsSync(defaultPath)) {
            throw new Error(`Template not found: ${filePath} and no default template`);
        }
        return fs.readFileSync(defaultPath, 'utf-8');
    }
    return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Generate slug from title (Vietnamese-friendly)
 */
function generateSlug(title) {
    const vietnameseMap = {
        'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'đ': 'd',
        'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y'
    };

    return title
        .toLowerCase()
        .split('')
        .map(char => vietnameseMap[char] || char)
        .join('')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 80); // Limit slug length
}

/**
 * Replace template placeholders with data
 */
function renderTemplate(template, data, category) {
    const url = `${CONFIG.baseUrl}/${category}/${data.slug}/`;

    let html = template
        // SEO Meta
        .replace(/{{title}}/g, data.title || '')
        .replace(/{{description}}/g, data.description || '')
        .replace(/{{keywords}}/g, data.keywords || '')
        .replace(/{{canonical}}/g, url)
        .replace(/{{og_title}}/g, data.og_title || data.title || '')
        .replace(/{{og_description}}/g, data.og_description || data.description || '')
        .replace(/{{og_image}}/g, data.og_image || '')
        .replace(/{{og_url}}/g, url)

        // Content
        .replace(/{{slug}}/g, data.slug || '')
        .replace(/{{category}}/g, category)
        .replace(/{{date}}/g, data.date || '')
        .replace(/{{author}}/g, data.author || 'HUB University')
        .replace(/{{hero_image}}/g, data.hero_image || '')
        .replace(/{{featured_image}}/g, data.featured_image || '')
        .replace(/{{content}}/g, data.content || '')
        .replace(/{{excerpt}}/g, data.excerpt || '')

        // Breadcrumb
        .replace(/{{breadcrumb_category}}/g, getCategoryName(category))
        .replace(/{{breadcrumb_category_url}}/g, getCategoryUrl(category))
        .replace(/{{breadcrumb_current}}/g, data.breadcrumb || data.title || '');

    // Handle related items if present
    if (data.related && Array.isArray(data.related)) {
        const relatedHtml = data.related.map(item => `
            <article class="news-card">
                <img src="${item.image}" alt="${item.title}" class="news-card__image" />
                <h3 class="news-card__title">${item.title}</h3>
                <p class="news-card__description">${item.excerpt}</p>
            </article>
        `).join('');
        html = html.replace(/{{related_items}}/g, relatedHtml);
    } else {
        html = html.replace(/{{related_items}}/g, '');
    }

    return html;
}

/**
 * Get display name for category
 */
function getCategoryName(category) {
    const names = {
        'tin-tuyen-sinh': 'Tin tuyển sinh',
        'su-kien': 'Sự kiện',
        'dai-hoc': 'Đại học',
        'thac-si': 'Thạc sĩ',
        'tien-si': 'Tiến sĩ'
    };
    return names[category] || category;
}

/**
 * Get URL for category listing page
 */
function getCategoryUrl(category) {
    const urls = {
        'tin-tuyen-sinh': '/tin-tuyen-sinh/',
        'su-kien': '/su-kien/',
        'dai-hoc': '/dai-hoc/',
        'thac-si': '/thac-si/',
        'tien-si': '/tien-si/'
    };
    return urls[category] || `/${category}/`;
}

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * Generate pages for a category
 */
function generateCategory(category) {
    console.log(`\nGenerating pages for: ${category}`);

    const items = readJsonData(category);
    if (items.length === 0) {
        console.log(`  No items found for ${category}`);
        return [];
    }

    const template = readTemplate(category);
    const generatedPages = [];

    items.forEach(item => {
        // Generate slug if not provided
        if (!item.slug) {
            item.slug = generateSlug(item.title);
        }

        // Create output directory
        const outputDir = path.join(CONFIG.outputDir, category, item.slug);
        ensureDir(outputDir);

        // Render and write HTML
        const html = renderTemplate(template, item, category);
        const outputPath = path.join(outputDir, 'index.html');

        fs.writeFileSync(outputPath, html, 'utf-8');
        console.log(`  Created: /${category}/${item.slug}/index.html`);

        generatedPages.push({
            url: `${CONFIG.baseUrl}/${category}/${item.slug}/`,
            lastmod: item.lastmod || item.date || new Date().toISOString().split('T')[0],
            priority: item.priority || '0.7',
            changefreq: item.changefreq || 'weekly'
        });
    });

    return generatedPages;
}

/**
 * Generate sitemap.xml
 */
function generateSitemap(pages) {
    console.log('\nGenerating sitemap.xml...');

    // Add static pages
    const staticPages = [
        { url: CONFIG.baseUrl + '/', priority: '1.0', changefreq: 'daily' },
        { url: CONFIG.baseUrl + '/gioi-thieu/', priority: '0.9', changefreq: 'monthly' },
        { url: CONFIG.baseUrl + '/dai-hoc/', priority: '0.9', changefreq: 'weekly' },
        { url: CONFIG.baseUrl + '/thac-si/', priority: '0.8', changefreq: 'weekly' },
        { url: CONFIG.baseUrl + '/tien-si/', priority: '0.8', changefreq: 'weekly' },
        { url: CONFIG.baseUrl + '/quoc-te/', priority: '0.8', changefreq: 'weekly' },
        { url: CONFIG.baseUrl + '/tin-tuyen-sinh/', priority: '0.9', changefreq: 'daily' },
        { url: CONFIG.baseUrl + '/su-kien/', priority: '0.8', changefreq: 'weekly' },
        { url: CONFIG.baseUrl + '/danh-muc-thong-bao/', priority: '0.8', changefreq: 'daily' },
        { url: CONFIG.baseUrl + '/doi-song-sinh-vien/', priority: '0.7', changefreq: 'weekly' },
        { url: CONFIG.baseUrl + '/lich-su/', priority: '0.6', changefreq: 'monthly' },
        { url: CONFIG.baseUrl + '/co-so-vat-chat/', priority: '0.6', changefreq: 'monthly' }
    ];

    const allPages = [...staticPages, ...pages];
    const today = new Date().toISOString().split('T')[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod || today}</lastmod>
    <changefreq>${page.changefreq || 'weekly'}</changefreq>
    <priority>${page.priority || '0.5'}</priority>
  </url>`).join('\n')}
</urlset>`;

    const sitemapPath = path.join(CONFIG.outputDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, xml, 'utf-8');
    console.log(`Created: sitemap.xml with ${allPages.length} URLs`);
}

/**
 * Main build function
 */
function build() {
    console.log('========================================');
    console.log('HUB University Static Site Generator');
    console.log('========================================');
    console.log(`Base URL: ${CONFIG.baseUrl}`);
    console.log(`Output: ${CONFIG.outputDir}`);

    // Ensure build directories exist
    ensureDir(CONFIG.dataDir);
    ensureDir(CONFIG.templatesDir);

    // Generate all pages
    let allGeneratedPages = [];

    CONFIG.categories.forEach(category => {
        const pages = generateCategory(category);
        allGeneratedPages = allGeneratedPages.concat(pages);
    });

    // Generate sitemap
    generateSitemap(allGeneratedPages);

    console.log('\n========================================');
    console.log(`Build complete! Generated ${allGeneratedPages.length} pages.`);
    console.log('========================================');
}

// Run build
build();
