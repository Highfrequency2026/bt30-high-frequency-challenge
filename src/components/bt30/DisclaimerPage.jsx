import React from 'react';

export default function DisclaimerPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white print:break-after-page">
      {/* Header image strip */}
      <div className="relative h-40 bg-zinc-800 flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80"
          alt="Gym"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 bg-black/80 px-12 py-4">
          <h1 className="text-white font-black text-4xl tracking-[0.2em] uppercase">DISCLAIMER</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-10 space-y-4 text-sm text-zinc-700 leading-relaxed">
        <p className="uppercase font-bold text-xs tracking-wider">
          FORCEFITNESS 30 DAY CHALLENGE CREATED BY Fortified Fitness LLC d/b/a Force Fitness and collaborated with Bre Tiesi (HEREINAFTER CALLED "HIGH FREQUENCY BT30DAY CHALLENGE") IS NOT A SUBSTITUTE FOR DIRECT, PERSONAL, PROFESSIONAL MEDICAL CARE AND DIAGNOSIS. NONE OF THE EXERCISE ROUTINES CONTAINED IN THE "BT30DAY CHALLENGE" SHOULD BE PERFORMED OR OTHERWISE USED WITHOUT CLEARANCE FROM YOUR PHYSICIAN OR HEALTH CARE PROVIDER FIRST.
        </p>
        <p className="uppercase text-xs leading-relaxed">
          THE INFORMATION CONTAINED WITHIN IS NOT INTENDED TO PROVIDE SPECIFIC PHYSICAL OR MENTAL HEALTH ADVICE, OR ANY OTHER ADVICE WHATSOEVER, FOR ANY INDIVIDUAL OR COMPANY AND SHOULD NOT BE RELIED UPON IN THAT REGARD. WE ARE NOT MEDICAL PROFESSIONALS AND NOTHING WITHIN THIS PROGRAM SHOULD BE MISCONSTRUED TO MEAN OTHERWISE.
        </p>
        <p className="uppercase text-xs leading-relaxed">
          WE STRONGLY RECOMMEND THAT YOU CONSULT WITH YOUR PHYSICIAN BEFORE BEGINNING ANY EXERCISE PROGRAM. YOU SHOULD BE IN GOOD PHYSICAL CONDITION AND BE ABLE TO PARTICIPATE IN THE EXERCISE.
        </p>
        <p className="uppercase text-xs leading-relaxed">
          BT30DAYCHALLENGE.COM IS NOT A LICENSED MEDICAL CARE PROVIDER AND REPRESENTS THAT IT HAS NO EXPERTISE IN DIAGNOSING, EXAMINING, OR TREATING MEDICAL CONDITIONS OF ANY KIND, OR IN DETERMINING THE EFFECT OF ANY SPECIFIC EXERCISE ON A MEDICAL CONDITION.
        </p>
        <p className="uppercase text-xs leading-relaxed">
          YOU SHOULD UNDERSTAND THAT WHEN PARTICIPATING IN ANY EXERCISE OR EXERCISE PROGRAM, THERE IS THE POSSIBILITY OF PHYSICAL INJURY. IF YOU ENGAGE IN THIS EXERCISE OR EXERCISE PROGRAM, YOU AGREE THAT YOU DO SO AT YOUR OWN RISK, ARE VOLUNTARILY PARTICIPATING IN THESE ACTIVITIES, ASSUME ALL RISK OF INJURY TO YOURSELF, AND AGREE TO RELEASE AND DISCHARGE BT30DAYCHALLENGE.COM FROM ANY AND ALL CLAIMS OR CAUSES OF ACTION, KNOWN OR UNKNOWN.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs">
          <li>By entering this website or purchasing or using our blog, videos, programs, services, and/or products, you are agreeing to accept all parts of this disclaimer.</li>
          <li>By using this website, blog, e-mails, or any of our programs, services, or products, you implicitly signify your agreement to all parts of the above disclaimer.</li>
          <li>We will not be held responsible in any way for the information that you request or receive through or on our website, videos, e-mails, programs, services and/or products.</li>
        </ul>
      </div>

      <div className="flex justify-between items-center px-8 py-4 border-t border-zinc-200">
        <span className="text-zinc-400 text-xs tracking-wider">BT30DAYCHALLENGE FT BRE TIESI</span>
        <span className="bg-black text-white font-black italic text-xl px-4 py-2">1</span>
      </div>
    </div>
  );
}