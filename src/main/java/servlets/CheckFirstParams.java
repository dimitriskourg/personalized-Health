package servlets;

import database.DB_Connection;
import mainClasses.JSON_Converter;
import org.json.JSONObject;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

@WebServlet(name = "CheckFirstParams", value = "/CheckFirstParams")
public class CheckFirstParams extends HttpServlet {
//    @Override
//    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException , SQLException, ClassNotFoundException{
//
//    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{

        JSON_Converter converter = new JSON_Converter();
        JSONObject jo = new JSONObject(converter.getJSONFromAjax(request.getReader()));
        JSONObject ret = new JSONObject();
        PrintWriter out1 = response.getWriter();
        String type = jo.getString("type");
        String info = jo.getString("info");
        try {
            System.out.println(info);
            Connection con = DB_Connection.getConnection();
            Statement stmt = con.createStatement();
            ResultSet rs;
            rs = stmt.executeQuery("SELECT * FROM users WHERE "+type + " = '" + info + "'");
            if (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                System.out.println(json);
                response.setStatus(403);
                ret.put("error", "This " +type+ " already exists");
            }
            rs = stmt.executeQuery("SELECT * FROM doctors WHERE " +type+" = '" + info + "'");
            if (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                System.out.println(json);
                ret.put("error", "This " +type+ " already exists");
            }
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        out1.println(ret);
    }
}
