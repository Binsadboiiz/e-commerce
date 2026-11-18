using BE.Models.DTOs.Search;

namespace BE.Services.Interface.Product
{
    public interface ISearchSuggestionService
    {
        Task<SearchSuggestionDto> GetSearchSuggestionAsync(string query, CancellationToken cancellationToken = default);
    }
}
