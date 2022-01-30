package servlets;

import database.tables.EditDoctorTable;
import database.tables.EditRandevouzTable;
import mainClasses.Doctor;
import mainClasses.JSON_Converter;
import mainClasses.Randevouz;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

@WebServlet(name = "GetRandevouzUser", value = "/GetRandevouzUser")
public class GetRandevouzUser extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out1 = response.getWriter();

        JSON_Converter converter = new JSON_Converter();
        int user_id = new JSONObject(converter.getJSONFromAjax(request.getReader())).getInt("id");

        JSONArray selected_randevouz = new JSONArray();
        JSONArray done_randevouz = new JSONArray();


        EditRandevouzTable dt = new EditRandevouzTable();
        EditDoctorTable table = new EditDoctorTable();

        try {

            for (Randevouz randevouz:dt.databaseToRandevouz()) {
                if (randevouz.getUser_id()==user_id){
                    JSONObject jo = new JSONObject(randevouz);
                    Doctor doc = table.databaseToDoctor(randevouz.getDoctor_id());
                    String name = doc.getFirstname() +" "+ doc.getLastname();
                    jo.put("name",name);
                    if (randevouz.getStatus().equals("done")){
                        done_randevouz.put(jo);

                    }
                    else if(randevouz.getStatus().equals("selected")){
                        selected_randevouz.put(jo);

                    }

                }
            }
            response.setStatus(200);
            String ret = "{\"done\":" + done_randevouz.toString()+
                    ",\"selected\":"+ selected_randevouz.toString()+"}";

            System.out.println(ret);
            out1.println(ret);
        } catch (SQLException | ClassNotFoundException throwables) {
            throwables.printStackTrace();
            response.setStatus(403);
        }

    }


}
