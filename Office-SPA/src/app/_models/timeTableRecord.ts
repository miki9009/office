interface TimeTableRecord {
  id: number;
  userId: number;
  year: number;
  month: number;
  day: number;
  time: string;
  title: string;
  description: string;
  repeating: number;
  usersAttached: string;
}
