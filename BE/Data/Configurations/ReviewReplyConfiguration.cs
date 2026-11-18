using BE.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BE.Data.Configurations
{
    public class ReviewReplyConfiguration : IEntityTypeConfiguration<ReviewReply>
    {
        public void Configure(EntityTypeBuilder<ReviewReply> builder)
        {
            builder.HasOne(rp => rp.Shop)
                .WithMany(s => s.ReviewReplies)
                .HasForeignKey(rp => rp.ShopId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
