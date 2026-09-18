(() => {
  const data = window.siteData;
  if (!data) return;
  let language = 'en';
  const text = {
    zh: { menu:'菜单', navAbout:'简介', navResearch:'研究方向', navPublications:'项目与论文', navResume:'简历', navContact:'联系', heroKicker:'学术个人主页 · 2026', viewPublications:'查看论文', getInTouch:'联系我 ↗', portraitPending:'个人照片待补充', portraitCaption:'中国 · 欢迎学术与专业合作', aboutTitle:'关于我', researchTitle:'研究方向', publicationsTitle:'项目与论文', publicationsNote:'本科阶段完成的部分研究与建模项目。', documentHint:'点击即可在线预览或下载完整论文。', resumeTitle:'个人简历', resumeCopy:'教育背景、研究经历与专业履历的完整概览。', resumeStatus:'PDF 待补充', contactTitle:'期待与你交流。', contactCopy:'如需交流研究或开展专业合作，欢迎来信：', backToTop:'返回顶部 ↑', preview:'在线预览', download:'下载 PDF', pending:'文件待补充', factsInstitution:'机构', factsLocation:'地点', factsFocus:'阶段', focusValue:'本科生' },
    en: { menu:'Menu', navAbout:'About', navResearch:'Research', navPublications:'Publications', navResume:'Résumé', navContact:'Contact', heroKicker:'Academic profile · 2026', viewPublications:'View publications', getInTouch:'Get in touch ↗', portraitPending:'Dian Jin', portraitCaption:'Based in China · Available for collaboration', aboutTitle:'About me', researchTitle:'Research interests', publicationsTitle:'Selected projects & papers', publicationsNote:'Selected undergraduate research and modeling projects.', documentHint:'Open or download the full project papers below.', resumeTitle:'Curriculum vitae', resumeCopy:'A complete overview of education, research experience, and professional history.', resumeStatus:'Dian Jin CV', contactTitle:'Let’s start a conversation.', contactCopy:'For research discussion or professional inquiries, please write to:', backToTop:'Back to top ↑', preview:'Preview', download:'Download PDF', pending:'File forthcoming', factsInstitution:'Institution', factsLocation:'Location', factsFocus:'Status', focusValue:'Undergraduate' }
  };
  const q = (selector) => document.querySelector(selector);
  const escaped = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[char]));
  const personValue = (key) => data.person[key + (language === 'zh' ? 'Zh' : '')] || data.person[key] || '';
  const documentButtons = (file, available) => available
    ? `<a class="icon-button" href="document.html?file=${encodeURIComponent(file)}"><span>↗</span>${text[language].preview}</a><a class="icon-button" href="${escaped(file)}" download><span>↓</span>${text[language].download}</a>`
    : `<span class="icon-button" aria-disabled="true"><span>—</span>${text[language].pending}</span>`;

  function render() {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.title = `${language === 'zh' ? data.person.nameZh : data.person.name} | ${language === 'zh' ? '个人主页' : 'Personal Website'}`;
    document.querySelectorAll('[data-i18n]').forEach((node) => { node.textContent = text[language][node.dataset.i18n] || node.textContent; });
    document.querySelectorAll('[data-person]').forEach((node) => {
      const value = personValue(node.dataset.person);
      if (value) node.textContent = value;
      if (node.dataset.person === 'email') node.href = `mailto:${value}`;
    });
    q('.language-toggle').textContent = language === 'zh' ? 'EN' : '中文';
    q('#facts').innerHTML = [
      [text[language].factsInstitution, personValue('institution')],
      [text[language].factsLocation, personValue('location')],
      [text[language].factsFocus, text[language].focusValue]
    ].map(([label, value]) => `<div><dt>${escaped(label)}</dt><dd>${escaped(value)}</dd></div>`).join('');
    q('#interests').innerHTML = data.interests.map((interest, index) => `<div class="interest"><span class="interest-number">0${index + 1}</span>${escaped(interest[language])}</div>`).join('');
    q('#publication-count').textContent = String(data.publications.length).padStart(2, '0');
    q('#publication-list').innerHTML = data.publications.map((paper) => {
      const tags = (paper[language === 'zh' ? 'tagsZh' : 'tags'] || paper.tags).map((tag) => `<span class="tag">${escaped(tag)}</span>`).join('');
      return `<article class="publication"><div class="publication-year">${escaped(paper.year)}</div><div><h3>${escaped(paper[language === 'zh' ? 'titleZh' : 'title'] || paper.title)}</h3><p class="publication-meta">${escaped(paper[language === 'zh' ? 'authorsZh' : 'authors'] || paper.authors)} · ${escaped(paper[language === 'zh' ? 'venueZh' : 'venue'] || paper.venue)}</p><p class="publication-abstract">${escaped(paper[language === 'zh' ? 'abstractZh' : 'abstract'] || paper.abstract)}</p><div class="tag-list">${tags}</div></div><div class="paper-actions">${documentButtons(paper.file, paper.available)}</div></article>`;
    }).join('');
    q('#resume-filename').textContent = data.resume.filename;
    q('#resume-actions').innerHTML = documentButtons(data.resume.file, data.resume.available);
    q('#social-links').innerHTML = data.person.socials.filter((item) => item.url).map((item) => `<a href="${escaped(item.url)}" target="_blank" rel="noreferrer">${escaped(item.label)} ↗</a>`).join('');
    const portrait = q('#portrait');
    if (data.person.portrait) { portrait.classList.add('has-image'); portrait.style.backgroundImage = `url('${data.person.portrait}')`; }
  }
  render();
  q('.language-toggle').addEventListener('click', () => { language = language === 'zh' ? 'en' : 'zh'; render(); });
  const menuButton = q('.menu-toggle'); const nav = q('.site-nav');
  menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') === 'true'; menuButton.setAttribute('aria-expanded', String(!open)); nav.classList.toggle('is-open', !open); });
  nav.addEventListener('click', () => { menuButton.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); });
  q('#year').textContent = new Date().getFullYear();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
    document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
  } else document.querySelectorAll('.reveal').forEach((item) => item.classList.add('is-visible'));
})();
