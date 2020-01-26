enum weekdays {
  monday = 'MONDAY',
  tuesday = 'TUESDAY',
  wednesday = 'WEDNESDAY',
  thursday = 'THURSDAY',
  friday = 'FRIDAY',
  saturday = 'SATURDAY',
  sunday = 'SUNDAY',
}

export default interface ISchedule {
  day: weekdays;
  start: number;
  end: number;
}
