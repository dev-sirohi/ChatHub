namespace ChatHub.Server.Models
{
    public class FriendInfo
    {
        public int UserId { get; set; }
        public int FriendId { get; set; }
        public string? FriendUsername { get; set; }
        public int FriendshipStatus { get; set; }
    }
}
