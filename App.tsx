
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Search, Home, User, Bell, Play, Info, Download, 
  Plus, Star, ChevronLeft, ChevronRight, Menu, X, 
  LogOut, UploadCloud, Film, Settings, WifiOff, Globe,
  Clock, Activity, CheckCircle, Pause, AlertTriangle, Lock,
  LayoutDashboard, Users, FileVideo, BarChart3, Mail, Loader2,
  Eye, EyeOff, Edit3, Save, Smartphone, Laptop, Tv, Trash2, Maximize, Share2, ThumbsUp, Camera, CreditCard,
  Sparkles, Zap, Heart, Smile, Frown, Coffee, Filter, ArrowRight, MapPin, Navigation, MoreVertical, Shield, Wifi, Bookmark,
  Image as ImageIcon, FileUp, MonitorPlay, Check, AlertCircle, Youtube, Layers, Tag, TrendingUp, PieChart, DollarSign, Calendar
} from 'lucide-react';
import { MOCK_MOVIES, GENRES_LIST, LANGUAGES_LIST } from './constants';
import { Movie, ViewState, Language, Genre, Quality, DownloadTask, User as UserType } from './types';
import { generateMovieMetadata, getNearbyCinemas } from './services/geminiService';

// --- STYLES & ANIMATIONS ---
const TILT_CARD_CSS = `
  .tilt-card {
    transition: transform 0.1s ease-out;
    transform-style: preserve-3d;
  }
  .tilt-card:hover {
    transform: perspective(1000px) rotateX(var(--rotateX)) rotateY(var(--rotateY)) scale(1.05);
    z-index: 50;
  }
  .glass-panel {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
  /* Focus styles for accessibility */
  button:focus-visible, a:focus-visible, input:focus-visible, [role="button"]:focus-visible, [tabindex="0"]:focus-visible, [role="slider"]:focus-visible {
    outline: 2px solid #8b5cf6;
    outline-offset: 2px;
  }
  .cursor-wait {
    cursor: wait;
  }
`;

// --- UTILS ---
const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    action();
  }
};

// --- COMPONENTS ---

// 0. Splash Screen
const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-[100] animate-in fade-in duration-700" role="presentation">
      <div className="relative">
        <div className="absolute inset-0 bg-violet-600 blur-[60px] opacity-20 rounded-full animate-pulse"></div>
        <Film className="h-24 w-24 text-violet-500 relative z-10 animate-bounce" style={{ animationDuration: '2s' }} aria-hidden="true" />
      </div>
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-emerald-400 mt-6 tracking-widest uppercase">
        Universal Movies Hub
      </h1>
      <p className="text-slate-500 mt-2 tracking-widest text-sm animate-pulse">PREMIUM CINEMA EXPERIENCE</p>
    </div>
  );
};

// 0.1 Onboarding Modal
const OnboardingModal: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [step, setStep] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const steps = [
    { title: "Welcome to UMH", desc: "Premium cinema, diverse languages, and curated content.", icon: <Film className="h-12 w-12 text-violet-500" />, color: "from-violet-500/30 to-purple-500/30" },
    { title: "Build Your Watchlist", desc: "Tap the Plus (+) to save movies for later.", icon: <Plus className="h-12 w-12 text-emerald-400" />, color: "from-emerald-500/30 to-teal-500/30" },
    { title: "Watch Offline", desc: "Download in 4K or 1080p for travel.", icon: <Download className="h-12 w-12 text-blue-400" />, color: "from-blue-500/30 to-cyan-500/30" },
    { title: "Find Your Vibe", desc: "Use AI Mood Explorer to find the perfect film.", icon: <Sparkles className="h-12 w-12 text-amber-400" />, color: "from-amber-500/30 to-orange-500/30" }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) { setStep(step + 1); } else { onFinish(); }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300" role="dialog" aria-modal="true" ref={modalRef} tabIndex={-1}>
      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-sm p-8 relative overflow-hidden shadow-2xl mx-4">
        <button onClick={onFinish} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-20"><X className="w-5 h-5" /></button>
        <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${steps[step].color} blur-[60px] opacity-50 pointer-events-none transition-colors duration-500`}></div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="bg-slate-950/80 p-5 rounded-2xl shadow-xl border border-white/5 mb-2 animate-in zoom-in duration-300 key={step}">{steps[step].icon}</div>
          <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-300 key={step}-text min-h-[5rem]"><h2 id="onboarding-title" className="text-xl font-bold text-white">{steps[step].title}</h2><p className="text-slate-300 text-sm leading-relaxed">{steps[step].desc}</p></div>
          <div className="flex space-x-2 pt-2">{steps.map((_, idx) => (<div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === step ? 'w-6 bg-violet-500' : 'w-1.5 bg-slate-700'}`}></div>))}</div>
          <div className="w-full pt-2 space-y-3"><button onClick={handleNext} className="w-full bg-white text-slate-950 hover:bg-slate-200 font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02] flex items-center justify-center shadow-lg shadow-white/10">{step === steps.length - 1 ? 'Start Watching' : 'Next'} <ArrowRight className="ml-2 h-4 w-4" /></button>{step < steps.length - 1 && (<button onClick={onFinish} className="w-full text-slate-500 hover:text-white text-xs font-medium py-2 transition-colors">Skip</button>)}</div>
        </div>
      </div>
    </div>
  );
};

// 1. Navigation Bar
interface NavbarProps {
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
  user: UserType | null;
  onLogoutClick: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, user, onLogoutClick, onSearch, searchQuery }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearch);
    onNavigate('SEARCH');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    onSearch(e.target.value); 
  };

  if (['SPLASH', 'AUTH_LOGIN', 'AUTH_SIGNUP', 'PLAYER', 'ADMIN_DASHBOARD', 'ADMIN_UPLOAD'].includes(currentView)) return null;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-slate-950/80 backdrop-blur-xl shadow-2xl border-b border-white/5' : 'bg-gradient-to-b from-slate-950/90 to-transparent'}`} role="navigation" aria-label="Main Navigation">
      <style>{TILT_CARD_CSS}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center cursor-pointer group focus:outline-none" onClick={() => onNavigate('HOME')} role="button" tabIndex={0} onKeyDown={(e) => handleKeyDown(e, () => onNavigate('HOME'))} aria-label="Universal Movies Hub Home">
            <div className="relative mr-2"><Film className="h-8 w-8 text-violet-500 group-hover:scale-110 transition-transform" aria-hidden="true" /><div className="absolute inset-0 bg-violet-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div></div>
            <span className="text-2xl font-black tracking-tighter text-slate-200">UMH</span>
          </div>
          <div className="hidden md:flex items-center space-x-1" role="menubar">
            {[{ id: 'HOME', label: 'Home', icon: Home }, { id: 'QUICK_BITS', label: 'Quick Bits', icon: Sparkles }, { id: 'CINEMAS', label: 'Cinemas', icon: MapPin }, { id: 'SEARCH', label: 'Explore', icon: Search }, { id: 'WATCHLIST', label: 'My List', icon: Plus }].map((item) => (
              <button key={item.id} onClick={() => onNavigate(item.id as ViewState)} className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${currentView === item.id ? 'bg-white/10 text-white shadow-inner shadow-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`} role="menuitem" aria-current={currentView === item.id ? 'page' : undefined} aria-label={item.label}>
                {item.id === 'QUICK_BITS' && <item.icon className="w-3 h-3 text-amber-400 animate-pulse" aria-hidden="true" />}
                {item.label}
              </button>
            ))}
            {user?.isAdmin && (<button onClick={() => onNavigate('ADMIN_DASHBOARD')} className={`ml-4 text-sm font-medium transition hover:text-violet-400 flex items-center ${currentView.startsWith('ADMIN') ? 'text-violet-400' : 'text-slate-400'}`} role="menuitem" aria-label="Admin Dashboard"><LayoutDashboard className="h-4 w-4 mr-1.5" aria-hidden="true" /> Admin</button>)}
          </div>
          <form onSubmit={handleSearchSubmit} className="hidden lg:block relative mx-4" role="search"><label htmlFor="desktop-search" className="sr-only">Search movies</label><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" /><input id="desktop-search" type="text" placeholder="Search..." className="bg-slate-800/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:bg-slate-800 focus:border-violet-500 transition-all w-48 focus:w-64" value={localSearch} onChange={handleSearchChange} aria-label="Search movies, genres, or people" /></form>
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative cursor-pointer group focus:outline-none" role="button" tabIndex={0} aria-label="Notifications" onKeyDown={(e) => handleKeyDown(e, () => {})}>
               <Bell className="h-5 w-5 text-slate-400 group-hover:text-white transition" aria-hidden="true" />
               <span className="absolute -top-1 -right-1 h-2 w-2 bg-violet-500 rounded-full animate-ping"></span>
               <span className="absolute -top-1 -right-1 h-2 w-2 bg-violet-500 rounded-full"></span>
            </div>
            {user ? (
              <div className="relative group">
                 <button className="flex items-center space-x-2 focus:outline-none" aria-haspopup="true" aria-label={`User menu for ${user.name}`}><div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-900/20 border border-white/10 ring-2 ring-transparent group-hover:ring-violet-500/50 transition-all">{user.name.charAt(0)}</div></button>
                 <div className="absolute right-0 mt-2 w-56 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 overflow-hidden scale-95 group-hover:scale-100" role="menu">
                    <div className="p-4 border-b border-white/5 bg-gradient-to-r from-violet-900/20 to-transparent"><p className="text-white font-bold">{user.name}</p><p className="text-xs text-slate-400 truncate">{user.email}</p></div>
                    <div className="p-2 space-y-1">
                        <button onClick={() => onNavigate('PROFILE')} className="flex items-center w-full px-3 py-2 text-sm text-slate-300 hover:bg-white/10 rounded-lg transition" role="menuitem"><User className="h-4 w-4 mr-3" aria-hidden="true" /> Profile</button>
                        <button onClick={() => onNavigate('DOWNLOADS')} className="flex items-center w-full px-3 py-2 text-sm text-slate-300 hover:bg-white/10 rounded-lg transition" role="menuitem"><Download className="h-4 w-4 mr-3" aria-hidden="true" /> Downloads</button>
                        <button onClick={() => onNavigate('SETTINGS')} className="flex items-center w-full px-3 py-2 text-sm text-slate-300 hover:bg-white/10 rounded-lg transition" role="menuitem"><Settings className="h-4 w-4 mr-3" aria-hidden="true" /> Settings</button>
                        <div className="border-t border-white/5 my-1"></div>
                        <button onClick={onLogoutClick} className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition" role="menuitem"><LogOut className="h-4 w-4 mr-3" aria-hidden="true" /> Sign Out</button>
                    </div>
                 </div>
              </div>
            ) : (
              <button onClick={() => onNavigate('AUTH_LOGIN')} className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-violet-900/30 transition-all transform hover:scale-105" aria-label="Sign In">Sign In</button>
            )}
          </div>
          <div className="md:hidden flex items-center gap-4"><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white" aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}>{mobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}</button></div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl absolute top-20 left-0 w-full h-[calc(100vh-5rem)] p-6 border-t border-white/5 animate-in slide-in-from-right z-50 overflow-y-auto">
           <div className="space-y-6">
              <form onSubmit={(e) => { handleSearchSubmit(e); setMobileMenuOpen(false); }} className="relative mb-6" role="search"><label htmlFor="mobile-search" className="sr-only">Search</label><Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" aria-hidden="true" /><input id="mobile-search" type="text" placeholder="Search..." className="w-full bg-slate-800 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-violet-500" value={localSearch} onChange={handleSearchChange} /></form>
              <button onClick={() => { onNavigate('HOME'); setMobileMenuOpen(false); }} className="flex items-center w-full text-left text-lg font-medium text-white"><Home className="mr-3"/> Home</button>
              <button onClick={() => { onNavigate('QUICK_BITS'); setMobileMenuOpen(false); }} className="flex items-center w-full text-left text-lg font-medium text-amber-400"><Sparkles className="mr-3"/> Quick Bits</button>
              <button onClick={() => { onNavigate('CINEMAS'); setMobileMenuOpen(false); }} className="flex items-center w-full text-left text-lg font-medium text-slate-400"><MapPin className="mr-3"/> Cinemas</button>
              <button onClick={() => { onNavigate('SEARCH'); setMobileMenuOpen(false); }} className="flex items-center w-full text-left text-lg font-medium text-slate-400"><Search className="mr-3"/> Explore</button>
              <button onClick={() => { onNavigate('WATCHLIST'); setMobileMenuOpen(false); }} className="flex items-center w-full text-left text-lg font-medium text-slate-400"><Plus className="mr-3"/> Watchlist</button>
              <button onClick={() => { onNavigate('DOWNLOADS'); setMobileMenuOpen(false); }} className="flex items-center w-full text-left text-lg font-medium text-slate-400"><Download className="mr-3"/> Downloads</button>
              {user?.isAdmin && (<button onClick={() => { onNavigate('ADMIN_DASHBOARD'); setMobileMenuOpen(false); }} className="flex items-center w-full text-left text-lg font-medium text-violet-400"><LayoutDashboard className="mr-3"/> Admin Panel</button>)}
              {user ? (<button onClick={onLogoutClick} className="block w-full text-left text-lg font-medium text-red-400 mt-8 pt-8 border-t border-white/10">Sign Out</button>) : (<button onClick={() => { onNavigate('AUTH_LOGIN'); setMobileMenuOpen(false); }} className="block w-full text-center bg-violet-600 text-white py-3 rounded-xl font-bold">Sign In</button>)}
           </div>
        </div>
      )}
    </nav>
  );
};

// ... (Hero, MoodSelector, QuickBitsPreviewRow, MovieRow, QuickBitsView, CinemasView remain unchanged) ...
const Hero: React.FC<{ movie: Movie; onPlay: () => void; onMoreInfo: () => void }> = ({ movie, onPlay, onMoreInfo }) => { return (<div className="relative h-[85vh] w-full overflow-hidden" role="banner"><div className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s]" style={{ backgroundImage: `url(${movie.bannerUrl})`, animation: 'kenburns 20s infinite alternate' }}></div><div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div><div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent"></div><div className="absolute inset-0 flex items-center"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"><div className="max-w-2xl space-y-6 pb-36 sm:pb-56 z-40 relative"><div className="flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100"><span className="text-violet-400 font-bold tracking-wider text-[10px] sm:text-sm uppercase px-2 py-1 bg-violet-500/10 border border-violet-500/20 rounded-md backdrop-blur-sm shadow-[0_0_15px_rgba(124,58,237,0.3)]">#{movie.trending ? '1 Trending' : 'New Arrival'}</span><div className="flex text-amber-400">{[...Array(5)].map((_, i) => (<Star key={i} className={`h-4 w-4 ${i < Math.floor(movie.rating / 2) ? 'fill-current' : 'text-slate-600'}`} />))}</div></div><h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">{movie.title}</h1><div className="flex items-center space-x-4 text-sm font-medium text-slate-300 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300"><span className="text-emerald-400 font-bold drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">98% Match</span><span>{movie.year}</span><span className="border border-slate-600 px-1 rounded text-xs">4K Ultra HD</span><span>5.1 Audio</span></div><p className="text-lg text-slate-300 line-clamp-3 leading-relaxed max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">{movie.description}</p><div className="flex items-center space-x-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500"><button onClick={onPlay} className="bg-white text-slate-950 px-8 py-3.5 rounded-xl font-bold flex items-center hover:bg-slate-200 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"><Play className="h-5 w-5 mr-2 fill-current" /> Play Now</button><button onClick={onMoreInfo} className="bg-white/10 backdrop-blur-md text-white px-8 py-3.5 rounded-xl font-bold flex items-center hover:bg-white/20 transition-colors border border-white/10"><Info className="h-5 w-5 mr-2" /> More Info</button></div></div></div></div></div>); };
const MoodSelector: React.FC = () => { return (<div className="relative z-30 -mt-20 mb-12 px-4 sm:px-6 lg:px-8"><div className="glass-panel max-w-5xl mx-auto rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl"><div><h3 className="text-xl font-bold text-white flex items-center gap-2"><Sparkles className="text-amber-400 h-5 w-5" /> What's your vibe today?</h3><p className="text-slate-400 text-sm">AI-powered recommendations based on your mood.</p></div><div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">{[{ icon: Zap, label: 'Excited', color: 'bg-yellow-500/20 text-yellow-400' }, { icon: Coffee, label: 'Chill', color: 'bg-blue-500/20 text-blue-400' }, { icon: Heart, label: 'Romantic', color: 'bg-pink-500/20 text-pink-400' }, { icon: Frown, label: 'Sad', color: 'bg-indigo-500/20 text-indigo-400' }, { icon: Smile, label: 'Happy', color: 'bg-green-500/20 text-green-400' }].map((mood, idx) => (<button key={idx} className={`flex items-center gap-2 px-6 py-3 rounded-full border border-white/5 hover:border-white/20 transition-all hover:scale-105 whitespace-nowrap ${mood.color}`}><mood.icon className="h-4 w-4" /> {mood.label}</button>))}</div></div></div>) }
const QuickBitsPreviewRow: React.FC<{ movies: Movie[]; onOpen: () => void }> = ({ movies, onOpen }) => { return (<div className="py-10 relative z-20 my-4 border-y border-white/5 bg-white/5 backdrop-blur-sm"><div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-transparent to-violet-600/10 pointer-events-none"></div><div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between group cursor-pointer mb-6" onClick={onOpen}><div className="flex items-center gap-3"><div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg shadow-lg shadow-amber-500/20"><Sparkles className="text-white h-5 w-5 fill-current" /></div><div><h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">Quick Bits</h2><p className="text-xs text-slate-400">Short clips & trailers</p></div></div><span className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/5 group-hover:bg-white/10 group-hover:border-white/20">View Feed <ChevronRight className="w-4 h-4" /></span></div><div className="flex space-x-5 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-2">{movies.map((movie) => (<div key={movie.id} onClick={onOpen} className="flex-none w-[140px] h-[240px] relative rounded-2xl overflow-hidden cursor-pointer border-[3px] border-transparent hover:border-amber-400 transition-all transform hover:scale-105 shadow-2xl group/item"><img src={movie.posterUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110" alt={movie.title} /><div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90"></div><div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"><div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/20"><Play className="h-6 w-6 text-white fill-current" /></div></div><div className="absolute bottom-0 inset-x-0 p-4"><p className="text-white text-sm font-bold truncate mb-0.5">{movie.title}</p><div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div><p className="text-slate-300 text-[10px] font-medium uppercase tracking-wider">Live Preview</p></div></div><div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10 flex items-center gap-1"><Zap className="w-3 h-3 text-amber-400 fill-current" />Short</div></div>))}</div></div>) }
const MovieRow: React.FC<MovieRowProps> = ({ title, movies, onMovieClick, onPlay, onAddToWatchlist, isLarge = false }) => { const scrollRef = useRef<HTMLDivElement>(null); const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => { const card = e.currentTarget; const rect = card.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; const centerX = rect.width / 2; const centerY = rect.height / 2; const rotateX = ((y - centerY) / centerY) * -10; const rotateY = ((x - centerX) / centerX) * 10; card.style.setProperty('--rotateX', `${rotateX}deg`); card.style.setProperty('--rotateY', `${rotateY}deg`); }; const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => { const card = e.currentTarget; card.style.setProperty('--rotateX', `0deg`); card.style.setProperty('--rotateY', `0deg`); }; const scroll = (direction: 'left' | 'right') => { if (scrollRef.current) { const { current } = scrollRef; const scrollAmount = direction === 'left' ? -window.innerWidth / 1.5 : window.innerWidth / 1.5; current.scrollBy({ left: scrollAmount, behavior: 'smooth' }); } }; if (movies.length === 0) return null; return (<div className="py-8 space-y-4 z-20 relative"><div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between group"><h2 className="text-xl md:text-2xl font-bold text-slate-100 cursor-pointer hover:text-violet-400 transition-colors flex items-center">{title} <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-violet-500" /></h2></div><div className="group relative"><button className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-950 to-transparent z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:w-16 focus:opacity-100" onClick={() => scroll('left')} aria-label="Scroll left"><ChevronLeft className="h-8 w-8 text-white drop-shadow-lg transform hover:scale-125 transition-transform" /></button><div ref={scrollRef} className="flex space-x-6 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-12 pt-4 snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>{movies.map((movie) => (<div key={movie.id} className={`relative flex-shrink-0 cursor-pointer group/card snap-start ${isLarge ? 'w-[200px]' : 'w-[160px]'}`} onClick={() => onMovieClick(movie)}><div className="relative rounded-lg overflow-hidden aspect-[2/3] transition-transform duration-300 group-hover/card:scale-105 shadow-lg border border-white/5"><img src={isLarge ? movie.posterUrl : movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />{movie.progress && (<div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700/50 backdrop-blur-sm"><div className="h-full bg-gradient-to-r from-violet-600 to-emerald-500" style={{ width: `${movie.progress}%` }} role="progressbar" aria-valuenow={movie.progress} aria-valuemin={0} aria-valuemax={100} aria-label="Playback progress" /></div>)}<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-10 backdrop-blur-[2px]"><button onClick={(e) => { e.stopPropagation(); onPlay(movie); }} className="bg-white text-black p-4 rounded-full hover:bg-violet-500 hover:text-white transition-all transform hover:scale-110 shadow-xl border-2 border-transparent hover:border-white/20" aria-label={`Play ${movie.title}`} tabIndex={0}><Play className="h-8 w-8 fill-current ml-1" aria-hidden="true" /></button><button onClick={(e) => { e.stopPropagation(); onAddToWatchlist(movie); }} className="bg-white/20 text-white p-3 rounded-full hover:bg-white hover:text-black transition-all transform hover:scale-110 backdrop-blur-md border border-white/30" aria-label="Add to watchlist" tabIndex={0}><Plus className="h-6 w-6" aria-hidden="true" /></button></div><div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 pointer-events-none"></div></div><div className="mt-3 px-1"><h3 className="text-sm font-bold text-white truncate group-hover/card:text-violet-400 transition-colors">{movie.title}</h3><div className="flex items-center justify-between text-xs text-slate-400 mt-1"><span>{movie.year}</span><span className="border border-white/10 px-1.5 py-0.5 rounded bg-white/5">{movie.quality || 'HD'}</span></div></div></div>))}</div><button className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-950 to-transparent z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:w-16 focus:opacity-100" onClick={() => scroll('right')} aria-label="Scroll right"><ChevronRight className="h-8 w-8 text-white drop-shadow-lg transform hover:scale-125 transition-transform" /></button></div></div>); };
const QuickBitsView: React.FC<{ movies: Movie[]; onPlayFull: (m: Movie) => void; onClose: () => void }> = ({ movies, onPlayFull, onClose }) => { const [playingId, setPlayingId] = useState<string | null>(null); const togglePlay = (id: string) => { if (playingId === id) { setPlayingId(null); } else { setPlayingId(id); } }; return (<div className="fixed inset-0 bg-black z-[60] snap-y snap-mandatory overflow-y-scroll scroll-smooth" role="dialog" aria-label="Quick Bits Feed"><div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent"><div className="flex items-center gap-2"><Sparkles className="h-6 w-6 text-amber-400" /><span className="font-bold text-lg">Quick Bits</span></div><button onClick={onClose} className="bg-white/10 p-2 rounded-full backdrop-blur-md hover:bg-white/20 transition-colors"><X className="h-6 w-6 text-white" /></button></div>{movies.map((movie) => (<div key={movie.id} className="h-screen w-full snap-start relative flex items-center justify-center bg-slate-900" onClick={() => togglePlay(movie.id)}>{playingId === movie.id ? (<video src={movie.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"} className="absolute inset-0 w-full h-full object-cover" autoPlay loop playsInline controls={false} />) : (<><div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${movie.posterUrl})` }}></div><div className="absolute inset-0 bg-black/40 flex items-center justify-center"><div className="bg-white/20 backdrop-blur-md p-6 rounded-full border border-white/20 animate-pulse"><Play className="h-12 w-12 text-white fill-current" /></div></div></>)}<div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 pointer-events-none"></div><div className="absolute bottom-24 left-4 right-16 space-y-4 animate-in slide-in-from-bottom-10 fade-in duration-500 pointer-events-auto" onClick={(e) => e.stopPropagation()}><div className="flex items-center gap-2"><span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-1"><Play className="w-3 h-3 fill-current" /> Trailer</span><span className="bg-violet-600/80 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg shadow-violet-900/50">#{movie.genres[0]}</span></div><h2 className="text-4xl font-black text-white drop-shadow-lg leading-tight">{movie.title}</h2><p className="text-slate-200 line-clamp-2 drop-shadow-md text-sm md:text-base font-medium">{movie.description}</p><button onClick={() => onPlayFull(movie)} className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition mt-4 shadow-xl transform active:scale-95"><Play className="h-5 w-5 fill-current" /> Watch Full Movie</button></div><div className="absolute bottom-24 right-4 flex flex-col gap-6 items-center pointer-events-auto" onClick={(e) => e.stopPropagation()}><button className="group flex flex-col items-center gap-1 cursor-pointer"><div className="bg-slate-800/50 p-3 rounded-full backdrop-blur-md border border-white/10 group-hover:bg-slate-700 group-hover:scale-110 transition-all"><Heart className="h-7 w-7 text-white group-hover:text-red-500 group-hover:fill-current transition-colors" /></div><span className="text-xs font-bold drop-shadow-md">12k</span></button><button className="group flex flex-col items-center gap-1 cursor-pointer"><div className="bg-slate-800/50 p-3 rounded-full backdrop-blur-md border border-white/10 group-hover:bg-slate-700 group-hover:scale-110 transition-all"><Share2 className="h-7 w-7 text-white" /></div><span className="text-xs font-bold drop-shadow-md">Share</span></button><button className="group flex flex-col items-center gap-1 cursor-pointer"><div className="bg-slate-800/50 p-3 rounded-full backdrop-blur-md border border-white/10 group-hover:bg-slate-700 group-hover:scale-110 transition-all"><Plus className="h-7 w-7 text-white" /></div><span className="text-xs font-bold drop-shadow-md">List</span></button></div></div>))}</div>) }
const CinemasView: React.FC = () => { const [location, setLocation] = useState<{lat: number, lng: number} | null>(null); const [loading, setLoading] = useState(false); const [results, setResults] = useState<{text: string, chunks: any[]} | null>(null); const [error, setError] = useState(''); const handleLocate = () => { setLoading(true); setError(''); if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(async (position) => { const { latitude, longitude } = position.coords; setLocation({ lat: latitude, lng: longitude }); try { const data = await getNearbyCinemas(latitude, longitude); if (data) setResults(data); else setError("Failed to fetch cinema data from AI."); } catch (e) { setError("An error occurred while communicating with the AI service."); } finally { setLoading(false); } }, (err) => { console.error(err); setLoading(false); setError("Unable to retrieve your location. Please enable location permissions."); }); } else { setLoading(false); setError("Geolocation is not supported by this browser."); } }; return (<div className="pt-24 px-4 max-w-7xl mx-auto min-h-screen pb-12"><div className="glass-panel rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden"><div className="absolute right-0 top-0 w-64 h-64 bg-violet-600/30 rounded-full blur-[100px] pointer-events-none"></div><div className="relative z-10"><h2 className="text-4xl font-black text-white mb-4 flex items-center"><MapPin className="mr-4 h-10 w-10 text-violet-500" /> Find Theaters Nearby</h2><p className="text-slate-300 text-lg max-w-2xl mb-8">Want the big screen experience? Use our AI-powered locator to find the best cinemas playing trending movies near you, complete with ratings and directions.</p><button onClick={handleLocate} disabled={loading} className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold flex items-center hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50">{loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <Navigation className="mr-2 h-5 w-5 fill-current" />}{loading ? 'Finding Locations...' : 'Locate Cinemas Near Me'}</button>{error && (<div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center"><AlertTriangle className="h-5 w-5 mr-3" />{error}</div>)}</div></div>{results && (<div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700"><div className="glass-panel p-6 rounded-2xl"><h3 className="text-xl font-bold text-white mb-4 flex items-center"><Sparkles className="h-5 w-5 text-amber-400 mr-2" /> AI Summary</h3><p className="text-slate-300 leading-relaxed whitespace-pre-line">{results.text}</p></div>{results.chunks && results.chunks.length > 0 && (<div><h3 className="text-2xl font-bold text-white mb-6">Found Locations</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{results.chunks.map((chunk: any, index: number) => { if (!chunk.maps) return null; return (<div key={index} className="glass-panel p-0 rounded-2xl overflow-hidden group hover:border-violet-500/50 transition-all flex flex-col h-full"><div className="h-40 bg-slate-800 relative"><div className="absolute inset-0 flex items-center justify-center"><MapPin className="h-12 w-12 text-slate-600 group-hover:text-violet-500 transition-colors" /></div></div><div className="p-6 flex-1 flex flex-col"><h4 className="text-xl font-bold text-white mb-2 line-clamp-1">{chunk.maps.title}</h4>{chunk.maps.placeAnswerSources?.reviewSnippets && chunk.maps.placeAnswerSources.reviewSnippets.length > 0 && (<p className="text-slate-400 text-sm italic mb-4 line-clamp-3">"{chunk.maps.placeAnswerSources.reviewSnippets[0].text}"</p>)}<div className="mt-auto pt-4"><a href={chunk.maps.uri} target="_blank" rel="noreferrer" className="block w-full bg-slate-800 hover:bg-slate-700 text-center py-3 rounded-lg text-white font-medium transition-colors border border-white/5">View on Google Maps</a></div></div></div>); })}</div></div>)}</div>)}</div>); };

// Shared Sidebar Layout for Admin
const AdminSidebar: React.FC<{ active: string; onNavigate: (view: ViewState) => void }> = ({ active, onNavigate }) => (
  <div className="w-72 flex-shrink-0 hidden md:block"><div className="glass-panel rounded-3xl p-6 sticky top-6 border border-white/10 shadow-2xl shadow-black/50"><h3 className="text-xl font-black mb-8 px-4 tracking-tight text-white flex items-center gap-2"><div className="bg-violet-600/20 p-2 rounded-lg border border-violet-500/20"><LayoutDashboard className="w-5 h-5 text-violet-400" /></div>Admin Panel</h3><div className="space-y-2"><button onClick={() => onNavigate('ADMIN_DASHBOARD')} className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all font-medium ${active === 'DASHBOARD' ? 'bg-white text-slate-950 shadow-lg shadow-white/10 font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><BarChart3 className="w-5 h-5 mr-3" /> Dashboard</button><button onClick={() => onNavigate('ADMIN_UPLOAD')} className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all font-medium ${active === 'UPLOAD' ? 'bg-white text-slate-950 shadow-lg shadow-white/10 font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><UploadCloud className="w-5 h-5 mr-3" /> Upload Movie</button><button onClick={() => onNavigate('ADMIN_DASHBOARD')} className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all font-medium ${active === 'ANALYTICS' ? 'bg-white text-slate-950 shadow-lg shadow-white/10 font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><TrendingUp className="w-5 h-5 mr-3" /> Analytics</button><button onClick={() => onNavigate('ADMIN_DASHBOARD')} className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all font-medium ${active === 'USERS' ? 'bg-white text-slate-950 shadow-lg shadow-white/10 font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><Users className="w-5 h-5 mr-3" /> Users</button><button className="w-full flex items-center px-4 py-3.5 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all font-medium"><Settings className="w-5 h-5 mr-3" /> Settings</button></div><div className="mt-8 pt-6 border-t border-white/5 px-4"><div className="text-xs text-slate-500 uppercase tracking-wider mb-4 font-bold">Quick Stats</div><div className="bg-white/5 p-4 rounded-xl border border-white/5"><div className="text-2xl font-bold text-white mb-1">1,204</div><div className="text-xs text-slate-400">Total Uploads</div></div></div><button onClick={() => onNavigate('HOME')} className="w-full flex items-center px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium mt-4"><ArrowLeft className="w-5 h-5 mr-3" /> Exit to App</button></div></div>
);

// 4. Admin Dashboard Component with ANALYTICS and USERS
const AdminDashboard: React.FC<{ movies: Movie[]; onNavigate: (view: ViewState) => void; onDeleteMovie: (id: string) => void }> = ({ movies, onNavigate, onDeleteMovie }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MOVIES' | 'ANALYTICS' | 'USERS'>('OVERVIEW');
  const stats = [{ label: 'Total Movies', value: movies.length, icon: Film, color: 'text-violet-400' }, { label: 'Active Users', value: '1.2M', icon: Users, color: 'text-blue-400' }, { label: 'Revenue', value: '$450k', icon: CreditCard, color: 'text-emerald-400' }, { label: 'Downloads', value: '85k', icon: Download, color: 'text-amber-400' }];
  
  // Mock Data for Charts
  const userGrowthData = [10, 25, 45, 30, 60, 75, 65, 90, 100, 120, 140, 130];
  const revenueData = [40, 60, 55, 80, 95, 110];
  const downloadData = [20, 40, 35, 50, 70, 85];

  // Mock Users Data
  const MOCK_USERS = [
    { id: '1', name: 'Demo User', email: 'demo@example.com', role: 'Admin', status: 'Active', joined: '2023-01-15' },
    { id: '2', name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active', joined: '2023-03-10' },
    { id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive', joined: '2023-05-22' },
    { id: '4', name: 'Alice Johnson', email: 'alice@example.com', role: 'User', status: 'Active', joined: '2023-07-08' },
    { id: '5', name: 'Bob Brown', email: 'bob@example.com', role: 'User', status: 'Active', joined: '2023-09-14' },
  ];

  // Simple SVG Line Chart Component
  const SimpleLineChart = ({ data, color }: { data: number[], color: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((d - min) / (max - min)) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="w-full h-48 relative">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
           <polyline fill="none" stroke={color} strokeWidth="3" points={points} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
           <defs>
             <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
               <stop offset="0%" stopColor={color} stopOpacity="0.2" />
               <stop offset="100%" stopColor={color} stopOpacity="0" />
             </linearGradient>
           </defs>
           <polygon fill="url(#gradient)" points={`0,100 ${points} 100,100`} />
        </svg>
        {/* Axis labels roughly */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-slate-500 mt-2">
           <span>Jan</span><span>Jun</span><span>Dec</span>
        </div>
      </div>
    );
  };

  // Simple Bar Chart Component
  const SimpleBarChart = ({ data1, data2 }: { data1: number[], data2: number[] }) => {
    return (
      <div className="w-full h-48 flex items-end justify-between gap-2">
         {data1.map((d, i) => (
           <div key={i} className="w-full flex gap-1 h-full items-end">
              <div style={{ height: `${d}%` }} className="w-full bg-emerald-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity relative group">
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">${d}k</div>
              </div>
              <div style={{ height: `${data2[i]}%` }} className="w-full bg-amber-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity relative group">
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{data2[i]}k</div>
              </div>
           </div>
         ))}
      </div>
    )
  }

  return (<div className="pt-0 px-4 max-w-[1600px] mx-auto min-h-screen text-white pb-12 flex gap-8"><AdminSidebar active={activeTab === 'ANALYTICS' ? 'ANALYTICS' : (activeTab === 'USERS' ? 'USERS' : 'DASHBOARD')} onNavigate={(v) => { if(v==='ADMIN_DASHBOARD') setActiveTab(activeTab === 'USERS' ? 'DASHBOARD' : activeTab); else onNavigate(v); }} /><div className="flex-1 min-w-0 p-6">
        
        {/* Tabs Header */}
        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
           <button onClick={() => setActiveTab('OVERVIEW')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'OVERVIEW' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}>Overview</button>
           <button onClick={() => setActiveTab('ANALYTICS')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'ANALYTICS' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}>Analytics</button>
           <button onClick={() => setActiveTab('MOVIES')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'MOVIES' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}>Movies</button>
           <button onClick={() => setActiveTab('USERS')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'USERS' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}>Users</button>
        </div>

        {activeTab === 'OVERVIEW' && (<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{stats.map((stat, idx) => (<div key={idx} className="glass-panel p-6 rounded-3xl flex items-start justify-between hover:bg-white/5 transition-colors"><div><p className="text-slate-400 text-sm mb-1 font-medium">{stat.label}</p><h3 className="text-3xl font-black tracking-tight">{stat.value}</h3></div><div className={`p-4 rounded-2xl bg-white/5 border border-white/5 ${stat.color}`}><stat.icon className="w-6 h-6" /></div></div>))}</div><div className="glass-panel p-8 rounded-3xl"><div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">Recent Activity</h3><button className="text-sm text-violet-400 hover:text-white transition-colors">View All</button></div><div className="space-y-4">{[1,2,3].map(i => (<div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400"><Activity className="w-5 h-5" /></div><div><p className="font-bold text-sm">New Registration</p><p className="text-xs text-slate-400">User #29382 joined from India</p></div></div><span className="text-xs text-slate-500">2m ago</span></div>))}</div></div></div>)}
        
        {activeTab === 'ANALYTICS' && (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* User Growth Chart */}
                 <div className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-6">
                       <div>
                          <h3 className="text-xl font-bold text-white flex items-center gap-2"><TrendingUp className="w-5 h-5 text-violet-500" /> User Growth</h3>
                          <p className="text-slate-400 text-xs">New registrations over the last 12 months</p>
                       </div>
                       <div className="bg-violet-500/10 text-violet-300 px-3 py-1 rounded-full text-xs font-bold">+12.5%</div>
                    </div>
                    <SimpleLineChart data={userGrowthData} color="#8b5cf6" />
                 </div>

                 {/* Revenue vs Downloads Chart */}
                 <div className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-6">
                       <div>
                          <h3 className="text-xl font-bold text-white flex items-center gap-2"><DollarSign className="w-5 h-5 text-emerald-500" /> Revenue vs Downloads</h3>
                          <p className="text-slate-400 text-xs">Comparison for the last 6 months</p>
                       </div>
                       <div className="flex gap-3 text-xs font-bold">
                          <span className="flex items-center gap-1 text-emerald-400"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Revenue</span>
                          <span className="flex items-center gap-1 text-amber-400"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Downloads</span>
                       </div>
                    </div>
                    <SimpleBarChart data1={revenueData} data2={downloadData} />
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {/* Quick Stats Grid */}
                 <div className="glass-panel p-6 rounded-3xl flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4"><PieChart className="w-8 h-8 text-blue-400" /></div>
                    <h3 className="text-3xl font-bold text-white">85%</h3>
                    <p className="text-slate-400 text-sm mt-1">Retention Rate</p>
                 </div>
                 <div className="glass-panel p-6 rounded-3xl flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mb-4"><Clock className="w-8 h-8 text-pink-400" /></div>
                    <h3 className="text-3xl font-bold text-white">45m</h3>
                    <p className="text-slate-400 text-sm mt-1">Avg. Watch Time</p>
                 </div>
                 <div className="glass-panel p-6 rounded-3xl flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-4"><Calendar className="w-8 h-8 text-amber-400" /></div>
                    <h3 className="text-3xl font-bold text-white">24</h3>
                    <p className="text-slate-400 text-sm mt-1">New Releases this Month</p>
                 </div>
              </div>

              {/* Content Distribution Table */}
              <div className="glass-panel p-8 rounded-3xl">
                 <h3 className="text-xl font-bold text-white mb-6">Top Performing Content</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                       <thead className="uppercase tracking-wider border-b border-white/10">
                          <tr>
                             <th className="pb-4 font-semibold">Movie Title</th>
                             <th className="pb-4 font-semibold">Views</th>
                             <th className="pb-4 font-semibold">Rating</th>
                             <th className="pb-4 font-semibold text-right">Revenue</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {MOCK_MOVIES.slice(0, 5).map(m => (
                             <tr key={m.id} className="hover:bg-white/5 transition-colors">
                                <td className="py-4 text-white font-medium flex items-center gap-3">
                                   <img src={m.posterUrl} className="w-8 h-10 rounded object-cover" alt="" />
                                   {m.title}
                                </td>
                                <td className="py-4">{(Math.random() * 500 + 100).toFixed(1)}k</td>
                                <td className="py-4"><span className="text-emerald-400 font-bold">{m.rating}</span></td>
                                <td className="py-4 text-right text-white">${(Math.random() * 20 + 5).toFixed(1)}k</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'USERS' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">User Management</h2>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input type="text" placeholder="Search users..." className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500" />
              </div>
            </div>
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-slate-400 text-sm uppercase">
                  <tr>
                    <th className="p-4 font-medium">User</th>
                    <th className="p-4 font-medium">Role</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Joined</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {MOCK_USERS.map(user => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center font-bold text-xs">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white">{user.name}</div>
                            <div className="text-xs text-slate-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${user.role === 'Admin' ? 'bg-violet-500/20 border-violet-500/30 text-violet-300' : 'bg-slate-700/50 border-slate-600 text-slate-300'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`flex items-center gap-1.5 text-xs font-bold ${user.status === 'Active' ? 'text-emerald-400' : 'text-red-400'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 text-sm">{user.joined}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                          <button className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'MOVIES' && (<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"><div className="flex justify-between items-center"><h2 className="text-2xl font-bold">Movie Library</h2><button onClick={() => onNavigate('ADMIN_UPLOAD')} className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold"><Plus className="w-4 h-4" /> Add New</button></div><div className="glass-panel rounded-2xl overflow-hidden"><table className="w-full text-left"><thead className="bg-slate-900/50 text-slate-400 text-sm uppercase"><tr><th className="p-4 font-medium">Movie</th><th className="p-4 font-medium">Year</th><th className="p-4 font-medium">Rating</th><th className="p-4 font-medium">Views</th><th className="p-4 font-medium text-right">Actions</th></tr></thead><tbody className="divide-y divide-white/5">{movies.map(movie => (<tr key={movie.id} className="hover:bg-white/5 transition-colors"><td className="p-4"><div className="flex items-center gap-3"><img src={movie.posterUrl} className="w-10 h-14 object-cover rounded" alt={movie.title} /><span className="font-medium text-white">{movie.title}</span></div></td><td className="p-4 text-slate-300">{movie.year}</td><td className="p-4"><span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs font-bold border border-emerald-500/20">{movie.rating}</span></td><td className="p-4 text-slate-400 text-sm">1.2k</td><td className="p-4 text-right"><div className="flex items-center justify-end gap-2"><button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button><button onClick={() => onDeleteMovie(movie.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button></div></td></tr>))}</tbody></table></div></div>)}</div></div>);
};

// ... (Rest of the App component remains unchanged)
