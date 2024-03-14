using ChatHub.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace ChatHub.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserCRUDController : ControllerBase
    {
        [HttpGet("testcrud")]
        public string TestCRUD()
        {
            return "CRUD working!";
        }

        [HttpPost("setuserdata")]
        public string SetUserData([FromBody] User user)
        {
            string successful = "user data not set";

            // set up connection to database and set user data

            using (SqlConnection conn = new SqlConnection(Constants.Constants.GetConnectionString()))
            {
                try
                {
                    conn.Open();
                    using (SqlTransaction tran = conn.BeginTransaction())
                    {
                        try
                        {
                            string command = "INSERT INTO USERS VALUES(@username, @email, @password);";
                            SqlCommand cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@username", user.Username);
                            cmd.Parameters.AddWithValue("@email", user.Email);
                            cmd.Parameters.AddWithValue("@password", user.Password);
                            cmd.ExecuteNonQuery();
                        }
                        catch (Exception ex)
                        {
                            throw ex;
                        }
                        tran.Commit();
                        successful = "user data set successfully!";
                    }
                }
                catch (Exception ex) { throw ex; }
            }

            return successful;
        }
    }
}
