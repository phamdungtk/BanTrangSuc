namespace DoAnTotNghiep_Api.Helpers
{
    public class Responsive
    {
        public int StatusCode { get; set; }
        public bool isOk { get; set; }
        public string Message { get; set; }
        public Responsive(string Message)
        {
            this.StatusCode = 400;
            this.isOk = false;
            this.Message = Message;
        }
        public Responsive(string Message, bool isOk = true)
        {
            this.StatusCode = 200;
            this.isOk = isOk;
            this.Message = Message;
        }
        public Responsive(int statusCode, string Message, bool isOk)
        {
            this.isOk = isOk;
            this.StatusCode = statusCode;
            this.Message = Message;
        }
    }
}

