import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Tv, X, Play, Star, Calendar, Clock, Globe, ChevronRight, Film, TrendingUp } from 'lucide-react';

interface Content {
  id: number;
  title: string;
  titleLocal: string;
  country: 'US' | 'KR' | 'CN';
  countryName: string;
  year: number;
  rating: number;
  duration: string;
  genre: string[];
  description: string;
  poster: string;
  videoId: string; // YouTube video ID
  platform: string;
  type: 'movie' | 'drama' | 'variety' | 'anime';
}

const contents: Content[] = [
  // 미국 콘텐츠
  {
    id: 1,
    title: 'Stranger Things',
    titleLocal: '스트레인저 씽스',
    country: 'US',
    countryName: '미국',
    year: 2022,
    rating: 8.7,
    duration: '55분/에피소드',
    genre: ['SF', '호러', '드라마'],
    description: '작은 마을에서 사라진 소년과 기이한 사건들. 우정, 비밀, 초자연적 현상이 뒤섞인 모험.',
    poster: 'https://image.tmdb.org/t/p/w500/56v2KjBlYj0Qp89kdFSMiXJaFyT.jpg',
    videoId: 'b9EkMc79ZSU',
    platform: 'Netflix',
    type: 'drama'
  },
  {
    id: 2,
    title: 'The Witcher',
    titleLocal: '위쳐',
    country: 'US',
    countryName: '미국',
    year: 2023,
    rating: 8.2,
    duration: '60분/에피소드',
    genre: ['판타지', '액션', '모험'],
    description: '변이된 몬스터 헌터 리비아의 게랄트가 운명에 얽힌 인물들과 만나며 펼쳐지는 대륙의 이야기.',
    poster: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg',
    videoId: 'ndl1W4ltcmg',
    platform: 'Netflix',
    type: 'drama'
  },
  {
    id: 3,
    title: 'Wednesday',
    titleLocal: '웬즈데이',
    country: 'US',
    countryName: '미국',
    year: 2022,
    rating: 8.1,
    duration: '45분/에피소드',
    genre: ['미스터리', '코미디', '판타지'],
    description: '애덤스 패밀리의 딸 웬즈데이 애덤스가 네버모어 아카데미에서 벌이는 미스터리와 성장 이야기.',
    poster: 'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg',
    videoId: 'Di310WS8zLk',
    platform: 'Netflix',
    type: 'drama'
  },
  {
    id: 4,
    title: 'The Mandalorian',
    titleLocal: '만달로리안',
    country: 'US',
    countryName: '미국',
    year: 2023,
    rating: 8.7,
    duration: '40분/에피소드',
    genre: ['SF', '액션', '모험'],
    description: '은하계의 외진 곳에서 한 현상금 사냥꾼이 아기 그로그와 함께 떠나는 모험.',
    poster: 'https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdUBGzRi.jpg',
    videoId: 'aOC8E8z_ifw',
    platform: 'Disney+',
    type: 'drama'
  },
  {
    id: 5,
    title: 'House of the Dragon',
    titleLocal: '하우스 오브 드래곤',
    country: 'US',
    countryName: '미국',
    year: 2024,
    rating: 8.4,
    duration: '60분/에피소드',
    genre: ['판타지', '드라마', '액션'],
    description: '게임 오브 스론스 200년 전, 타르가리안 가문의 피비린내 나는 내전 이야기.',
    poster: 'https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg',
    videoId: 'DotnHvMvVl8',
    platform: 'Max',
    type: 'drama'
  },
  {
    id: 6,
    title: 'The Last of Us',
    titleLocal: '라스트 오브 어스',
    country: 'US',
    countryName: '미국',
    year: 2023,
    rating: 8.8,
    duration: '55분/에피소드',
    genre: ['드라마', 'SF', '스릴러'],
    description: '문명 붕괴 후 살아남은 조엘과 엘리의 생존 여정. 희망과 절망이 교차하는 감동 서사.',
    poster: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
    videoId: 'uLtkt8BonwM',
    platform: 'Max',
    type: 'drama'
  },
  // 한국 콘텐츠
  {
    id: 7,
    title: 'Squid Game',
    titleLocal: '오징어 게임',
    country: 'KR',
    countryName: '한국',
    year: 2021,
    rating: 8.0,
    duration: '60분/에피소드',
    genre: ['스릴러', '드라마', '서바이벌'],
    description: '거액의 상금이 걸린 의문의 서바이벌 게임에 참가한 사람들이 목숨을 걸고 경쟁하는 이야기.',
    poster: 'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg',
    videoId: 'oqxAJKy0ii4',
    platform: 'Netflix',
    type: 'drama'
  },
  {
    id: 8,
    title: 'Moving',
    titleLocal: '무빙',
    country: 'KR',
    countryName: '한국',
    year: 2023,
    rating: 8.6,
    duration: '50분/에피소드',
    genre: ['액션', '드라마', 'SF'],
    description: '초능력을 숨긴 채 살아온 부모들과 물려받은 비밀을 간직한 청소년들의 액션 히어로물.',
    poster: 'https://image.tmdb.org/t/p/w500/b2S1vWz0iKjSjFpGMlTOeA7Uqen.jpg',
    videoId: 'NqoevNG7Fi8',
    platform: 'Disney+',
    type: 'drama'
  },
  {
    id: 9,
    title: 'The Glory',
    titleLocal: '더 글로리',
    country: 'KR',
    countryName: '한국',
    year: 2023,
    rating: 8.1,
    duration: '55분/에피소드',
    genre: ['드라마', '복수', '스릴러'],
    description: '학교 폭력으로 인생이 파괴된 여자가 17년 만에 가해자들에게 치밀한 복수를 시작한다.',
    poster: 'https://image.tmdb.org/t/p/w500/oeHY3VY0KRxmjHWSXPE1vCPqUBi.jpg',
    videoId: 'ocg5L0sAjfs',
    platform: 'Netflix',
    type: 'drama'
  },
  {
    id: 10,
    title: 'Reborn Rich',
    titleLocal: '재벌집 막내아들',
    country: 'KR',
    countryName: '한국',
    year: 2022,
    rating: 8.3,
    duration: '65분/에피소드',
    genre: ['판타지', '드라마', '시대'],
    description: '재벌가 비서실장이 재벌 막내아들로 타임슬립해 인생을 다시 사는 판타지 드라마.',
    poster: 'https://image.tmdb.org/t/p/w500/1bG3wVxN8KjSM7qL7x3mR2pQzY.jpg',
    videoId: 'K3X7nMfGxYQ',
    platform: 'TVING',
    type: 'drama'
  },
  {
    id: 11,
    title: 'Physical: 100',
    titleLocal: '피지컬: 100',
    country: 'KR',
    countryName: '한국',
    year: 2023,
    rating: 7.8,
    duration: '70분/에피소드',
    genre: ['예능', '서바이벌', '스포츠'],
    description: '완벽한 신체를 가진 100인이 가장 강력한 몸을 찾기 위해 벌이는 피지컬 서바이벌.',
    poster: 'https://image.tmdb.org/t/p/w500/9sVFlFKGKzr7yJjRqJKmP0tDMrQ.jpg',
    videoId: 'VjR-oiFIlAA',
    platform: 'TVING',
    type: 'variety'
  },
  {
    id: 12,
    title: 'Decision to Leave',
    titleLocal: '헤어질 결심',
    country: 'KR',
    countryName: '한국',
    year: 2022,
    rating: 7.6,
    duration: '138분',
    genre: ['로맨스', '미스터리', '드라마'],
    description: '산악 사고 수사를 맡은 형사가 고인의 아내를 만나면서 벌어지는 미스터리 로맨스.',
    poster: 'https://image.tmdb.org/t/p/w500/u+2F2vE8wOjFqK1Z3yJjIhZ5qBx.jpg',
    videoId: 'YhTMKz93m8o',
    platform: 'Watcha',
    type: 'movie'
  },
  // 중국 콘텐츠
  {
    id: 13,
    title: 'The Untamed',
    titleLocal: '진정령 (The Untamed)',
    country: 'CN',
    countryName: '중국',
    year: 2019,
    rating: 8.5,
    duration: '45분/에피소드',
    genre: ['판타지', '무협', '드라마'],
    description: '두 수련자가 기이한 사건을 해결하며 우정을 쌓아가는 중국 판타지 무협 드라마.',
    poster: 'https://image.tmdb.org/t/p/w500/A9GVMouFrUaMSD5x3KRFiXaBYzp.jpg',
    videoId: 'yEnriVFc1j4',
    platform: 'Tencent Video',
    type: 'drama'
  },
  {
    id: 14,
    title: 'Nirvana in Fire',
    titleLocal: '낭아방 (Nirvana in Fire)',
    country: 'CN',
    countryName: '중국',
    year: 2015,
    rating: 9.1,
    duration: '45분/에피소드',
    genre: ['사극', '전략', '드라마'],
    description: '무명 전략가가 복수를 위해 황제의 궁정에 들어가 벌어지는 두뇌 게임과 정치적 음모.',
    poster: 'https://image.tmdb.org/t/p/w500/mWnUEP8VnQ3f7GwSjFj8tL3xZzR.jpg',
    videoId: 'c2VxGNFtQnE',
    platform: 'iQiyi',
    type: 'drama'
  },
  {
    id: 15,
    title: 'Story of Yanxi Palace',
    titleLocal: '연희공략',
    country: 'CN',
    countryName: '중국',
    year: 2018,
    rating: 8.0,
    duration: '45분/에피소드',
    genre: ['사극', '로맨스', '드라마'],
    description: '청나라 건륭제 시절, 자매의 죽음을 파헤치기 위해 궁에 들어간 여인의 이야기.',
    poster: 'https://image.tmdb.org/t/p/w500/x2r3J2QY5n3m5tHJlGkC9VxNqen.jpg',
    videoId: 's6pZ6BrWx8E',
    platform: 'iQiyi',
    type: 'drama'
  },
  {
    id: 16,
    title: 'The Long Season',
    titleLocal: '만漫长季节 (만漫长的季节)',
    country: 'CN',
    countryName: '중국',
    year: 2023,
    rating: 9.0,
    duration: '50분/에피소드',
    genre: ['미스터리', '드라마', '시대'],
    description: '중국 동북부 공업도시에서 20년에 걸친 연쇄 사건을 파헤치는 3명의 노년의 이야기.',
    poster: 'https://image.tmdb.org/t/p/w500/5BhrjxJfPzK1fN7x8VqJ3m2nL4R.jpg',
    videoId: 'WqvdR8mJLsQ',
    platform: 'Tencent Video',
    type: 'drama'
  },
  {
    id: 17,
    title: 'Word of Honor',
    titleLocal: '산하령 (Word of Honor)',
    country: 'CN',
    countryName: '중국',
    year: 2021,
    rating: 8.2,
    duration: '45분/에피소드',
    genre: ['무협', '판타지', '드라마'],
    description: '은퇴한 암살 조직 보스가 우연히 만난 청년과 함께 강호의 비밀을 파헤치는 무협물.',
    poster: 'https://image.tmdb.org/t/p/w500/kT1VUvq8PnX0Hl3Nq5yF7xM2rLs.jpg',
    videoId: 'rW3M1jQ4bYk',
    platform: 'Youku',
    type: 'drama'
  },
  {
    id: 18,
    title: 'Heaven Official\'s Blessing',
    titleLocal: '천관사복 (천관사)',
    country: 'CN',
    countryName: '중국',
    year: 2023,
    rating: 8.4,
    duration: '25분/에피소드',
    genre: ['애니메이션', '판타지', 'BL'],
    description: '세 번 신계에서 추방된 태자가 귀곡의 신비한 귀신과 만나 펼치는 판타지 로맨스.',
    poster: 'https://image.tmdb.org/t/p/w500/nGjU6Xp7K9m3Lq1N2p4r5sT8vWx.jpg',
    videoId: 'YkXbFj325Tk',
    platform: 'Bilibili',
    type: 'anime'
  },
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'US' | 'KR' | 'CN'>('all');
  const [activeType, setActiveType] = useState<'all' | 'movie' | 'drama' | 'variety' | 'anime'>('all');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  const filteredContents = useMemo(() => {
    return contents.filter((content) => {
      const matchesSearch =
        content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.titleLocal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCountry = activeFilter === 'all' || content.country === activeFilter;
      const matchesType = activeType === 'all' || content.type === activeType;
      return matchesSearch && matchesCountry && matchesType;
    });
  }, [searchTerm, activeFilter, activeType]);

  const countryFilters = [
    { key: 'all' as const, label: '전체', flag: '🌍', count: contents.length },
    { key: 'US' as const, label: '미국', flag: '🇺🇸', count: contents.filter(c => c.country === 'US').length },
    { key: 'KR' as const, label: '한국', flag: '🇰🇷', count: contents.filter(c => c.country === 'KR').length },
    { key: 'CN' as const, label: '중국', flag: '🇨🇳', count: contents.filter(c => c.country === 'CN').length },
  ];

  const typeFilters = [
    { key: 'all' as const, label: '전체', icon: <Globe size={14} /> },
    { key: 'movie' as const, label: '영화', icon: <Film size={14} /> },
    { key: 'drama' as const, label: '드라마', icon: <Tv size={14} /> },
    { key: 'variety' as const, label: '예능', icon: <Star size={14} /> },
    { key: 'anime' as const, label: '애니', icon: <TrendingUp size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-950/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              className="bg-gradient-to-r from-violet-500 to-pink-500 p-2 rounded-xl"
            >
              <Tv size={24} className="text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                baroOTT
              </h1>
              <p className="text-xs text-gray-400">가입없이 바로보기</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>테스트 버전</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 py-10 text-center relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold mb-3"
          >
            지금 바로 <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">시청</span>하세요
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-base md:text-lg mb-8"
          >
            미국 · 한국 · 중국 OTT 콘텐츠를 가입 없이 바로 감상
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto relative"
          >
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="제목, 장르, 설명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
            />
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 mb-6">
        {/* Country Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {countryFilters.map((btn) => (
            <motion.button
              key={btn.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(btn.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === btn.key
                  ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-lg shadow-violet-500/25'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <span>{btn.flag}</span>
              <span>{btn.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeFilter === btn.key ? 'bg-white/20' : 'bg-white/10'
              }`}>
                {btn.count}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          {typeFilters.map((btn) => (
            <motion.button
              key={btn.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveType(btn.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeType === btn.key
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
              }`}
            >
              {btn.icon}
              <span>{btn.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter + activeType + searchTerm}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {filteredContents.map((content, index) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ y: -8, scale: 1.03 }}
                onClick={() => setSelectedContent(content)}
                className="group cursor-pointer relative rounded-xl overflow-hidden bg-white/[0.02] border border-white/5 hover:border-violet-500/30 transition-all duration-300"
              >
                {/* Poster */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={content.poster}
                    alt={content.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x450/1a1a2e/ffffff?text=${encodeURIComponent(content.titleLocal)}`;
                    }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1.1 }}
                      className="bg-gradient-to-r from-violet-500 to-pink-500 p-4 rounded-full shadow-lg shadow-violet-500/40"
                    >
                      <Play size={24} className="text-white fill-white" />
                    </motion.div>
                  </div>
                  {/* Country Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white border border-white/10">
                      {content.country === 'US' ? '🇺🇸' : content.country === 'KR' ? '🇰🇷' : '🇨🇳'}
                    </span>
                  </div>
                  {/* Rating */}
                  <div className="absolute top-2 right-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/90 text-black font-bold flex items-center gap-0.5">
                      <Star size={10} className="fill-black" />
                      {content.rating}
                    </span>
                  </div>
                  {/* Platform */}
                  <div className="absolute bottom-2 left-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-gray-200 border border-white/10">
                      {content.platform}
                    </span>
                  </div>
                </div>
                {/* Info */}
                <div className="p-3">
                  <h3 className="text-sm font-bold text-white truncate group-hover:text-violet-300 transition-colors">
                    {content.titleLocal}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{content.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                      <Calendar size={10} />
                      {content.year}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                      <Clock size={10} />
                      {content.duration}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredContents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">검색 결과가 없습니다</p>
            <p className="text-gray-500 text-sm mt-2">다른 키워드로 검색해보세요</p>
          </motion.div>
        )}
      </section>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedContent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-5xl bg-gray-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video Player */}
              <div className="relative aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedContent.videoId}?autoplay=1&rel=0`}
                  title={selectedContent.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                {/* Close Button */}
                <button
                  onClick={() => setSelectedContent(null)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 p-2 rounded-full transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              {/* Content Info */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        {selectedContent.platform}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                        {selectedContent.country === 'US' ? '🇺🇸 미국' : selectedContent.country === 'KR' ? '🇰🇷 한국' : '🇨🇳 중국'}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {selectedContent.titleLocal}
                    </h2>
                    <p className="text-sm text-gray-400 mb-3">{selectedContent.title}</p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {selectedContent.description}
                    </p>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-sm text-gray-400">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-semibold">{selectedContent.rating}</span>
                    <span>/10</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-400">
                    <Calendar size={14} />
                    <span>{selectedContent.year}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-400">
                    <Clock size={14} />
                    <span>{selectedContent.duration}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedContent.genre.map((g) => (
                      <span key={g} className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5">
                        #{g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-violet-500 to-pink-500 p-1.5 rounded-lg">
                <Tv size={16} className="text-white" />
              </div>
              <span className="font-bold text-gray-300">baroOTT</span>
            </div>
            <p className="text-xs text-gray-500 text-center">
              ⚠️ 테스트용 사이트입니다. 영상은 YouTube 프리뷰/트레일러를 제공합니다.
            </p>
            <p className="text-xs text-gray-600">
              © 2026 baroOTT Test
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
