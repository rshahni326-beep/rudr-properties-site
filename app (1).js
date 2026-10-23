(() => {
  const cfg = window.RUDR_CONFIG || {};
  const $ = id => document.getElementById(id);

  const cards = $('propertyCards');
  const count = $('listingCount');
  const message = $('statusMessage');
  const whatsapp = $('whatsappMain');

  if ($('year')) $('year').textContent = new Date().getFullYear();

  const WA = cfg.WHATSAPP_NUMBER || '918887036646';
  if (whatsapp) {
    whatsapp.href = `https://wa.me/${WA}?text=${encodeURIComponent(
      'Hello RUDR PROPERTIES, I would like to enquire about a property.'
    )}`;
  }

  const mainNav = $('mainNav');
  if ($('menuToggle') && mainNav) {
    $('menuToggle').addEventListener('click', () => mainNav.classList.toggle('open'));
    mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));
  }

  let allProperties = [];

  /* ---------- Scroll reveal ---------- */
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('show');
            io.unobserve(e.target);
            setTimeout(() => { e.target.style.transitionDelay = '0ms'; }, 1400);
          }
        });
      }, { threshold: 0.15 })
    : null;

  function observeReveals() {
    document.querySelectorAll('.reveal:not(.show)').forEach(el => {
      if (io) io.observe(el); else el.classList.add('show');
    });
  }
  observeReveals();
  setTimeout(() => document.querySelectorAll('.reveal:not(.show)').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight) el.classList.add('show');
  }), 2500);

  /* ---------- Navbar on scroll ---------- */
  const topbar = document.querySelector('.topbar');
  if (topbar) addEventListener('scroll', () => topbar.classList.toggle('scrolled', scrollY > 40), { passive: true });

  /* ---------- Customer Login link ---------- */
  if (mainNav) {
    let loginLink = mainNav.querySelector('a[href*="customer-login"]') || $('loginLink');
    if (!loginLink) {
      loginLink = document.createElement('a');
      loginLink.href = 'customer-login.html';
      loginLink.textContent = 'Customer Login';
      mainNav.insertBefore(loginLink, mainNav.querySelector('.nav-cta'));
    }
    loginLink.id = 'loginLink';
  }

  /* ---------- Listings ---------- */
  const demo = [
    {
      id: 'demo-house', title: 'Premium Independent House', location: 'Gomti Nagar, Lucknow',
      price: 'Price on request', property_type: 'Residential', area: 'Spacious family home',
      description: 'A thoughtfully selected home in a sought-after Lucknow neighbourhood.',
      image_urls: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
      status: 'available'
    },
    {
      id: 'demo-plot', title: 'Residential Plot', location: 'Sultanpur Road, Lucknow',
      price: 'Price on request', property_type: 'Plot', area: 'Plot size on enquiry',
      description: 'Explore land options for your next home or investment.',
      image_urls: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80',
      status: 'available'
    },
    {
      id: 'demo-commercial', title: 'Commercial Space', location: 'Hazratganj, Lucknow',
      price: 'Price on request', property_type: 'Commercial', area: 'Shops and office enquiries',
      description: 'A commercial opportunity for your business requirements.',
      image_urls: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
      status: 'available'
    }
  ];

  function esc(value = '') {
    return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  function imagesFor(property) {
    const raw = property.image_urls || '';
    const list = Array.isArray(raw) ? raw : String(raw).split(',');
    return list.map(u => String(u).trim()).filter(u => /^https:\/\/[^\s"'<>]+$/i.test(u));
  }

  function whatsappLink(property) {
    const text = `Hello RUDR PROPERTIES, I am interested in ${property.title || 'a property'} in ${property.location || 'Lucknow'}. Please share details.`;
    return `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
  }

  function statusLabelFor(status) {
    if (status === 'sold') return 'SOLD';
    if (['rental', 'rent', 'for rent', 'rented'].includes(status)) return 'FOR RENT';
    if (status === 'under offer') return 'UNDER OFFER';
    if (status === 'pending') return 'PENDING';
    if (['active', 'available', 'for sale'].includes(status)) return 'AVAILABLE';
    return status.toUpperCase();
  }

  function render(list) {
    if (!cards) return;
    if (count) count.textContent = `${list.length} ${list.length === 1 ? 'property' : 'properties'}`;

    if (!list.length) {
      cards.innerHTML = `
        <div class="empty-state">
          <h3>No matching properties</h3>
          <p>Try another location or property type, or contact us for help finding the right property.</p>
          <a class="text-link" href="#contact">Contact RUDR PROPERTIES ↗</a>
        </div>`;
      return;
    }

    cards.innerHTML = list.map((property, i) => {
      const firstImage = imagesFor(property)[0] || '';
      const propertyType = String(property.property_type || 'Property');
      const status = String(property.status || 'available').trim().toLowerCase();
      const details = [property.area, property.description].filter(Boolean).join(' · ');
      const email = cfg.CONTACT_EMAIL || 'rudrpropertieslko@gmail.com';
      const emailSubject = `Property enquiry: ${property.title || 'Property'}`;
      const isDemo = String(property.id || '').startsWith('demo-');
      const viewDetailsButton = isDemo ? '' :
        `<a class="view-details-button" href="property-details.html?id=${encodeURIComponent(String(property.id))}">View Details</a>`;

      return `
        <article class="property-card reveal" style="transition-delay:${Math.min(i, 5) * 90}ms">
          <div class="property-photo">
            <span class="status-badge ${esc(status)}">${esc(statusLabelFor(status))}</span>
            ${firstImage ? `<img src="${esc(firstImage)}" alt="${esc(property.title || 'Property')}" loading="lazy"
                  style="width:100%;height:220px;object-fit:cover;border-radius:8px;">` : ''}
            ${property.video_url ? `<div style="margin-top:12px;">
                  <video src="${esc(property.video_url)}" controls playsinline preload="metadata"
                    style="width:100%;max-height:320px;border-radius:10px;background:#000;">
                    Your browser does not support video playback.
                  </video></div>` : ''}
            <span class="property-type">${esc(propertyType)}</span>
          </div>
          <div class="property-body">
            <h3>${esc(property.title || 'Property')}</h3>
            <div class="price">${esc(property.price || 'Price on request')}</div>
            <div class="property-location">⌖ ${esc(property.location || 'Location on request')}</div>
            <div class="property-desc">${esc(details || 'Contact us for more details.')}</div>
            <div class="card-actions">
              <a class="card-primary" href="${whatsappLink(property)}" target="_blank" rel="noopener">Enquire on WhatsApp ↗</a>
              ${viewDetailsButton}
              <a class="card-secondary" href="mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(emailSubject)}">Email</a>
            </div>
          </div>
        </article>`;
    }).join('');

    observeReveals();
  }

  function filter() {
    const location = ($('locationSearch').value || '').trim().toLowerCase();
    const type = ($('typeSearch').value || '').toLowerCase();
    render(allProperties.filter(property => {
      const searchable = `${property.location || ''} ${property.title || ''} ${property.description || ''}`.toLowerCase();
      return (!location || searchable.includes(location)) &&
             (!type || String(property.property_type || '').toLowerCase() === type);
    }));
  }

  if ($('searchForm')) {
    $('searchForm').addEventListener('submit', event => {
      event.preventDefault();
      filter();
      $('properties').scrollIntoView({ behavior: 'smooth' });
    });
  }

  function showDemo(text) {
    allProperties = demo;
    render(allProperties);
    if (message) message.textContent = text;
  }

  async function init() {
    const ready = cfg.SUPABASE_URL && cfg.SUPABASE_PUBLISHABLE_KEY &&
      cfg.SUPABASE_URL.startsWith('https://') &&
      !cfg.SUPABASE_URL.includes('PASTE_') && !cfg.SUPABASE_PUBLISHABLE_KEY.includes('PASTE_');

    if (!ready || !window.supabase) {
      showDemo('Preview mode: connect your Supabase Project URL and Publishable Key to load live listings.');
      return;
    }

    try {
      const client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_PUBLISHABLE_KEY);

      // Signed-in customer: link becomes "Customer Logout"
      client.auth.getSession().then(({ data }) => {
        const link = $('loginLink');
        if (data && data.session && link) {
          link.textContent = 'Customer Logout';
          link.href = '#';
          link.dataset.signedIn = '1';
          link.addEventListener('click', async e => {
            e.preventDefault();
            await client.auth.signOut();
            location.reload();
          });
        }
      }).catch(() => {});

      const { data, error } = await client.from('properties').select('*').order('created_at', { ascending: false });
      if (error) throw error;

      const allowed = ['available', 'active', 'for sale', 'for rent', 'rental', 'rent', 'sold', 'rented', 'under offer', 'pending'];
      allProperties = (data || []).filter(p => !p.status || allowed.includes(String(p.status).toLowerCase()));
      render(allProperties);

      if (!allProperties.length && message) {
        message.textContent = 'No public listings found yet. Add a property from the admin panel or check the status field.';
      }
    } catch (error) {
      console.error('RUDR listings error:', error);
      showDemo('Live listings could not be loaded. Showing sample preview until the Supabase connection or access policy is fixed.');
    }
  }

  init();
})();

/* ===== Customer login overlay: main page behind, login on top ===== */
(() => {
  let box = null;
  const st = document.createElement('style');
  st.textContent = `
    #loginOverlay{position:fixed;inset:0;z-index:9999;background:rgba(6,7,6,.72);
      -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);opacity:0;transition:opacity .35s}
    #loginOverlay.show{opacity:1}
    #loginOverlay iframe{width:100%;height:100%;border:0;background:transparent;color-scheme:normal}
    #loginOverlay .lo-close{position:absolute;top:14px;right:14px;z-index:2;width:42px;height:42px;
      border-radius:50%;border:1px solid rgba(214,173,96,.5);background:rgba(16,17,15,.7);
      color:#f1d28f;font-size:24px;line-height:1;cursor:pointer}
  `;
  document.head.appendChild(st);

  function openLogin() {
    if (box) return;
    box = document.createElement('div');
    box.id = 'loginOverlay';
    box.innerHTML = '<button class="lo-close" aria-label="Close">×</button><iframe src="customer-login.html?v=1" title="Customer Login"></iframe>';
    box.querySelector('.lo-close').addEventListener('click', closeLogin);
    document.body.appendChild(box);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => box.classList.add('show'));
  }
  function closeLogin() {
    if (!box) return;
    const b = box; box = null;
    b.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(() => b.remove(), 350);
  }
  document.addEventListener('click', e => {
    const l = e.target.closest('#loginLink');
    if (!l || l.dataset.signedIn) return;
    e.preventDefault();
    const nav = document.getElementById('mainNav');
    if (nav) nav.classList.remove('open');
    openLogin();
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeLogin(); });
  addEventListener('message', e => {
    if (e.origin === location.origin && e.data === 'rudr-close') closeLogin();
  });
})();

/* ===== Hero reveal: nav -> eyebrow -> h1 -> lede -> button -> note -> badge ===== */
(() => {
  const hero = document.querySelector('.hero');
  if (!hero || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const REVEAL_AFTER = 0.5; // seconds after page load

  const targets = [
    document.querySelector('.topbar'),
    hero.querySelector('.eyebrow'),
    hero.querySelector('h1'),
    hero.querySelector('.hero-copy'),
    hero.querySelector('.gold-button'),
    hero.querySelector('.hero-note'),
    hero.querySelector('.hero-badge')
  ].filter(Boolean);

  targets.forEach((el, i) => { el.classList.add('rv'); el.style.setProperty('--d', i); });

  let done = false;
  const reveal = () => {
    if (done) return; done = true;
    document.documentElement.classList.add('is-revealed');
    setTimeout(() => targets.forEach(el => {
      el.classList.remove('rv'); el.style.removeProperty('--d');
    }), 900 + targets.length * 90 + 300);
  };

  const start = () => setTimeout(reveal, REVEAL_AFTER * 1000);
  document.readyState === 'complete' ? start() : addEventListener('load', start);
  setTimeout(reveal, 4000); // never leave the hero blank
})();
