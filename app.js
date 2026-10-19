(() => {
  const cfg = window.RUDR_CONFIG || {};
  const cards = document.getElementById('propertyCards');
  const count = document.getElementById('listingCount');
  const message = document.getElementById('statusMessage');
  const whatsapp = document.getElementById('whatsappMain');
  document.getElementById('year').textContent = new Date().getFullYear();
  whatsapp.href = `https://wa.me/${cfg.WHATSAPP_NUMBER || '918887036646'}?text=${encodeURIComponent('Hello RUDR PROPERTIES, I would like to enquire about a property.')}`;
  document.getElementById('menuToggle').addEventListener('click', () => document.getElementById('mainNav').classList.toggle('open'));
  document.querySelectorAll('#mainNav a').forEach(a => a.addEventListener('click', () => document.getElementById('mainNav').classList.remove('open')));
  let allProperties = [];
  const demo = [
    {title:'Premium Independent House',location:'Gomti Nagar, Lucknow',price:'Price on request',property_type:'Residential',area:'Spacious family home',description:'A thoughtfully selected home in a sought-after Lucknow neighbourhood.',image_urls:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',status:'available'},
    {title:'Residential Plot',location:'Sultanpur Road, Lucknow',price:'Price on request',property_type:'Plot',area:'Plot size on enquiry',description:'Explore land options for your next home or investment.',image_urls:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80',status:'available'},
    {title:'Commercial Space',location:'Hazratganj, Lucknow',price:'Price on request',property_type:'Commercial',area:'Shops and office enquiries',description:'A commercial opportunity for your business requirements.',image_urls:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',status:'available'}
  ];
  function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function imagesFor(p) {
  let raw = p.image_urls || '';

  if (Array.isArray(raw)) {
    return raw.filter(url =>
      /^https:\/\/[^\s"'<>]+$/i.test(url)
    );
  }

  return String(raw)
    .split(',')
    .map(url => url.trim())
    .filter(url => /^https:\/\/[^\s"'<>]+$/i.test(url));
  }
  function whatsappLink(p){
    const txt = `Hello RUDR PROPERTIES, I am interested in ${p.title || 'a property'} in ${p.location || 'Lucknow'}. Please share details.`;
    return `https://wa.me/${cfg.WHATSAPP_NUMBER || '918887036646'}?text=${encodeURIComponent(txt)}`;
  }
  function render(list){
    count.textContent = `${list.length} ${list.length===1?'property':'properties'}`;
    if(!list.length){
      cards.innerHTML = `<div class="empty-state"><h3>No matching properties</h3><p>Try another location or property type, or contact us for help finding the right property.</p><a class="text-link" href="#contact">Contact RUDR PROPERTIES ↗</a></div>`;
      return;
    }
    cards.innerHTML = list.map(p=>{
      const imgs = imagesFor(p);
      const photoHtml = imgs.map(url => '<img src="' + esc(url) + '" alt="' + esc(p.title || 'Property') + '" loading="lazy" style="width:100%;min-width:100%;height:220px;object-fit:cover;border-radius:8px;">').join('');
      const videoHtml = p.video_url
     console.log('VIDEO DEBUG:', p.title, p.video_url);
  ? `<div style="margin-top:12px;">
       <video src="${esc(p.video_url)}"
         controls playsinline preload="metadata"
         style="width:100%;max-height:320px;border-radius:10px;background:#000;">
         Your browser does not support video playback.
       </video>
     </div>`
  : '';
      const typ=String(p.property_type||'Property');
      const details=[p.area,p.description].filter(Boolean).join(' · ');
      return `<article class="property-card"><div class="property-photo">${imgs.length ? `<div style="display:flex;gap:8px;overflow-x:auto;">${photoHtml}</div>` : ''}
${videoHtml}<span class="property-type">${esc(typ)}</span></div><div class="property-body"><h3>${esc(p.title||'Property')}</h3><div class="price">${esc(p.price||'Price on request')}</div><div class="property-location">⌖ ${esc(p.location||'Location on request')}</div><div class="property-desc">${esc(details||'Contact us for more details.')}</div><div class="card-actions"><a class="card-primary" href="${whatsappLink(p)}" target="_blank" rel="noopener">Enquire on WhatsApp ↗</a><a class="card-secondary" href="mailto:${encodeURIComponent(cfg.CONTACT_EMAIL||'rshahni326@gmail.com')}?subject=${encodeURIComponent('Property enquiry: '+(p.title||'Property'))}">Email</a></div></div></article>`;
    }).join('');
  }
  function filter(){
    const loc=document.getElementById('locationSearch').value.trim().toLowerCase();
    const type=document.getElementById('typeSearch').value.toLowerCase();
    render(allProperties.filter(p=>(!loc||`${p.location||''} ${p.title||''} ${p.description||''}`.toLowerCase().includes(loc))&&(!type||String(p.property_type||'').toLowerCase()===type)));
  }
  document.getElementById('searchForm').addEventListener('submit',e=>{e.preventDefault();filter();document.getElementById('properties').scrollIntoView({behavior:'smooth'});});
  async function init(){
    const ready=cfg.SUPABASE_URL && cfg.SUPABASE_PUBLISHABLE_KEY && cfg.SUPABASE_URL.startsWith('https://') && !cfg.SUPABASE_URL.includes('PASTE_') && !cfg.SUPABASE_PUBLISHABLE_KEY.includes('PASTE_');
    if(!ready || !window.supabase){
      allProperties=demo; render(allProperties);
      message.textContent='Preview mode: connect your Supabase Project URL and Publishable Key to load live listings.';
      return;
    }
    try{
      const client=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY);
      const {data,error}=await client.from('properties').select('*').order('created_at',{ascending:false});
      if(error) throw error;
      allProperties=(data||[]).filter(p=>!p.status || ['available','active','for sale','for rent'].includes(String(p.status).toLowerCase()));
      render(allProperties);
      if(!allProperties.length) message.textContent='No public listings found yet. Add a property from the admin panel or check the status field.';
    }catch(err){
      console.error('RUDR listings error:',err);
      allProperties=demo; render(allProperties);
      message.textContent='Live listings could not be loaded. Showing sample preview until the Supabase connection or access policy is fixed.';
    }
  }
  init();
})();
