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
import java.sql.SQLException;

@WebServlet(name = "UpdateSettingsDoctor", value = "/UpdateSettingsDoctor")
public class UpdateSettingsDoctor extends HttpServlet {


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        JSON_Converter converter = new JSON_Converter();
        JSONObject jo = new JSONObject(converter.getJSONFromAjax(request.getReader()));
        JSONObject ret = new JSONObject();
        PrintWriter out1 = response.getWriter();
        HttpSession session = request.getSession(true);
        String username = session.getAttribute("username").toString();

        EditDoctorTable su = new EditDoctorTable();
        if(jo.getString("password").equals("")){
            String oldPass = session.getAttribute("password").toString();
            jo.remove("password");
            jo.put("password", oldPass);
        }
        try {
            su.updateDoctor(username, jo.getDouble("weight"), jo.getString("email"),
                    jo.getString("password"), jo.getString("firstname"), jo.getString("lastname"),jo.getString("birthdate"),
                    jo.getString("gender"), jo.getString("country"), jo.getString("city"),
                    jo.getString("address"), jo.getString("telephone"),  jo.getInt("height"), jo.getInt("blooddonor"),
                    jo.getString("bloodtype") , jo.getString("specialty") , jo.getString("doctor_info"));
            ret.put("success", "User Settings updated");
            response.setStatus(200);
        } catch (SQLException | ClassNotFoundException throwables) {
            throwables.printStackTrace();
            ret.put("error", "Error updating User Settings");
            response.setStatus(403);
        }
        out1.println(ret);
    }
}
