export interface DevEvent {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: DevEvent[] = [
  {
    title: "Next.js Conf 2026",
    image: "/images/event1.png",
    slug: "nextjs-conf-2026",
    location: "San Francisco, CA & Online",
    date: "October 22, 2026",
    time: "09:00 AM"
  },
  {
    title: "React Universe Conf 2026",
    image: "/images/event2.png",
    slug: "react-universe-conf-2026",
    location: "Wrocław, Poland",
    date: "September 03, 2026",
    time: "10:00 AM"
  },
  {
    title: "Svelte Summit 2026",
    image: "/images/event3.png",
    slug: "svelte-summit-2026",
    location: "London, UK & Online",
    date: "November 12, 2026",
    time: "02:00 PM"
  },
  {
    title: "JSWorld Conference 2026",
    image: "/images/event4.png",
    slug: "jsworld-conference-2026",
    location: "Amsterdam, Netherlands",
    date: "June 18, 2026",
    time: "08:30 AM"
  },
  {
    title: "AI Engineer Summit 2026",
    image: "/images/event5.png",
    slug: "ai-engineer-summit-2026",
    location: "San Francisco, CA",
    date: "June 25, 2026",
    time: "09:00 AM"
  },
  {
    title: "ViteConf 2026",
    image: "/images/event6.png",
    slug: "viteconf-2026",
    location: "Online",
    date: "October 08, 2026",
    time: "11:00 AM"
  }
];
