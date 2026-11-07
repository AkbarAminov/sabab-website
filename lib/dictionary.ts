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
    portfolio: string;
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
      lead: string;
      body: string;
      linkLabelText: string;
    };
    contacts: {
      heading: string;
      lead: string;
      copiedLabel: string;
    };
  };
  sababWord: {
    ariaLabel: string;
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
    description:
      "Бренд-бюро, где стратегия и дизайн неразделимы",
  },
  header: {
    logoAlt: "sabab brand bureau",
    logoCtaAria: "Sabab – свяжитесь с нами в Instagram",
    portfolio: "Смотреть кейсы",
    langSwitch: {
      aria: "Выбор языка",
    },
  },
  columns: {
    whoWeAre: {
      heading: "Кто мы",
      lead: "У каждого решения в бренде должна быть причина.",
      body: "Мы не начинаем с визуала. Сначала исследуем бизнес, людей, рынок и культурный контекст – там находим причину. Превращаем её в стратегию, стратегию – в идею, идею – в дизайн.",
    },
    services: {
      heading: "Услуги",
      lead: "Стратегия, нейминг, айдентика и запуск бренда.",
      body: "Можно заказать по отдельности или под ключ. Каждый этап становится основанием для следующего – поэтому в готовом бренде ничего не случайно.",
      linkLabelText: "Как мы работаем и что вы получаете",
    },
    contacts: {
      heading: "Начать проект",
      lead: "Расскажите о своём проекте – найдём его sabab.",
      copiedLabel: "Скопировано",
    },
  },
  sababWord: {
    ariaLabel: "Sabab – написать нам в Instagram",
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
    portfolio: "View cases",
    langSwitch: {
      aria: "Language",
    },
  },
  columns: {
    whoWeAre: {
      heading: "Who we are",
      lead: "Every decision in a brand should have a reason.",
      body: "We don't start with visuals. First we study the business, the people, the market and the cultural context – that's where we find the reason. We turn it into a strategy, the strategy into an idea, the idea into design.",
    },
    services: {
      heading: "Services",
      lead: "Strategy, naming, identity and brand launch.",
      body: "You can order them separately or end-to-end. Each stage becomes the foundation for the next – so nothing in the finished brand is an accident.",
      linkLabelText: "How we work and what you get",
    },
    contacts: {
      heading: "Start a project",
      lead: "Tell us about your project – we'll find its sabab.",
      copiedLabel: "Copied",
    },
  },
  sababWord: {
    ariaLabel: "Sabab – message us on Instagram",
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
    portfolio: "Keyslarni ko'rish",
    langSwitch: {
      aria: "Til tanlash",
    },
  },
  columns: {
    whoWeAre: {
      heading: "Biz kimmiz",
      lead: "Brenddagi har bir qarorning sababi bo'lishi kerak.",
      body: "Biz vizualdan boshlamaymiz. Avval biznesni, odamlarni, bozorni va madaniy kontekstni o'rganamiz – aynan shu yerda sababni topamiz. Keyin uni strategiyaga, strategiyani g'oyaga, g'oyani esa dizaynga aylantiramiz.",
    },
    services: {
      heading: "Xizmatlar",
      lead: "Strategiya, neyming, aydentika va brendni ishga tushirish.",
      body: "Alohida yoki to'liq paketda buyurtma qilish mumkin. Har bir bosqich keyingisi uchun asos bo'ladi – shuning uchun tayyor brendda hech narsa tasodifiy emas.",
      linkLabelText: "Biz qanday ishlaymiz va siz nima olasiz",
    },
    contacts: {
      heading: "Loyihani boshlash",
      lead: "Loyihangiz haqida gapirib bering – uning sababini topamiz.",
      copiedLabel: "Nusxalandi",
    },
  },
  sababWord: {
    ariaLabel: "Sabab – Instagramda yozing",
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
