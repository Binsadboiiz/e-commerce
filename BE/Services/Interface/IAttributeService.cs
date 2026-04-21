using BE.Models.DTOs;

namespace BE.Services.Interface
{
    public interface IAttributeService
    {
        Task<List<AttributeDto>> GetAllAsync();
    }
}