namespace JobBoard.API.DTOs.Jobs
{
    public class CreateJobDto
    {
        public string Summary { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
    }
}