namespace TiffinHub.Domain.Constants;

public static class Roles
{
    public const string Admin = "Admin";
    public const string Vendor = "Vendor";
    public const string Customer = "Customer";
    public const string DeliveryPartner = "DeliveryPartner";

    public static readonly IReadOnlyList<string> All = new[]
    {
        Admin,
        Vendor,
        Customer,
        DeliveryPartner
    };
}
