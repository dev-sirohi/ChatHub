using Microsoft.AspNetCore.Mvc;

namespace ChatHub.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestingConnection : ControllerBase
    {
        [HttpGet("checkconnection")]
        public string CheckConnection()
        {
            return "Connection Successful!";
        }
    }
}
