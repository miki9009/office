using AutoMapper;
using Office.API.Models;
using Office.API.Dtos;
using System.Linq;

namespace Office.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            
            CreateMap<User, UserForListDto>();

            // CreateMap<Worker, PhotosForDetailedDto>();
        }
    }
}