package servlets;

import database.DB_Connection;
import database.tables.EditDoctorTable;
import database.tables.EditSimpleUserTable;
import mainClasses.Doctor;
import mainClasses.JSON_Converter;
import mainClasses.SimpleUser;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

@WebServlet(name = "ApproveDoctors", value = "/ApproveDoctors")
public class ApproveDoctors extends HttpServlet {


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();

        response.setContentType("application/json; charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        JSON_Converter converter = new JSON_Converter();
        JSONObject jo = new JSONObject(converter.getJSONFromAjax(request.getReader()));

        if (session.getAttribute("username").equals("admin")) {
            response.setStatus(403);
        } else {

            try {
                approveDoctor(jo.getString("username"));
            } catch (SQLException | ClassNotFoundException throwables) {
                throwables.printStackTrace();
                response.setStatus(403);
            }
        }


    }

    protected void approveDoctor(String username) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String update="UPDATE doctors SET certified = 1 WHERE username='"+username+"'";
        stmt.execute(update);
    }


}
