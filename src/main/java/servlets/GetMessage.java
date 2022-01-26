package servlets;

import database.tables.EditMessageTable;
import database.tables.EditTreatmentTable;
import mainClasses.JSON_Converter;
import mainClasses.Message;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

@WebServlet(name = "GetMessage", value = "/GetMessage")
public class GetMessage extends HttpServlet {


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out1 = response.getWriter();
        JSONArray ret = new JSONArray();
        JSON_Converter converter = new JSON_Converter();
        JSONObject jo = new JSONObject(converter.getJSONFromAjax(request.getReader()));
        EditMessageTable messageTable = new EditMessageTable();

        int doctor_id = jo.getInt("doctor_id");
        int user_id = jo.getInt("user_id");

        try {
            for (Message msg : messageTable.databaseToMessage(user_id,doctor_id)){
                JSONObject jsonObject = new JSONObject(msg);
                ret.put(jsonObject);
            }
            if (ret.length()==0){
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("failure","didnt find any messages between you and this user");
                response.setStatus(403);
                out1.println(jsonObject);
            }else{
                System.out.println(ret);
                response.setStatus(200);
                out1.println(ret);
            }
        }catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            e.printStackTrace();
        }

    }
}
