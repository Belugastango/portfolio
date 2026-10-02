const LOCAL_ORIGIN = 'http://localhost:3000';
const scriptSrc = document.querySelector('script[src*="config.js"]')?.getAttribute('src') || 'js/config.js';
const PRODUCTION_MAIN_URL = new URL(scriptSrc.replace('config.js', 'main.js'), window.location.href).href;
const DEV_SESSION_KEY = 'heron-dev-mode';

async function canConnectToDevServer() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 800);

    try {
        const response = await fetch(`${LOCAL_ORIGIN}/@vite/client`, {
            cache: 'no-store',
            signal: controller.signal
        });
        return response.ok;
    } catch {
        return false;
    } finally {
        clearTimeout(timeout);
    }
}

async function loadApp() {
    const hasDevParam = new URLSearchParams(window.location.search).has('dev');
    const isDevRequested = hasDevParam || sessionStorage.getItem(DEV_SESSION_KEY) === 'true';

    if (isDevRequested && await canConnectToDevServer()) {
        sessionStorage.setItem(DEV_SESSION_KEY, 'true');
        window.__VS_DEV__ = true;
        try {
            await import(`${LOCAL_ORIGIN}/@vite/client`);
            await import(`${LOCAL_ORIGIN}/src/main.js`);
            return;
        } catch (e) {
            console.warn('[Heron] Dev server connection failed, falling back to local production bundle', e);
        }
    }

    sessionStorage.removeItem(DEV_SESSION_KEY);
    window.__VS_DEV__ = false;
    try {
        await import(PRODUCTION_MAIN_URL);
    } catch (err) {
        console.warn('[Heron] Local bundle import failed, attempting Netlify fallback', err);
        await import('https://heronai-bp.netlify.app/main.js');
    }
}

window.__HERON_APP_LOADER__ ??= loadApp().catch((error) => {
    console.error('[Heron] Failed to load application bundle.', error);
});
