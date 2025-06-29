// TODO: Replace with real testimonials before go-live
export const dummyTestimonials = [
  {
    quote: "\"Binnen een half uur stond mijn PC weer op volle snelheid!\"",
    author: "— Lisa M. (Amsterdam)",
  },
  {
    quote: "\"Heel geduldig uitgelegd; nu begrijp ik eindelijk OneDrive.\"",
    author: "— Karel V. (Den Haag)",
  },
  {
    quote: "\"Fantastische service, zelfs 's avonds bereikbaar.\"",
    author: "— Fatima S. (Rotterdam)",
  },
  {
    quote: "\"Dacht dat ik al mijn foto's kwijt was, maar alles is gered 😊.\"",
    author: "— Johan B. (Utrecht)",
  },
  {
    quote: "\"Mijn laptop was helemaal vastgelopen, maar nu werkt alles weer perfect!\"",
    author: "— Ahmed K. (Rotterdam)",
  },
  {
    quote: "\"Zeer professionele hulp bij het installeren van mijn nieuwe printer.\"",
    author: "— Marieke V. (Rotterdam)",
  },
  {
    quote: "\"Virus verwijderd en computer beveiligd - eindelijk weer veilig internetten.\"",
    author: "— Peter J. (Rotterdam)",
  },
  {
    quote: "\"Remote hulp werkt geweldig, hoefde niet eens de deur uit!\"",
    author: "— Sarah L. (Rotterdam)",
  },
  {
    quote: "\"Mijn kleindochter kan nu veilig op mijn computer spelen.\"",
    author: "— Willem D. (Rotterdam)",
  },
  {
    quote: "\"Snelle reactie en oplossing voor mijn WiFi problemen.\"",
    author: "— Anna B. (Rotterdam)",
  },
  {
    quote: "\"Eindelijk begrijp ik hoe ik mijn bestanden kan backuppen.\"",
    author: "— Hans M. (Rotterdam)",
  },
  {
    quote: "\"Zeer betaalbaar en transparante prijzen - geen verrassingen.\"",
    author: "— Karin S. (Rotterdam)",
  },
  {
    quote: "\"Mijn oude computer is weer als nieuw na de opschoning.\"",
    author: "— Theo V. (Rotterdam)",
  },
  {
    quote: "\"Hulp bij het instellen van mijn nieuwe smartphone - top service!\"",
    author: "— Liesbeth K. (Rotterdam)",
  },
  {
    quote: "\"Probleem met mijn e-mail opgelost in minder dan 15 minuten.\"",
    author: "— Rob H. (Rotterdam)",
  },
  {
    quote: "\"Zeer geduldig met mijn vragen over Windows 11.\"",
    author: "— Marga W. (Rotterdam)",
  },
  {
    quote: "\"Mijn computer start nu veel sneller op - geweldig resultaat!\"",
    author: "— Frank P. (Rotterdam)",
  },
  {
    quote: "\"Hulp bij het overzetten van bestanden naar mijn nieuwe laptop.\"",
    author: "— Ellen R. (Rotterdam)",
  },
  {
    quote: "\"Zeer betrouwbare service - kom zeker terug bij problemen.\"",
    author: "— Dirk T. (Rotterdam)",
  },
  {
    quote: "\"Mijn kleinkinderen kunnen nu veilig online gamen.\"",
    author: "— Greetje B. (Rotterdam)",
  },
  {
    quote: "\"Probleem met mijn webcam opgelost voor mijn online vergaderingen.\"",
    author: "— Mark L. (Rotterdam)",
  },
  {
    quote: "\"Zeer vriendelijke en professionele hulp bij al mijn vragen.\"",
    author: "— Petra K. (Rotterdam)",
  },
  {
    quote: "\"Mijn computer is nu beveiligd tegen virussen en hackers.\"",
    author: "— Bas M. (Rotterdam)",
  },
  {
    quote: "\"Snelle hulp bij het herstellen van mijn verwijderde bestanden.\"",
    author: "— Linda V. (Rotterdam)",
  },
];

// Environment check to prevent accidental deployment
export const testimonials = process.env.NODE_ENV === "production" ? [] : dummyTestimonials; 