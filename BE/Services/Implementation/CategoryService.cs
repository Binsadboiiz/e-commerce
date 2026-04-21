using System.Buffers;
using BE.Models.DTOs;
using BE.Models.Entities;
using BE.Repositories.Implementations;
using BE.Repositories.Interfaces;
using BE.Services.Interface;
using Microsoft.Extensions.Caching.Memory;

namespace BE.Services.Implementation
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMemoryCache _cache;

        private const string CACHE_KEY = "categories_all";

        public CategoryService (ICategoryRepository categoryRepository, IMemoryCache cache)
        {
            _categoryRepository = categoryRepository;
            _cache = cache;
        }

        public async Task<IEnumerable<CategoryDto>> GetAllAsync()
        {
            if (_cache.TryGetValue(CACHE_KEY, out IEnumerable<CategoryDto> cached))
            {
                return cached;
            }

            var categories = await _categoryRepository.GetAllAsync();

            var result = categories.Select(c => new CategoryDto
            {
                Id = c.CategoryId,
                Type = c.Type
            }).ToList();

            _cache.Set(CACHE_KEY, result, TimeSpan.FromMinutes(30));

            return result;
        }
    }
}
