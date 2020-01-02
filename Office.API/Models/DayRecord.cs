namespace Office.API.Models
{
    public class DayRecord
    {
        public int Id { get; set; }

        public int WorkerID { get; set; }
        public int Year { get; set; }
        public int Month {get; set;}
        public int Day {get;set;}

        public int DayType {get; set;}
    }

    /*
    0 - Empty
    1 - WorkingDay
    2 - Working remotely
    3 - wyjazd sluzbowy
    4 - Day-off-waiting
    5 - Day-off
    4 - Sick
    5 - Urlop na zadanie
     */
}