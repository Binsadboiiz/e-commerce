using BE.Helpers;
using BE.Models.DTOs.Auth;
using BE.Repositories.Interfaces;
using BE.Services.Interface;
using BE.Validators;
using BE.Middlewares;
using BE.Models.Entities;
using BE.Constants;
using BE.Data;
using BE.Helpers;

namespace BE.Services.Implementation
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _repository;
        private readonly JWTHelper _jwtHelper;
        private readonly ApplicationDbContext _context;

        public AuthService(IAuthRepository repository, JWTHelper jwtHelper, ApplicationDbContext context)
        {
            _repository = repository;
            _jwtHelper = jwtHelper;
            _context = context;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            AuthValidator.ValidateRegister(request);

            var existing = await _repository.GetAccountByEmailAsync(request.Email);

            if(existing != null)
                throw new AppException("Email already exists");

            using var tx = await _context.Database.BeginTransactionAsync();

            try
            {
                // Generate a unique user ID for the new account
                string userId = Guid.NewGuid().ToString();

                var user = new User
                {
                    UserId = userId,
                    Email = request.Email,
                    FullName = request.FullName,
                    Is_active = true
                };

                string hashedPassword = PasswordHasher.HasPassword(request.Password);

                var account = new Account
                {
                    UserId = userId,
                    Email = request.Email,
                    PasswordHash = hashedPassword,
                    Role = RoleConstants.Customer
                };

                await _repository.CreateAccountAsync(account);
                await _repository.CreateUserAsync(user);

                await _repository.SaveChangeAsync();

                string token = _jwtHelper.GenerateToken(user.UserId, account.Email, account.Role);

                return new AuthResponse
                {
                    AccessToken = token,
                    Role = account.Role,
                    Email = account.Email,
                    UserId = user.UserId
                };

                await tx.CommitAsync();

            } catch(AppException ex)
            {
                await tx.RollbackAsync();
                throw new AppException(ex.Message, ex.StatusCode);
            }
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            AuthValidator.ValidateLogin(request);

            var account = await _repository.GetAccountByEmailAsync(request.Email);

            if(account == null)
                throw new AppException("Account not found with the provided email", 404);

            bool isCorrect = PasswordHasher.Verify(request.Password, account.PasswordHash);

            if(!isCorrect)
                throw new AppException("Incorrect password", 401);

            string token = _jwtHelper.GenerateToken(account.UserId, account.Email, account.Role);

            return new AuthResponse
            {
                AccessToken = token,
                Role = account.Role,
                Email = account.Email,
                UserId = account.UserId
            };
        }
    }
}
