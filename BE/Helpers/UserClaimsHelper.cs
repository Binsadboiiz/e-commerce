using System.Net;
using System.Security.Claims;
using BE.Middlewares;

namespace BE.Helpers
{
    public static class UserClaimsHelper
    {
        public static string GetUserId(ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new AppException("User is not authenticated. Please log in.");
        }

        public static string GetUserEmail(ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Email)?.Value
                ?? throw new AppException("User email claim is missing.");
        }

        public static string GetUserRole(ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Role)?.Value
                ?? throw new AppException("User role claim is missing.");
        }
    }
}