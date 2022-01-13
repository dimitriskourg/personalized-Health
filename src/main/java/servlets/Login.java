package servlets;

import database.tables.EditSimpleUserTable;
import mainClasses.JSON_Converter;
import mainClasses.SimpleUser;
import org.json.JSONObject;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;

@WebServlet(name = "Login", value = "/Login")
public class Login extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        PrintWriter out1 = response.getWriter();
        EditSimpleUserTable su = new EditSimpleUserTable();
        response.setContentType("application/json; charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        if(session.getAttribute("username") != null){
            JSONObject jo = null;
            try {
                jo = new JSONObject(su.databaseUserToJSON(session.getAttribute("username").toString() , session.getAttribute("password").toString()));
                response.setStatus(200);
                JSONObject ret = new JSONObject();
                if (session.getAttribute("username").equals("admin")){
                    ret.put("success", "admin");
                }else{
                    ret.put("success","user");
                }
                //first returns if it user or admin
                out1.println(ret);
                jo.remove("password");
                //returns all fields for the user that logged in
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
        EditSimpleUserTable eut = new EditSimpleUserTable();
        HttpSession session = request.getSession(true);
        try {
            SimpleUser su = eut.databaseToSimpleUser(username, password);
            if(su == null){
                response.setStatus(403);
                ret.put("error", "The username or password is incorrect");
            }else{
                response.setStatus(200);
                if (username.equals("admin")){
                    ret.put("success", "admin");
                }else{
                    ret.put("success","user");
                }
                session.setAttribute("username", username);
                session.setAttribute("password", password);
            }
        } catch (SQLException | ClassNotFoundException throwables) {
            throwables.printStackTrace();
        }
        out1.println(ret);
    }
}
