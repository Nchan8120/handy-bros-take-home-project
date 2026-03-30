namespace JobBoard.API.Models
{
    public class Interest
    {
        public int Id { get; set; }
        public DateTime ExpressedAt { get; set; } = DateTime.UtcNow;

        // Foreign key — which user is interested
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        // Foreign key — which job they're interested in
        public int JobId { get; set; }
        public Job Job { get; set; } = null!;
    }
}