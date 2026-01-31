export default function Aboutus() {
    return (
        <>{/* ABOUT US */}
        <section id="about" className="py-28 px-4 md:px-8 bg-gradient-to-br from-[#fff0e8] via-[#ffe8f5] to-[#f0f5ff] relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-[#FF6F00] to-[#E91E63] rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-[#3B82F6] to-[#9C27B0] rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-[#2D1B4E]">
                About <span className="gradient-text">Us</span>
              </h2>

              {/* Mission */}
              <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-[#d4c5e8]/30 shadow-xl mb-8">
                <h3 className="text-3xl md:text-4xl font-bold text-[#2D1B4E] mb-6 text-center">
                  <span className="gradient-text">Mission</span>
                </h3>
                <p className="text-lg text-[#6B5B8E] leading-relaxed mb-4">
                  Our mission is simple — to help people express feelings they cannot say themselves.
                </p>
                <p className="text-lg text-[#6B5B8E] leading-relaxed mb-4">
                  We aim to make confessions, apologies, and emotional communication safe, respectful, and beautifully delivered, so no relationship, bond, or love story breaks because of fear, shyness, hesitation, or overthinking.
                </p>
                <p className="text-lg text-[#2D1B4E] font-semibold leading-relaxed text-center mt-6">
                  Izhaar exists to give every genuine feeling… a genuine chance.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-[#d4c5e8]/30 shadow-xl mb-8">
                <h3 className="text-3xl md:text-4xl font-bold text-[#2D1B4E] mb-6 text-center">
                  <span className="gradient-text">Vision</span>
                </h3>
                <p className="text-lg text-[#6B5B8E] leading-relaxed mb-4">
                  Our vision is to build India's most trusted emotional-expression platform — a place where anyone can confess, connect, apologize, or reconnect without fear.
                </p>
                <p className="text-lg text-[#6B5B8E] leading-relaxed mb-4">
                  A future where:
                </p>
                <ul className="text-lg text-[#6B5B8E] space-y-2 ml-6 mb-4">
                  <li>• Expressing love feels effortless</li>
                  <li>• Relationships get second chances</li>
                  <li>• Feelings are respected, not judged</li>
                  <li>• Safe meetings and guided conversations protect both hearts</li>
                  <li>• Every emotion finds the right path to the right person</li>
                </ul>
                <p className="text-lg text-[#2D1B4E] font-semibold leading-relaxed text-center mt-6">
                  We aim to turn unspoken emotions into unforgettable moments — one confession at a time.
                </p>
              </div>

              {/* Our Story */}
              <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-[#d4c5e8]/30 shadow-xl mb-8">
                <h3 className="text-3xl md:text-4xl font-bold text-[#2D1B4E] mb-6 text-center">
                  <span className="gradient-text">Our Story</span>
                </h3>
                <p className="text-lg text-[#6B5B8E] leading-relaxed mb-4">
                  <span className="font-bold text-[#2D1B4E]">Izhaar</span> was born from a simple truth —
                  people feel deeply, but not everyone can express it.
                </p>
                <div className="text-lg text-[#6B5B8E] leading-relaxed mb-4 space-y-2">
                  <p>Some freeze.</p>
                  <p>Some overthink.</p>
                  <p>Some fear rejection.</p>
                  <p>Some fear losing the relationship.</p>
                  <p>And some just don't know how to say it.</p>
                </div>
                <p className="text-lg text-[#6B5B8E] leading-relaxed mb-4">
                  We saw countless beautiful connections ending before they even began…
                  not because feelings were missing,
                  but because words were.
                </p>
                <p className="text-lg text-[#6B5B8E] leading-relaxed mb-4">
                  So we created <span className="font-bold text-[#2D1B4E]">Izhaar</span> —
                  a platform that speaks for the shy, the scared, the nervous, the emotional, the introverted,
                  and the deeply genuine.
                </p>
                <p className="text-lg text-[#6B5B8E] leading-relaxed mb-4">
                  From anonymous confessions to love-filled surprises,
                  from guided conversations to verified, safe meetings —
                  Izhaar ensures that your heart finally reaches the place it always wanted to.
                </p>
                <div className="text-lg text-[#2D1B4E] font-semibold leading-relaxed text-center mt-6 space-y-2">
                  <p>Because every love story deserves a chance.</p>
                  <p>And every feeling deserves to be expressed.</p>
                </div>
              </div>

              {/* Statistics & CTA */}
              <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
                <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-[#d4c5e8]/30 shadow-xl">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
                      <p className="text-[#6B5B8E]">Happy Users</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold gradient-text mb-2">50K+</div>
                      <p className="text-[#6B5B8E]">Messages Sent</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold gradient-text mb-2">5K+</div>
                      <p className="text-[#6B5B8E]">Connections Made</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
                      <p className="text-[#6B5B8E]">Support Available</p>
                    </div>
                  </div>
                </div>

                <div className="text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#2D1B4E] mb-6">
                    Ready to Express Your Heart?
                  </h3>
                  <p className="text-lg text-[#6B5B8E] mb-6 leading-relaxed">
                    Join thousands who found the courage to speak their truth through Izhaar.
                  </p>
                  <button
                    onClick={() => navigate("/user/dashboard")}
                    className="px-10 py-4 rounded-full font-bold bg-gradient-to-r from-[#E91E63] to-[#9C27B0] text-white shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Start Your Izhaar Journey ➜
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        </>
    );
}