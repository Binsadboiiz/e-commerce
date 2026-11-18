using BE.Models.Entities;

namespace BE.Repositories.Interfaces
{
    public interface IAuthRepository
    {
        Task<Account?> GetAccountByEmailAsync(string email);
        Task CreateAccountAsync(Account account);
        Task CreateUserAsync(User user);
        Task SaveChangeAsync();
    }
}
