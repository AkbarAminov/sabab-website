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
    cta: string;
    langSwitch: {
      aria: string;
    };
  };
  hero: {
    title: {
      prefix: string;
      emphasis: string;
      suffix: string;
    };
    lead: string;
    ctaServices: string;
    ctaPortfolio: string;
    mobileInvite: string;
  };
  sababWord: {
    ariaLabel: string;
  };
  popup: {
    title: string;
    subtitle: string;
    fields: {
      name: string;
      company: string;
      contact: string;
    };
    consentPrefix: string;
    consentLinkText: string;
    consentSuffix: string;
    submit: string;
    sending: string;
    success: {
      title: string;
      body: string;
    };
    error: {
      bodyPrefix: string;
      telegramLinkText: string;
    };
    rateLimited: string;
    close: string;
  };
  privacy: {
    title: string;
    body: string;
    backHome: string;
  };
  soon: {
    title: string;
    body: string;
    backHome: string;
  };
}

const ru: Dictionary = {
  locale: "ru",
  htmlLang: "ru",
  meta: {
    title: "Sabab Brand Bureau",
    description: "Бренд-бюро, где стратегия и дизайн неразделимы",
  },
  header: {
    logoAlt: "sabab brand bureau",
    logoCtaAria: "Sabab – свяжитесь с нами в Instagram",
    cta: "Оставить заявку",
    langSwitch: {
      aria: "Выбор языка",
    },
  },
  hero: {
    title: {
      prefix: "У каждого решения должна быть своя",
      emphasis: "причина",
      suffix: "",
    },
    lead: "Мы не начинаем с визуала. Сначала исследуем бизнес, людей, рынок и культурный контекст — там находим причину. Превращаем её в стратегию, стратегию — в идею, идею — в дизайн.",
    ctaServices: "Наши услуги",
    ctaPortfolio: "Портфолио",
    mobileInvite: "Расскажите о своём проекте — мы найдём sabab для его успеха",
  },
  sababWord: {
    ariaLabel: "Sabab – оставить заявку",
  },
  popup: {
    title: "Расскажите о своём проекте",
    subtitle: "Мы найдём sabab для его успеха",
    fields: {
      name: "Имя",
      company: "Компания",
      contact: "Telegram или телефон",
    },
    consentPrefix: "Согласен на обработку ",
    consentLinkText: "персональных данных",
    consentSuffix: "",
    submit: "Отправить",
    sending: "Отправляем…",
    success: {
      title: "Спасибо, заявка у нас.",
      body: "Свяжемся в течение рабочего дня.",
    },
    error: {
      bodyPrefix: "Не получилось отправить — ",
      telegramLinkText: "напишите нам в Telegram",
    },
    rateLimited: "Слишком много попыток подряд — подождите немного и попробуйте снова.",
    close: "Закрыть",
  },
  privacy: {
    title: "Политика конфиденциальности",
    body: "Мы собираем имя, название компании (если указано) и контакт (Telegram или телефон) только для того, чтобы связаться с вами по заявке с сайта. Не передаём эти данные третьим лицам и не используем их в иных целях. Чтобы удалить свои данные, напишите нам на team@sababbranding.com.",
    backHome: "На главную",
  },
  soon: {
    title: "Скоро здесь",
    body: "Эта презентация ещё не загружена. Загляните позже.",
    backHome: "На главную",
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
    logoCtaAria: "Sabab – get in touch on Instagram",
    cta: "Send a request",
    langSwitch: {
      aria: "Language",
    },
  },
  hero: {
    title: {
      prefix: "Every decision should have its own",
      emphasis: "reason",
      suffix: "",
    },
    lead: "We don't start with visuals. First we study the business, the people, the market and the cultural context — that's where we find the reason. We turn it into a strategy, the strategy into an idea, the idea into design.",
    ctaServices: "Our services",
    ctaPortfolio: "Portfolio",
    mobileInvite: "Tell us about your project — we'll find the sabab for its success",
  },
  sababWord: {
    ariaLabel: "Sabab – open the request form",
  },
  popup: {
    title: "Tell us about your project",
    subtitle: "We'll find the sabab for its success",
    fields: {
      name: "Name",
      company: "Company",
      contact: "Telegram or phone",
    },
    consentPrefix: "I agree to the processing of ",
    consentLinkText: "personal data",
    consentSuffix: "",
    submit: "Send",
    sending: "Sending…",
    success: {
      title: "Thanks, we've got your request.",
      body: "We'll be in touch within one business day.",
    },
    error: {
      bodyPrefix: "Couldn't send it — ",
      telegramLinkText: "message us on Telegram",
    },
    rateLimited: "Too many attempts in a row — please wait a bit and try again.",
    close: "Close",
  },
  privacy: {
    title: "Privacy Policy",
    body: "We collect your name, company (if provided) and contact (Telegram or phone) only to get in touch about your request from the website. We don't share this data with third parties or use it for any other purpose. To remove your data, email us at team@sababbranding.com.",
    backHome: "Back home",
  },
  soon: {
    title: "Coming soon",
    body: "This presentation hasn't been uploaded yet. Check back soon.",
    backHome: "Back home",
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
    logoCtaAria: "Sabab – Instagramda bog'laning",
    cta: "Ariza qoldirish",
    langSwitch: {
      aria: "Til tanlash",
    },
  },
  hero: {
    title: {
      prefix: "Har bir qarorning o'z",
      emphasis: "sabab",
      suffix: " bo'lishi kerak",
    },
    lead: "Biz vizualdan boshlamaymiz. Avval biznesni, odamlarni, bozorni va madaniy kontekstni o'rganamiz — aynan shu yerda sababni topamiz. Keyin uni strategiyaga, strategiyani g'oyaga, g'oyani esa dizaynga aylantiramiz.",
    ctaServices: "Xizmatlarimiz",
    ctaPortfolio: "Portfolio",
    mobileInvite: "Loyihangiz haqida gapirib bering — biz uning sababini topamiz",
  },
  sababWord: {
    ariaLabel: "Sabab – ariza shaklini ochish",
  },
  popup: {
    title: "Loyihangiz haqida gapirib bering",
    subtitle: "Biz uning sababini topamiz",
    fields: {
      name: "Ism",
      company: "Kompaniya",
      contact: "Telegram yoki telefon",
    },
    consentPrefix: "",
    consentLinkText: "Shaxsiy ma'lumotlarni",
    consentSuffix: " qayta ishlashga roziman",
    submit: "Yuborish",
    sending: "Yuborilmoqda…",
    success: {
      title: "Rahmat, arizangiz qabul qilindi.",
      body: "Bir ish kuni ichida bog'lanamiz.",
    },
    error: {
      bodyPrefix: "Yuborib bo'lmadi — ",
      telegramLinkText: "bizga Telegramda yozing",
    },
    rateLimited: "Juda ko'p urinish — biroz kutib, qaytadan urinib ko'ring.",
    close: "Yopish",
  },
  privacy: {
    title: "Maxfiylik siyosati",
    body: "Biz ismingiz, kompaniya nomini (agar ko'rsatilgan bo'lsa) va aloqa ma'lumotini (Telegram yoki telefon) faqat saytdagi arizangiz bo'yicha bog'lanish uchun to'playmiz. Ma'lumotlaringizni uchinchi shaxslarga bermaymiz va boshqa maqsadlarda ishlatmaymiz. Ma'lumotlaringizni o'chirish uchun team@sababbranding.com manziliga yozing.",
    backHome: "Bosh sahifaga",
  },
  soon: {
    title: "Tez orada",
    body: "Bu taqdimot hali yuklanmagan. Birozdan so'ng qayta tekshiring.",
    backHome: "Bosh sahifaga",
  },
};

const dictionaries: Record<Locale, Dictionary> = { ru, uz, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
