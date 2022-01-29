package servlets;

import database.tables.EditBloodTestTable;
import database.tables.EditSimpleUserTable;
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
import java.sql.SQLException;

@WebServlet(name = "BloodTestMeasure", value = "/BloodTestMeasure")
public class BloodTestMeasure extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out1 = response.getWriter();
        JSON_Converter converter = new JSON_Converter();
        JSONObject front_end = new JSONObject(converter.getJSONFromAjax(request.getReader()));
        JSONArray jsonArray = new JSONArray();
        EditBloodTestTable table = new EditBloodTestTable();
        String measure = front_end.getString("measure");
        try {
            for (BloodTest test : table.databaseToBloodTest(front_end.getString("amka"))){
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("test_date",test.getTest_date());
                jsonObject.put("medical_center",test.getMedical_center());

                switch (measure){
                    case "iron":
                        jsonObject.put("iron",test.getIron());
                        jsonObject.put("iron_level",test.getIron_level());
                        break;
                    case "cholesterol":
                        jsonObject.put("cholesterol",test.getCholesterol());
                        jsonObject.put("cholesterol_level",test.getCholesterol_level());
                        break;
                    case "blood_sugar":
                        jsonObject.put("blood_sugar",test.getBlood_sugar());
                        jsonObject.put("blood_sugar_level",test.getBlood_sugar_level());
                        break;
                    case "vitamin_d3":
                        jsonObject.put("vitamin_d3",test.getVitamin_d3());
                        jsonObject.put("vitamin_d3_level",test.getVitamin_d3_level());
                        break;
                    case "vitamin_b12":
                        jsonObject.put("vitamin_b12",test.getVitamin_b12());
                        jsonObject.put("vitamin_b12_level",test.getVitamin_b12_level());
                        break;
                }
                jsonArray.put(jsonObject);
            }

            if (jsonArray.length()==0){
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("failure","didnt find any history of this user");
                response.setStatus(403);
                out1.println(jsonObject);
            }else{
                response.setStatus(200);
                System.out.println(jsonArray);
                out1.println(jsonArray);
            }

        } catch (SQLException | ClassNotFoundException e) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("error","didnt find any history of this user");
            response.setStatus(403);
            out1.println(jsonObject);
            e.printStackTrace();
        }
    }


}
