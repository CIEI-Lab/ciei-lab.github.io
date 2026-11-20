/* CIEI Lab UI language state. Content files load before this script. */
(() => {
  'use strict';

  const STORAGE_KEY = 'ciei-language';
  const EN = Object.freeze({
    // Navigation, page titles, landmarks and common actions.
    '科研项目': 'Research projects',
    '显示更多': 'Show more',
    '资料来源': 'Source record',

    '首页': 'Home',
    '科研': 'Research',
    '项目': 'Projects',
    '产品': 'Products',
    '成员': 'People',
    '资源': 'Resources',
    '招聘': 'Join us',
    '首页 · CIEI Lab': 'Home · CIEI Lab',
    '科研 · CIEI Lab': 'Research · CIEI Lab',
    '项目 · CIEI Lab': 'Projects · CIEI Lab',
    '产品 · CIEI Lab': 'Products · CIEI Lab',
    '成员 · CIEI Lab': 'People · CIEI Lab',
    '资源 · CIEI Lab': 'Resources · CIEI Lab',
    '招聘 · CIEI Lab': 'Join us · CIEI Lab',
    'CIEI Lab 首页': 'CIEI Lab home',
    '跳到正文': 'Skip to main content',
    '主导航': 'Main navigation',
    '菜单': 'Menu',
    '收起': 'Collapse',
    '关闭': 'Close',
    '顶部': 'Top',
    '返回页面顶部': 'Back to top',
    '语言': 'Language',
    '选择语言': 'Choose language',
    '切换语言': 'Switch language',
    '切换为英文': 'Switch to English',
    '切换为中文': 'Switch to Chinese',
    '中文': '中文',
    '英文': 'English',
    '探索实验室': 'Explore the lab',
    '联系与关注': 'Connect with us',
    '联系实验室': 'Contact the lab',
    '联系邮箱待补充': 'Contact email to be added',
    '联系地址待补充': 'Address to be added',
    '招聘联系邮箱待补充': 'Recruitment email to be added',
    '办公地址待补充': 'Office address to be added',
    '科研 · 合作 · 创新': 'Research · Collaboration · Innovation',
    'GitHub · CIEI-Lab': 'GitHub · CIEI-Lab',
    '了解更多': 'Learn more',
    '访问资源': 'Open resource',
    '查看详情': 'View details',
    '查看来源': 'View source',
    '来源': 'Source',

    // Home page and section headings, including their exact editorial HTML.
    '理解认知，': 'Understanding cognition.',
    '让智能走向': 'Intelligence through ',
    '交互。': 'interaction.',
    '理解认知，<br>让智能走向<span>交互。</span>': 'Understanding cognition.<br>Intelligence through <span>interaction.</span>',
    '理解认知，让智能走向交互。': 'Understanding cognition. Intelligence through interaction.',
    '在人工智能与认知科学的交叉处，': 'At the intersection of AI and cognitive science,',
    '探索个体、群体与智能系统之间的关系。': 'we study relationships among individuals, groups and intelligent systems.',
    '在人工智能与认知科学的交叉处，<br>探索个体、群体与智能系统之间的关系。': 'At the intersection of AI and cognitive science,<br>we study individuals, groups and intelligent systems.',
    '探索研究方向': 'Explore our research',
    '认识 CIEI Lab': 'About CIEI Lab',
    '关于 CIEI Lab': 'About CIEI Lab',
    '理解交互，<br>也理解交互中的人。': 'Understanding interaction.<br>Understanding the people within it.',
    '理解<span class="type-accent">交互</span>，<br>也理解交互中的<span class="type-accent">人</span>。': 'Understanding <span class="type-accent">interaction.</span><br>Understanding <span class="type-accent">people.</span>',
    '可解释': 'Interpretable',
    '可适应': 'Adaptive',
    '可协同': 'Collaborative',
    '认知科学': 'Cognitive science',
    '人工智能': 'Artificial intelligence',
    '具身交互': 'Embodied interaction',
    '个体与群体的认知机制': 'Mind and behaviour in individuals and groups',
    '学习、推理与协同决策': 'Learning, reasoning and collaborative decisions',
    '连接感知、行动与真实场景': 'Connecting perception, action and real settings',
    '复杂系统': 'Complex systems',
    '工程实践': 'Engineering practice',
    '四个方向，一个交互视角': 'Four themes. One interaction perspective.',
    '从个体，到群体。<br>从认知，到行动。': 'From individuals to groups.<br>From cognition to action.',
    '从个体，到<span class="type-accent">群体</span>。<br>从认知，到<span class="type-accent">行动</span>。': 'From individuals to <span class="type-accent">groups.</span><br>From cognition to <span class="type-accent">action.</span>',
    '全部科研内容': 'Explore all research',
    '研究方向选择': 'Choose a research theme',
    '研究主题': 'Research focus',
    '应用面向': 'Application areas',
    '交互能力': 'Interaction capabilities',
    '研究详情': 'Research details',
    '探索这一方向': 'Explore this theme',
    '研究内容': 'Research focus',
    '连接交互机制，<br>智能方法与真实场景。': 'Connecting interaction mechanisms,<br>intelligent methods and real settings.',
    '连接交互机制，<br><span class="type-accent">智能方法</span>与真实场景。': 'Connecting interaction mechanisms,<br><span class="type-accent">intelligent methods</span> and real settings.',
    '认知与行为建模': 'Cognitive and behavioral modeling',
    '以可检验的计算模型，刻画个体认知、关系变化与群体行为的交互机制。': 'We use testable computational models to study how individual cognition, changing relationships and collective behavior interact.',
    '学习与协同决策': 'Learning and collaborative decisions',
    '结合智能学习、知识推理与交互反馈，研究动态环境中的适应与协同。': 'We combine learning, knowledge-based reasoning and interaction feedback to study adaptation and coordination in dynamic environments.',
    '实验与场景验证': 'Experiments and validation in context',
    '结合受控实验、仿真分析和真实场景测试，检验方法的解释力与适用边界。': 'We use controlled experiments, simulations and tests in real settings to examine explanatory power and limits of applicability.',
    '在真实场景里，<br>检验每一次交互。': 'Studying interaction<br>in real settings.',
    '在<span class="type-accent">真实场景</span>里，<br>检验每一次交互。': 'Studying interaction<br>in <span class="type-accent">real settings.</span>',
    '全部实验平台': 'All experimental facilities',
    '让研究问题，<br>成为可见的证据。': 'From research questions<br>to visible evidence.',
    '让研究问题，<br>成为可见的<span class="type-accent">证据</span>。': 'From research questions<br>to visible <span class="type-accent">evidence.</span>',
    '代表论文': 'Selected publications',
    '代表研究': 'Selected research',
    '从研究出发，让工具可用': 'From research to useful tools',
    '从<span class="type-accent">研究</span>出发，让工具可用': 'From <span class="type-accent">research</span> to useful tools',
    '探索产品': 'Explore our tools',
    '持续探索，<br>持续记录。': 'Exploring.<br>Documenting.',
    '研究进展、开源发布与实验室动态。': 'Research progress, open-source releases and lab updates.',
    '新的探索，将在这里记录。': 'New explorations will be shared here.',
    '实验室动态与学术交流信息持续更新中。': 'Lab news and academic activities will be added here.',
    '面向真实世界的问题。': 'Addressing real-world questions.',
    '一起探索，创造新的可能。': 'Explore new possibilities together.',
    '了解研究合作、加入团队与交流机会。': 'Discover opportunities for collaboration, research and exchange.',
    '加入我们': 'Join us',
    '实验室动态': 'Lab news',
    '科研进展': 'Research updates',
    '交流合作': 'Collaboration and exchange',

    // Inner page descriptions and navigation.
    '从个体认知到群体协同，连接理论建模、智能方法与真实场景。': 'From individual cognition to collective coordination, connecting theory, intelligent methods and real settings.',
    '科研页内导航': 'Research page navigation',
    '研究方向': 'Research themes',
    '论文与成果': 'Publications and outputs',
    '论文与成果列表': 'Publications and outputs',
    '从科研任务到场景实践，探索开放项目与研究合作。': 'Exploring open projects and collaboration, from research questions to applications.',
    '从想法到工具，探索心理对话、医疗语言模型与更多应用。': 'From ideas to tools: psychological dialogue, medical language models and other applications.',
    '不同学科背景，在共同的研究问题中相遇。': 'Different disciplines, connected by shared research questions.',
    '从开放代码到共享实验平台，连接研究与实践。': 'Connecting research and practice through open code and shared experimental facilities.',
    '从开放代码到实验平台，连接研究与实践。': 'Connecting research and practice through open code and experimental facilities.',
    '资源页内导航': 'Resources page navigation',
    '代码与模型': 'Code and models',
    '实验平台': 'Experimental facilities',
    '了解实验室的研究岗位、科研助理与交流机会。': 'Explore research positions, research assistant roles and exchange opportunities.',
    '招聘信息筹备中': 'Opportunities are being prepared',
    '正式岗位与申请方式将在本页公布。': 'Positions and application details will be published here.',
    '暂无公开招聘信息。': 'There are currently no advertised positions.',
    '共享实验场景 · PIS Lab': 'Shared experimental setting · PIS Lab',

    // Filters use stable data keys; translate their visible labels only.
    '全部': 'All',
    '论文': 'Papers',
    '著作': 'Books',
    '专利': 'Patents',
    '软著': 'Software copyrights',
    '成果类型': 'Output type',
    '论文类型': 'Publication type',
    '期刊论文': 'Journal article',
    '会议论文': 'Conference paper',
    '预印本': 'Preprint',
    '年份': 'Year',
    '全部年份': 'All years',
    '搜索成果标题或作者': 'Search publications by title or author',
    '搜索标题、作者或关键词': 'Search titles, authors or keywords',
    '按研究方向筛选论文': 'Filter publications by research theme',
    '全部研究方向': 'All research themes',
    '著作、专利与软著资料待更新。': 'Details of books, patents and software copyrights will be added.',
    '预印本已单独标记。著作、专利与软著资料持续补充中。': 'Preprints are labeled separately. Details of books, patents and software copyrights will be added.',
    '暂无匹配内容。': 'No matching results.',
    '没有匹配的内容。试试其他分类或关键词。': 'No matching results. Try another category or search term.',
    '该类别资料待更新。': 'Information for this category will be added.',
    '该类别资料正在整理，敬请关注后续更新。': 'Information for this category is being prepared.',
    '显示 {count} 条记录': 'Showing {count} records',
    '开源项目': 'Open-source projects',
    '国家项目': 'National research projects',
    '企业委托': 'Industry projects',
    '应用案例': 'Case studies',
    '项目类型': 'Project type',
    '了解项目': 'View project',
    '教师': 'Faculty',
    '研究员': 'Researchers',
    '助理': 'Research assistants',
    '学生': 'Students',
    '合作者': 'Collaborators',
    '前成员': 'Alumni',
    '团队成员': 'Team members',
    '核心成员': 'Core member',
    '成员资料陆续更新。': 'Member profiles will be added over time.',
    '成员类别': 'Member role',
    '社会认知': 'Social cognition',
    '健康智能': 'Health intelligence',
    '具身协同': 'Embodied coordination',
    '智能工程': 'Intelligent engineering',
    '社会认知与群体行为计算': 'Social cognition and collective behavior',
    '多模态健康智能与认知评估': 'Multimodal health intelligence and cognitive assessment',
    '具身群体智能与人机协同': 'Embodied collective intelligence and human–machine coordination',
    '知识驱动的智能工程与人因优化': 'Knowledge-driven engineering and human factors optimization',

    // Publications, figures, copying and source credits.
    '论文原文': 'Publication',
    '阅读论文原文': 'Read the publication',
    '开放全文': 'Open full text',
    '开放全文（预印本）': 'Open full text (preprint)',
    '开放全文(预印本)': 'Open full text (preprint)',
    '研究代码': 'Research code',
    '复制引用': 'Copy citation',
    '论文引用': 'Publication citation',
    '引用文本': 'Citation text',
    '已复制': 'Copied',
    '引用已复制': 'Citation copied',
    '请从原文页面获取引用': 'Please get the citation from the publication page',
    '研究图示大图': 'Enlarged research figure',
    '关闭图示': 'Close figure',
    '研究架构图': 'Research framework',
    '论文研究架构图': 'Research framework',
    '研究图': 'Research figure',
    '放大研究图': 'Enlarge research figure',
    '放大 {title} 研究图': 'Enlarge research figure: {title}',
    '{title}：论文研究架构图': '{title}: research framework',
    'Dong Xue et al., Science China Information Sciences (2025), Figure 5；裁取原图。': 'Dong Xue et al., Science China Information Sciences (2025), Figure 5; cropped from the original.',
    'Dong Xue et al., Doctor Sun 预印本 arXiv:2508.08270v2, Figure 1；裁取原图。': 'Dong Xue et al., Doctor Sun preprint, arXiv:2508.08270v2, Figure 1; cropped from the original.',
    'Dong Xue et al., arXiv:2601.01993v2 (2026), Figure 2；裁取原图。': 'Dong Xue et al., arXiv:2601.01993v2 (2026), Figure 2; cropped from the original.',
    '裁取原图。': 'Cropped from the original.',

    // Products, open resources and their status labels.
    '对话，让理解发生': 'Understanding through dialogue',
    '连接知识与健康': 'Connecting knowledge and health',
    '更多可能，持续探索': 'Exploring more possibilities',
    '了解产品': 'Explore this tool',
    '查看 {name} 产品详情': 'View details of {name}',
    '开放代码': 'Source code',
    '查看源码': 'View source code',
    '项目体验入口': 'Open project demo',
    '项目许可': 'Project license',
    '使用条件：': 'Terms of use: ',
    '。请查阅': '. See ',
    '请查阅': 'See ',
    '。': '.',
    '正式名称、介绍及访问链接待补充。': 'The name, description and links will be added.',
    '公开代码与模型': 'Code and models available',
    '资料待补充': 'Details to be added',
    '资料整理中': 'Details are being prepared',
    '正式名称待确认': 'Name to be confirmed',
    '暂定名称': 'Working name',
    '心理对话大模型': 'Psychological dialogue model',
    '中文医疗大模型': 'Chinese medical language model',
    '模型目录': 'Model directory',
    'OpenXLab 入口': 'OpenXLab demo',
    'Sunsimiao-7B 模型': 'Sunsimiao-7B model',
    'WiseModel 模型页': 'WiseModel model page',
    '实验室 GitHub': 'Lab GitHub',
    '代码仓库': 'Code repositories',
    '开源代码': 'Open-source code',
    '开源模型': 'Open models',
    '多模态模型': 'Multimodal models',
    '模型平台': 'Model platforms',
    '数据与工具': 'Data and tools',
    '访问 GitHub': 'Visit GitHub',
    '浏览代码': 'Browse code',
    '查看仓库': 'View repository',
    '浏览模型': 'Browse models',
    '仓库介绍已公开': 'Repository overview available',
    '岗位信息': 'Positions',
    '交流机会': 'Exchange opportunities',

    // Shared facilities: actual media controls, not decorative motion controls.
    '学院共享实验平台': 'Shared school facilities',
    '实验平台资料正在整理中。': 'Experimental facility information is being prepared.',
    '选择共享实验平台': 'Choose an experimental facility',
    '选择实验平台': 'Choose an experimental facility',
    'PIS Lab · 孙兆辉老师团队': "PIS Lab · Zhaohui Sun's team",
    '素材来自 PIS Lab': 'Media: PIS Lab',
    '素材来自 PIS Lab · 查看来源': 'Media: PIS Lab · View source',
    '学院共享平台 · 素材：PIS Lab': 'Shared school facilities · Media: PIS Lab',
    '学院共享实验平台，素材来自 PIS Lab · 孙兆辉老师团队': "Shared school facilities. Media: PIS Lab · Zhaohui Sun's team",
    '人机交互实验': 'Human–robot interaction',
    '沉浸式交互环境': 'Immersive interaction environment',
    '眼动追踪实验': 'Eye-tracking experiments',
    '眼动实验': 'Eye-tracking experiments',
    '虚拟高空训练场景': 'Virtual height-exposure setting',
    'XR 自适应训练': 'Adaptive XR training',
    '播放演示': 'Play demo',
    '暂停演示': 'Pause demo',
    '暂无动态演示': 'No animated demo available',
    '加载演示…': 'Loading demo…',
    '加载演示...': 'Loading demo…',
    '动态演示暂时无法加载，请稍后重试。': 'The demo could not be loaded. Please try again later.',
    '放大画面': 'Enlarge view',
    '演示画面': 'Demo image',
    '播放': 'Play ',
    '暂停': 'Pause ',
    '演示': ' demo',
    '放大': 'Enlarge ',
    '画面': ' view',
    '播放 {title} 演示': 'Play {title} demo',
    '暂停 {title} 演示': 'Pause {title} demo',
    '放大 {title} 画面': 'Enlarge {title}',
    '{title}演示画面': '{title}: demo image',
    '{title}放大画面': '{title}: enlarged view'
  });

  const normalize = value => {
    if (typeof value !== 'string') return null;
    const normalized = value.trim().toLowerCase();
    if (normalized === 'zh' || normalized === 'zh-cn') return 'zh';
    if (normalized === 'en' || normalized === 'en-us' || normalized === 'en-gb') return 'en';
    return null;
  };
  let queryLanguage = null;
  let storedLanguage = null;
  try { queryLanguage = normalize(new URL(window.location.href).searchParams.get('lang')); }
  catch (_) { /* A malformed URL must not prevent the page from rendering. */ }
  try { storedLanguage = normalize(window.localStorage.getItem(STORAGE_KEY)); }
  catch (_) { /* Storage may be unavailable in private mode or local-file previews. */ }
  const lang = queryLanguage || storedLanguage || 'zh';
  const missing = new Set();

  const canonicalLabels = Object.freeze({
    'All': '全部', 'Papers': '论文', 'Paper': '论文', 'Books': '著作',
    'Patents': '专利', 'Software copyrights': '软著',
    'Journal article': '期刊论文', 'Conference paper': '会议论文', 'Preprint': '预印本',
    'Open-source projects': '开源项目', 'National research projects': '国家项目',
    'Industry projects': '企业委托', 'Case studies': '应用案例',
    'Faculty': '教师', 'Faculty member': '教师', 'Researcher': '研究员', 'Researchers': '研究员',
    'Research assistant': '助理', 'Research assistants': '助理',
    'Student': '学生', 'Students': '学生',
    'Collaborator': '合作者', 'Collaborators': '合作者', 'Alumni': '前成员', 'Former member': '前成员',
    'Social cognition': '社会认知', 'Health intelligence': '健康智能',
    'Embodied coordination': '具身协同', 'Intelligent engineering': '智能工程'
  });

  function interpolate(text, values) {
    if (!values || typeof values !== 'object') return text;
    return text.replace(/\{([A-Za-z][A-Za-z0-9_]*)\}/g, (match, key) =>
      Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match);
  }

  function dynamicTranslation(text) {
    let match;
    if ((match = /^显示\s*(\d+)\s*条记录$/.exec(text))) {
      return `Showing ${match[1]} ${Number(match[1]) === 1 ? 'record' : 'records'}`;
    }
    if ((match = /^查看\s+(.+?)\s+产品详情$/.exec(text))) return `View details of ${t(match[1])}`;
    if ((match = /^放大(.+?)研究图$/.exec(text))) return `Enlarge research figure: ${t(match[1])}`;
    if ((match = /^(.+?)：论文研究架构图$/.exec(text))) return `${t(match[1])}: research framework`;
    if ((match = /^(.+?)研究架构图$/.exec(text))) return `${t(match[1])}: research framework`;
    if ((match = /^(播放|暂停)(.+?)演示$/.exec(text))) {
      return `${match[1] === '播放' ? 'Play' : 'Pause'} ${t(match[2])} demo`;
    }
    if ((match = /^放大(.+?)画面$/.exec(text))) return `Enlarge ${t(match[1])}`;
    if ((match = /^(.+?)演示画面$/.exec(text))) return `${t(match[1])}: demo image`;
    if ((match = /^(.+?)放大画面$/.exec(text))) return `${t(match[1])}: enlarged view`;
    if ((match = /^(\d{4})年$/.exec(text))) return match[1];
    return null;
  }

  function t(value, values) {
    const text = String(value ?? '');
    if (lang === 'zh') return interpolate(text, values);
    if (text === '显示 {count} 条记录' && values && /^\d+$/.test(String(values.count))) {
      return dynamicTranslation(interpolate(text, values));
    }
    if (Object.prototype.hasOwnProperty.call(EN, text)) return interpolate(EN[text], values);
    const dynamic = dynamicTranslation(text);
    if (dynamic !== null) return interpolate(dynamic, values);
    if (/[\u3400-\u9fff]/.test(text)) missing.add(text);
    return interpolate(text, values);
  }

  function languageURL(nextLanguage, currentURL = window.location.href) {
    const next = new URL(currentURL, window.location.href);
    next.searchParams.set('lang', normalize(nextLanguage) || lang);
    return next.href;
  }

  function withLanguage(target, nextLanguage = lang) {
    const text = String(target ?? '');
    if (!text || text.startsWith('#')) return text;
    try {
      const next = new URL(text, window.location.href);
      const current = new URL(window.location.href);
      const localFile = next.protocol === 'file:' && current.protocol === 'file:';
      const sameSite = /^https?:$/.test(next.protocol) && next.origin === current.origin;
      return localFile || sameSite ? languageURL(nextLanguage, next.href) : text;
    } catch (_) { return text; }
  }

  function switchLanguage(nextLanguage) {
    const next = normalize(nextLanguage) || (lang === 'zh' ? 'en' : 'zh');
    try { window.localStorage.setItem(STORAGE_KEY, next); }
    catch (_) { /* The URL carries the language even if storage is blocked. */ }
    const destination = languageURL(next);
    window.location.href = destination;
    return destination;
  }

  const chineseContent = window.LAB_CONTENT_ZH || window.LAB_CONTENT;
  window.LAB_CONTENT_ZH = chineseContent;
  window.LAB_CONTENT = lang === 'en' && window.LAB_CONTENT_EN ? window.LAB_CONTENT_EN : chineseContent;
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
  if (document.title) document.title = t(document.title);

  window.CIEI_I18N = Object.freeze({
    lang,
    t,
    format: t,
    switchLanguage,
    languageURL,
    withLanguage,
    canonicalLabel: value => canonicalLabels[String(value)] || String(value ?? ''),
    dictionary: EN,
    untranslated: () => Array.from(missing)
  });
})();
