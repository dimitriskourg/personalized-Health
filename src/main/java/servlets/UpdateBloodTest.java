package servlets;

import database.DB_Connection;
import database.tables.EditBloodTestTable;
import mainClasses.BloodTest;
import mainClasses.JSON_Converter;
import org.json.JSONObject;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

@WebServlet(name = "UpdateBloodTest", value = "/UpdateBloodTest")
public class UpdateBloodTest extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out1 = response.getWriter();
        JSON_Converter converter = new JSON_Converter();
        JSONObject front_end = new JSONObject(converter.getJSONFromAjax(request.getReader()));
        EditBloodTestTable table = new EditBloodTestTable();



        JSONObject ret = new JSONObject();

        String measure = front_end.getString("measure");
        int id = front_end.getInt("bloodtest_id");
        int value = front_end.getInt("value");

        if (value <= 0){
            ret.put("error","The given value is 0 or negative");
            response.setStatus(403);
            out1.println(ret);
            return;
        }else if (!measure.equals("bloodsugar") && !measure.equals("iron") &&
                !measure.equals("cholesterol") &&!measure.equals("vitamin_d3") &&
                !measure.equals("vitamin_b12") ){
            ret.put("error","The given measure is unknown");
            response.setStatus(403);
            out1.println(ret);
            return;
        }

        BloodTest bt = new BloodTest();
        try{
            Connection con = DB_Connection.getConnection();
            Statement stmt = con.createStatement();

            String update;
            switch (measure) {
                case "cholesterol" :
                    bt.setCholesterol(value);
                    bt.setCholesterol_level();
                    update = "UPDATE bloodtest SET cholesterol='"+value+"', cholesterol_level='"+bt.getCholesterol_level()+"' WHERE bloodtest_id = '"+id+"'";
                    stmt.executeUpdate(update);
                    ret.put("success" , "The measure has been updated");
                    break;
                case "blood_sugar" :
                    bt.setBlood_sugar(value);
                    bt.setBlood_sugar_level();
                    update = "UPDATE bloodtest SET blood_sugar ='"+value+"', blood_sugar_level='"+bt.getBlood_sugar_level()+"' WHERE bloodtest_id = '"+id+"'";
                    stmt.executeUpdate(update);
                    ret.put("success" , "The measure has been updated");
                    break;
                case "iron" :
                    bt.setIron(value);
                    bt.setIron_level();
                    update = "UPDATE bloodtest SET iron ='"+value+"', iron_level='"+bt.getIron_level()+"' WHERE bloodtest_id = '"+id+"'";
                    stmt.executeUpdate(update);
                    ret.put("success" , "The measure has been updated");
                    break;
                case "vitamin_d3" :
                    bt.setVitamin_d3(value);
                    bt.setVitamin_d3_level();
                    update = "UPDATE bloodtest SET vitamin_d3 ='"+value+"', vitamin_d3_level='"+bt.getVitamin_d3_level()+"' WHERE bloodtest_id = '"+id+"'";
                    stmt.executeUpdate(update);
                    ret.put("success" , "The measure has been updated");
                    break;
                case "vitamin_b12" :
                    bt.setVitamin_b12(value);
                    bt.setVitamin_b12_level();
                    update = "UPDATE bloodtest SET vitamin_b12 ='"+value+"', vitamin_b12_level='"+bt.getVitamin_b12_level()+"' WHERE bloodtest_id = '"+id+"'";
                    stmt.executeUpdate(update);
                    ret.put("success" , "The measure has been updated");
                    break;
                default:
                    ret.put("error", "Error in test measure");
                    response.setStatus(403);
            }
        }catch (Exception e){
            e.printStackTrace();
            ret.put("error" , "This BloodTestId does not correspond to any test");
            response.setStatus(403);
            out1.println(ret);
        }
        response.setStatus(200);
        out1.println(ret);
    }
}
