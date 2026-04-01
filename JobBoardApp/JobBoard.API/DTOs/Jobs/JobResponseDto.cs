namespace JobBoard.API.DTOs.Jobs
{
    public class JobResponseDto
    {
        public int Id { get; set; }
        public string Summary { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public DateTime PostedDate { get; set; }
        public string PostedBy { get; set; } = string.Empty;
        public int PostedById { get; set; }
        public int InterestCount { get; set; }
    }
}