package servlets;

import database.tables.EditRandevouzTable;
import mainClasses.JSON_Converter;
import mainClasses.Randevouz;
import org.json.JSONObject;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "CreateRandevouz", value = "/CreateRandevouz")
public class CreateRandevouz extends HttpServlet {


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out1 = response.getWriter();
        JSONObject ret = new JSONObject();
        JSON_Converter converter = new JSON_Converter();
        JSONObject jo = new JSONObject(converter.getJSONFromAjax(request.getReader()));
        EditRandevouzTable randevouzTable = new EditRandevouzTable();
        Randevouz ran = new Randevouz();
        ran.setStatus("free");
        ran.setDate_time(jo.getString("date_time"));
        ran.setDoctor_id(jo.getInt("id"));
        ran.setUser_id(0);
        ran.setPrice(jo.getInt("price"));
        ran.setDoctor_info(jo.getString("info"));
        ran.setUser_info("");
        System.out.println(randevouzTable.randevouzToJSON(ran));
        try {
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
