namespace ChatHub.Server.Models
{
    public class Messages
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
        public int ReplyId { get; set; }
    }
}
