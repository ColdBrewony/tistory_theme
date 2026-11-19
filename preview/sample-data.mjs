// 프리뷰용 샘플 데이터.
// 블로그 이름·소개·태그라인·스택은 GitHub 프로필(github.com/ColdBrewony), 글 제목 일부는
// 블로그(woo-nny.tistory.com) 최근 글을 참고했다. 요약·본문·댓글은 레이아웃 확인용 예시다.

export const vars = {
  'cb-default-theme': 'cb-theme-auto',
  'cb-accent': 'cb-accent-copper',
  'cb-sidebar-show': true,
  'cb-logo-use': false,
  'cb-logo': '',
  'cb-hero-show': true,
  'cb-hero-eyebrow': 'Backend Developer · Brewed slowly, shipped daily.',
  'cb-show-author': false,
  'cb-toc': true,
  'cb-reading-time': true,
  'cb-show-related': true,
  'cb-new-comment': false,   // 프리뷰에서는 스킨 자체 댓글 디자인을 보여 준다
  'cb-new-guestbook': true,
  'cb-github-url': 'https://github.com/ColdBrewony',
  'cb-portfolio-url': 'https://portfolio-woonny-s-projects.vercel.app/',
  'cb-instagram-url': '',
  'cb-x-url': '',
  'cb-youtube-url': '',
  'cb-footer-text': '천천히, 그러나 꾸준히 커밋합니다.',
};

const blogMenu = `<ul><li class="t_menu_home first"><a href="#">홈</a></li><li class="t_menu_category"><a href="#">Backend</a></li><li class="t_menu_category"><a href="#">DevOps</a></li><li class="t_menu_link"><a href="#">Portfolio</a></li><li class="t_menu_guestbook last"><a href="#">방명록</a></li></ul>`;

const categoryList = `<ul class="tt_category"><li class=""><a href="#" class="link_tit">전체 글 <span class="c_cnt">(38)</span></a>
<ul class="category_list">
<li class=""><a href="#" class="link_item">Backend <span class="c_cnt">(19)</span></a>
  <ul class="sub_category_list"><li class=""><a href="#" class="link_sub_item">Spring <span class="c_cnt">(11)</span></a></li><li class=""><a href="#" class="link_sub_item">Security <span class="c_cnt">(4)</span></a></li><li class=""><a href="#" class="link_sub_item">Database <span class="c_cnt">(4)</span></a></li></ul></li>
<li class=""><a href="#" class="link_item">DevOps <span class="c_cnt">(9)</span></a></li>
<li class=""><a href="#" class="link_item">Etc <span class="c_cnt">(10)</span></a></li>
</ul></li></ul>`;

const posts = [
  ['Google OTP를 붙이기 전, 먼저 바꿔야 했던 이해: 외부 사용자 TOTP 2차 인증 구현기', 'Security', 'totp-key', 'QR 코드를 띄우기 전에 시크릿 키를 누가, 언제, 어떻게 보관하는지부터 다시 정리해야 했습니다.', '2026. 11. 12.'],
  ['Flyway는 배포 때 무엇을 실행할까: Schema History로 이해하는 DB 마이그레이션', 'Database', 'flyway-db', 'flyway_schema_history 테이블 한 장으로 배포 시점에 어떤 스크립트가 왜 실행되는지 따라가 봅니다.', '2026. 10. 30.'],
  ['SonarQube Community 도입기', 'DevOps', 'sonar-board', '정적 분석을 CI에 붙이면서 정한 품질 게이트와, 처음 쏟아진 이슈를 정리한 순서.', '2026. 10. 15.'],
  ['[Etc]클라우드 시스템에서 PG 결제 연동을 시작한 경험담 2편', 'Etc', null, '승인과 취소, 그리고 웹훅이 늦게 도착할 때 상태를 어떻게 맞췄는지 이어서 적었습니다.', '2026. 9. 27.'],
  ['[Etc]클라우드 시스템에서 PG 결제 연동을 시작한 경험담 1편', 'Etc', 'pg-card', '결제 연동을 처음 맡았을 때 문서보다 먼저 확인해야 했던 것들.', '2026. 9. 13.'],
  ['WebFlux에서 블로킹 호출이 섞였을 때 생기는 일', 'Spring', 'webflux-flow', '이벤트 루프 스레드 하나가 막히면 전체 응답이 느려집니다. 원인을 찾고 분리한 과정.', '2026. 8. 29.'],
];

const listItems = posts.map(([title, cat, thumb, summary, date]) => ({
  values: {
    list_rep_link: '#', list_rep_title: title, list_rep_category: cat, list_rep_category_link: '#',
    list_rep_regdate: date, list_rep_summary: summary, list_rep_author: 'woonny',
    list_rep_thumbnail: thumb ? `seed:${thumb}` : '',
  },
  blocks: { list_rep_thumbnail: !!thumb },
}));

const mini = (titles) => titles.map((t) => ({ values: { rctps_rep_link: '#', rctps_rep_title: t, rctps_rep_rp_cnt: '', rctps_rep_author: '', rctps_rep_thumbnail: '' }, blocks: { rctps_rep_thumbnail: false } }));

export const common = {
  values: {
    page_title: 'ColdBreWoony — 미리보기',
    title: 'ColdBreWoony',
    blog_link: '#',
    rss_url: '#',
    body_id: 'tt-body-index',
    blog_menu: blogMenu,
    category_list: categoryList,
    image: 'https://github.com/ColdBrewony.png?size=200',
    blogger: 'woonny',
    desc: '전체 구조를 빠르게 파악하고 핵심 문제를 해결하는 백엔드 개발자의 기록',
    count_today: '128', count_yesterday: '342', count_total: '48,210',
    search_name: 'search', search_text: '', search_onclick_submit: 'return false;',
    revenue_list_upper: '', revenue_list_lower: '',
    calendar: '',
  },
  blocks: {
    t3: true, search: true, sidebar: true, sidebar_element: true,
    cover_group: false, list: false, notice_rep: false, page_rep: false, article_protected: false,
    article_rep: false, tag: false, guest: false, paging: false,
    rctps_popular_rep: mini(['클라우드 시스템에서 PG 결제 연동을 시작한 경험담 1편', 'Flyway는 배포 때 무엇을 실행할까', 'Google OTP를 붙이기 전, 먼저 바꿔야 했던 이해', 'SonarQube Community 도입기']),
    rctps_rep: mini(['Google OTP를 붙이기 전, 먼저 바꿔야 했던 이해', 'Flyway는 배포 때 무엇을 실행할까', 'SonarQube Community 도입기']),
    rctrp_rep: [
      { values: { rctrp_rep_link: '#', rctrp_rep_desc: '시크릿 키 암호화는 어떤 방식으로 하셨나요?', rctrp_rep_name: 'dev_kim', rctrp_rep_time: '11.13' } },
      { values: { rctrp_rep_link: '#', rctrp_rep_desc: 'baseline-on-migrate 설명 덕분에 기존 DB에 바로 붙였습니다.', rctrp_rep_name: 'flyer', rctrp_rep_time: '10.31' } },
    ],
    rct_notice: true,
    rct_notice_rep: [{ values: { notice_rep_link: '#', notice_rep_title: '블로그 스킨을 ColdBrewony 테마로 바꿨습니다' } }],
    random_tags: ['Spring', 'WebFlux', 'MSA', 'Kafka', 'Redis', 'Flyway', 'TOTP', 'Kubernetes', 'SonarQube', 'PostgreSQL'].map((t, i) => ({ values: { tag_link: '#', tag_name: t, tag_class: `cloud${(i % 5) + 1}` } })),
    archive_rep: [['2026/11', 2], ['2026/10', 3], ['2026/09', 4]].map(([d, n]) => ({ values: { archive_rep_link: '#', archive_rep_date: d, archive_rep_count: String(n) } })),
    link_rep: [{ values: { link_url: '#', link_site: 'Portfolio — woonny' } }, { values: { link_url: '#', link_site: 'GitHub — ColdBrewony' } }],
  },
};

const articleBody = `
<p>배포 파이프라인에 Flyway를 붙여 두면 애플리케이션이 뜰 때 마이그레이션이 알아서 실행됩니다. 편하지만, 정확히 <strong>무엇을 기준으로</strong> 실행할 스크립트를 고르는지 모르면 운영 DB 앞에서 손이 멈춥니다.</p>
<h2>flyway_schema_history 가 기억하는 것</h2>
<p>Flyway는 실행한 스크립트마다 버전, 설명, 체크섬, 성공 여부를 한 줄씩 남깁니다. 다음 배포 때는 이 표와 classpath 의 스크립트를 비교해 <strong>아직 없는 버전만</strong> 실행합니다.</p>
<pre><code>SELECT installed_rank, version, description, checksum, success
FROM flyway_schema_history
ORDER BY installed_rank;</code></pre>
<p>이미 실행된 스크립트를 고치면 체크섬이 달라져 <code>validate</code> 단계에서 배포가 멈춥니다. 고칠 일이 생기면 새 버전을 추가합니다.</p>
<h3>기존 DB에 처음 붙일 때</h3>
<p>테이블이 이미 있는 DB라면 baseline 을 먼저 찍고, 그 이후 버전부터 관리합니다.</p>
<table><thead><tr><td>설정</td><td>값</td><td>의미</td></tr></thead><tbody><tr><td>baseline-on-migrate</td><td>true</td><td>히스토리 테이블이 없으면 기준점 생성</td></tr><tr><td>baseline-version</td><td>1</td><td>이 버전까지는 이미 적용된 것으로 간주</td></tr><tr><td>out-of-order</td><td>false</td><td>낮은 버전이 늦게 들어오면 거부</td></tr></tbody></table>
<blockquote data-ke-style="style2">마이그레이션 스크립트는 코드처럼 리뷰하고, 한 번 배포된 파일은 고치지 않는다.</blockquote>
<h2>배포 순서에서 주의할 점</h2>
<ul><li>여러 인스턴스가 동시에 뜨면 잠금으로 한 곳만 실행합니다.</li><li>롤백은 자동이 아닙니다. 되돌리는 스크립트를 새 버전으로 씁니다.</li><li>긴 DDL 은 무중단 배포 전략과 함께 계획합니다.</li></ul>
<figure class="imageblock widthContent"><span><img src="https://picsum.photos/seed/flyway-server/1200/720" alt=""></span><figcaption>스크립트는 한 번만, 순서대로.</figcaption></figure>
<h2>정리</h2>
<p>Flyway가 하는 일은 결국 <a href="#">히스토리 표와 파일 목록의 차이</a>를 실행하는 것입니다. 이 한 가지를 알고 나니 배포 로그가 훨씬 덜 무서워졌습니다.</p>
`;

export const pages = [
  {
    file: 'index.html',
    home: true,
    values: {},
    blocks: {
      list: {
        values: { list_conform: '최근 글', list_count: '38', list_style: 'cb-list-default' },
        blocks: { list_rep: listItems },
      },
      paging: {
        values: { prev_page: 'href="#"', no_more_prev: 'no-more-prev', next_page: 'href="#"', no_more_next: '' },
        blocks: { paging_rep: [1, 2, 3, 4].map((n) => ({ values: { paging_rep_link: 'href="#"', paging_rep_link_num: n === 1 ? `<span class="selected">${n}</span>` : `<span>${n}</span>` } })) },
      },
    },
  },
  {
    file: 'post.html',
    home: false,
    values: { body_id: 'tt-body-page' },
    blocks: {
      article_rep: {
        values: {
          article_rep_link: '#', article_rep_title: 'Flyway는 배포 때 무엇을 실행할까: Schema History로 이해하는 DB 마이그레이션',
          article_rep_category: 'Database', article_rep_category_link: '#', article_rep_date: '2026. 10. 30. 21:10',
          article_rep_author: 'woonny', article_rep_desc: articleBody, article_rep_id: '42',
          article_rep_rp_cnt: '2', article_rep_rp_link: '',
        },
        blocks: {
          index_article_rep: false,
          permalink_article_rep: true,
          ad_div: false,
          tag_label: { values: { tag_label_rep: '<a href="#" rel="tag">Flyway</a>, <a href="#" rel="tag">마이그레이션</a>, <a href="#" rel="tag">Spring Boot</a>' } },
          article_related: true,
          article_related_rep: [['PostgreSQL 인덱스, 실행 계획부터 읽기', 'pg-plan', '2026.08.02'], ['JPA 지연 로딩과 N+1, 다시 정리', 'jpa-lazy', '2026.07.18'], ['Redis 캐시 만료 전략 고르기', 'redis-ttl', '2026.06.30']].map(([t, s, d]) => ({
            values: { article_related_rep_link: '#', article_related_rep_title: t, article_related_rep_date: d, article_related_rep_thumbnail_link: `seed:${s}`, article_related_rep_type: '' },
            blocks: { article_related_rep_thumbnail: true },
          })),
          rp: {
            values: {
              rp_input_name: 'name', rp_input_password: 'password', rp_input_homepage: 'homepage', rp_input_is_secret: 'secret',
              rp_input_comment: 'comment', rp_onclick_submit: 'return false;', rp_admin_check: '', guest_name: '', guest_homepage: '',
            },
            blocks: {
              rp_count: true, rp_container: true, rp_input_form: true, rp_member: true, rp_guest: true,
              rp_rep: [
                {
                  values: { rp_rep_id: 'c1', rp_rep_class: '', rp_rep_logo: 'https://picsum.photos/seed/u-flyer/80/80', rp_rep_name: 'flyer', rp_rep_date: '2026.10.31 10:12', rp_rep_desc: 'baseline-on-migrate 설명 덕분에 기존 DB에 바로 붙였습니다. out-of-order 는 운영에서 꺼 두시나요?', rp_rep_onclick_reply: 'return false;', rp_rep_onclick_delete: 'return false;' },
                  blocks: { rp2_container: true, rp2_rep: [{ values: { rp_rep_id: 'c2', rp_rep_name: 'woonny', rp_rep_date: '2026.10.31 12:40', rp_rep_desc: '네, 운영에서는 꺼 두고 버전 충돌은 리뷰 단계에서 잡고 있어요.', rp_rep_logo: 'https://github.com/ColdBrewony.png?size=80' } }] },
                },
                {
                  values: { rp_rep_id: 'c3', rp_rep_class: '', rp_rep_logo: 'https://picsum.photos/seed/u-devkim/80/80', rp_rep_name: 'dev_kim', rp_rep_date: '2026.11.01 08:03', rp_rep_desc: '체크섬 때문에 배포 막혔던 경험이 떠오르네요. repair 명령도 다뤄 주시면 좋겠어요.', rp_rep_onclick_reply: 'return false;', rp_rep_onclick_delete: 'return false;' },
                  blocks: { rp2_container: false },
                },
              ],
            },
          },
        },
      },
    },
  },
];
