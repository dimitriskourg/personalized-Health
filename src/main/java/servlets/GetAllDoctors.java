package servlets;

import database.tables.EditDoctorTable;
import mainClasses.Doctor;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

@WebServlet(name = "GetAllDoctors", value = "/GetAllDoctors")
public class GetAllDoctors extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out1 = response.getWriter();
        JSONArray ja = new JSONArray();
        EditDoctorTable dt = new EditDoctorTable();
        try {
            System.out.println("Mphke");
            for (Doctor doc:dt.databaseToDoctors()) {
                JSONObject jo = new JSONObject(doc);
                ja.put(jo);
            }
            System.out.println(ja.toString());
            response.setStatus(200);
            out1.println(ja.toString());

        } catch (SQLException | ClassNotFoundException throwables) {
            throwables.printStackTrace();
            response.setStatus(403);
        }
    }

//    @Override
//    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//
//    }
}
