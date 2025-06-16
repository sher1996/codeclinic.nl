declare module '@fullcalendar/react' {
  import { ComponentType } from 'react';
  
  export interface FullCalendarProps {
    plugins?: any[];
    initialView?: string;
    headerToolbar?: {
      left?: string;
      center?: string;
      right?: string;
    };
    locale?: string;
    selectable?: boolean;
    selectMirror?: boolean;
    dayMaxEvents?: boolean;
    weekends?: boolean;
    select?: (selectInfo: any) => void;
    height?: string | number;
    className?: string;
  }

  const FullCalendar: ComponentType<FullCalendarProps>;
  export default FullCalendar;
}

declare module '@fullcalendar/daygrid' {
  const dayGridPlugin: any;
  export default dayGridPlugin;
}

declare module '@fullcalendar/timegrid' {
  const timeGridPlugin: any;
  export default timeGridPlugin;
}

declare module '@fullcalendar/interaction' {
  const interactionPlugin: any;
  export default interactionPlugin;
} 