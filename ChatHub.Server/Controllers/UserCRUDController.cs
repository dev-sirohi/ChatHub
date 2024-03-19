using ChatHub.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;

namespace ChatHub.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserCRUDController : ControllerBase
    {
        public string HashPassword(string password)
        {
            return password;
        }

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

        [HttpPost("authenticateuser")]
        public string AuthenticateUser([FromBody] User user)
        {
            dynamic obj = new System.Dynamic.ExpandoObject();
            obj.authenticated = false;
            obj.authenticateMessage = "Username or password wrong";

            using (SqlConnection conn = new SqlConnection(Constants.Constants.GetConnectionString()))
            {
                try
                {
                    conn.Open();
                    using (SqlTransaction tran = conn.BeginTransaction())
                    {
                        try
                        {
                            string command = "SELECT * FROM USERS WHERE USERNAME = @username";
                            SqlCommand cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@username", user.Username);
                            using (SqlDataReader reader = cmd.ExecuteReader())
                            {
                                string storedPassword = string.Empty;
                                if (reader.Read())
                                {
                                    storedPassword = reader["password"].ToString();
                                }
                                if (HashPassword(user.Password) != storedPassword)
                                {
                                    return JsonConvert.SerializeObject(obj);
                                }

                                user.Id = Int32.Parse(reader["ID"].ToString());
                                user.Email = reader["EMAIL"].ToString();
                            }
                        }
                        catch (Exception ex)
                        {
                            throw ex;
                        }
                        tran.Commit();
                        obj.authenticated = true;
                        obj.authenticateMessage = "User authenticated!";
                        Constants.Constants.SetCurrentUser(user);
                    }
                }
                catch (Exception ex) { throw ex; }
            }

            return JsonConvert.SerializeObject(obj);
        }

        [HttpGet("getuserfriends")]
        public string GetUserFriends()
        {
            int userId = Constants.Constants._currentUser.Id;
            List<User> friendList = new List<User>();

            using (SqlConnection conn = new SqlConnection(Constants.Constants.GetConnectionString()))
            {
                try
                {
                    conn.Open();
                    using (SqlTransaction tran = conn.BeginTransaction())
                    {
                        try
                        {
                            string command = "SELECT * FROM FRIEND_INFO WHERE USER_ID = @userId;";
                            SqlCommand cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@userId", userId);
                            using (SqlDataReader reader = cmd.ExecuteReader())
                            {
                                while (reader.Read())
                                {
                                    User friend = new User();
                                    friend.Id = Int32.Parse(reader["FRIEND_ID"].ToString());
                                    friend.Username = reader["FRIEND_USERNAME"].ToString();
                                    friendList.Add(friend);
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            throw ex;
                        }
                        tran.Commit();
                    }
                }
                catch (Exception ex) { throw ex; }
            }

            return JsonConvert.SerializeObject(friendList);
        }

        [HttpPost("getuserbyusername")]
        public bool GetUserByUsername([FromBody] User userInfo)
        {
            using (SqlConnection conn = new SqlConnection(Constants.Constants.GetConnectionString()))
            {
                try
                {
                    conn.Open();
                    using (SqlTransaction tran = conn.BeginTransaction())
                    {
                        try
                        {
                            string command = "SELECT * FROM USERS WHERE USERNAME = @username";
                            SqlCommand cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@username", userInfo.Username);
                            using (SqlDataReader reader = cmd.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    return true;
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            throw ex;
                        }
                        tran.Commit();
                    }
                }
                catch (Exception ex) { throw ex; }
            }
            return false;
        }
    }
}
