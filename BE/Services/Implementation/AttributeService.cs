using BE.Data;
using BE.Models.DTOs;
using BE.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.Implementation
{
    public class AttributeService : IAttributeService
    {
        private readonly ApplicationDbContext _context;

        public AttributeService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<AttributeDto>> GetAllAsync()
        {
            return await _context.AttributeTypes
                .Include(a => a.AttributeValues)
                .Select(a => new AttributeDto
                {
                    AttributeId = a.AttributeId,
                    Name = a.Name,
                    Values = a.AttributeValues.Select(v => new AttributeValueDto
                    {
                        ValueId = v.ValueId,
                        Value = v.Value
                    }).ToList()
                })
                .ToListAsync();
        }
    }
}