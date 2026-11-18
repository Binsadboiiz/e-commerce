using System;
using System.Collections.Generic;

namespace BE.Models.DTOs.Seller.Dashboard
{
    /// <summary>
    /// Represents the complete dashboard data payload for a seller's shop.
    /// This includes overall performance metrics (stats), charts (trend and category), and recent orders.
    /// </summary>
    public class SellerDashboardDto
    {
        /// <summary>
        /// Overall summary cards (Revenue, Sales Count, Orders Count, Conversion Rate) with trend percentages.
        /// </summary>
        public SellerDashboardStatsDto Stats { get; set; } = new();

        /// <summary>
        /// Chronological data points for the revenue and unit sales trend charts.
        /// </summary>
        public List<SellerDashboardTrendPointDto> TrendData { get; set; } = new();

        /// <summary>
        /// Breakdown of sales distribution by product categories for the shop.
        /// </summary>
        public List<SellerDashboardCategoryShareDto> CategoryData { get; set; } = new();

        /// <summary>
        /// A list of recent orders containing items belonging to the seller's shop.
        /// </summary>
        public List<SellerDashboardOrderDto> Orders { get; set; } = new();
    }

    /// <summary>
    /// Holds performance indicators for the seller dashboard.
    /// </summary>
    public class SellerDashboardStatsDto
    {
        /// <summary>
        /// Financial earnings/revenue for the shop.
        /// </summary>
        public StatItem Revenue { get; set; } = new();

        /// <summary>
        /// Number of individual product items sold.
        /// </summary>
        public StatItem SalesCount { get; set; } = new();

        /// <summary>
        /// Number of unique orders containing shop items.
        /// </summary>
        public StatItem OrdersCount { get; set; } = new();

        /// <summary>
        /// Estimated/simulated conversion rate percentage.
        /// </summary>
        public StatItem ConversionRate { get; set; } = new();

        /// <summary>
        /// Represents a single KPI card's value, trend percentage, direction, and localized label.
        /// </summary>
        public class StatItem
        {
            /// <summary>
            /// The absolute numeric value of the metric (e.g., total price or count).
            /// </summary>
            public decimal Value { get; set; }

            /// <summary>
            /// The percentage change compared to the previous matching period.
            /// </summary>
            public double Trend { get; set; }

            /// <summary>
            /// Indicates if the trend is positive (upwards) or negative (downwards).
            /// </summary>
            public bool IsUp { get; set; }

            /// <summary>
            /// Descriptive string showing the comparison timeline (e.g., "vs yesterday", "vs last 7 days").
            /// </summary>
            public string Label { get; set; } = string.Empty;
        }
    }

    /// <summary>
    /// Represents a single data point in the seller's revenue/sales trend chart.
    /// </summary>
    public class SellerDashboardTrendPointDto
    {
        /// <summary>
        /// The x-axis label (e.g., "08:00", "Mon", "Week 1", "Jan").
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Revenue earned during this interval.
        /// </summary>
        public decimal DoanhThu { get; set; } // Kept as 'doanhThu' to match frontend naming but commented clearly

        /// <summary>
        /// Quantity of product items sold during this interval.
        /// </summary>
        public int LuotBan { get; set; } // Kept as 'luotBan' to match frontend naming but commented clearly
    }

    /// <summary>
    /// Represents the share of total sales value contributed by a product category.
    /// </summary>
    public class SellerDashboardCategoryShareDto
    {
        /// <summary>
        /// Name of the category (e.g., "Electronics", "Fashion").
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// The percentage value representing the category's share of total sales (0 to 100).
        /// </summary>
        public double Value { get; set; }

        /// <summary>
        /// Hexadecimal color string associated with this category for chart rendering.
        /// </summary>
        public string Color { get; set; } = string.Empty;
    }

    /// <summary>
    /// Represents a lightweight view of an order containing the seller's products.
    /// </summary>
    public class SellerDashboardOrderDto
    {
        /// <summary>
        /// The formatted order identifier (e.g., "ORD-10023").
        /// </summary>
        public string Id { get; set; } = string.Empty;

        /// <summary>
        /// Full name of the purchasing customer.
        /// </summary>
        public string Customer { get; set; } = string.Empty;

        /// <summary>
        /// Email address of the purchasing customer.
        /// </summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Image URL of the primary or first product item in the order.
        /// </summary>
        public string ProductImage { get; set; } = string.Empty;

        /// <summary>
        /// Description name of the product(s) (e.g., "Product A + 2 other items").
        /// </summary>
        public string ProductName { get; set; } = string.Empty;

        /// <summary>
        /// Total quantity of products from this seller in the order.
        /// </summary>
        public int ItemsCount { get; set; }

        /// <summary>
        /// The timestamp when the order was placed.
        /// </summary>
        public DateTime Date { get; set; }

        /// <summary>
        /// The total value of order items belonging to the current seller in this order.
        /// </summary>
        public decimal Amount { get; set; }

        /// <summary>
        /// Fulfillment status of the order (e.g., "pending", "shipping", "completed", "cancelled").
        /// </summary>
        public string Status { get; set; } = string.Empty;

        /// <summary>
        /// Payment status of the order (e.g., "paid", "unpaid").
        /// </summary>
        public string PaymentStatus { get; set; } = string.Empty;
    }
}
