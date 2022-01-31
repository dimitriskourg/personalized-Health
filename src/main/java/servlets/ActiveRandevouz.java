package servlets;

import database.tables.EditDoctorTable;
import database.tables.EditRandevouzTable;
import database.tables.EditSimpleUserTable;

import mainClasses.Randevouz;
import mainClasses.SimpleUser;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.text.SimpleDateFormat;

import java.util.Calendar;
import java.util.Date;

@WebServlet(name = "ActiveRandevouz", value = "/ActiveRandevouz")
public class ActiveRandevouz extends HttpServlet {


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        PrintWriter out1 = response.getWriter();
        EditSimpleUserTable su = new EditSimpleUserTable();
        response.setContentType("application/json; charset=UTF-8");
        response.setCharacterEncoding("UTF-8");

        Calendar cal = Calendar.getInstance(); // creates calendar
        cal.setTime(new Date()); // sets calendar time/date
        Date now = cal.getTime();   // sets date to now
        cal.add(Calendar.HOUR_OF_DAY, 4);      // adds 4 hours
        Date after = cal.getTime(); // sets date to after
        SimpleDateFormat ft = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); // formats date before sql



        EditRandevouzTable randevouzTable = new EditRandevouzTable();
        EditSimpleUserTable simpleUserTable = new EditSimpleUserTable();
        if (session.getAttribute("username") != null){
            try {
                SimpleUser user = simpleUserTable.databaseToSimpleUser(session.getAttribute("username").toString());
                Randevouz randevouz = randevouzTable.databaseToSameActiveRandevouz(ft.format(now),ft.format(after),user.getUser_id());
                System.out.println(randevouzTable.randevouzToJSON(randevouz));
                System.out.println(ft.format(now));
                System.out.println(ft.format(after));
                response.setStatus(200);
                if (randevouz == null){
                    out1.println(new JSONObject().put("success","no incoming randevouz"));
                }else{
                    EditDoctorTable table = new EditDoctorTable();
                    JSONObject jsonObject = new JSONObject(randevouzTable.randevouzToJSON(randevouz));
                    jsonObject.put("doctor_name",table.databaseToDoctor(randevouz.getDoctor_id()).getFirstname()+ " "+
                            table.databaseToDoctor(randevouz.getDoctor_id()).getLastname());
                    out1.println(jsonObject);

                }

            } catch (SQLException | ClassNotFoundException e) {
                response.setStatus(400);
                out1.println(new JSONObject().put("error","something went wrong"));
                e.printStackTrace();
            }

        }else{
            response.setStatus(200);
            out1.println(new JSONObject().put("success","no incoming randevouz"));
        }


    }
}
