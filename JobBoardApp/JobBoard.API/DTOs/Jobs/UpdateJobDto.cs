namespace JobBoard.API.DTOs.Jobs
{
    public class UpdateJobDto
    {
        public string Summary { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
    }
}