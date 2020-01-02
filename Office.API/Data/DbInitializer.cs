
using System.Linq;
using Office.API.Data;

namespace Office.Data
{
    public static class DbInitializer
    {
        public static void Initialize(DataContext appContext)
        {
            appContext.Database.EnsureCreated();


        }
    }
}
