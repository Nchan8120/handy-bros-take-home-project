namespace JobBoard.API.DTOs.Interest
{
    public class InterestResponseDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public DateTime ExpressedAt { get; set; }
    }
}