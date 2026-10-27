export type Locale = "ru" | "uz" | "en";

export interface Dictionary {
  locale: Locale;
  htmlLang: string;
  meta: {
    title: string;
    description: string;
  };
  header: {
    logoAlt: string;
    logoCtaAria: string;
    portfolio: {
      full: string;
      short: string;
    };
    langSwitch: {
      aria: string;
    };
  };
  columns: {
    whoWeAre: {
      heading: string;
      lead: string;
      body: string;
    };
    services: {
      heading: string;
      body: string;
      linkLabelText: string;
    };
    contacts: {
      heading: string;
      copiedLabel: string;
    };
  };
  sababWord: {
    ariaLabel: string;
    mobileCta: string;
  };
}

const ru: Dictionary = {
  locale: "ru",
  htmlLang: "ru",
  meta: {
    title: "Sabab Brand Bureau",
    description:
      "Бренд-бюро, где стратегия и дизайн неразделимы",
  },
  header: {
    logoAlt: "sabab brand bureau",
    logoCtaAria: "Sabab — свяжитесь с нами в Instagram",
    portfolio: {
      full: "Посмотреть портфолио",
      short: "Портфолио",
    },
    langSwitch: {
      aria: "Выбор языка",
    },
  },
  columns: {
    whoWeAre: {
      heading: "Кто мы",
      lead: "Бренд-бюро, где стратегия и дизайн неразделимы.",
      body: "Глубоко понимаем культурный код и обосновываем каждое решение исследованием: от названия до последнего элемента айдентики.",
    },
    services: {
      heading: "Услуги",
      body: "Наши услуги можно заказать по отдельности, но они связаны: результат одной становится основанием для следующей.",
      linkLabelText: "Посмотрите наши услуги",
    },
    contacts: {
      heading: "Контакты",
      copiedLabel: "Скопировано",
    },
  },
  sababWord: {
    ariaLabel: "Sabab — написать нам в Instagram",
    mobileCta: "Написать нам →",
  },
};

const en: Dictionary = {
  locale: "en",
  htmlLang: "en",
  meta: {
    title: "Sabab Brand Bureau",
    description: "A brand bureau where strategy and design are inseparable",
  },
  header: {
    logoAlt: "sabab brand bureau",
    logoCtaAria: "Sabab — get in touch on Instagram",
    portfolio: {
      full: "View portfolio",
      short: "Portfolio",
    },
    langSwitch: {
      aria: "Language",
    },
  },
  columns: {
    whoWeAre: {
      heading: "Who we are",
      lead: "A brand bureau where strategy and design are inseparable.",
      body: "We dig deep into cultural code and back every decision with research — from the name to the last element of the identity.",
    },
    services: {
      heading: "Services",
      body: "Our services can be ordered individually, but they are connected: the result of one becomes the foundation for the next.",
      linkLabelText: "See our services",
    },
    contacts: {
      heading: "Contacts",
      copiedLabel: "Copied",
    },
  },
  sababWord: {
    ariaLabel: "Sabab — message us on Instagram",
    mobileCta: "Message us →",
  },
};

const uz: Dictionary = {
  locale: "uz",
  htmlLang: "uz",
  meta: {
    title: "Sabab Brand Bureau",
    description: "Strategiya va dizayn ajralmas bo'lgan brend-byuro",
  },
  header: {
    logoAlt: "sabab brand bureau",
    logoCtaAria: "Sabab — Instagramda bog'laning",
    portfolio: {
      full: "Portfolioni ko'rish",
      short: "Portfolio",
    },
    langSwitch: {
      aria: "Til tanlash",
    },
  },
  columns: {
    whoWeAre: {
      heading: "Biz kimmiz",
      lead: "Strategiya va dizayn ajralmas bo'lgan brend-byuro.",
      body: "Madaniy kodni chuqur tushunamiz va har bir qarorni tadqiqot bilan asoslaymiz: nomlanishdan tortib, identifikatsiyaning oxirgi elementigacha.",
    },
    services: {
      heading: "Xizmatlar",
      body: "Xizmatlarimizni alohida buyurtma qilish mumkin, lekin ular bir-biri bilan bog'liq: birining natijasi keyingisi uchun asos bo'ladi.",
      linkLabelText: "Xizmatlarimizni ko'ring",
    },
    contacts: {
      heading: "Aloqa",
      copiedLabel: "Nusxalandi",
    },
  },
  sababWord: {
    ariaLabel: "Sabab — Instagramda yozing",
    mobileCta: "Yozing →",
  },
};

const dictionaries: Record<Locale, Dictionary> = { ru, uz, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
