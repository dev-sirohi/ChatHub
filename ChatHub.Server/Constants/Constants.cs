using ChatHub.Server.Models;

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

        public static User? _currentUser;
        public static void SetCurrentUser(User user)
        {
            _currentUser = user;
        }
    }
}