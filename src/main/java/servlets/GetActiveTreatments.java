package servlets;

import database.tables.EditTreatmentTable;
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
import java.text.SimpleDateFormat;
import java.util.Date;

@WebServlet(name = "GetActiveTreatments", value = "/GetActiveTreatments")
public class GetActiveTreatments extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out1 = response.getWriter();

        JSON_Converter converter = new JSON_Converter();
        JSONObject jsonObject = new JSONObject(converter.getJSONFromAjax(request.getReader()));

        Date date = new Date();
        SimpleDateFormat ft = new SimpleDateFormat("yyyy-MM-dd");
        System.out.println(ft.format(date));
        JSONArray arr = new JSONArray();

        EditTreatmentTable table = new EditTreatmentTable();

        try {
            for (Treatment treatment: table.databaseToActiveTreatment(jsonObject.getInt("user_id"),ft.format(date))){
                arr.put(new JSONObject(treatment));
            }
            if (arr.length()==0){
                response.setStatus(404);
                out1.println(new JSONObject().put("error","no active treatments"));
                return;
            }
            response.setStatus(200);
            out1.println(arr);

        } catch (SQLException | ClassNotFoundException throwables) {
            throwables.printStackTrace();
            response.setStatus(403);
            out1.println(new JSONObject().put("error","something went wrong"));
        }
    }


}
