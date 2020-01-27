enum Weekdays {
  monday = 'MONDAY',
  tuesday = 'TUESDAY',
  wednesday = 'WEDNESDAY',
  thursday = 'THURSDAY',
  friday = 'FRIDAY',
  saturday = 'SATURDAY',
  sunday = 'SUNDAY',
}

type ISchedule = {
  [key in Weekdays]?: {
    start: number;
    end: number;
    classroom: string;
  };
};

export default ISchedule;
