package servlets;

import database.tables.EditRandevouzTable;
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

@WebServlet(name = "GetRantevouz", value = "/GetRantevouz")
public class GetRantevouz extends HttpServlet {


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out1 = response.getWriter();

        JSON_Converter converter = new JSON_Converter();
        int doctor_id = new JSONObject(converter.getJSONFromAjax(request.getReader())).getInt("id");


        JSONArray free_randevouz = new JSONArray();
        JSONArray cancelled_randevouz = new JSONArray();
        JSONArray selected_randevouz = new JSONArray();
        JSONArray done_randevouz = new JSONArray();


        EditRandevouzTable dt = new EditRandevouzTable();
        try {
            System.out.println("Mphke");
            for (Randevouz randevouz:dt.databaseToRandevouz()) {
                if (randevouz.getDoctor_id()==doctor_id){
                    JSONObject jo = new JSONObject(randevouz);

                    if (randevouz.getStatus().equals("done")){
                        done_randevouz.put(jo);
                    }else if(randevouz.getStatus().equals("free")){
                        free_randevouz.put(jo);
                    }else if(randevouz.getStatus().equals("selected")){
                        selected_randevouz.put(jo);
                    }else{
                        cancelled_randevouz.put(jo);
                    }
                }
            }
            response.setStatus(200);
            String ret = "{\"free\":" + free_randevouz.toString() +",\"done\":"+ done_randevouz.toString()+
                    ",\"selected\":"+ selected_randevouz.toString()+",\"cancelled\":"+ cancelled_randevouz.toString()+"}";

            System.out.println(ret);
            out1.println(ret);
        } catch (SQLException | ClassNotFoundException throwables) {
            throwables.printStackTrace();
            response.setStatus(403);
        }
    }
}
