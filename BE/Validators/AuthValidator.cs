using BE.Models.DTOs.Auth;
using BE.Constants;
using BE.Middlewares;

namespace BE.Validators
{
    public class AuthValidator
    {
        public static void ValidateRegister(RegisterRequest request)
        {
            if(string.IsNullOrWhiteSpace(request.Email))
                throw new AppException("'Email is required");

            if (string.IsNullOrWhiteSpace(request.Password))
                throw new AppException("Password is required");

            if(request.Password.Length < 6)
                throw new AppException("Password must be at least 6 characters long");
        }

        public static void ValidateLogin(LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                throw new AppException("Email is required");

            if (string.IsNullOrWhiteSpace(request.Password))
                throw new AppException("Password is required");
        }
    }
}