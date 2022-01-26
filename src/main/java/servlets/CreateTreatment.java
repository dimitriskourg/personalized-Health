package servlets;

import database.tables.EditRandevouzTable;
import database.tables.EditTreatmentTable;
import mainClasses.JSON_Converter;
import mainClasses.Randevouz;
import mainClasses.Treatment;
import org.json.JSONObject;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

@WebServlet(name = "CreateTreatment", value = "/CreateTreatment")
public class CreateTreatment extends HttpServlet {


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out1 = response.getWriter();
        JSONObject ret = new JSONObject();
        JSON_Converter converter = new JSON_Converter();
        JSONObject jo = new JSONObject(converter.getJSONFromAjax(request.getReader()));
        EditTreatmentTable treatmentTable = new EditTreatmentTable();


        Treatment treatment = new Treatment();
        String text = jo.getString("treatment_text");
        int doctor_id = jo.getInt("doctor_id");
        int user_id = jo.getInt("user_id");
        String end_date = jo.getString("end_date");
        String start_date = jo.getString("start_date");
        int blood_id = jo.getInt("bloodtest_id");

        String[] end_dateArr = end_date.split("-");
        String[] start_dateArr = start_date.split("-");


        if (Integer.parseInt(end_dateArr[0])<Integer.parseInt(start_dateArr[0])){
            response.setStatus(403);
            ret.put("error","invalid date given , year of end treatment is before year of start treatment");
            out1.println(ret);
            return;
        }else if(Integer.parseInt(end_dateArr[0])==Integer.parseInt(start_dateArr[0]) &&
                Integer.parseInt(end_dateArr[1])<Integer.parseInt(start_dateArr[1])){
            response.setStatus(403);
            ret.put("error","invalid date given , month of end treatment is before month of start treatment");
            out1.println(ret);
            return;
        }else if(Integer.parseInt(end_dateArr[0])==Integer.parseInt(start_dateArr[0]) &&
                Integer.parseInt(end_dateArr[1])==Integer.parseInt(start_dateArr[1]) &&
                Integer.parseInt(end_dateArr[2])<Integer.parseInt(start_dateArr[2])){
            response.setStatus(403);
            ret.put("error","invalid date given , day of end treatment is before day of start treatment");
            out1.println(ret);
            return;
        }


        treatment.setTreatment_text(text);
        treatment.setDoctor_id(doctor_id);
        treatment.setUser_id(user_id);
        treatment.setEnd_date(end_date);
        treatment.setStart_date(start_date);
        treatment.setBloodtest_id(blood_id);




            try {
                if (treatmentTable.databaseToTreatment_bloodtest_id(blood_id).size()!=0){
                    response.setStatus(403);
                    ret.put("error","treatment for this bloodtest already given");
                    out1.println(ret);
                }else{
                    //puts it in the database
                    treatmentTable.createNewTreatment(treatment);
                    response.setStatus(200);
                    ret.put("success","treatment added to database");
                    out1.println(ret);
                }

            } catch (ClassNotFoundException | SQLException e) {
                e.printStackTrace();
                response.setStatus(401);
                ret.put("error","something went wrong");
                out1.println(ret);
            }
        }
    }

