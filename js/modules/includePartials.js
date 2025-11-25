export async function includePartials() {
    const nodes = document.querySelectorAll('[data-include]');
    await Promise.all([...nodes].map(async (el) => {
        const src = el.getAttribute('data-include');
        const res = await fetch(src, { cache: 'no-store' });
        if (res.ok) el.outerHTML = await res.text();
    }));
}