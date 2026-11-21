import { Camera, MessageSquare, Handshake } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "List your item",
      description:
        "Upload photos of your textbook, calculator, or dorm gear. Set a price, open for offers, or mark as a free giveaway.",
      icon: Camera,
    },
    {
      step: "02",
      title: "Connect with campus buyers",
      description:
        "Students message you or submit offers directly. Agree on price and a convenient meetup point.",
      icon: MessageSquare,
    },
    {
      step: "03",
      title: "Meet and exchange",
      description:
        "Meet at the library, cafeteria, or hostel gate. Inspect the product in person and pay via UPI on handover.",
      icon: Handshake,
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 bg-[#fafafa] border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            How CampusKart Works
          </h2>
          <p className="mt-1.5 text-sm text-neutral-600">
            A simple peer-to-peer exchange for university campuses with zero shipping fees.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col rounded-lg border border-neutral-200 bg-white p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-2xl font-bold text-neutral-300">{item.step}</span>
                </div>

                <h3 className="text-base font-semibold text-neutral-900">{item.title}</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
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
