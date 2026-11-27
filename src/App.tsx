import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Tv, Globe, Star, ExternalLink, Play, Filter } from 'lucide-react';

interface OTTPlatform {
  id: number;
  name: string;
  country: 'US' | 'KR' | 'CN';
  countryName: string;
  description: string;
  url: string;
  color: string;
  icon: string;
  tags: string[];
}

const platforms: OTTPlatform[] = [
  // 미국 OTT
  {
    id: 1,
    name: 'Netflix',
    country: 'US',
    countryName: '미국',
    description: '전 세계 최대 스트리밍 서비스. 영화, 드라마, 다큐멘터리',
    url: 'https://www.netflix.com',
    color: 'from-red-600 to-red-800',
    icon: '🎬',
    tags: ['영화', '드라마', '다큐멘터리', '애니메이션']
  },
  {
    id: 2,
    name: 'Disney+',
    country: 'US',
    countryName: '미국',
    description: '디즈니, 마블, 스타워즈, 내셔널지오그래픽 콘텐츠',
    url: 'https://www.disneyplus.com',
    color: 'from-blue-600 to-blue-900',
    icon: '🏰',
    tags: ['디즈니', '마블', '스타워즈', '가족']
  },
  {
    id: 3,
    name: 'Max (HBO)',
    country: 'US',
    countryName: '미국',
    description: 'HBO 오리지널, 워너브라더스 영화, DC 콘텐츠',
    url: 'https://www.max.com',
    color: 'from-blue-500 to-indigo-800',
    icon: '🎭',
    tags: ['드라마', '영화', 'DC', 'HBO']
  },
  {
    id: 4,
    name: 'Amazon Prime',
    country: 'US',
    countryName: '미국',
    description: '프라임 오리지널, 영화, TV쇼, 스포츠',
    url: 'https://www.primevideo.com',
    color: 'from-cyan-500 to-blue-700',
    icon: '📦',
    tags: ['영화', '드라마', '스포츠', '오리지널']
  },
  {
    id: 5,
    name: 'Hulu',
    country: 'US',
    countryName: '미국',
    description: '미국 인기 TV쇼, 영화, 오리지널 콘텐츠',
    url: 'https://www.hulu.com',
    color: 'from-green-500 to-green-700',
    icon: '📺',
    tags: ['TV쇼', '영화', '오리지널']
  },
  {
    id: 6,
    name: 'Apple TV+',
    country: 'US',
    countryName: '미국',
    description: '애플 오리지널 프리미엄 콘텐츠',
    url: 'https://tv.apple.com',
    color: 'from-gray-700 to-gray-900',
    icon: '🍎',
    tags: ['오리지널', '프리미엄', '영화']
  },
  {
    id: 7,
    name: 'Paramount+',
    country: 'US',
    countryName: '미국',
    description: '파라마운트 영화, CBS, MTV, Comedy Central',
    url: 'https://www.paramountplus.com',
    color: 'from-blue-400 to-blue-700',
    icon: '⭐',
    tags: ['영화', 'CBS', 'MTV', '뉴스']
  },
  {
    id: 8,
    name: 'Peacock',
    country: 'US',
    countryName: '미국',
    description: 'NBC유니버설 콘텐츠, 스포츠, 뉴스',
    url: 'https://www.peacocktv.com',
    color: 'from-yellow-400 to-red-600',
    icon: '🦚',
    tags: ['NBC', '스포츠', '뉴스', '영화']
  },
  // 한국 OTT
  {
    id: 9,
    name: 'Wavve (웨이브)',
    country: 'KR',
    countryName: '한국',
    description: '지상파 3사 콘텐츠 + 오리지널 드라마/예능',
    url: 'https://www.wavve.com',
    color: 'from-purple-500 to-purple-800',
    icon: '🌊',
    tags: ['지상파', '드라마', '예능', '오리지널']
  },
  {
    id: 10,
    name: 'TVING (티빙)',
    country: 'KR',
    countryName: '한국',
    description: 'CJ ENM 계열, tvN/JTBC 콘텐츠 + 오리지널',
    url: 'https://www.tving.com',
    color: 'from-red-500 to-pink-700',
    icon: '📡',
    tags: ['tvN', 'JTBC', '예능', '드라마']
  },
  {
    id: 11,
    name: 'Coupang Play',
    country: 'KR',
    countryName: '한국',
    description: '쿠팡플레이 오리지널, 스포츠, 해외 콘텐츠',
    url: 'https://www.coupangplay.com',
    color: 'from-blue-500 to-indigo-700',
    icon: '🚀',
    tags: ['오리지널', '스포츠', '영화', '예능']
  },
  {
    id: 12,
    name: 'Watcha (왓챠)',
    country: 'KR',
    countryName: '한국',
    description: '개인화 추천 기반 영화/드라마 스트리밍',
    url: 'https://watcha.com',
    color: 'from-teal-500 to-teal-700',
    icon: '🎯',
    tags: ['영화', '드라마', '추천', '독립영화']
  },
  {
    id: 13,
    name: 'Series On (시리즈온)',
    country: 'KR',
    countryName: '한국',
    description: '네이버 계열, MBC/채널A 콘텐츠',
    url: 'https://serieson.naver.com',
    color: 'from-green-500 to-emerald-700',
    icon: '🟢',
    tags: ['MBC', '채널A', '드라마', '예능']
  },
  {
    id: 14,
    name: 'Laftel (라프텔)',
    country: 'KR',
    countryName: '한국',
    description: '애니메이션 전문 스트리밍 서비스',
    url: 'https://laftel.net',
    color: 'from-pink-500 to-rose-700',
    icon: '🎌',
    tags: ['애니메이션', '일본애니', '오리지널']
  },
  // 중국 OTT
  {
    id: 15,
    name: 'iQiyi (아이치이)',
    country: 'CN',
    countryName: '중국',
    description: '중국 최대 스트리밍, 드라마/예능/영화',
    url: 'https://www.iqiyi.com',
    color: 'from-green-400 to-green-700',
    icon: '🐉',
    tags: ['중국드라마', '예능', '영화', '애니']
  },
  {
    id: 16,
    name: 'Youku (요우쿠)',
    country: 'CN',
    countryName: '중국',
    description: '알리바바 계열, 드라마/영화/다큐멘터리',
    url: 'https://www.youku.com',
    color: 'from-blue-400 to-blue-700',
    icon: '🎎',
    tags: ['중국드라마', '영화', '다큐', '예능']
  },
  {
    id: 17,
    name: 'Tencent Video (텐센트)',
    country: 'CN',
    countryName: '중국',
    description: '텐센트 계열, 드라마/영화/애니메이션',
    url: 'https://v.qq.com',
    color: 'from-orange-400 to-orange-700',
    icon: '🐧',
    tags: ['중국드라마', '영화', '동화', 'BL']
  },
  {
    id: 18,
    name: 'Bilibili (빌리빌리)',
    country: 'CN',
    countryName: '중국',
    description: '영상 커뮤니티, 애니메이션, 게임, 덕후 콘텐츠',
    url: 'https://www.bilibili.com',
    color: 'from-pink-400 to-pink-700',
    icon: '📱',
    tags: ['애니메이션', '게임', '커뮤니티', 'UGC']
  },
  {
    id: 19,
    name: 'Mango TV (망고TV)',
    country: 'CN',
    countryName: '중국',
    description: '후난위성TV 계열, 예능/드라마 전문',
    url: 'https://www.mgtv.com',
    color: 'from-yellow-400 to-orange-600',
    icon: '🥭',
    tags: ['예능', '드라마', '후난TV']
  },
  {
    id: 20,
    name: 'Sohu Video (소후)',
    country: 'CN',
    countryName: '중국',
    description: '소후 계열, 드라마/영화/뉴스 콘텐츠',
    url: 'https://tv.sohu.com',
    color: 'from-red-400 to-red-700',
    icon: '🦊',
    tags: ['드라마', '영화', '뉴스', '다큐']
  },
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'US' | 'KR' | 'CN'>('all');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filteredPlatforms = useMemo(() => {
    return platforms.filter((platform) => {
      const matchesSearch =
        platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        platform.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        platform.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = activeFilter === 'all' || platform.country === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  const filterButtons = [
    { key: 'all' as const, label: '전체', icon: <Globe size={16} />, count: platforms.length },
    { key: 'US' as const, label: '🇺🇸 미국', icon: null, count: platforms.filter(p => p.country === 'US').length },
    { key: 'KR' as const, label: '🇰🇷 한국', icon: null, count: platforms.filter(p => p.country === 'KR').length },
    { key: 'CN' as const, label: '🇨🇳 중국', icon: null, count: platforms.filter(p => p.country === 'CN').length },
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
              <p className="text-xs text-gray-400">바로보는 OTT 플랫폼</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
            <Star size={14} className="text-yellow-400" />
            <span>테스트 버전</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            모든 OTT를 <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">한 곳에서</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg mb-8"
          >
            미국, 한국, 중국의 OTT 플랫폼을 가입 없이 바로 확인하세요
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
              placeholder="플랫폼 이름, 콘텐츠 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
            />
          </motion.div>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {filterButtons.map((btn) => (
            <motion.button
              key={btn.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(btn.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === btn.key
                  ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-lg shadow-violet-500/25'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {btn.icon}
              <span>{btn.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeFilter === btn.key ? 'bg-white/20' : 'bg-white/10'
              }`}>
                {btn.count}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Platform Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter + searchTerm}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filteredPlatforms.map((platform, index) => (
              <motion.a
                key={platform.id}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onHoverStart={() => setHoveredId(platform.id)}
                onHoverEnd={() => setHoveredId(null)}
                className="group relative block rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02] hover:border-white/20 transition-all duration-300"
              >
                {/* Card Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative p-5">
                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{platform.icon}</div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300">
                        {platform.countryName}
                      </span>
                      <motion.div
                        animate={{ x: hoveredId === platform.id ? 0 : -5, opacity: hoveredId === platform.id ? 1 : 0 }}
                        className="text-violet-400"
                      >
                        <ExternalLink size={14} />
                      </motion.div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-violet-300 transition-colors">
                    {platform.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {platform.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {platform.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-gray-400 border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Play Button Overlay */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: hoveredId === platform.id ? 1 : 0,
                      scale: hoveredId === platform.id ? 1 : 0.5
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="bg-gradient-to-r from-violet-500 to-pink-500 p-3 rounded-full shadow-lg shadow-violet-500/30">
                      <Play size={20} className="text-white fill-white" />
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="h-1 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredPlatforms.length === 0 && (
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

      {/* Footer */}
      <footer className="border-t border-white/5 bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-violet-500 to-pink-500 p-1.5 rounded-lg">
                <Tv size={16} className="text-white" />
              </div>
              <span className="font-bold text-gray-300">baroOTT</span>
            </div>
            <p className="text-sm text-gray-500 text-center">
              ⚠️ 본 사이트는 테스트 목적으로 제작되었습니다. 각 OTT 플랫폼의 콘텐츠는 해당 서비스의 이용약관을 따릅니다.
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
