package servlets;

import database.DB_Connection;
import database.tables.EditDoctorTable;
import database.tables.EditSimpleUserTable;
import mainClasses.Doctor;
import mainClasses.JSON_Converter;
import mainClasses.SimpleUser;
import org.json.JSONObject;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import java.util.Objects;

@WebServlet(name = "DeleteUser", value = "/DeleteUser")
public class DeleteUser extends HttpServlet {


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        HttpSession session = request.getSession();
        response.setContentType("application/json;charset=UTF-8");
        JSON_Converter converter = new JSON_Converter();
        JSONObject jo = new JSONObject(converter.getJSONFromAjax(request.getReader()));
        JSONObject ret = new JSONObject();
        PrintWriter out1 = response.getWriter();
        String username = jo.getString("username");

        EditDoctorTable dt = new EditDoctorTable();
        EditSimpleUserTable sut = new EditSimpleUserTable();


        if (session.getAttribute("username") == "admin") {
            response.setStatus(401);
        }else {
            try {

                for (Doctor doc:dt.databaseToDoctors()) {

                    if (Objects.equals(doc.getUsername(), username)){
                        ret.put("success","doctor with username"+username+" deleted");
                        delete_doctor(username);
                        response.setStatus(200);
                    }
                }



                for (SimpleUser user:sut.databaseToUsers()){
                    if (Objects.equals(user.getUsername(), username)){
                        ret.put("success","user with username"+username+" deleted");
                        delete_user(username);
                        response.setStatus(200);
                    }
                }

                ret.put("failure","user with username"+username+" not found");
                response.setStatus(404);
            } catch (SQLException | ClassNotFoundException throwables) {
                throwables.printStackTrace();
                response.setStatus(403);
            }
        }
    }

    protected void delete_user(String username) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        PreparedStatement st = con.prepareStatement("DELETE FROM users WHERE username = ?");
        st.setString(1,username);
        st.execute();

    }
    protected void delete_doctor(String username) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        PreparedStatement st = con.prepareStatement("DELETE FROM doctors WHERE username = ?");
        st.setString(1,username);
        st.execute();

    }
}
