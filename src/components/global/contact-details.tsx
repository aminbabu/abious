import { cn } from "@/lib/utils";
import { RiMailAiLine, RiPhoneLine } from "@remixicon/react";

const socialItems = [
  {
    id: 1,
    title: "Shoot us an email",
    href: "mailto:amin.babu.bd@gmail.com",
    target: "_self",
    icon: RiMailAiLine,
  },
  // {
  //   id: 2,
  //   title: "Linkedin",
  //   href: "https://www.linkedin.com/in/aminbabu",
  //   target: "_blank",
  //   icon: RiLinkedinLine,
  // },
];

const contactItems = [
  {
    id: 1,
    title: "+880 1621-990178",
    href: "tel:+8801621990178",
    icon: RiPhoneLine,
  },
];

// const locationItem = {
//   id: 1,
//   title: "Board Bazar, Gazipur, Dhaka, Bangladesh",
//   href: "https://maps.app.goo.gl/7gfKKU6n89ug3dnn8",
//   icon: RiUserLocationLine,
// };

const ContactDetails = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex flex-wrap md:flex-nowrap md:flex-col gap-10",
        className
      )}
    >
      <div>
        <h3 className="mb-1 text-xl font-semibold">Chat With Us</h3>
        <p className="mb-4 text-sm">Speak to us anytime, anywhere!</p>
        <ul className="space-y-3">
          {socialItems.map((item) => (
            <li key={item.id} className="flex gap-x-2 text-sm font-semibold">
              <item.icon className="size-5" />
              <a href={item.href} target={item.target} className="underline">
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="mb-1 text-xl font-semibold">Call Us</h3>
        <p className="mb-4 text-sm">Call me on Sun-Thu: 10:00 AM - 6:00 PM</p>
        {contactItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-x-2 text-sm font-semibold"
          >
            <item.icon className="size-5" />
            <a href={item.href} className="underline">
              {item.title}
            </a>
          </div>
        ))}
      </div>
      {/* <div>
        <h3 className="mb-1 text-xl font-semibold">Visit us</h3>
        <p className="mb-4 text-sm">Meet us in person!</p>
        <div className="flex gap-x-2 text-sm font-semibold">
          <locationItem.icon className="size-5" />
          <a href={locationItem.href} target="_blank" className="underline">
            {locationItem.title}
          </a>
        </div>
      </div> */}
    </div>
  );
};

export default ContactDetails;
