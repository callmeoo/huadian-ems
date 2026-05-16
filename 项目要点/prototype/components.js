/**
 * 共享交互组件
 *
 * DateRangePicker  — 日期区间选择器（底部弹窗日历）
 * BottomSheetSelect — 底部弹出单选列表
 */

/* ============================================================
   DateRangePicker
   用法：
     const picker = new DateRangePicker({
       triggerEl:    document.getElementById('datePill'),
       labelEl:      document.getElementById('dateLabel'),
       initialStart: '2026-05-01',
       initialEnd:   '2026-05-07',
       onConfirm:    (start, end, label) => { ... }
     });
   ============================================================ */
class DateRangePicker {
  constructor(opts = {}) {
    this.labelEl      = opts.labelEl || null;
    this.onConfirm    = opts.onConfirm || null;
    this.maxDate      = opts.maxDate || new Date();  // 默认不能选未来

    this.startDate = null;
    this.endDate   = null;
    this.viewYear  = 0;
    this.viewMonth = 0;

    if (opts.initialStart) this._parseInto('start', opts.initialStart);
    if (opts.initialEnd)   this._parseInto('end',   opts.initialEnd);

    // 默认视图：定位到 start 所在月份，或当前月
    const anchor = this.startDate || new Date();
    this.viewYear  = anchor.getFullYear();
    this.viewMonth = anchor.getMonth();

    // 创建 overlay DOM
    this.overlay = document.createElement('div');
    this.overlay.className = 'dp-overlay';
    this.overlay.innerHTML = '<div class="dp-sheet"></div>';
    document.querySelector('.phone').appendChild(this.overlay);

    // 点击蒙层关闭
    this.overlay.addEventListener('click', e => {
      if (e.target === this.overlay) this.close();
    });

    // 绑定触发元素
    if (opts.triggerEl) {
      opts.triggerEl.addEventListener('click', () => this.open());
    }
  }

  open() {
    this._render();
    this.overlay.classList.add('show');
  }

  close() {
    this.overlay.classList.remove('show');
  }

  _parseInto(field, str) {
    const [y, m, d] = str.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    if (field === 'start') this.startDate = dt;
    else                   this.endDate   = dt;
  }

  _fmt(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  _sameDay(a, b) {
    return a && b &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth()    === b.getMonth()    &&
      a.getDate()     === b.getDate();
  }

  _render() {
    const sheet = this.overlay.querySelector('.dp-sheet');
    sheet.innerHTML = this._buildHTML();

    // 导航按钮
    sheet.querySelector('.dp-prev').addEventListener('click', () => {
      if (this.viewMonth === 0) { this.viewMonth = 11; this.viewYear--; }
      else this.viewMonth--;
      this._render();
    });
    sheet.querySelector('.dp-next').addEventListener('click', () => {
      if (this.viewMonth === 11) { this.viewMonth = 0; this.viewYear++; }
      else this.viewMonth++;
      this._render();
    });

    // 关闭
    sheet.querySelector('.dp-close').addEventListener('click', () => this.close());

    // 日期格子
    sheet.querySelectorAll('.dp-cell:not(.dp-cell-empty):not(.dp-cell-disabled)').forEach(cell => {
      cell.addEventListener('click', () => {
        const [y, m, d] = cell.dataset.date.split('-').map(Number);
        const clicked = new Date(y, m - 1, d);

        if (!this.startDate || (this.startDate && this.endDate)) {
          // 重新开始
          this.startDate = clicked;
          this.endDate   = null;
        } else {
          // 已有 start 无 end
          if (clicked < this.startDate) {
            this.startDate = clicked;
            this.endDate   = null;
          } else {
            this.endDate = clicked;
          }
        }
        this._render();
      });
    });

    // 确定按钮
    sheet.querySelector('.dp-confirm-btn').addEventListener('click', () => {
      if (!this.startDate) return;
      const end   = this.endDate || this.startDate;
      const label = this._fmt(this.startDate) + ' 至 ' + this._fmt(end);
      if (this.labelEl) this.labelEl.textContent = label;
      if (this.onConfirm) this.onConfirm(new Date(this.startDate), new Date(end), label);
      this.close();
    });
  }

  _buildHTML() {
    const DAYS   = ['日','一','二','三','四','五','六'];
    const y      = this.viewYear;
    const m      = this.viewMonth;
    const label  = `${y}年${m + 1}月`;

    const firstDow    = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    const maxDate = this.maxDate;
    maxDate.setHours(23, 59, 59, 999);

    let cells = '';
    for (let i = 0; i < firstDow; i++) {
      cells += '<div class="dp-cell dp-cell-empty"></div>';
    }

    const isStart = this.startDate;
    const isEnd   = this.endDate;
    const sole    = isStart && isEnd && this._sameDay(this.startDate, this.endDate);

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(y, m, d);
      const dateStr = this._fmt(date);
      const disabled = date > maxDate;

      let cls = 'dp-cell';
      let sub = '';

      if (disabled) {
        cls += ' dp-cell-disabled';
      } else {
        const matchStart = isStart && this._sameDay(date, this.startDate);
        const matchEnd   = isEnd   && this._sameDay(date, this.endDate);
        const inRange    = isStart && isEnd && date > this.startDate && date < this.endDate;

        if (matchStart && sole)       { cls += ' dp-cell-start dp-cell-sole'; sub = '开始'; }
        else if (matchStart)          { cls += ' dp-cell-start'; sub = '开始'; }
        else if (matchEnd)            { cls += ' dp-cell-end';   sub = '结束'; }
        else if (inRange)             { cls += ' dp-cell-range'; }
      }

      cells += `<div class="${cls}" data-date="${dateStr}">
        <span class="dp-num">${d}</span>
        ${sub ? `<span class="dp-sub">${sub}</span>` : ''}
      </div>`;
    }

    return `
      <div class="dp-header">
        <span class="dp-title">日期选择</span>
        <span class="dp-close">✕</span>
      </div>
      <div class="dp-month-nav">
        <span class="dp-nav-btn dp-prev">‹</span>
        <span class="dp-month-label">${label}</span>
        <span class="dp-nav-btn dp-next">›</span>
      </div>
      <div class="dp-weekdays">${DAYS.map(w => `<div class="dp-weekday">${w}</div>`).join('')}</div>
      <div class="dp-grid">${cells}</div>
      <div class="dp-footer">
        <button class="dp-confirm-btn">确定</button>
      </div>
    `;
  }
}

/* ============================================================
   BottomSheetSelect
   用法：
     const sel = new BottomSheetSelect({
       triggerEl: document.getElementById('typePill'),
       labelEl:   document.getElementById('typeLabel'),
       title:     '类型筛选',
       options: [
         { value: 'all',  label: '全部类型' },
         { value: 'gas',  label: '废气' },
       ],
       selected: 'all',
       onSelect: (value, label) => { ... }
     });
   ============================================================ */
class BottomSheetSelect {
  constructor(opts = {}) {
    this.labelEl  = opts.labelEl  || null;
    this.title    = opts.title    || '请选择';
    this.options  = opts.options  || [];
    this.selected = opts.selected || (this.options[0] || {}).value;
    this.onSelect = opts.onSelect || null;

    this.overlay = document.createElement('div');
    this.overlay.className = 'bss-overlay';
    this.overlay.innerHTML = `
      <div class="bss-sheet">
        <div class="bss-header">
          <span class="bss-title">${this.title}</span>
          <span class="bss-close">✕</span>
        </div>
        <div class="bss-list">${this._buildOptions()}</div>
      </div>
    `;
    document.querySelector('.phone').appendChild(this.overlay);

    this.overlay.addEventListener('click', e => {
      if (e.target === this.overlay) this.close();
    });
    this.overlay.querySelector('.bss-close').addEventListener('click', () => this.close());
    this._bindOptionEvents();

    if (opts.triggerEl) {
      opts.triggerEl.addEventListener('click', () => this.open());
    }
  }

  open()  { this.overlay.classList.add('show'); }
  close() { this.overlay.classList.remove('show'); }

  _buildOptions() {
    return this.options.map(o => `
      <div class="bss-option ${o.value === this.selected ? 'selected' : ''}" data-value="${o.value}">
        <span>${o.label}</span>
        <span class="bss-check">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </span>
      </div>`).join('');
  }

  _bindOptionEvents() {
    this.overlay.querySelectorAll('.bss-option').forEach(el => {
      el.addEventListener('click', () => {
        const val = el.dataset.value;
        const opt = this.options.find(o => o.value === val);
        if (!opt) return;
        this.selected = val;
        // 更新 UI
        this.overlay.querySelectorAll('.bss-option').forEach(e => e.classList.remove('selected'));
        el.classList.add('selected');
        if (this.labelEl) this.labelEl.textContent = opt.label;
        if (this.onSelect) this.onSelect(val, opt.label);
        this.close();
      });
    });
  }
}

/* ============================================================
   TopDropdown — 顶部下拉选择
   从 anchorEl（通常是 Hero 区域）底部向下展开，覆盖内容区。
   用法：
     new TopDropdown({
       triggerEl: document.getElementById('typePill'),
       anchorEl:  document.querySelector('.an-hero'),   // 定位基准
       labelEl:   document.getElementById('typeLabel'),
       options: [
         { value: 'all',  label: '全部' },
         { value: '小时', label: '小时' },
       ],
       selected:  'all',
       onSelect:  (value, label) => { ... }
     });
   ============================================================ */
class TopDropdown {
  constructor(opts = {}) {
    this.triggerEl = opts.triggerEl || null;
    this.anchorEl  = opts.anchorEl  || opts.triggerEl || null;
    this.labelEl   = opts.labelEl   || null;
    this.options   = opts.options   || [];
    this.selected  = opts.selected  || (this.options[0] || {}).value;
    this.onSelect  = opts.onSelect  || null;

    this.overlay = document.createElement('div');
    this.overlay.className = 'tdd-overlay';
    this.overlay.innerHTML = `
      <div class="tdd-mask"></div>
      <div class="tdd-panel">
        ${this.options.map(o => `
          <div class="tdd-option ${o.value === this.selected ? 'selected' : ''}" data-value="${o.value}">
            ${o.label}
          </div>`).join('')}
      </div>
    `;

    document.querySelector('.phone').appendChild(this.overlay);

    // 点蒙层关闭
    this.overlay.querySelector('.tdd-mask').addEventListener('click', () => this.close());

    // 选项点击
    this.overlay.querySelectorAll('.tdd-option').forEach(el => {
      el.addEventListener('click', () => {
        const val = el.dataset.value;
        const opt = this.options.find(o => o.value === val);
        if (!opt) return;
        this.selected = val;
        this.overlay.querySelectorAll('.tdd-option').forEach(e => e.classList.remove('selected'));
        el.classList.add('selected');
        if (this.labelEl) this.labelEl.textContent = opt.label;
        if (this.onSelect) this.onSelect(val, opt.label);
        this.close();
      });
    });

    // 触发按钮
    if (this.triggerEl) {
      this.triggerEl.addEventListener('click', () => this.open());
    }
  }

  open() {
    // 动态计算 panel top = anchorEl 底部相对 .phone 的偏移
    if (this.anchorEl) {
      const phoneEl  = document.querySelector('.phone');
      const phoneTop = phoneEl.getBoundingClientRect().top;
      const anchorBottom = this.anchorEl.getBoundingClientRect().bottom;
      this.overlay.querySelector('.tdd-panel').style.top = (anchorBottom - phoneTop) + 'px';
    }
    this.overlay.classList.add('show');
    if (this.triggerEl) this.triggerEl.classList.add('tdd-open');
  }

  close() {
    this.overlay.classList.remove('show');
    if (this.triggerEl) this.triggerEl.classList.remove('tdd-open');
  }
}
