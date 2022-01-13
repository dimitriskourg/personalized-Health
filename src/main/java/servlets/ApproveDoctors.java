package servlets;

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
import java.sql.SQLException;

@WebServlet(name = "ApproveDoctors", value = "/ApproveDoctors")
public class ApproveDoctors extends HttpServlet {


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        PrintWriter out1 = response.getWriter();
        response.setContentType("application/json; charset=UTF-8");
        response.setCharacterEncoding("UTF-8");


        EditSimpleUserTable su = new EditSimpleUserTable();

        if (session.getAttribute("username") != "admin") {
            response.setStatus(403);
        } else {
            JSONArray ja = new JSONArray();
            EditDoctorTable dt = new EditDoctorTable();
            try {
                for (Doctor doc:dt.databaseToDoctors()) {
                        if (doc.getCertified()==0){
                            JSONObject jo = new JSONObject(doc);
                            jo.remove("password");
                            ja.put(jo);
                        }
                    System.out.println(ja.toString());
                    response.setStatus(200);

                    out1.println(ja.toString());
                }
            } catch (SQLException | ClassNotFoundException throwables) {
                throwables.printStackTrace();
                response.setStatus(403);
            }
        }


    }
}
