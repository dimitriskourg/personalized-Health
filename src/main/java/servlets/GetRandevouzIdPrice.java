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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@WebServlet(name = "GetRandevouzIdPrice", value = "/GetRandevouzIdPrice")
public class GetRandevouzIdPrice extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out1 = response.getWriter();
        JSONArray ret = new JSONArray();

        EditRandevouzTable dt = new EditRandevouzTable();


        Map<Integer, Integer> id_price = new HashMap<Integer, Integer>();
        try {
            for (Randevouz randevouz:dt.databaseToRandevouz()) {
                if (!randevouz.getStatus().equals("free")){
                    continue;
                }
                if (!id_price.containsKey(randevouz.getDoctor_id())){
                    id_price.put(randevouz.getDoctor_id(), randevouz.getPrice());
                }else if(id_price.get(randevouz.getDoctor_id())>randevouz.getPrice()){
                    id_price.remove(randevouz.getDoctor_id());
                    id_price.put(randevouz.getDoctor_id(), randevouz.getPrice());
                }
            }
            for (Map.Entry<Integer, Integer> me :id_price.entrySet()) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("doctor_id",me.getKey().toString());
                jsonObject.put("price",me.getValue().toString());
                ret.put(jsonObject);
            }



            response.setStatus(200);


            System.out.println(ret);
            out1.println(ret);
        } catch (SQLException | ClassNotFoundException throwables) {
            throwables.printStackTrace();
            response.setStatus(403);
        }
    }


}
