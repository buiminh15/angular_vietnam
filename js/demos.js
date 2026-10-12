// Các demo tương tác mô phỏng khái niệm Angular bằng JS thuần
(function () {
  window.DEMO_CLEAN = [];
  const D = window.DEMOS = {};
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const q = (r, s) => r.querySelector(s);
  const qa = (r, s) => [...r.querySelectorAll(s)];

  // ---------- Day 2 ----------
  D.bootstrap = {
    title: 'Angular khởi động như thế nào? (bấm từng bước)',
    render(r) {
      const steps = [
        ['index.html', '<app-root></app-root> chỉ là thẻ trống chờ Angular lấp đầy.'],
        ['main.ts', 'platformBrowserDynamic().bootstrapModule(AppModule) – điểm vào của ứng dụng.'],
        ['app.module.ts', '@NgModule({ declarations:[AppComponent], bootstrap:[AppComponent] }) – cho Angular biết component gốc.'],
        ['app.component.ts', "@Component({ selector:'app-root', templateUrl:'./app.component.html' }) – selector khớp với thẻ trong index.html."],
        ['app.component.html', 'Template được render vào <app-root>. Màn hình hiện nội dung!']];
      r.innerHTML = `<div id="st"></div><div class="hint" id="tx"></div><button id="nx">Bước tiếp ▶</button><button class="alt" id="rs">Làm lại</button>`;
      let i = 0;
      const draw = () => {
        q(r, '#st').innerHTML = steps.map((s, k) => `<div class="box ${k === i ? 'child' : ''}" style="opacity:${k <= i ? 1 : .35}"><b>${k + 1}. ${s[0]}</b></div>`).join('');
        q(r, '#tx').textContent = steps[i][1];
      };
      q(r, '#nx').onclick = () => { i = Math.min(i + 1, steps.length - 1); draw(); };
      q(r, '#rs').onclick = () => { i = 0; draw(); };
      draw();
    }
  };

  // ---------- Day 3 ----------
  D.binding = {
    title: 'Bốn kiểu Data Binding',
    render(r) {
      r.innerHTML = `<div class="row"><div class="col"><h5>Class (TypeScript)</h5>
        <pre>name = 'Angular';\ndisabled = false;\ncount = 0;</pre>
        <h5 style="margin-top:10px">Template</h5>
        <pre>&lt;p&gt;Xin chào {{ name }}&lt;/p&gt;                 <i>// interpolation</i>
&lt;button [disabled]="disabled"&gt;       <i>// property</i>
&lt;button (click)="count = count + 1"&gt;  <i>// event</i>
&lt;input [(ngModel)]="name"&gt;            <i>// two-way</i></pre></div>
        <div class="col"><h5>Kết quả</h5><div class="out">
        <p>1) Xin chào <b id="a"></b></p>
        <p>2) <button id="b">Nút bị khoá theo [disabled]</button> <label><input type="checkbox" id="c"> disabled</label></p>
        <p>3) <button id="d">+1</button> count = <b id="e">0</b></p>
        <p>4) <input type="text" id="f"> ↔ nhập vào đây, mọi chỗ <b>name</b> đổi theo</p></div></div></div>`;
      const s = { name: 'Angular', count: 0, disabled: false };
      const upd = () => { q(r, '#a').textContent = s.name; q(r, '#b').disabled = s.disabled; q(r, '#e').textContent = s.count; q(r, '#f').value = s.name; };
      q(r, '#c').onchange = e => { s.disabled = e.target.checked; upd(); };
      q(r, '#d').onclick = () => { s.count++; upd(); };
      q(r, '#f').oninput = e => { s.name = e.target.value; q(r, '#a').textContent = s.name; };
      upd();
    }
  };

  // ---------- Day 4 ----------
  D.ngif = {
    title: '*ngIf: gỡ hẳn khỏi DOM vs ẩn bằng CSS',
    render(r) {
      r.innerHTML = `<label><input type="checkbox" id="t" checked> isLoggedIn</label>
        <div class="row"><div class="col"><h5>&lt;div *ngIf="isLoggedIn; else guest"&gt;</h5><div class="out" id="o1"></div></div>
        <div class="col"><h5>&lt;div [hidden]="!isLoggedIn"&gt;</h5><div class="out" id="o2"><div id="hid">👋 Chào bạn (chỉ bị ẩn)</div></div></div></div>
        <div class="hint" id="dom"></div>`;
      const upd = () => {
        const v = q(r, '#t').checked;
        q(r, '#o1').innerHTML = v ? '<div>👋 Chào bạn (có trong DOM)</div>' : '<div>🔒 Hãy đăng nhập (ng-template else)</div>';
        q(r, '#hid').hidden = !v;
        q(r, '#dom').textContent = v ? 'Cả hai đều hiển thị.' : 'ngIf: phần tử "Chào bạn" đã bị XOÁ khỏi DOM. hidden: vẫn còn trong DOM, chỉ display:none (xem bằng DevTools).';
      };
      q(r, '#t').onchange = upd; upd();
    }
  };

  // ---------- Day 5 ----------
  D.ngfor = {
    title: '*ngFor và các biến cục bộ',
    render(r) {
      let items = ['Angular', 'React', 'Vue'];
      r.innerHTML = `<pre>&lt;li *ngFor="let t of items; let i = index; let f = first; let o = odd"&gt;</pre>
        <input type="text" id="in" placeholder="Thêm item"> <button id="add">Thêm</button> <button class="alt" id="rev">Đảo</button>
        <table style="width:100%;margin-top:8px;border-collapse:collapse" id="tb"></table>`;
      const draw = () => {
        q(r, '#tb').innerHTML = '<tr><th>item</th><th>index</th><th>first</th><th>last</th><th>odd</th><th></th></tr>' +
          items.map((t, i) => `<tr style="background:${i % 2 ? 'rgba(128,128,128,.12)' : 'none'}"><td>${esc(t)}</td><td>${i}</td><td>${i === 0}</td><td>${i === items.length - 1}</td><td>${i % 2 === 1}</td><td><button class="alt" data-i="${i}">✕</button></td></tr>`).join('');
        qa(r, '[data-i]').forEach(b => b.onclick = () => { items.splice(+b.dataset.i, 1); draw(); });
      };
      q(r, '#add').onclick = () => { const v = q(r, '#in').value.trim(); if (v) { items.push(v); q(r, '#in').value = ''; draw(); } };
      q(r, '#rev').onclick = () => { items.reverse(); draw(); };
      draw();
    }
  };

  // ---------- Day 6 ----------
  D.classstyle = {
    title: '[class], [style], ngClass, ngStyle',
    render(r) {
      r.innerHTML = `<div class="row"><div class="col">
        <label><input type="checkbox" id="a"> [class.active]="isActive"</label><br>
        <label><input type="checkbox" id="b"> [class.rounded]="isRound"</label><br>
        font size: <input type="range" id="c" min="12" max="40" value="18"> <b id="cv">18</b>px<br>
        màu: <input type="color" id="d" value="#dd0031"></div>
        <div class="col"><div class="out" style="display:grid;place-items:center"><span id="x">Angular</span></div><pre id="code" style="margin-top:8px"></pre></div></div>`;
      const upd = () => {
        const a = q(r, '#a').checked, b = q(r, '#b').checked, c = q(r, '#c').value, d = q(r, '#d').value, x = q(r, '#x');
        x.style.cssText = `padding:10px 20px;font-size:${c}px;color:${a ? '#fff' : d};background:${a ? d : 'transparent'};border-radius:${b ? 99 : 0}px;border:2px solid ${d};transition:.2s`;
        q(r, '#cv').textContent = c;
        q(r, '#code').textContent = `<span [class.active]="${a}" [class.rounded]="${b}"\n      [style.font-size.px]="${c}" [style.color]="'${d}'">`;
      };
      qa(r, 'input').forEach(i => i.oninput = upd); upd();
    }
  };

  // ---------- Day 7-9 ----------
  D.io = {
    title: '@Input xuống, @Output lên, [(x)] hai chiều',
    render(r) {
      r.innerHTML = `<div class="box parent"><b>Parent</b> &nbsp; value = <b id="pv">5</b>
        <div class="box child"><b>Child</b> &nbsp; <code>@Input() value</code> = <b id="cv">5</b><br>
        <button id="dec">−</button><button id="inc">+</button> <code>(click) → valueChange.emit(value ± 1)</code></div>
        Parent cũng có thể đổi: <button class="alt" id="reset">đặt về 0</button></div>
        <pre style="margin-top:8px">&lt;app-counter [(value)]="value"&gt;  =  [value]="value" (valueChange)="value = $event"</pre><div class="hint" id="log">Bấm + / − ở child và quan sát luồng dữ liệu.</div>`;
      let v = 5;
      const draw = () => { q(r, '#pv').textContent = v; q(r, '#cv').textContent = v; };
      const emit = d => { v += d; draw(); q(r, '#log').textContent = `Child emit(${v}) ⬆ Parent cập nhật value = ${v} ⬇ truyền lại vào [value] của Child`; };
      q(r, '#inc').onclick = () => emit(1); q(r, '#dec').onclick = () => emit(-1);
      q(r, '#reset').onclick = () => { v = 0; draw(); q(r, '#log').textContent = 'Parent đổi value = 0 ⬇ Child nhận qua @Input'; };
    }
  };

  // ---------- Day 13 ----------
  D.projection = {
    title: 'Content Projection: nội dung cha chui vào slot của con',
    render(r) {
      r.innerHTML = `<div class="row"><div class="col"><h5>Template của card (con)</h5><pre>&lt;div class="card"&gt;
  &lt;header&gt;&lt;ng-content select="[title]"&gt;&lt;/ng-content&gt;&lt;/header&gt;
  &lt;main&gt;&lt;ng-content&gt;&lt;/ng-content&gt;&lt;/main&gt;
  &lt;footer&gt;&lt;ng-content select="[footer]"&gt;&lt;/ng-content&gt;&lt;/footer&gt;
&lt;/div&gt;</pre></div><div class="col"><h5>Cha viết</h5>
        Tiêu đề: <input type="text" id="t" value="Xin chào"><br>Nội dung: <input type="text" id="b" value="Nội dung bất kỳ"><br>
        <label><input type="checkbox" id="f" checked> có footer</label>
        <h5 style="margin-top:8px">Kết quả</h5><div class="box child" id="o"></div></div></div>`;
      const upd = () => q(r, '#o').innerHTML = `<div style="background:rgba(221,0,49,.12);padding:4px">⬅ slot [title]: <b>${esc(q(r, '#t').value)}</b></div><div style="padding:4px">⬅ slot mặc định: ${esc(q(r, '#b').value)}</div>${q(r, '#f').checked ? '<div style="background:rgba(28,126,214,.12);padding:4px">⬅ slot [footer]: © Angular</div>' : ''}`;
      qa(r, 'input').forEach(i => i.oninput = upd); upd();
    }
  };

  // ---------- Day 15, 16 ----------
  D.di = {
    title: 'Injector tìm Service từ dưới lên (click vào component để inject)',
    render(r) {
      const nodes = { root: { n: 'Root Injector (providedIn: root)', p: null, d: 0 }, app: { n: 'AppComponent', p: 'root', d: 1 }, a: { n: 'ComponentA', p: 'app', d: 2 }, b: { n: 'ComponentB', p: 'app', d: 2 }, a1: { n: 'ChildOfA', p: 'a', d: 3 } };
      const prov = { root: true }; let sel = null;
      r.innerHTML = `<div class="row"><div class="col tree" id="tr"></div><div class="col"><h5>Điều khiển</h5>
        <p>Tick = thêm <code>providers: [LogService]</code> vào component đó.</p><div id="chk"></div><h5>Kết quả</h5><div class="out" id="res">Click một component trong cây.</div></div></div>`;
      q(r, '#chk').innerHTML = ['app', 'a', 'b', 'a1'].map(k => `<label style="display:block"><input type="checkbox" data-k="${k}"> ${nodes[k].n}</label>`).join('');
      const path = k => { const p = []; while (k) { p.push(k); k = nodes[k].p; } return p; };
      const draw = () => {
        q(r, '#tr').innerHTML = Object.keys(nodes).map(k => `<div class="node ${prov[k] ? 'has' : ''} ${sel && path(sel).includes(k) ? 'sel' : ''}" style="margin-left:${nodes[k].d * 18}px" data-k="${k}">${nodes[k].n}${prov[k] ? ` 🧩 LogService#${k}` : ''}</div>`).join('');
        qa(r, '.node').forEach(n => n.onclick = () => {
          sel = n.dataset.k; const p = path(sel), f = p.find(x => prov[x]);
          draw(); q(r, '#res').innerHTML = `Tìm: ${p.map(x => nodes[x].n.split(' ')[0]).join(' → ')}<br>Dùng instance: <b class="tag-ok">LogService#${f}</b>` + (f === 'root' ? '<br>→ singleton dùng chung toàn app' : '<br>→ instance riêng của nhánh này');
        });
      };
      qa(r, '[data-k]:not(.node)').forEach(c => c.onchange = () => { prov[c.dataset.k] = c.checked; draw(); if (sel) qa(r, '.node').find(n => n.dataset.k === sel).click(); });
      draw();
    }
  };

  // ---------- Day 18 ----------
  D.pipes = {
    title: 'Pipes: biến đổi dữ liệu khi hiển thị',
    render(r) {
      r.innerHTML = `<div class="row"><div class="col">Giá trị: <input type="number" id="n" value="1234.5678"><br>Chuỗi: <input type="text" id="s" value="angular pipes"><br>Ngày: <input type="date" id="d" value="2024-03-15"></div>
        <div class="col"><div class="out" id="o"></div></div></div>`;
      const upd = () => {
        const n = +q(r, '#n').value, s = q(r, '#s').value, d = new Date(q(r, '#d').value);
        const row = (e, v) => `<div><code>${esc(e)}</code> → <b>${esc(v)}</b></div>`;
        q(r, '#o').innerHTML = row('n | number:"1.0-2"', n.toLocaleString('en-US', { maximumFractionDigits: 2 })) + row('n | currency:"USD"', n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })) +
          row('n / 10000 | percent', (n / 10000 * 100).toFixed(0) + '%') + row('s | uppercase', s.toUpperCase()) + row('s | titlecase', s.replace(/\b\w/g, c => c.toUpperCase())) + row('s | slice:0:7', s.slice(0, 7)) +
          row('d | date:"dd/MM/yyyy"', isNaN(d) ? '' : d.toLocaleDateString('en-GB')) + row('d | date:"fullDate"', isNaN(d) ? '' : d.toLocaleDateString('en-US', { dateStyle: 'full' })) + row('obj | json', JSON.stringify({ n, s }));
      };
      qa(r, 'input').forEach(i => i.oninput = upd); upd();
    }
  };

  // ---------- Marble helpers ----------
  const W = 1800;
  const marble = (events, end, label, color) => {
    const ev = events.map(e => `<div class="m" style="left:${e.t / W * 100}%;--mc:${e.err ? '#e03131' : color || '#1c7ed6'}">${esc(e.v)}</div>`).join('');
    return `<div class="marble">${ev}${end != null ? `<div class="end" style="left:${end / W * 100}%"></div>` : ''}</div><div class="marble-label">${esc(label)}</div>`;
  };

  // ---------- Day 19-22 ----------
  const SRC = [{ t: 100, v: 1 }, { t: 250, v: 2 }, { t: 300, v: 2 }, { t: 700, v: 3 }, { t: 800, v: 4 }, { t: 1300, v: 5 }];
  const OPS = {
    'map(x => x * 10)': e => e.map(x => ({ t: x.t, v: x.v * 10 })),
    'filter(x => x % 2 === 0)': e => e.filter(x => x.v % 2 === 0),
    'take(3)': e => e.slice(0, 3),
    'skip(2)': e => e.slice(2),
    'scan((a, x) => a + x, 0)': e => { let a = 0; return e.map(x => ({ t: x.t, v: a += x.v })); },
    'distinctUntilChanged()': e => e.filter((x, i) => !i || x.v !== e[i - 1].v),
    'debounceTime(200)': e => e.filter((x, i) => !e[i + 1] || e[i + 1].t - x.t >= 200).map((x, i, a) => ({ t: x.t + 200, v: x.v })),
    'delay(300)': e => e.map(x => ({ t: x.t + 300, v: x.v })),
    'first()': e => e.slice(0, 1),
    'bufferCount(2)': e => e.reduce((a, x, i) => { if (i % 2) a.push({ t: x.t, v: `[${e[i - 1].v},${x.v}]` }); return a; }, []),
  };
  D.marble = {
    title: 'Marble diagram: chọn operator và xem dòng dữ liệu biến đổi',
    render(r) {
      r.innerHTML = `<div id="b"></div><div class="marble-label" style="margin-top:6px">Source: <code>of</code> các giá trị phát theo thời gian (trục ngang = thời gian)</div><div id="src"></div>
        <pre id="code"></pre><div id="out"></div><div class="hint">Nguồn có giá trị trùng (2, 2) và hai giá trị sát nhau (3, 4) để thấy rõ distinctUntilChanged / debounceTime.</div>`;
      let cur = Object.keys(OPS)[0];
      q(r, '#b').innerHTML = Object.keys(OPS).map(k => `<button class="alt" data-k="${k}">${k.split('(')[0]}</button>`).join('');
      const draw = () => {
        qa(r, '#b button').forEach(b => b.classList.toggle('on', b.dataset.k === cur));
        q(r, '#src').innerHTML = marble(SRC, 1600, 'source$');
        q(r, '#code').textContent = `source$.pipe(\n  ${cur}\n).subscribe(console.log)`;
        q(r, '#out').innerHTML = marble(OPS[cur](SRC), 1600 + (cur.startsWith('delay') ? 300 : 0), 'kết quả', '#2f9e44');
      };
      qa(r, '#b button').forEach(b => b.onclick = () => { cur = b.dataset.k; draw(); });
      draw();
    }
  };

  // ---------- Day 23 ----------
  D.combine = {
    title: 'Gộp 2 Observable: merge, concat, combineLatest, zip, forkJoin',
    render(r) {
      const A = [{ t: 100, v: 'a1' }, { t: 500, v: 'a2' }, { t: 900, v: 'a3' }], B = [{ t: 300, v: 'b1' }, { t: 600, v: 'b2' }];
      const endA = 1100, endB = 1000;
      const all = [...A.map(x => ({ ...x, s: 'A' })), ...B.map(x => ({ ...x, s: 'B' }))].sort((x, y) => x.t - y.t);
      const ops = {
        merge: () => ({ e: all.map(x => ({ t: x.t, v: x.v })), end: Math.max(endA, endB) }),
        concat: () => ({ e: [...A, ...B.map(x => ({ t: x.t + endA, v: x.v }))], end: endA + endB }),
        combineLatest: () => { let a, b; const e = []; all.forEach(x => { x.s === 'A' ? a = x.v : b = x.v; if (a && b) e.push({ t: x.t, v: a + b }); }); return { e, end: Math.max(endA, endB) }; },
        zip: () => ({ e: [0, 1].map(i => ({ t: Math.max(A[i].t, B[i].t), v: A[i].v + B[i].v })), end: Math.max(B[1].t, A[1].t) }),
        forkJoin: () => ({ e: [{ t: Math.max(endA, endB), v: A[2].v + B[1].v }], end: Math.max(endA, endB) }),
        withLatestFrom: () => { let b; const e = []; all.forEach(x => { if (x.s === 'B') b = x.v; else if (b) e.push({ t: x.t, v: x.v + b }); }); return { e, end: endA }; },
      };
      r.innerHTML = `<div id="b"></div>${marble(A, endA, 'A$')}${marble(B, endB, 'B$', '#e8590c')}<pre id="c"></pre><div id="o"></div>
        <div class="hint" id="h"></div>`;
      const hints = { merge: 'Phát giá trị của cả hai ngay khi có, hoàn thành khi cả hai hoàn thành.', concat: 'Chờ A xong rồi mới subscribe B.', combineLatest: 'Mỗi lần một bên phát, ghép với giá trị MỚI NHẤT của bên kia (cần cả hai đã phát ít nhất 1 lần).', zip: 'Ghép theo thứ tự: giá trị thứ i của A với thứ i của B.', forkJoin: 'Chờ cả hai hoàn thành, chỉ phát giá trị CUỐI của mỗi bên.', withLatestFrom: 'Chỉ phát khi A phát, kèm giá trị mới nhất của B.' };
      q(r, '#b').innerHTML = Object.keys(ops).map(k => `<button class="alt" data-k="${k}">${k}</button>`).join('');
      const draw = k => {
        qa(r, '#b button').forEach(b => b.classList.toggle('on', b.dataset.k === k));
        const o = ops[k](); q(r, '#c').textContent = k === 'concat' || k === 'merge' ? `${k}(A$, B$)` : `${k === 'withLatestFrom' ? 'A$.pipe(withLatestFrom(B$))' : `${k}([A$, B$])`}`;
        q(r, '#o').innerHTML = marble(o.e, o.end, 'kết quả', '#2f9e44'); q(r, '#h').textContent = hints[k];
      };
      qa(r, '#b button').forEach(b => b.onclick = () => draw(b.dataset.k)); draw('merge');
    }
  };

  // ---------- Day 25 ----------
  D.higher = {
    title: 'switchMap vs mergeMap vs concatMap vs exhaustMap',
    render(r) {
      const outer = [{ t: 100, v: 1 }, { t: 400, v: 2 }, { t: 700, v: 3 }];
      const inner = (i, s) => ['a', 'b', 'c'].map((c, k) => ({ t: s + 200 * (k + 1), v: i + c }));
      const sim = {
        switchMap: () => outer.flatMap((o, i) => inner(o.v, o.t).filter(x => !outer[i + 1] || x.t < outer[i + 1].t)),
        mergeMap: () => outer.flatMap(o => inner(o.v, o.t)),
        concatMap: () => { let free = 0; return outer.flatMap(o => { const s = Math.max(o.t, free); free = s + 600; return inner(o.v, s); }); },
        exhaustMap: () => { let free = 0; return outer.flatMap(o => { if (o.t < free) return []; free = o.t + 600; return inner(o.v, o.t); }); },
      };
      const info = { switchMap: 'Có giá trị mới là HUỶ inner cũ → hợp cho search/typeahead.', mergeMap: 'Chạy song song tất cả, thứ tự kết quả có thể xen kẽ.', concatMap: 'Xếp hàng: inner sau chờ inner trước xong → giữ thứ tự (vd: lưu tuần tự).', exhaustMap: 'Đang bận thì BỎ QUA giá trị mới → hợp cho nút submit chống bấm đúp.' };
      r.innerHTML = `<div id="b"></div>${marble(outer, 1600, 'outer$ (ví dụ: click)', '#e8590c')}<pre id="c"></pre><div id="o"></div><div class="hint" id="h"></div><div class="hint">Mỗi click gọi một inner phát 3 giá trị (ví dụ "1a, 1b, 1c") cách nhau 200ms.</div>`;
      q(r, '#b').innerHTML = Object.keys(sim).map(k => `<button class="alt" data-k="${k}">${k}</button>`).join('');
      const draw = k => {
        qa(r, '#b button').forEach(b => b.classList.toggle('on', b.dataset.k === k));
        q(r, '#c').textContent = `click$.pipe(\n  ${k}(n => http.get(n))\n)`;
        q(r, '#o').innerHTML = marble(sim[k]().sort((a, b) => a.t - b.t), null, 'kết quả', '#2f9e44'); q(r, '#h').textContent = info[k];
      };
      qa(r, '#b button').forEach(b => b.onclick = () => draw(b.dataset.k)); draw('switchMap');
    }
  };

  // ---------- Day 26 ----------
  D.subject = {
    title: 'Subject, BehaviorSubject, ReplaySubject và subscriber đến muộn',
    render(r) {
      r.innerHTML = `<div id="b"><button class="alt" data-k="Subject">Subject</button><button class="alt" data-k="BehaviorSubject">BehaviorSubject(0)</button><button class="alt" data-k="ReplaySubject">ReplaySubject(2)</button></div>
        <div style="margin:8px 0"><button id="next">next(giá trị tiếp)</button><button id="sub" class="alt">+ subscribe mới (đến muộn)</button><button id="rs" class="alt">reset</button></div>
        <div id="o"></div><div class="hint" id="h"></div>`;
      let kind, hist, subs, n;
      const hints = { Subject: 'Subscriber đến muộn KHÔNG nhận giá trị cũ.', BehaviorSubject: 'Luôn giữ giá trị hiện tại, subscriber mới nhận ngay giá trị gần nhất.', ReplaySubject: 'Phát lại N giá trị gần nhất cho subscriber mới.' };
      const reset = k => { kind = k || kind || 'Subject'; hist = kind === 'BehaviorSubject' ? [0] : []; n = kind === 'BehaviorSubject' ? 0 : 0; subs = []; draw(); };
      const replay = () => kind === 'Subject' ? [] : kind === 'BehaviorSubject' ? hist.slice(-1) : hist.slice(-2);
      const draw = () => {
        qa(r, '#b button').forEach(b => b.classList.toggle('on', b.dataset.k === kind));
        q(r, '#o').innerHTML = `<div class="box">Đã phát: ${hist.join(', ') || '(chưa có)'}</div>` + subs.map((s, i) => `<div class="box child">Subscriber ${i + 1} nhận: <b>${s.join(', ') || '(chưa nhận gì)'}</b></div>`).join('');
        q(r, '#h').textContent = hints[kind];
      };
      qa(r, '#b button').forEach(b => b.onclick = () => reset(b.dataset.k));
      q(r, '#next').onclick = () => { n++; hist.push(n); subs.forEach(s => s.push(n)); draw(); };
      q(r, '#sub').onclick = () => { subs.push(replay()); draw(); };
      q(r, '#rs').onclick = () => reset();
      reset('Subject');
    }
  };

  // ---------- Day 27-29 ----------
  D.router = {
    title: 'Router: URL ↔ component (click link, thử lazy loading)',
    render(r) {
      const routes = `[
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent,
    children: [ { path: ':id', component: DetailComponent } ] },
  { path: 'admin', loadChildren: () => import('./admin') },
  { path: '**', component: NotFoundComponent }
]`;
      r.innerHTML = `<div class="url"><span>🌐 localhost:4200</span><b id="u">/</b></div>
        <div style="margin:8px 0" id="nav"></div><div class="row"><div class="col"><h5>Routes</h5><pre>${esc(routes)}</pre></div>
        <div class="col"><h5>&lt;router-outlet&gt;</h5><div class="out" id="o"></div><div class="hint" id="log"></div></div></div>`;
      const links = ['/', '/products', '/products/7', '/admin', '/abc'];
      q(r, '#nav').innerHTML = links.map(l => `<button class="alt" data-u="${l}">routerLink="${l}"</button>`).join('');
      const loaded = new Set();
      const go = u => {
        q(r, '#u').textContent = u; let out, log = '';
        const p = u.split('/').filter(Boolean);
        if (!p.length) out = '<div class="box child">🏠 HomeComponent</div>';
        else if (p[0] === 'products') out = `<div class="box parent">📦 ProductsComponent<br>${p[1] ? `<div class="box child">🔎 DetailComponent<br><code>ActivatedRoute.params.id = ${esc(p[1])}</code></div>` : '<i>(chọn một sản phẩm: outlet con trống)</i>'}</div>`;
        else if (p[0] === 'admin') { out = '<div class="box child">🛠 AdminComponent</div>'; log = loaded.has('admin') ? 'Admin chunk đã tải trước đó, không tải lại.' : '⏳ Lazy loading: tải admin.module.js lần đầu…'; loaded.add('admin'); }
        else out = '<div class="box" style="--c:#e03131">❓ NotFoundComponent (path "**")</div>';
        q(r, '#o').innerHTML = out; q(r, '#log').textContent = log;
      };
      qa(r, '[data-u]').forEach(b => b.onclick = () => go(b.dataset.u)); go('/');
    }
  };

  // ---------- Day 30-32 ----------
  D.guard = {
    title: 'Guards: ai được vào, ai bị chặn?',
    render(r) {
      r.innerHTML = `<label><input type="checkbox" id="auth"> Đã đăng nhập</label> &nbsp; <label><input type="checkbox" id="dirty"> Form đang sửa dở (dirty)</label>
        <div style="margin:8px 0"><button data-p="/home">/home</button><button data-p="/admin">/admin (canActivate)</button><button data-p="/edit">/edit</button><button data-p="/profile">/profile (resolve)</button></div>
        <div class="url"><b id="u">/home</b></div><div class="out" id="o" style="margin-top:6px"></div><div class="hint" id="l"></div>`;
      let cur = '/home';
      const go = p => {
        const auth = q(r, '#auth').checked, dirty = q(r, '#dirty').checked; let ok = true, log = [];
        if (cur === '/edit' && p !== '/edit') { log.push(`CanDeactivate(${cur}): form ${dirty ? 'đang sửa dở → hỏi xác nhận' : 'sạch → cho rời'}`); if (dirty && !confirm('Bạn có thay đổi chưa lưu. Rời trang?')) { ok = false; log.push('Người dùng chọn ở lại'); } }
        if (ok && p === '/admin') { log.push(`CanActivate: ${auth ? 'true' : 'false → UrlTree /home'}`); if (!auth) { ok = false; cur = '/home'; q(r, '#u').textContent = '/home'; q(r, '#o').innerHTML = '🚫 Bị chuyển hướng về /home'; q(r, '#l').textContent = log.join(' → '); return; } }
        if (ok && p === '/profile') log.push('Resolve: gọi API lấy profile TRƯỚC khi hiển thị component (route.data.profile)');
        if (!ok) { q(r, '#l').textContent = log.join(' → '); return; }
        cur = p; q(r, '#u').textContent = p; q(r, '#o').innerHTML = { '/home': '🏠 Home', '/admin': '🛠 Admin (đã qua guard)', '/edit': '✏️ Trang sửa', '/profile': '👤 Profile (đã có sẵn dữ liệu)' }[p]; q(r, '#l').textContent = log.join(' → ');
      };
      qa(r, '[data-p]').forEach(b => b.onclick = () => go(b.dataset.p)); go('/home');
    }
  };

  // ---------- Day 33-36 ----------
  D.forms = {
    title: 'Form state: valid / touched / dirty và errors thay đổi theo thời gian thực',
    render(r) {
      r.innerHTML = `<div class="row"><div class="col"><form onsubmit="return false">
        <p>Email: <input type="email" id="e" placeholder="ban@vi-du.com"></p>
        <p>Mật khẩu (≥ 6 ký tự): <input type="password" id="p"></p>
        <button id="sb">Gửi</button></form><div class="hint">required, email, minlength=6</div></div>
        <div class="col"><h5>FormGroup state</h5><pre id="st"></pre></div></div>`;
      const touched = {}, dirty = {};
      const err = (id) => { const v = q(r, '#' + id).value, e = {}; if (!v) e.required = true; else if (id === 'e' && !/^\S+@\S+\.\S+$/.test(v)) e.email = true; else if (id === 'p' && v.length < 6) e.minlength = { requiredLength: 6, actualLength: v.length }; return e; };
      const upd = () => {
        const ee = err('e'), pe = err('p'), ok = !Object.keys(ee).length && !Object.keys(pe).length;
        q(r, '#st').textContent = JSON.stringify({ valid: ok, email: { valid: !Object.keys(ee).length, touched: !!touched.e, dirty: !!dirty.e, errors: Object.keys(ee).length ? ee : null }, password: { valid: !Object.keys(pe).length, touched: !!touched.p, dirty: !!dirty.p, errors: Object.keys(pe).length ? pe : null } }, null, 2);
        q(r, '#sb').disabled = !ok;
        ['e', 'p'].forEach(id => q(r, '#' + id).style.borderColor = touched[id] && Object.keys(err(id)).length ? '#e03131' : '');
      };
      ['e', 'p'].forEach(id => { q(r, '#' + id).oninput = () => { dirty[id] = 1; upd(); }; q(r, '#' + id).onblur = () => { touched[id] = 1; upd(); }; });
      upd();
    }
  };

  // ---------- Day 45 ----------
  D.unsub = {
    title: 'Memory leak: quên unsubscribe',
    render(r) {
      r.innerHTML = `<label><input type="checkbox" id="fix"> Có dọn dẹp trong ngOnDestroy (takeUntil / unsubscribe)</label>
        <div style="margin:8px 0"><button id="mk">Tạo component (subscribe interval)</button><button class="alt" id="rm">Huỷ component (ngOnDestroy)</button></div>
        <div class="box"><b>Component đang sống:</b> <span id="alive">0</span> | <b>Subscription còn chạy:</b> <span id="subs" class="tag-bad">0</span></div><div class="out" id="log" style="max-height:120px;overflow:auto;font-family:monospace;font-size:12px"></div>`;
      const list = []; let id = 0;
      const upd = () => { q(r, '#alive').textContent = list.filter(c => c.alive).length; const n = list.filter(c => c.timer).length; const s = q(r, '#subs'); s.textContent = n; s.className = n > list.filter(c => c.alive).length ? 'tag-bad' : 'tag-ok'; };
      const log = t => { const l = q(r, '#log'); l.innerHTML += esc(t) + '<br>'; l.scrollTop = 1e6; };
      q(r, '#mk').onclick = () => { const c = { id: ++id, alive: true }; c.timer = setInterval(() => log(`Component #${c.id} vẫn chạy tick…${c.alive ? '' : ' ← đã bị huỷ mà vẫn chạy (leak!)'}`), 1000); list.push(c); upd(); };
      q(r, '#rm').onclick = () => { const c = list.find(c => c.alive); if (!c) return; c.alive = false; if (q(r, '#fix').checked) { clearInterval(c.timer); c.timer = null; log(`#${c.id} ngOnDestroy → unsubscribe ✓`); } upd(); };
      window.DEMO_CLEAN.push(() => list.forEach(c => clearInterval(c.timer)));
    }
  };
})();
