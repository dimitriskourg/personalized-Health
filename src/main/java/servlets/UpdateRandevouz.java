package servlets;

import database.tables.EditRandevouzTable;
import mainClasses.JSON_Converter;
import org.json.JSONObject;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

@WebServlet(name = "UpdateRandevouz", value = "/UpdateRandevouz")
public class UpdateRandevouz extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out1 = response.getWriter();
        JSONObject ret = new JSONObject();
        JSON_Converter converter = new JSON_Converter();
        JSONObject jo = new JSONObject(converter.getJSONFromAjax(request.getReader()));
        EditRandevouzTable randevouzTable = new EditRandevouzTable();

        int id = jo.getInt("id");
        String action = jo.getString("action");

        try {
            randevouzTable.updateRandevouz(id,action);
            ret.put("success","randevouz updated");
            response.setStatus(200);
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            ret.put("error","unexpected error in sql base");
            response.setStatus(403);
        }
        System.out.println(ret);
        out1.println(ret);
    }
}
