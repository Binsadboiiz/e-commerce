using BE.Data;
using BE.Middlewares;
using BE.Models.DTOs.User;
using BE.Models.Entities;
using BE.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.Implementation
{
    public class UserAddressService : IUserAddressService
    {
        private const int MaxAllowedAddresses = 5;
        private readonly ApplicationDbContext _context;

        public UserAddressService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserAddressDto>> GetMyAddressesAsync(string userId)
        {
            var addresses = await _context.UserAddressesEnumerable
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.IsDefault)
                .ThenByDescending(a => a.Id)
                .ToListAsync();

            return addresses.Select(MapToDto).ToList();
        }

        public async Task<UserAddressDto> CreateAddressAsync(string userId, CreateUserAddressRequest request)
        {
            var currentCount = await _context.UserAddressesEnumerable.CountAsync(a => a.UserId == userId);
            if (currentCount >= MaxAllowedAddresses)
            {
                throw new AppException($"You can save a maximum of {MaxAllowedAddresses} delivery addresses.", 400);
            }

            bool shouldBeDefault = request.IsDefault || currentCount == 0;

            if (shouldBeDefault)
            {
                var existingDefaults = await _context.UserAddressesEnumerable
                    .Where(a => a.UserId == userId && a.IsDefault)
                    .ToListAsync();

                foreach (var d in existingDefaults)
                {
                    d.IsDefault = false;
                }
            }

            long.TryParse(new string(request.PhoneNumber.Where(char.IsDigit).ToArray()), out long parsedPhone);

            string combinedStreetName = FormatCombinedStreetName(request.Ward, request.District);

            var address = new UserAddresses
            {
                UserId = userId,
                FullName = request.FullName.Trim(),
                PhoneNumber = parsedPhone,
                City = request.City.Trim(),
                StreetName = combinedStreetName,
                HouseNo = request.StreetAddress.Trim(),
                IsDefault = shouldBeDefault
            };

            _context.UserAddressesEnumerable.Add(address);
            await _context.SaveChangesAsync();

            return MapToDto(address);
        }

        public async Task<UserAddressDto> UpdateAddressAsync(string userId, long id, UpdateUserAddressRequest request)
        {
            var address = await _context.UserAddressesEnumerable
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

            if (address == null)
            {
                throw new AppException("The address does not exist.", 404);
            }

            if (request.IsDefault && !address.IsDefault)
            {
                var existingDefaults = await _context.UserAddressesEnumerable
                    .Where(a => a.UserId == userId && a.IsDefault && a.Id != id)
                    .ToListAsync();

                foreach (var d in existingDefaults)
                {
                    d.IsDefault = false;
                }
                address.IsDefault = true;
            }
            else if (!request.IsDefault && address.IsDefault)
            {
                // Nếu người dùng bỏ cờ mặc định, kiểm tra xem có địa chỉ nào khác để chuyển làm mặc định không
                var otherAddress = await _context.UserAddressesEnumerable
                    .FirstOrDefaultAsync(a => a.UserId == userId && a.Id != id);

                if (otherAddress != null)
                {
                    address.IsDefault = false;
                    otherAddress.IsDefault = true;
                }
            }

            long.TryParse(new string(request.PhoneNumber.Where(char.IsDigit).ToArray()), out long parsedPhone);
            string combinedStreetName = FormatCombinedStreetName(request.Ward, request.District);

            address.FullName = request.FullName.Trim();
            address.PhoneNumber = parsedPhone;
            address.City = request.City.Trim();
            address.StreetName = combinedStreetName;
            address.HouseNo = request.StreetAddress.Trim();

            await _context.SaveChangesAsync();
            return MapToDto(address);
        }

        public async Task<bool> DeleteAddressAsync(string userId, long id)
        {
            var address = await _context.UserAddressesEnumerable
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

            if (address == null)
            {
                throw new AppException("The address does not exist.", 404);
            }

            bool wasDefault = address.IsDefault;
            _context.UserAddressesEnumerable.Remove(address);
            await _context.SaveChangesAsync();

            // Nếu địa chỉ bị xóa là mặc định, gán địa chỉ đầu tiên còn lại làm mặc định
            if (wasDefault)
            {
                var remainingFirst = await _context.UserAddressesEnumerable
                    .Where(a => a.UserId == userId)
                    .OrderBy(a => a.Id)
                    .FirstOrDefaultAsync();

                if (remainingFirst != null)
                {
                    remainingFirst.IsDefault = true;
                    await _context.SaveChangesAsync();
                }
            }

            return true;
        }

        public async Task<bool> SetDefaultAddressAsync(string userId, long id)
        {
            var targetAddress = await _context.UserAddressesEnumerable
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

            if (targetAddress == null)
            {
                throw new AppException("The address does not exist.", 404);
            }

            var allUserAddresses = await _context.UserAddressesEnumerable
                .Where(a => a.UserId == userId)
                .ToListAsync();

            foreach (var addr in allUserAddresses)
            {
                addr.IsDefault = (addr.Id == id);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        private static string FormatCombinedStreetName(string? ward, string? district)
        {
            var parts = new List<string>();
            if (!string.IsNullOrWhiteSpace(ward)) parts.Add(ward.Trim());
            if (!string.IsNullOrWhiteSpace(district)) parts.Add(district.Trim());

            return string.Join(", ", parts);
        }

        private static UserAddressDto MapToDto(UserAddresses entity)
        {
            string? parsedWard = null;
            string? parsedDistrict = null;

            if (!string.IsNullOrWhiteSpace(entity.StreetName))
            {
                var split = entity.StreetName.Split(',', StringSplitOptions.TrimEntries);
                if (split.Length >= 2)
                {
                    parsedWard = split[0];
                    parsedDistrict = split[1];
                }
                else if (split.Length == 1)
                {
                    parsedDistrict = split[0];
                }
            }

            var fullAddressParts = new[]
            {
                entity.HouseNo,
                entity.StreetName,
                entity.City
            }.Where(s => !string.IsNullOrWhiteSpace(s));

            return new UserAddressDto
            {
                Id = entity.Id,
                FullName = entity.FullName ?? string.Empty,
                PhoneNumber = entity.PhoneNumber.ToString().PadLeft(10, '0'),
                City = entity.City ?? string.Empty,
                District = parsedDistrict,
                Ward = parsedWard,
                StreetAddress = entity.HouseNo ?? string.Empty,
                FullAddress = string.Join(", ", fullAddressParts),
                IsDefault = entity.IsDefault
            };
        }
    }
}
