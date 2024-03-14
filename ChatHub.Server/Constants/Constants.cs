namespace ChatHub.Server.Constants
{
    public static class Constants
    {
        private static IConfiguration? _configuration;

        public static void Initialize(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public static string ConnectionString => _configuration.GetConnectionString("DefaultConnection");

        public static string GetConnectionString()
        {
            return ConnectionString;
        }
    }
}