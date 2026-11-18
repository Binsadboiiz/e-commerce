using BE.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BE.Data.Configurations;

public class SellerDocumentTypeConfiguration : IEntityTypeConfiguration<SellerDocumentType>
{
    public void Configure(EntityTypeBuilder<SellerDocumentType> builder)
    {
        builder.ToTable("Seller_document_types");

        builder.HasKey(x => x.DocumentTypeId);

        builder.HasIndex(x => x.Code)
            .IsUnique();
    }
}