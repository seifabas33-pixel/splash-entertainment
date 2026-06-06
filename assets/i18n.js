/* Amarina Jannah — i18n engine + dictionaries
   English is the source/fallback; only non-English strings live here.
   Static blocks with inline markup use data-i18n keys; everything else is
   matched by its exact English text. */
(function () {
  'use strict';
  var RTL = ['ar'];
  var LANG = 'en';
  try { LANG = localStorage.getItem('amarina_lang') || 'en'; } catch (e) {}

  // ── Dictionaries ──────────────────────────────────────────────
  var I18N = {
    ar: {
      "Resort": "المنتجع", "Dining": "المطاعم", "Activities": "الأنشطة", "Facilities": "المرافق", "Contact": "تواصل معنا",
      "Explore Dining": "استكشف المطاعم",
      "🍽️ Dining & Outlets": "🍽️ المطاعم والمنافذ", "Explore the Resort": "اكتشف المنتجع",
      "Rooms": "الغرف", "Restaurants": "المطاعم", "Water Slides": "الزحاليق المائية", "Private Beach": "شاطئ خاص",
      "📍 Marsa Alam · Red Sea, Egypt": "📍 مرسى علم · البحر الأحمر، مصر",
      "↓ Scroll to explore": "↓ مرّر للاستكشاف",
      "The Resort": "المنتجع",
      "A brand-new five-star escape on the Red Sea": "وجهة جديدة كليًا فئة خمس نجوم على البحر الأحمر",
      "All-Inclusive": "شامل كليًا", "Family Friendly": "مناسب للعائلات", "Aqua Park": "حديقة مائية", "Diving & Snorkelling": "الغوص والغطس",
      "Accommodation": "الإقامة", "6 room categories": "6 فئات من الغرف",
      "Dining & Outlets": "المطاعم والمنافذ",
      "Where to eat & drink": "أين تأكل وتشرب",
      "From the international Element buffet to themed à-la-carte evenings and beachfront bars — here is every venue at the resort, with live opening status.": "من بوفيه Element العالمي إلى أمسيات المطاعم المختصة وبارات الشاطئ — إليك كل منافذ المنتجع مع حالة العمل المباشرة.",
      "Bars & Lounges": "البارات والصالات",
      "Activities & Entertainment": "الأنشطة والترفيه",
      "A typical day at Amarina Jannah": "يوم نموذجي في أمارينا جنّة",
      "The animation team keeps the day moving — from beach sports and pool games to the kids' mini-disco and a different live show every evening.": "يُبقي فريق الترفيه اليوم نابضًا — من الرياضات الشاطئية وألعاب المسبح إلى ميني ديسكو الأطفال وعرض حيّ مختلف كل مساء.",
      "After Dark": "بعد حلول الظلام", "Evening Entertainment": "ترفيه المساء",
      "Programme shown is representative of a typical week. Exact activities & times are posted daily by the animation team at the resort.": "البرنامج المعروض يمثّل أسبوعًا نموذجيًا. تُعلن الأنشطة والأوقات الدقيقة يوميًا من قبل فريق الترفيه في المنتجع.",
      "Facilities & Map": "المرافق والخريطة",
      "Everything on resort": "كل شيء داخل المنتجع",
      "Aqua park, pools, a private beach with house reef, dive centre, spa and a supervised kids' club — all within the grounds.": "حديقة مائية ومسابح وشاطئ خاص بشعاب مرجانية ومركز غوص وسبا ونادٍ للأطفال تحت إشراف — كل ذلك ضمن المنتجع.",
      "Get in Touch": "تواصل معنا", "Plan your stay": "خطّط لإقامتك",
      "Reach the resort directly for reservations, à-la-carte bookings and guest services.": "تواصل مع المنتجع مباشرةً للحجوزات وحجوزات المطاعم المختصة وخدمات الضيوف.",
      "Official Website": "الموقع الرسمي", "Location": "الموقع", "Airport": "المطار",
      "Marsa Alam, Red Sea, Egypt": "مرسى علم، البحر الأحمر، مصر",
      "~10 min · Marsa Alam Int'l (RMF)": "~10 دقائق · مطار مرسى علم الدولي (RMF)",
      "MARSA ALAM · RED SEA · EGYPT": "مرسى علم · البحر الأحمر · مصر",
      "Resort & Aqua Park · Marsa Alam": "منتجع وحديقة مائية · مرسى علم",
      "Resort & Aqua Park — a five-star Red Sea retreat where turquoise water meets a private 175-metre beach.": "منتجع وحديقة مائية — ملاذ خمس نجوم على البحر الأحمر، حيث تلتقي المياه الفيروزية بشاطئ خاص يمتد 175 مترًا.",
      "Guest-experience platform. Dining, activity and facility details are compiled from publicly available resort information and may change seasonally — please confirm à-la-carte bookings, opening hours and surcharges with the resort on arrival.": "منصة تجربة الضيوف. تفاصيل المطاعم والأنشطة والمرافق مجمّعة من معلومات المنتجع المتاحة للعموم وقد تتغيّر موسميًا — يُرجى تأكيد حجوزات المطاعم وأوقات العمل والرسوم الإضافية مع المنتجع عند الوصول.",
      "about_p1": "<strong>منتجع وحديقة أمارينا جنّة المائية</strong> افتُتح عام 2023 على ساحل البحر الأحمر الجنوبي في مصر، في منتصف الطريق بين بورت غالب والقصير وعلى بُعد دقائق من مطار مرسى علم الدولي.",
      "about_p2": "يقع مباشرةً على <strong>شاطئ رملي خاص بطول 175 مترًا</strong> بجوار شعاب مرجانية شهيرة، ويمزج المنتجع بين راحة نظام الشامل كليًا وواحدة من أفضل الحدائق المائية في المنطقة ومركز غوص PADI وسبا متكامل للعافية.",
      "about_p3": "بـ<strong>280 غرفة</strong> وأربعة مطاعم وبرنامج ترفيهي يومي حيّ، صُمّم أمارينا جنّة للعائلات والأزواج والغوّاصين على حدٍّ سواء.",
      "bev_note": "🥂 <b>خدمة المشروبات الشاملة كليًا تعمل من 10:00 حتى 00:00</b> — مشروبات باردة وساخنة وبيرة ونبيذ وكوكتيلات ومشروبات روحية محلية، إضافةً إلى مشروب ترحيبي ووجبات خفيفة من 13:00 حتى 17:00. العصائر الطازجة والقهوة التركية برسوم إضافية بسيطة.",
      "footer_credit": "صُمّم بواسطة <a href=\"index.html\">Splash Entertainment</a> · منصة تجربة الضيوف"
    },
    nl: {
      "Resort": "Resort", "Dining": "Eten & drinken", "Activities": "Activiteiten", "Facilities": "Faciliteiten", "Contact": "Contact",
      "Explore Dining": "Bekijk restaurants",
      "🍽️ Dining & Outlets": "🍽️ Eten & gelegenheden", "Explore the Resort": "Ontdek het resort",
      "Rooms": "Kamers", "Restaurants": "Restaurants", "Water Slides": "Waterglijbanen", "Private Beach": "Privéstrand",
      "📍 Marsa Alam · Red Sea, Egypt": "📍 Marsa Alam · Rode Zee, Egypte",
      "↓ Scroll to explore": "↓ Scroll om te ontdekken",
      "The Resort": "Het resort",
      "A brand-new five-star escape on the Red Sea": "Een gloednieuwe vijfsterrenbestemming aan de Rode Zee",
      "All-Inclusive": "All-inclusive", "Family Friendly": "Gezinsvriendelijk", "Aqua Park": "Aquapark", "Diving & Snorkelling": "Duiken & snorkelen",
      "Accommodation": "Accommodatie", "6 room categories": "6 kamercategorieën",
      "Dining & Outlets": "Eten & gelegenheden",
      "Where to eat & drink": "Waar te eten & drinken",
      "From the international Element buffet to themed à-la-carte evenings and beachfront bars — here is every venue at the resort, with live opening status.": "Van het internationale Element-buffet tot thema-avonden à la carte en strandbars — hier vind je elke gelegenheid in het resort, met live openingsstatus.",
      "Bars & Lounges": "Bars & lounges",
      "Activities & Entertainment": "Activiteiten & entertainment",
      "A typical day at Amarina Jannah": "Een typische dag in Amarina Jannah",
      "The animation team keeps the day moving — from beach sports and pool games to the kids' mini-disco and a different live show every evening.": "Het animatieteam houdt de dag in beweging — van strandsporten en zwembadspellen tot de mini-disco voor kinderen en elke avond een andere live show.",
      "After Dark": "Na zonsondergang", "Evening Entertainment": "Avondentertainment",
      "Programme shown is representative of a typical week. Exact activities & times are posted daily by the animation team at the resort.": "Het getoonde programma is representatief voor een typische week. De exacte activiteiten & tijden worden dagelijks door het animatieteam in het resort bekendgemaakt.",
      "Facilities & Map": "Faciliteiten & plattegrond",
      "Everything on resort": "Alles op het resort",
      "Aqua park, pools, a private beach with house reef, dive centre, spa and a supervised kids' club — all within the grounds.": "Aquapark, zwembaden, een privéstrand met huisrif, duikcentrum, spa en een begeleide kidsclub — allemaal op het terrein.",
      "Get in Touch": "Neem contact op", "Plan your stay": "Plan je verblijf",
      "Reach the resort directly for reservations, à-la-carte bookings and guest services.": "Neem rechtstreeks contact op met het resort voor reserveringen, à-la-carteboekingen en gastenservice.",
      "Official Website": "Officiële website", "Location": "Locatie", "Airport": "Luchthaven",
      "Marsa Alam, Red Sea, Egypt": "Marsa Alam, Rode Zee, Egypte",
      "~10 min · Marsa Alam Int'l (RMF)": "~10 min · Marsa Alam Int'l (RMF)",
      "MARSA ALAM · RED SEA · EGYPT": "MARSA ALAM · RODE ZEE · EGYPTE",
      "Resort & Aqua Park · Marsa Alam": "Resort & aquapark · Marsa Alam",
      "Resort & Aqua Park — a five-star Red Sea retreat where turquoise water meets a private 175-metre beach.": "Resort & aquapark — een vijfsterrenparadijs aan de Rode Zee, waar turquoise water samenkomt met een privéstrand van 175 meter.",
      "Guest-experience platform. Dining, activity and facility details are compiled from publicly available resort information and may change seasonally — please confirm à-la-carte bookings, opening hours and surcharges with the resort on arrival.": "Gastervaringsplatform. Details over eten, activiteiten en faciliteiten zijn samengesteld uit openbaar beschikbare resortinformatie en kunnen per seizoen veranderen — bevestig à-la-carteboekingen, openingstijden en toeslagen bij aankomst met het resort.",
      "about_p1": "<strong>Amarina Jannah Resort &amp; Aqua Park</strong> opende in 2023 aan de zuidelijke Rode Zee-kust van Egypte, halverwege tussen Port Ghalib en El Quseir en op enkele minuten van de internationale luchthaven van Marsa Alam.",
      "about_p2": "Direct gelegen aan een <strong>175 meter lang privé-zandstrand</strong> naast een gevierd huisrif, combineert het resort all-inclusive comfort met een van de beste aquaparken van de regio, een PADI-duikcentrum en een complete wellnessspa.",
      "about_p3": "Met <strong>280 kamers</strong>, vier restaurants en een levendig dagelijks entertainmentprogramma is Amarina Jannah er voor gezinnen, koppels en duikers.",
      "bev_note": "🥂 <b>De all-inclusive drankenservice loopt van 10:00 tot 00:00</b> — frisse & warme dranken, bier, wijn, cocktails en lokale sterke drank, plus een welkomstdrankje en lichte snacks van 13:00 tot 17:00. Verse sappen & Turkse koffie tegen een kleine toeslag.",
      "footer_credit": "Gemaakt door <a href=\"index.html\">Splash Entertainment</a> · Gastervaringsplatform"
    },
    de: {
      "Resort": "Resort", "Dining": "Gastronomie", "Activities": "Aktivitäten", "Facilities": "Einrichtungen", "Contact": "Kontakt",
      "Explore Dining": "Gastronomie ansehen",
      "🍽️ Dining & Outlets": "🍽️ Gastronomie & Outlets", "Explore the Resort": "Resort entdecken",
      "Rooms": "Zimmer", "Restaurants": "Restaurants", "Water Slides": "Wasserrutschen", "Private Beach": "Privatstrand",
      "📍 Marsa Alam · Red Sea, Egypt": "📍 Marsa Alam · Rotes Meer, Ägypten",
      "↓ Scroll to explore": "↓ Zum Entdecken scrollen",
      "The Resort": "Das Resort",
      "A brand-new five-star escape on the Red Sea": "Ein brandneues Fünf-Sterne-Refugium am Roten Meer",
      "All-Inclusive": "All-Inclusive", "Family Friendly": "Familienfreundlich", "Aqua Park": "Aquapark", "Diving & Snorkelling": "Tauchen & Schnorcheln",
      "Accommodation": "Unterkunft", "6 room categories": "6 Zimmerkategorien",
      "Dining & Outlets": "Gastronomie & Outlets",
      "Where to eat & drink": "Wo man isst & trinkt",
      "From the international Element buffet to themed à-la-carte evenings and beachfront bars — here is every venue at the resort, with live opening status.": "Vom internationalen Element-Buffet über thematische À-la-carte-Abende bis zu Strandbars — hier ist jede Location des Resorts, mit Live-Öffnungsstatus.",
      "Bars & Lounges": "Bars & Lounges",
      "Activities & Entertainment": "Aktivitäten & Unterhaltung",
      "A typical day at Amarina Jannah": "Ein typischer Tag im Amarina Jannah",
      "The animation team keeps the day moving — from beach sports and pool games to the kids' mini-disco and a different live show every evening.": "Das Animationsteam hält den Tag in Bewegung — von Strandsport und Poolspielen bis zur Mini-Disco für Kinder und jeden Abend einer anderen Live-Show.",
      "After Dark": "Nach Einbruch der Dunkelheit", "Evening Entertainment": "Abendunterhaltung",
      "Programme shown is representative of a typical week. Exact activities & times are posted daily by the animation team at the resort.": "Das gezeigte Programm steht beispielhaft für eine typische Woche. Genaue Aktivitäten & Zeiten gibt das Animationsteam täglich im Resort bekannt.",
      "Facilities & Map": "Einrichtungen & Karte",
      "Everything on resort": "Alles im Resort",
      "Aqua park, pools, a private beach with house reef, dive centre, spa and a supervised kids' club — all within the grounds.": "Aquapark, Pools, ein Privatstrand mit Hausriff, Tauchbasis, Spa und ein betreuter Kids-Club — alles auf dem Gelände.",
      "Get in Touch": "Kontakt aufnehmen", "Plan your stay": "Planen Sie Ihren Aufenthalt",
      "Reach the resort directly for reservations, à-la-carte bookings and guest services.": "Wenden Sie sich für Reservierungen, À-la-carte-Buchungen und Gästeservice direkt an das Resort.",
      "Official Website": "Offizielle Website", "Location": "Lage", "Airport": "Flughafen",
      "Marsa Alam, Red Sea, Egypt": "Marsa Alam, Rotes Meer, Ägypten",
      "~10 min · Marsa Alam Int'l (RMF)": "~10 Min · Flughafen Marsa Alam (RMF)",
      "MARSA ALAM · RED SEA · EGYPT": "MARSA ALAM · ROTES MEER · ÄGYPTEN",
      "Resort & Aqua Park · Marsa Alam": "Resort & Aquapark · Marsa Alam",
      "Resort & Aqua Park — a five-star Red Sea retreat where turquoise water meets a private 175-metre beach.": "Resort & Aquapark — ein Fünf-Sterne-Refugium am Roten Meer, wo türkisfarbenes Wasser auf einen 175 Meter langen Privatstrand trifft.",
      "Guest-experience platform. Dining, activity and facility details are compiled from publicly available resort information and may change seasonally — please confirm à-la-carte bookings, opening hours and surcharges with the resort on arrival.": "Gästeerlebnis-Plattform. Angaben zu Gastronomie, Aktivitäten und Einrichtungen stammen aus öffentlich verfügbaren Resort-Informationen und können saisonal variieren — bitte bestätigen Sie À-la-carte-Buchungen, Öffnungszeiten und Zuschläge bei der Ankunft im Resort.",
      "about_p1": "<strong>Amarina Jannah Resort &amp; Aqua Park</strong> wurde 2023 an der südlichen Rotmeerküste Ägyptens eröffnet, auf halbem Weg zwischen Port Ghalib und El Quseir und nur wenige Minuten vom internationalen Flughafen Marsa Alam entfernt.",
      "about_p2": "Direkt an einem <strong>175 Meter langen privaten Sandstrand</strong> neben einem gefeierten Hausriff gelegen, verbindet das Resort All-Inclusive-Komfort mit einem der besten Aquaparks der Region, einer PADI-Tauchbasis und einem umfassenden Wellness-Spa.",
      "about_p3": "Mit <strong>280 Zimmern</strong>, vier Restaurants und einem lebhaften täglichen Unterhaltungsprogramm ist das Amarina Jannah gleichermaßen für Familien, Paare und Taucher gemacht.",
      "bev_note": "🥂 <b>Der All-Inclusive-Getränkeservice läuft von 10:00 bis 00:00 Uhr</b> — kalte & heiße Getränke, Bier, Wein, Cocktails und lokale Spirituosen, dazu ein Willkommensgetränk und kleine Snacks von 13:00 bis 17:00 Uhr. Frische Säfte & türkischer Kaffee gegen einen kleinen Aufpreis.",
      "footer_credit": "Gestaltet von <a href=\"index.html\">Splash Entertainment</a> · Gästeerlebnis-Plattform"
    },
    pl: {
      "Resort": "Resort", "Dining": "Gastronomia", "Activities": "Atrakcje", "Facilities": "Udogodnienia", "Contact": "Kontakt",
      "Explore Dining": "Zobacz gastronomię",
      "🍽️ Dining & Outlets": "🍽️ Gastronomia i punkty", "Explore the Resort": "Poznaj resort",
      "Rooms": "Pokoje", "Restaurants": "Restauracje", "Water Slides": "Zjeżdżalnie wodne", "Private Beach": "Prywatna plaża",
      "📍 Marsa Alam · Red Sea, Egypt": "📍 Marsa Alam · Morze Czerwone, Egipt",
      "↓ Scroll to explore": "↓ Przewiń, aby odkrywać",
      "The Resort": "Resort",
      "A brand-new five-star escape on the Red Sea": "Zupełnie nowa pięciogwiazdkowa oaza nad Morzem Czerwonym",
      "All-Inclusive": "All inclusive", "Family Friendly": "Przyjazny rodzinom", "Aqua Park": "Aquapark", "Diving & Snorkelling": "Nurkowanie i snorkeling",
      "Accommodation": "Zakwaterowanie", "6 room categories": "6 kategorii pokoi",
      "Dining & Outlets": "Gastronomia i punkty",
      "Where to eat & drink": "Gdzie zjeść i napić się",
      "From the international Element buffet to themed à-la-carte evenings and beachfront bars — here is every venue at the resort, with live opening status.": "Od międzynarodowego bufetu Element po tematyczne wieczory à la carte i bary przy plaży — oto wszystkie punkty resortu wraz z aktualnym statusem otwarcia.",
      "Bars & Lounges": "Bary i lounge",
      "Activities & Entertainment": "Atrakcje i rozrywka",
      "A typical day at Amarina Jannah": "Typowy dzień w Amarina Jannah",
      "The animation team keeps the day moving — from beach sports and pool games to the kids' mini-disco and a different live show every evening.": "Zespół animatorów dba o tempo dnia — od sportów plażowych i gier basenowych po mini-disco dla dzieci i inny występ na żywo każdego wieczoru.",
      "After Dark": "Po zmroku", "Evening Entertainment": "Wieczorna rozrywka",
      "Programme shown is representative of a typical week. Exact activities & times are posted daily by the animation team at the resort.": "Pokazany program jest reprezentatywny dla typowego tygodnia. Dokładne atrakcje i godziny są codziennie ogłaszane przez zespół animatorów w resorcie.",
      "Facilities & Map": "Udogodnienia i mapa",
      "Everything on resort": "Wszystko na terenie resortu",
      "Aqua park, pools, a private beach with house reef, dive centre, spa and a supervised kids' club — all within the grounds.": "Aquapark, baseny, prywatna plaża z rafą przybrzeżną, centrum nurkowe, spa i klub dziecięcy z opieką — wszystko na terenie resortu.",
      "Get in Touch": "Skontaktuj się", "Plan your stay": "Zaplanuj pobyt",
      "Reach the resort directly for reservations, à-la-carte bookings and guest services.": "Skontaktuj się bezpośrednio z resortem w sprawie rezerwacji, rezerwacji à la carte i obsługi gości.",
      "Official Website": "Oficjalna strona", "Location": "Lokalizacja", "Airport": "Lotnisko",
      "Marsa Alam, Red Sea, Egypt": "Marsa Alam, Morze Czerwone, Egipt",
      "~10 min · Marsa Alam Int'l (RMF)": "~10 min · Lotnisko Marsa Alam (RMF)",
      "MARSA ALAM · RED SEA · EGYPT": "MARSA ALAM · MORZE CZERWONE · EGIPT",
      "Resort & Aqua Park · Marsa Alam": "Resort i aquapark · Marsa Alam",
      "Resort & Aqua Park — a five-star Red Sea retreat where turquoise water meets a private 175-metre beach.": "Resort i aquapark — pięciogwiazdkowa oaza nad Morzem Czerwonym, gdzie turkusowa woda spotyka się z prywatną plażą o długości 175 metrów.",
      "Guest-experience platform. Dining, activity and facility details are compiled from publicly available resort information and may change seasonally — please confirm à-la-carte bookings, opening hours and surcharges with the resort on arrival.": "Platforma obsługi gości. Szczegóły dotyczące gastronomii, atrakcji i udogodnień opracowano na podstawie publicznie dostępnych informacji o resorcie i mogą się zmieniać sezonowo — prosimy potwierdzić rezerwacje à la carte, godziny otwarcia i dopłaty z resortem po przyjeździe.",
      "about_p1": "<strong>Amarina Jannah Resort &amp; Aqua Park</strong> otwarto w 2023 roku na południowym wybrzeżu Morza Czerwonego w Egipcie, w połowie drogi między Port Ghalib a El Quseir i kilka minut od międzynarodowego lotniska Marsa Alam.",
      "about_p2": "Położony bezpośrednio przy <strong>prywatnej, piaszczystej plaży o długości 175 metrów</strong> obok słynnej rafy przybrzeżnej, resort łączy komfort all inclusive z jednym z najlepszych aquaparków w regionie, centrum nurkowym PADI i pełnym spa wellness.",
      "about_p3": "Z <strong>280 pokojami</strong>, czterema restauracjami i tętniącym życiem codziennym programem rozrywkowym, Amarina Jannah jest stworzony zarówno dla rodzin, par, jak i nurków.",
      "bev_note": "🥂 <b>Serwis napojów all inclusive działa od 10:00 do 00:00</b> — napoje zimne i ciepłe, piwo, wino, koktajle i lokalne alkohole, a także drink powitalny i lekkie przekąski od 13:00 do 17:00. Świeże soki i kawa po turecku za niewielką dopłatą.",
      "footer_credit": "Zaprojektowane przez <a href=\"index.html\">Splash Entertainment</a> · Platforma obsługi gości"
    },
    cs: {
      "Resort": "Resort", "Dining": "Restaurace", "Activities": "Aktivity", "Facilities": "Vybavení", "Contact": "Kontakt",
      "Explore Dining": "Prohlédnout restaurace",
      "🍽️ Dining & Outlets": "🍽️ Restaurace a podniky", "Explore the Resort": "Objevte resort",
      "Rooms": "Pokoje", "Restaurants": "Restaurace", "Water Slides": "Tobogány", "Private Beach": "Soukromá pláž",
      "📍 Marsa Alam · Red Sea, Egypt": "📍 Marsa Alam · Rudé moře, Egypt",
      "↓ Scroll to explore": "↓ Posuňte pro objevování",
      "The Resort": "Resort",
      "A brand-new five-star escape on the Red Sea": "Zcela nový pětihvězdičkový ráj u Rudého moře",
      "All-Inclusive": "All inclusive", "Family Friendly": "Vhodné pro rodiny", "Aqua Park": "Aquapark", "Diving & Snorkelling": "Potápění a šnorchlování",
      "Accommodation": "Ubytování", "6 room categories": "6 kategorií pokojů",
      "Dining & Outlets": "Restaurace a podniky",
      "Where to eat & drink": "Kde jíst a pít",
      "From the international Element buffet to themed à-la-carte evenings and beachfront bars — here is every venue at the resort, with live opening status.": "Od mezinárodního bufetu Element po tematické à la carte večery a bary u pláže — zde najdete každý podnik resortu s aktuálním stavem otevření.",
      "Bars & Lounges": "Bary a salonky",
      "Activities & Entertainment": "Aktivity a zábava",
      "A typical day at Amarina Jannah": "Typický den v Amarina Jannah",
      "The animation team keeps the day moving — from beach sports and pool games to the kids' mini-disco and a different live show every evening.": "Animační tým udržuje den v pohybu — od plážových sportů a bazénových her po dětskou mini-disco a každý večer jinou živou show.",
      "After Dark": "Po setmění", "Evening Entertainment": "Večerní zábava",
      "Programme shown is representative of a typical week. Exact activities & times are posted daily by the animation team at the resort.": "Zobrazený program je reprezentativní pro typický týden. Přesné aktivity a časy zveřejňuje animační tým v resortu každý den.",
      "Facilities & Map": "Vybavení a mapa",
      "Everything on resort": "Vše v resortu",
      "Aqua park, pools, a private beach with house reef, dive centre, spa and a supervised kids' club — all within the grounds.": "Aquapark, bazény, soukromá pláž s domácím útesem, potápěčské centrum, lázně a hlídaný dětský klub — vše v areálu.",
      "Get in Touch": "Spojte se s námi", "Plan your stay": "Naplánujte si pobyt",
      "Reach the resort directly for reservations, à-la-carte bookings and guest services.": "Kontaktujte resort přímo ohledně rezervací, à la carte rezervací a služeb pro hosty.",
      "Official Website": "Oficiální web", "Location": "Poloha", "Airport": "Letiště",
      "Marsa Alam, Red Sea, Egypt": "Marsa Alam, Rudé moře, Egypt",
      "~10 min · Marsa Alam Int'l (RMF)": "~10 min · Letiště Marsa Alam (RMF)",
      "MARSA ALAM · RED SEA · EGYPT": "MARSA ALAM · RUDÉ MOŘE · EGYPT",
      "Resort & Aqua Park · Marsa Alam": "Resort a aquapark · Marsa Alam",
      "Resort & Aqua Park — a five-star Red Sea retreat where turquoise water meets a private 175-metre beach.": "Resort a aquapark — pětihvězdičkový ráj u Rudého moře, kde se tyrkysová voda setkává se soukromou 175metrovou pláží.",
      "Guest-experience platform. Dining, activity and facility details are compiled from publicly available resort information and may change seasonally — please confirm à-la-carte bookings, opening hours and surcharges with the resort on arrival.": "Platforma pro zážitek hostů. Údaje o stravování, aktivitách a vybavení jsou sestaveny z veřejně dostupných informací o resortu a mohou se sezónně měnit — rezervace à la carte, otevírací dobu a příplatky si prosím potvrďte s resortem po příjezdu.",
      "about_p1": "<strong>Amarina Jannah Resort &amp; Aqua Park</strong> byl otevřen v roce 2023 na jižním pobřeží Rudého moře v Egyptě, na půli cesty mezi Port Ghalib a El Quseir a jen pár minut od mezinárodního letiště Marsa Alam.",
      "about_p2": "Leží přímo na <strong>175 metrů dlouhé soukromé písečné pláži</strong> u proslulého domácího útesu a kombinuje pohodlí all inclusive s jedním z nejlepších aquaparků v regionu, potápěčským centrem PADI a kompletními wellness lázněmi.",
      "about_p3": "Se <strong>280 pokoji</strong>, čtyřmi restauracemi a živým denním zábavním programem je Amarina Jannah stvořený pro rodiny, páry i potápěče.",
      "bev_note": "🥂 <b>Nápojový servis all inclusive je v provozu od 10:00 do 00:00</b> — studené i teplé nápoje, pivo, víno, koktejly a místní lihoviny, k tomu uvítací nápoj a lehké občerstvení od 13:00 do 17:00. Čerstvé šťávy a turecká káva za malý příplatek.",
      "footer_credit": "Vytvořeno <a href=\"index.html\">Splash Entertainment</a> · Platforma pro zážitek hostů"
    },
    fr: {
      "Resort": "Complexe", "Dining": "Restauration", "Activities": "Activités", "Facilities": "Installations", "Contact": "Contact",
      "Explore Dining": "Voir la restauration",
      "🍽️ Dining & Outlets": "🍽️ Restauration & points de vente", "Explore the Resort": "Découvrir le complexe",
      "Rooms": "Chambres", "Restaurants": "Restaurants", "Water Slides": "Toboggans", "Private Beach": "Plage privée",
      "📍 Marsa Alam · Red Sea, Egypt": "📍 Marsa Alam · Mer Rouge, Égypte",
      "↓ Scroll to explore": "↓ Faites défiler pour explorer",
      "The Resort": "Le complexe",
      "A brand-new five-star escape on the Red Sea": "Une toute nouvelle évasion cinq étoiles sur la mer Rouge",
      "All-Inclusive": "Tout compris", "Family Friendly": "Familial", "Aqua Park": "Parc aquatique", "Diving & Snorkelling": "Plongée & snorkeling",
      "Accommodation": "Hébergement", "6 room categories": "6 catégories de chambres",
      "Dining & Outlets": "Restauration & points de vente",
      "Where to eat & drink": "Où manger & boire",
      "From the international Element buffet to themed à-la-carte evenings and beachfront bars — here is every venue at the resort, with live opening status.": "Du buffet international Element aux soirées à la carte à thème et aux bars de plage — voici tous les points de vente du complexe, avec leur statut d'ouverture en direct.",
      "Bars & Lounges": "Bars & lounges",
      "Activities & Entertainment": "Activités & animations",
      "A typical day at Amarina Jannah": "Une journée type à l'Amarina Jannah",
      "The animation team keeps the day moving — from beach sports and pool games to the kids' mini-disco and a different live show every evening.": "L'équipe d'animation rythme la journée — des sports de plage et jeux de piscine à la mini-disco des enfants et un spectacle live différent chaque soir.",
      "After Dark": "À la nuit tombée", "Evening Entertainment": "Animations en soirée",
      "Programme shown is representative of a typical week. Exact activities & times are posted daily by the animation team at the resort.": "Le programme présenté est représentatif d'une semaine type. Les activités et horaires exacts sont affichés chaque jour par l'équipe d'animation au complexe.",
      "Facilities & Map": "Installations & plan",
      "Everything on resort": "Tout sur place",
      "Aqua park, pools, a private beach with house reef, dive centre, spa and a supervised kids' club — all within the grounds.": "Parc aquatique, piscines, plage privée avec récif maison, centre de plongée, spa et club enfants encadré — le tout au sein du domaine.",
      "Get in Touch": "Nous contacter", "Plan your stay": "Préparez votre séjour",
      "Reach the resort directly for reservations, à-la-carte bookings and guest services.": "Contactez directement le complexe pour les réservations, les réservations à la carte et les services aux clients.",
      "Official Website": "Site officiel", "Location": "Emplacement", "Airport": "Aéroport",
      "Marsa Alam, Red Sea, Egypt": "Marsa Alam, mer Rouge, Égypte",
      "~10 min · Marsa Alam Int'l (RMF)": "~10 min · Aéroport int'l de Marsa Alam (RMF)",
      "MARSA ALAM · RED SEA · EGYPT": "MARSA ALAM · MER ROUGE · ÉGYPTE",
      "Resort & Aqua Park · Marsa Alam": "Resort & parc aquatique · Marsa Alam",
      "Resort & Aqua Park — a five-star Red Sea retreat where turquoise water meets a private 175-metre beach.": "Resort & parc aquatique — une évasion cinq étoiles sur la mer Rouge, où l'eau turquoise rencontre une plage privée de 175 mètres.",
      "Guest-experience platform. Dining, activity and facility details are compiled from publicly available resort information and may change seasonally — please confirm à-la-carte bookings, opening hours and surcharges with the resort on arrival.": "Plateforme d'expérience client. Les détails sur la restauration, les activités et les installations sont compilés à partir d'informations publiques sur le complexe et peuvent varier selon la saison — merci de confirmer les réservations à la carte, les horaires d'ouverture et les suppléments avec le complexe à votre arrivée.",
      "about_p1": "<strong>Amarina Jannah Resort &amp; Aqua Park</strong> a ouvert en 2023 sur la côte sud de la mer Rouge en Égypte, à mi-chemin entre Port Ghalib et El Quseir et à quelques minutes de l'aéroport international de Marsa Alam.",
      "about_p2": "Situé directement sur une <strong>plage de sable privée de 175 mètres</strong> bordée d'un célèbre récif maison, le complexe allie le confort tout compris à l'un des meilleurs parcs aquatiques de la région, un centre de plongée PADI et un spa de bien-être complet.",
      "about_p3": "Avec <strong>280 chambres</strong>, quatre restaurants et un programme d'animations quotidien, l'Amarina Jannah est conçu aussi bien pour les familles que pour les couples et les plongeurs.",
      "bev_note": "🥂 <b>Le service de boissons tout compris fonctionne de 10h00 à 00h00</b> — boissons fraîches & chaudes, bière, vin, cocktails et spiritueux locaux, plus une boisson de bienvenue et des en-cas légers de 13h00 à 17h00. Les jus frais & le café turc sont avec un léger supplément.",
      "footer_credit": "Conçu par <a href=\"index.html\">Splash Entertainment</a> · Plateforme d'expérience client"
    },
    ru: {
      "Resort": "Курорт", "Dining": "Рестораны", "Activities": "Развлечения", "Facilities": "Услуги", "Contact": "Контакты",
      "Explore Dining": "Посмотреть рестораны",
      "🍽️ Dining & Outlets": "🍽️ Рестораны и бары", "Explore the Resort": "Открыть курорт",
      "Rooms": "Номера", "Restaurants": "Рестораны", "Water Slides": "Водные горки", "Private Beach": "Частный пляж",
      "📍 Marsa Alam · Red Sea, Egypt": "📍 Марса-Алам · Красное море, Египет",
      "↓ Scroll to explore": "↓ Прокрутите, чтобы узнать больше",
      "The Resort": "Курорт",
      "A brand-new five-star escape on the Red Sea": "Совершенно новый пятизвёздочный курорт на Красном море",
      "All-Inclusive": "«Всё включено»", "Family Friendly": "Для семей", "Aqua Park": "Аквапарк", "Diving & Snorkelling": "Дайвинг и снорклинг",
      "Accommodation": "Размещение", "6 room categories": "6 категорий номеров",
      "Dining & Outlets": "Рестораны и бары",
      "Where to eat & drink": "Где поесть и выпить",
      "From the international Element buffet to themed à-la-carte evenings and beachfront bars — here is every venue at the resort, with live opening status.": "От международного буфета Element до тематических вечеров à la carte и баров на пляже — здесь все заведения курорта с актуальным статусом работы.",
      "Bars & Lounges": "Бары и лаунджи",
      "Activities & Entertainment": "Развлечения и анимация",
      "A typical day at Amarina Jannah": "Типичный день в Amarina Jannah",
      "The animation team keeps the day moving — from beach sports and pool games to the kids' mini-disco and a different live show every evening.": "Команда аниматоров наполняет день энергией — от пляжного спорта и игр в бассейне до детской мини-дискотеки и нового живого шоу каждый вечер.",
      "After Dark": "После заката", "Evening Entertainment": "Вечерние развлечения",
      "Programme shown is representative of a typical week. Exact activities & times are posted daily by the animation team at the resort.": "Показанная программа отражает типичную неделю. Точные мероприятия и время ежедневно публикует команда аниматоров на курорте.",
      "Facilities & Map": "Услуги и карта",
      "Everything on resort": "Всё на курорте",
      "Aqua park, pools, a private beach with house reef, dive centre, spa and a supervised kids' club — all within the grounds.": "Аквапарк, бассейны, частный пляж с домашним рифом, дайвинг-центр, спа и детский клуб под присмотром — всё на территории курорта.",
      "Get in Touch": "Связаться с нами", "Plan your stay": "Спланируйте отдых",
      "Reach the resort directly for reservations, à-la-carte bookings and guest services.": "Свяжитесь с курортом напрямую для бронирования, заказа à la carte и услуг для гостей.",
      "Official Website": "Официальный сайт", "Location": "Расположение", "Airport": "Аэропорт",
      "Marsa Alam, Red Sea, Egypt": "Марса-Алам, Красное море, Египет",
      "~10 min · Marsa Alam Int'l (RMF)": "~10 мин · Аэропорт Марса-Алам (RMF)",
      "MARSA ALAM · RED SEA · EGYPT": "МАРСА-АЛАМ · КРАСНОЕ МОРЕ · ЕГИПЕТ",
      "Resort & Aqua Park · Marsa Alam": "Курорт и аквапарк · Марса-Алам",
      "Resort & Aqua Park — a five-star Red Sea retreat where turquoise water meets a private 175-metre beach.": "Курорт и аквапарк — пятизвёздочный уголок на Красном море, где бирюзовая вода встречается с частным пляжем длиной 175 метров.",
      "Guest-experience platform. Dining, activity and facility details are compiled from publicly available resort information and may change seasonally — please confirm à-la-carte bookings, opening hours and surcharges with the resort on arrival.": "Платформа для гостей. Сведения о ресторанах, развлечениях и услугах собраны из общедоступной информации о курорте и могут меняться по сезонам — пожалуйста, уточняйте бронирование à la carte, часы работы и доплаты на курорте по прибытии.",
      "about_p1": "<strong>Amarina Jannah Resort &amp; Aqua Park</strong> открылся в 2023 году на южном побережье Красного моря в Египте, на полпути между Порт-Галибом и Эль-Кусейром и в нескольких минутах от международного аэропорта Марса-Алам.",
      "about_p2": "Расположенный прямо на <strong>частном песчаном пляже длиной 175 метров</strong> рядом со знаменитым домашним рифом, курорт сочетает комфорт «всё включено» с одним из лучших аквапарков региона, дайвинг-центром PADI и полноценным спа.",
      "about_p3": "С <strong>280 номерами</strong>, четырьмя ресторанами и насыщенной ежедневной программой развлечений Amarina Jannah создан и для семей, и для пар, и для дайверов.",
      "bev_note": "🥂 <b>Сервис напитков «всё включено» работает с 10:00 до 00:00</b> — прохладительные и горячие напитки, пиво, вино, коктейли и местные крепкие напитки, а также приветственный напиток и лёгкие закуски с 13:00 до 17:00. Свежие соки и кофе по-турецки — за небольшую доплату.",
      "footer_credit": "Создано <a href=\"index.html\">Splash Entertainment</a> · Платформа для гостей"
    }
  };

  // ── Engine ────────────────────────────────────────────────────
  function tr(s) {
    if (LANG === 'en') return s;
    var d = I18N[LANG]; if (!d) return s;
    var v = d[s.trim()]; return v != null ? v : s;
  }
  function applyBlocks() {
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.__en == null) el.__en = el.innerHTML;
      var d = I18N[LANG], k = el.getAttribute('data-i18n');
      el.innerHTML = (LANG === 'en' || !d || d[k] == null) ? el.__en : d[k];
    }
  }
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, OPTION: 1, SELECT: 1 };
  function applyTextNodes() {
    if (!document.body) return;
    var tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentNode;
        while (p && p.nodeType === 1) {
          if (SKIP[p.tagName] || p.hasAttribute('data-i18n') || p.hasAttribute('data-noi18n')) return NodeFilter.FILTER_REJECT;
          p = p.parentNode;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [], x;
    while ((x = tw.nextNode())) nodes.push(x);
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i], cur = n.nodeValue;
      if (n.__tr === undefined || cur !== n.__tr) n.__en = cur; // first sight, or text changed externally (e.g. live status)
      var m = n.__en.match(/^(\s*)([\s\S]*?)(\s*)$/);
      var nv = m[1] + tr(m[2]) + m[3];
      n.__tr = nv;
      if (cur !== nv) n.nodeValue = nv;
    }
  }
  function applyLang() {
    var html = document.documentElement;
    html.lang = LANG;
    html.dir = RTL.indexOf(LANG) >= 0 ? 'rtl' : 'ltr';
    applyBlocks();
    applyTextNodes();
  }
  function setLang(l) {
    LANG = l;
    try { localStorage.setItem('amarina_lang', l); } catch (e) {}
    applyLang();
    var sels = document.querySelectorAll('.lang-select');
    for (var i = 0; i < sels.length; i++) sels[i].value = l;
  }

  // expose
  window.AmarinaI18N = { apply: applyLang, set: setLang, get: function () { return LANG; }, langs: I18N };
})();
