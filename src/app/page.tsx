import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950 text-white overflow-hidden">
      {/* Floating orbs background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-60 right-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-lg font-black">
            L
          </div>
          <span className="text-xl font-bold tracking-tight">LinkForge</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Giriş Yap
          </Link>
          <Link href="/register" className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/25">
            Ücretsiz Başla
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10">
        <section className="flex flex-col items-center text-center px-6 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full glass text-sm text-purple-300">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Sonsuza kadar ücretsiz plan
            </div>
          </div>

          <h1 className="animate-slide-up text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight max-w-5xl" style={{ animationDelay: '0.1s' }}>
            Tüm Linklerin,{" "}
            <span className="text-gradient">Tek Sayfa</span>
          </h1>

          <p className="animate-slide-up mt-6 text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Instagram, TikTok, YouTube — tüm sosyal medya linklerini tek bir güzel sayfada
            topla. 30 saniyede kur, tamamen ücretsiz.
          </p>

          <div className="animate-slide-up flex flex-col sm:flex-row gap-4 mt-10" style={{ animationDelay: '0.3s' }}>
            <Link href="/register" className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl hover:from-purple-500 hover:to-blue-500 transition-all shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105">
              Ücretsiz Sayfanı Oluştur →
            </Link>
            <Link href="#demo" className="px-8 py-4 text-lg font-medium glass rounded-2xl hover:bg-white/10 transition-all">
              Demo Gör
            </Link>
          </div>

          <div className="animate-slide-up mt-8 text-sm text-gray-500" style={{ animationDelay: '0.4s' }}>
            ✨ 30 saniyede kur &nbsp;·&nbsp; 💳 Kredi kartı gerekmez &nbsp;·&nbsp; 🎨 6 tema
          </div>
        </section>

        {/* Preview mockup */}
        <section id="demo" className="flex justify-center px-6 pb-24">
          <div className="animate-slide-up w-full max-w-sm" style={{ animationDelay: '0.5s' }}>
            <div className="glass-strong rounded-3xl p-8 animate-glow">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl mb-4">
                  🚀
                </div>
                <h3 className="text-xl font-bold">@tolga</h3>
                <p className="text-gray-400 text-sm mt-1">Full Stack Developer & Creator</p>
              </div>
              <div className="mt-8 space-y-3">
                {[
                  { icon: "🌐", title: "Website", color: "from-blue-600 to-cyan-600" },
                  { icon: "📸", title: "Instagram", color: "from-pink-600 to-purple-600" },
                  { icon: "🎬", title: "YouTube", color: "from-red-600 to-orange-600" },
                  { icon: "💼", title: "LinkedIn", color: "from-blue-700 to-blue-500" },
                  { icon: "🐙", title: "GitHub", color: "from-gray-700 to-gray-500" },
                ].map((link, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white/10 backdrop-blur border border-white/10 hover:bg-white/20 hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span className="font-medium flex-1">{link.title}</span>
                    <span className="text-gray-500 text-sm">→</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <span className="text-xs text-gray-600">Powered by <span className="text-purple-400 font-semibold">LinkForge</span></span>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 md:px-12 pb-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-center mb-16">
              Neden <span className="text-gradient">LinkForge</span>?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: "⚡",
                  title: "30 Saniyede Hazır",
                  desc: "Kayıt ol, linklerini ekle, paylaş. Bu kadar basit."
                },
                {
                  icon: "🎨",
                  title: "6 Premium Tema",
                  desc: "Midnight, Ocean, Sunset, Forest, Neon veya Minimal. Hepsi ücretsiz."
                },
                {
                  icon: "📊",
                  title: "Tıklama Analizi",
                  desc: "Her linke kaç kişi tıkladığını gör. Performansını takip et."
                },
                {
                  icon: "🔗",
                  title: "Sınırsız Link",
                  desc: "İstediğin kadar link ekle. Sıralamayı istediğin gibi değiştir."
                },
                {
                  icon: "📱",
                  title: "Mobil Uyumlu",
                  desc: "Sayfan her cihazda mükemmel görünür. Responsive tasarım."
                },
                {
                  icon: "🌍",
                  title: "Hızlı & Global",
                  desc: "Dünyanın her yerinden anında yüklenir. Hız = profesyonellik."
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="glass rounded-2xl p-6 hover:bg-white/10 transition-all group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-24">
          <div className="max-w-3xl mx-auto text-center glass-strong rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Hazır mısın?
            </h2>
            <p className="text-gray-400 mb-8">
              Binlerce kişi LinkForge ile linklerini paylaşıyor. Sen de katıl.
            </p>
            <Link href="/register" className="inline-block px-8 py-4 text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl hover:from-purple-500 hover:to-blue-500 transition-all shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105">
              Ücretsiz Başla — 30 Saniye
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-8 border-t border-white/5">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-black">
                L
              </div>
              <span className="font-bold">LinkForge</span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2026 LinkForge. Tüm hakları saklıdır.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
