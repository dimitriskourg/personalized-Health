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

@WebServlet(name = "CreateRandevouz", value = "/CreateRandevouz")
public class CreateRandevouz extends HttpServlet {


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out1 = response.getWriter();
        JSONObject ret = new JSONObject();
        JSON_Converter converter = new JSON_Converter();
        JSONObject jo = new JSONObject(converter.getJSONFromAjax(request.getReader()));
        EditRandevouzTable randevouzTable = new EditRandevouzTable();

        //date look like 2021-11-12T12:00

        String date = jo.getString("date_time");
        //split date
        String[] arrOfStr = date.split("T");
        //take only time
        int time = Integer.parseInt(arrOfStr[1].substring(0,2)+arrOfStr[1].substring(3,5));


        //flag in case date already existing
        boolean flag = false;
        try {
            for (Randevouz randevouz:randevouzTable.databaseToSameDateRandevouz(date)) {
                System.out.println(randevouz.getDate_time());
                flag = true;
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }

        if (flag){
            ret.put("error","time already selected");
            response.setStatus(403);
            out1.println(ret);
        }else if (time < 800 || time > 2030){
            ret.put("error","time not accepted");
            response.setStatus(403);
            out1.println(ret);
        }else{
            //creates a new randevouz
            Randevouz ran = new Randevouz();
            ran.setStatus("free");
            ran.setDate_time(date);
            ran.setDoctor_id(jo.getInt("id"));
            ran.setUser_id(0);
            ran.setPrice(jo.getInt("price"));
            ran.setDoctor_info(jo.getString("info"));
            ran.setUser_info("");
            System.out.println(randevouzTable.randevouzToJSON(ran));



            try {
                //puts it in the database
                randevouzTable.createNewRandevouz(ran);
                response.setStatus(200);
                ret.put("success","randevouz added to database");
                out1.println(ret);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
                response.setStatus(401);
                ret.put("error","something went wrong");
                out1.println(ret);
            }
        }



    }
}
