using BE.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BE.Data.Configurations;

public class SellerDocumentConfiguration : IEntityTypeConfiguration<SellerDocument>
{
    public void Configure(EntityTypeBuilder<SellerDocument> builder)
    {
        builder.ToTable("Seller_documents");

        builder.HasKey(x => x.DocumentId);

        builder.HasIndex(x => x.SellerId);

        builder.HasOne(x => x.SellerAccount)
            .WithMany(x => x.Documents)
            .HasForeignKey(x => x.SellerId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.SellerDocumentType)
            .WithMany(x => x.SellerDocuments)
            .HasForeignKey(x => x.DocumentTypeId);
    }
}