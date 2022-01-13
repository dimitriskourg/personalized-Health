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

        String username = jo.getString("username");

        EditDoctorTable dt = new EditDoctorTable();
        EditSimpleUserTable sut = new EditSimpleUserTable();


        if (!session.getAttribute("username").equals("admin")) {
            response.setStatus(401);
        }else {
            try {
                boolean flag = false;

                for (Doctor doc:dt.databaseToDoctors()) {

                    if (Objects.equals(doc.getUsername(), username)){
                        ret.put("success","doctor with username"+username+" deleted");
                        delete_doctor(username);
                        response.setStatus(200);
                        flag=true;
                    }
                }



                for (SimpleUser user:sut.databaseToUsers()){
                    if (Objects.equals(user.getUsername(), username)){
                        ret.put("success","user with username"+username+" deleted");
                        delete_user(username);
                        response.setStatus(200);
                        flag=true;
                    }
                }
                if(!flag){
                    ret.put("failure","user with username"+username+" not found");
                    response.setStatus(404);
                }

            } catch (SQLException | ClassNotFoundException throwables) {
                throwables.printStackTrace();
                response.setStatus(403);
            }
        }
    }

    protected void delete_user(String username) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String update="DELETE FROM users WHERE username='"+username+"'";
        stmt.execute(update);

    }
    protected void delete_doctor(String username) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String update="DELETE FROM doctors WHERE username='"+username+"'";
        stmt.execute(update);

    }
}
