package servlets;

import database.tables.EditBloodTestTable;
import mainClasses.JSON_Converter;
import org.json.JSONObject;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

@WebServlet(name = "DeleteBloodtest", value = "/DeleteBloodtest")
public class DeleteBloodtest extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out1 = response.getWriter();
        JSON_Converter converter = new JSON_Converter();
        JSONObject front_end = new JSONObject(converter.getJSONFromAjax(request.getReader()));
        EditBloodTestTable table = new EditBloodTestTable();
        JSONObject ret = new JSONObject();
        int id = front_end.getInt("bloodtest_id");
        try {
            if (null == table.databaseToBloodTestWithId(id)){
                ret.put("error","bloodtest with given id doesnt exist");
                response.setStatus(403);
                out1.println(ret);
                return;
            }


            table.deleteBloodTest(id);
            ret.put("success","bloodtest deleted");
            response.setStatus(200);
            out1.println(ret);
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            ret.put("error","internal error");
            response.setStatus(403);
            out1.println(ret);
        }

    }
}
