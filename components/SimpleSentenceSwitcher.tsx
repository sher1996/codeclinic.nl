import { useEffect, useState } from 'react';

const sentences = [
  'Direct professionele hulp bij al uw computerproblemen in Rotterdam.',
  '90% van de problemen opgelost in één keer - geen voorrijkosten in Rotterdam.',
  'Binnen een half uur stond mijn PC weer op volle snelheid! — Lisa M. (Amsterdam)',
  'Heel geduldig uitgelegd; nu begrijp ik eindelijk OneDrive. — Karel V. (Den Haag)',
  "Fantastische service, zelfs 's avonds bereikbaar. — Fatima S. (Rotterdam)",
  'Dacht dat ik al mijn foto\'s kwijt was, maar alles is gered 😊. — Johan B. (Utrecht)',
  'Mijn laptop was helemaal vastgelopen, maar nu werkt alles weer perfect! — Ahmed K. (Rotterdam)',
  'Zeer professionele hulp bij het installeren van mijn nieuwe printer. — Marieke V. (Rotterdam)',
  'Virus verwijderd en computer beveiligd - eindelijk weer veilig internetten. — Peter J. (Rotterdam)',
  'Remote hulp werkt geweldig, hoefde niet eens de deur uit! — Sarah L. (Rotterdam)',
  'Mijn kleindochter kan nu veilig op mijn computer spelen. — Willem D. (Rotterdam)',
  'Snelle reactie en oplossing voor mijn WiFi problemen. — Anna B. (Rotterdam)',
  'Eindelijk begrijp ik hoe ik mijn bestanden kan backuppen. — Hans M. (Rotterdam)',
  'Zeer betaalbaar en transparante prijzen - geen verrassingen. — Karin S. (Rotterdam)',
  'Mijn oude computer is weer als nieuw na de opschoning. — Theo V. (Rotterdam)',
  'Hulp bij het instellen van mijn nieuwe smartphone - top service! — Liesbeth K. (Rotterdam)',
  'Probleem met mijn e-mail opgelost in minder dan 15 minuten. — Rob H. (Rotterdam)',
  'Zeer geduldig met mijn vragen over Windows 11. — Marga W. (Rotterdam)',
  'Mijn computer start nu veel sneller op - geweldig resultaat! — Frank P. (Rotterdam)',
  'Hulp bij het overzetten van bestanden naar mijn nieuwe laptop. — Ellen R. (Rotterdam)',
  'Zeer betrouwbare service - kom zeker terug bij problemen. — Dirk T. (Rotterdam)',
  'Mijn kleinkinderen kunnen nu veilig online gamen. — Greetje B. (Rotterdam)',
  'Probleem met mijn webcam opgelost voor mijn online vergaderingen. — Mark L. (Rotterdam)',
  'Zeer vriendelijke en professionele hulp bij al mijn vragen. — Petra K. (Rotterdam)',
  'Mijn computer is nu beveiligd tegen virussen en hackers. — Bas M. (Rotterdam)',
  'Snelle hulp bij het herstellen van mijn verwijderde bestanden. — Linda V. (Rotterdam)'
];

interface SimpleSentenceSwitcherProps {
  className?: string;
}

export default function SimpleSentenceSwitcher({ className = '' }: SimpleSentenceSwitcherProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // fade out
      setVisible(false);
      // after fade duration, switch sentence and fade in
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % sentences.length);
        setVisible(true);
      }, 400); // match CSS duration
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <p
      className={`text-lg leading-[1.6] text-white/90 max-w-[45ch] mb-16 transition-opacity duration-500 ${className}`}
      style={{ opacity: visible ? 1 : 0, minHeight: '3em' }}
    >
      {sentences[index]}
    </p>
  );
} 