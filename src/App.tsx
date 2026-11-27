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
  duration: string;
  genre: string[];
  description: string;
  videoId: string; // YouTube 영상 ID (공식 채널 또는 저작권 만료 작품)
  source: string; // 업로드한 YouTube 채널
  license: 'official' | 'public-domain';
  type: 'movie' | 'drama';
}

// 포스터는 해당 YouTube 영상의 썸네일을 사용 (항상 존재하는 이미지)
const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

// 2026-11-28 기준 한국에서 임베드 재생(연령 제한·지역 차단 없음)을 직접 확인한 목록
const contents: Content[] = [
  // ── 한국: 한국영상자료원 공식 채널(한국고전영화) ──
  { id: 2, title: "Sisters' Garden", titleLocal: '자매의 화원', country: 'KR', countryName: '한국', year: 1959, duration: '120분', genre: ['멜로', '고전', '4K'], description: '신상옥 감독의 1959년작 멜로드라마. 4K 복원판.', videoId: 'AxraJIX5PQI', source: '한국고전영화 Korean Classic Film', license: 'official', type: 'movie' },
  { id: 3, title: 'A Happy Businesswoman', titleLocal: '또순이', country: 'KR', countryName: '한국', year: 1963, duration: '93분', genre: ['코미디', '고전'], description: '부제 "행복의 탄생". 억척스럽고 생활력 강한 여성 또순이의 성공기를 그린 코미디.', videoId: 'hc2BqMbb2EA', source: '한국고전영화 Korean Classic Film', license: 'official', type: 'movie' },

  // ── 한국: 방송사 공식 채널 (몰아보기·요약본) ──
  { id: 7, title: 'Jewel in the Palace (Ep.1-4)', titleLocal: '대장금 1~4회 몰아보기', country: 'KR', countryName: '한국', year: 2003, duration: '150분', genre: ['사극', '드라마'], description: 'MBC 사극 「대장금」 1~4회를 이어 붙인 공식 몰아보기 영상.', videoId: 'JzAOM5EvsX4', source: '옛드 (MBC 공식)', license: 'official', type: 'drama' },
  { id: 8, title: 'Moon of Seoul (Ep.1-3)', titleLocal: '서울의 달 1~3회 몰아보기', country: 'KR', countryName: '한국', year: 1994, duration: '74분', genre: ['드라마'], description: '최민식·한석규 주연 MBC 드라마 「서울의 달」 1~3회 공식 몰아보기.', videoId: '5eh8aL2Vr30', source: '옛드 (MBC 공식)', license: 'official', type: 'drama' },
  { id: 9, title: 'Summer Scent (Ep.1-4 요약)', titleLocal: '여름향기 1~4회 요약', country: 'KR', countryName: '한국', year: 2003, duration: '43분', genre: ['멜로', '드라마'], description: 'KBS 드라마 「여름향기」 1~4회를 40분으로 요약한 공식 영상.', videoId: '2I388WYbr4U', source: 'KBS Drama Classic', license: 'official', type: 'drama' },
  { id: 10, title: 'Stairway to Heaven (Ep.1-6 요약)', titleLocal: '천국의 계단 1~6회 정주행', country: 'KR', countryName: '한국', year: 2003, duration: '64분', genre: ['멜로', '드라마'], description: 'SBS 드라마 「천국의 계단」 1~6회를 한 번에 보는 공식 요약 영상.', videoId: 'aasYVxGlXds', source: 'SBS', license: 'official', type: 'drama' },

  // ── 중국: 제작사·플랫폼 공식 채널 ──
  { id: 12, title: 'The Untamed EP01', titleLocal: '진정령 1화', country: 'CN', countryName: '중국', year: 2019, duration: '42분', genre: ['판타지', '무협'], description: '샤오잔·왕이보 주연 무협 판타지. 텐센트 공식 채널 영어자막판 1화.', videoId: 'BfKhREVFLkQ', source: '腾讯视频 WeTV (공식)', license: 'official', type: 'drama' },

  // ── 미국: 저작권 만료(퍼블릭 도메인) 고전 영화 ──
  { id: 14, title: 'Night of the Living Dead', titleLocal: '살아있는 시체들의 밤', country: 'US', countryName: '미국', year: 1968, duration: '95분', genre: ['호러', '고전'], description: '조지 A. 로메로 감독의 좀비 영화 원조. 저작권이 만료된 퍼블릭 도메인 작품.', videoId: 'H91BxkBXttE', source: 'Timeless Classic Movies', license: 'public-domain', type: 'movie' },
  { id: 15, title: 'The General', titleLocal: '제너럴', country: 'US', countryName: '미국', year: 1926, duration: '79분', genre: ['코미디', '무성영화'], description: '버스터 키튼의 무성 코미디 걸작. 남북전쟁 중 기관차를 되찾으려는 기관사의 활약. 퍼블릭 도메인.', videoId: 'D_UdtS-8QS0', source: 'Laurel & Hardy', license: 'public-domain', type: 'movie' },
  { id: 16, title: 'His Girl Friday', titleLocal: '연인 프라이데이', country: 'US', countryName: '미국', year: 1940, duration: '92분', genre: ['코미디', '고전'], description: '하워드 혹스 감독, 캐리 그랜트 주연의 스크루볼 코미디. 퍼블릭 도메인.', videoId: 'kmYcT5gT6a4', source: 'Retrospective - Classic Movies', license: 'public-domain', type: 'movie' },
  { id: 17, title: 'Charade', titleLocal: '샤레이드', country: 'US', countryName: '미국', year: 1963, duration: '113분', genre: ['미스터리', '로맨스'], description: '오드리 헵번·캐리 그랜트 주연 로맨틱 미스터리. 퍼블릭 도메인.', videoId: '-uc86VH8hdA', source: 'FEATURE FILM', license: 'public-domain', type: 'movie' },
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'US' | 'KR' | 'CN'>('all');
  const [activeType, setActiveType] = useState<'all' | 'movie' | 'drama'>('all');
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
              <p className="text-xs text-gray-400">공식 무료 콘텐츠 모음</p>
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
            공식 채널에 무료 공개된 한국 · 중국 작품과 저작권이 만료된 미국 고전 영화
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
                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-violet-900/40 to-gray-900">
                  <img
                    src={thumb(content.videoId)}
                    alt={content.titleLocal}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      // 썸네일이 없으면 이미지 숨기고 배경 그라데이션만 표시
                      (e.target as HTMLImageElement).style.visibility = 'hidden';
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
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/90 text-black font-bold">
                      {content.license === 'official' ? '공식' : 'PD'}
                    </span>
                  </div>
                  {/* Platform */}
                  <div className="absolute bottom-2 left-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-gray-200 border border-white/10">
                      {content.type === 'movie' ? '영화' : '드라마'}
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
                        {selectedContent.license === 'official' ? '공식 채널' : '퍼블릭 도메인'}
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
                  <a
                    href={`https://www.youtube.com/watch?v=${selectedContent.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white"
                  >
                    <ChevronRight size={14} />
                    <span>출처: {selectedContent.source} (YouTube에서 보기)</span>
                  </a>
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
              모든 영상은 권리자 공식 YouTube 채널 또는 저작권 만료(퍼블릭 도메인) 작품을 YouTube 임베드로 재생합니다.
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
