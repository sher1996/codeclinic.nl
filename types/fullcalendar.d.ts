declare module '@fullcalendar/react' {
  import { ComponentType } from 'react';
  
  export interface SelectInfo {
    start: Date;
    end: Date;
    startStr: string;
    endStr: string;
    allDay: boolean;
    view: {
      type: string;
      title: string;
    };
  }
  
  export interface FullCalendarProps {
    plugins?: unknown[];
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
    select?: (selectInfo: SelectInfo) => void;
    height?: string | number;
    className?: string;
  }

  const FullCalendar: ComponentType<FullCalendarProps>;
  export default FullCalendar;
}

declare module '@fullcalendar/daygrid' {
  const dayGridPlugin: unknown;
  export default dayGridPlugin;
}

declare module '@fullcalendar/timegrid' {
  const timeGridPlugin: unknown;
  export default timeGridPlugin;
}

declare module '@fullcalendar/interaction' {
  const interactionPlugin: unknown;
  export default interactionPlugin;
} 