package servlets;

import database.tables.EditBloodTestTable;
import database.tables.EditSimpleUserTable;
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
import java.sql.SQLException;
import java.util.ArrayList;

@WebServlet(name = "UserBloodtest", value = "/UserBloodtest")
public class UserBloodtest extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out1 = response.getWriter();
        JSONArray jsonArray = new JSONArray();
        JSON_Converter converter = new JSON_Converter();
        JSONObject front_end = new JSONObject(converter.getJSONFromAjax(request.getReader()));
        JSONArray treat = new JSONArray();

        EditSimpleUserTable userTable = new EditSimpleUserTable();
        EditBloodTestTable table = new EditBloodTestTable();
        EditTreatmentTable treatmentTable = new EditTreatmentTable();
        try {
            for (BloodTest test : table.databaseToBloodTest(userTable.databaseToSimpleUser(front_end.getInt("user_id")).getAmka())){
                JSONObject jsonObject = new JSONObject(test);
                jsonArray.put(jsonObject);
            }
            for(Treatment tr : treatmentTable.databaseToTreatment_user_id(front_end.getInt("user_id"))){
                JSONObject jsonObject = new JSONObject(tr);
                treat.put(jsonObject);
            }
            if (jsonArray.length()==0){
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("failure","didnt find any history of this user");
                response.setStatus(403);
                out1.println(jsonObject);
            }else{
                response.setStatus(200);
                System.out.println("{\"bloodtest\":" + jsonArray.toString() +",\"treatment\":"+ treat.toString()+"}");
                out1.println("{\"bloodtest\":" + jsonArray.toString() +",\"treatment\":"+ treat.toString()+"}");
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
