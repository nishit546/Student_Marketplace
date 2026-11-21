import { Camera, MessageSquare, Handshake, CheckCircle2 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Snap & List in 60 Seconds",
      description:
        "Take a few pictures of your textbook, calculator, or dorm furniture. Set your price, exchange preference, or mark as a free senior giveaway.",
      icon: Camera,
      badge: "Quick Listing",
    },
    {
      step: "02",
      title: "Connect with Verified Peers",
      description:
        "Interested college mates send direct inquiries or negotiate offers. No spam, no external courier hassles, and zero commission fees.",
      icon: MessageSquare,
      badge: "Instant Chat & Offers",
    },
    {
      step: "03",
      title: "Hand-to-Hand Campus Meetup",
      description:
        "Agree to meet at your college library, cafeteria, or hostel gate. Inspect the product in person and complete payment directly via UPI.",
      icon: Handshake,
      badge: "Safe Handover",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fff2ee] px-3.5 py-1 text-xs font-bold text-[#ff4000] border border-[#ff4000]/20 mb-3">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Simple & Transparent</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            How CampusKart Works
          </h2>
          <p className="mt-3 text-base text-neutral-600">
            A frictionless marketplace designed around campus life, eliminating delivery charges and scam risks.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col rounded-3xl border border-neutral-200/80 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#ff4000]/30 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff2ee] text-[#ff4000] border border-[#ff4000]/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-black text-neutral-200">{item.step}</span>
                </div>

                <div className="mb-2">
                  <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-600">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-neutral-900">{item.title}</h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

