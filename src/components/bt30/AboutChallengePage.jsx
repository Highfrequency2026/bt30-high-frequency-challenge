import React from 'react';

export default function AboutChallengePage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white print:break-after-page">
      {/* Mike T Section */}
      <div className="relative h-40 bg-zinc-900 overflow-hidden flex items-end pb-6 px-8">
        <img
          src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80"
          alt="Trainer"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10">
          <h1 className="text-white font-black text-4xl">MIKE T.</h1>
          <p className="text-sky-400">@forcefitnessinc</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8 space-y-6">
        <div>
          <h2 className="text-black font-black text-xl tracking-wider uppercase mb-3">WHO IS MIKE T?</h2>
          <p className="text-zinc-700 leading-relaxed text-sm">
            Mike Truesdale, better known as Mike T, is a Celebrity Trainer and Fitness expert with a client list that reads like the "who's who" of Hollywood. He hails from Baltimore, Maryland, and currently works out of Los Angeles, California. In addition to training A-list stars — such as Bre Tiesi, Taraji P. Henson, Kendall Jenner, Ne-Yo, Meagan Good, and many more — he has also made cameo appearances on numerous television shows. His winning attitude and unparalleled results have made him one of the most sought-after trainers in the game.
          </p>
        </div>

        <div className="bg-black p-6">
          <h3 className="text-white font-black text-xl tracking-wider uppercase mb-3">MIKE T'S M E T H O D O L O G Y</h3>
          <p className="text-sky-400 leading-relaxed text-sm">
            How does Mike T achieve such consistent success? As the creator of the Force Fitness 30 Day Challenge, his methods are a trifecta proven to get results! First, his custom workout plan, tailored to your body type and goals. Second, his flexible approach to maximize the effectiveness of the workouts. And last, but not least, Mike T lends his secret sauce: himself! He is an INTENSE motivator, and believes in coaching by both visual and verbal motivation. He will TELL you and SHOW you that you can do it!!
          </p>
        </div>
      </div>

      {/* The Challenge Section */}
      <div className="bg-black px-8 py-12">
        <h1 className="text-white font-black text-5xl md:text-7xl leading-none tracking-tight uppercase border-4 border-white inline-block px-4 py-2 mb-6">
          THE CHALLENGE
        </h1>

        <p className="text-white text-sm leading-relaxed mb-4">
          Are you <strong>READY</strong> to do this?! <strong>Of COURSE you are!!</strong> Welcome to the High Frequency BT30Day Challenge with Bre Tiesi!!
        </p>
        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
          Bre Tiesi has built one of the most enviable physiques in the entertainment industry, thanks in part to a legendary dedication to fitness — even while balancing motherhood, real estate, and television. Check out her Instagram feed for evidence of her intense workouts and the results they produce.
        </p>

        <h2 className="text-white font-black text-3xl uppercase mb-3">ABOUT FORCE FITNESS</h2>
        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
          Mike T. has been shaping celebrity bodies for over fifteen years. He trains hard, thinks hard, and coaches hard, building the best bodies with his tools of the craft: strength training, diet, and good old fashioned motivational coaching. He is always real, always fun, and is guaranteed to keep you moving toward your goals.
        </p>

        <div className="mt-8">
          <h2 className="text-white font-black text-6xl uppercase mb-4">BRING IT!</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Go hard for 30 days. Don't stop striving, don't let up, and follow the program! It's that simple. You bring the elbow grease, we show you how to get <strong className="text-white">RESULTS</strong>. The workouts can be modified for gym or home. We do the planning, you stick to it; and in 30 days, you will see just how far you can come!
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center px-8 py-4 border-t border-zinc-200">
        <span className="text-zinc-400 text-xs tracking-wider">BT30DAYCHALLENGE FT BRE TIESI</span>
        <span className="bg-black text-white font-black italic text-xl px-4 py-2">5</span>
      </div>
    </div>
  );
}