(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const DAYS = window.DAYS, GROUPS = window.GROUPS, MD = window.DAYS_MD;
  const ids = Object.keys(DAYS).map(Number).sort((a, b) => a - b);
  const pad = n => String(n).padStart(3, '0');
  const groupOf = n => GROUPS.find(g => n >= g.from && n <= g.to);
  const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  let done = new Set();
  try { done = new Set(JSON.parse(localStorage.getItem('ng-done') || '[]')); } catch (e) {}
  const saveDone = () => { try { localStorage.setItem('ng-done', JSON.stringify([...done])); } catch (e) {} };

  // theme
  const setTheme = t => { document.documentElement.dataset.theme = t; try { localStorage.setItem('ng-theme', t); } catch (e) {} };
  let saved = null; try { saved = localStorage.getItem('ng-theme'); } catch (e) {}
  setTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  $('#themeBtn').onclick = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  $('#menuBtn').onclick = () => document.body.classList.toggle('menu');

  // sidebar
  function buildSidebar(filter = '') {
    const f = filter.trim().toLowerCase();
    let html = '';
    for (const g of GROUPS) {
      const items = ids.filter(n => n >= g.from && n <= g.to).filter(n => {
        if (!f) return true;
        const d = DAYS[n];
        return (`day ${n} ` + d.t + ' ' + d.s + ' ' + d.k.join(' ')).toLowerCase().includes(f) ||
          (f.length > 2 && (MD[n] || '').toLowerCase().includes(f));
      });
      if (!items.length) continue;
      html += `<div class="grp" style="--c:${g.color}"><h4>${g.name}</h4>` +
        items.map(n => `<a class="item ${done.has(n) ? 'done' : ''}" data-n="${n}" href="#/day/${n}"><span class="n">${n}</span><span>${esc(DAYS[n].t)}</span></a>`).join('') + '</div>';
    }
    $('#sidebar').innerHTML = html || '<p style="color:var(--muted)">Không tìm thấy.</p>';
    markActive();
  }
  function markActive() {
    const cur = current();
    document.querySelectorAll('.item').forEach(a => a.classList.toggle('active', +a.dataset.n === cur));
    const p = Math.round(done.size / ids.length * 100);
    $('#progBar').style.width = p + '%';
    $('#progText').textContent = `${done.size}/${ids.length} bài`;
  }
  const current = () => { const m = location.hash.match(/#\/day\/(\d+)/); return m ? +m[1] : 0; };
  $('#search').oninput = e => buildSidebar(e.target.value);
  addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); $('#search').focus(); }
    const n = current();
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' && n) { const i = ids.indexOf(n); if (ids[i + 1]) location.hash = '#/day/' + ids[i + 1]; }
    if (e.key === 'ArrowLeft' && n) { const i = ids.indexOf(n); if (ids[i - 1]) location.hash = '#/day/' + ids[i - 1]; }
  });

  // home
  function home() {
    document.title = 'Học Angular - Day 2 đến Day 48';
    let h = `<div class="hero"><h1>Học Angular qua 47 bài</h1><p>Từ Day 2 đến Day 48: nền tảng, TypeScript, RxJS, Router, Forms và thực hành. Mỗi bài có tóm tắt, demo tương tác và nội dung đầy đủ. Dùng phím ← → để chuyển bài, / để tìm kiếm.</p></div>`;
    for (const g of GROUPS) {
      h += `<h2 class="sec" style="color:${g.color}">${g.name}</h2><div class="cards" style="--c:${g.color}">`;
      for (let n = g.from; n <= g.to; n++) if (DAYS[n])
        h += `<a class="card ${done.has(n) ? 'done' : ''}" href="#/day/${n}"><span class="n">DAY ${n}${DAYS[n].demo ? ' · 🎮 demo' : ''}</span><b>${esc(DAYS[n].t)}</b><p>${esc(DAYS[n].s)}</p></a>`;
      h += '</div>';
    }
    $('#main').innerHTML = h; $('#toc').innerHTML = '';
  }

  // day page
  function day(n) {
    const d = DAYS[n], g = groupOf(n);
    if (!d) return home();
    document.title = `Day ${n}: ${d.t}`;
    const i = ids.indexOf(n), prev = ids[i - 1], next = ids[i + 1];
    let h = `<div class="dayhead" style="--c:${g.color}"><span class="tag">${g.name} · Day ${n}</span><h1>${esc(d.t)}</h1></div>
      <div class="summary" style="--c:${g.color}"><b>Tóm tắt:</b> ${esc(d.s)}<ul>${d.k.map(k => `<li>${esc(k)}</li>`).join('')}</ul></div>`;
    if (d.demo && window.DEMOS && window.DEMOS[d.demo])
      h += `<div class="panel-title">🎮 Thử ngay: ${window.DEMOS[d.demo].title}</div><div class="demo" id="demo" style="--c:${g.color}"></div>`;
    h += `<div class="panel-title">📖 Nội dung chi tiết</div><div class="md-wrap md" id="md"></div>
      <div class="mark"><button class="btn ${done.has(n) ? 'alt' : ''}" id="doneBtn">${done.has(n) ? '↩ Bỏ đánh dấu' : '✓ Đánh dấu đã học'}</button></div>
      <div class="nav2">${prev ? `<a href="#/day/${prev}"><small>← Bài trước</small>Day ${prev}: ${esc(DAYS[prev].t)}</a>` : '<span></span>'}${next ? `<a href="#/day/${next}"><small>Bài sau →</small>Day ${next}: ${esc(DAYS[next].t)}</a>` : '<span></span>'}</div>`;
    $('#main').innerHTML = h;
    if ($('#demo')) window.DEMOS[d.demo].render($('#demo'));
    renderMd(n);
    $('#doneBtn').onclick = () => { done.has(n) ? done.delete(n) : done.add(n); saveDone(); buildSidebar($('#search').value); day(n); };
  }

  function renderMd(n) {
    const el = $('#md');
    if (!window.marked) { el.innerHTML = '<pre>' + esc(MD[n]) + '</pre><p>(Cần Internet để hiển thị định dạng đẹp.)</p>'; return; }
    el.innerHTML = marked.parse(MD[n], { gfm: true, breaks: false });
    el.querySelectorAll('pre code').forEach(c => {
      if (window.hljs) { try { hljs.highlightElement(c); } catch (e) {} }
      const b = document.createElement('button'); b.className = 'copy'; b.textContent = 'Copy';
      b.onclick = () => { navigator.clipboard && navigator.clipboard.writeText(c.innerText); b.textContent = 'Đã copy'; setTimeout(() => b.textContent = 'Copy', 1200); };
      c.parentElement.appendChild(b);
    });
    el.querySelectorAll('a[href^="http"]').forEach(a => { a.target = '_blank'; a.rel = 'noopener'; });
    el.querySelectorAll('a[href^="#"]').forEach(a => a.removeAttribute('href'));
    // mục lục
    const hs = [...el.querySelectorAll('h2,h3')];
    hs.forEach((h, i) => h.id = 'h' + i);
    $('#toc').innerHTML = '<b>Trong bài này</b>' + hs.filter(h => h.tagName === 'H2').map(h => `<a href="#" data-id="${h.id}">${esc(h.textContent)}</a>`).join('');
    $('#toc').querySelectorAll('a').forEach(a => a.onclick = e => { e.preventDefault(); document.getElementById(a.dataset.id).scrollIntoView(); });
  }

  function route() {
    const n = current();
    document.body.classList.remove('menu');
    window.DEMO_CLEAN.splice(0).forEach(f => f());
    n ? day(n) : home();
    markActive();
    scrollTo(0, 0);
  }
  addEventListener('hashchange', route);
  buildSidebar();
  route();
})();
