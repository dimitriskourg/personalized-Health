package servlets;

import database.tables.EditDoctorTable;
import database.tables.EditSimpleUserTable;
import mainClasses.JSON_Converter;
import org.json.JSONObject;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "RegisterUser", value = "/RegisterUser")
public class RegisterUser extends HttpServlet {
//    @Override
//    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//
//    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        JSON_Converter converter = new JSON_Converter();
        JSONObject jo = new JSONObject(converter.getJSONFromAjax(request.getReader()));
        JSONObject ret = new JSONObject();
        PrintWriter out1 = response.getWriter();

        if(jo.getString("user_type").equals("Default")){
            jo.remove("user_type");
            EditSimpleUserTable su = new EditSimpleUserTable();
            try {
                System.out.println(jo.toString());
                su.addSimpleUserFromJSON(jo.toString());
                ret.put("error", "Register User completed");
            } catch (Exception e) {
                e.printStackTrace();
                ret.put("error", "Something went wrong, please try again later.");
                response.setStatus(403);
            }
        }else{
            jo.remove("user_type");
            EditDoctorTable dt = new EditDoctorTable();
            try {
                System.out.println(jo.toString());
                dt.addDoctorFromJSON(jo.toString());
                ret.put("error", "Register User completed. However one moderator should certify you.");
            } catch (Exception e) {
                e.printStackTrace();
                ret.put("error", "Something went wrong, please try again later.");
                response.setStatus(403);
            }
        }
        out1.println(ret);
    }
}
