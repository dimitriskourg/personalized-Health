package servlets;

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
import java.sql.SQLException;

@WebServlet(name = "LoginDoctor", value = "/LoginDoctor")
public class LoginDoctor extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        PrintWriter out1 = response.getWriter();
        EditDoctorTable su = new EditDoctorTable();
        response.setContentType("application/json; charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        if(session.getAttribute("username") != null){
            JSONObject jo = null;
            try {
                jo = new JSONObject(su.databaseToJSON(session.getAttribute("username").toString() , session.getAttribute("password").toString()));
                response.setStatus(200);
                jo.put("success","doctor");
                jo.remove("password");
                System.out.println(jo);
                out1.println(jo);
            } catch (SQLException | ClassNotFoundException throwables) {
                throwables.printStackTrace();
                response.setStatus(403);
            }
        }
        else{
            response.setStatus(403);
        }

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        JSON_Converter converter = new JSON_Converter();
        JSONObject jo = new JSONObject(converter.getJSONFromAjax(request.getReader()));
        JSONObject ret = new JSONObject();
        PrintWriter out1 = response.getWriter();
        String username = jo.getString("username");
        String password = jo.getString("password");
        EditDoctorTable eut = new EditDoctorTable();
        HttpSession session = request.getSession(true);
        try {
            Doctor su = eut.databaseToDoctor(username, password);
            if(su == null){
                response.setStatus(403);
                ret.put("error", "The username or password is incorrect");
            }else{
                response.setStatus(200);
                ret.put("success","doctor");
                session.setAttribute("username", username);
                session.setAttribute("password", password);
            }
        } catch (SQLException | ClassNotFoundException throwables) {
            throwables.printStackTrace();
        }
        System.out.println(ret);
        out1.println(ret);
    }

}
