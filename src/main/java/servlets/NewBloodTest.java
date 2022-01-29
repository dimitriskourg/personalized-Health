package servlets;

import database.tables.EditBloodTestTable;
import mainClasses.BloodTest;
import mainClasses.JSON_Converter;
import org.json.JSONObject;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import javax.xml.ws.Response;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;

@WebServlet(name = "NewBloodTest", value = "/NewBloodTest")
public class NewBloodTest extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out1 = response.getWriter();
        JSONObject jo = new JSONObject();
        JSON_Converter converter = new JSON_Converter();
        JSONObject bd_json = new JSONObject(converter.getJSONFromAjax(request.getReader()));
        EditBloodTestTable bt = new EditBloodTestTable();
        Date currentDate = new Date();
        Date enteredDate;

        BloodTest test = bt.jsonToBloodTest(bd_json.toString());

        if(test.getAmka() == null || test.getTest_date()==null || test.getMedical_center()==null){
            response.setStatus(401);
            jo.put("error", "Error in data");
            out1.println(jo);
            return;
        }
        //check for the provided date
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            enteredDate = sdf.parse(test.getTest_date());
        }catch (Exception ex){
            response.setStatus(401);
            jo.put("error", "Error in time");
            out1.println(jo);
            return;
        }
        if(test.getBlood_sugar() <=0 && test.getCholesterol() <=0 && test.getIron() <= 0 &&
                test.getVitamin_d3() <=0 && test.getVitamin_b12() <= 0){
            response.setStatus(401);
            jo.put("error", "Error in data");
            out1.println(jo);
        }else if(enteredDate.after(currentDate)){
            jo.put("error", "Date after current day");
            response.setStatus(401);
            out1.println(jo);

        }else {
            try {
                test.setValues();
                bt.createNewBloodTest(test);
                jo.put("success", "Blood test Added");
                response.setStatus(200);
                out1.println(jo);
            }catch (Exception e){
                jo.put("error", "Error in data");
                response.setStatus(401);
                out1.println(jo);
            }
        }



    }
}
