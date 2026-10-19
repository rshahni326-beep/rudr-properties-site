(() => {
  const cfg = window.RUDR_CONFIG || {};

  const cards = document.getElementById('propertyCards');
  const count = document.getElementById('listingCount');
  const message = document.getElementById('statusMessage');
  const whatsapp = document.getElementById('whatsappMain');

  document.getElementById('year').textContent = new Date().getFullYear();

  whatsapp.href =
    `https://wa.me/${cfg.WHATSAPP_NUMBER || '918887036646'}?text=${encodeURIComponent(
      'Hello RUDR PROPERTIES, I would like to enquire about a property.'
    )}`;

  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('mainNav').classList.toggle('open');
  });

  document.querySelectorAll('#mainNav a').forEach(a => {
    a.addEventListener('click', () => {
      document.getElementById('mainNav').classList.remove('open');
    });
  });

  let allProperties = [];

  const demo = [
    {
      id: 'demo-house',
      title: 'Premium Independent House',
      location: 'Gomti Nagar, Lucknow',
      price: 'Price on request',
      property_type: 'Residential',
      area: 'Spacious family home',
      description: 'A thoughtfully selected home in a sought-after Lucknow neighbourhood.',
      image_urls: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
      status: 'available'
    },
    {
      id: 'demo-plot',
      title: 'Residential Plot',
      location: 'Sultanpur Road, Lucknow',
      price: 'Price on request',
      property_type: 'Plot',
      area: 'Plot size on enquiry',
      description: 'Explore land options for your next home or investment.',
      image_urls: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80',
      status: 'available'
    },
    {
      id: 'demo-commercial',
      title: 'Commercial Space',
      location: 'Hazratganj, Lucknow',
      price: 'Price on request',
      property_type: 'Commercial',
      area: 'Shops and office enquiries',
      description: 'A commercial opportunity for your business requirements.',
      image_urls: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
      status: 'available'
    }
  ];

  function esc(value = '') {
    return String(value).replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);
  }

  function imagesFor(property) {
    const raw = property.image_urls || '';

    if (Array.isArray(raw)) {
      return raw.filter(url => /^https:\/\/[^\s"'<>]+$/i.test(url));
    }

    return String(raw)
      .split(',')
      .map(url => url.trim())
      .filter(url => /^https:\/\/[^\s"'<>]+$/i.test(url));
  }

  function whatsappLink(property) {
    const text =
      `Hello RUDR PROPERTIES, I am interested in ${property.title || 'a property'} in ${property.location || 'Lucknow'}. Please share details.`;

    return `https://wa.me/${cfg.WHATSAPP_NUMBER || '918887036646'}?text=${encodeURIComponent(text)}`;
  }

  function render(list) {
    count.textContent = `${list.length} ${list.length === 1 ? 'property' : 'properties'}`;

    if (!list.length) {
      cards.innerHTML = `
        <div class="empty-state">
          <h3>No matching properties</h3>
          <p>Try another location or property type, or contact us for help finding the right property.</p>
          <a class="text-link" href="#contact">Contact RUDR PROPERTIES ↗</a>
        </div>`;
      return;
    }

    cards.innerHTML = list.map(property => {
      const images = imagesFor(property);
      const firstImage = images[0] || '';
      const propertyType = String(property.property_type || 'Property');
      const details = [property.area, property.description].filter(Boolean).join(' · ');

      const email = cfg.CONTACT_EMAIL || 'rshahni326@gmail.com';
      const emailSubject = `Property enquiry: ${property.title || 'Property'}`;

      // Demo listings do not exist in Supabase, so their details link is omitted.
      const isDemo = String(property.id || '').startsWith('demo-');

      const viewDetailsButton = isDemo
        ? ''
        : `<a class="view-details-button" href="property-details.html?id=${encodeURIComponent(String(property.id))}">View Details</a>`;

      return `
        <article class="property-card">
          <div class="property-photo">
            ${firstImage
              ? `<img
                  src="${esc(firstImage)}"
                  alt="${esc(property.title || 'Property')}"
                  loading="lazy"
                  style="width:100%;height:220px;object-fit:cover;border-radius:8px;">`
              : ''}
            ${property.video_url
              ? `<div style="margin-top:12px;">
                  <video
                    src="${esc(property.video_url)}"
                    controls
                    playsinline
                    preload="metadata"
                    style="width:100%;max-height:320px;border-radius:10px;background:#000;">
                    Your browser does not support video playback.
                  </video>
                </div>`
              : ''}
            <span class="property-type">${esc(propertyType)}</span>
          </div>

          <div class="property-body">
            <h3>${esc(property.title || 'Property')}</h3>

            <div class="price">${esc(property.price || 'Price on request')}</div>

            <div class="property-location">
              ⌖ ${esc(property.location || 'Location on request')}
            </div>

            <div class="property-desc">
              ${esc(details || 'Contact us for more details.')}
            </div>

            <div class="card-actions">
              <a
                class="card-primary"
                href="${whatsappLink(property)}"
                target="_blank"
                rel="noopener">
                Enquire on WhatsApp ↗
              </a>

              ${viewDetailsButton}

              <a
                class="card-secondary"
                href="mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(emailSubject)}">
                Email
              </a>
            </div>
          </div>
        </article>`;
    }).join('');
  }

  function filter() {
    const location = document.getElementById('locationSearch').value.trim().toLowerCase();
    const type = document.getElementById('typeSearch').value.toLowerCase();

    const filtered = allProperties.filter(property => {
      const searchable =
        `${property.location || ''} ${property.title || ''} ${property.description || ''}`.toLowerCase();

      const locationMatches = !location || searchable.includes(location);
      const typeMatches =
        !type || String(property.property_type || '').toLowerCase() === type;

      return locationMatches && typeMatches;
    });

    render(filtered);
  }

  document.getElementById('searchForm').addEventListener('submit', event => {
    event.preventDefault();
    filter();
    document.getElementById('properties').scrollIntoView({ behavior: 'smooth' });
  });

  async function init() {
    const ready =
      cfg.SUPABASE_URL &&
      cfg.SUPABASE_PUBLISHABLE_KEY &&
      cfg.SUPABASE_URL.startsWith('https://') &&
      !cfg.SUPABASE_URL.includes('PASTE_') &&
      !cfg.SUPABASE_PUBLISHABLE_KEY.includes('PASTE_');

    if (!ready || !window.supabase) {
      allProperties = demo;
      render(allProperties);
      message.textContent =
        'Preview mode: connect your Supabase Project URL and Publishable Key to load live listings.';
      return;
    }

    try {
      const client = window.supabase.createClient(
        cfg.SUPABASE_URL,
        cfg.SUPABASE_PUBLISHABLE_KEY
      );

      const { data, error } = await client
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      allProperties = (data || []).filter(property =>
        !property.status ||
        ['available', 'active', 'for sale', 'for rent'].includes(
          String(property.status).toLowerCase()
        )
      );

      render(allProperties);

      if (!allProperties.length) {
        message.textContent =
          'No public listings found yet. Add a property from the admin panel or check the status field.';
      }
    } catch (error) {
      console.error('RUDR listings error:', error);
      allProperties = demo;
      render(allProperties);
      message.textContent =
        'Live listings could not be loaded. Showing sample preview until the Supabase connection or access policy is fixed.';
    }
  }

  init();
})();
