using AutoMapper;
using ReactProjectAPI.Application.DTOs;
using ReactProjectAPI.Domain.Entities;

namespace ReactProjectAPI.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User mappings
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.Department, opt => opt.MapFrom(src => src.Department.DepartmentName));
            CreateMap<CreateUserDto, User>();

            // Claim mappings
            CreateMap<Claim, ClaimDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.Name))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.CategoryName));
            CreateMap<CreateClaimDto, Claim>();

            // Approval mappings
            CreateMap<Approval, ApprovalDto>()
                .ForMember(dest => dest.ClaimTitle, opt => opt.MapFrom(src => src.Claim.Title))
                .ForMember(dest => dest.ApproverName, opt => opt.MapFrom(src => src.ApprovedByUser.Name));
            CreateMap<CreateApprovalDto, Approval>();

            // Reimbursement mappings
            CreateMap<Reimbursement, ReimbursementDto>()
                .ForMember(dest => dest.ClaimTitle, opt => opt.MapFrom(src => src.Claim.Title))
                .ForMember(dest => dest.ProcessedByName, opt => opt.MapFrom(src => src.ProcessedByUser.Name));
            CreateMap<CreateReimbursementDto, Reimbursement>();

            // Department mappings
            CreateMap<Department, DepartmentDto>();
            CreateMap<CreateDepartmentDto, Department>();

            // ExpenseCategory mappings
            CreateMap<ExpenseCategory, ExpenseCategoryDto>();
            CreateMap<CreateExpenseCategoryDto, ExpenseCategory>();
        }
    }
}