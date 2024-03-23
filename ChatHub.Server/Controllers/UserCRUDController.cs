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

        [HttpPost("setsession")]
        public void SetSession([FromBody] User userInfo)
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
                            string command = "SELECT ID FROM USERS WHERE USERNAME = @Username";
                            SqlCommand cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@Username", userInfo.Username);
                            using (SqlDataReader reader = cmd.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    userInfo.Id = Int32.Parse(reader["id"].ToString());
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
            Constants.Constants.SetCurrentUser(userInfo);
        }

        [HttpGet("removesession")]
        public void RemoveSession()
        {
            Constants.Constants.RemoveCurrentUser();
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
            List<FriendInfo> friendList = new List<FriendInfo>();

            using (SqlConnection conn = new SqlConnection(Constants.Constants.GetConnectionString()))
            {
                try
                {
                    conn.Open();
                    using (SqlTransaction tran = conn.BeginTransaction())
                    {
                        try
                        {
                            string command = "SELECT * FROM FRIEND_INFO WHERE USER_ID = @userId AND FRIENDSHIP_STATUS = 401;";
                            SqlCommand cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@userId", userId);
                            using (SqlDataReader reader = cmd.ExecuteReader())
                            {
                                while (reader.Read())
                                {
                                    FriendInfo friend = new FriendInfo();
                                    friend.FriendId = Int32.Parse(reader["FRIEND_ID"].ToString());
                                    friend.FriendUsername = reader["FRIEND_USERNAME"].ToString();
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

        [HttpGet("getuserrequests")]
        public string GetUserRequests()
        {
            int userId = Constants.Constants._currentUser.Id;
            List<FriendInfo> requestList = new List<FriendInfo>();

            using (SqlConnection conn = new SqlConnection(Constants.Constants.GetConnectionString()))
            {
                try
                {
                    conn.Open();
                    using (SqlTransaction tran = conn.BeginTransaction())
                    {
                        try
                        {
                            string command = "SELECT * FROM FRIEND_INFO WHERE USER_ID = @userId AND FRIENDSHIP_STATUS = 402;";
                            SqlCommand cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@userId", userId);
                            using (SqlDataReader reader = cmd.ExecuteReader())
                            {
                                while (reader.Read())
                                {
                                    FriendInfo friend = new FriendInfo();
                                    friend.FriendId = Int32.Parse(reader["FRIEND_ID"].ToString());
                                    friend.FriendUsername = reader["FRIEND_USERNAME"].ToString();
                                    requestList.Add(friend);

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

            return JsonConvert.SerializeObject(requestList);
        }

        [HttpPost("getuserbyusername")]
        public dynamic GetUserByUsername([FromBody] User userInfo)
        {
            dynamic obj = new System.Dynamic.ExpandoObject();
            obj.userFound = false;
            obj.userAlreadyFriend = false;
            obj.requested = false;
            obj.blocked = false;

            using (SqlConnection conn = new SqlConnection(Constants.Constants.GetConnectionString()))
            {
                try
                {
                    conn.Open();
                    using (SqlTransaction tran = conn.BeginTransaction())
                    {
                        try
                        {
                            string command = "SELECT ID FROM USERS WHERE USERNAME = @Username";
                            SqlCommand cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@Username", userInfo.Username);
                            using (SqlDataReader reader = cmd.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    userInfo.Id = Int32.Parse(reader["id"].ToString());
                                }
                            }

                            command = "SELECT * FROM USER_BLOCKED WHERE USER_ID = @blockedId AND BLOCKED_ID = @userId;";
                            cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@userId", Constants.Constants._currentUser.Id);
                            cmd.Parameters.AddWithValue("@blockedId", userInfo.Id);
                            using (SqlDataReader reader = cmd.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    return obj;
                                }
                            }

                            command = "SELECT * FROM USER_BLOCKED WHERE USER_ID = @userId AND BLOCKED_ID = @blockedId;";
                            cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@userId", Constants.Constants._currentUser.Id);
                            cmd.Parameters.AddWithValue("@blockedId", userInfo.Id);
                            using (SqlDataReader reader = cmd.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    obj.userFound = true;
                                    obj.blocked = true;
                                    return obj;
                                }
                            }

                            command = "SELECT * FROM USER_FRIENDS WHERE USER_ID = @userId AND FRIEND_ID = @friendId;";
                            cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@userId", Constants.Constants._currentUser.Id);
                            cmd.Parameters.AddWithValue("@friendId", userInfo.Id);
                            using (SqlDataReader reader = cmd.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    obj.userFound = true;
                                    obj.userAlreadyFriend = true;
                                    if (Int32.Parse(reader["status"].ToString()) == 402)
                                    {
                                        obj.requested = true;
                                    }
                                    return obj;
                                }
                            }

                            command = "SELECT * FROM USERS WHERE USERNAME = @username";
                            cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@username", userInfo.Username);
                            using (SqlDataReader reader = cmd.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    obj.userFound = true;
                                    return obj;
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
            return obj;
        }

        [HttpPost("sendfriendrequest")]
        public void SendFriendRequest([FromBody] User userInfo)
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
                            string command = "SELECT ID FROM USERS WHERE USERNAME = @Username";
                            SqlCommand cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@Username", userInfo.Username);
                            using (SqlDataReader reader = cmd.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    userInfo.Id = Int32.Parse(reader["id"].ToString());
                                }
                            }

                            command = "INSERT INTO USER_FRIENDS VALUES(@userId, @friendId, 401);";
                            cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@userId", Constants.Constants._currentUser.Id);
                            cmd.Parameters.AddWithValue("@friendId", userInfo.Id);
                            cmd.ExecuteNonQuery();
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
        }

        [HttpPost("removefriendrequest")]
        public void RemoveFriendRequest([FromBody] User userInfo)
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
                            string command = "SELECT ID FROM USERS WHERE USERNAME = @Username";
                            SqlCommand cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@Username", userInfo.Username);
                            using (SqlDataReader reader = cmd.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    userInfo.Id = Int32.Parse(reader["id"].ToString());
                                }
                            }

                            command = "DELETE FROM USER_FRIENDS WHERE USER_ID = @userId AND FRIEND_ID = @friendId;";
                            cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@userId", Constants.Constants._currentUser.Id);
                            cmd.Parameters.AddWithValue("@friendId", userInfo.Id);
                            cmd.ExecuteNonQuery();
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
        }

        [HttpPost("blockuser")]
        public void BlockUser([FromBody] User userInfo)
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
                            string command = "SELECT ID FROM USERS WHERE USERNAME = @Username";
                            SqlCommand cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@Username", userInfo.Username);
                            using (SqlDataReader reader = cmd.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    userInfo.Id = Int32.Parse(reader["id"].ToString());
                                }
                            }

                            command = "DELETE FROM USER_FRIENDS WHERE USER_ID = @userId AND FRIEND_ID = @friendId;";
                            cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@userId", Constants.Constants._currentUser.Id);
                            cmd.Parameters.AddWithValue("@friendId", userInfo.Id);
                            cmd.ExecuteNonQuery();

                            command = "INSERT INTO USER_BLOCKED VALUES(@userId, @blockedId);";
                            cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@userId", Constants.Constants._currentUser.Id);
                            cmd.Parameters.AddWithValue("@blockedId", userInfo.Id);
                            cmd.ExecuteNonQuery();
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
        }

        [HttpPost("unblockuser")]
        public void UnBlockUser([FromBody] User userInfo)
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
                            string command = "SELECT ID FROM USERS WHERE USERNAME = @Username";
                            SqlCommand cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@Username", userInfo.Username);
                            using (SqlDataReader reader = cmd.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    userInfo.Id = Int32.Parse(reader["id"].ToString());
                                }
                            }

                            command = "DELETE FROM USER_BLOCKED WHERE USER_ID = @userId AND BLOCKED_ID = @blockedId;";
                            cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@userId", Constants.Constants._currentUser.Id);
                            cmd.Parameters.AddWithValue("@blockedId", userInfo.Id);
                            cmd.ExecuteNonQuery();
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
        }

        [HttpPost("acceptrequest")]
        public void AcceptRequest([FromBody] FriendInfo friendInfo)
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
                            string command = "UPDATE USER_FRIENDS SET STATUS = 401 WHERE USER_ID = @userId AND FRIEND_ID = @friendId;";
                            SqlCommand cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@userId", Constants.Constants._currentUser.Id);
                            cmd.Parameters.AddWithValue("@friendId", friendInfo.FriendId);
                            cmd.ExecuteNonQuery();
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
        }

        [HttpPost("rejectrequest")]
        public void RejectRequest([FromBody] FriendInfo friendInfo)
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
                            string command = "DELETE FROM USER_FRIENDS WHERE USER_ID = @userId AND FRIEND_ID = @friendId;";
                            SqlCommand cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@userId", Constants.Constants._currentUser.Id);
                            cmd.Parameters.AddWithValue("@friendId", friendInfo.FriendId);
                            cmd.ExecuteNonQuery();
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
        }

        [HttpPost("creategroup")]
        public void CreateGroup([FromBody] GroupChats groupChat)
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
                            string command = "INSERT INTO GROUP_CHATS VALUES('@groupName')";
                            SqlCommand cmd = new SqlCommand(command, conn, tran);
                            cmd.Parameters.AddWithValue("@groupName", groupChat.Name);
                            cmd.ExecuteNonQuery();
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
        }

        [HttpPost("addgroupmembers")]
        public void AddGroupMembers([FromBody] List<FriendInfo> friendInfoList, GroupChats groupChat)
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
                            string command = string.Empty;
                            for (int i = 0; i < friendInfoList.Count; i++)
                            {
                                command = "SELECT * FROM USERS WHERE USERNAME = @username;";
                                SqlCommand cmd = new SqlCommand(command, conn, tran);
                                cmd.Parameters.AddWithValue("@username", friendInfoList[i].FriendUsername);
                                using (SqlDataReader reader = cmd.ExecuteReader())
                                {
                                    if (reader.Read())
                                    {
                                        friendInfoList[i].FriendId = reader.GetInt32(0);
                                    }
                                }
                            }

                            for (int i = 0; i < friendInfoList.Count; i++)
                            {
                                command = "INSERT INTO USER_GROUPS VALUES(@friendId, @groupId)";
                                SqlCommand cmd = new SqlCommand(command, conn, tran);
                                cmd.Parameters.AddWithValue("@friendId", friendInfoList[i].FriendId);
                                cmd.Parameters.AddWithValue("@groupId", groupChat.Id);
                                cmd.ExecuteNonQuery();
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
        }
    }
}
