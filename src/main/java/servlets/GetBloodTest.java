package servlets;

import database.tables.EditBloodTestTable;
import database.tables.EditTreatmentTable;
import mainClasses.BloodTest;
import mainClasses.JSON_Converter;
import mainClasses.Treatment;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

@WebServlet(name = "GetBloodTest", value = "/GetBloodTest")
public class GetBloodTest extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out1 = response.getWriter();

        JSON_Converter converter = new JSON_Converter();
        JSONObject jsonObject = new JSONObject(converter.getJSONFromAjax(request.getReader()));


        JSONArray arr = new JSONArray();
        ArrayList <BloodTest> tests = new ArrayList<BloodTest>();
        JSONArray treatments = new JSONArray();
        EditTreatmentTable table = new EditTreatmentTable();
        EditBloodTestTable ed = new EditBloodTestTable();

        try {
            tests = ed.databaseToBloodTest(jsonObject.getString("amka"),jsonObject.getString("min_date"),jsonObject.getString("max_date"));
            for (BloodTest bd:tests){
                JSONObject temp = new JSONObject(ed.bloodTestToJSON(bd));

                if (table.databaseToTreatment_bloodtest_id(bd.getBloodtest_id()).size()!=0){
                    JSONObject treat_tmp = new JSONObject(table.databaseToTreatment_bloodtest_id(bd.getBloodtest_id()).get(0));
                    treatments.put(treat_tmp);
                }

                arr.put(temp);
            }

        } catch (Exception e){
            e.printStackTrace();
            response.setStatus(401);
            out1.println(new JSONObject().put("error","something went wrong"));

        }
        response.setStatus(200);
        out1.println("{\"bloodtest\":" + arr.toString() +",\"treatment\":"+ treatments.toString()+"}");
    }


}
